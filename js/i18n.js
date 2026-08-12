/**
 * 825412-portal - 国际化组件 (i18n Controller)
 */
const I18nController = {
  currentLang: 'zh-CN',

  translations: {
    'zh-CN': {
      // 导航
      'nav_dashboard': '控制台',
      'nav_clipboard': '匿名剪贴板',
      'nav_toolbox': '极客工具箱',
      'nav_ai': 'AI 智能助手',
      'nav_settings': '设置中心',
      'nav_about': '关于本站',
      'nav_privacy': '隐私政策',
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
      'tool_subtitle': '各种免安装的在线实用开发小工具。',
      'tool_pwd_tab': '密码生成器',
      'tool_time_tab': '时间戳转换',
      'tool_text_tab': '文本处理',
      'tool_pwd_gen': '点击下方生成按钮',
      'tool_pwd_len': '密码长度:',
      'tool_pwd_upper': '包含大写字母 (A-Z)',
      'tool_pwd_lower': '包含小写字母 (a-z)',
      'tool_pwd_num': '包含数字 (0-9)',
      'tool_pwd_sym': '包含特殊符号 (!@#$%)',
      'tool_pwd_btn': '生成安全密码',
      'tool_time_curr': '当前本地时间',
      'tool_time_copy_sec': '复制秒',
      'tool_time_conv_title': '时间戳转换',
      'tool_time_conv_label': '时间戳 (秒) -> 日期时间',
      'tool_time_conv_btn': '转换',
      'tool_text_ph': '在这里输入你想处理的文本...',
      'tool_text_upper': '大写转换',
      'tool_text_lower': '小写转换',
      'tool_text_count': '计算字数',
      'tool_text_b64enc': 'Base64 编码',
      'tool_text_b64dec': 'Base64 解码',
      'tool_text_clear': '清空',
      'tool_text_res_label': '结果展示:',

      // 工具箱 FAQ
      'tool_faq_title': '极客工具箱知识库与安全性说明',
      'tool_faq_q1': '随机高强度密码生成器的安全性',
      'tool_faq_a1': '本密码生成器完全基于客户端浏览器的密码学随机数算法（Web Crypto API）生成，包含大小写字母、数字与特殊符号。生成的密码绝不上传至任何服务器，保障您的账号资产安全。',
      'tool_faq_q2': '什么是 Unix 时间戳（Timestamp）？',
      'tool_faq_a2': 'Unix 时间戳是指格林威治时间 1970年01月01日00时00分00秒起至现在的总秒数（或毫秒数）。开发者常用时间戳在不同时区和系统中传递标准时间。',
      'tool_faq_q3': 'Base64 编码与解码原理',
      'tool_faq_a3': 'Base64 是一种基于 64 个可打印字符来表示二进制数据的方法。常用于在 HTTP 环境下传输简单的文本数据、图片或密文。',

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

      // 页脚
      'footer_rights': '© 2026 825412.xyz 极客多功能工具箱 | 保留所有权利',

      // 动态提示文本
      'msg_enter_paste': '请先输入要分享的文本内容！',
      'msg_link_copied': '分享链接已复制到剪贴板！',
      'msg_pwd_copied': '强密码已成功复制到剪贴板！',
      'msg_ts_copied': '时间戳已成功复制！',
      'msg_input_text_first': '请先在输入框中填入需要转换的文本！',
      'msg_word_count': '计算完成！字数：',
      'msg_settings_saved': '配置已成功保存！'
    },
    'en-US': {
      // Navigation
      'nav_dashboard': 'Dashboard',
      'nav_clipboard': 'Pastebin',
      'nav_toolbox': 'Toolbox',
      'nav_ai': 'AI Assistant',
      'nav_settings': 'Settings',
      'nav_about': 'About Us',
      'nav_privacy': 'Privacy Policy',
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
      'tool_subtitle': 'Useful web-based developer tools with zero installation.',
      'tool_pwd_tab': 'Password Gen',
      'tool_time_tab': 'Timestamp',
      'tool_text_tab': 'Text Utilities',
      'tool_pwd_gen': 'Click generate button below',
      'tool_pwd_len': 'Password Length:',
      'tool_pwd_upper': 'Uppercase (A-Z)',
      'tool_pwd_lower': 'Lowercase (a-z)',
      'tool_pwd_num': 'Numbers (0-9)',
      'tool_pwd_sym': 'Symbols (!@#$%)',
      'tool_pwd_btn': 'Generate Secure Password',
      'tool_time_curr': 'Current Local Time',
      'tool_time_copy_sec': 'Copy Seconds',
      'tool_time_conv_title': 'Timestamp Conversion',
      'tool_time_conv_label': 'Timestamp (sec) -> Datetime',
      'tool_time_conv_btn': 'Convert',
      'tool_text_ph': 'Enter text to process here...',
      'tool_text_upper': 'UPPERCASE',
      'tool_text_lower': 'lowercase',
      'tool_text_count': 'Word Count',
      'tool_text_b64enc': 'Base64 Encode',
      'tool_text_b64dec': 'Base64 Decode',
      'tool_text_clear': 'Clear',
      'tool_text_res_label': 'Result:',

      // Toolbox FAQ
      'tool_faq_title': 'Toolbox Knowledge Base & Security',
      'tool_faq_q1': 'Security of Password Generator',
      'tool_faq_a1': 'Generated entirely in your browser using Web Crypto API. Passwords are never sent to any server.',
      'tool_faq_q2': 'What is a Unix Timestamp?',
      'tool_faq_a2': 'A Unix timestamp is the total number of seconds elapsed since 00:00:00 UTC on Jan 1, 1970.',
      'tool_faq_q3': 'Base64 Encoding & Decoding Principle',
      'tool_faq_a3': 'Base64 converts binary data into 64 printable ASCII characters for safe HTTP transmission.',

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

      // Footer
      'footer_rights': '© 2026 825412.xyz Geek Toolbox | All Rights Reserved.',

      // Dynamic Messages
      'msg_enter_paste': 'Please enter text to share first!',
      'msg_link_copied': 'Share link copied to clipboard!',
      'msg_pwd_copied': 'Password copied to clipboard!',
      'msg_ts_copied': 'Timestamp copied!',
      'msg_input_text_first': 'Please enter text in the box first!',
      'msg_word_count': 'Calculated! Word count: ',
      'msg_settings_saved': 'Settings saved successfully!'
    }
  },

  init() {
    this.currentLang = StorageController.getLanguage();
    this.applyLanguage(this.currentLang);
  },

  toggleLanguage() {
    const nextLang = this.currentLang === 'zh-CN' ? 'en-US' : 'zh-CN';
    this.setLanguage(nextLang);
  },

  setLanguage(lang) {
    this.currentLang = lang;
    StorageController.saveLanguage(lang);
    this.applyLanguage(lang);
  },

  t(key) {
    const dict = this.translations[this.currentLang] || this.translations['zh-CN'];
    return dict[key] || key;
  },

  applyLanguage(lang) {
    const dict = this.translations[lang] || this.translations['zh-CN'];
    
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

    // 重新渲染剪贴板历史列表的文案
    if (typeof ClipboardController !== 'undefined' && ClipboardController.renderHistory) {
      ClipboardController.renderHistory();
    }
  }
};

window.I18nController = I18nController;
