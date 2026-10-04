# 考公小助手 · 自建后端（FastAPI + SQLite）
# 契约（与小程序端 src/services/request.ts 注释一致）：
#   POST /auth/login              {code, register} → {role, openid, token}（注册制：首次选择决定建档角色）
#   POST /auth/upgrade            guest → user 转正（Bearer guest token）
#   POST /auth/dev-login          {account, password} 演示账号登录（开发期临时，上线前删除，见 config.DEV_ACCOUNTS）
#   GET  /data/snapshot           全域快照（user 才有；guest 恒 null 不落库）
#   PUT  /data/keys               批量写 [{key,value,ts}]（另兼容 PUT /data/keys/{key} 单写）
#   GET  /tasks                   可见任务定义    GET /grants  已发放券（增量 ?since=）
#   GET  /proxy/weather|geocode|hitokoto|poi   POST /proxy/ai/chat /proxy/subscribe
#   GET  /proxy/subscribe/status               订阅额度查询（设置-服务通知页）
#   /admin/*                      B 端管理（X-Admin-Token）：users / stats / tasks / grant / import
# 启动：uvicorn main:app --host 127.0.0.1 --port 8000
import asyncio
import hashlib
import json
import time
import uuid
from datetime import date, datetime, timedelta
from typing import Annotated

from fastapi import Body, Depends, FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

import config
import security
import upstream
from db import SessionLocal, init_db
from models import Grant, Subscription, Task, User, UserData, Visit

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


def now_ms() -> int:
    return int(time.time() * 1000)


def today_str() -> str:
    return time.strftime('%Y-%m-%d')


def touch_visit(db: Session, openid: str) -> None:
    """日活去重记录：当日已有则跳过（方言无关写法，sqlite/mysql 通用）"""
    day = today_str()
    if not db.get(Visit, (openid, day)):
        db.add(Visit(openid=openid, day=day))
        db.commit()


def grant_json(g: Grant) -> dict:
    return {'id': g.id, 'title': g.title, 'emoji': g.emoji, 'desc': g.description, 'grantedAt': g.granted_at}


@app.get('/healthz')
def healthz() -> dict:
    return {'ok': True, 'ts': now_ms()}


# ---------- 认证 ----------
class LoginReq(BaseModel):
    code: str
    register: bool = False  # true=「正式开始」建档 user；false=「试玩」建档 guest（有记录沿用原角色）


@app.post('/auth/login')
async def login(req: LoginReq, db: DbDep) -> dict:
    if config.WX_APPID and config.WX_APPSECRET:
        openid = await upstream.wx_code2session(req.code)
        if not openid:
            raise HTTPException(status_code=401, detail='登录凭证无效')
    else:
        # dev 模式（未配 AppSecret）：code 派生稳定伪 openid，便于本地联调
        openid = 'dev-' + hashlib.sha1(req.code.encode()).hexdigest()[:16]
    u = db.get(User, openid)
    if u is None:
        # 注册制：首次选择决定角色；老用户（换机/重装）沿用服务端已有角色
        u = User(openid=openid, role='user' if req.register else 'guest', created_at=now_ms())
        db.add(u)
    u.last_seen_at = now_ms()
    db.commit()
    touch_visit(db, openid)
    print(f'[login] openid={openid} role={u.role} register={req.register}', flush=True)
    return {'role': u.role, 'openid': openid, 'token': security.make_token(openid)}


@app.post('/auth/upgrade')
def upgrade(db: DbDep, openid: AuthDep) -> dict:
    """游客转正：users 记录改 role=user；沙盒数据由前端随后 PUT /data/keys 全量上传"""
    u = db.get(User, openid)
    if not u:
        raise HTTPException(status_code=404, detail='账号不存在')
    u.role = 'user'
    u.last_seen_at = now_ms()
    db.commit()
    touch_visit(db, openid)
    return {'role': 'user', 'openid': openid, 'token': security.make_token(openid)}


