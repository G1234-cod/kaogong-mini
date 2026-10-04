# 考公小助手 · 微信小程序

多用户考公备考生活助手：**微信小程序（C 端）+ 自建后端（FastAPI）+ 管理后台（B 端，Vue 3）**。

产品本质不是题库或知识学习工具，而是围绕备考生活的「督促 + 激励 + 事务」管家：倒计时督促、每日打卡、任务达成发奖励券、生活事务管理（待办 / 记账 / 番茄钟 / 心情 / 时政闪卡等）。

## 三端架构

```
┌─ C 端 小程序（Taro 4 + React）────┐      ┌─ 后端 FastAPI + SQLite ──────────┐      ┌─ B 端 Vue 3（静态托管）─┐
│ 首次打开：试玩 / 正式开始 二选一    │ HTTP │  /auth/login   静默登录+建档       │      │  看板（统计图表）        │
│ 正式用户：数据全量上云（乐观更新）  │◄────►│  /data/*       AppData 域同步      │◄────►│  用户列表/详情           │
│ 游客：本地沙盒，转正时打包上传      │      │  /tasks        任务定义（拉取合并） │      │  任务发布/发券           │
│ 唤起美团外卖：navigateToMiniProgram│      │  /proxy/*      天气/AI/一言 代理    │      │  备份/数据导入           │
└───────────────────────────────────┘      │  /admin/*      X-Admin-Token 保护  │      └────────────────────────┘
                                            │  API Key 全部仅存后端 env          │
                                            └──────────────────────────────────┘
```

- **账号体系**：openid 即账号，无密码无手机号；注册制无白名单，游客（试玩）数据只存本地沙盒，转正时由用户主动上传
- **数据同步**：注册用户数据全量上云，乐观更新 + 写队列重试，断网可用、联网补传
- **激励体系**：任务定义存服务端（B 端 CRUD），用户端达成判定与领奖，另有直接发券通道
- **外部服务**（天气 / 地理编码 / 一言 / GLM 智能问答）一律经后端代理，失败静默降级；API Key 只存服务端

## 功能一览（18 页）

| Tab / 页面 | 功能 |
|---|---|
| 🏠 今日 | 考试倒计时、复习闪卡、天气、一言、今日事项、三餐、喝水、睡眠、今日打卡 |
| 📚 课程 | 考试节点（模板自动识别）、录播课进度督促 |
| ✅ 打卡 | 父子打卡项、热力图、心情、奖励任务、奖券袋、盲盒 |
| 🌈 生活 | 七宫格入口：吃什么 / AI 对话 / 记账本 / 待办 / 时政 / 番茄钟 / 错题本等 |
| ⚙️ 设置 | 身份卡、角色预览、提醒 / 城市 / 账号 / 关于等子页 |
| 二级页 | 吃什么、AI 对话、记账本（+分类管理/高级搜索）、待办、日期、时政闪卡、番茄钟、心情史、专注史、提醒、错题本 |

## 技术栈

| 端 | 技术 |
|---|---|
| C 端小程序 | Taro 4.2 + React 18 + TypeScript（strict）+ Sass，designWidth=390 |
| 后端 | FastAPI + SQLAlchemy + SQLite（`DATABASE_URL` 可切 MySQL，代码零改动）+ httpx；HMAC 无状态 token |
| B 端后台 | Vue 3 + Vite + TypeScript + Tailwind CSS + ECharts |

## 目录结构

```
kaogong-mini/
├── src/            # 小程序源码（pages / components / services / store / utils）
├── config/         # Taro 构建配置
├── server/         # FastAPI 后端（main.py / models.py / security.py / deploy/）
├── admin/          # B 端管理后台（Vue 3）
├── doc/            # 项目文档（总览 / 账号体系 / 数据模型 / 功能说明 / API 契约 / 部署运维）
└── scripts/        # 开发辅助脚本
```

## 快速开始

### 小程序（C 端）

```bash
npm install
npm run dev:weapp     # 编译产物在 dist/，用微信开发者工具导入项目根目录预览
npm run typecheck     # 类型检查
```

### 后端

```bash
cd server
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # 填写 WX_APPID / WX_APPSECRET / GLM_API_KEY / SECRET_KEY / ADMIN_TOKEN 等
uvicorn main:app --reload --port 8000
```

`.env` 含密钥，已被 git 忽略，**不要提交**。

### 管理后台（B 端）

```bash
cd admin
npm install
npm run dev           # 本地开发预览
npm run build         # 产物为静态文件，可任意静态托管
```

## 文档

完整设计与契约见 [`doc/`](./doc/README.md)：

| 文档 | 内容 |
|---|---|
| [01-项目总览](./doc/01-项目总览.md) | 产品定位、三端角色、设计原则底线、页面结构 |
| [02-账号与身份体系](./doc/02-账号与身份体系.md) | 游客/正式用户、微信静默登录、转正上传、隐私合规 |
| [03-数据模型与同步](./doc/03-数据模型与同步.md) | 数据域、双 Transport、写队列、服务端表结构 |
| [04-功能说明](./doc/04-功能说明.md) | 各页面行为细节、跨页机制 |
| [05-任务与奖励体系](./doc/05-任务与奖励体系.md) | 任务定义 / 达成 / 发券 |
| [06-后端API契约](./doc/06-后端API契约.md) | 全部接口、表结构、上游代理、限流 |
| [07-B端管理后台](./doc/07-B端管理后台.md) | 后台页面与技术形态 |
| [08-部署与运维](./doc/08-部署与运维.md) | 服务器部署、systemd/nginx、备份、上线顺序 |
