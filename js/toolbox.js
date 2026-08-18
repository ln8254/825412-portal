/**
 * 825412-portal - 极客工具箱高级逻辑控制器 (Toolbox Controller)
 * 包含：密码生成与熵值评估、JSON 格式化校验、JWT 调试器、哈希散列计算、时间戳转换、文本多维指标
 */
const ToolboxController = {
  init() {
    this.initPasswordGenerator();
    this.initJsonFormatter();
    this.initJwtDebugger();
    this.initHashCalculator();
    this.initTimeConverter();
    this.initTextProcessor();
    this.initCopyButtons();
  },

  initCopyButtons() {
    ['copy-hash-md5', 'copy-hash-sha1', 'copy-hash-sha256', 'copy-hash-sha512'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          const valId = id.replace('copy-', '');
          const el = document.getElementById(valId);
          if (el && el.textContent && el.textContent !== '-') {
            navigator.clipboard.writeText(el.textContent).then(() => {
              alert(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Hash copied to clipboard!' : '哈希散列值已复制到剪贴板！');
            });
          }
        });
      }
    });
  },

  // ==========================================
  // 1. 密码生成器与信息熵（Entropy）评估引擎
  // ==========================================
  initPasswordGenerator() {
    const generateBtn = document.getElementById('generate-password-btn');
    const copyBtn = document.getElementById('copy-password-btn');
    const lengthInput = document.getElementById('password-length');
    const lengthVal = document.getElementById('length-val');
    
    if (!generateBtn) return;

    const runGen = () => {
      const length = parseInt(lengthInput.value);
      const uppercase = document.getElementById('include-uppercase').checked;
      const lowercase = document.getElementById('include-lowercase').checked;
      const numbers = document.getElementById('include-numbers').checked;
      const symbols = document.getElementById('include-symbols').checked;

      const result = this.generatePassword(length, uppercase, lowercase, numbers, symbols);
      const display = document.getElementById('generated-password');
      display.textContent = result.password;

      this.updateEntropyDisplay(result.entropy, length, result.charsetSize);
    };

    lengthInput.addEventListener('input', (e) => {
      lengthVal.textContent = e.target.value;
      runGen();
    });

    ['include-uppercase', 'include-lowercase', 'include-numbers', 'include-symbols'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', runGen);
    });

    generateBtn.addEventListener('click', runGen);

    copyBtn.addEventListener('click', () => {
      const pwd = document.getElementById('generated-password').textContent;
      if (pwd && !pwd.startsWith('点击') && !pwd.startsWith('Click')) {
        navigator.clipboard.writeText(pwd).then(() => {
          alert(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Password copied to clipboard!' : '密码已成功复制到剪贴板！');
        });
      }
    });

    // 默认执行一次生成
    runGen();
  },

  generatePassword(length, uppercase, lowercase, numbers, symbols) {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numChars = '0123456789';
    const symChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let charPool = '';
    let mandatory = [];
    let charsetSize = 0;

    if (uppercase) {
      charPool += upperChars;
      mandatory.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
      charsetSize += 26;
    }
    if (lowercase) {
      charPool += lowerChars;
      mandatory.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
      charsetSize += 26;
    }
    if (numbers) {
      charPool += numChars;
      mandatory.push(numChars[Math.floor(Math.random() * numChars.length)]);
      charsetSize += 10;
    }
    if (symbols) {
      charPool += symChars;
      mandatory.push(symChars[Math.floor(Math.random() * symChars.length)]);
      charsetSize += 32;
    }

    if (!charPool) {
      return { password: '请至少选择一种字符类型！', entropy: 0, charsetSize: 0 };
    }

    // 使用 Web Crypto API 生成高强度真随机字符
    const randomArray = new Uint32Array(length);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(randomArray);
    }

    let password = [...mandatory];
    for (let i = password.length; i < length; i++) {
      const randIndex = randomArray[i] ? (randomArray[i] % charPool.length) : Math.floor(Math.random() * charPool.length);
      password.push(charPool[randIndex]);
    }

    // 洗牌
    const finalPwd = password.sort(() => Math.random() - 0.5).join('');
    
    // 计算信息熵: E = L * log2(N)
    const entropy = Math.round(length * (Math.log2(charsetSize || 1)) * 10) / 10;

    return { password: finalPwd, entropy, charsetSize };
  },

  updateEntropyDisplay(entropy, length, charsetSize) {
    const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
    const textEl = document.getElementById('pwd-strength-text');
    const barEl = document.getElementById('pwd-strength-bar');
    const entropyEl = document.getElementById('pwd-entropy-val');
    const crackTimeEl = document.getElementById('pwd-crack-time');
    const charsetSizeEl = document.getElementById('pwd-charset-size');
    const tipEl = document.getElementById('pwd-security-tip');

    if (!textEl || !barEl) return;

    entropyEl.textContent = isEn ? `Entropy: ${entropy} Bits` : `熵值: ${entropy} Bits`;
    charsetSizeEl.textContent = isEn ? `${charsetSize} Possible Chars (N)` : `${charsetSize} 个可能字符 (N)`;

    let percent = Math.min(100, Math.max(10, Math.floor((entropy / 100) * 100)));
    barEl.style.width = `${percent}%`;

    if (entropy < 40) {
      textEl.textContent = isEn ? 'Weak (High Risk)' : '极弱 (高风险)';
      textEl.style.color = '#ef4444';
      barEl.style.background = '#ef4444';
      crackTimeEl.textContent = isEn ? '< 1 Second (Instant)' : '< 1 秒 (瞬间破解)';
      crackTimeEl.style.color = '#ef4444';
      tipEl.textContent = isEn ? 'Length too short, please increase length' : '长度过短，建议增加至 12 位以上';
      tipEl.style.color = '#ef4444';
    } else if (entropy < 60) {
      textEl.textContent = isEn ? 'Medium' : '中等 (基础防范)';
      textEl.style.color = '#f59e0b';
      barEl.style.background = '#f59e0b';
      crackTimeEl.textContent = isEn ? '~ 3 Days (Hashcat)' : '约 3 天 (常规破解机)';
      crackTimeEl.style.color = '#f59e0b';
      tipEl.textContent = isEn ? 'Add special symbols or uppercase letters' : '建议混入特殊符号与大写字母提升强度';
      tipEl.style.color = '#f59e0b';
    } else if (entropy < 80) {
      textEl.textContent = isEn ? 'Strong' : '高强度 (非常安全)';
      textEl.style.color = '#06b6d4';
      barEl.style.background = 'linear-gradient(to right, #06b6d4, #10b981)';
      crackTimeEl.textContent = isEn ? '~ 1,400 Years' : '约 1,400 年 (现代算力)';
      crackTimeEl.style.color = '#06b6d4';
      tipEl.textContent = isEn ? 'Meets standard corporate password policy' : '符合绝大多数企业高安全密码合规要求';
      tipEl.style.color = '#06b6d4';
    } else {
      textEl.textContent = isEn ? 'Military Grade' : '极高 (军事级安全)';
      textEl.style.color = '#10b981';
      barEl.style.background = 'linear-gradient(to right, #10b981, #8b5cf6)';
      crackTimeEl.textContent = isEn ? 'Over 300 Million Years' : '超过 3 亿年 (RTX 4090 集群)';
      crackTimeEl.style.color = '#10b981';
      tipEl.textContent = isEn ? 'Complies with NIST SP 800-63B standards' : '符合 NIST SP 800-63B 顶级密码安全规范';
      tipEl.style.color = '#10b981';
    }
  },

  // ==========================================
  // 2. JSON 格式化、校验与压缩
  // ==========================================
  initJsonFormatter() {
    const input = document.getElementById('json-input');
    const format2Btn = document.getElementById('json-format-2-btn');
    const format4Btn = document.getElementById('json-format-4-btn');
    const minifyBtn = document.getElementById('json-minify-btn');
    const copyBtn = document.getElementById('json-copy-btn');
    const clearBtn = document.getElementById('json-clear-btn');
    const statusBox = document.getElementById('json-status-box');

    if (!input) return;

    const setStatus = (isValid, msg) => {
      if (!statusBox) return;
      if (isValid) {
        statusBox.innerHTML = `<span class="material-symbols-outlined" style="vertical-align: middle; font-size: 18px; color: #10b981;">check_circle</span> <span style="color: #10b981;">${msg}</span>`;
      } else {
        statusBox.innerHTML = `<span class="material-symbols-outlined" style="vertical-align: middle; font-size: 18px; color: #ef4444;">error</span> <span style="color: #ef4444;">${msg}</span>`;
      }
    };

    const processJson = (spaces) => {
      const raw = input.value.trim();
      if (!raw) {
        setStatus(true, typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Ready for input.' : '等待输入待解析的 JSON 字符串。');
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        input.value = JSON.stringify(parsed, null, spaces);
        setStatus(true, typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Valid JSON. Syntax structure verified successfully.' : '有效的 JSON 数据，语法校验通过！');
      } catch (err) {
        setStatus(false, `${typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'JSON Syntax Error: ' : 'JSON 语法错误：'}${err.message}`);
      }
    };

    if (format2Btn) format2Btn.addEventListener('click', () => processJson(2));
    if (format4Btn) format4Btn.addEventListener('click', () => processJson(4));
    if (minifyBtn) minifyBtn.addEventListener('click', () => processJson(0));

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (input.value) {
          navigator.clipboard.writeText(input.value).then(() => {
            alert(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'JSON copied to clipboard!' : 'JSON 内容已复制到剪贴板！');
          });
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        setStatus(true, typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Cleared.' : '已清空。');
      });
    }

    // 监听实时输入自动校验
    input.addEventListener('input', () => {
      const raw = input.value.trim();
      if (!raw) {
        setStatus(true, typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'JSON parser ready.' : 'JSON 解析器已就绪。');
        return;
      }
      try {
        JSON.parse(raw);
        setStatus(true, typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Valid JSON syntax.' : 'JSON 语法合法通过。');
      } catch (err) {
        setStatus(false, err.message);
      }
    });
  },

  // ==========================================
  // 3. JWT 令牌解析器 (JWT Debugger)
  // ==========================================
  initJwtDebugger() {
    const input = document.getElementById('jwt-input');
    const headerOut = document.getElementById('jwt-header-output');
    const payloadOut = document.getElementById('jwt-payload-output');
    const validText = document.getElementById('jwt-validity-text');
    const sampleBtn = document.getElementById('jwt-load-sample');

    if (!input) return;

    const base64UrlDecode = (str) => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      return decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    };

    const parseJwt = () => {
      const token = input.value.trim();
      if (!token) {
        headerOut.value = '';
        payloadOut.value = '';
        return;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        validText.textContent = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Invalid JWT: Token must consist of 3 dot-separated parts.' : '无效的 JWT：格式必须包含由小数点分隔的 Header.Payload.Signature 三段结构。';
        validText.parentElement.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        validText.style.color = '#ef4444';
        return;
      }

      try {
        const headerJson = JSON.parse(base64UrlDecode(parts[0]));
        const payloadJson = JSON.parse(base64UrlDecode(parts[1]));

        headerOut.value = JSON.stringify(headerJson, null, 2);
        payloadOut.value = JSON.stringify(payloadJson, null, 2);

        // 检查过期时间 exp
        let expInfo = '';
        if (payloadJson.exp) {
          const expTime = payloadJson.exp * 1000;
          const isExpired = Date.now() > expTime;
          expInfo = isExpired 
            ? ` [已过期 / Expired: ${new Date(expTime).toLocaleString()}]`
            : ` [有效至 / Valid until: ${new Date(expTime).toLocaleString()}]`;
        }

        validText.textContent = `解析成功！算法: ${headerJson.alg || '未知'} | 签发者: ${payloadJson.iss || 'N/A'}${expInfo}`;
        validText.parentElement.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        validText.style.color = '#10b981';
      } catch (err) {
        validText.textContent = `Base64URL 解码异常: ${err.message}`;
        validText.parentElement.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        validText.style.color = '#ef4444';
      }
    };

    input.addEventListener('input', parseJwt);

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        input.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIE9wZXJhdG9yIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODkzNDU2MDAwfQ.dyt0CohtwvnK2r413VMj4WBL6JN3Id9HxbjA3E2d-wY';
        parseJwt();
      });
    }
  },

  // ==========================================
  // 4. 密码学哈希散列计算器 (Hash Engine)
  // ==========================================
  initHashCalculator() {
    const input = document.getElementById('hash-input');
    const md5El = document.getElementById('hash-md5');
    const sha1El = document.getElementById('hash-sha1');
    const sha256El = document.getElementById('hash-sha256');
    const sha512El = document.getElementById('hash-sha512');

    if (!input) return;

    const calcWebCrypto = async (algo, text) => {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const updateHashes = async () => {
      const text = input.value;
      if (!text) {
        md5El.textContent = '-';
        sha1El.textContent = '-';
        sha256El.textContent = '-';
        sha512El.textContent = '-';
        return;
      }

      // MD5 (纯前端快速实现)
      md5El.textContent = this.pureJsMd5(text);

      // Web Crypto API 计算 SHA-1, SHA-256, SHA-512
      try {
        if (window.crypto && window.crypto.subtle) {
          calcWebCrypto('SHA-1', text).then(res => sha1El.textContent = res);
          calcWebCrypto('SHA-256', text).then(res => sha256El.textContent = res);
          calcWebCrypto('SHA-512', text).then(res => sha512El.textContent = res);
        }
      } catch (err) {
        console.error(err);
      }
    };

    input.addEventListener('input', updateHashes);
  },

  // 纯 JavaScript MD5 算法实现
  pureJsMd5(string) {
    function md5cycle(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);

      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);

      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);

      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);

      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    }

    function cmn(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }

    function add32(a, b) {
      return (a + b) & 0xFFFFFFFF;
    }

    function md51(s) {
      var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
      for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
      tail[i >> 2] |= 0x80 << ((i % 4) << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }

    function md5blk(s) {
      var md5blks = [], i;
      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }

    var hex_chr = '0123456789abcdef'.split('');
    function rhex(n) {
      var s = '', j = 0;
      for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
      return s;
    }

    function hex(x) {
      for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
      return x.join('');
    }

    return hex(md51(unescape(encodeURIComponent(string))));
  },

  // ==========================================
  // 5. 时间戳转换器逻辑
  // ==========================================
  initTimeConverter() {
    const localTimeInput = document.getElementById('current-local-time');
    const currentTsInput = document.getElementById('current-timestamp');
    const copyCurrentTs = document.getElementById('copy-current-ts');
    
    const inputTs = document.getElementById('input-timestamp');
    const convertBtn = document.getElementById('convert-ts-btn');
    const outputDatetime = document.getElementById('output-datetime');

    if (!localTimeInput) return;

    setInterval(() => {
      const now = new Date();
      localTimeInput.value = `${now.toLocaleString()} (UTC ${now.toISOString().replace('T', ' ').substring(0, 19)})`;
      currentTsInput.value = Math.floor(now.getTime() / 1000).toString();
    }, 1000);

    copyCurrentTs.addEventListener('click', () => {
      navigator.clipboard.writeText(currentTsInput.value).then(() => {
        alert(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Timestamp copied!' : '当前时间戳已复制！');
      });
    });

    inputTs.value = Math.floor(Date.now() / 1000).toString();

    convertBtn.addEventListener('click', () => {
      const ts = parseInt(inputTs.value.trim());
      if (isNaN(ts)) {
        alert(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Please enter a valid numeric timestamp!' : '请输入有效的时间戳数值！');
        return;
      }
      const isMs = ts.toString().length > 10;
      const date = new Date(isMs ? ts : ts * 1000);
      outputDatetime.value = `${date.toLocaleString()} | ISO: ${date.toISOString()}`;
    });
  },

  // ==========================================
  // 6. 文本处理与多维数据统计工具
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
      const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
      const text = input.value;
      const chars = text.length;
      const utf8Bytes = new TextEncoder().encode(text).length;
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
      const lines = text.split('\n').length;
      const readingMinutes = Math.max(1, Math.ceil((chineseChars + words) / 300));

      if (isEn) {
        showResult(`[Text Analysis Metrics]\n- Total Characters: ${chars}\n- UTF-8 Bytes: ${utf8Bytes} bytes\n- Word Count: ${words}\n- Asian/Chinese Characters: ${chineseChars}\n- Line Count: ${lines}\n- Estimated Reading Time: ~${readingMinutes} min`);
      } else {
        showResult(`【文本多维特征分析】\n- 字符总数 (Length): ${chars}\n- 字节大小 (UTF-8 Bytes): ${utf8Bytes} 字节\n- 英文/空格单词数 (Words): ${words}\n- 中文字符数 (Hanzi): ${chineseChars}\n- 文本总行数 (Lines): ${lines}\n- 预估阅读耗时 (Reading Time): 约 ${readingMinutes} 分钟`);
      }
    });

    document.getElementById('text-b64-enc-btn').addEventListener('click', () => {
      try {
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

    document.getElementById('text-url-enc-btn').addEventListener('click', () => {
      showResult(encodeURIComponent(input.value));
    });

    document.getElementById('text-url-dec-btn').addEventListener('click', () => {
      try {
        showResult(decodeURIComponent(input.value));
      } catch (err) {
        alert('URL 解码失败，包含不合规的百分号编码。');
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
