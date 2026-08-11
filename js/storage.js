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

  // 获取用户选择的 AI 模型
  getSelectedModel() {
    return localStorage.getItem('gemini_selected_model') || 'models/gemini-2.5-flash';
  },

  // 保存用户选择的 AI 模型
  saveSelectedModel(model) {
    if (model) {
      localStorage.setItem('gemini_selected_model', model);
    }
  },

  // 获取语言设置 (默认根据浏览器自动判定 zh-CN 或 en-US)
  getLanguage() {
    const saved = localStorage.getItem('app_language');
    if (saved) return saved;
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return browserLang.startsWith('zh') ? 'zh-CN' : 'en-US';
  },

  // 保存语言设置
  saveLanguage(lang) {
    if (lang) {
      localStorage.setItem('app_language', lang);
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
