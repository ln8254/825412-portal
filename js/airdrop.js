/**
 * 825412-portal - 极客隔空快传 (Geek AirDrop - WebRTC P2P Engine)
 * 采用 PeerJS 原生 WebRTC DataChannel 协议，实现端到端纯 P2P 毫秒级直传
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
  peersInfo: {},        // { [peerId]: { name, platform } }
  broadcastChan: null,

  init() {
    this.initDeviceIdentity();
    this.initRoomConnection();
    this.initSendActions();
    this.initFileDrop();
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

    let initialRoom = '';
    if (window.location.hash.startsWith('#drop=')) {
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
        }
      });
    }

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        const url = `${window.location.origin}${window.location.pathname}#drop=${this.roomId}`;
        navigator.clipboard.writeText(url).then(() => {
          alert(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' 
            ? 'AirDrop invite link copied! Open on your mobile phone to connect.' 
            : '隔空快传邀请链接已复制！在手机端打开即可秒连。');
        });
      });
    }
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
      this.appendSystemNotice(`已成为频道 #${this.roomId} 主机节点，正在等待对端设备接入...`);
    });

    this.peer.on('connection', (conn) => {
      this.setupConnection(conn);
    });

    // 如果 Host ID 已经被占（说明已有设备在房间），则自动降级为 Client 节点并连接 Host
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
          this.appendSystemNotice(`已作为客户端接入频道 #${this.roomId}，正在建立 WebRTC 直连...`);
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

    conn.on('close', () => {
      delete this.activeConnections[conn.peer];
      delete this.peersInfo[conn.peer];
      this.renderPeersList();
    });

    conn.on('error', () => {
      delete this.activeConnections[conn.peer];
      delete this.peersInfo[conn.peer];
      this.renderPeersList();
    });
  },

  handleIncomingPayload(payload, conn) {
    if (!payload || !payload.type) return;

    // 1. 握手报文
    if (payload.type === 'handshake') {
      const peerKey = conn ? conn.peer : payload.sender;
      this.peersInfo[peerKey] = {
        name: payload.senderName || '未知设备',
        platform: payload.platform || 'device',
        deviceId: payload.sender
      };

      this.renderPeersList();
      this.appendSystemNotice(`🎉 WebRTC P2P 直连成功！发现对端设备 [${payload.senderName}]，可秒发文件！`);
      return;
    }

    // 2. 文本或文件内容
    this.receivePayload(payload);
  },

  renderPeersList() {
    const container = document.getElementById('airdrop-peers-container');
    const countBadge = document.getElementById('airdrop-peer-count');
    if (!container) return;

    const peerKeys = Object.keys(this.peersInfo);
    const totalCount = peerKeys.length + 1;

    if (countBadge) {
      countBadge.textContent = `${totalCount} 台设备在线`;
    }

    let html = `
      <!-- 本机卡片 -->
      <div style="display: flex; align-items: center; gap: 10px; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.4); padding: 10px 14px; border-radius: var(--radius-sm);">
        <div style="font-size: 22px;">${this.platform === 'mobile' ? '📱' : '💻'}</div>
        <div>
          <div style="font-size: 13px; font-weight: 700; color: #fff;">${this.deviceName} <span style="font-size: 11px; color: var(--color-secondary);">(本机)</span></div>
          <div style="font-size: 11px; color: #10b981; display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981;"></span>
            ${this.isHost ? 'Host 节点就绪' : 'Client 节点就绪'}
          </div>
        </div>
      </div>
    `;

    if (peerKeys.length === 0) {
      html += `
        <!-- 等待对端加入状态 -->
        <div style="display: flex; align-items: center; gap: 8px; background: var(--surface-low); border: 1px dashed var(--border-light); padding: 10px 14px; border-radius: var(--radius-sm); color: var(--text-muted); font-size: 12px;">
          <span class="material-symbols-outlined" style="font-size: 18px; color: var(--color-secondary);">qr_code_scanner</span>
          <span>等待对端手机或电脑连接... (手机打开上方链接秒连)</span>
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
                WebRTC P2P 已连通，可投送
              </div>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;
  },

  // 3. 发送数据 Payload (优先 P2P WebRTC，降级 BroadcastChannel)
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
      this.appendSystemNotice(`⚠️ 当前频道暂无其他对端设备在线，已在本地广播。请确保手机也打开了相同频道 #${this.roomId}。`);
    }
  },

  // 4. 文本与文件发送绑定
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
      alert('P2P 直传单次文件请限制在 50MB 以内。');
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
            <span style="color: #10b981; font-weight: 700; font-size: 12px;">📥 收到来自 [${payload.senderName}] 的文件</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 6px;">📄 ${payload.fileName} (${payload.fileSize})</div>
          ${isImage ? `<img src="${payload.dataUrl}" style="max-height: 140px; border-radius: 6px; margin-bottom: 8px; display: block;" />` : ''}
          <a href="${payload.dataUrl}" download="${payload.fileName}" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            <span class="material-symbols-outlined" style="font-size: 16px;">download</span> 下载接收文件
          </a>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #10b981; font-weight: 700; font-size: 12px;">💬 收到来自 [${payload.senderName}] 的文本</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 13px; color: var(--text-primary); white-space: pre-wrap; background: var(--surface-low); padding: 8px 12px; border-radius: 4px; margin-bottom: 6px;">${payload.content}</div>
          <button class="btn" onclick="navigator.clipboard.writeText('${payload.content.replace(/'/g, "\\'")}').then(() => alert('已复制接收内容！'))" style="background: var(--surface-high); font-size: 11px; padding: 4px 10px;">
            <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">content_copy</span> 复制文本
          </button>
        </div>
      `;
    }

    list.prepend(item);
  },

  renderSentItem(payload) {
    const list = document.getElementById('airdrop-messages-list');
    if (!list) return;

    const item = document.createElement('div');
    item.className = 'history-item';
    item.style.marginBottom = '12px';

    if (payload.type === 'file') {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-secondary); font-weight: 700; font-size: 12px;">📤 已投送文件 (${payload.fileSize})</span>
            <span style="font-size: 11px; color: var(--text-muted);">${new Date(payload.timestamp).toLocaleTimeString()}</span>
          </div>
          <div style="font-size: 14px; color: var(--text-primary);">📄 ${payload.fileName}</div>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div style="flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--color-secondary); font-weight: 700; font-size: 12px;">📤 已投送文本</span>
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
