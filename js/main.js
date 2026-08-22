/**
 * 825412-portal - 主逻辑控制器 (Main App Controller)
 */
document.addEventListener('DOMContentLoaded', () => {
  // 0. 初始化国际化多语言
  if (typeof I18nController !== 'undefined') {
    I18nController.init();
    const langBtn = document.getElementById('lang-switch-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => I18nController.toggleLanguage());
    }
  }

  // 1. 初始化各子模块
  ToolboxController.init();
  ClipboardController.init();
  AiChatController.init();
  if (typeof AirDropController !== 'undefined') AirDropController.init();
  if (typeof WebhookController !== 'undefined') WebhookController.init();

  // 2. 初始化单页路由 (Tab 切换)
  initRouting();

  // 3. 初始化设置模态框
  initSettingsModal();

  // 4. 模拟 Dashboard 系统资源监控
  startSystemMetricsMonitor();

  // 5. 自动检测 URL Hash 分享码并解析展示
  checkUrlHashPaste();

  // 6. 初始化隐私政策、服务条款、关于本站及联系我们模态框
  initLegalModals();

  // 7. 初始化 Cookie 同意横幅
  initCookieConsentBanner();
});

/**
 * 路由逻辑：侧边栏菜单切换
 */
function initRouting() {
  const navItems = document.querySelectorAll('.nav-item');
  const viewPanels = document.querySelectorAll('.view-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetViewId = item.getAttribute('data-target');

      // 切换导航栏高亮
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // 切换视图面板显示
      viewPanels.forEach(panel => panel.classList.remove('active'));
      const targetPanel = document.getElementById(targetViewId);
      if (targetPanel) targetPanel.classList.add('active');

      // 移动端点击导航项后自动关闭抽屉
      closeMobileSidebar();
    });
  });

  // 移动端菜单按钮与遮罩事件
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileLangBtn = document.getElementById('mobile-lang-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebar = document.getElementById('main-sidebar');

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active');
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      closeMobileSidebar();
    });
  }

  if (mobileLangBtn && typeof I18nController !== 'undefined') {
    mobileLangBtn.addEventListener('click', () => {
      I18nController.toggleLanguage();
    });
  }

  // 点击侧边栏底部法律条款等链接时，在手机端也自动收起抽屉
  document.querySelectorAll('.footer-link-item').forEach(item => {
    item.addEventListener('click', () => closeMobileSidebar());
  });

  // 控制台快捷方式映射到各自的 Tab
  const goToClip = document.getElementById('go-to-clipboard');
  if (goToClip) {
    goToClip.addEventListener('click', () => {
      triggerTabSwitch('clipboard-view');
    });
  }

  document.getElementById('go-to-ai').addEventListener('click', () => {
    triggerTabSwitch('ai-view');
  });

  // 快捷工具箱入口
  const shortcuts = document.querySelectorAll('.feature-shortcut');
  shortcuts.forEach(shortcut => {
    shortcut.addEventListener('click', () => {
      const toolType = shortcut.getAttribute('data-tool');
      triggerTabSwitch('toolbox-view');

      // 切换工具箱子 Tab
      const toolTabs = document.querySelectorAll('.toolbox-tab-btn');
      const toolViews = document.querySelectorAll('.tool-view');

      toolTabs.forEach(tab => tab.classList.remove('active'));
      toolViews.forEach(view => view.classList.remove('active'));

      const targetTabBtn = document.querySelector(`[data-tab="${toolType}-tab"]`);
      const targetTabView = document.getElementById(`${toolType}-tab`);
      if (targetTabBtn && targetTabView) {
        targetTabBtn.classList.add('active');
        targetTabView.classList.add('active');
      } else {
        document.querySelector('[data-tab="password-tab"]').classList.add('active');
        document.getElementById('password-tab').classList.add('active');
      }
    });
  });

  // 工具箱子选项卡切换逻辑
  const toolTabs = document.querySelectorAll('.toolbox-tab-btn');
  const toolViews = document.querySelectorAll('.tool-view');
  toolTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTabId = tab.getAttribute('data-tab');

      toolTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      toolViews.forEach(view => view.classList.remove('active'));
      document.getElementById(targetTabId).classList.add('active');
    });
  });
}

