/**
 * 825412-portal - 极客隔空快传 (Geek AirDrop / Peer Drop Controller)
 * 支持：实时心跳探测、在线设备可视化雷达、双向文件/文本传输、对端一键呼叫
 */
const AirDropController = {
  roomId: '',
  deviceId: '',
  deviceName: '',
  platform: 'desktop',
  channel: null,
  pollTimer: null,
  heartbeatTimer: null,
  peers: {}, // 记录当前房间内活跃的设备 { [id]: { name, platform, lastSeen } }
  API_BASE: 'https://api.restful-api.dev/objects',
  lastReceivedTime: Date.now() - 5000,

  init() {
    this.initDeviceIdentity();
    this.initRoomConnection();
    this.initSendActions();
    this.initFileDrop();
    this.renderPeersList();
  },

  // 1. 初始化设备标识与昵称
  initDeviceIdentity() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.platform = isMobile ? 'mobile' : 'desktop';
    const platformLabel = isMobile ? '📱 Mobile Device' : '💻 Desktop Workstation';
    
    let savedDevId = sessionStorage.getItem('airdrop_device_id');
    if (!savedDevId) {
      savedDevId = 'dev_' + Math.random().toString(36).substring(2, 8);
      sessionStorage.setItem('airdrop_device_id', savedDevId);
    }
    this.deviceId = savedDevId;
    this.deviceName = `${platformLabel} (${(navigator.language || 'zh-CN').toUpperCase()})`;

    const nameEl = document.getElementById('airdrop-my-name');
    if (nameEl) nameEl.textContent = this.deviceName;
  },

  // 2. 初始化房间连接与监听
  initRoomConnection() {
    const roomInput = document.getElementById('airdrop-room-input');
    const joinBtn = document.getElementById('airdrop-join-btn');
    const copyLinkBtn = document.getElementById('airdrop-copy-link-btn');

    // 检查 URL 中是否有房间 Hash (#drop=XXXX)
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
            ? 'AirDrop invite link copied! Open it on your mobile phone to connect instantly.' 
            : '隔空快传邀请链接已复制！在手机浏览器中打开此链接即可秒连。');
        });
      });
    }
  },

  joinRoom(roomId) {
    this.roomId = roomId;
    this.peers = {}; // 重置对端列表
    this.lastReceivedTime = Date.now() - 3000;

    const roomBadge = document.getElementById('airdrop-current-room');
    const roomInput = document.getElementById('airdrop-room-input');
    if (roomBadge) roomBadge.textContent = `#${roomId}`;
    if (roomInput) roomInput.value = roomId;

    // 1. 同机跨 Tab 通道
    if (window.BroadcastChannel) {
      if (this.channel) this.channel.close();
      this.channel = new BroadcastChannel(`airdrop_room_${roomId}`);
      this.channel.onmessage = (e) => {
        if (e.data && e.data.sender !== this.deviceId) {
          this.handleIncomingPayload(e.data);
        }
      };
    }

    // 2. 广播自身在线心跳
    this.broadcastPresence();

    // 3. 启动心跳定时器 (每 2.5 秒广播一次在线状态)
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this.broadcastPresence();
      this.pruneOfflinePeers();
    }, 2500);

    // 4. 开启云端中继拉取 (跨网络与手机传输)
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollCloudRelay();
    this.pollTimer = setInterval(() => this.pollCloudRelay(), 2500);

    this.renderPeersList();
    this.appendSystemNotice(`已接入隔空投送频道 #${roomId}。正在探测同频道设备...`);
  },

  // 3. 广播心跳与状态感知
  broadcastPresence() {
    const presencePayload = {
      type: 'presence',
      sender: this.deviceId,
      senderName: this.deviceName,
      platform: this.platform,
      timestamp: Date.now()
    };
    this.sendPayload(presencePayload, false);
  },

  pruneOfflinePeers() {
    const now = Date.now();
    let changed = false;
    Object.keys(this.peers).forEach(peerId => {
      if (now - this.peers[peerId].lastSeen > 8000) {
        delete this.peers[peerId];
        changed = true;
      }
    });
    if (changed) {
      this.renderPeersList();
    }
  },

  renderPeersList() {
    const container = document.getElementById('airdrop-peers-container');
    const countBadge = document.getElementById('airdrop-peer-count');
    if (!container) return;

    const peerIds = Object.keys(this.peers);
    const totalCount = peerIds.length + 1; // 加上本机

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
            正在监听频道...
          </div>
        </div>
      </div>
    `;

    if (peerIds.length === 0) {
      html += `
        <!-- 等待对端加入状态 -->
        <div style="display: flex; align-items: center; gap: 8px; background: var(--surface-low); border: 1px dashed var(--border-light); padding: 10px 14px; border-radius: var(--radius-sm); color: var(--text-muted); font-size: 12px;">
          <span class="material-symbols-outlined" style="font-size: 18px; color: var(--color-secondary);">qr_code_scanner</span>
          <span>等待手机或电脑对端连接... (可点击上方复制链接发给手机)</span>
        </div>
      `;
    } else {
      peerIds.forEach(id => {
        const peer = this.peers[id];
        const icon = peer.platform === 'mobile' ? '📱' : '💻';
        html += `
          <!-- 发现的对端设备卡片 -->
          <div style="display: flex; align-items: center; gap: 10px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 10px 14px; border-radius: var(--radius-sm); animation: fadeIn 0.3s ease;">
            <div style="font-size: 22px;">${icon}</div>
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #fff;">${peer.name}</div>
              <div style="font-size: 11px; color: #10b981; display: flex; align-items: center; gap: 4px;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981;"></span>
                已就绪，可随时投送
              </div>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;
  },

  // 4. 发送与广播 Payload
  async sendPayload(payload, showLocal = true) {
    if (this.channel) {
      this.channel.postMessage(payload);
    }

    try {
      await fetch(this.API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `825412_drop_${this.roomId}`,
          data: payload
        })
      });
    } catch (err) {
      // 容错处理
    }

    if (showLocal && payload.type !== 'presence') {
      this.renderSentItem(payload);
    }
  },

  async pollCloudRelay() {
    try {
      const res = await fetch(this.API_BASE);
      if (!res.ok) return;
      const list = await res.json();
      if (!Array.isArray(list)) return;

      const roomItems = list.filter(item => item.name === `825412_drop_${this.roomId}` && item.data);
      roomItems.forEach(item => {
        const payload = item.data;
        if (payload.sender !== this.deviceId && payload.timestamp > this.lastReceivedTime) {
          this.lastReceivedTime = payload.timestamp;
          this.handleIncomingPayload(payload);
        }
      });
    } catch (e) {
      // 静默轮询
    }
  },

  handleIncomingPayload(payload) {
    // 1. 心跳/对端上线报文
    if (payload.type === 'presence') {
      const isNew = !this.peers[payload.sender];
      this.peers[payload.sender] = {
        name: payload.senderName || '未知设备',
        platform: payload.platform || 'device',
        lastSeen: Date.now()
      };
      this.renderPeersList();

      if (isNew) {
        this.appendSystemNotice(`🎉 发现新设备 [${payload.senderName}] 已上线！现在可以互传文件和文本了。`);
      }
      return;
    }

    // 2. 文本或文件报文
    this.receivePayload(payload);
  },

  // 5. 文本与文件发送绑定
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
    if (file.size > 10 * 1024 * 1024) {
      alert('单次投送文件请限制在 10MB 以内，以确保传输速度。');
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
    item.style.padding = '8px 0';
    item.innerHTML = `📡 <em>${msg}</em>`;
    list.prepend(item);
  }
};

window.AirDropController = AirDropController;
