# Shaoan 网站与智能错题整理系统

个人主页位于 `/`，错题系统位于 `/mistakes/`。当前实现开发规划的第 1 阶段：邀请码账号、手动录题、知识点归类、筛选与复习。支持数学、物理、英语，账号之间的数据独立保存。

## 本地运行

需要 Node.js 24。首次安装和构建：

```powershell
npm ci --cache ./data/.npm-cache
Copy-Item .env.example .env
npm run build
npm run admin:create
npm start
```

已有 `.env` 时保留现有配置。`admin:create` 按提示创建管理员，管理员登录后在“设置”中生成邀请码；每个邀请码仅可注册一个账号。

打开 `http://127.0.0.1:3000/mistakes/`，端口以 `.env` 中的 `PORT` 为准。Express 同时提供本地静态网页和 API。

修改前端时，先运行 `npm start` 启动后端，再在另一个终端运行 `npm run dev`，打开 `http://127.0.0.1:5173/mistakes/`。开发服务器将 `/api` 请求转发到配置的后端端口。

## 使用流程

1. 管理员生成邀请码，同学使用邀请码注册并登录。
2. 在“录入错题”填写学科、题干、知识点、答案解析与个人错因。主知识点和答案可以留空；未整理完的题目可保存为草稿。
3. 在“我的错题”按学科、知识点、掌握状态、关键词及归档状态筛选，进入详情修改或删除。
4. 在“复习”筛选并勾选已归档题目，先作答再展开答案，记录“不会／不熟／掌握”。掌握状态采用最近一次结果，无复习记录时显示“未复习”。
5. 在“学习统计”查看个人记录；知识点分布按主知识点计数。管理员还可在“设置”维护账号与知识点目录。

当前尚未接入图片裁剪、AI 识别与参考解析。初始知识点目录是可维护的起点，可以按实际课程调整。

## 目录与验证

- `client/mistakes/`：React + TypeScript 源码，Hash 路由。
- `public/mistakes/`：Vite 构建结果，`base` 为 `/mistakes/`。
- `server/mistakes/`：数据库、认证、错题、复习和管理 API。
- `data/mistakes.sqlite`：运行数据库，使用 WAL，不纳入 Git。
- `uploads/`：为后续图片功能保留，运行文件不纳入 Git。
- `docs/development.md`：本次任务完成状态与验证记录。

```powershell
npm run build
node --check server/app.js
npm test
```

`npm run build` 包含前端类型检查。`npm test` 运行 `scripts/mistakes-smoke.cjs`，使用临时数据库检查邀请码、双账号隔离、错题增删改查、复习与统计，结束后清理临时数据。页面改动另做一次电脑及手机宽度的浏览器检查。

## 服务器运行

构建后，将 `public/` 作为网站静态根目录，Node 服务继续监听 `127.0.0.1`。Nginx 将同域 API 转发到后端：

```nginx
location /api/mistakes/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

生产环境配置 `NODE_ENV=production` 并使用 HTTPS；会话 Cookie 使用 HttpOnly、SameSite=Lax，生产环境启用 Secure。后端目录、`.env`、`data/` 和 `uploads/` 位于静态目录之外。数据库路径可通过 `MISTAKES_DB_PATH` 调整，默认为仓库的 `data/mistakes.sqlite`。备份时同时保留 SQLite 数据库及其 WAL 状态，或先停止服务再复制数据库。