# ==== 开发期临时：演示账号登录（上线前删除本段 + config.DEV_ACCOUNTS + 前端 DevAccountPanel） ====
class DevLoginReq(BaseModel):
    account: str
    password: str


@app.post('/auth/dev-login')
def dev_login(req: DevLoginReq, db: DbDep) -> dict:
    """账号密码登录预置演示账号：openid 用 dev-acct- 前缀与微信身份完全隔离，role=user 数据真实落库。
    不计日活（避免污染 B 端统计）；账号字典为空即整体禁用。"""
    if not config.DEV_ACCOUNTS or config.DEV_ACCOUNTS.get(req.account) != req.password:
        raise HTTPException(status_code=403, detail='账号或密码错误')
    openid = 'dev-acct-' + hashlib.sha1(req.account.encode()).hexdigest()[:16]
    u = db.get(User, openid)
    if u is None:
        u = User(openid=openid, role='user', nickname='演示账号', created_at=now_ms())
        db.add(u)
    u.last_seen_at = now_ms()
    db.commit()
    print(f'[dev-login] openid={openid} account={req.account}', flush=True)
    return {'role': u.role, 'openid': openid, 'nickname': u.nickname, 'token': security.make_token(openid)}


# ---------- 数据（user 落库；guest 随写随弃） ----------
class WriteOp(BaseModel):
    key: str
    value: object
    ts: int


@app.get('/data/snapshot')
def snapshot(db: DbDep, openid: AuthDep) -> dict:
    u = db.get(User, openid)
    if not u or u.role != 'user':
        return {'snapshot': None}
    touch_visit(db, openid)
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
    u = db.get(User, openid)
    if not u or u.role != 'user':
        return {'ok': True, 'discarded': True}  # guest：接受但不落库
    for op in ops:
        row = db.get(UserData, (openid, op.key))
        if row:
            row.value = json.dumps(op.value, ensure_ascii=False)
            row.ts = op.ts
        else:
            db.add(UserData(openid=openid, key=op.key, value=json.dumps(op.value, ensure_ascii=False), ts=op.ts))
    db.commit()
    touch_visit(db, openid)
    return {'ok': True}


class WriteOneReq(BaseModel):
    value: object
    ts: int = 0


@app.put('/data/keys/{key}')
def write_key(key: str, body: WriteOneReq, db: DbDep, openid: AuthDep) -> dict:
    return write_keys([WriteOp(key=key, value=body.value, ts=body.ts)], db, openid)


# ---------- 奖励（任务定义 + 发放记录） ----------
def task_json(t: Task) -> dict:
    return {
        'id': t.id, 'title': t.title, 'emoji': t.emoji, 'desc': t.description,
        'condType': t.cond_type, 'condParam': t.cond_param, 'mode': t.mode, 'hidden': t.hidden,
    }


@app.get('/tasks')
def tasks(db: DbDep, openid: AuthDep) -> list:
    """该用户可见任务：active 且（全员 或 指定含该 openid）"""
    rows = db.execute(select(Task).where(Task.active == True)).scalars().all()  # noqa: E712
    out = []
    for t in rows:
        if t.scope == 'users':
            targets = json.loads(t.target_openids or '[]')
            if openid not in targets:
                continue
        out.append(task_json(t))
    return out


@app.get('/grants')
def grants(db: DbDep, openid: AuthDep, since: int = 0) -> list:
    u = db.get(User, openid)
    if not u or u.role != 'user':
        return []
    rows = db.execute(
        select(Grant).where(Grant.openid == openid, Grant.granted_at > since).order_by(Grant.granted_at)
    ).scalars().all()
    return [grant_json(g) for g in rows]


# ---------- B 端管理（ADMIN_TOKEN 保护） ----------
def require_admin(x_admin_token: Annotated[str, Header()] = '') -> None:
    if not config.ADMIN_TOKEN or x_admin_token != config.ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail='管理口令错误')


