# 825412-portal 极客工具箱

这是一个高颜值、多功能的极客/开发者门户网站，专为绑定域名 `825412.xyz` 打造。项目采用纯前端 (Vanilla HTML/CSS/JS) 单页应用 (SPA) 架构，实现零成本托管和极速部署。

## 🌟 核心功能

*   **控制台 (Dashboard)**：动态监控模拟的系统资源负载，并提供快速进入工具箱的入口卡片。
*   **匿名剪贴板 (Clipboard)**：直接集成公共免费的 `dpaste.org` API，无需数据库即可在线生成匿名分享短链接，支持设置失效时间，并在本地记录历史。
*   **极客工具箱 (Toolbox)**：
    *   **密码生成器**：自定义长度和字符集，随机打乱顺序生成高强度密码。
    *   **时间戳转换**：北京时间与 Unix 时间戳（秒/毫秒）互转。
    *   **文本处理器**：大/小写转换、字数行数统计、Base64 编解码。
*   **AI 智能助手 (AI Chat)**：对接本地配置的 Gemini 1.5 Flash API，在客户端实现安全、流畅的智能对话。

## 🎨 视觉设计 (Neon Terminal)

*   **暗黑科技风格 (Sleek Dark Mode)**：以深蓝色 (#0b1326) 为主背景，点缀霓虹紫 (#8b5cf6) 与青色 (#06b6d4) 渐变。
*   **毛玻璃拟态 (Glassmorphism)**：大量采用半透明容器与 `backdrop-filter` 背景模糊，呈现 premium HUD 科技质感。
*   **响应式布局**：完美适配 PC 桌面端、平板和移动手机端。

## 🚀 部署指南

因为本项目是纯静态网页，推荐使用以下平台进行**永久免费**托管：

### 使用 Vercel 部署

1. 在 GitHub 上创建新仓库，并将本项目代码推送上去。
2. 登录 [Vercel](https://vercel.com/)，导入该 GitHub 仓库。
3. 点击 **Deploy** 即可上线。
4. 在 Vercel 控制台的 **Settings -> Domains** 中绑定你的域名 `825412.xyz`：
   * 在你的域名解析商处，为 `@` 记录添加指向 `76.76.21.21` 的 **A 记录**。
   * 或者为 `www` 添加指向 `cname.vercel-dns.com` 的 **CNAME 记录**。

### 使用 Cloudflare Pages 部署

1. 登录 [Cloudflare](https://dash.cloudflare.com/) 账户。
2. 进入 **Workers & Pages** -> **Pages** -> **Create a project** 并导入你的 GitHub 仓库。
3. 部署完成后，在 **Custom domains** 里添加并绑定你的域名。

## 🔒 隐私与安全

*   本网站所有的计算（密码生成、时间转换、Base64 编解码）均在用户浏览器本地完成。
*   你的 **Gemini API Key** 仅储存在本地浏览器的 `LocalStorage` 中，绝不会上传给任何第三方服务器。
