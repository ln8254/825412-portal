/**
 * 825412-portal - 主逻辑控制器 (Main App Controller)
 */
document.addEventListener('DOMContentLoaded', () => {
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

      if (toolType === 'password') {
        document.querySelector('[data-tab="password-tab"]').classList.add('active');
        document.getElementById('password-tab').classList.add('active');
      } else if (toolType === 'time') {
        document.querySelector('[data-tab="time-tab"]').classList.add('active');
        document.getElementById('time-tab').classList.add('active');
      } else if (toolType === 'text') {
        document.querySelector('[data-tab="text-tab"]').classList.add('active');
        document.getElementById('text-tab').classList.add('active');
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
 * 仪表盘系统性能监视器 (模拟微动画)
 */
function startSystemMetricsMonitor() {
  const systemLoadText = document.getElementById('system-load');
  const cpuProgress = document.getElementById('cpu-progress');

  if (!systemLoadText) return;

  // 模拟数值持续随机波动
  setInterval(() => {
    const randomLoad = (Math.random() * 2.5 + 0.1).toFixed(2);
    const progressWidth = Math.min(100, Math.floor((randomLoad / 3.0) * 100));

    systemLoadText.textContent = randomLoad;
    cpuProgress.style.width = `${progressWidth}%`;
  }, 3000);
}
