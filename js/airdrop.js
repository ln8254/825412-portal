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

  init() {
    this.initDeviceIdentity();
    this.initRoomConnection();
    this.initSendActions();
    this.initFileDrop();
    this.initRescanAction();
    this.initExitListeners();
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

    const handlePeerDisconnect = () => {
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      const peerName = this.peersInfo[conn.peer] ? this.peersInfo[conn.peer].name : (isEn ? "Remote Peer" : "对端设备");
      delete this.activeConnections[conn.peer];
      delete this.peersInfo[conn.peer];
      this.renderPeersList();
      this.appendSystemNotice(isEn ? `🔌 Device [${peerName}] disconnected.` : `🔌 设备 [${peerName}] 连接已断开。`);
    };

    conn.on('close', handlePeerDisconnect);
    conn.on('error', handlePeerDisconnect);

    // 监听 WebRTC 底层 ICE 状态，快速捕获网络断开与页面关闭
    if (conn.peerConnection) {
      conn.peerConnection.addEventListener('iceconnectionstatechange', () => {
        const state = conn.peerConnection.iceConnectionState;
        if (state === 'disconnected' || state === 'failed' || state === 'closed') {
          handlePeerDisconnect();
        }
      });
    }
  },

  // 3. 高频心跳循环与超时自动清理 (每 1.5 秒心跳，3.5 秒无响应即判定下线)
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

      // 检查对端活跃时间，超时立即剔除
      let changed = false;
      Object.keys(this.peersInfo).forEach(peerId => {
        if (now - this.peersInfo[peerId].lastSeen > 3500) {
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
    }, 1500);
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

  // 4. 页面关闭/刷新监听：主动广播离开通知
  initExitListeners() {
    const notifyExit = () => {
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
    window.addEventListener('pagehide', notifyExit);
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
    // 剔除超时连接
    const now = Date.now();
    Object.keys(this.peersInfo).forEach(k => {
      if (now - this.peersInfo[k].lastSeen > 3000) {
        delete this.activeConnections[k];
        delete this.peersInfo[k];
      }
    });

    // 重新连接 Host
    if (!this.isHost && this.peer && this.peer.open) {
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
        if (!text) return;

        const payload = {
          type: 'text',
          sender: this.deviceId,
          senderName: this.deviceName,
          content: text,
          timestamp: Date.now()
        };

        this.sendPayload(payload);
        textInput.value = '';
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
        this.processFileSend(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.processFileSend(e.target.files[0]);
      }
    });
  },

  processFileSend(file) {
    if (file.size > 50 * 1024 * 1024) {
      const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      if (typeof Toast !== "undefined") Toast.warning(isEn ? "Please keep individual file transfers under 50MB." : "P2P 直传单次文件请限制在 50MB 以内。");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const payload = {
        type: 'file',
        sender: this.deviceId,
        senderName: this.deviceName,
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        fileType: file.type,
        dataUrl: e.target.result,
        timestamp: Date.now()
      };

      this.sendPayload(payload);
    };
    reader.readAsDataURL(file);
  },

  receivePayload(payload) {
    const list = document.getElementById('airdrop-messages-list');
    if (!list) return;

    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    const isFile = payload.type === 'file';
    const isImage = isFile && payload.fileType && payload.fileType.startsWith('image/');

    const item = document.createElement('div');
    item.className = 'history-item';
    item.style.background = 'rgba(16, 185, 129, 0.1)';
    item.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    item.style.marginBottom = '12px';

    if (isFile) {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #10b981; font-weight: 700; font-size: 12px;">${isEn ? `📥 Received file from [${payload.senderName}]` : `📥 收到来自 [${payload.senderName}] 的文件`}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 6px;">📄 ${payload.fileName} (${payload.fileSize})</div>
          ${isImage ? `<img src="${payload.dataUrl}" style="max-height: 140px; border-radius: 6px; margin-bottom: 8px; display: block;" />` : ''}
          <a href="${payload.dataUrl}" download="${payload.fileName}" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            <span class="material-symbols-outlined" style="font-size: 16px;">download</span> ${isEn ? "Download File" : "下载接收文件"}
          </a>
        </div>
      `;
      if (typeof Toast !== "undefined") Toast.success(isEn ? `Received new file: ${payload.fileName}` : `收到新文件: ${payload.fileName}`);
    } else {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #10b981; font-weight: 700; font-size: 12px;">${isEn ? `💬 Received text from [${payload.senderName}]` : `💬 收到来自 [${payload.senderName}] 的文本`}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 13px; color: var(--text-primary); white-space: pre-wrap; background: var(--surface-low); padding: 8px 12px; border-radius: 4px; margin-bottom: 6px;">${payload.content}</div>
          <button class="btn" onclick="navigator.clipboard.writeText('${payload.content.replace(/'/g, "\\'")}').then(() => { if (typeof Toast !== 'undefined') Toast.success('已复制接收内容！'); })" style="background: var(--surface-high); font-size: 11px; padding: 4px 10px;">
            <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">content_copy</span> ${isEn ? "Copy Text" : "复制文本"}
          </button>
        </div>
      `;
      if (typeof Toast !== "undefined") Toast.info(isEn ? `Received text from ${payload.senderName}` : `收到来自 ${payload.senderName} 的文本`);
    }

    list.prepend(item);
  },

  renderSentItem(payload) {
    const list = document.getElementById('airdrop-messages-list');
    if (!list) return;

    const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
    const item = document.createElement('div');
    item.className = 'history-item';
    item.style.marginBottom = '12px';

    if (payload.type === 'file') {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-secondary); font-weight: 700; font-size: 12px;">${isEn ? `📤 Sent File (${payload.fileSize})` : `📤 已投送文件 (${payload.fileSize})`}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-size: 14px; color: var(--text-primary);">📄 ${payload.fileName}</div>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-secondary); font-weight: 700; font-size: 12px;">${isEn ? "📤 Sent Text" : "📤 已投送文本"}</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary); white-space: pre-wrap;">${payload.content}</div>
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
