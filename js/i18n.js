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
      'webhook_card3_body': '<h3><span class="material-symbols-outlined" style="font-size: 18px;">code</span> 主流语言 Webhook HMAC-SHA256 安全验签示例代码</h3><div style="margin-top: 12px;"><div style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">🐍 Python (FastAPI / Flask) 示例:</div><pre class="code-snippet">import hmac, hashlib\n\ndef verify_webhook_signature(raw_body: bytes, signature_header: str, secret_key: str) -> bool:\n    expected_sig = "sha256=" + hmac.new(secret_key.encode(), raw_body, hashlib.sha256).hexdigest()\n    # 使用 hmac.compare_digest 防止基于执行时间差的计时攻击 (Timing Attack)\n    return hmac.compare_digest(expected_sig, signature_header)</pre></div><div style="margin-top: 14px;"><div style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">🟢 Node.js (Express) 示例:</div><pre class="code-snippet">const crypto = require('crypto');\n\nfunction verifyWebhook(rawPayload, signatureHeader, secret) {\n  const hmac = crypto.createHmac(\'sha256\', secret);\n  const digest = \'sha256=\' + hmac.update(rawPayload).digest(\'hex\');\n  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));\n}</pre></div>',

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
