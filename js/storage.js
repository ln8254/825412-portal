/**
 * 825412-portal - 本地存储组件 (Storage Controller)
 */
const StorageController = {
  // 获取 Gemini API 密钥
  getGeminiKey() {
    return localStorage.getItem('gemini_api_key') || '';
  },

  // 保存 Gemini API 密钥
  saveGeminiKey(key) {
    if (key) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  },

  // 获取本地剪贴板历史
  getPasteHistory() {
    const history = localStorage.getItem('paste_history');
    return history ? JSON.parse(history) : [];
  },

  // 新增剪贴板历史记录
  addPasteHistory(code, content, shareUrl) {
    const history = this.getPasteHistory();
    // 限制历史记录最多 10 条
    const updated = [
      {
        code,
        content: content.length > 50 ? content.substring(0, 50) + '...' : content,
        shareUrl,
        timestamp: Date.now()
      },
      ...history.slice(0, 9)
    ];
    localStorage.setItem('paste_history', JSON.stringify(updated));
    return updated;
  }
};

window.StorageController = StorageController;
