# 06 · 后端 API 契约

> 后端代码：`server/`（FastAPI + SQLAlchemy + SQLite，单文件分模块：config/db/models/security/upstream/main）。部署与 systemd/nginx 见 [08](./08-部署与运维.md)。

## 通用约定

- **鉴权**：用户接口 `Authorization: Bearer <token>`（HMAC 无状态，180 天，`security.make_token/parse_token`）；管理接口 `X-Admin-Token: <ADMIN_TOKEN>`（单管理员，无 B 端账号体系）
- **响应格式**：直接返回裸 JSON，错误用 HTTP 状态码 + `{"detail": "中文说明"}`（FastAPI HTTPException）。~~迁移方案文档原设想的 `/api/v1` 前缀 + `{code:0,data,msg}` 包裹~~ **以当前骨架实现为准**，不引入包裹层（简化前端解析；若未来需要再统一加）
- **角色判定**：login `register` 参数决定建档（`true`→role=user，`false`→guest 落 users 记录）；白名单 env 已删除（注册制，无名单）
- **限流**（待实现）：内存滑动窗口按 openid 限 `/proxy/*` 与 `/auth/login`（每用户每分钟 N 次），防陌生用户刷爆 Open-Meteo/GLM 免费额度；超限 429
- **错误码**：401 未登录/会话过期（前端捕获后静默重登）｜403 管理口令错误｜404 资源不存在｜429 请求过频｜502 上游服务失败（前端静默降级本地兜底）

## 现有接口（已实现，main.py）

| 方法/路径 | 鉴权 | 入参 | 出参/行为 |
|-----------|------|------|-----------|
| GET `/healthz` | 无 | — | `{ok, ts}` 存活探测 |
| POST `/auth/login` | 无 | `{code, register}` | code2Session（未配 AppSecret 时 dev 模式：code 派生伪 openid）→ `register:true` 无记录建档 role=user、有记录沿用原角色；`register:false` guest 落 users 记录 → `{role, openid, token}`；打印 `[login]` 审计日志 |
| POST `/auth/upgrade` | Bearer(guest) | — | guest → user：users 记录改 role，返回新 token；前端随后沙盒数据全量 `PUT /data/keys` 上传 |
| GET `/data/snapshot` | Bearer | — | `{snapshot: AppData 各域 | null}`；guest 恒 null |
| PUT `/data/keys` | Bearer | `[{key, value, ts}]` 批量 | 逐域 upsert `user_data`；guest 返回 `{ok, discarded:true}` 接受不落库 |
| PUT `/data/keys/{key}` | Bearer | `{value, ts}` | 单写（内部转批量） |
| GET `/tasks` | Bearer | — | 下发该用户可见任务 `[{id,title,emoji,desc,condType,condParam,mode,hidden}]`（active 且 scope 命中；tasks 表空自动 seed 10 项） |
| GET `/grants` | Bearer | `?since=` | 个人发放券增量 `[{id,title,emoji,desc,grantedAt}]`，`grantedAt > since`（guest 返回 []） |
| POST `/admin/grant` | Admin | `{openid, title, emoji?, desc?}` | 发券给指定用户 → grants 表 |
| GET `/admin/grants` | Admin | — | 发放流水（含 openid）`[{id,openid,title,emoji,desc,grantedAt}]` |
| GET `/proxy/weather` | Bearer | `?lat&lon` | Open-Meteo 代理 → `{temp,feels,humidity,code,desc,tMax,tMin,rainProb,fetchedAt}`；失败 502 |
| GET `/proxy/geocode` | Bearer | `?q` 或 `?lat&lon` | 有坐标→BigDataCloud 反查；有 q→Open-Meteo 搜索，未命中走 **GLM 地名纠错解析**（错别字/口语兜底）→ `[{name,province,city,lat,lon}]` |
| GET `/proxy/hitokoto` | Bearer | — | `{text: "句——出处"}` |
| POST `/proxy/ai/chat` | Bearer | `{messages:[{role,content}]}` | GLM 转发 → `{text}`；Key 仅存后端 env |

**上游依赖（upstream.py）**：微信 code2Session、Open-Meteo（天气/地理编码，8s 超时）、BigDataCloud（坐标反查，免 Key）、一言、GLM（`open.bigmodel.cn`，30s 超时）；地理内存缓存 >200 条清空；`WEATHER_CODE` WMO 码→中文映射。**全部第三方 Key/GLM Key 只存服务器 env，永不下发**。

