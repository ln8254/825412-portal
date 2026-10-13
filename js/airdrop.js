/**
 * 825412-portal - 极客隔空快传 (Geek AirDrop - WebRTC P2P Realtime Engine)
 * 支持：毫秒级下线感知、高频心跳保活、WebRTC 状态监听、主动手动刷新雷达
 */
const AirDropController = {
  roomId: '',
  deviceId: '',
  deviceName: '',
  platform: 'desktop',
  peer: null,
  myPeerId: '',
  isHost: false,
  activeConnections: {}, // { [peerId]: DataConnection }
  peersInfo: {},        // { [peerId]: { name, platform, lastSeen, deviceId } }
  broadcastChan: null,
  heartbeatTimer: null,
  wakeLock: null,
  scanStream: null,
  scanAnimId: null,
  scanFacingMode: 'environment',
  barcodeDetector: null,
  scanDetected: false,

  init() {
    this.initDeviceIdentity();
    this.initMobileTabs();
    this.initRoomConnection();
    this.initSendActions();
    this.initFileDrop();
    this.initRescanAction();
    this.initExitListeners();
    this.initVisibilityListener();
    this.requestWakeLock();
    this.renderPeersList();
  },

  // 1. 初始化本机标识
  initDeviceIdentity() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.platform = isMobile ? 'mobile' : 'desktop';
    const platformLabel = isMobile ? '📱 Mobile Device' : '💻 Desktop Workstation';
    
    let savedDevId = sessionStorage.getItem('airdrop_dev_id');
    if (!savedDevId) {
      savedDevId = Math.random().toString(36).substring(2, 7);
      sessionStorage.setItem('airdrop_dev_id', savedDevId);
    }
    this.deviceId = savedDevId;
    this.deviceName = `${platformLabel} (${(navigator.language || 'zh-CN').toUpperCase()})`;

    const nameEl = document.getElementById('airdrop-my-name');
    if (nameEl) nameEl.textContent = this.deviceName;
  },

  // 1.1 移动端视图切换与即时感知控制
  initMobileTabs() {
    const recvBtn = document.getElementById('airdrop-tab-recv-btn');
    const sendBtn = document.getElementById('airdrop-tab-send-btn');
    const recvPanel = document.getElementById('airdrop-recv-panel');
    const sendPanel = document.getElementById('airdrop-send-panel');
    const unreadBadge = document.getElementById('airdrop-unread-badge');

    if (!recvBtn || !sendBtn) return;

    this.currentMobileTab = 'recv';

    const switchTab = (tab) => {
      this.currentMobileTab = tab;
      if (tab === 'recv') {
        recvBtn.classList.add('active');
        sendBtn.classList.remove('active');
        if (recvPanel) recvPanel.classList.add('active');
        if (sendPanel) sendPanel.classList.remove('active');
        if (unreadBadge) {
          unreadBadge.style.display = 'none';
          unreadBadge.textContent = '0';
        }
      } else {
        sendBtn.classList.add('active');
        recvBtn.classList.remove('active');
        if (sendPanel) sendPanel.classList.add('active');
        if (recvPanel) recvPanel.classList.remove('active');
      }
    };

    recvBtn.addEventListener('click', () => switchTab('recv'));
    sendBtn.addEventListener('click', () => switchTab('send'));
    this.switchMobileTab = switchTab;
  },

  // 1.2 顶部吸顶悬浮即时通知 (手机端即使未聚焦接收列表也能秒级获知)
  showIncomingBanner(title, desc, actionText, onAction) {
    let banner = document.getElementById('airdrop-incoming-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'airdrop-incoming-banner';
      banner.className = 'airdrop-incoming-banner';
      document.body.appendChild(banner);
    }
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
        <span class="material-symbols-outlined" style="font-size: 26px; color: #10b981; flex-shrink: 0;">download_done</span>
        <div style="min-width: 0;">
          <div style="font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title}</div>
          <div style="font-size: 11px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${desc}</div>
        </div>
      </div>
      <div style="display: flex; gap: 6px; flex-shrink: 0;">
        <button class="btn btn-primary" id="airdrop-banner-action-btn" style="padding: 5px 12px; font-size: 12px; font-weight: 600;">${actionText}</button>
        <button class="btn" id="airdrop-banner-close-btn" style="padding: 4px 6px; font-size: 12px; background: transparent; border: none; color: var(--text-muted);">
          <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
        </button>
      </div>
    `;
    banner.style.display = 'flex';

    const actionBtn = banner.querySelector('#airdrop-banner-action-btn');
    if (actionBtn && onAction) {
      actionBtn.addEventListener('click', () => {
        onAction();
        banner.style.display = 'none';
      });
    }

    const closeBtn = banner.querySelector('#airdrop-banner-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        banner.style.display = 'none';
      });
    }

    if (this._bannerTimer) clearTimeout(this._bannerTimer);
    this._bannerTimer = setTimeout(() => {
      banner.style.display = 'none';
    }, 7000);
  },

  // 1.3 实时传输 HUD 看板控制器
  showTransferHud(name, size, mode = 'send') {
    const hud = document.getElementById('airdrop-transfer-hud');
    if (!hud) return;
    hud.style.display = 'flex';
    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    const modeTitle = mode === 'send' 
      ? (isEn ? `📤 Sending to peers...` : `📤 正在投送至对端设备...`)
      : (isEn ? `📥 Receiving from peer...` : `📥 正在接收来自对端的文件...`);

    hud.innerHTML = `
      <div class="airdrop-transfer-card" id="airdrop-active-hud-card">
        <div class="airdrop-transfer-header">
          <div class="airdrop-transfer-file">
            <span class="material-symbols-outlined airdrop-transfer-icon" style="animation: spin 2s linear infinite;">sync</span>
            <div class="airdrop-transfer-meta">
              <div class="airdrop-transfer-name">${name}</div>
              <div class="airdrop-transfer-stats">${modeTitle} · ${size}</div>
            </div>
          </div>
        </div>
        <div class="airdrop-progress-track">
          <div class="airdrop-progress-bar" style="width: 100%;"></div>
        </div>
      </div>
    `;
  },

  completeTransferHud(name, isSuccess = true) {
    const card = document.getElementById('airdrop-active-hud-card');
    const hud = document.getElementById('airdrop-transfer-hud');
    if (!card || !hud) return;

    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    card.classList.add('complete');
    const icon = card.querySelector('.airdrop-transfer-icon');
    const stats = card.querySelector('.airdrop-transfer-stats');
    if (icon) {
      icon.textContent = isSuccess ? 'check_circle' : 'error';
      icon.style.animation = 'none';
      icon.style.color = isSuccess ? '#10b981' : '#f87171';
    }
    if (stats) {
      stats.textContent = isSuccess 
        ? (isEn ? "✅ Transfer Completed!" : "✅ 传输完成！已成功发送") 
        : (isEn ? "❌ Transfer Failed" : "❌ 传输中断");
    }

    setTimeout(() => {
      if (hud) hud.style.display = 'none';
    }, 3500);
  },

  // 1.3.1 移动端原图全屏预览与长按保存专属画廊 (彻底解决移动端系统下载管理器不支持 blob 伪协议导致排队/失败的问题)
  showImageLightbox(src, fileName, fileSize, dlAction) {
    let overlay = document.getElementById('airdrop-image-lightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'airdrop-image-lightbox';
      overlay.className = 'airdrop-lightbox-overlay';
      document.body.appendChild(overlay);
    }
    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    overlay.innerHTML = `
      <div class="airdrop-lightbox-header">
        <div style="min-width: 0; flex: 1;">
          <div style="font-size: 14px; font-weight: 700; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📄 ${fileName}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${fileSize}</div>
        </div>
        <button class="btn" id="airdrop-lightbox-close" style="background: rgba(255,255,255,0.1); border: none; padding: 6px; border-radius: 50%; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
        </button>
      </div>
      <div class="airdrop-lightbox-body" id="airdrop-lightbox-img-wrap">
        <img src="${src}" class="airdrop-lightbox-img" alt="${fileName}" />
      </div>
      <div class="airdrop-lightbox-tip">
        <span class="material-symbols-outlined" style="font-size: 18px; color: #10b981; animation: pulse 1.5s infinite;">touch_app</span>
        <span>${isEn ? "Long-press the image to save directly to Photos" : "手机端长按上方图片，在弹出菜单中点击「保存图片」"}</span>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 10px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary" id="airdrop-lightbox-dl-btn" style="padding: 8px 16px; font-size: 13px; font-weight: 700; background: #10b981; border-color: #10b981; display: inline-flex; align-items: center; gap: 6px;">
          <span class="material-symbols-outlined" style="font-size: 18px;">share</span> ${isEn ? "Save to Photos / Files" : "📲 保存到相册 / 文件"}
        </button>
        <button class="btn" id="airdrop-lightbox-open-btn" style="padding: 8px 14px; font-size: 12px; background: var(--surface-high); border: 1px solid var(--border-light); display: inline-flex; align-items: center; gap: 4px;">
          <span class="material-symbols-outlined" style="font-size: 16px;">open_in_new</span> ${isEn ? "Open in New Window" : "新窗口全屏打开"}
        </button>
      </div>
    `;
    overlay.style.display = 'flex';

    overlay.querySelector('#airdrop-lightbox-close').addEventListener('click', () => {
      overlay.style.display = 'none';
    });
    const openBtn = overlay.querySelector('#airdrop-lightbox-open-btn');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        try {
          const w = window.open();
          if (w) {
            w.document.write(`<title>${fileName}</title><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>body{margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;}img{max-width:100%;max-height:100%;object-fit:contain;}</style><img src="${src}" alt="${fileName}">`);
            w.document.close();
          } else {
            window.location.href = src;
          }
        } catch(e) {
          window.open(src, '_blank');
        }
      });
    }
    overlay.querySelector('#airdrop-lightbox-dl-btn').addEventListener('click', () => {
      if (dlAction) dlAction();
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.id === 'airdrop-lightbox-img-wrap') {
        overlay.style.display = 'none';
      }
    });
  },

  // 1.4 安全高性能 Base64 转 Blob 算法 (防止向 Binder IPC 传递巨大字符串导致崩溃)
  b64toBlob(dataUrl) {
    try {
      const parts = dataUrl.split(';base64,');
      if (parts.length < 2) return null;
      const contentType = parts[0].replace('data:', '') || 'application/octet-stream';
      const byteCharacters = atob(parts[1].trim());
      const len = byteCharacters.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = byteCharacters.charCodeAt(i);
      }
      return new Blob([bytes], { type: contentType });
    } catch (e) {
      console.error('Base64 to Blob error:', e);
      return null;
    }
  },

  // 1.5 跨平台高兼容文件落地落盘引擎 (利用 Web Share API 彻底攻克 Android 下载管理器不支持 blob: 导致的“已加入队列/下载失败”难题)
  async saveFileToDevice(blob, fileName, fileType, dataUrl) {
    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // 1. 移动端优先：利用系统级 Web Share API 呼出原生系统保存/分享菜单 (100% 写入相册/文件，彻底规避 Android DownloadManager blob 失败缺陷)
    if (isMobile && navigator.canShare && blob) {
      try {
        const file = new File([blob], fileName, { type: fileType || 'application/octet-stream' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: fileName,
            text: isEn ? 'Save from AirDrop' : '隔空快传文件保存'
          });
          if (typeof Toast !== 'undefined') {
            Toast.success(isEn ? 'Saved via system share!' : '已唤起系统保存，请在底栏选择保存至相册或文件！');
          }
          return;
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.warn('navigator.share failed, fallback:', err);
      }
    }

    // 2. 移动端图片降级：在新标签页打开纯净原图供用户长按存入相册
    const isImage = (fileType && fileType.startsWith('image/')) || 
                    /\.(jpe?g|png|webp|gif|bmp|svg|avif)$/i.test(fileName);
    if (isMobile && isImage) {
      const src = dataUrl || (blob ? URL.createObjectURL(blob) : '');
      if (src) {
        try {
          const w = window.open();
          if (w) {
            w.document.write(`<title>${fileName}</title><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>body{margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;}img{max-width:100%;height:auto;display:block;}</style><img src="${src}" alt="${fileName}">`);
            w.document.close();
            if (typeof Toast !== 'undefined') Toast.success(isEn ? 'Opened image. Long-press to save to Photos.' : '已全屏打开原图，长按即可保存到相册！');
            return;
          }
        } catch(e) {}
        window.open(src, '_blank');
        return;
      }
    }

    // 3. PC 端或传统下载：触发 <a download>
    const url = blob ? URL.createObjectURL(blob) : dataUrl;
    if (url) {
      const dlLink = document.createElement('a');
      dlLink.href = url;
      dlLink.download = fileName || 'downloaded-file';
      dlLink.style.display = 'none';
      document.body.appendChild(dlLink);
      dlLink.click();
      setTimeout(() => {
        if (dlLink.parentNode) dlLink.parentNode.removeChild(dlLink);
      }, 1500);
      if (typeof Toast !== 'undefined') {
        Toast.success(isEn ? `Download started for "${fileName}"` : `已开始保存 "${fileName}"`);
      }
    }
  },

  // 2. 初始化房间与 WebRTC 接入
  initRoomConnection() {
    const roomInput = document.getElementById('airdrop-room-input');
    const joinBtn = document.getElementById('airdrop-join-btn');
    const copyLinkBtn = document.getElementById('airdrop-copy-link-btn');
    const qrBtn = document.getElementById('airdrop-qr-btn');

    // 解析 URL 中的 ?room= 或 #drop= 房间号参数
    let initialRoom = '';
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('room')) {
      initialRoom = urlParams.get('room').trim().toUpperCase();
    } else if (window.location.hash.startsWith('#drop=')) {
      initialRoom = window.location.hash.replace('#drop=', '').trim().toUpperCase();
    }
    if (!initialRoom) {
      initialRoom = Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    this.joinRoom(initialRoom);

    if (joinBtn && roomInput) {
      joinBtn.addEventListener('click', () => {
        const val = roomInput.value.trim().toUpperCase();
        if (val) {
          this.joinRoom(val);
          const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
          if (typeof Toast !== "undefined") Toast.success(isEn ? `Switched to Room: #${val}` : `已切换至房间: #${val}`);
        }
      });
    }

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        const url = `${window.location.origin}${window.location.pathname}?room=${this.roomId}`;
        navigator.clipboard.writeText(url).then(() => {
          if (typeof Toast !== 'undefined') {
            Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' 
              ? 'AirDrop invite link copied! Open on your mobile phone to connect.' 
              : '隔空快传邀请链接已复制！手机打开即可秒连。');
          }
        });
      });
    }

    if (qrBtn) {
      qrBtn.addEventListener('click', () => this.openQrModal());
    }

    const scanQrBtn = document.getElementById('airdrop-scan-qr-btn');
    if (scanQrBtn) {
      scanQrBtn.addEventListener('click', () => this.openScanModal());
    }
  },

  openQrModal() {
    let modal = document.getElementById('airdrop-qr-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'airdrop-qr-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content glass-panel" style="max-width: 380px;">
          <div class="modal-header">
            <h2 class="modal-title" style="display: flex; align-items: center; gap: 8px;">
              <span class="material-symbols-outlined" style="color: var(--color-secondary);">qr_code_scanner</span>
              <span data-i18n="airdrop_qr_modal_title">手机扫码一键互联</span>
            </h2>
            <span class="material-symbols-outlined modal-close" id="close-qr-modal">close</span>
          </div>
          <div class="qr-modal-body">
            <div class="qr-canvas-container" style="display: flex; justify-content: center; align-items: center; min-height: 180px;">
              <div id="airdrop-qr-box" style="background: white; padding: 10px; border-radius: 6px;"></div>
            </div>
            <div style="font-weight: 700; font-size: 16px; color: #fff; margin-bottom: 4px;">
              <span data-i18n="airdrop_qr_room_label">房间号:</span>
              <span id="qr-room-badge" style="color: var(--color-secondary); font-family: var(--font-mono);">#${this.roomId}</span>
            </div>
            <div class="qr-tip-text" data-i18n="airdrop_qr_modal_tip">用手机自带相机或浏览器扫一扫，免安装 App 秒级加入当前房间直传文件与文本！</div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#close-qr-modal').addEventListener('click', () => {
        modal.classList.remove('active');
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    // 构造精准跳转至隔空快传视图与当前房间的完整 URL
    const isStandaloneAirdrop = window.location.pathname.endsWith('airdrop.html');
    const targetPath = isStandaloneAirdrop ? 'airdrop.html' : '';
    const shareUrl = `${window.location.origin}/${targetPath}?view=airdrop&room=${this.roomId}`;
    
    const qrBox = modal.querySelector('#airdrop-qr-box');
    const badge = modal.querySelector('#qr-room-badge');
    if (badge) badge.textContent = `#${this.roomId}`;
    if (qrBox) {
      qrBox.innerHTML = '';
      if (typeof QRCode !== 'undefined') {
        new QRCode(qrBox, {
          text: shareUrl,
          width: 180,
          height: 180,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }

    // 动态应用当前语言包
    if (typeof I18nController !== 'undefined') {
      I18nController.applyLanguage(I18nController.currentLang);
    }

    modal.classList.add('active');
  },

  // 扫码加入房间功能
  openScanModal() {
    let modal = document.getElementById('airdrop-scan-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'airdrop-scan-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content glass-panel" style="max-width: 440px; text-align: center; position: relative;">
          <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 class="modal-title" style="display: flex; align-items: center; gap: 8px; font-size: 17px; margin: 0;">
              <span class="material-symbols-outlined" style="color: var(--color-primary);">qr_code_scanner</span>
              <span data-i18n="airdrop_scan_modal_title">扫描隔空快传二维码</span>
            </h2>
            <span class="material-symbols-outlined modal-close" id="close-scan-modal" style="cursor: pointer;">close</span>
          </div>

          <div class="scan-viewfinder-box">
            <video id="airdrop-scan-video" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover;"></video>
            <canvas id="airdrop-scan-canvas" style="display: none;"></canvas>
            
            <div style="position: absolute; inset: 16px; border: 2px solid rgba(56, 189, 248, 0.4); border-radius: 12px; pointer-events: none; box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.45);">
              <div class="scan-corner-tl"></div>
              <div class="scan-corner-tr"></div>
              <div class="scan-corner-bl"></div>
              <div class="scan-corner-br"></div>
              <div style="position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #38bdf8, #34d399, transparent); box-shadow: 0 0 8px #38bdf8; animation: scanLaser 2s linear infinite;"></div>
            </div>

            <div id="scan-permission-overlay" style="display: none; position: absolute; inset: 0; background: rgba(11, 15, 25, 0.95); flex-direction: column; justify-content: center; align-items: center; padding: 24px; color: var(--text-secondary); font-size: 13px; text-align: center;">
              <span class="material-symbols-outlined" style="font-size: 40px; color: #f87171; margin-bottom: 12px;">videocam_off</span>
              <div id="scan-permission-msg">无法启动摄像头，请允许浏览器访问相机或直接点击下方从相册选择。</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div id="scan-status-text" style="font-size: 13px; color: var(--text-secondary); text-align: left; display: flex; align-items: center; gap: 4px;">
              <span class="material-symbols-outlined" style="font-size: 16px; color: #34d399;">center_focus_strong</span>
              <span data-i18n="airdrop_scan_hint">将镜头对准另一台设备的房间二维码</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <label class="btn" style="padding: 6px 12px; font-size: 12px; background: var(--surface-high); cursor: pointer; display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--border-light);">
                <span class="material-symbols-outlined" style="font-size: 16px;">photo_library</span>
                <span data-i18n="airdrop_scan_album">从相册选择</span>
                <input type="file" id="airdrop-scan-file-input" accept="image/*" style="display: none;">
              </label>
              <button class="btn" id="airdrop-switch-cam-btn" style="padding: 6px 10px; font-size: 12px; background: var(--surface-high); border: 1px solid var(--border-light);" title="切换前后摄像头">
                <span class="material-symbols-outlined" style="font-size: 16px;">cameraswitch</span>
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#close-scan-modal').addEventListener('click', () => this.closeScanModal());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeScanModal();
      });

      const fileInput = modal.querySelector('#airdrop-scan-file-input');
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            this.handleScanFile(e.target.files[0]);
          }
        });
      }

      const switchBtn = modal.querySelector('#airdrop-switch-cam-btn');
      if (switchBtn) {
        switchBtn.addEventListener('click', () => {
          this.scanFacingMode = this.scanFacingMode === 'environment' ? 'user' : 'environment';
          this.startScanCamera();
        });
      }
    }

    if (typeof I18nController !== 'undefined') {
      I18nController.applyLanguage(I18nController.currentLang);
    }

    this.scanDetected = false;
    modal.classList.add('active');
    this.loadJsQrLibrary().catch(() => {});
    this.startScanCamera();
  },

  closeScanModal() {
    const modal = document.getElementById('airdrop-scan-modal');
    if (modal) modal.classList.remove('active');
    if (this.scanAnimId) {
      cancelAnimationFrame(this.scanAnimId);
      this.scanAnimId = null;
    }
    if (this.scanStream) {
      this.scanStream.getTracks().forEach(t => t.stop());
      this.scanStream = null;
    }
  },

  startScanCamera() {
    const video = document.getElementById('airdrop-scan-video');
    const permOverlay = document.getElementById('scan-permission-overlay');
    if (!video) return;

    if (this.scanStream) {
      this.scanStream.getTracks().forEach(t => t.stop());
      this.scanStream = null;
    }
    if (this.scanAnimId) {
      cancelAnimationFrame(this.scanAnimId);
      this.scanAnimId = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (permOverlay) permOverlay.style.display = 'flex';
      return;
    }

    if (permOverlay) permOverlay.style.display = 'none';

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: this.scanFacingMode }, width: { ideal: 1280 }, height: { ideal: 720 } }
    }).then(stream => {
      this.scanStream = stream;
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.play().catch(() => {});
      this.startScanDetection(video);
    }).catch(err => {
      console.warn('getUserMedia ideal error, trying fallback:', err);
      navigator.mediaDevices.getUserMedia({ video: { facingMode: this.scanFacingMode } }).then(stream => {
        this.scanStream = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.play().catch(() => {});
        this.startScanDetection(video);
      }).catch(fallbackErr => {
        console.warn('getUserMedia fallback error:', fallbackErr);
        if (permOverlay) permOverlay.style.display = 'flex';
      });
    });
  },

  startScanDetection(video) {
    const canvas = document.getElementById('airdrop-scan-canvas');
    let lastScanTime = 0;

    const detect = async (now) => {
      const modal = document.getElementById('airdrop-scan-modal');
      if (!modal || !modal.classList.contains('active')) return;

      // 节流：每隔 120ms 解码一帧，既流畅敏捷，又极大降低 CPU 压力，防止手机发热卡顿
      if (video.readyState >= video.HAVE_CURRENT_DATA && (now - lastScanTime > 120)) {
        lastScanTime = now;
        try {
          if (typeof jsQR === 'undefined') {
            await this.loadJsQrLibrary();
          }

          if (typeof jsQR !== 'undefined' && canvas) {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            // 限制输入分辨率以实现毫秒级快速解码（最大宽高 480px，识别率高且极快）
            const maxDim = 480;
            let w = video.videoWidth || 320;
            let h = video.videoHeight || 320;
            if (w > maxDim || h > maxDim) {
              const scale = maxDim / Math.max(w, h);
              w = Math.round(w * scale);
              h = Math.round(h * scale);
            }
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(video, 0, 0, w, h);
            const imgData = ctx.getImageData(0, 0, w, h);
            const qr = jsQR(imgData.data, w, h, {
              inversionAttempts: 'dontInvert'
            });

            if (qr && qr.data) {
              const roomCode = this.extractRoomCode(qr.data);
              if (roomCode) {
                this.handleSuccessfulScan(roomCode);
                return;
              }
            }
          }
        } catch (err) {
          // 忽略单帧扫描中的暂时异常
        }
      }

      this.scanAnimId = requestAnimationFrame(detect);
    };

    this.scanAnimId = requestAnimationFrame(detect);
  },

  loadJsQrLibrary() {
    if (window._jsQrPromise) return window._jsQrPromise;
    window._jsQrPromise = new Promise((resolve, reject) => {
      if (typeof jsQR !== 'undefined') return resolve();
      const s = document.createElement('script');
      s.src = 'js/jsqr.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
    return window._jsQrPromise;
  },

  handleScanFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        try {
          if (typeof jsQR === 'undefined') await this.loadJsQrLibrary();
          if (typeof jsQR !== 'undefined') {
            const canvas = document.createElement('canvas');
            const maxDim = 960;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              const scale = maxDim / Math.max(w, h);
              w = Math.round(w * scale);
              h = Math.round(h * scale);
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0, w, h);
            const imgData = ctx.getImageData(0, 0, w, h);
            const qr = jsQR(imgData.data, w, h, { inversionAttempts: 'dontInvert' });
            if (qr && qr.data) {
              const room = this.extractRoomCode(qr.data);
              if (room) {
                this.handleSuccessfulScan(room);
                return;
              } else {
                const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
                if (typeof Toast !== 'undefined') Toast.warning(isEn ? 'No valid AirDrop room code found in QR code' : '二维码内容非有效的隔空快传房间码');
                return;
              }
            }
          }
          const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
          if (typeof Toast !== 'undefined') Toast.warning(isEn ? 'No QR code detected in this photo' : '照片中未检测到清晰的二维码，请重试');
        } catch (err) {
          console.error('File scan error:', err);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  extractRoomCode(rawText) {
    if (!rawText) return null;
    const text = rawText.trim();
    try {
      if (text.startsWith('http://') || text.startsWith('https://')) {
        const url = new URL(text);
        if (url.searchParams.get('room')) return url.searchParams.get('room').toUpperCase();
        if (url.hash && url.hash.includes('drop=')) {
          return url.hash.split('drop=')[1].split('&')[0].toUpperCase();
        }
      }
    } catch (e) {}

    const clean = text.replace(/^#/, '').trim().toUpperCase();
    if (/^[A-Z0-9]{4,10}$/.test(clean)) {
      return clean;
    }
    return null;
  },

  handleSuccessfulScan(roomCode) {
    if (this.scanDetected) return;
    this.scanDetected = true;

    if (navigator.vibrate) {
      try { navigator.vibrate([60, 40, 80]); } catch (e) {}
    }

    this.closeScanModal();
    this.joinRoom(roomCode);

    const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
    const msg = isEn ? `🎯 QR Code Scanned! Successfully joined Room #${roomCode}` : `🎯 扫码成功！已自动连接加入房间 #${roomCode}`;
    if (typeof Toast !== 'undefined') {
      Toast.success(msg);
    }
    this.appendSystemNotice(msg);
  },

  joinRoom(roomId) {
    this.roomId = roomId.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    this.activeConnections = {};
    this.peersInfo = {};

    const roomBadge = document.getElementById('airdrop-current-room');
    const roomInput = document.getElementById('airdrop-room-input');
    if (roomBadge) roomBadge.textContent = `#${this.roomId}`;
    if (roomInput) roomInput.value = this.roomId;

    // 1. 同机多标签广播通道
    if (window.BroadcastChannel) {
      if (this.broadcastChan) this.broadcastChan.close();
      this.broadcastChan = new BroadcastChannel(`airdrop_bcast_${this.roomId}`);
      this.broadcastChan.onmessage = (e) => {
        if (e.data && e.data.sender !== this.deviceId) {
          this.handleIncomingPayload(e.data);
        }
      };
    }

    // 2. 建立 WebRTC P2P 节点
    this.connectPeerNode();
    this.startHeartbeatLoop();
    this.renderPeersList();
  },

  connectPeerNode() {
    if (typeof Peer === 'undefined') {
      console.warn('PeerJS library not loaded, fallback to BroadcastChannel');
      return;
    }

    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {}
    }

    const hostPeerId = `a825412_host_${this.roomId.toLowerCase()}`;
    const clientPeerId = `a825412_c_${this.roomId.toLowerCase()}_${this.deviceId}`;

    // 优先尝试注册为 Host 节点
    this.peer = new Peer(hostPeerId, {
      debug: 1,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    this.peer.on('open', (id) => {
      this.myPeerId = id;
      this.isHost = true;
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      this.appendSystemNotice(isEn ? `Acting as Host for Room #${this.roomId}. Awaiting peer connections...` : `已成为频道 #${this.roomId} 主机节点，正在等待对端设备接入...`);
    });

    this.peer.on('connection', (conn) => {
      this.setupConnection(conn);
    });

    // 如果 Host ID 已经被占，自动降级为 Client 节点并连接 Host
    this.peer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        this.peer.destroy();
        this.isHost = false;
        this.myPeerId = clientPeerId;
        
        this.peer = new Peer(clientPeerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
          this.appendSystemNotice(isEn ? `Connected as Client to Room #${this.roomId}. Establishing WebRTC link...` : `已作为客户端接入频道 #${this.roomId}，正在建立 WebRTC 直连...`);
          const conn = this.peer.connect(hostPeerId, { reliable: true });
          this.setupConnection(conn);
        });

        this.peer.on('connection', (conn) => {
          this.setupConnection(conn);
        });
      } else {
        console.error('Peer error:', err);
      }
    });
  },

  setupConnection(conn) {
    conn.on('open', () => {
      this.activeConnections[conn.peer] = conn;

      // 握手：发送自身身份信息
      conn.send({
        type: 'handshake',
        sender: this.deviceId,
        senderName: this.deviceName,
        platform: this.platform
      });

      this.renderPeersList();
    });

    conn.on('data', (data) => {
      this.handleIncomingPayload(data, conn);
    });

    let disconnectTimer = null;
    const handlePeerDisconnect = (immediate = false) => {
      const doCleanup = () => {
        const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        const peerName = this.peersInfo[conn.peer] ? this.peersInfo[conn.peer].name : (isEn ? "Remote Peer" : "对端设备");
        delete this.activeConnections[conn.peer];
        delete this.peersInfo[conn.peer];
        this.renderPeersList();
        this.appendSystemNotice(isEn ? `🔌 Device [${peerName}] disconnected.` : `🔌 设备 [${peerName}] 连接已断开。`);
      };

      if (immediate) {
        if (disconnectTimer) {
          clearTimeout(disconnectTimer);
          disconnectTimer = null;
        }
        doCleanup();
      } else {
        if (!disconnectTimer) {
          // 给予 8 秒静默恢复缓冲，防止手机切应用瞬间被误杀
          disconnectTimer = setTimeout(() => {
            disconnectTimer = null;
            doCleanup();
          }, 8000);
        }
      }
    };

    conn.on('close', () => handlePeerDisconnect(true));
    conn.on('error', () => handlePeerDisconnect(false));

    // 监听 WebRTC 底层 ICE 状态，支持切后台平滑恢复
    if (conn.peerConnection) {
      conn.peerConnection.addEventListener('iceconnectionstatechange', () => {
        const state = conn.peerConnection.iceConnectionState;
        if (state === 'connected' || state === 'completed') {
          if (disconnectTimer) {
            clearTimeout(disconnectTimer);
            disconnectTimer = null;
          }
        } else if (state === 'failed' || state === 'closed') {
          handlePeerDisconnect(true);
        } else if (state === 'disconnected') {
          handlePeerDisconnect(false); // 给予缓冲恢复时间
        }
      });
    }
  },

  // 3. 稳健心跳循环 (每 2.5 秒心跳，放宽至 18 秒无响应才剔除，保护移动端切后台存活)
  startHeartbeatLoop() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();

      // 向所有连接广播心跳 ping
      Object.keys(this.activeConnections).forEach(peerId => {
        const conn = this.activeConnections[peerId];
        if (conn && conn.open) {
          try {
            conn.send({ type: 'ping', sender: this.deviceId });
          } catch (e) {
            delete this.activeConnections[peerId];
            delete this.peersInfo[peerId];
          }
        }
      });

      // 检查对端活跃时间，放宽至 18 秒防止切应用被秒踢
      let changed = false;
      Object.keys(this.peersInfo).forEach(peerId => {
        if (now - this.peersInfo[peerId].lastSeen > 18000) {
          const peerName = this.peersInfo[peerId].name;
          delete this.activeConnections[peerId];
          delete this.peersInfo[peerId];
          const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
          this.appendSystemNotice(isEn ? `⌛ Device [${peerName}] heartbeat timeout (offline).` : `⌛ 设备 [${peerName}] 心跳超时，已自动离线。`);
          changed = true;
        }
      });

      if (changed) {
        this.renderPeersList();
      }
    }, 2500);
  },

  handleIncomingPayload(payload, conn) {
    if (!payload || !payload.type) return;

    const peerKey = conn ? conn.peer : payload.sender;

    // 1. 握手报文
    if (payload.type === 'handshake') {
      const isNew = !this.peersInfo[peerKey];
      this.peersInfo[peerKey] = {
        name: payload.senderName || (typeof I18nController !== "undefined" && I18nController.currentLang === "en-US" ? "Unknown Peer" : "未知设备"),
        platform: payload.platform || 'device',
        deviceId: payload.sender,
        lastSeen: Date.now()
      };

      this.renderPeersList();
      if (isNew) {
        const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        this.appendSystemNotice(isEn ? `🎉 WebRTC P2P connected! Found peer [${payload.senderName}]. Ready to transfer!` : `🎉 WebRTC P2P 直连成功！发现对端设备 [${payload.senderName}]，可秒发文件！`);
      }
      return;
    }

    // 2. 心跳 ping / pong
    if (payload.type === 'ping') {
      if (this.peersInfo[peerKey]) {
        this.peersInfo[peerKey].lastSeen = Date.now();
      }
      if (conn && conn.open) {
        try { conn.send({ type: 'pong', sender: this.deviceId }); } catch (e) {}
      }
      return;
    }

    if (payload.type === 'pong') {
      if (this.peersInfo[peerKey]) {
        this.peersInfo[peerKey].lastSeen = Date.now();
      }
      return;
    }

    // 3. 对端主动离开 (Bye) 报文
    if (payload.type === 'bye') {
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      const peerName = this.peersInfo[peerKey] ? this.peersInfo[peerKey].name : (isEn ? "Remote Peer" : "对端设备");
      delete this.activeConnections[peerKey];
      delete this.peersInfo[peerKey];
      this.renderPeersList();
      this.appendSystemNotice(isEn ? `👋 Device [${peerName}] has closed session.` : `👋 设备 [${peerName}] 已主动关闭退出。`);
      return;
    }

    // 4. 文本或文件内容
    if (this.peersInfo[peerKey]) {
      this.peersInfo[peerKey].lastSeen = Date.now();
    }
    this.receivePayload(payload);
  },

  // 4. 页面真正关闭时：主动广播离开通知 (注意：严禁监听 pagehide，避免手机切应用被误杀)
  initExitListeners() {
    const notifyExit = () => {
      this.releaseWakeLock();
      const byePayload = { type: 'bye', sender: this.deviceId };
      Object.values(this.activeConnections).forEach(conn => {
        if (conn && conn.open) {
          try { conn.send(byePayload); } catch (e) {}
        }
      });
      if (this.broadcastChan) {
        try { this.broadcastChan.postMessage(byePayload); } catch (e) {}
      }
    };

    window.addEventListener('beforeunload', notifyExit);
  },

  // 4.1 页面前后台可见性感知与切回前台自动重连保活
  initVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // 用户从其他应用（如微信、图库、短信）切回当前浏览器页面
        this.requestWakeLock();

        // 1. 若信令服务器连接断开，立即尝试重新连接
        if (this.peer && this.peer.disconnected && !this.peer.destroyed) {
          try { this.peer.reconnect(); } catch (e) {}
        }

        // 2. 自动重整 P2P 连接拓扑并向对端主动发送 ping
        this.reconnectMesh();
        Object.keys(this.activeConnections).forEach(peerId => {
          const conn = this.activeConnections[peerId];
          if (conn && conn.open) {
            try { conn.send({ type: 'ping', sender: this.deviceId }); } catch (e) {}
          }
        });
      }
    });
  },

  // 4.2 屏幕常亮保活 (Screen Wake Lock API)，防止文件投送时手机息屏休眠断网
  async requestWakeLock() {
    if ('wakeLock' in navigator && !this.wakeLock) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
      } catch (e) {
        // 静默捕获策略限制
      }
    }
  },

  releaseWakeLock() {
    if (this.wakeLock) {
      try { this.wakeLock.release(); } catch (e) {}
      this.wakeLock = null;
    }
  },

  // 5. 手动主动刷新/重扫按钮
  initRescanAction() {
    const rescanBtn = document.getElementById('airdrop-rescan-btn');
    const rescanIcon = document.getElementById('airdrop-rescan-icon');

    if (!rescanBtn) return;

    rescanBtn.addEventListener('click', () => {
      if (rescanIcon) {
        rescanIcon.style.transition = 'transform 0.5s ease';
        rescanIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => { rescanIcon.style.transform = 'rotate(0deg)'; }, 500);
      }

      // 清理死连接并重新握手
      this.reconnectMesh();
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      this.appendSystemNotice(isEn ? "🔄 Radar rescan triggered and peer signaling reconnected." : "🔄 已触发设备雷达手动重扫与信令重连。");
    });
  },

  reconnectMesh() {
    // 剔除超时连接（放宽至 18 秒，防止后台切换误判）
    const now = Date.now();
    Object.keys(this.peersInfo).forEach(k => {
      if (now - this.peersInfo[k].lastSeen > 18000) {
        delete this.activeConnections[k];
        delete this.peersInfo[k];
      }
    });

    // 重新连接 Host
    if (!this.isHost && this.peer && !this.peer.destroyed) {
      const hostPeerId = `a825412_host_${this.roomId.toLowerCase()}`;
      if (!this.activeConnections[hostPeerId] || !this.activeConnections[hostPeerId].open) {
        const conn = this.peer.connect(hostPeerId, { reliable: true });
        this.setupConnection(conn);
      }
    }

    this.renderPeersList();
  },

  renderPeersList() {
    const container = document.getElementById('airdrop-peers-container');
    const countBadge = document.getElementById('airdrop-peer-count');
    if (!container) return;

    const peerKeys = Object.keys(this.peersInfo);
    const totalCount = peerKeys.length + 1;
    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";

    if (countBadge) {
      countBadge.textContent = isEn ? `${totalCount} Device(s) Online` : `${totalCount} 台设备在线`;
    }

    let html = `
      <!-- 本机卡片 -->
      <div style="display: flex; align-items: center; gap: 10px; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.4); padding: 10px 14px; border-radius: var(--radius-sm);">
        <div style="font-size: 22px;">${this.platform === 'mobile' ? '📱' : '💻'}</div>
        <div>
          <div style="font-size: 13px; font-weight: 700; color: #fff;">${this.deviceName} <span style="font-size: 11px; color: var(--color-secondary);">${isEn ? "(This Device)" : "(本机)"}</span></div>
          <div style="font-size: 11px; color: #10b981; display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981;"></span>
            ${this.isHost ? (isEn ? "Host Node Ready" : "Host 节点就绪") : (isEn ? "Client Node Ready" : "Client 节点就绪")}
          </div>
        </div>
      </div>
    `;

    if (peerKeys.length === 0) {
      html += `
        <!-- 等待对端加入状态 -->
        <div style="display: flex; align-items: center; gap: 8px; background: var(--surface-low); border: 1px dashed var(--border-light); padding: 10px 14px; border-radius: var(--radius-sm); color: var(--text-muted); font-size: 12px;">
          <span class="material-symbols-outlined" style="font-size: 18px; color: var(--color-secondary);">qr_code_scanner</span>
          <span>${isEn ? "Waiting for peer devices to connect... (Open URL on phone)" : "等待对端手机或电脑连接... (手机打开上方链接秒连)"}</span>
        </div>
      `;
    } else {
      peerKeys.forEach(k => {
        const peer = this.peersInfo[k];
        const icon = peer.platform === 'mobile' ? '📱' : '💻';
        html += `
          <!-- 发现的对端设备卡片 -->
          <div style="display: flex; align-items: center; gap: 10px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 10px 14px; border-radius: var(--radius-sm); animation: fadeIn 0.3s ease;">
            <div style="font-size: 22px;">${icon}</div>
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #fff;">${peer.name}</div>
              <div style="font-size: 11px; color: #10b981; display: flex; align-items: center; gap: 4px;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981;"></span>
                ${isEn ? "WebRTC P2P Connected, Ready" : "WebRTC P2P 已连通，可投送"}
              </div>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;
  },

  // 6. 发送数据 Payload (优先 P2P WebRTC，降级 BroadcastChannel)
  sendPayload(payload) {
    let sentViaP2P = false;

    // 遍历所有 WebRTC 直连通道发送
    Object.values(this.activeConnections).forEach(conn => {
      if (conn && conn.open) {
        conn.send(payload);
        sentViaP2P = true;
      }
    });

    // 同时本地广播
    if (this.broadcastChan) {
      this.broadcastChan.postMessage(payload);
    }

    this.renderSentItem(payload);

    if (!sentViaP2P && Object.keys(this.activeConnections).length === 0) {
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      this.appendSystemNotice(isEn ? `⚠️ No peers online in room #${this.roomId}. Broadcast locally.` : `⚠️ 当前频道暂无其他对端设备在线，已在本地广播。请确保手机也打开了相同频道 #${this.roomId}。`);
    }
  },

  // 7. 文本与文件发送绑定
  initSendActions() {
    const sendTextBtn = document.getElementById('airdrop-send-text-btn');
    const textInput = document.getElementById('airdrop-text-input');

    if (sendTextBtn && textInput) {
      sendTextBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        if (!text) {
          if (typeof Toast !== "undefined") Toast.warning(isEn ? "Please enter text before sending." : "请输入要投送的文本内容。");
          return;
        }

        const peerCount = Object.keys(this.activeConnections).length;
        if (peerCount === 0) {
          if (typeof Toast !== "undefined") {
            Toast.warning(isEn 
              ? `⚠️ No peers connected in Room #${this.roomId}. Ready for broadcast, but waiting for devices to join.` 
              : `⚠️ 频道 #${this.roomId} 暂无其他对端设备在线！请让另一台手机或电脑加入同频后再发送。`);
          }
        }

        const payload = {
          type: 'text',
          sender: this.deviceId,
          senderName: this.deviceName,
          content: text,
          timestamp: Date.now()
        };

        this.sendPayload(payload);
        textInput.value = '';

        if (peerCount > 0) {
          if (typeof Toast !== "undefined") {
            Toast.success(isEn ? `✅ Sent text to ${peerCount} device(s)!` : `✅ 文本已成功投送至 ${peerCount} 台对端设备！`);
          }
        }
      });
    }
  },

  initFileDrop() {
    const dropZone = document.getElementById('airdrop-dropzone');
    const fileInput = document.getElementById('airdrop-file-input');

    if (!dropZone || !fileInput) return;

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--color-secondary)';
      dropZone.style.background = 'rgba(6, 182, 212, 0.1)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = 'var(--border-light)';
      dropZone.style.background = 'var(--surface-low)';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--border-light)';
      dropZone.style.background = 'var(--surface-low)';

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          this.processFileSend(e.dataTransfer.files[i]);
        }
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        for (let i = 0; i < e.target.files.length; i++) {
          this.processFileSend(e.target.files[i]);
        }
        fileInput.value = '';
      }
    });

    // 监听粘贴板文件 (截屏后 Ctrl+V / ⌘V 快速秒传)
    window.addEventListener('paste', (e) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const activeTab = document.querySelector('.nav-tab.active, .bento-nav-link.active');
        const isAirdropView = window.location.pathname.includes('airdrop') || 
          (activeTab && activeTab.getAttribute('data-tab') === 'airdrop');
        if (isAirdropView) {
          for (let i = 0; i < e.clipboardData.files.length; i++) {
            this.processFileSend(e.clipboardData.files[i]);
          }
        }
      }
    });
  },

  processFileSend(file) {
    this.requestWakeLock();
    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    if (file.size > 50 * 1024 * 1024) {
      if (typeof Toast !== "undefined") Toast.warning(isEn ? "Please keep individual file transfers under 50MB." : "P2P 直传单次文件请限制在 50MB 以内。");
      return;
    }

    const formatSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };
    const sizeStr = formatSize(file.size);

    // 立即激活实时传输 HUD 进度看板
    this.showTransferHud(file.name, sizeStr, 'send');
    if (typeof Toast !== "undefined") {
      Toast.info(isEn ? `📤 Preparing & sending "${file.name}" (${sizeStr})...` : `📤 正在打包发送 "${file.name}" (${sizeStr})...`);
    }

    const peerCount = Object.keys(this.activeConnections).length;
    if (peerCount === 0) {
      if (typeof Toast !== "undefined") {
        Toast.warning(isEn 
          ? `⚠️ No peers online in Room #${this.roomId}. Ready for broadcast, but waiting for devices to join.` 
          : `⚠️ 频道 #${this.roomId} 当前暂无其他对端设备在线！已就绪，但需另一端加入后方可接收。`);
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      let detectedType = file.type;
      if (!detectedType) {
        const ext = (file.name || '').split('.').pop().toLowerCase();
        const mimeMap = {
          'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
          'webp': 'image/webp', 'gif': 'image/gif', 'bmp': 'image/bmp',
          'svg': 'image/svg+xml', 'ico': 'image/x-icon', 'avif': 'image/avif'
        };
        detectedType = mimeMap[ext] || 'application/octet-stream';
      }

      const payload = {
        type: 'file',
        sender: this.deviceId,
        senderName: this.deviceName,
        fileName: file.name,
        fileSize: sizeStr,
        fileType: detectedType,
        dataUrl: e.target.result,
        timestamp: Date.now()
      };

      this.sendPayload(payload);
      this.completeTransferHud(file.name, true);

      if (peerCount > 0) {
        if (typeof Toast !== "undefined") {
          Toast.success(isEn ? `🎉 "${file.name}" sent to ${peerCount} peer(s)!` : `🎉 "${file.name}" 已成功投送至 ${peerCount} 台对端设备！`);
        }
      }
    };
    reader.onerror = () => {
      this.completeTransferHud(file.name, false);
      if (typeof Toast !== "undefined") {
        Toast.error(isEn ? `Failed to read file: ${file.name}` : `读取文件失败: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  },

  receivePayload(payload) {
    this.requestWakeLock();
    const list = document.getElementById('airdrop-messages-list');
    if (!list) return;

    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    const isFile = payload.type === 'file';
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // 三重智能图片识别 (MIME / DataUrl / 扩展名)，杜绝由于发送端 MIME 丢失导致图片判定失败
    const fileExt = (payload.fileName || '').split('.').pop().toLowerCase();
    const isImageByExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico', 'heic', 'avif'].includes(fileExt);
    const isImageByMime = Boolean((payload.fileType && payload.fileType.startsWith('image/')) ||
                                  (payload.dataUrl && payload.dataUrl.startsWith('data:image/')));
    const isImage = isFile && (isImageByMime || isImageByExt);

    // 1. 针对文件类型：通过 Blob + URL.createObjectURL 根除 Android TransactionTooLargeException 闪退
    let blobUrl = '';
    if (isFile && payload.dataUrl) {
      const blob = this.b64toBlob(payload.dataUrl);
      if (blob) {
        try {
          blobUrl = URL.createObjectURL(blob);
        } catch (e) {
          console.warn('URL.createObjectURL failed, fallback to dataUrl:', e);
        }
      }
      if (!blobUrl) blobUrl = payload.dataUrl;
    }

    // 图片原生显示源：保留 dataUrl 以支持 Android 系统浏览器长按 saveDataUri 直接落盘
    const imageDisplaySrc = isImage ? (payload.dataUrl || blobUrl) : '';

    // 2. 手机端触觉振动反馈 (Haptic feedback)
    if (navigator.vibrate) {
      try { navigator.vibrate([150, 80, 150]); } catch (e) {}
    }

    // 3. 构建接收卡片 (加入脉冲高亮动画 airdrop-item-highlight)
    const item = document.createElement('div');
    item.className = 'history-item airdrop-item-highlight';
    item.style.background = 'rgba(16, 185, 129, 0.08)';
    item.style.border = '1px solid rgba(16, 185, 129, 0.35)';
    item.style.marginBottom = '12px';

    if (isFile) {
      const btnLabel = isImage 
        ? (isMobile ? (isEn ? "Save to Photos / Files" : "📲 保存到相册 / 文件") : (isEn ? "Save Image" : "保存图片"))
        : (isMobile ? (isEn ? "Save to Files" : "📲 保存到文件") : (isEn ? "Save File" : "保存/下载文件"));

      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #10b981; font-weight: 700; font-size: 12px;">${isEn ? `📥 Received file from [${payload.senderName}]` : `📥 收到来自 [${payload.senderName}] 的文件`}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 6px;">📄 ${payload.fileName} (${payload.fileSize})</div>
          ${isImage ? `
            <div class="airdrop-preview-img-wrap" id="img-wrap-${payload.timestamp}" style="text-align: center; margin: 8px 0; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 6px; cursor: pointer;">
              <img src="${imageDisplaySrc}" alt="${payload.fileName}" style="max-height: 220px; max-width: 100%; border-radius: 6px; display: inline-block; object-fit: contain; -webkit-touch-callout: default !important; user-select: auto !important;" />
            </div>
            <div style="font-size: 11px; color: #10b981; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 4px; background: rgba(16, 185, 129, 0.1); padding: 5px 8px; border-radius: 4px;">
              <span class="material-symbols-outlined" style="font-size: 15px;">touch_app</span>
              <span>${isEn ? "Tip: Tap green button or long-press image to save" : "手机端技巧：点击下方绿色按钮即可唤起相册保存，亦可长按图片保存"}</span>
            </div>
          ` : ''}
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-primary airdrop-download-btn" style="padding: 7px 16px; font-size: 12px; font-weight: 700; background: #10b981; border-color: #10b981; display: inline-flex; align-items: center; gap: 5px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">${isMobile ? 'share' : 'download'}</span> ${btnLabel}
            </button>
            <span style="font-size: 11px; color: var(--text-muted);">P2P 原生安全直传</span>
          </div>
        </div>
      `;

      const doSave = () => {
        this.saveFileToDevice(blob, payload.fileName, payload.fileType, payload.dataUrl);
      };

      const downloadBtn = item.querySelector('.airdrop-download-btn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          doSave();
        });
      }

      if (isImage) {
        const imgWrap = item.querySelector(`#img-wrap-${payload.timestamp}`);
        if (imgWrap) {
          imgWrap.addEventListener('click', () => {
            this.showImageLightbox(imageDisplaySrc, payload.fileName, payload.fileSize, doSave);
          });
        }
      }

      if (typeof Toast !== "undefined") Toast.success(isEn ? `📥 Received file: ${payload.fileName}` : `📥 收到新文件: ${payload.fileName}`);
    } else {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #10b981; font-weight: 700; font-size: 12px;">${isEn ? `💬 Received text from [${payload.senderName}]` : `💬 收到来自 [${payload.senderName}] 的文本`}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 13px; color: var(--text-primary); white-space: pre-wrap; background: var(--surface-low); padding: 8px 12px; border-radius: 4px; margin-bottom: 6px;">${payload.content}</div>
          <button class="btn airdrop-copy-text-btn" style="background: var(--surface-high); font-size: 11px; padding: 4px 10px;">
            <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">content_copy</span> ${isEn ? "Copy Text" : "复制文本"}
          </button>
        </div>
      `;

      const copyBtn = item.querySelector('.airdrop-copy-text-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(payload.content).then(() => {
            if (typeof Toast !== 'undefined') Toast.success(isEn ? "Text copied to clipboard!" : "已复制接收内容！");
          });
        });
      }

      if (typeof Toast !== "undefined") Toast.info(isEn ? `💬 Received text from ${payload.senderName}` : `💬 收到来自 ${payload.senderName} 的文本`);
    }

    list.prepend(item);

    // 4. 移动端即时到达强感知增强 (Banner 置顶通告 + 选项卡红点 / 自动切至接收流)
    const bannerTitle = isFile ? (isEn ? `📥 New File: ${payload.fileName}` : `📥 收到新文件: ${payload.fileName}`) : (isEn ? `💬 New Message from [${payload.senderName}]` : `💬 收到新消息: [${payload.senderName}]`);
    const bannerDesc = isFile ? `${payload.fileSize} · ${isEn ? "Tap to view & save" : "点击立即查看与保存"}` : (payload.content.length > 25 ? payload.content.substring(0, 25) + '...' : payload.content);
    const bannerAction = isEn ? "View Now" : "立即查看";

    this.showIncomingBanner(bannerTitle, bannerDesc, bannerAction, () => {
      if (this.switchMobileTab) this.switchMobileTab('recv');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // 若当前在发送 Tab，自动未读红点递增，或直接自动切到接收面板以方便用户即刻感知
    if (this.currentMobileTab !== 'recv') {
      const unreadBadge = document.getElementById('airdrop-unread-badge');
      if (unreadBadge) {
        unreadBadge.style.display = 'inline-block';
        const currentCount = parseInt(unreadBadge.textContent || '0', 10);
        unreadBadge.textContent = String(currentCount + 1);
      }
      // 若是文件接收，直接平滑切到接收面板，彻底解决手机端“不能立马看到有文件传输过来”的问题
      if (isFile && this.switchMobileTab) {
        this.switchMobileTab('recv');
      }
    }
  },

  renderSentItem(payload) {
    const list = document.getElementById('airdrop-messages-list');
    if (!list) return;

    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    const item = document.createElement('div');
    item.className = 'history-item';
    item.style.marginBottom = '12px';
    item.style.background = 'rgba(56, 189, 248, 0.06)';
    item.style.border = '1px solid rgba(56, 189, 248, 0.25)';

    const peerCount = Object.keys(this.activeConnections).length;
    const peerStatus = peerCount > 0 
      ? `<span style="color: #10b981; font-weight: 600; font-size: 11px;">✅ ${isEn ? `Sent to ${peerCount} peer(s)` : `已送达至 ${peerCount} 台对端设备`}</span>`
      : `<span style="color: #fbbf24; font-weight: 600; font-size: 11px;">⚠️ ${isEn ? "Broadcasted locally (No peers connected)" : "仅本地广播 (当前频道暂无对端)"}</span>`;

    if (payload.type === 'file') {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; align-items: center;">
            <span style="color: var(--color-primary); font-weight: 700; font-size: 12px;">${isEn ? `📤 Sent File (${payload.fileSize})` : `📤 已投送文件 (${payload.fileSize})`}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-size: 14px; color: var(--text-primary); margin-bottom: 4px;">📄 ${payload.fileName}</div>
          <div>${peerStatus}</div>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; align-items: center;">
            <span style="color: var(--color-primary); font-weight: 700; font-size: 12px;">${isEn ? "📤 Sent Text" : "📤 已投送文本"}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary); white-space: pre-wrap; margin-bottom: 4px;">${payload.content}</div>
          <div>${peerStatus}</div>
        </div>
      `;
    }

    list.prepend(item);
  },

  appendSystemNotice(msg) {
    const list = document.getElementById('airdrop-messages-list');
    if (!list) return;
    const item = document.createElement('div');
    item.style.fontSize = '12px';
    item.style.color = 'var(--text-muted)';
    item.style.textAlign = 'center';
    item.style.padding = '6px 0';
    item.innerHTML = `📡 <em>${msg}</em>`;
    list.prepend(item);
  }
};

window.AirDropController = AirDropController;
