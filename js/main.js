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
      document.getElementById(targetViewId).classList.add('active');
    });
  });

  // 控制台快捷方式映射到各自的 Tab
  document.getElementById('go-to-clipboard').addEventListener('click', () => {
    triggerTabSwitch('clipboard-view');
  });

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


