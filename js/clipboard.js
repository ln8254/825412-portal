/**
 * 825412-portal - 匿名剪贴板服务逻辑 (Clipboard Controller)
 * 使用 KVdb.io (CORS-friendly & Global Shared Key-Value Store)
 */
const ClipboardController = {
  // 我们专属的公共匿名 Bucket ID
  BUCKET_ID: '8NDPDM74VJgDfqCMJkXjqQ',
  API_BASE: 'https://kvdb.io',

  init() {
    this.renderHistory();
    this.initSaveAction();
    this.initReadModalEvents();
  },

  // 渲染本地分享历史列表
  renderHistory() {
    const listContainer = document.getElementById('local-history-list');
    if (!listContainer) return;

    const history = StorageController.getPasteHistory();
    if (history.length === 0) {
      listContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 13px;">暂无本地历史...</div>';
      return;
    }

    listContainer.innerHTML = history.map(item => `
      <div class="history-item" onclick="ClipboardController.showPaste('${item.code}')">
        <div class="history-info">
          <span class="history-code">${item.code}</span>
          <span class="history-time">${new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <span class="material-symbols-outlined" style="color: var(--color-primary); font-size: 18px;">visibility</span>
      </div>
    `).join('');

    // 同时更新 Dashboard 上的最近分享预览
    const dashPreview = document.getElementById('dashboard-paste-preview');
    if (dashPreview && history.length > 0) {
      dashPreview.innerHTML = `
        <div style="color: var(--color-secondary); font-weight: 600; margin-bottom: 4px;">最近分享 (点击查看):</div>
        <a href="javascript:void(0)" onclick="ClipboardController.showPaste('${history[0].code}')" style="color: #fff; text-decoration: underline;">
          #paste=${history[0].code}
        </a>
      `;
    }
  },

  // 从云端读取并展示特定的剪贴板内容
  async showPaste(code) {
    const modal = document.getElementById('read-paste-modal');
    const metaInfo = document.getElementById('paste-meta-info');
    const contentArea = document.getElementById('read-paste-content');

    if (!modal) return;

    // 显示加载中状态
    contentArea.value = '正在建立安全神经连接，读取加密数据...';
    metaInfo.textContent = `剪贴板 #${code}：读取中...`;
    modal.classList.add('active');

    try {
      // 从 KVdb.io 提取数据 (标准跨域 GET)
      const response = await fetch(`${this.API_BASE}/${this.BUCKET_ID}/paste_${code}`);

      // 404 说明键不存在（已被销毁或从未创建）
      if (response.status === 404) {
        contentArea.value = '该剪贴板已被自动销毁或从未创建。';
        metaInfo.textContent = `剪贴板 #${code}：已销毁`;
        return;
      }

      if (!response.ok) {
        throw new Error('网络请求错误');
      }

      const data = await response.json();

      // 验证是否已过期
      if (Date.now() > data.expiresAt) {
        contentArea.value = '该分享链接已超出设定的有效期，已被自动销毁。';
        metaInfo.textContent = `剪贴板 #${code}：已过期`;
        
        // 自动在云端执行彻底销毁 (DELETE)
        fetch(`${this.API_BASE}/${this.BUCKET_ID}/paste_${code}`, { method: 'DELETE' }).catch(console.error);
        return;
      }

      // 正常显示
      contentArea.value = data.content;
      
      const timeRemaining = Math.max(0, Math.floor((data.expiresAt - Date.now()) / (60 * 1000)));
      let expiryText = '';
      if (timeRemaining > 60) {
        expiryText = `${Math.ceil(timeRemaining / 60)} 小时后自动销毁`;
      } else {
        expiryText = `${timeRemaining} 分钟后自动销毁`;
      }

      metaInfo.innerHTML = `剪贴板 <span style="color: var(--color-secondary); font-family: var(--font-mono); font-weight:600;">#${code}</span> (${expiryText})：`;

    } catch (err) {
      console.error(err);
      contentArea.value = '连接云端数据失败，请确认您的网络已连接。';
      metaInfo.textContent = `剪贴板 #${code}：读取失败`;
    }
  },

  // 初始化查看弹窗的事件绑定
  initReadModalEvents() {
    const modal = document.getElementById('read-paste-modal');
    const closeBtn = document.getElementById('close-read-paste');
    const dismissBtn = document.getElementById('dismiss-read-paste');
    const copyBtn = document.getElementById('copy-read-paste-btn');
    const contentArea = document.getElementById('read-paste-content');

    if (!modal) return;

    const hideModal = () => {
      modal.classList.remove('active');
      // 清空 URL 中的 Hash，避免重复触发
      if (window.location.hash.startsWith('#paste=')) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    };

    closeBtn.addEventListener('click', hideModal);
    dismissBtn.addEventListener('click', hideModal);

    copyBtn.addEventListener('click', () => {
      const text = contentArea.value;
      if (text && !text.startsWith('正在') && !text.startsWith('该剪贴板')) {
        navigator.clipboard.writeText(text).then(() => {
          alert('文本内容已成功复制！');
        });
      }
    });
  },

  // 初始化上传逻辑
  initSaveAction() {
    const saveBtn = document.getElementById('save-paste-btn');
    const contentText = document.getElementById('paste-content');
    const expirySelect = document.getElementById('paste-expiry');

    const shareBox = document.getElementById('share-link-box');
    const shareUrlDiv = document.getElementById('share-url');
    const copyShareBtn = document.getElementById('copy-share-btn');

    if (!saveBtn) return;

    saveBtn.addEventListener('click', async () => {
      const text = contentText.value.trim();
      if (!text) {
        alert('请输入需要分享的内容！');
        return;
      }

      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> 创建中...';

      try {
        const expiryHours = parseInt(expirySelect.value);

        // 1. 生成 6 位随机短代码
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // 2. 构造带过期时间戳的 JSON 数据
        const data = {
          content: text,
          expiresAt: Date.now() + (expiryHours * 60 * 60 * 1000)
        };

        // 3. 写入 KVdb.io 专属公共数据库 (标准跨域 POST)
        const response = await fetch(`${this.API_BASE}/${this.BUCKET_ID}/paste_${code}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('云端数据库写入失败');
        }

        // 4. 组装本域名的 Hash 访问地址
        const shareUrl = `${window.location.origin}${window.location.pathname}#paste=${code}`;

        // 5. 保存到本地历史记录并重新渲染
        StorageController.addPasteHistory(code, text, shareUrl);
        this.renderHistory();

        // 6. 展示分享结果
        shareUrlDiv.textContent = shareUrl;
        shareBox.style.display = 'block';
        
        // 自动滚动到侧边栏显示结果处
        shareBox.scrollIntoView({ behavior: 'smooth' });

        // 重置编辑器
        contentText.value = '';

      } catch (err) {
        console.error(err);
        alert('创建匿名分享失败，请检查网络连接或稍后再试。');
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span class="material-symbols-outlined">publish</span> 创建分享链接';
      }
    });

    // 复制链接按钮
    copyShareBtn.addEventListener('click', () => {
      const url = shareUrlDiv.textContent;
      if (url) {
        navigator.clipboard.writeText(url).then(() => {
          alert('站内分享链接已复制到剪贴板！');
        });
      }
    });
  }
};

window.ClipboardController = ClipboardController;
