# 考公小助手 · 自建后端（FastAPI + MySQL）
# 契约（与小程序端 src/services/request.ts 注释一致）：
#   POST /auth/login              code → {role, openid, token}（白名单→user，陌生→guest 不落库）
#   GET  /data/snapshot           全域快照（user 才有；guest 恒 null 不落库）
#   PUT  /data/keys               批量写 [{key,value,ts}]（另兼容 PUT /data/keys/{key} 单写）
#   GET  /rewards                 奖池清单    GET /grants  已发放券
#   GET  /proxy/weather|geocode|hitokoto   POST /proxy/ai/chat
# 启动：uvicorn main:app --host 127.0.0.1 --port 8000
import hashlib
import json
import time
import uuid
from typing import Annotated

from fastapi import Body, Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

import config
import security
import upstream
from db import SessionLocal, init_db
from models import Grant, Reward, User, UserData

app = FastAPI(title='kaogong-api', docs_url=None, redoc_url=None)


# ---------- 基础设施 ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DbDep = Annotated[Session, Depends(get_db)]


def current_openid(authorization: Annotated[str, Header()] = '') -> str:
    token = authorization.removeprefix('Bearer ').strip()
    openid = security.parse_token(token) if token else None
    if not openid:
        raise HTTPException(status_code=401, detail='未登录或会话过期')
    return openid


AuthDep = Annotated[str, Depends(current_openid)]


def role_of(db: Session, openid: str) -> str:
    """角色判定：白名单或 users 表已有 user 记录 → user；其余 guest（不落库）"""
    if openid in config.USER_WHITELIST:
        return 'user'
    u = db.get(User, openid)
    return u.role if u else 'guest'


def grant_json(g: Grant) -> dict:
    return {'id': g.id, 'title': g.title, 'emoji': g.emoji, 'desc': g.description, 'grantedAt': g.granted_at}


@app.get('/healthz')
def healthz() -> dict:
    return {'ok': True, 'ts': int(time.time() * 1000)}


# ---------- 认证 ----------
class LoginReq(BaseModel):
    code: str


@app.post('/auth/login')
async def login(req: LoginReq, db: DbDep) -> dict:
    if config.WX_APPID and config.WX_APPSECRET:
        openid = await upstream.wx_code2session(req.code)
        if not openid:
            raise HTTPException(status_code=401, detail='登录凭证无效')
    else:
        # dev 模式（未配 AppSecret）：code 派生稳定伪 openid，便于本地联调
        openid = 'dev-' + hashlib.sha1(req.code.encode()).hexdigest()[:16]
    role = role_of(db, openid)
    if role == 'user' and not db.get(User, openid):
        db.add(User(openid=openid, role='user'))
        db.commit()
    return {'role': role, 'openid': openid, 'token': security.make_token(openid)}


# ---------- 数据（user 落库；guest 随写随弃） ----------
class WriteOp(BaseModel):
    key: str
    value: object
    ts: int


@app.get('/data/snapshot')
def snapshot(db: DbDep, openid: AuthDep) -> dict:
    if role_of(db, openid) != 'user':
        return {'snapshot': None}
    rows = db.execute(select(UserData).where(UserData.openid == openid)).scalars().all()
    snap = {}
    for r in rows:
        try:
            snap[r.key] = json.loads(r.value)
        except Exception:
            pass
    return {'snapshot': snap or None}


@app.put('/data/keys')
def write_keys(ops: Annotated[list[WriteOp], Body()], db: DbDep, openid: AuthDep) -> dict:
    if role_of(db, openid) != 'user':
        return {'ok': True, 'discarded': True}  # guest：接受但不落库
    for op in ops:
        row = db.get(UserData, (openid, op.key))
        if row:
            row.value = json.dumps(op.value, ensure_ascii=False)
            row.ts = op.ts
        else:
            db.add(UserData(openid=openid, key=op.key, value=json.dumps(op.value, ensure_ascii=False), ts=op.ts))
    db.commit()
    return {'ok': True}


class WriteOneReq(BaseModel):
    value: object
    ts: int = 0


@app.put('/data/keys/{key}')
def write_key(key: str, body: WriteOneReq, db: DbDep, openid: AuthDep) -> dict:
    return write_keys([WriteOp(key=key, value=body.value, ts=body.ts)], db, openid)


# ---------- 奖励（奖池清单 + 发放记录） ----------
@app.get('/rewards')
def rewards(db: DbDep, openid: AuthDep) -> list:
    rows = db.execute(select(Reward)).scalars().all()
    return [{'id': r.id, 'title': r.title, 'emoji': r.emoji, 'desc': r.description, 'grantedAt': 0} for r in rows]


@app.get('/grants')
def grants(db: DbDep, openid: AuthDep, since: int = 0) -> list:
    if role_of(db, openid) != 'user':
        return []
    rows = db.execute(
        select(Grant).where(Grant.openid == openid, Grant.granted_at > since).order_by(Grant.granted_at)
    ).scalars().all()
    return [grant_json(g) for g in rows]


# ---------- B 端管理（ADMIN_TOKEN 保护） ----------
def require_admin(x_admin_token: Annotated[str, Header()] = '') -> None:
    if not config.ADMIN_TOKEN or x_admin_token != config.ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail='管理口令错误')


class GrantReq(BaseModel):
    openid: str
    title: str
    emoji: str = '🎁'
    desc: str = ''


@app.post('/admin/grant', dependencies=[Depends(require_admin)])
def admin_grant(req: GrantReq, db: DbDep) -> dict:
    g = Grant(id='g-' + uuid.uuid4().hex[:12], openid=req.openid, title=req.title, emoji=req.emoji, description=req.desc)
    db.add(g)
    db.commit()
    return {'ok': True, 'grant': grant_json(g)}


class RewardReq(BaseModel):
    id: str
    title: str
    emoji: str = '🎁'
    desc: str = ''


@app.post('/admin/rewards', dependencies=[Depends(require_admin)])
def admin_put_reward(req: RewardReq, db: DbDep) -> dict:
    r = db.get(Reward, req.id)
    if r:
        r.title, r.emoji, r.description = req.title, req.emoji, req.desc
    else:
        db.add(Reward(id=req.id, title=req.title, emoji=req.emoji, description=req.desc))
    db.commit()
    return {'ok': True}


@app.delete('/admin/rewards/{rid}', dependencies=[Depends(require_admin)])
def admin_del_reward(rid: str, db: DbDep) -> dict:
    r = db.get(Reward, rid)
    if r:
        db.delete(r)
        db.commit()
    return {'ok': True}


# ---------- 外部服务代理（API Key 全部服务端持有） ----------
@app.get('/proxy/weather')
async def proxy_weather(lat: float, lon: float, openid: AuthDep) -> dict:
    w = await upstream.get_weather(lat, lon)
    if not w:
        raise HTTPException(status_code=502, detail='天气获取失败')
    return w


@app.get('/proxy/geocode')
async def proxy_geocode(openid: AuthDep, q: str = '', lat: float | None = None, lon: float | None = None):
    if lat is not None and lon is not None:
        return await upstream.reverse_geocode(lat, lon)
    if not q:
        return []
    return await upstream.search_cities(q)


@app.get('/proxy/hitokoto')
async def proxy_hitokoto(openid: AuthDep) -> dict:
    return {'text': await upstream.hitokoto()}


class ChatReq(BaseModel):
    messages: list[dict]


@app.post('/proxy/ai/chat')
async def proxy_chat(req: ChatReq, openid: AuthDep) -> dict:
    return {'text': await upstream.glm_chat(req.messages)}


@app.on_event('startup')
def on_startup() -> None:
    init_db()
