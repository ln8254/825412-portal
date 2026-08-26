/**
 * 825412-portal - 匿名剪贴板服务逻辑 (Clipboard Controller)
 * 使用公共免认证 RESTful API (CORS-friendly, Global Shared sandbox)
 */
const ClipboardController = {
  API_BASE: 'https://api.restful-api.dev/objects',

  init() {
    this.renderHistory();
    this.initSaveAction();
    this.initReadModalEvents();
  },

  // 渲染本地分享历史列表
  renderHistory() {
    const listContainer = document.getElementById('local-history-list');
    if (!listContainer) return;

    const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
    const history = StorageController.getPasteHistory();
    if (history.length === 0) {
      const emptyText = isEn ? 'No local history yet...' : '暂无本地历史...';
      listContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 13px;">${emptyText}</div>`;
      return;
    }

    listContainer.innerHTML = history.map(item => `
      <div class="history-item" onclick="ClipboardController.showPaste('${item.code}')">
        <div class="history-info">
          <span class="history-code" style="font-size: 11px;">#${item.code.substring(0, 8)}...</span>
          <span class="history-time">${new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <span class="material-symbols-outlined" style="color: var(--color-primary); font-size: 18px;">visibility</span>
      </div>
    `).join('');

    // 同时更新 Dashboard 上的最近分享预览
    const dashPreview = document.getElementById('dashboard-paste-preview');
    if (dashPreview && history.length > 0) {
      const recentLabel = isEn ? 'Recent Share (Click to view):' : '最近分享 (点击查看):';
      dashPreview.innerHTML = `
        <div style="color: var(--color-secondary); font-weight: 600; margin-bottom: 4px;">${recentLabel}</div>
        <a href="javascript:void(0)" onclick="ClipboardController.showPaste('${history[0].code}')" style="color: #fff; text-decoration: underline; font-size: 13px; font-family: var(--font-mono);">
          #paste=${history[0].code.substring(0, 8)}...
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
    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    contentArea.value = isEn ? "Establishing secure neural link, reading encrypted payload..." : "正在建立安全神经连接，读取加密数据...";
    metaInfo.textContent = isEn ? `Clipboard #${code.substring(0, 8)}...: Reading...` : `剪贴板 #${code.substring(0, 8)}...：读取中...`;
    modal.classList.add('active');

    try {
      // 从公共 REST API 获取数据
      const response = await fetch(`${this.API_BASE}/${code}`);

      // 404 说明键不存在（已被销毁或从未创建）
      if (response.status === 404 || response.status === 400) {
        const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        contentArea.value = isEn ? "This paste was auto-destroyed or never created." : "该剪贴板已被自动销毁或从未创建。";
        metaInfo.textContent = isEn ? `Clipboard #${code.substring(0, 8)}...: Destroyed` : `剪贴板 #${code.substring(0, 8)}...：已销毁`;
        return;
      }

      if (!response.ok) {
        throw new Error('网络请求错误');
      }

      const resData = await response.json();
      
      // 有些公共数据可能不包含我们的特定格式，做安全检查
      if (!resData.data || !resData.data.expiresAt) {
        const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        contentArea.value = isEn ? "Data format is invalid for this clipboard system." : "该数据不属于本匿名剪贴板系统。";
        metaInfo.textContent = isEn ? `Clipboard #${code.substring(0, 8)}...: Invalid` : `剪贴板 #${code.substring(0, 8)}...：无效数据`;
        return;
      }

      const data = resData.data;

      // 验证是否已过期
      if (Date.now() > data.expiresAt) {
        const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        contentArea.value = isEn ? "This paste exceeded its TTL and has been automatically destroyed." : "该分享链接已超出设定的有效期，已被自动销毁。";
        metaInfo.textContent = isEn ? `Clipboard #${code.substring(0, 8)}...: Expired` : `剪贴板 #${code.substring(0, 8)}...：已过期`;
        
        // 自动在云端执行彻底销毁 (DELETE)
        fetch(`${this.API_BASE}/${code}`, { method: 'DELETE' }).catch(console.error);
        return;
      }

      // 正常显示
      contentArea.value = data.content;
      
      const timeRemaining = Math.max(0, Math.floor((data.expiresAt - Date.now()) / (60 * 1000)));
      let expiryText = '';
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      if (timeRemaining > 60) {
        expiryText = isEn ? `Expires in ${Math.ceil(timeRemaining / 60)} hrs` : `${Math.ceil(timeRemaining / 60)} 小时后自动销毁`;
      } else {
        expiryText = isEn ? `Expires in ${timeRemaining} mins` : `${timeRemaining} 分钟后自动销毁`;
      }

      const labelPrefix = isEn ? "Clipboard" : "剪贴板";
      metaInfo.innerHTML = `${labelPrefix} <span style="color: var(--color-secondary); font-family: var(--font-mono); font-weight:600;">#${code.substring(0, 8)}...</span> (${expiryText}):`;

    } catch (err) {
      console.error(err);
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      contentArea.value = isEn ? "Failed to connect to cloud storage. Please check network connection." : "连接云端数据失败，请确认您的网络已连接。";
      metaInfo.textContent = isEn ? `Clipboard #${code.substring(0, 8)}...: Read Failed` : `剪贴板 #${code.substring(0, 8)}...：读取失败`;
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
          if (typeof Toast !== 'undefined') const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
          Toast.success(isEn ? "Content copied to clipboard!" : "文本内容已成功复制！");
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
        if (typeof Toast !== 'undefined') const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        Toast.warning(isEn ? "Please enter content to share!" : "请输入需要分享的内容！");
        return;
      }

      saveBtn.disabled = true;
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      saveBtn.innerHTML = `<span class="material-symbols-outlined">sync</span> ${isEn ? "Creating..." : "创建中..."}`;

      try {
        const expiryHours = parseInt(expirySelect.value);

        // 构造数据 payload
        const payload = {
          name: '825412_paste',
          data: {
            content: text,
            expiresAt: Date.now() + (expiryHours * 60 * 60 * 1000)
          }
        };

        // 写入公共 REST API (标准跨域 POST)
        const response = await fetch(this.API_BASE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('云端数据沙盒写入失败');
        }

        const resData = await response.json();
        
        // 提取服务器自动生成的全局唯一 ID 作为我们的分享代码
        const code = resData.id;

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
        if (typeof Toast !== 'undefined') Toast.success(isEn ? "Ephemeral share link created!" : "匿名分享链接创建成功！");

      } catch (err) {
        console.error(err);
        if (typeof Toast !== 'undefined') const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        Toast.error(isEn ? "Failed to create share. Check network and try again." : "创建匿名分享失败，请检查网络连接或稍后再试。");
      } finally {
        saveBtn.disabled = false;
        const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        saveBtn.innerHTML = `<span class="material-symbols-outlined">publish</span> ${isEn ? "Create Share Link" : "创建分享链接"}`;
      }
    });

    // 复制链接按钮
    copyShareBtn.addEventListener('click', () => {
      const url = shareUrlDiv.textContent;
      if (url) {
        navigator.clipboard.writeText(url).then(() => {
          if (typeof Toast !== 'undefined') const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
          Toast.success(isEn ? "Share link copied to clipboard!" : "站内分享链接已复制到剪贴板！");
        });
      }
    });
  }
};

window.ClipboardController = ClipboardController;
