/**
 * 825412-portal - Webhook 调试桩与 API Echo 控制器 (Webhook Inspector)
 * 支持：实时生成公网 Webhook 接收地址、捕获 HTTP POST/GET、请求头/JSON Body 可视化解析
 */
const WebhookController = {
  hookId: '',
  API_BASE: 'https://api.restful-api.dev/objects',
  pollInterval: null,
  capturedRequests: [],

  init() {
    this.initHookIdentity();
    this.initMockSender();
    this.initControls();
    this.startListening();
  },

  // 1. 初始化 Webhook 专属端点 ID
  initHookIdentity() {
    let savedHook = localStorage.getItem('my_webhook_id');
    if (!savedHook) {
      savedHook = 'hook_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('my_webhook_id', savedHook);
    }
    this.hookId = savedHook;

    const urlDisplay = document.getElementById('webhook-url-display');
    const endpointUrl = `https://api.restful-api.dev/objects (Target: 825412_${this.hookId})`;
    if (urlDisplay) urlDisplay.textContent = endpointUrl;

    const curlSnippet = document.getElementById('webhook-curl-snippet');
    if (curlSnippet) {
      curlSnippet.textContent = `curl -X POST "${this.API_BASE}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "825412_${this.hookId}", "data": {"event": "payment.success", "amount": 99.00, "user": "alice@825412.xyz"}}'`;
    }
  },

  // 2. 控制台按钮交互
  initControls() {
    const copyUrlBtn = document.getElementById('webhook-copy-url-btn');
    const copyCurlBtn = document.getElementById('webhook-copy-curl-btn');
    const clearBtn = document.getElementById('webhook-clear-btn');
    const refreshBtn = document.getElementById('webhook-refresh-btn');

    if (copyUrlBtn) {
      copyUrlBtn.addEventListener('click', () => {
        const text = `https://api.restful-api.dev/objects`;
        navigator.clipboard.writeText(text).then(() => {
          alert('Webhook 接收 API 地址已复制到剪贴板！');
        });
      });
    }

    if (copyCurlBtn) {
      copyCurlBtn.addEventListener('click', () => {
        const curlSnippet = document.getElementById('webhook-curl-snippet');
        if (curlSnippet) {
          navigator.clipboard.writeText(curlSnippet.textContent).then(() => {
            alert('cURL 快速测试命令已复制！');
          });
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.capturedRequests = [];
        this.renderRequestList();
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.fetchIncomingRequests();
      });
    }
  },

  // 3. 内置模拟发送器 (方便用户在前端直接模拟触发 Webhook)
  initMockSender() {
    const sendBtn = document.getElementById('webhook-send-mock-btn');
    const methodSelect = document.getElementById('webhook-mock-method');
    const bodyInput = document.getElementById('webhook-mock-body');

    if (!sendBtn || !bodyInput) return;

    sendBtn.addEventListener('click', async () => {
      const method = methodSelect ? methodSelect.value : 'POST';
      let payloadData = {};
      try {
        payloadData = JSON.parse(bodyInput.value.trim() || '{}');
      } catch (e) {
        payloadData = { raw_text: bodyInput.value };
      }

      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> 发送中...';

      try {
        const record = {
          name: `825412_${this.hookId}`,
          data: {
            method: method,
            headers: {
              'User-Agent': navigator.userAgent,
              'Content-Type': 'application/json',
              'Accept': '*/*',
              'X-Client-Timestamp': new Date().toISOString()
            },
            body: payloadData,
            timestamp: Date.now()
          }
        };

        const res = await fetch(this.API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });

        if (res.ok) {
          alert('模拟 Webhook 请求已成功送达端点！');
          this.fetchIncomingRequests();
        }
      } catch (err) {
        console.error(err);
        alert('发送失败，请检查网络连接。');
      } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span class="material-symbols-outlined">send</span> 发送模拟请求';
      }
    });
  },

  // 4. 轮询捕获接收到的请求
  startListening() {
    this.fetchIncomingRequests();
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => this.fetchIncomingRequests(), 4000);
  },

  async fetchIncomingRequests() {
    try {
      const res = await fetch(this.API_BASE);
      if (!res.ok) return;

      const list = await res.json();
      if (!Array.isArray(list)) return;

      const matching = list.filter(item => item.name === `825412_${this.hookId}` && item.data);
      if (matching.length > 0) {
        // 去重合并
        matching.forEach(item => {
          if (!this.capturedRequests.some(r => r.id === item.id)) {
            this.capturedRequests.unshift({
              id: item.id,
              ...item.data
            });
          }
        });
        this.renderRequestList();
      }
    } catch (e) {
      // 容错处理
    }
  },

  renderRequestList() {
    const listEl = document.getElementById('webhook-requests-list');
    const emptyEl = document.getElementById('webhook-empty-state');
    const countEl = document.getElementById('webhook-count-badge');

    if (!listEl) return;

    if (countEl) countEl.textContent = `${this.capturedRequests.length} 条请求`;

    if (this.capturedRequests.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      listEl.innerHTML = '';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    listEl.innerHTML = this.capturedRequests.map((req, idx) => {
      const method = req.method || 'POST';
      const timeStr = req.timestamp ? new Date(req.timestamp).toLocaleTimeString() : '刚刚';
      const bodyJson = typeof req.body === 'object' ? JSON.stringify(req.body, null, 2) : (req.body || '{}');

      return `
        <div class="glass-card" style="margin-bottom: 12px; padding: 16px; border-left: 4px solid var(--color-secondary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: var(--color-secondary); color: #0f172a; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-family: var(--font-mono);">${method}</span>
              <span style="font-family: var(--font-mono); font-size: 13px; color: var(--text-primary);">/webhook/listener</span>
            </div>
            <span style="font-size: 12px; color: var(--text-muted);">${timeStr}</span>
          </div>

          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
            <strong>Request Headers:</strong>
            <pre style="background: var(--surface-low); padding: 8px; border-radius: 4px; font-family: var(--font-mono); margin-top: 4px; overflow-x: auto;">${JSON.stringify(req.headers || {}, null, 2)}</pre>
          </div>

          <div style="font-size: 12px; color: var(--text-secondary);">
            <strong>JSON Payload Body:</strong>
            <pre style="background: var(--surface-low); padding: 8px; border-radius: 4px; font-family: var(--font-mono); color: #38bdf8; margin-top: 4px; overflow-x: auto;">${bodyJson}</pre>
          </div>
        </div>
      `;
    }).join('');
  }
};

window.WebhookController = WebhookController;
