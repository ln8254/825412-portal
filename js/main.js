/**
 * 825412-portal - 主逻辑控制器 (Main App Controller)
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. 优先初始化核心单页路由 (确保菜单与点击绝对可用)
  try {
    initRouting();
  } catch (e) {
    console.error('Init Routing Error:', e);
  }

  // 2. 初始化国际化多语言
  try {
    if (typeof I18nController !== 'undefined') {
      I18nController.init();
      const langBtn = document.getElementById('lang-switch-btn');
      if (langBtn) {
        langBtn.addEventListener('click', () => I18nController.toggleLanguage());
      }
    }
  } catch (e) {
    console.error('Init I18n Error:', e);
  }

  // 3. 隔离初始化各功能子模块
  const safeInit = (name, controller) => {
    try {
      if (typeof controller !== 'undefined' && controller.init) {
        controller.init();
      }
    } catch (err) {
      console.error(`Module ${name} init error:`, err);
    }
  };

  safeInit('Toolbox', typeof ToolboxController !== 'undefined' ? ToolboxController : undefined);
  safeInit('Clipboard', typeof ClipboardController !== 'undefined' ? ClipboardController : undefined);
  safeInit('AiChat', typeof AiChatController !== 'undefined' ? AiChatController : undefined);
  safeInit('AirDrop', typeof AirDropController !== 'undefined' ? AirDropController : undefined);
  safeInit('Webhook', typeof WebhookController !== 'undefined' ? WebhookController : undefined);

  // 4. 初始化设置模态框
  try { initSettingsModal(); } catch (e) { console.error(e); }

  // 5. 初始化控制台全景网络与系统节点监控中心 (Network Operations Center)
  try { initDashboardNetworkCenter(); } catch (e) { console.error('Dashboard Network Center Error:', e); }

  // 6. 自动检测 URL 参数与 Hash 分享码并深度直达目标功能
  try { handleUrlRoutingAndDeepLinks(); } catch (e) { console.error(e); }

  // 7. 初始化隐私政策、服务条款、关于本站及联系我们模态框
  try { initLegalModals(); } catch (e) { console.error(e); }

  // 8. 初始化 Cookie 同意横幅
  try { initCookieConsentBanner(); } catch (e) { console.error(e); }
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

  const goToAi = document.getElementById('go-to-ai');
  if (goToAi) {
    goToAi.addEventListener('click', () => {
      triggerTabSwitch('ai-view');
    });
  }

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
        const defBtn = document.querySelector('[data-tab="password-tab"]');
        const defView = document.getElementById('password-tab');
        if (defBtn) defBtn.classList.add('active');
        if (defView) defView.classList.add('active');
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
      const targetView = document.getElementById(targetTabId);
      if (targetView) targetView.classList.add('active');
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
 * 自动检查并解析 URL 参数 (?view=, ?room=, ?paste=) 与 URL Hash (#drop=, #paste=, #webhook) 深度直达路由
 */
