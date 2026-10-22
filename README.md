# ShaoanC 网站与智能错题整理系统

个人主页位于 `/`，错题系统位于 `/mistakes/`。支持邀请码账号、拍照/手动录题、AI 识别与解析、知识点归类、筛选与复习。支持数学、英语、物理、化学、生物、地理，账号之间的数据独立保存。

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
2. 在“录入错题”拍照或选择相册图片，裁剪后识别题干和知识点；答案可直接输入，也可拍照识别。所有文本支持 Markdown 和公式。未整理完的题目可保存为草稿。
3. 在“我的错题”按学科、知识点、掌握状态、关键词及归档状态筛选，进入详情修改或删除。关键词可搜索正文、学科和主辅知识点名称；命中关键词更多的题优先，并显示匹配摘要及高亮。清空搜索后恢复按更新时间排序。
4. 在“复习”筛选并勾选已归档题目，先作答再展开答案，记录“不会／不熟／掌握”。掌握状态采用最近一次结果，无复习记录时显示“未复习”。
5. 在“学习统计”查看个人记录；知识点分布按主知识点计数。管理员还可在“设置”维护账号与知识点目录。

管理员先在“设置 → AI 设置”配置 Gemini 原生接口、密钥和支持图片的模型。基础地址填写 `https://generativelanguage.googleapis.com/v1beta` 或兼容 Gemini 原生协议的代理；服务端自动拼接 `/models/{model}:generateContent`，通过 `x-goog-api-key` 发送密钥。已有 OpenAI 兼容 `/v1` 配置需由管理员改为 Gemini 原生地址、模型及对应密钥，原有配置键保持不变。图片可旋转、裁剪并按顺序识别；同一次请求完成转写和多配图定位。有疑点、配图或内容冲突时先校对，支持调整/补画选框、修改文字和配图位置，再生成独立截图填入。普通结果仍自动填入未修改的空白字段。短答案在保存或 OCR 填入后自动生成解析，解析会携带经归属校验的题干及答案本站配图；含待确认/待补充文字时暂缓自动解析。顶部“AI 任务”区分待校对与已填入，并保留原始结果。共享知识点由管理员维护，AI 新增分支只在应用时创建为个人知识点。完整说明见 [拍照录题与 AI 任务](docs/mistakes-photo-ai.md)。

## 目录与验证

- `client/mistakes/`：React + TypeScript 源码，Hash 路由。
- `public/mistakes/`：Vite 构建结果，`base` 为 `/mistakes/`。
- `server/mistakes/`：数据库、认证、错题、复习和管理 API。
- `data/mistakes.sqlite`：运行数据库，使用 WAL，不纳入 Git。
- `uploads/mistakes/`：压缩后的整图与裁剪图，按登录账号鉴权读取，运行文件不纳入 Git。
- `.env.ai`：管理员保存的 AI 配置与密钥，不纳入 Git。
- `docs/development.md`：本次任务完成状态与验证记录。

```powershell
npm run build
node --check server/app.js
npm test
npm run test:ai
npm run test:pages
npm run test:client
```

`npm run test:client` 聚焦保存期间编辑、响应丢失重试、本机草稿与冲突处理、整页上传取消、部分失败后的批次重试和复习筛选请求竞态，不调用外部服务。

错题列表每页显示 24 道摘要；导出仍包含当前筛选的完整结果，批量选择针对本页。题干摘要保留完整公式，完整正文在详情、复习或导出时读取。统计由 SQLite 聚合，前端页面按需加载。

编辑文字会按账号和题目保存在当前浏览器的本机草稿中，重新打开编辑页时恢复；未上传图片在离页前提醒。新建保存重试使用同一请求编号，避免重复建题；同一字段被其他页面修改时，编辑器保留本机内容并提供冲突处理入口。整页上传在离页或退出账号时取消，失败页可保留原身份重试，新增页面使用新批次。AI 等待重试时释放执行槽，重启后按保存的下次执行时间恢复。

本轮改进与验收记录见 [项目审查改进](docs/project-improvements.md)。

`npm run build` 包含前端类型检查。`npm test` 运行核心错题与搜索烟测，再运行验证码认证烟测；测试使用临时数据库，结束后清理。`npm run test:ai` 使用独立临时数据库和本机模拟 AI，检查多区域定位、无效坐标、校对应用、配图归属、冲突、解析携图，以及个人知识点、重试恢复和清理；不调用收费服务。页面改动另做一次电脑及手机宽度的浏览器检查。模拟测试证明流程正确，实际转写遗漏和选框精度需用真实模型与题图另行比较。

