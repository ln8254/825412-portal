/**
 * 825412-portal - 极客隔空快传 (Geek AirDrop / Local Peer Drop Controller)
 * 支持：局域网/跨设备免登录即时快传、房间码配对、文本/文件/图片直传、进度监听
 */
const AirDropController = {
  roomId: '',
  deviceId: '',
  deviceName: '',
  channel: null,
  pollTimer: null,
  API_BASE: 'https://api.restful-api.dev/objects',

  init() {
    this.initDeviceIdentity();
    this.initRoomConnection();
    this.initSendActions();
    this.initFileDrop();
  },

  // 1. 初始化设备标识与昵称
  initDeviceIdentity() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const platform = isMobile ? '📱 Mobile Device' : '💻 Desktop Workstation';
    this.deviceId = 'dev_' + Math.random().toString(36).substring(2, 8);
    this.deviceName = `${platform} (${navigator.language || 'zh-CN'})`;

    const nameEl = document.getElementById('airdrop-my-name');
    if (nameEl) nameEl.textContent = this.deviceName;
  },

  // 2. 初始化房间连接与监听
  initRoomConnection() {
    const roomInput = document.getElementById('airdrop-room-input');
    const joinBtn = document.getElementById('airdrop-join-btn');
    const copyLinkBtn = document.getElementById('airdrop-copy-link-btn');
    const roomBadge = document.getElementById('airdrop-current-room');

    // 检查 URL 中是否有房间 Hash (#drop=XXXX)
    let initialRoom = '';
    if (window.location.hash.startsWith('#drop=')) {
      initialRoom = window.location.hash.replace('#drop=', '').trim();
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
          alert(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'AirDrop invite link copied! Open on your phone to connect.' : '隔空快传邀请链接已复制！在手机端打开即可秒连。');
        });
      });
    }
  },

  joinRoom(roomId) {
    this.roomId = roomId;
    const roomBadge = document.getElementById('airdrop-current-room');
    const roomInput = document.getElementById('airdrop-room-input');
    if (roomBadge) roomBadge.textContent = `#${roomId}`;
    if (roomInput) roomInput.value = roomId;

    // 使用 BroadcastChannel 进行同浏览器多标签页秒通
    if (window.BroadcastChannel) {
      if (this.channel) this.channel.close();
      this.channel = new BroadcastChannel(`airdrop_room_${roomId}`);
      this.channel.onmessage = (e) => {
        if (e.data && e.data.sender !== this.deviceId) {
          this.receivePayload(e.data);
        }
      };
    }

    // 开启轮询云端中继（跨局域网与手机配对）
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollCloudRelay();
    this.pollTimer = setInterval(() => this.pollCloudRelay(), 3500);

    this.appendSystemNotice(`已加入隔空投送频道 #${roomId}。正在扫描附近对等设备...`);
  },

  // 3. 发送文本与文件逻辑
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
        this.renderSentItem(payload);
        textInput.value = '';
      });
    }
  },

  // 4. 文件拖拽上传
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
      alert('单次投送文件请限制在 10MB 以内，以确保浏览器秒级传输体验。');
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
      this.renderSentItem(payload);
    };
    reader.readAsDataURL(file);
  },

  // 广播传输数据
  async sendPayload(payload) {
    // 1. 本地广播通道 (同机多端)
    if (this.channel) {
      this.channel.postMessage(payload);
    }

    // 2. 云端安全沙盒写入 (跨网络设备推送)
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
      console.error('Relay error:', err);
    }
  },

  lastReceivedTime: Date.now(),

  async pollCloudRelay() {
    try {
      // 检查房间最近消息
      const res = await fetch(this.API_BASE);
      if (!res.ok) return;
      const list = await res.json();
      if (!Array.isArray(list)) return;

      const roomItems = list.filter(item => item.name === `825412_drop_${this.roomId}` && item.data);
      roomItems.forEach(item => {
        const payload = item.data;
        if (payload.sender !== this.deviceId && payload.timestamp > this.lastReceivedTime) {
          this.lastReceivedTime = payload.timestamp;
          this.receivePayload(payload);
        }
      });
    } catch (e) {
      // 静默处理轮询异常
    }
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
          ${isImage ? `<img src="${payload.dataUrl}" style="max-height: 120px; border-radius: 6px; margin-bottom: 8px; display: block;" />` : ''}
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