AdminDep = Annotated[None, Depends(require_admin)]

APP_DATA_KEYS = {
    'settings', 'foods', 'budget', 'foodLog', 'exams', 'courses', 'checkinItems', 'checkins',
    'moods', 'rewards', 'todos', 'ledger', 'periodic', 'dates', 'notes', 'threeThings', 'dayLogs', 'pomodoroLogs',
    'quizBook', 'ledgerCats',
}


def load_user_data(db: Session, openid: str) -> dict:
    rows = db.execute(select(UserData).where(UserData.openid == openid)).scalars().all()
    out = {}
    for r in rows:
        try:
            out[r.key] = json.loads(r.value)
        except Exception:
            pass
    return out


def load_all_user_data(db: Session) -> dict[str, dict]:
    """全量 user_data 分组（统计/用户列表用；用户量小，内存现场算）"""
    rows = db.execute(select(UserData)).scalars().all()
    out: dict[str, dict] = {}
    for r in rows:
        try:
            out.setdefault(r.openid, {})[r.key] = json.loads(r.value)
        except Exception:
            pass
    return out


# ---- 打卡派生指标（与 C 端 utils/streak.ts 口径一致） ----
def _item_done(item: dict, checked: set) -> bool:
    children = item.get('children') or []
    if children:
        return all(c.get('id') in checked for c in children)
    return item.get('id') in checked


def _day_full(checkins_d: dict, items: list, day: str) -> bool:
    checked = set(checkins_d.get(day) or [])
    return bool(items) and all(_item_done(it, checked) for it in items)


def calc_streak(checkins_d: dict, items: list) -> int:
    """连续全勤天数；今天没打不清零（从昨天起算）"""
    if not items:
        return 0
    d = date.today()
    if not _day_full(checkins_d, items, d.isoformat()):
        d -= timedelta(days=1)
    streak = 0
    while _day_full(checkins_d, items, d.isoformat()):
        streak += 1
        d -= timedelta(days=1)
    return streak


def _exam_label(exams: list) -> str | None:
    """目标考试：最早一场未过期考试"""
    today = today_str()
    upcoming = [e for e in exams if e.get('date', '9999-12-31') >= today]
    if not upcoming:
        return None
    e = min(upcoming, key=lambda x: x.get('date', '9999-12-31'))
    mapping = {'civil': '公考', 'cet': '四六级', 'kaoyan': '考研', 'teacher': '教资', 'final': '期末'}
    return mapping.get(e.get('templateType') or '', '其他')


def user_summary(u: User, data: dict) -> dict:
    checkins_d = data.get('checkins') or {}
    items = data.get('checkinItems') or []
    pomo = data.get('pomodoroLogs') or []
    settings = data.get('settings') or {}
    return {
        'openid': u.openid,
        'role': u.role,
        'nickname': u.nickname or '',
        'selfNickname': settings.get('nickname') or '',
        'lastSeenAt': u.last_seen_at,
        'createdAt': u.created_at,
        'streak': calc_streak(checkins_d, items),
        'focusTotal': sum(p.get('minutes', 0) for p in pomo),
        'exam': _exam_label(data.get('exams') or []),
    }


@app.get('/admin/users')
def admin_users(db: DbDep, _: AdminDep, q: str = '') -> list:
    users = db.execute(select(User).order_by(User.last_seen_at.desc())).scalars().all()
    all_data = load_all_user_data(db)
    out = []
    for u in users:
        if q and q not in u.openid and q not in (u.nickname or ''):
            continue
        out.append(user_summary(u, all_data.get(u.openid, {})))
    return out


class UserPatchReq(BaseModel):
    nickname: str | None = None
    role: str | None = None


@app.put('/admin/users/{openid}')
def admin_patch_user(openid: str, req: UserPatchReq, db: DbDep, _: AdminDep) -> dict:
    u = db.get(User, openid)
    if not u:
        raise HTTPException(status_code=404, detail='用户不存在')
    if req.nickname is not None:
        u.nickname = req.nickname
    if req.role in ('user', 'guest'):
        u.role = req.role
    db.commit()
    return {'ok': True}


