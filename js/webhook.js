/**
 * 825412-portal - Webhook 调试桩与 API Echo 控制器 (Webhook Inspector)
 * 支持：一键模拟发送、模板快速切换、请求头/JSON Body 可视化、cURL/Fetch/Python 代码生成
 */
const WebhookController = {
  hookId: '',
  capturedRequests: [],

  templates: {
    payment: {
      event: "payment.completed",
      order_id: "ORD_20260818_9981",
      amount: 199.00,
      currency: "CNY",
      channel: "wechat_pay",
      customer: {
        name: "极客开发者",
        email: "operator@825412.xyz"
      }
    },
    github: {
      event: "push",
      repository: "ln8254/825412-portal",
      branch: "main",
      commits: [
        {
          id: "ce0b4c9",
          message: "Feat: Major content and utility upgrade",
          author: "Alex <alex@825412.xyz>"
        }
      ]
    },
    stripe: {
      id: "evt_3NxxxStripeLive",
      object: "event",
      type: "invoice.payment_succeeded",
      data: {
        amount_paid: 2999,
        currency: "usd",
        status: "paid"
      }
    }
  },

  init() {
    this.initHookIdentity();
    this.initMockSender();
    this.initControls();
    this.loadHistory();
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
    const endpointUrl = `https://echo.free.beeceptor.com/webhook/825412_${this.hookId}`;
    if (urlDisplay) urlDisplay.textContent = endpointUrl;

    this.updateCurlSnippet();
  },

  updateCurlSnippet() {
    const curlSnippet = document.getElementById('webhook-curl-snippet');
    if (curlSnippet) {
      curlSnippet.textContent = `curl -X POST "https://echo.free.beeceptor.com/webhook/825412_${this.hookId}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-Webhook-Source: 825412-Portal" \\\n  -d '{\n    "event": "payment.completed",\n    "order_id": "ORD_20260818_9981",\n    "amount": 199.00,\n    "user": "operator@825412.xyz"\n  }'`;
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
        const text = `https://echo.free.beeceptor.com/webhook/825412_${this.hookId}`;
        navigator.clipboard.writeText(text).then(() => {
          alert('专属 Webhook 接收地址已复制到剪贴板！');
        });
      });
    }

    if (copyCurlBtn) {
      copyCurlBtn.addEventListener('click', () => {
        const curlSnippet = document.getElementById('webhook-curl-snippet');
        if (curlSnippet) {
          navigator.clipboard.writeText(curlSnippet.textContent).then(() => {
            alert('cURL 快速测试命令已复制！可在电脑终端中直接回车发送。');
          });
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.capturedRequests = [];
        localStorage.removeItem('webhook_captured_logs');
        this.renderRequestList();
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.renderRequestList();
        alert('请求列表已更新！');
      });
    }
  },

  // 3. 内置模拟发送器
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
      sendBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> 正在模拟触发...';

      // 1. 构造捕获报文
      const newRequest = {
        id: 'req_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        method: method,
        url: `/webhook/listener?target=825412_${this.hookId}`,
        headers: {
          'Host': '825412.xyz',
          'User-Agent': navigator.userAgent,
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'X-Webhook-Event': payloadData.event || 'custom.trigger',
          'X-Signature-SHA256': 'sha256=' + Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b=>b.toString(16).padStart(2,'0')).join(''),
          'X-Client-Timestamp': new Date().toISOString()
        },
        body: payloadData,
        timestamp: Date.now()
      };

      // 2. 模拟网络往返延迟 (200ms)
      await new Promise(r => setTimeout(r, 200));

      this.capturedRequests.unshift(newRequest);
      this.saveHistory();
      this.renderRequestList();

      sendBtn.disabled = false;
      sendBtn.innerHTML = '<span class="material-symbols-outlined">send</span> 发送模拟请求';
    });
  },

  saveHistory() {
    // 保留最近 20 条请求
    if (this.capturedRequests.length > 20) {
      this.capturedRequests = this.capturedRequests.slice(0, 20);
    }
    localStorage.setItem('webhook_captured_logs', JSON.stringify(this.capturedRequests));
  },

  loadHistory() {
    const saved = localStorage.getItem('webhook_captured_logs');
    if (saved) {
      try {
        this.capturedRequests = JSON.parse(saved);
      } catch (e) {
        this.capturedRequests = [];
      }
    }
    this.renderRequestList();
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

      const methodColors = {
        'POST': 'background: #06b6d4; color: #0f172a;',
        'GET': 'background: #10b981; color: #0f172a;',
        'PUT': 'background: #f59e0b; color: #0f172a;',
        'DELETE': 'background: #ef4444; color: #fff;'
      };

      return `
        <div class="glass-card" style="margin-bottom: 14px; padding: 16px; border-left: 4px solid var(--color-secondary); animation: fadeIn 0.3s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="${methodColors[method] || methodColors['POST']} font-weight: 800; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-family: var(--font-mono);">${method}</span>
              <span style="font-family: var(--font-mono); font-size: 13px; color: var(--text-primary); font-weight: 600;">/webhook/listener</span>
            </div>
            <span style="font-size: 12px; color: var(--text-muted);">${timeStr}</span>
          </div>

          <!-- Request Headers -->
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
            <div style="font-weight: 600; color: #94a3b8; margin-bottom: 4px;">Request Headers:</div>
            <pre style="background: var(--surface-low); padding: 8px 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; margin: 0; overflow-x: auto; color: #cbd5e1;">${JSON.stringify(req.headers || {}, null, 2)}</pre>
          </div>

          <!-- JSON Payload Body -->
          <div style="font-size: 12px; color: var(--text-secondary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-weight: 600; color: #38bdf8;">JSON Payload Body:</span>
              <button class="btn copy-webhook-json-btn" data-json-idx="${idx}" style="padding: 2px 8px; font-size: 11px; background: var(--surface-high);">
                <span class="material-symbols-outlined" style="font-size: 12px; vertical-align: middle;">content_copy</span> 复制 JSON
              </button>
            </div>
            <pre style="background: var(--surface-low); padding: 8px 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; color: #38bdf8; margin: 0; overflow-x: auto;">${bodyJson}</pre>
          </div>
        </div>
      `;
    }).join('');

    // 绑定所有复制 JSON 按钮事件
    listEl.querySelectorAll('.copy-webhook-json-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-json-idx'));
        const item = this.capturedRequests[idx];
        if (item && item.body) {
          const text = typeof item.body === 'object' ? JSON.stringify(item.body, null, 2) : item.body;
          navigator.clipboard.writeText(text).then(() => {
            alert('已成功复制 Payload JSON 数据！');
          });
        }
      });
    });
  }
};

window.WebhookController = WebhookController;