// 辅助函数：触发路由切换
function triggerTabSwitch(viewId) {
  const navItem = document.querySelector(`.nav-item[data-target="${viewId}"]`);
  if (navItem) {
    navItem.click();
  }
}

/**
 * 自动检查并解析 URL Hash 中的剪贴板分享链接
 */
function checkUrlHashPaste() {
  const hash = window.location.hash;
  if (hash.startsWith('#paste=')) {
    const code = hash.replace('#paste=', '').trim();
    if (code) {
      // 延迟一段时间执行，确保 Puter.js 已加载且环境就绪
      setTimeout(() => {
        if (typeof ClipboardController !== 'undefined') {
          ClipboardController.showPaste(code);
        }
      }, 1200);
    }
  } else if (hash.startsWith('#drop=')) {
    triggerTabSwitch('airdrop-view');
  } else if (hash.startsWith('#webhook')) {
    triggerTabSwitch('webhook-view');
    if (hash === '#webhook-test') {
      setTimeout(() => {
        const btn = document.getElementById('webhook-send-mock-btn');
        if (btn) btn.click();
      }, 500);
    }
  }
}

/**
 * 设置模态框交互逻辑
 */
function initSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const openBtn = document.getElementById('open-settings');
  const closeBtn = document.getElementById('close-settings');
  const cancelBtn = document.getElementById('cancel-settings');
  const saveBtn = document.getElementById('save-settings');
  const keyInput = document.getElementById('gemini-key-input');

  const openModal = () => {
    // 填充当前已存的 Key
    keyInput.value = StorageController.getGeminiKey();
    modal.classList.add('active');
  };

  const closeModal = () => {
    modal.classList.remove('active');
  };

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // 保存设置
  saveBtn.addEventListener('click', () => {
    const key = keyInput.value.trim();
    StorageController.saveGeminiKey(key);
    
    // 更新 AI 模块连接状态
    AiChatController.checkApiStatus();
    
    alert('配置已成功保存！');
    closeModal();
  });
}

/**
 * 隐私政策、关于本站与联系我们模态框逻辑
 */
function initLegalModals() {
  const bindModalEvents = (openIds, modalId, closeIds) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    openIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => modal.classList.add('active'));
      }
    });

    closeIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => modal.classList.remove('active'));
      }
    });
  };

  // 1. 绑定隐私政策模态框
  bindModalEvents(['open-privacy', 'footer-link-privacy'], 'privacy-modal', ['close-privacy', 'dismiss-privacy']);

  // 2. 绑定关于本站模态框
  bindModalEvents(['open-about', 'footer-link-about'], 'about-modal', ['close-about', 'dismiss-about']);

  // 3. 绑定联系我们模态框
  bindModalEvents(['open-contact', 'footer-link-contact'], 'contact-modal', ['close-contact', 'dismiss-contact']);

  // 4. 绑定服务条款模态框
  bindModalEvents(['open-terms', 'footer-link-terms'], 'terms-modal', ['close-terms', 'dismiss-terms']);
}

/**
 * Cookie 同意横幅 (Cookie Consent Banner) 交互逻辑
 */
function initCookieConsentBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const learnBtn = document.getElementById('cookie-learn-btn');
  const privacyModal = document.getElementById('privacy-modal');

  if (!banner) return;

  // 检查是否已同意
  const isAccepted = localStorage.getItem('cookie_consent_accepted');
  if (!isAccepted) {
    setTimeout(() => {
      banner.classList.add('active');
    }, 800);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent_accepted', 'true');
      banner.classList.remove('active');
    });
  }

  if (learnBtn) {
    learnBtn.addEventListener('click', () => {
      if (privacyModal) privacyModal.classList.add('active');
    });
  }
}

/**
 * 仪表盘访客连接网络监测器 (真实数据)
 */