@app.get('/admin/users/{openid}/data')
def admin_user_data(openid: str, db: DbDep, _: AdminDep) -> dict:
    """该用户全量明细（B 端详情页现场渲染；含账本/心情明细——主理人自用）"""
    u = db.get(User, openid)
    if not u:
        raise HTTPException(status_code=404, detail='用户不存在')
    data = load_user_data(db, openid)
    return user_summary(u, data) | {'data': data}


@app.get('/admin/stats')
def admin_stats(db: DbDep, _: AdminDep, days: int = 30) -> dict:
    """看板聚合：内存全量计算，用户量级小秒出"""
    users = db.execute(select(User)).scalars().all()
    all_data = load_all_user_data(db)
    today = today_str()
    now = now_ms()

    # ---- 人气 ----
    total = len(users)
    user_cnt = sum(1 for u in users if u.role == 'user')
    new7 = sum(1 for u in users if now - u.created_at < 7 * 86400_000)
    daily: dict[str, int] = {}
    for v in db.execute(select(Visit)).scalars().all():
        daily[v.day] = daily.get(v.day, 0) + 1
    d = date.today()
    daily_active = []
    for _ in range(days):
        ds = d.isoformat()
        daily_active.append({'day': ds, 'count': daily.get(ds, 0)})
        d -= timedelta(days=1)
    daily_active.reverse()

    # ---- 学习 / 生活 / 备考（仅正式用户有数据域） ----
    checkin_rates, streaks, focus_dailies, moods_all, waters = [], [], [], [], []
    three_done = three_total = 0
    review_mastered = review_total = 0
    exam_dist: dict[str, int] = {}
    heat: dict[str, int] = {}
    issued, used = 0, 0
    for u in users:
        if u.role != 'user':
            continue
        data = all_data.get(u.openid, {})
        checkins_d = data.get('checkins') or {}
        items = data.get('checkinItems') or []
        # 打卡完成率（今日）
        if items:
            checked = set(checkins_d.get(today) or [])
            checkin_rates.append(sum(1 for it in items if _item_done(it, checked)) / len(items))
        streaks.append(calc_streak(checkins_d, items))
        # 近 12 周打卡人数热力（当日有任何打卡记录即计 1 人）
        for day in checkins_d:
            if checkins_d[day]:
                heat[day] = heat.get(day, 0) + 1
        # 专注日均（近 30 天分钟数 / 30）
        pomo = data.get('pomodoroLogs') or []
        cut = (date.today() - timedelta(days=30)).isoformat()
        focus_dailies.append(sum(p.get('minutes', 0) for p in pomo if p.get('date', '') >= cut) / 30)
        # 三件事完成率（近 7 天）
        tt = data.get('threeThings') or {}
        cut7 = (date.today() - timedelta(days=7)).isoformat()
        for day, entry in tt.items():
            if day >= cut7:
                for it in entry.get('items') or []:
                    three_total += 1
                    three_done += 1 if it.get('done') else 0
        # 复习掌握率（参与复习的笔记中 reviewStep=5 占比）
        for n in data.get('notes') or []:
            if n.get('nextReviewDate') is not None:
                review_total += 1
                review_mastered += 1 if n.get('reviewStep', 0) >= 5 else 0
        # 心情（近 7 天均值）
        md = data.get('moods') or {}
        moods_all += [m['mood'] for day, m in md.items() if day >= cut7 and isinstance(m, dict) and m.get('mood')]
        # 喝水（近 7 天日均杯数）
        dl = data.get('dayLogs') or {}
        waters.append(sum(len((e or {}).get('water') or []) for day, e in dl.items() if day >= cut7) / 7)
        # 目标考试分布
        label = _exam_label(data.get('exams') or [])
        if label:
            exam_dist[label] = exam_dist.get(label, 0) + 1
        # 发券统计（grant- 前缀为 B 端直发同步项，与 grants 表重复，排除避免双计）
        for r in data.get('rewards') or []:
            if r.get('granted') and not str(r.get('id', '')).startswith('grant-'):
                issued += 1
            if r.get('used'):
                used += 1

    grant_rows = db.execute(select(Grant)).scalars().all()

    def _avg(arr) -> float:
        return round(sum(arr) / len(arr), 1) if arr else 0

    return {
        'totalUsers': total,
        'userCount': user_cnt,
        'todayActive': daily.get(today, 0),
        'new7': new7,
        'upgradeRate': round(user_cnt / total, 3) if total else 0,
        'dailyActive': daily_active,
        'heat': sorted(heat.items())[-84:],
        'metrics': {
            'checkinRate': _avg(checkin_rates),
            'avgStreak': _avg(streaks),
            'focusDaily': _avg(focus_dailies),
            'threeRate': round(three_done / three_total, 3) if three_total else 0,
            'reviewRate': round(review_mastered / review_total, 3) if review_total else 0,
        },
        'examDist': exam_dist,
        'avgMood': _avg(moods_all),
        'avgWater': _avg(waters),
        'grants': {'issued': issued + len(grant_rows), 'used': used},
    }


