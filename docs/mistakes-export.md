# 错题 PDF 导出 · 2026-10-22

## 使用

在“我的错题”点击“导出”，可导出当前筛选的全部结果或本页所选题目；详情页可导出单题。“下载 PDF”可直接保存文件，“预览 PDF”显示同一份文件的实际分页，再次下载不会重新生成。

默认 A4 纵向、15mm 页边距、12pt 思源宋体正文、思源黑体标题、连续排题。字号可选 10.5／12／14pt，每题可另起一页。完整版默认逐题附答案、解析与笔记，也可集中到文末并保留对应题号；练习版隐藏答案、解析和笔记，答题空白可选20／40／60mm，默认40mm。

手机预览默认适应宽度，支持页码跳转和缩放；预览按可见页加载和释放画布。打开／打印入口使用同一份 PDF，可使用浏览器或系统 PDF 阅读器打印。宋体、黑体和 KaTeX 字体均从本站加载，不依赖 Google Fonts；字体许可证随静态文件发布。

## 安装与部署

需要 Node.js 24、锁文件中版本的 Playwright 及其配套 Chromium。应用默认从项目的 `data/.playwright` 读取浏览器，该目录不纳入 Git；安装和运行必须使用相同路径及可读取该目录的服务账号。

Windows（项目根目录）：

```powershell
npm ci --cache ./data/.npm-cache
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) 'data/.playwright'
npx playwright install chromium
npm run build
npm start
```

Linux（项目根目录；系统依赖安装需要相应权限）：

```bash
npm ci --cache ./data/.npm-cache
export PLAYWRIGHT_BROWSERS_PATH="$PWD/data/.playwright"
npx playwright install --with-deps chromium
npm run build
npm start
```

可在 `.env` 设置 `PLAYWRIGHT_BROWSERS_PATH`，或通过 `MISTAKES_PDF_EXECUTABLE_PATH` 指定已有 Chrome／Chromium 的绝对路径；常规部署建议安装 Playwright 的匹配浏览器。升级 Playwright 后重新执行浏览器安装。现有 Nginx `proxy_read_timeout 120s` 保持不变；Node 须能读取 `public/mistakes/` 的构建结果。没有数据库迁移，发布时保留数据库、上传图片及配置文件。

缺少浏览器或构建资源时只影响 PDF 生成，接口返回可操作的错误提示。文档内只支持有权读取的本站配图；缺失、越权或外链配图会指出所在题号，修复后重试。PDF 只在内存中生成和下载，不另存到服务器磁盘。

## 接口与运行行为

鉴权接口 `POST /api/mistakes/exports/pdf` 接收 `{ source, options }`。`source` 为 `{ ids: number[] }` 或 `{ filters: { lifecycle, subjectId, knowledgePointId, status, rating, keyword, dataType } }`，筛选值为字符串，沿用列表筛选及排序；明确 ID 按提交顺序导出，已删除或不可访问的所选题目会提示重新选择。

`options` 包含 `title`、`version`（`complete`／`practice`）、`includeNotes`、`fontSize`（10.5／12／14）、`layout`（`continuous`／`per-question`）、`practiceSpace`（20／40／60）、`answerPlacement`（`inline`／`appendix`）。未提供的设置使用上述默认值。

成功响应为 `application/pdf`，通过 `Content-Disposition` 提供 UTF-8 文件名，`X-Export-Question-Count` 提供实际题数；失败返回现有 `{ success: false, message }` JSON。前端独立读取二进制响应，不派发题目更新事件。文档日期按上海时区生成。

服务端按需复用 Chromium，每份文档使用独立上下文；同时生成一份、最多等待两份，排队上限30秒、执行上限60秒。取消、断连、超时均释放任务上下文和执行槽，空闲60秒关闭浏览器。渲染器仅读取本地构建资源及已校验归属的配图，不转发会话 Cookie，也不访问任意外部地址。

## 实现与验收

| 步骤 | 状态 | 内容 |
| --- | --- | --- |
| PDF 接口与生成服务 | completed | 鉴权、完整筛选、所选保序和配图权限烟测通过；取消会释放执行槽，包括首次浏览器启动期间 |
| 本地字体与试卷排版 | completed | 独立入口、本地字体、完整／练习版、文末答案、长题续页；超宽行内及块公式按自身宽度适配，正文保持所选字号 |
| 导出设置与分页预览 | completed | PDF.js 分页、文字层、缩放与手机操作通过；预览和下载文件 SHA-256 一致且不重复生成 |
| 验证与文档 | completed | 构建、语法、核心和导出烟测通过；桌面／手机实际浏览器验收通过，部署说明与截图已保存 |

验证命令：`npm run build`、`node scripts/mistakes-smoke.cjs`、`npm run test:export`。导出烟测使用临时数据库和上传目录，实际生成 PDF，核对超过24题的完整筛选、所选保序、单题长练习、文末答案、中文文字层及配图权限。完成后清理测试数据。

实际浏览器检查覆盖1280×900和390×844，使用虚构账号与独立临时数据。中文、长公式、表格、配图和跨页长题显示正确；适应宽度时无横向溢出；预览后下载复用同一文件，直接下载、一次失败后保留设置重试、关闭取消及迟到响应处理均通过，没有 JavaScript 异常。测试服务、浏览器与临时数据库已清理。

![桌面 PDF 预览](screenshots/mistakes-export-desktop.png)

![手机 PDF 预览](screenshots/mistakes-export-mobile.png)

![手机导出设置](screenshots/mistakes-export-mobile-settings.png)
