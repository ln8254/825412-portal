/**
 * 825412-portal - 匿名剪贴板服务逻辑 (Clipboard Controller)
 */
const ClipboardController = {
  init() {
    this.renderHistory();
    this.initSaveAction();
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
      <div class="history-item" onclick="window.open('${item.shareUrl}', '_blank')">
        <div class="history-info">
          <span class="history-code">${item.code}</span>
          <span class="history-time">${new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <span class="material-symbols-outlined" style="color: var(--text-secondary); font-size: 18px;">open_in_new</span>
      </div>
    `).join('');

    // 同时更新 Dashboard 上的最近分享预览
    const dashPreview = document.getElementById('dashboard-paste-preview');
    if (dashPreview && history.length > 0) {
      dashPreview.innerHTML = `
        <div style="color: var(--color-secondary); font-weight: 600; margin-bottom: 4px;">最近分享:</div>
        <a href="${history[0].shareUrl}" target="_blank" style="color: #fff; text-decoration: underline;">
          ${history[0].code} (${new Date(history[0].timestamp).toLocaleDateString()})
        </a>
      `;
    }
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
        // dpaste 接受 expiry_days (1 to 365)
        // 为了简便，我们将其转换为天数，至少为 1 天。
        const expiryDays = Math.ceil(expiryHours / 24);

        // 使用 dpaste.org 的公共免认证 API 端点进行 POST 请求
        const response = await fetch('https://dpaste.org/api/v2/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            content: text,
            expiry_days: expiryDays.toString(),
            syntax: 'text'
          })
        });

        if (!response.ok) {
          throw new Error('网络请求失败，请稍后重试。');
        }

        // 返回的结果直接就是剪贴板分享链接（例如 https://dpaste.org/ABCD）
        let shareUrl = await response.text();
        shareUrl = shareUrl.trim();

        // 提取一个简短的代码（比如末尾的4位/6位字符）用于本地历史展示
        const code = shareUrl.substring(shareUrl.lastIndexOf('/') + 1);

        // 保存到本地存储并刷新渲染
        StorageController.addPasteHistory(code, text, shareUrl);
        this.renderHistory();

        // 展示分享链接
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
          alert('分享链接已复制到剪贴板！');
        });
      }
    });
  }
};

window.ClipboardController = ClipboardController;
