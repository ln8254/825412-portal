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

      // 极客隔空快传 (AirDrop)
      'airdrop_title': '极客隔空快传 (AirDrop 网页版)',
      'airdrop_subtitle': '无需登录、跨局域网与设备秒级互传文件、文本与剪贴板，彻底告别微信文件传输助手。',
      'airdrop_my_device': '当前设备标识:',
      'airdrop_room_label': '当前互传频道:',
      'airdrop_copy_invite': '手机扫码/复制直连链接',
      'airdrop_join_btn': '切换频道',
      'airdrop_send_title': '📤 投送文件与文本',
      'airdrop_peers_title': '频道内在线设备 (Connected Peers)',
      'airdrop_drop_hint': '拖拽文件至此 或 点击选择文件',
      'airdrop_drop_sub': '支持图片、压缩包、代码文件、文档 (最大 10MB)',
      'airdrop_text_ph': '输入你想秒传给手机或其他电脑的文本或代码...',
      'airdrop_send_text_btn': '投送文本至对端',
      'airdrop_recv_title': '📥 实时接收传输流',

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

      // 工具箱深度技术知识专栏
      'tool_faq_title': '极客工具箱技术专栏与算法知识库',
      'tool_faq_q1': '密码信息熵（Entropy）与防暴力破解数学原理',
      'tool_faq_a1': '密码信息熵的计算公式为 E = L * log2(N)，其中 L 为密码长度，N 为可用字符集池大小（大写+小写+数字+特殊符号共 94 个）。根据 NIST 安全建议，当熵值超过 80 Bits 时，采用每秒万亿次运算的现代超级算力集群穷举破解也需要数十亿年时间。',
      'tool_faq_q4': 'JSON (RFC 8259) 标准规范与开发陷阱',
      'tool_faq_a4': 'JSON 是一种严格基于文本的数据交换格式。常见陷阱包括：1) 必须使用双引号包裹键名；2) 尾部多余逗号（Trailing Comma）会导致解析异常；3) JavaScript 在处理超过 2^53 - 1 (9007199254740991) 的 64 位整型时会发生精度截断，建议大整数转为 String 传输。',
      'tool_faq_q5': 'JWT (JSON Web Token) 机制与无状态认证架构',
      'tool_faq_a5': 'JWT 由 Header（算法与类型）、Payload（声明载荷）和 Signature（防篡改签名）组成。JWT 属于自包含身份凭证，服务端无需查询 Session 数据库即可验证。在客户端存储时，强烈建议存放于 HttpOnly Cookie 以彻底杜绝 XSS 脚本窃取。',
      'tool_faq_q6': '单向散列算法 (SHA-256 vs MD5) 与碰撞安全',
      'tool_faq_a6': '散列算法具有不可逆性与雪崩效应。MD5（128位）与 SHA-1 已被证明存在碰撞漏洞，不推荐用于密码存储与数字签名。现代高安全场景推荐使用 SHA-256、SHA-512 以及针对密码存储设计的慢速哈希算法（如 Argon2、bcrypt 与 PBKDF2）。',
      'tool_faq_q2': 'Unix 时间戳与 2038 年问题 (Year 2038 Problem)',
      'tool_faq_a2': 'Unix 时间戳从 1970-01-01 00:00:00 UTC 开始计时。在传统的 32 位有符号整数系统中，时间戳将在 2038 年 1 月 19 日 03:14:07 溢出变成负数。现代系统和 64 位体系已彻底解决该问题，可支持长达 2920 亿年的时间跨度。',
      'tool_faq_q3': 'Base64 编码与 URL 安全传输原理 (Base64URL)',
      'tool_faq_a3': 'Base64 将每 3 个字节（24 bits）分割为 4 个 6-bit 单元并映射至 64 个 ASCII 字符，编码后体积会增加约 33%。Base64URL 进一步将 \'+\' 替换为 \'-\'，\'/\' 替换为 \'_\'，以避免在 HTTP URL、文件名和 JWT 中发生歧义。',

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
      'dash_subtitle': 'Real-time network node monitoring & quick tool access.',
      'dash_node_title': 'System Node & Visitor Monitor',
      'dash_visitor_ip': 'Visitor IP',
      'dash_location': 'Location & ISP',
      'dash_ping': 'Ping Latency',
      'dash_ai_title': 'AI Neural Link',
      'dash_ai_nokey': 'API Key missing. Enter key in Settings to activate AI Chat link.',
      'dash_ai_ready': '<span style="color: var(--color-tertiary); font-weight: 600;">Neural Link Active.</span> Connected to Gemini API Core.',
      'dash_ai_btn': 'Start Chat',
      'dash_toolbox_title': 'Quick Toolbox',
      'dash_shortcut_pwd': 'Password Generator',
      'dash_shortcut_time': 'Time Converter',
      'dash_shortcut_text': 'Text Processor',
      'dash_no_pastes': 'No recent paste shares...',
      'dash_go_clip': 'Go to Pastebin',
      'dash_go_airdrop': 'Open AirDrop',

      // Clipboard
      'clip_title': 'Anonymous Pastebin',
      'clip_subtitle': 'Fast, temporary text sharing tool. Self-destructs upon expiration.',
      'clip_ph': '// Paste your text or code snippet here...',
      'clip_1h': 'Expires in 1 Hour',
      'clip_24h': 'Expires in 24 Hours',
      'clip_7d': 'Expires in 7 Days',
      'clip_btn_create': 'Create Share Link',
      'clip_share_result': 'Share Result',
      'clip_share_url_label': 'Your Share Link (Click to Copy):',
      'clip_local_history': 'Local History',

      // Clipboard FAQ
      'clip_faq_title': 'Anonymous Pastebin Guide & FAQ',
      'clip_faq_q1': 'How does Anonymous Pastebin work?',
      'clip_faq_a1': 'Paste code or notes in the editor, choose expiration time, and click "Create Share Link". A unique Hash URL (e.g. #paste=xxxx) is generated. Recipients can open the link to instantly read and copy the content.',
      'clip_faq_q2': 'Security & Self-Destruction Mechanism',
      'clip_faq_a2': 'Data self-destructs after 1h, 24h, or 7 days. Once expired, cloud data is permanently wiped out. No sign-up or personal data is ever required.',

      // Toolbox
      'tool_title': 'Geek Toolbox',
      'tool_subtitle': 'Zero-installation, client-side, privacy-focused online developer suite.',
      'tool_pwd_tab': 'Password Gen',
      'tool_json_tab': 'JSON Formatter',
      'tool_jwt_tab': 'JWT Debugger',
      'tool_hash_tab': 'Hash Calculator',
      'tool_time_tab': 'Timestamp',
      'tool_text_tab': 'Text Utilities',

      // Password Generator & Entropy
      'tool_pwd_gen': 'Click generate button below',
      'pwd_strength_title': 'Password Security Evaluation:',
      'pwd_crack_time_label': 'Estimated Brute-Force Crack Time:',
      'pwd_charset_size_label': 'Available Charset Pool (N):',
      'pwd_rec_label': 'Security Compliance Tip:',
      'tool_pwd_len': 'Password Length:',
      'tool_pwd_upper': 'Uppercase (A-Z)',
      'tool_pwd_lower': 'Lowercase (a-z)',
      'tool_pwd_num': 'Numbers (0-9)',
      'tool_pwd_sym': 'Symbols (!@#$%)',
      'tool_pwd_btn': 'Generate Secure Password',

      // JSON Tool
      'json_btn_format_2': 'Format (2 Spaces)',
      'json_btn_format_4': 'Format (4 Spaces)',
      'json_btn_minify': 'Minify JSON',
      'json_btn_copy': 'Copy Result',
      'json_ph': 'Paste raw JSON string here to format or validate...',
      'json_status_ready': 'JSON parser ready. Real-time syntax tree analysis and linting active.',

      // JWT Tool
      'jwt_input_label': 'Encoded Token (To Decode):',
      'jwt_btn_sample': 'Load Sample',
      'jwt_ph': 'Paste your eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... here',
      'jwt_valid_text': 'Client-Side Pure Parsing: Tokens are never uploaded to any remote server.',
      'jwt_header_title': 'HEADER: ALGORITHM & TOKEN TYPE',
      'jwt_payload_title': 'PAYLOAD: DATA CLAIMS',

      // Hash Tool
      'hash_ph': 'Enter any text or password string to calculate cryptographic hashes...',

      // Timestamp
      'tool_time_curr': 'Current Local Time',
      'tool_time_copy_sec': 'Copy Seconds',
      'tool_time_conv_title': 'Timestamp Conversion',
      'tool_time_conv_label': 'Timestamp (sec) -> Datetime',
      'tool_time_conv_btn': 'Convert',
      'time_code_cheatsheet': 'Current Timestamp Code Cheatsheet:',

      // Text Utilities
      'tool_text_ph': 'Enter text to process here...',
      'tool_text_upper': 'UPPERCASE',
      'tool_text_lower': 'lowercase',
      'tool_text_count': 'Word Count & Metrics',
      'tool_text_b64enc': 'Base64 Encode',
      'tool_text_b64dec': 'Base64 Decode',
      'tool_text_urlenc': 'URL Encode',
      'tool_text_urldec': 'URL Decode',
      'tool_text_clear': 'Clear',
      'tool_text_res_label': 'Result:',

      // Geek AirDrop
      'airdrop_title': 'Geek AirDrop (Web Peer-to-Peer)',
      'airdrop_subtitle': 'Sign-in free, instant cross-device file & text transfer across local networks and mobile devices.',
      'airdrop_my_device': 'My Device Identity:',
      'airdrop_room_label': 'Active Channel Room:',
      'airdrop_copy_invite': 'Mobile Scan / Copy Direct Link',
      'airdrop_join_btn': 'Switch Channel',
      'airdrop_send_title': '📤 Transfer Files & Text',
      'airdrop_peers_title': 'Connected Peers in Channel',
      'airdrop_drop_hint': 'Drop files here or click to select',
      'airdrop_drop_sub': 'Supports images, zips, code, docs (Max 10MB)',
      'airdrop_text_ph': 'Type text or code to instantly transfer across devices...',
      'airdrop_send_text_btn': 'Send Text to Peers',
      'airdrop_recv_title': '📥 Real-Time Incoming Stream',

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

      // In-depth Knowledge Base
      'tool_faq_title': 'Geek Toolbox Tech Articles & Knowledge Base',
      'tool_faq_q1': 'Password Entropy & Mathematical Brute-Force Resistance',
      'tool_faq_a1': 'Password entropy formula is E = L * log2(N), where L is length and N is charset pool size (94 possible ASCII chars). According to NIST guidelines, passwords with >80 bits entropy require billions of years to brute-force on modern supercomputer clusters.',
      'tool_faq_q4': 'JSON (RFC 8259) Standards & Common Developer Pitfalls',
      'tool_faq_a4': 'JSON is a strict text data interchange format. Common pitfalls: 1) Keys must be enclosed in double quotes; 2) Trailing commas are illegal in JSON; 3) JavaScript precision limit on 64-bit ints (> 2^53 - 1) may truncate large numbers, which should be transmitted as strings.',
      'tool_faq_q5': 'JWT (JSON Web Token) Architecture & Stateless Auth',
      'tool_faq_a5': 'JWT consists of Header, Payload, and Signature. It is self-contained and allows servers to authenticate requests without database queries. For client-side storage, HttpOnly cookies are strongly recommended to protect against XSS script theft.',
      'tool_faq_q6': 'Cryptographic Hashes (SHA-256 vs MD5) & Collision Security',
      'tool_faq_a6': 'Cryptographic hashes provide irreversibility and avalanche effect. MD5 (128-bit) and SHA-1 suffer from collision vulnerabilities and are deprecated for password storage. Use SHA-256/SHA-512 for integrity, and slow hashes (Argon2, bcrypt, PBKDF2) for passwords.',
      'tool_faq_q2': 'Unix Timestamp & Year 2038 Problem (Y2038)',
      'tool_faq_a2': 'Unix Epoch starts at 1970-01-01 00:00:00 UTC. Legacy 32-bit signed integers will overflow on Jan 19, 2038 at 03:14:07 UTC. Modern 64-bit systems completely resolve this, supporting time spans of 292 billion years.',
      'tool_faq_q3': 'Base64 & URL-Safe Transmission Principles (Base64URL)',
      'tool_faq_a3': 'Base64 groups 3 bytes (24 bits) into 4 6-bit chunks mapped to 64 ASCII characters, resulting in ~33% size overhead. Base64URL replaces \'+\' with \'-\' and \'/\' with \'_\' to avoid ambiguities in HTTP URLs and JWTs.',

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
