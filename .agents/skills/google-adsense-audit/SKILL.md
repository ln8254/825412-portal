---
name: google-adsense-audit
description: >-
  Comprehensive auditor and submission guide for Google AdSense compliance and website approval.
  Use this skill whenever the user wants to prepare, audit, troubleshoot, or submit a website for Google AdSense,
  or when dealing with AdSense rejection issues such as 'Low value content', redirect loops,
  missing ads.txt, crawler errors, or Cloudflare/WAF bot challenge blocks.
---

# Google AdSense 网站审查与合规提交指南

本技能专门指导如何系统化审查网站是否符合 Google AdSense 官方标准，排查历史被拒隐患（尤其是“低价值内容”、“无法访问/抓取错误”），并提供高通过率的提交指导。

---

## 核心审查流程（五步全闭环）

### 第一阶段：本地代码与 SEO 自动化审计

在对任何网站进行人工研判之前，必须首先运行内置的自动化审计脚本进行全盘扫描：

```bash
node <skill_dir>/scripts/adsense_audit.js <website_dir>
```

**审计核心指标清单**：
1. **`ads.txt` 规范**：
   * 必须在根目录下，返回 HTTP 200 OK。
   * 必须包含 `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`。
2. **全站 AdSense SDK 植入**：
   * 检查是否所有 HTML 页面的 `<head>` 内都植入了对应的 `ca-pub-` 代码。
3. **TDK 独立性与完整度**：
   * 每个页面必须有独立的 `<title>`（建议 20~70 字符）。
   * 每个页面必须有独立的 `<meta name="description">`（建议 50~150 字符）。
4. **Canonical 规范标签与 Clean URL**：
   * 必须配置 `<link rel="canonical" href="...">`。
   * **严禁在静态托管平台（如 Cloudflare Pages）的 Canonical 标签或内部链接中保留 `.html`**，否则将引发 307 临时重定向死循环。
5. **正文内容深度（防范“低价值内容”）**：
   * 剔除标签和脚本后的纯正文字符必须超过 300 字符。
   * 页面不得为空壳展示、单纯按钮或占位模版。
6. **全网内链互通与消除孤岛**：
   * 严禁仅靠 JavaScript 事件切换显隐。
   * 侧边栏和页脚必须提供标准的 `<a href="...">` 静态超链接，让爬虫能遍历全站。

---

### 第二阶段：CDN 与 Cloudflare WAF 防火墙放行

很多时候网站被拒并非内容不好，而是 Google 审核爬虫被防火墙挡在门外。

1. **识别官方审核爬虫 User-Agent**：
   * 搜索收录爬虫：`Googlebot`
   * **AdSense 专用审核爬虫**：`Mediapartners-Google`
   * GSC 在线测试爬虫：`Google-InspectionTool`
2. **Cloudflare WAF 跳过规则（必须配置）**：
   * 进入 Cloudflare 后台 -> **安全性** -> **WAF** -> **自定义规则**。
   * 创建规则表达式：
     ```text
     (http.user_agent contains "Googlebot") or (http.user_agent contains "Mediapartners-Google")
     ```
   * 操作选择：**【跳过 (Skip)】**。
   * 勾选跳过：
     * [x] 所有 Super Bot Fight 模式规则
     * [x] 浏览器完整性检查 (Browser Integrity Check)
     * [x] 安全级别 (Security Level)
     * [x] 速率限制与托管规则
   * 规则顺序：必须设为 **【第一位 (First)】**。

详细排错手册见：[AdSense 审核避坑与被拒恢复指南](./references/adsense_rejection_recovery.md)。

---

### 第三阶段：法律政策合规四大金刚页面

必须在网站顶部导航或底部页脚具备清晰可见的 4 个基础法律页面：
* **关于本站 (About Us)**：明确说明站点的创建初衷、服务对象、开发者/团队背景。
* **隐私政策 (Privacy Policy)**：**AdSense 强制项**。必须明确声明站点使用 Cookie，并且使用了第三方服务商（Google）投放广告，Google 将使用 Cookie 根据用户此前访问您网站或其他网站的情况投放广告。
* **服务条款 (Terms of Service)**：声明网站的使用准则、免责声明及版权归属。
* **联系我们 (Contact Us)**：提供站长真实有效的反馈邮箱或联系方式。

---

### 第四阶段：Google Search Console (GSC) 连通性真实性验证

在提交 AdSense 前，用 GSC 现场验证连通性：

1. **URL Inspection (网址检查) -> LIVE TEST (测试实际网址)**：
   * 在 GSC 顶栏输入任意关键子页面（如 `https://domain.com/tools/example`）。
   * 点击 **【TEST LIVE URL】**。
   * 确认返回绿色打勾：`URL is available to Google` 且 `Page can be indexed`。
   * 查看截图或 HTML，确认 Googlebot 能够完整渲染出有价值的正文内容。
2. **关于 `sitemap.xml` 的“Couldn't fetch”误区**：
   * 只要 `Last read`（上次读取时间）为空，红色的 `Couldn't fetch` 仅代表后台任务在排队中，绝不代表抓取失败。
   * 只要通过了上述第 1 步的 LIVE TEST，即代表网络绝对畅通，**无需傻等 GSC 的 Sitemaps 报表变绿，可以直接进行 AdSense 提交**。

---

### 第五阶段：AdSense 提交与审核跟进

1. **提交操作**：
   * 登录 Google AdSense 后台 -> 点击左侧 **【网站】(Sites)**。
   * 点击域名进入，勾选代码已植入与 ads.txt 确认项，点击 **【申请审核】(Request Review)**。
2. **审核周期与监控**：
   * 正常审核周期为 **24 小时至 72 小时**（偶尔需 1 周左右）。
   * 期间观察 Cloudflare 日志中的 `Mediapartners-Google` 访问记录。只要命中【跳过】且状态码为 200，说明审核机器人正在顺利巡检。
   * 审核期间**严禁大规模修改站点 URL 结构或改动 ads.txt**。
