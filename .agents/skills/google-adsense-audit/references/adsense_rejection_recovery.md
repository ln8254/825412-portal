# Google AdSense 审核避坑与被拒恢复终极指南

这份指南汇集了 Google 官方审核规范（基于官方指南视频《How to get your site approved for AdSense?》）以及在 Cloudflare、纯前端网站开发中踩坑总结的最关键排错经验。

---

## 一、“低价值内容 (Low Value Content)”被拒的真正元凶

很多站长以为被判定“低价值内容”纯粹是因为文章字数不够，其实在 80% 的情况下，**根本原因是审核机器人根本没能成功读取到内页**！

### 1. 致命重定向死循环 (Redirect Loops)
* **典型场景**：静态托管平台（如 Cloudflare Pages、Vercel、Netlify）默认启用了“Clean URLs (去除 .html)”功能。
  * 访问 `https://domain.com/page.html` 会收到服务器强行返回的 `307 Temporary Redirect` -> `https://domain.com/page`。
  * 如果你的 `sitemap.xml`、内部 `<a>` 标签、或 `<link rel="canonical">` 依然带有 `.html`，爬虫在页面间跳转时会陷入重定向死循环。
  * **后果**：Google 爬虫直接放弃抓取所有内页，整站被收录的页面仅有首页 1 个。AdSense 审查员一查，发现是一个“单页空壳”，立即打回并附赠模板拒信：“低价值内容”。
* **根治方案**：
  1. 将站点内所有的 `href`、`canonical` 和 `sitemap.xml` 彻底统一为**不带 .html 的 Clean URL**。
  2. 保证每一个页面被直接请求时直接返回 `HTTP 200 OK`，0 重定向。

### 2. 单页应用 (SPA) 动态渲染与无静态超链接
* **典型场景**：使用 JavaScript 事件（如 Tab 切换、`data-target` 点击事件）切换展示内容，源码中没有标准的 `<a href="...">` 链接。
* **后果**：静态爬虫不会触发复杂的点击交互，导致爬虫进入首页后无法发现任何子页面（孤岛页面）。
* **根治方案**：
  1. 侧边栏、导航栏必须使用标准的 `<a href="/path">` 语义化标签。
  2. 在首页底部增加清晰的“网站全景目录 (Site Directory)”，将核心工具和文章页面全部硬编码静态罗列出来。

### 3. 正文内容过少 (Thin Content)
* 单个页面的纯正文字符数（去除 HTML/CSS/JS 标签后）建议至少大于 **300 ~ 500 字符**。
* 工具类网站除了交互控件外，必须配有清晰的功能原理介绍、常见问题 (FAQ) 或使用说明。

---

## 二、Cloudflare / CDN 防火墙拦截排查

Google AdSense 的爬虫与常规搜索爬虫行为有所不同：

| 爬虫名称 | 对应用户代理 (User-Agent) | 职责 |
| :--- | :--- | :--- |
| **Googlebot** | `Mozilla/5.0 (compatible; Googlebot/2.1; ...)` | 负责 Google 网页搜索与索引收录 |
| **Mediapartners-Google** | `Mediapartners-Google` | **负责 AdSense 网站准入审核与广告匹配** |
| **Google-InspectionTool** | `Mozilla/5.0 ... Google-InspectionTool/1.0` | 负责 GSC 的 URL 实时在线测试 |

### 常见致命误伤：
1. **Super Bot Fight 模式**：Cloudflare 的机器人对抗模式会将无头爬虫视为恶意扫描进行 JavaScript 质询或验证码拦截，导致 `Mediapartners-Google` 无法直接读取网页源码。
2. **浏览器完整性检查 (Browser Integrity Check)**：由于爬虫不发送完整的桌面浏览器指纹，常被此功能判定为不安全而拦截。

### 最佳 WAF 放行白名单规则配置：
进入 Cloudflare -> **安全性 (Security)** -> **WAF** -> **自定义规则 (Custom Rules)** -> 创建规则：
* **表达式**：
  ```text
  (http.user_agent contains "Googlebot") or (http.user_agent contains "Mediapartners-Google")
  ```
* **操作**：选择 **【跳过 (Skip)】**
* **勾选跳过组件**：
  * [x] 所有 Super Bot Fight 模式规则
  * [x] 浏览器完整性检查
  * [x] 安全级别
  * [x] 所有托管规则与速率限制
* **执行顺序**：必须设为 **【第一位 (First)】**！

---

## 三、Google Search Console (GSC) 常见误区

### 1. `sitemap.xml` 刚提交显示红色的 `Couldn't fetch`
* **千万不要慌！** 观察 `Last read`（上次读取时间）列。
* 如果 `Last read` 是空白的，且 `Type` 是 `Unknown`，说明 **Google 根本还没开始读取你的地图**，红字只是 GSC 任务在等待队列时的默认占位显示。
* **验证方法**：在 GSC 顶部输入 `https://yourdomain.com/sitemap.xml`，点击 **【TEST LIVE URL】**。只要能拿到绿色对勾，说明网络完全通畅，无需重复提交。

### 2. 不要死等 GSC 地图变绿才提交 AdSense
* **GSC 是搜索索引系统，AdSense 是广告商务系统，二者底层独立！**
* GSC 的离线报表更新周期往往需要数天至两周。
* 只要全站内链畅通、WAF 已放行、Live Test 实测通过，AdSense 的 `Mediapartners-Google` 会直接从首页爬入，无需等待 GSC 报表状态更新。

---

## 四、必备合规三件套与自查清单

1. **`ads.txt` 文件**：
   * 必须位于网站根目录（`https://domain.com/ads.txt`），直接返回 200 OK。
   * 内容格式：
     ```text
     google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
     ```
2. **全站 `<head>` 代码**：
   * 每一个页面都必须具备正确的 AdSense 客户端 JS 标签。
3. **法律与信任页面**：
   * 必须在导航栏或页脚放置：
     * **关于我们 (About Us)**：清晰阐述网站设立目的与开发者背景。
     * **隐私政策 (Privacy Policy)**：必须包含关于 Cookie、第三方广告服务商（Google AdSense）收集非个人身份信息的数据合规说明。
     * **服务条款 (Terms of Service)**：明确免责声明与服务使用准则。
     * **联系我们 (Contact Us)**：提供真实可用的联系邮箱或表单。
