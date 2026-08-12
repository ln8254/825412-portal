/**
 * 825412-portal - AI 智能对话逻辑 (AI Chat Controller)
 */
const AiChatController = {
  init() {
    this.checkApiStatus();
    this.initChatAction();
  },

  // 检查 API Key 配置状态并启用/禁用输入，同时拉取可用模型
  async checkApiStatus() {
    const key = StorageController.getGeminiKey();
    const chatInput = document.getElementById('chat-user-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const statusText = document.getElementById('ai-status-text');

    const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';

    if (key) {
      if (chatInput) chatInput.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
      if (chatInput) chatInput.placeholder = isEn ? 'Type your question and press Enter...' : '输入您的问题，按回车发送...';
      if (statusText) {
        statusText.innerHTML = isEn 
          ? '<span style="color: var(--color-tertiary); font-weight: 600;">Neural Link Active.</span> Connected to Gemini API Core.' 
          : '<span style="color: var(--color-tertiary); font-weight: 600;">神经网络连接就绪。</span> 已连接至 Gemini API 核心。';
      }
      
      // 动态拉取当前 API Key 支持的全部模型列表
      await this.fetchAvailableModels(key);
    } else {
      if (chatInput) chatInput.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
      if (chatInput) chatInput.placeholder = isEn ? 'Please configure your Gemini API Key in Settings first...' : '请先在左下角设置中心配置您的 Gemini API Key...';
      if (statusText) {
        statusText.innerHTML = isEn 
          ? 'API Key missing. Enter key in Settings to activate AI Chat link.' 
          : '未配置 API Key。请输入你的密钥以启用高级人工智能对话链路。';
      }
    }
  },

  // 动态获取当前 API Key 支持的模型列表
  async fetchAvailableModels(key) {
    const modelSelect = document.getElementById('ai-model-select');
    if (!modelSelect) return;

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      if (!res.ok) return;

      const data = await res.json();
      if (data.models && Array.isArray(data.models)) {
        // 筛选支持 generateContent 的对话模型
        const chatModels = data.models.filter(m => 
          m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
        );

        if (chatModels.length > 0) {
          const savedModel = StorageController.getSelectedModel();
          modelSelect.innerHTML = chatModels.map(m => {
            const rawName = m.name.replace('models/', '');
            const isSelected = (m.name === savedModel || rawName === savedModel.replace('models/', '')) ? 'selected' : '';
            return `<option value="${m.name}" ${isSelected}>${rawName}</option>`;
          }).join('');

          // 如果有被设为选中的，进行保存
          StorageController.saveSelectedModel(modelSelect.value);
        }
      }
    } catch (err) {
      console.warn('动态拉取 Gemini 模型列表失败，使用默认列表:', err);
    }
  },

  // 初始化发送与接收逻辑
  initChatAction() {
    const input = document.getElementById('chat-user-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const container = document.getElementById('chat-messages-container');
    const modelSelect = document.getElementById('ai-model-select');

    if (modelSelect) {
      modelSelect.addEventListener('change', (e) => {
        StorageController.saveSelectedModel(e.target.value);
      });
    }

    if (!input) return;

    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text) return;

      // 1. 添加用户消息
      this.appendMessage('user', text);
      input.value = '';

      // 2. 添加等待状态
      const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
      const thinkingText = isEn ? 'AI is analyzing instructions, establishing neural link...' : 'AI 正在分析指令，建立神经连接...';
      const thinkingId = this.appendMessage('ai', thinkingText);
      const thinkingElement = document.getElementById(thinkingId);

      try {
        const apiKey = StorageController.getGeminiKey();
        const selectedModelFull = modelSelect ? modelSelect.value : StorageController.getSelectedModel();
        const modelName = selectedModelFull.replace('models/', '');
        
        // 发送 API 请求 (使用用户选定的模型)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
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

  msgSeq: 0,

  // 往聊天窗口插入一条消息
  appendMessage(role, text) {
    const container = document.getElementById('chat-messages-container');
    this.msgSeq = (this.msgSeq || 0) + 1;
    const messageId = `msg-${Date.now()}-${this.msgSeq}-${Math.floor(Math.random() * 1000)}`;
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