## 本轮新增接口（已实现）

### 账号体系（改造 + 新增）

| 方法/路径 | 鉴权 | 入参 | 出参/行为 |
|-----------|------|------|-----------|
| POST `/auth/login`（改造） | 无 | `{code, register: boolean}` | `register:true`：无记录建档 `role=user`，有记录沿用原角色（老用户续档）；`register:false`：guest 落 users 表一条记录（含 `last_seen_at` 更新），不建数据档。users 表加 `last_seen_at` 列 |
| POST `/auth/upgrade` | Bearer(guest) | — | guest → user：users 记录改 role，返回新 token；随后前端沙盒数据 `PUT /data/keys` 全量上传 |

### 任务体系（新增，详见 [05](./05-任务与奖励体系.md)）

| 方法/路径 | 鉴权 | 入参 | 出参/行为 |
|-----------|------|------|-----------|
| GET `/tasks` | Bearer | — | 下发该用户可见任务：`active=true` 且（`scope='all'` 或 `target_openids` 含该 openid）→ `[{id,title,emoji,desc,condType,condParam,mode,hidden}]`；启动时 tasks 表为空自动 seed 10 项预设 |
| GET `/admin/tasks` | Admin | — | 任务全量列表（含 inactive，带达成人数统计） |
| POST `/admin/tasks` | Admin | `{title,emoji,desc,condType,condParam,mode,hidden,scope,targetOpenids?}` | 发布任务 |
| PUT `/admin/tasks/{id}` | Admin | 同上可改 / `{active}` 单独下架 | 编辑/下架（下架不传播，用户端已合并的保留） |
| DELETE `/admin/tasks/{id}` | Admin | — | 物理删除（慎用；建议用 active=false） |

### B 端管理（新增）

| 方法/路径 | 鉴权 | 入参 | 出参/行为 |
|-----------|------|------|-----------|
| GET `/admin/users` | Admin | `?q=` 可选昵称/openid 过滤 | 用户列表 `[{openid, role, nickname, selfNickname, lastSeenAt, createdAt, streak, focusTotal, exam}]`（含 guest 到访记录） |
| PUT `/admin/users/{openid}` | Admin | `{nickname?, role?}` | 改备注昵称 / 手动改角色 |
| GET `/admin/users/{openid}/data` | Admin | — | 该用户全量明细（user_data 各域 JSON），B 端用户详情页用——**含账本/心情明细**（主理人明确要求不做遮蔽，见 [07](./07-B端管理后台.md) 决策记录） |
| GET `/admin/stats` | Admin | `?days=30` | 看板聚合（内存全量计算，秒出）：总用户/今日活跃/近N日新增/游客转正率/留存/打卡完成率/人均专注时长/三件事完成率/复习完成率/目标考试分布/平均心情/平均喝水/发券数——指标明细见 [07](./07-B端管理后台.md) |
| POST `/admin/import` | Admin | `{openid, data: AppData旧JSON}` | 旧 PWA 数据导入：校验顶层键 ∈ 18 域白名单 → 逐域写 `user_data`（覆盖式）→ `{ok, keys:n}`；用于 5 位存量用户迁移（见 [02](./02-账号与身份体系.md)） |

## 表结构汇总

见 [03](./03-数据模型与同步.md) 服务端表结构 + [05](./05-任务与奖励体系.md) tasks 表。表：`users`（含 `last_seen_at`）、`user_data`（openid+key 主键）、`tasks`、`grants`、`visits`（day 粒度到访计数，看板活跃用）。SQLite 单文件 `server/data.db`（`DATABASE_URL` 环境变量，可切 MySQL 零代码）；`init_db()` 启动建表（无 Alembic，字段变更手工 `ALTER TABLE` 幂等补列）。

## 与前端对接备忘

- 前端 `httpTransport.ts` 尚未启用（stub 阶段）：环境开关切换 `getTransport()`，两轨同签名
- 401 处理：`request.ts` 拦截 → 清 `kg-auth` → 静默重走登录链路（用户无感）
- guest 判定在服务端（discarded），前端**不得**依赖 role 做写拦截（双保险但服务端是权威）