function handleUrlRoutingAndDeepLinks() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash;

  // 1. 极客隔空快传 (?view=airdrop, ?room=ABCDE, #drop=ABCDE)
  const roomParam = params.get('room');
  if (params.get('view') === 'airdrop' || roomParam || hash.startsWith('#drop=')) {
    triggerTabSwitch('airdrop-view');
    const roomId = roomParam || (hash.startsWith('#drop=') ? hash.replace('#drop=', '').trim() : '');
    if (roomId && typeof AirDropController !== 'undefined') {
      setTimeout(() => {
        AirDropController.joinRoom(roomId);
      }, 100);
    }
    return;
  }

  // 2. 匿名云剪贴板 (?view=clipboard, #paste=CODE)
  if (params.get('view') === 'clipboard' || hash.startsWith('#paste=')) {
    triggerTabSwitch('clipboard-view');
    const code = params.get('paste') || (hash.startsWith('#paste=') ? hash.replace('#paste=', '').trim() : '');
    if (code) {
      setTimeout(() => {
        if (typeof ClipboardController !== 'undefined') {
          ClipboardController.showPaste(code);
        }
      }, 1200);
    }
    return;
  }

  // 3. Webhook 调试桩 (?view=webhook, #webhook)
  if (params.get('view') === 'webhook' || hash.startsWith('#webhook')) {
    triggerTabSwitch('webhook-view');
    if (hash === '#webhook-test' || params.get('mock') === 'true') {
      setTimeout(() => {
        const btn = document.getElementById('webhook-send-mock-btn');
        if (btn) btn.click();
      }, 500);
    }
    return;
  }

  // 4. 开发者工具箱 (?view=toolbox, ?tool=jwt / json / password / hash / time / text)
  if (params.get('view') === 'toolbox') {
    triggerTabSwitch('toolbox-view');
    const tool = params.get('tool');
    if (tool) {
      setTimeout(() => {
        const tabBtn = document.querySelector(`[data-tab="${tool}-tab"]`);
        if (tabBtn) tabBtn.click();
      }, 100);
    }
    return;
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
    
    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      alert(isEn ? "Settings saved successfully!" : "配置已成功保存！");
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
 * 控制台全景网络枢纽与系统节点监控中心 (Network Operations Center)
 */
function initDashboardNetworkCenter() {
  const publicIpEl = document.getElementById('net-public-ip');
  const geoInfoEl = document.getElementById('net-geo-info');
  const refreshIpBtn = document.getElementById('net-ip-refresh-btn');
  const webrtcStatusEl = document.getElementById('net-webrtc-status');
  const webrtcCandidatesEl = document.getElementById('net-webrtc-candidates');

  const pingText = document.getElementById('network-ping');
  const pingProgress = document.getElementById('ping-progress');

  const pingBtn = document.getElementById('net-ping-start-btn');
  const pingGrid = document.getElementById('net-ping-grid');

  const wifiSsid = document.getElementById('wifi-ssid-input');
  const wifiPwd = document.getElementById('wifi-pwd-input');
  const wifiEnc = document.getElementById('wifi-enc-select');
  const wifiHidden = document.getElementById('wifi-hidden-toggle');
  const wifiGenBtn = document.getElementById('wifi-gen-btn');
  const wifiCopyBtn = document.getElementById('wifi-copy-btn');
  const wifiDlBtn = document.getElementById('wifi-dl-btn');
  const wifiQrContainer = document.getElementById('wifi-qr-container');
  const wifiCardInfo = document.getElementById('wifi-qr-card-info');

  // 1. 公网 IP 与地理位置探测
  const detectPublicIp = async (isManual = false) => {
    if (!publicIpEl || !geoInfoEl) return;
    publicIpEl.textContent = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Detecting...' : '正在探测...';
    geoInfoEl.textContent = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Resolving ISP & Region...' : '正在解析地理与运营商...';

    let ipFound = false;
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        publicIpEl.textContent = data.ip || 'Unknown';
        geoInfoEl.textContent = `${data.country_name || ''} ${data.region || ''} ${data.city || ''} · ${data.org || data.asn || ''}`;
        ipFound = true;
      }
    } catch (e) {
      // Fallback
    }

    if (!ipFound) {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        if (res.ok) {
          const data = await res.json();
          publicIpEl.textContent = data.ip || 'Unknown';
          geoInfoEl.textContent = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Global Public Node' : '全球公网出口节点';
          ipFound = true;
        }
      } catch (e) {
        publicIpEl.textContent = '127.0.0.1 (Local / Protected)';
        geoInfoEl.textContent = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Direct LAN / Proxy Active' : '本地局域网 / 代理模式';
      }
    }

    if (isManual && typeof Toast !== 'undefined') {
      Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Network diagnostics refreshed!' : '网络诊断信息已更新！');
    }
  };

  if (refreshIpBtn) {
    refreshIpBtn.addEventListener('click', () => detectPublicIp(true));
  }
  detectPublicIp();

  // 2. WebRTC 本地真实 IP 泄露探测
  const detectWebRtcLeak = () => {
    if (!webrtcStatusEl) return;
    const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
    const leakedIps = new Set();

    try {
      const pc = new (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      pc.createDataChannel('leakDetectionChannel');

      pc.onicecandidate = (event) => {
        if (!event || !event.candidate) {
          if (leakedIps.size === 0) {
            webrtcStatusEl.textContent = isEn ? '🛡️ Safe: No WebRTC leak detected' : '🛡️ 安全：未检测到 WebRTC 穿透泄漏';
            webrtcStatusEl.style.background = 'rgba(16, 185, 129, 0.1)';
            webrtcStatusEl.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            webrtcStatusEl.style.color = '#10b981';
          }
          return;
        }

        const cand = event.candidate.candidate;
        const match = cand.match(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
        if (match && match[1]) {
          const ip = match[1];
          if (ip !== '0.0.0.0' && !ip.startsWith('127.')) {
            leakedIps.add(ip);
            webrtcStatusEl.textContent = (isEn ? '⚠️ Warning: WebRTC leaked IP: ' : '⚠️ 警告：检测到 WebRTC 真实 IP 泄漏: ') + Array.from(leakedIps).join(', ');
            webrtcStatusEl.style.background = 'rgba(245, 158, 11, 0.1)';
            webrtcStatusEl.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            webrtcStatusEl.style.color = '#f59e0b';
            if (webrtcCandidatesEl) {
              webrtcCandidatesEl.textContent = `Candidate Endpoints: ${Array.from(leakedIps).join(' | ')}`;
            }
          }
        }
      };

      pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(() => {});
    } catch (err) {
      webrtcStatusEl.textContent = isEn ? '🛡️ WebRTC Disabled / Fully Shielded' : '🛡️ 浏览器已禁用 WebRTC，隐私防护极佳';
    }
  };
  detectWebRtcLeak();

  // 3. 全球骨干 CDN 网络测速 (Ping)
  const cdnNodes = [
    { name: 'Cloudflare (Anycast)', url: 'https://1.1.1.1/cdn-cgi/trace', region: 'Global' },
    { name: 'Google Global Edge', url: 'https://www.google.com/favicon.ico', region: 'US/Global' },
    { name: 'AWS CloudFront', url: 'https://aws.amazon.com/favicon.ico', region: 'Global' },
    { name: 'Alibaba Cloud (阿里云)', url: 'https://www.aliyun.com/favicon.ico', region: 'APAC / CN' },
    { name: 'Tencent Cloud (腾讯云)', url: 'https://cloud.tencent.com/favicon.ico', region: 'APAC / CN' }
  ];

  const renderPingGrid = () => {
    if (!pingGrid) return;
    pingGrid.innerHTML = cdnNodes.map(node => `
      <div style="background: var(--surface-high); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <b style="font-size: 12px; color: var(--text-primary);">${node.name}</b>
          <span style="font-size: 11px; color: var(--text-muted); margin-left: 6px;">(${node.region})</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="ping-badge" id="ping-val-${node.name.replace(/[^a-zA-Z0-9]/g, '')}" style="font-size: 12px; font-weight: 700; font-family: var(--font-mono); color: var(--text-secondary);">- ms</span>
          <span class="ping-status" id="ping-status-${node.name.replace(/[^a-zA-Z0-9]/g, '')}" style="font-size: 10px; font-weight: 600; color: var(--text-muted); padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.05);">${typeof I18nController !== "undefined" && I18nController.currentLang === "en-US" ? "Ready" : "待测速"}</span>
        </div>
      </div>
    `).join('');
  };
  renderPingGrid();

  const startPingTest = async () => {
    if (typeof Toast !== 'undefined') {
      Toast.info(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Starting CDN latency test...' : '正在发起全球节点多轮 Ping 测速...');
    }

    for (const node of cdnNodes) {
      const id = node.name.replace(/[^a-zA-Z0-9]/g, '');
      const valEl = document.getElementById(`ping-val-${id}`);
      const statusEl = document.getElementById(`ping-status-${id}`);
      if (!valEl || !statusEl) continue;

      valEl.textContent = '...';
      statusEl.textContent = 'Testing...';

      const startTime = performance.now();
      try {
        await fetch(`${node.url}?_t=${Date.now()}`, { mode: 'no-cors', cache: 'no-store' });
        const latency = Math.round(performance.now() - startTime);
        valEl.textContent = `${latency} ms`;

        if (latency < 100) {
          valEl.style.color = '#10b981';
          statusEl.textContent = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Excellent' : '极佳';
          statusEl.style.color = '#10b981';
        } else if (latency < 250) {
          valEl.style.color = 'var(--color-secondary)';
          statusEl.textContent = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Good' : '良好';
          statusEl.style.color = 'var(--color-secondary)';
        } else {
          valEl.style.color = '#f59e0b';
          statusEl.textContent = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Moderate' : '延迟稍高';
          statusEl.style.color = '#f59e0b';
        }
      } catch (err) {
        valEl.textContent = 'Timeout';
        valEl.style.color = '#ef4444';
        statusEl.textContent = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US" ? "Timeout" : "超时";
        statusEl.style.color = '#ef4444';
      }
    }
  };

  if (pingBtn) {
    pingBtn.addEventListener('click', startPingTest);
  }

  // 4. 本地网页实时 Ping 测算
  function measureLocalPing() {
    if (!pingText || !pingProgress) return;
    const startTime = Date.now();
    fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
      .then(() => {
        const latency = Date.now() - startTime;
        pingText.textContent = `${latency} ms`;
        const progressWidth = Math.min(100, Math.max(10, Math.floor((latency / 300) * 100)));
        pingProgress.style.width = `${progressWidth}%`;

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
  measureLocalPing();
  setInterval(measureLocalPing, 6000);

  // 5. WiFi 扫码直连专属二维码生成器
  let currentWifiString = '';
  const wifiHintEl = document.getElementById('wifi-auto-detect-hint');

  const updateWifiHint = () => {
    if (!wifiHintEl) return;
    const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
    const pwd = wifiPwd ? wifiPwd.value : '';
    const selectedEnc = wifiEnc ? wifiEnc.value : 'AUTO';

    if (selectedEnc === 'AUTO') {
      if (pwd.length > 0) {
        wifiHintEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 13px;">lock</span><span>${isEn ? 'Auto-detected: WPA/WPA2/WPA3 (Standard secure WiFi)' : '智能识别：已输入密码，自动匹配标准 WPA/WPA2/WPA3 安全协议'}</span>`;
        wifiHintEl.style.color = 'var(--color-primary)';
      } else {
        wifiHintEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 13px;">lock_open</span><span>${isEn ? 'Auto-detected: Open Network (No password required)' : '智能识别：密码留空，自动配置为无密码开放热点'}</span>`;
        wifiHintEl.style.color = 'var(--text-muted)';
      }
    } else {
      wifiHintEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 13px;">settings</span><span>${isEn ? `Manual Mode: [${selectedEnc}]` : `已手动指定加密类型: [${selectedEnc}]`}</span>`;
      wifiHintEl.style.color = 'var(--color-secondary)';
    }
  };

  if (wifiPwd) {
    wifiPwd.addEventListener('input', updateWifiHint);
  }
  if (wifiEnc) {
    wifiEnc.addEventListener('change', updateWifiHint);
  }

  const generateWifiQr = () => {
    const ssid = wifiSsid ? wifiSsid.value.trim() : '';
    const pwd = wifiPwd ? wifiPwd.value : '';
    let enc = wifiEnc ? wifiEnc.value : 'AUTO';
    const isHidden = wifiHidden && wifiHidden.checked;

    if (!ssid) {
      if (typeof Toast !== 'undefined') Toast.warning(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Please enter WiFi Name (SSID)!' : '请输入 WiFi 无线网络名称 (SSID)！');
      return;
    }

    if (enc === 'AUTO') {
      enc = pwd ? 'WPA' : 'nopass';
    }

    const escapeWifi = (str) => (str || '').replace(/([\\;,:\"])/g, '\\$1');
    const hiddenStr = isHidden ? 'H:true;' : '';
    const pwdStr = enc !== 'nopass' && pwd ? `P:${escapeWifi(pwd)};` : '';
    currentWifiString = `WIFI:T:${enc};S:${escapeWifi(ssid)};${pwdStr}${hiddenStr};`;

    if (wifiQrContainer) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentWifiString)}`;
      wifiQrContainer.innerHTML = `<img id="wifi-qr-img" src="${qrUrl}" alt="WiFi QR Code" style="width: 150px; height: 150px; display: block;" />`;
    }

    if (wifiCardInfo) {
      wifiCardInfo.textContent = `SSID: ${ssid} · [${enc}]`;
    }

    if (typeof Toast !== 'undefined') {
      Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'WiFi QR Code generated! Scan with mobile camera to connect.' : 'WiFi 直连二维码已生成！手机相机扫码即可一键加入网络。');
    }
  };

  if (wifiGenBtn) {
    wifiGenBtn.addEventListener('click', generateWifiQr);
  }

  if (wifiCopyBtn) {
    wifiCopyBtn.addEventListener('click', () => {
      if (!currentWifiString) generateWifiQr();
      if (currentWifiString) {
        navigator.clipboard.writeText(currentWifiString).then(() => {
          if (typeof Toast !== 'undefined') Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'WiFi string copied to clipboard!' : 'WiFi 直连字符串已复制！');
        });
      }
    });
  }

  if (wifiDlBtn) {
    wifiDlBtn.addEventListener('click', () => {
      const qrImg = document.getElementById('wifi-qr-img');
      if (!qrImg || !qrImg.src) {
        generateWifiQr();
      }
      const img = document.getElementById('wifi-qr-img');
      if (img && img.src) {
        const a = document.createElement('a');
        a.href = img.src;
        a.download = `WiFi_${(wifiSsid ? wifiSsid.value : 'QR') || 'Connect'}.png`;
        a.target = '_blank';
        a.click();
      }
    });
  }
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
          <input type="text" id="cmd-palette-input" class="cmd-palette-input" placeholder="${typeof I18nController !== "undefined" && I18nController.currentLang === "en-US" ? "Search commands or tools (ESC to exit)..." : "输入命令或工具名称 (按 ESC 退出)..."}" autocomplete="off" />
          <span class="cmd-badge">ESC</span>
        </div>
        <div id="cmd-palette-results" class="cmd-palette-results"></div>
        <div class="cmd-palette-footer">
          <span>${typeof I18nController !== "undefined" && I18nController.currentLang === "en-US" ? "Navigate: <kbd class='cmd-badge'>↑</kbd> <kbd class='cmd-badge'>↓</kbd> Select: <kbd class='cmd-badge'>↵ Enter</kbd>" : "导航: <kbd class='cmd-badge'>↑</kbd> <kbd class='cmd-badge'>↓</kbd> 选择: <kbd class='cmd-badge'>↵ Enter</kbd>"}</span>
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
      this.results.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">${typeof I18nController !== "undefined" && I18nController.currentLang === "en-US" ? "No matching commands" : "无匹配指令"}</div>`;
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
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      Toast.info(isEn ? `Executed: ${current.title}` : `已执行: ${current.title}`);
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