class ImportReq(BaseModel):
    openid: str
    data: dict


@app.post('/admin/import')
def admin_import(req: ImportReq, db: DbDep, _: AdminDep) -> dict:
    """旧 PWA 数据导入：顶层键 ∈ 18 域白名单，逐域覆盖写 user_data"""
    u = db.get(User, req.openid)
    if not u:
        raise HTTPException(status_code=404, detail='目标用户不存在（需先完成「正式开始」注册）')
    keys = [k for k in req.data if k in APP_DATA_KEYS]
    for k in keys:
        row = db.get(UserData, (req.openid, k))
        val = json.dumps(req.data[k], ensure_ascii=False)
        if row:
            row.value, row.ts = val, now_ms()
        else:
            db.add(UserData(openid=req.openid, key=k, value=val, ts=now_ms()))
    db.commit()
    return {'ok': True, 'keys': len(keys)}


# ---- 任务管理 ----
TASK_SEED = [
    ('rw-milk-tea', '奶茶自由券', '🧋', '任意品牌任意杯型，加料全糖随你', 'streak', 3, 'auto', False),
    ('rw-cart', '购物车清空券', '🛒', '购物车里挑一件，我来买单', 'streak', 5, 'auto', False),
    ('rw-movie', '电影之夜券', '🎬', '选你想看的，爆米花我负责', 'streak', 7, 'auto', False),
    ('rw-sleep', '懒觉保护券', '😴', '不用早起的早晨，帮你挡掉所有打扰', 'streak', 10, 'auto', False),
    ('rw-massage', '肩颈按摩券', '💆', '备考肩颈僵硬救急：一次专业按摩，费用我包', 'streak', 15, 'auto', False),
    ('rw-blind', '惊喜盲盒券', '🎁', '保持神秘，到时你就知道了', 'streak', 20, 'auto', False),
    ('rw-hidden-weekend', '零食大礼包', '🍫', '周末双满勤的隐藏彩蛋', 'weekend_full', 0, 'code', True),
    ('rw-hidden-mood', '心情晴天惊喜', '🌈', '连续 3 天心情很好解锁', 'mood3', 3, 'code', True),
    ('rw-hidden-pomo', '甜品补给', '🍰', '单日专注满 3 个番茄解锁', 'pomo_day', 3, 'code', True),
    ('rw-hidden-30', '大额心愿券', '💎', '累计 30 天全勤解锁', 'total_full', 30, 'code', True),
]


