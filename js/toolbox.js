/**
 * 825412-portal - 极客工具箱逻辑 (Toolbox Controller)
 */
const ToolboxController = {
  init() {
    this.initPasswordGenerator();
    this.initTimeConverter();
    this.initTextProcessor();
  },

  // ==========================================
  // 1. 密码生成器逻辑
  // ==========================================
  initPasswordGenerator() {
    const generateBtn = document.getElementById('generate-password-btn');
    const copyBtn = document.getElementById('copy-password-btn');
    const lengthInput = document.getElementById('password-length');
    const lengthVal = document.getElementById('length-val');
    
    if (!generateBtn) return;

    // 联动滑动条数值
    lengthInput.addEventListener('input', (e) => {
      lengthVal.textContent = e.target.value;
    });

    generateBtn.addEventListener('click', () => {
      const length = parseInt(lengthInput.value);
      const uppercase = document.getElementById('include-uppercase').checked;
      const lowercase = document.getElementById('include-lowercase').checked;
      const numbers = document.getElementById('include-numbers').checked;
      const symbols = document.getElementById('include-symbols').checked;

      const pwd = this.generatePassword(length, uppercase, lowercase, numbers, symbols);
      const display = document.getElementById('generated-password');
      display.textContent = pwd;
    });

    copyBtn.addEventListener('click', () => {
      const pwd = document.getElementById('generated-password').textContent;
      if (pwd && pwd !== '点击下方生成按钮') {
        navigator.clipboard.writeText(pwd).then(() => {
          alert('密码已成功复制到剪贴板！');
        });
      }
    });
  },

  generatePassword(length, uppercase, lowercase, numbers, symbols) {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numChars = '0123456789';
    const symChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let charPool = '';
    let mandatory = [];

    if (uppercase) {
      charPool += upperChars;
      mandatory.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
    }
    if (lowercase) {
      charPool += lowerChars;
      mandatory.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
    }
    if (numbers) {
      charPool += numChars;
      mandatory.push(numChars[Math.floor(Math.random() * numChars.length)]);
    }
    if (symbols) {
      charPool += symChars;
      mandatory.push(symChars[Math.floor(Math.random() * symChars.length)]);
    }

    if (!charPool) return '请至少选择一种字符类型！';

    let password = [...mandatory];
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      password.push(charPool[randomIndex]);
    }

    // 随机打乱密码字符顺序
    return password.sort(() => Math.random() - 0.5).join('');
  },

  // ==========================================
  // 2. 时间戳转换器逻辑
  // ==========================================
  initTimeConverter() {
    const localTimeInput = document.getElementById('current-local-time');
    const currentTsInput = document.getElementById('current-timestamp');
    const copyCurrentTs = document.getElementById('copy-current-ts');
    
    const inputTs = document.getElementById('input-timestamp');
    const convertBtn = document.getElementById('convert-ts-btn');
    const outputDatetime = document.getElementById('output-datetime');

    if (!localTimeInput) return;

    // 每秒更新当前时间
    setInterval(() => {
      const now = new Date();
      localTimeInput.value = now.toLocaleString();
      currentTsInput.value = Math.floor(now.getTime() / 1000).toString();
    }, 1000);

    copyCurrentTs.addEventListener('click', () => {
      navigator.clipboard.writeText(currentTsInput.value).then(() => {
        alert('当前时间戳已复制！');
      });
    });

    // 填充当前时间戳为默认转换输入
    inputTs.value = Math.floor(Date.now() / 1000).toString();

    convertBtn.addEventListener('click', () => {
      const ts = parseInt(inputTs.value.trim());
      if (isNaN(ts)) {
        alert('请输入有效的时间戳数值！');
        return;
      }
      // 判断是秒还是毫秒
      const isMs = ts.toString().length > 10;
      const date = new Date(isMs ? ts : ts * 1000);
      outputDatetime.value = date.toLocaleString();
    });
  },

  // ==========================================
  // 3. 文本处理工具逻辑
  // ==========================================
  initTextProcessor() {
    const input = document.getElementById('toolbox-text-input');
    const output = document.getElementById('toolbox-text-output');
    const resultBox = document.getElementById('text-result-box');

    const showResult = (val) => {
      output.value = val;
      resultBox.style.display = 'block';
    };

    if (!input) return;

    document.getElementById('text-upper-btn').addEventListener('click', () => {
      showResult(input.value.toUpperCase());
    });

    document.getElementById('text-lower-btn').addEventListener('click', () => {
      showResult(input.value.toLowerCase());
    });

    document.getElementById('text-count-btn').addEventListener('click', () => {
      const chars = input.value.length;
      const words = input.value.trim() === '' ? 0 : input.value.trim().split(/\s+/).length;
      const lines = input.value.split('\n').length;
      showResult(`字符总数: ${chars}\n单词总数: ${words}\n文本行数: ${lines}`);
    });

    document.getElementById('text-b64-enc-btn').addEventListener('click', () => {
      try {
        // 支持 UTF-8 的 Base64 编码
        const encoded = btoa(encodeURIComponent(input.value).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));
        showResult(encoded);
      } catch (err) {
        alert('编码失败，字符可能包含非法格式。');
      }
    });

    document.getElementById('text-b64-dec-btn').addEventListener('click', () => {
      try {
        const decoded = decodeURIComponent(atob(input.value).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        showResult(decoded);
      } catch (err) {
        alert('解码失败，请确认该文本为有效的 Base64 字符串。');
      }
    });

    document.getElementById('text-clear-btn').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      resultBox.style.display = 'none';
    });
  }
};

window.ToolboxController = ToolboxController;