function startSystemMetricsMonitor() {
  const pingText = document.getElementById('network-ping');
  const pingProgress = document.getElementById('ping-progress');
  const ipText = document.getElementById('visitor-ip');
  const locationText = document.getElementById('visitor-location');

  if (!pingText) return;

  // 1. 获取访客 IP 和地理位置
  async function fetchVisitorGeo() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        ipText.textContent = `IP: ${data.ip}`;
        locationText.textContent = `ISP: ${data.org} | ${data.city}, ${data.country_name}`;
      } else {
        throw new Error();
      }
    } catch (err) {
      ipText.textContent = 'IP: 未知/内网节点';
      locationText.textContent = '无法获取归属网格';
    }
  }

  // 2. 测算实时网络延迟 (Ping)
  function measurePing() {
    const startTime = Date.now();
    // 使用 HEAD 方法请求当前网页自身以测量延迟，防止缓存
    fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
      .then(() => {
        const latency = Date.now() - startTime;
        pingText.textContent = `${latency} ms`;
        
        // 渲染进度条：0ms ~ 300ms 对应 10% ~ 100% 进度
        const progressWidth = Math.min(100, Math.max(10, Math.floor((latency / 300) * 100)));
        pingProgress.style.width = `${progressWidth}%`;

        // 动态根据延迟修改进度条颜色
        if (latency < 100) {
          pingProgress.style.background = 'linear-gradient(to right, var(--color-tertiary), var(--color-secondary))';
        } else if (latency < 250) {
          pingProgress.style.background = 'linear-gradient(to right, var(--color-primary), var(--color-secondary))';
        } else {
          pingProgress.style.background = 'var(--color-error)';
        }
      })
      .catch(() => {
        pingText.textContent = 'OFFLINE';
        pingProgress.style.width = '0%';
      });
  }

  // 初始化调用
  fetchVisitorGeo();
  measurePing();

  // 每 5 秒重新测算一次 Ping 值
  setInterval(measurePing, 5000);
}

// 辅助函数：收起移动端侧边抽屉
function closeMobileSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
}

/**
 * ==========================================
 * 全局悬浮毛玻璃 Toast 通知流 (Toast Controller)
 * ==========================================
 */