class TaskReq(BaseModel):
    title: str
    emoji: str = '🎁'
    desc: str = ''
    condType: str = 'streak'
    condParam: int = 0
    mode: str = 'auto'
    hidden: bool = False
    scope: str = 'all'
    targetOpenids: list[str] = []


class TaskEditReq(BaseModel):
    """部分更新：仅传要改的字段（active 单独传即可只切换上下架）"""

    title: str | None = None
    emoji: str | None = None
    desc: str | None = None
    condType: str | None = None
    condParam: int | None = None
    mode: str | None = None
    hidden: bool | None = None
    scope: str | None = None
    targetOpenids: list[str] | None = None
    active: bool | None = None


@app.get('/admin/tasks')
def admin_tasks(db: DbDep, _: AdminDep) -> list:
    rows = db.execute(select(Task).order_by(Task.created_at.desc())).scalars().all()
    # 达成人数：扫全体 user_data.rewards 按 claimed 计数
    achieved: dict[str, int] = {}
    for data in load_all_user_data(db).values():
        for r in data.get('rewards') or []:
            if r.get('claimed'):
                achieved[r.get('id', '')] = achieved.get(r.get('id', ''), 0) + 1
    out = []
    for t in rows:
        out.append(task_json(t) | {
            'scope': t.scope,
            'targetOpenids': json.loads(t.target_openids or '[]'),
            'active': t.active,
            'createdAt': t.created_at,
            'achievedCount': achieved.get(t.id, 0),
        })
    return out


@app.post('/admin/tasks')
def admin_add_task(req: TaskReq, db: DbDep, _: AdminDep) -> dict:
    t = Task(
        id='task-' + uuid.uuid4().hex[:12], title=req.title, emoji=req.emoji, description=req.desc,
        cond_type=req.condType, cond_param=req.condParam, mode=req.mode, hidden=req.hidden,
        scope=req.scope, target_openids=json.dumps(req.targetOpenids), active=True, created_at=now_ms(),
    )
    db.add(t)
    db.commit()
    return {'ok': True, 'id': t.id}


@app.put('/admin/tasks/{tid}')
def admin_edit_task(tid: str, req: TaskEditReq, db: DbDep, _: AdminDep) -> dict:
    t = db.get(Task, tid)
    if not t:
        raise HTTPException(status_code=404, detail='任务不存在')
    if req.title is not None:
        t.title = req.title
    if req.emoji is not None:
        t.emoji = req.emoji
    if req.desc is not None:
        t.description = req.desc
    if req.condType is not None:
        t.cond_type = req.condType
    if req.condParam is not None:
        t.cond_param = req.condParam
    if req.mode is not None:
        t.mode = req.mode
    if req.hidden is not None:
        t.hidden = req.hidden
    if req.scope is not None:
        t.scope = req.scope
    if req.targetOpenids is not None:
        t.target_openids = json.dumps(req.targetOpenids)
    if req.active is not None:
        t.active = req.active
    db.commit()
    return {'ok': True}


@app.delete('/admin/tasks/{tid}')
def admin_del_task(tid: str, db: DbDep, _: AdminDep) -> dict:
    t = db.get(Task, tid)
    if t:
        db.delete(t)
        db.commit()
    return {'ok': True}


# ---- 直接发券 ----
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


@app.get('/admin/grants')
def admin_grants(db: DbDep, _: AdminDep) -> list:
    rows = db.execute(select(Grant).order_by(Grant.granted_at.desc())).scalars().all()
    return [grant_json(g) | {'openid': g.openid} for g in rows]


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
    results = await upstream.search_cities(q)
    if results:
        return results
    # 地理库没命中（错别字/口语写法）→ GLM 解析归属 + 精确经纬度
    return await upstream.ai_geocode(q)


@app.get('/proxy/hitokoto')
async def proxy_hitokoto(openid: AuthDep) -> dict:
    return {'text': await upstream.hitokoto()}