管理员的“测试图片识别”会核对固定图片中的文字。实际质量可通过 `npm run baseline:ai -- 清单.json before|after` 记录 8 张题图的识别结果、耗时、调用次数和用量，再填写人工评分生成前后对比；此命令调用已配置的真实服务。清单模板、`--check` / `--compare` 用法与本机编码比较记录见 [图片识别改进与基线评测](docs/mistakes-photo-ai.md)。

## 登录与注册的人机验证

安装的 `@friendlycaptcha/sdk` 随前端构建发布，浏览器使用 Friendly Captcha v2 Cloud 的 Global 端点和 Focus 启动模式。Smart 模式在 Friendly Captcha 控制台设置。每次登录（含管理员）和邀请码注册需要验证；已登录用户修改密码、管理员重置密码和错题操作沿用原流程。

在 Friendly Captcha 控制台创建生产应用、设置实际使用域名与 Global / Smart，并创建服务器 API Key，然后在服务器 `.env` 配置：

```dotenv
FRIENDLY_CAPTCHA_ENABLED=true
FRIENDLY_CAPTCHA_SITEKEY=你的生产Sitekey
FRIENDLY_CAPTCHA_API_KEY=你的服务器APIKey
```

重启 Node 后生效，无需重新构建前端。API Key 仅供服务器调用官方核验接口，不能使用 `VITE_` 前缀或放入 `public/`。启用但缺少任一密钥时服务会明确报配置错误；本地开发可设 `FRIENDLY_CAPTCHA_ENABLED=false`，自动测试显式配置开关。

香港服务器调用 `https://global.frcapi.com/api/v2/captcha/siteverify`，超时为 5 秒。遇到连接失败、超时、官方 429 或 5xx 时，登录继续检查密码与账号状态，注册暂停；无效、过期、重复使用的验证码或密钥配置错误不会放行。已有登录会话不受核验服务故障影响。

登录每 IP 每 15 分钟最多 60 次请求；同 IP＋用户名每 15 分钟最多 5 次失败；注册每 IP 每小时最多 20 次请求。成功登录及上游 503 不计入登录失败额度。限流使用单 Node 进程内存，重启后重置。日志中的 `captcha_upstream_unavailable`、`captcha_configuration_error`、`auth_rate_limited` 分别表示上游故障、配置异常和认证限流。

SDK 从自己的网站加载，浏览器仍需连接 Friendly Captcha Cloud。生产启用前，使用大陆网络检查登录、注册，并确认香港服务器能访问核验 API。生产密钥配置、控制台设置和真实网络测试属于部署验收。详细实现与本地验证记录见 [Friendly Captcha 接入](docs/mistakes-captcha.md)。

## 服务器运行

搜索采用 MiniSearch 和 Node.js 24 原生中文分词，直接运行在现有后端中。保持单个 Node 进程，无需额外搜索服务或数据库迁移。账号首次搜索时建立内存索引，最多缓存最近 10 个账号；重启后按需从 SQLite 重建。索引不保存额外正文副本或独立索引文件。搜索规则、任务状态与验证记录见 [错题搜索改造](docs/mistakes-search.md)。

构建后，将 `public/` 作为网站静态根目录，Node 服务继续监听 `127.0.0.1`。Nginx 将同域 API 转发到后端：

```nginx
location /api/mistakes/ {
    client_max_body_size 10m;
    proxy_read_timeout 120s;
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

生产环境配置 `NODE_ENV=production` 并使用 HTTPS；会话 Cookie 使用 HttpOnly、SameSite=Lax，生产环境启用 Secure。后端目录、`.env`、`data/` 和 `uploads/` 位于静态目录之外。数据库路径可通过 `MISTAKES_DB_PATH` 调整，默认为仓库的 `data/mistakes.sqlite`。AI 队列也运行在这个单进程内，重启会恢复未完成任务。发布时保留 `data/`、`uploads/` 和 `.env.ai`，服务账号须有写权限。备份时同时保留数据库、图片目录和 AI 配置；SQLite 应连同 WAL 状态备份，或先停止服务再复制。应用保存的图片是本机持久存储，异机灾备仍由部署环境负责。