const Toast = {
  container: null,

  init() {
    let el = document.getElementById('toast-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-container';
      el.className = 'toast-container';
      document.body.appendChild(el);
    }
    this.container = el;
  },

  show(message, type = 'info', duration = 2800) {
    if (!this.container) this.init();

    const icons = {
      success: 'check_circle',
      info: 'info',
      warning: 'warning',
      error: 'error'
    };

    const iconName = icons[type] || 'info';
    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    toast.innerHTML = `
      <span class="material-symbols-outlined" style="font-size: 20px; color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#06b6d4'};">${iconName}</span>
      <span style="flex-grow: 1;">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  info(msg) { this.show(msg, 'info'); },
  warning(msg) { this.show(msg, 'warning'); },
  error(msg) { this.show(msg, 'error'); }
};

// 暴露全局便捷通知
window.showToast = (msg, type) => Toast.show(msg, type);

/**
 * ==========================================
 * 极客全局指令面板 (Command Palette: Cmd+K / Ctrl+K)
 * ==========================================
 */
const CommandPalette = {
  backdrop: null,
  input: null,
  results: null,
  selectedIndex: 0,
  items: [
    { title: '控制台概览 (Dashboard Overview)', icon: 'dashboard', badge: 'Tab 1', action: () => triggerTabSwitch('dashboard-view') },
    { title: '极客隔空快传 (WebRTC P2P AirDrop)', icon: 'near_me', badge: 'Tab 2', action: () => triggerTabSwitch('airdrop-view') },
    { title: '极客开发者工具箱 (Geek Toolbox)', icon: 'construction', badge: 'Tab 3', action: () => triggerTabSwitch('toolbox-view') },
    { title: '匿名云剪贴板 (Anonymous Pastebin)', icon: 'content_paste', badge: 'Tab 4', action: () => triggerTabSwitch('clipboard-view') },
    { title: 'Webhook 调试桩 (Webhook Inspector)', icon: 'terminal', badge: 'Tab 5', action: () => triggerTabSwitch('webhook-view') },
    { title: 'AI 智能助手 (Gemini Chat)', icon: 'smart_toy', badge: 'Tab 6', action: () => triggerTabSwitch('ai-view') },
    { title: '一键生成高强度密码 (Generate Password)', icon: 'lock_reset', badge: 'Action', action: () => { triggerTabSwitch('toolbox-view'); if (typeof ToolboxController !== 'undefined') ToolboxController.generatePassword(); } },
    { title: '切换界面语言 (Toggle Language)', icon: 'translate', badge: 'i18n', action: () => { if (typeof I18nController !== 'undefined') I18nController.toggleLanguage(); } },
    { title: '打开设置中心 (Open Settings)', icon: 'settings', badge: 'Modal', action: () => { const modal = document.getElementById('settings-modal'); if (modal) modal.classList.add('active'); } },
    { title: '关于本站架构 (About Platform)', icon: 'info', badge: 'Link', action: () => { window.location.href = 'about.html'; } },
    { title: '隐私政策与合规 (Privacy Policy)', icon: 'privacy_tip', badge: 'Link', action: () => { window.location.href = 'privacy.html'; } }
  ],
  filteredItems: [],

  init() {
    this.createDOM();
    this.bindEvents();
    this.filteredItems = [...this.items];
  },

  createDOM() {
    if (document.getElementById('cmd-palette-backdrop')) return;

    const el = document.createElement('div');
    el.id = 'cmd-palette-backdrop';
    el.className = 'cmd-palette-backdrop';
    el.innerHTML = `
      <div class="cmd-palette-modal glass-panel">
        <div class="cmd-palette-header">
          <span class="material-symbols-outlined" style="color: var(--color-secondary); font-size: 22px;">terminal</span>
          <input type="text" id="cmd-palette-input" class="cmd-palette-input" placeholder="输入命令或工具名称 (按 ESC 退出)..." autocomplete="off" />
          <span class="cmd-badge">ESC</span>
        </div>
        <div id="cmd-palette-results" class="cmd-palette-results"></div>
        <div class="cmd-palette-footer">
          <span>导航: <kbd class="cmd-badge">↑</kbd> <kbd class="cmd-badge">↓</kbd> 选择: <kbd class="cmd-badge">↵ Enter</kbd></span>
          <span>825412.xyz Command Engine</span>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    this.backdrop = el;
    this.input = document.getElementById('cmd-palette-input');
    this.results = document.getElementById('cmd-palette-results');
  },

  bindEvents() {
    // 监听全局快捷键 Cmd+K / Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // 遮罩点击关闭
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    // 输入过滤
    this.input.addEventListener('input', () => {
      this.filter(this.input.value.trim().toLowerCase());
    });

    // 键盘导航
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredItems.length;
        this.renderResults();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
        this.renderResults();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeCurrent();
      }
    });
  },

  isOpen() {
    return this.backdrop.classList.contains('active');
  },

  open() {
    this.backdrop.classList.add('active');
    this.input.value = '';
    this.filteredItems = [...this.items];
    this.selectedIndex = 0;
    this.renderResults();
    setTimeout(() => this.input.focus(), 50);
  },

  close() {
    this.backdrop.classList.remove('active');
  },

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  },

  filter(query) {
    if (!query) {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item => 
        item.title.toLowerCase().includes(query) || item.badge.toLowerCase().includes(query)
      );
    }
    this.selectedIndex = 0;
    this.renderResults();
  },

  renderResults() {
    this.results.innerHTML = '';
    if (this.filteredItems.length === 0) {
      this.results.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">无匹配指令</div>`;
      return;
    }

    this.filteredItems.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = `cmd-palette-item ${idx === this.selectedIndex ? 'active' : ''}`;
      row.innerHTML = `
        <div class="cmd-palette-item-left">
          <span class="material-symbols-outlined" style="font-size: 18px; color: ${idx === this.selectedIndex ? 'var(--color-secondary)' : 'var(--text-muted)'};">${item.icon}</span>
          <span style="font-size: 13px;">${item.title}</span>
        </div>
        <span class="cmd-badge">${item.badge}</span>
      `;
      row.addEventListener('click', () => {
        this.selectedIndex = idx;
        this.executeCurrent();
      });
      this.results.appendChild(row);
    });

    const activeEl = this.results.children[this.selectedIndex];
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  },

  executeCurrent() {
    const current = this.filteredItems[this.selectedIndex];
    if (current && current.action) {
      this.close();
      current.action();
      Toast.info(`已执行: ${current.title}`);
    }
  }
};

// 注册 PWA Service Worker (离线可用与秒开加速)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration skipped:', err);
    });
  });
}

// 初始化全局增强组件
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  CommandPalette.init();
});