@app.get('/proxy/poi')
async def proxy_poi(openid: AuthDep, lat: float, lon: float, keyword: str = '', radius: int = 1000) -> list:
    """附近美食 POI（腾讯位置服务周边搜索）"""
    return await upstream.poi_around(lat, lon, keyword, radius)


class ChatReq(BaseModel):
    messages: list[dict]
    stream: bool = False


@app.post('/proxy/ai/chat')
async def proxy_chat(req: ChatReq, openid: AuthDep):
    if req.stream:
        # 流式直出：text/plain 分块 + 关闭 Nginx 缓冲，客户端逐段上屏
        return StreamingResponse(
            upstream.glm_chat_stream(req.messages),
            media_type='text/plain; charset=utf-8',
            headers={'X-Accel-Buffering': 'no', 'Cache-Control': 'no-cache'},
        )
    return {'text': await upstream.glm_chat(req.messages)}


# ---------- 一次性订阅消息（个人主体无长期订阅：接受 +1 / 下发成功 -1） ----------
class SubscribeReq(BaseModel):
    tmplIds: list[str]


@app.post('/proxy/subscribe')
def proxy_subscribe(req: SubscribeReq, db: DbDep, openid: AuthDep) -> dict:
    """额度上报：前端 requestSubscribeMessage 接受的模板，每个 count += 1（次数累积）"""
    # 去重：两场景共用同一模板时前端可能重复上报，避免一次 +2 多计额度
    for tid in dict.fromkeys(t.strip() for t in req.tmplIds if t.strip()):
        row = db.get(Subscription, (openid, tid))
        if row is None:
            db.add(Subscription(openid=openid, tmpl_id=tid, count=1))
        else:
            row.count += 1
    db.commit()
    return {'ok': True}


@app.get('/proxy/subscribe/status')
def proxy_subscribe_status(db: DbDep, openid: AuthDep) -> dict:
    """订阅额度查询：各模板剩余可推送次数（设置-服务通知页展示用）"""
    rows = db.execute(select(Subscription).where(Subscription.openid == openid)).scalars().all()
    return {'quota': {r.tmpl_id: r.count for r in rows if r.count > 0}}


REMIND_HOUR, REMIND_MINUTE = 7, 30


def _thing(s) -> str:
    """订阅消息 thing 字段限 20 字符"""
    return str(s or '').strip()[:20]


def _due_periodic(data: dict, today: str) -> list:
    """到期周期待办（口径与 C 端 periodic 页一致：距上次完成 >= everyDays 天）"""
    out = []
    for p in data.get('periodic') or []:
        try:
            since = (date.fromisoformat(today) - date.fromisoformat(str(p.get('lastDone')))).days
            if since >= int(p.get('everyDays') or 1):
                out.append(p)
        except Exception:
            continue
    return out


def _due_notes(data: dict, today: str) -> list:
    """今日待复习笔记（口径与 C 端 utils/review.isNoteDue 一致：排期日 <= 今天）"""
    out = []
    for n in data.get('notes') or []:
        ts = n.get('nextReviewDate')
        if not isinstance(ts, (int, float)):
            continue
        if time.strftime('%Y-%m-%d', time.localtime(ts / 1000)) <= today:
            out.append(n)
    return out


def _due_dates(data: dict, today: str) -> list:
    """今日命中的重要日期提醒（口径与 C 端 dates 页一致：yearly 取最近一次；remindDays 0=当天、N=提前 N 天）"""
    out = []
    for d in data.get('dates') or []:
        days_list = {int(x) for x in (d.get('remindDays') or []) if str(x).strip().lstrip('-').isdigit()}
        date_str = str(d.get('date') or '')
        if not days_list or not date_str:
            continue
        try:
            if d.get('yearly'):
                # 与前端 nextOccurrence 一致：今年（月日）>= 今天 ? 今年 : 明年
                this_year = today[:4] + date_str[4:]
                target = this_year if this_year >= today else str(int(this_year[:4]) + 1) + date_str[4:]
            else:
                target = date_str
            diff = (date.fromisoformat(target) - date.fromisoformat(today)).days
            if diff >= 0 and diff in days_list:
                out.append({'name': d.get('name'), 'diff': diff})
        except Exception:
            continue
    return out


