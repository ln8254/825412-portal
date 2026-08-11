/**
 * 825412-portal - AI 智能对话逻辑 (AI Chat Controller)
 */
const AiChatController = {
  init() {
    this.checkApiStatus();
    this.initChatAction();
  },

  // 检查 API Key 配置状态并启用/禁用输入
  checkApiStatus() {
    const key = StorageController.getGeminiKey();
    const chatInput = document.getElementById('chat-user-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const statusText = document.getElementById('ai-status-text');

    if (key) {
      if (chatInput) chatInput.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
      if (chatInput) chatInput.placeholder = '输入您的问题，按回车发送...';
      if (statusText) statusText.innerHTML = '<span style="color: var(--color-tertiary); font-weight: 600;">神经网络连接就绪。</span> 已连接至 Gemini-1.5-Flash。';
    } else {
      if (chatInput) chatInput.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
      if (chatInput) chatInput.placeholder = '请先在左下角设置中心配置您的 Gemini API Key...';
      if (statusText) statusText.innerHTML = '未配置 API Key。请输入你的密钥以启用高级人工智能对话链路。';
    }
  },

  // 初始化发送与接收逻辑
  initChatAction() {
    const input = document.getElementById('chat-user-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const container = document.getElementById('chat-messages-container');

    if (!input) return;

    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text) return;

      // 1. 添加用户消息
      this.appendMessage('user', text);
      input.value = '';

      // 2. 添加等待状态
      const thinkingId = this.appendMessage('ai', 'AI 正在分析指令，建立神经连接...');
      const thinkingElement = document.getElementById(thinkingId);

      try {
        const apiKey = StorageController.getGeminiKey();
        
        // 发送 API 请求
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: text }]
              }
            ]
          })
        });

        if (!response.ok) {
          let errorMsg = `HTTP ${response.status}`;
          try {
            const errData = await response.json();
            if (errData.error && errData.error.message) {
              errorMsg += `: ${errData.error.message}`;
            }
          } catch (e) {
            errorMsg += ` ${response.statusText}`;
          }
          throw new Error(errorMsg);
        }

        const data = await response.json();
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          throw new Error('API 返回的数据结构异常，可能遭到了网络拦截。');
        }

        const aiResponse = data.candidates[0].content.parts[0].text;

        // 3. 将等待状态替换为真实回复
        const contentDiv = thinkingElement.querySelector('.message-content');
        contentDiv.innerHTML = this.formatMarkdown(aiResponse);

      } catch (err) {
        console.error(err);
        const contentDiv = thinkingElement.querySelector('.message-content');
        contentDiv.innerHTML = `<span style="color: var(--color-error);">连接中断：${this.escapeHtml(err.message)}</span><br><span style="font-size:12px; color:var(--text-muted);">提示：Google API Key 通常为以 "AIzaSy" 开头的39位字符。此外国内直接请求 Google 服务器需保持网络畅通。</span>`;
      } finally {
        container.scrollTop = container.scrollHeight;
      }
    };

    // 绑定回车发送
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    sendBtn.addEventListener('click', sendMessage);
  },

  // 往聊天窗口插入一条消息
  appendMessage(role, text) {
    const container = document.getElementById('chat-messages-container');
    const messageId = `msg-${Date.now()}`;
    const avatar = role === 'user' ? 'ME' : 'AI';

    const msgHtml = `
      <div class="chat-message ${role}" id="${messageId}">
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${role === 'user' ? this.escapeHtml(text) : text}</div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', msgHtml);
    container.scrollTop = container.scrollHeight;
    return messageId;
  },

  // HTML 安全转义
  escapeHtml(string) {
    return String(string).replace(/[&<>"']/g, (s) => {
      const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return entityMap[s];
    });
  },

  // 简单的 Markdown 语法渲染（段落、粗体、代码块）
  formatMarkdown(text) {
    let formatted = this.escapeHtml(text);

    // 粗体
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 多行代码块
    formatted = formatted.replace(/```(.*?)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre style="background: var(--surface-lowest); padding: 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 13px; margin: 12px 0; overflow-x: auto;"><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    // 单行行内代码
    formatted = formatted.replace(/`(.*?)`/g, '<code style="background: var(--surface-lowest); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 13px;">$1</code>');

    // 换行符转换为 <br>，保留段落感
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  }
};

window.AiChatController = AiChatController;
