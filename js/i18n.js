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
      'airdrop_rescan_btn': '刷新对端设备',
      'airdrop_drop_hint': '拖拽文件至此 或 点击选择文件',
      'airdrop_drop_sub': '支持图片、压缩包、代码文件、文档 (最大 10MB)',
      'airdrop_text_ph': '输入你想秒传给手机或其他电脑的文本或代码...',
      'airdrop_send_text_btn': '投送文本至对端',
      'airdrop_recv_title': '📥 实时接收传输流',

      // 隔空快传技术白皮书
      'airdrop_doc_title': 'WebRTC 极客隔空快传技术原理与安全白皮书',
      'airdrop_doc_sub': '了解端到端免中转点对点通信、STUN NAT 穿透协议与零云端日志安全架构。',
      'airdrop_doc_mesh_title': '1. WebRTC 点对点直连握手流程 (P2P Mesh)',
      'airdrop_doc_sec_title': '2. 为什么比微信文件助手/网盘更安全？',
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
      'webhook_doc_compare_title': '1. Webhook 与传统 HTTP 轮询 (Polling) 深度对比',
      'webhook_doc_sec_title': '2. 生产级 Webhook 消费端五大安全规范',
      'webhook_doc_code_title': '主流语言 Webhook HMAC-SHA256 安全验签示例代码',

      // 工具箱深度技术知识专栏
      'tool_faq_title': '极客工具箱技术专栏与算法知识库',
      'tool_doc_gpu_title': '现代 GPU 算力集群（RTX 4090 矩阵）暴力破解密码耗时对照表',
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
      'hash_md5_label': 'MD5 (128-bit / Fast Checksum):',
      'hash_sha1_label': 'SHA-1 (160-bit):',
      'hash_sha256_label': 'SHA-256 (256-bit / Industry Standard):',
      'hash_sha512_label': 'SHA-512 (512-bit / Military Grade):',

      // Time Converter
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

      // AirDrop
      'airdrop_title': 'Geek AirDrop (Web P2P File Drop)',
      'airdrop_subtitle': 'Zero-login, cross-device instant file, text, and clipboard transfer via WebRTC P2P.',
      'airdrop_my_device': 'My Device Identity:',
      'airdrop_room_label': 'Current Channel:',
      'airdrop_copy_invite': 'Mobile Scan / Copy Direct Link',
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
      'airdrop_doc_mesh_title': '1. WebRTC P2P Mesh Handshake Lifecycle',
      'airdrop_doc_sec_title': '2. Why Is It More Secure Than Cloud Messengers?',
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
      'webhook_doc_compare_title': '1. Webhook vs Traditional HTTP Polling Comparison',
      'webhook_doc_sec_title': '2. Five Production Security Rules for Webhook Consumers',
      'webhook_doc_code_title': 'HMAC-SHA256 Signature Verification Code Snippets',

      // In-depth Knowledge Base
      'tool_faq_title': 'Geek Toolbox Tech Articles & Knowledge Base',
      'tool_doc_gpu_title': 'Modern GPU Cluster (RTX 4090 Matrix) Brute-Force Password Cracking Time Matrix',
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