async def _remind_user(db: Session, openid: str, tmpl_id: str, page: str, data: dict) -> bool:
    """有额度才下发；下发成功扣一次额度（微信仅在下发成功时消耗订阅）"""
    if not tmpl_id:
        return False
    row = db.get(Subscription, (openid, tmpl_id))
    if row is None or row.count <= 0:
        return False
    if await upstream.subscribe_send(openid, tmpl_id, page, data):
        row.count -= 1
        return True
    return False


async def send_due_reminders() -> int:
    """扫全量用户数据下发到期提醒：周期待办/重要日期 → TMPL_TODO；今日复习 → TMPL_REVIEW"""
    if not (config.WX_APPID and config.WX_APPSECRET):
        return 0
    sent = 0
    db = SessionLocal()
    try:
        today = today_str()
        when = f'{today} {REMIND_HOUR:02d}:{REMIND_MINUTE:02d}'
        for openid, data in load_all_user_data(db).items():
            todos = _due_periodic(data, today)
            if todos:
                names = '、'.join(_thing(t.get('name')) for t in todos[:3])
                if await _remind_user(db, openid, config.TMPL_TODO, 'pages/periodic/index', {
                    'thing1': _thing(f'{names} 等 {len(todos)} 项' if len(todos) > 3 else names),
                    'time2': when,
                    'thing3': '周期待办到期，点开处理',
                }):
                    sent += 1
            dates_due = _due_dates(data, today)
            if dates_due:
                names = '、'.join(_thing(x.get('name')) for x in dates_due[:3])
                if await _remind_user(db, openid, config.TMPL_TODO, 'pages/dates/index', {
                    'thing1': _thing(f'{names} 等重要日子' if len(dates_due) > 3 else names),
                    'time2': when,
                    'thing3': '重要日期临近，点开看看',
                }):
                    sent += 1
            notes = _due_notes(data, today)
            if notes:
                if await _remind_user(db, openid, config.TMPL_REVIEW, 'pages/today/index', {
                    'thing1': _thing(f'今日 {len(notes)} 张闪卡待复习'),
                    'time2': when,
                    'thing3': '趁热打铁，记忆更牢',
                }):
                    sent += 1
        db.commit()
    finally:
        db.close()
    return sent


def _seconds_until_next_remind() -> float:
    now = datetime.now()
    target = now.replace(hour=REMIND_HOUR, minute=REMIND_MINUTE, second=0, microsecond=0)
    if target <= now:
        target += timedelta(days=1)
    return (target - now).total_seconds()


async def _subscribe_scheduler() -> None:
    """每天 07:30 下发一次到期提醒（异常不中断循环）"""
    while True:
        await asyncio.sleep(_seconds_until_next_remind())
        try:
            sent = await send_due_reminders()
            print(f'[subscribe] {today_str()} 定时下发 {sent} 条', flush=True)
        except Exception as e:
            print(f'[subscribe] 定时下发异常: {e}', flush=True)


# ---------- 启动 ----------
def seed_tasks(db: Session) -> None:
    if db.execute(select(Task).limit(1)).scalars().first() is None:
        for tid, title, emoji, desc, cond, param, mode, hidden in TASK_SEED:
            db.add(Task(id=tid, title=title, emoji=emoji, description=desc,
                        cond_type=cond, cond_param=param, mode=mode, hidden=hidden,
                        scope='all', target_openids='[]', active=True))
        db.commit()


@app.on_event('startup')
async def on_startup() -> None:
    init_db()
    db = SessionLocal()
    try:
        seed_tasks(db)
    finally:
        db.close()
    # 一次性订阅定时下发（每天 07:30；进程重启后从下一循环点继续）
    asyncio.create_task(_subscribe_scheduler())
