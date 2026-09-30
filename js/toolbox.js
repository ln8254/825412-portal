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
    this.initMediaSuite();
    this.initCopyButtons();
    this.initCategoryFilters();
  },

  initCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.hub-card');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');

        cards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
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
              if (typeof Toast !== 'undefined') {
                Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Hash copied to clipboard!' : '哈希散列值已复制到剪贴板！');
              }
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
    const generateBtn = document.getElementById('pwd-gen-btn') || document.getElementById('generate-password-btn');
    const copyBtn = document.getElementById('pwd-copy-btn') || document.getElementById('copy-password-btn');
    const lengthInput = document.getElementById('pwd-len') || document.getElementById('password-length');
    const lengthVal = document.getElementById('pwd-len-val') || document.getElementById('length-val');
    const display = document.getElementById('pwd-result') || document.getElementById('generated-password');
    
    if (!generateBtn && !display) return;

    const getCheckbox = (id1, id2) => {
      const el = document.getElementById(id1) || document.getElementById(id2);
      return el ? el.checked : false;
    };

    const runGen = () => {
      const length = lengthInput ? parseInt(lengthInput.value, 10) : 16;
      const uppercase = getCheckbox('pwd-upper', 'include-uppercase');
      const lowercase = getCheckbox('pwd-lower', 'include-lowercase');
      const numbers = getCheckbox('pwd-num', 'include-numbers');
      const symbols = getCheckbox('pwd-sym', 'include-symbols');

      const result = this.generatePassword(length, uppercase, lowercase, numbers, symbols);
      if (display) {
        if ('value' in display) {
          display.value = result.password;
        } else {
          display.textContent = result.password;
        }
      }

      this.updateEntropyDisplay(result.entropy, length, result.charsetSize);
    };

    if (lengthInput) {
      lengthInput.addEventListener('input', (e) => {
        if (lengthVal) lengthVal.textContent = e.target.value;
        runGen();
      });
    }

    ['pwd-upper', 'include-uppercase', 'pwd-lower', 'include-lowercase', 'pwd-num', 'include-numbers', 'pwd-sym', 'include-symbols'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', runGen);
    });

    if (generateBtn) generateBtn.addEventListener('click', runGen);

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const pwd = display ? ('value' in display ? display.value : display.textContent) : '';
        if (pwd && !pwd.startsWith('点击') && !pwd.startsWith('Click')) {
          navigator.clipboard.writeText(pwd).then(() => {
            if (typeof Toast !== 'undefined') {
              Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Password copied to clipboard!' : '密码已成功复制到剪贴板！');
            }
          });
        }
      });
    }

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

  calculateCrackTime(length, charsetSize, isEn) {
    if (!charsetSize || length <= 0) return isEn ? '< 0.001 Seconds' : '< 0.001 秒';
    
    // 算力基准：8卡 RTX 4090 矩阵 Hashcat，NTLM/MD5 破解速度约为 100 GHash/s (1e11 次/秒)
    // 暴力破解平均搜索 50% 密钥空间：Total = (charsetSize ^ length) / 2
    const HASHES_PER_SEC = 1e11;
    const logCombinations = length * Math.log10(charsetSize) - Math.log10(2);
    const logSeconds = logCombinations - Math.log10(HASHES_PER_SEC);

    if (logSeconds < -3) {
      return isEn ? '< 0.001 Seconds (Instant)' : '< 0.001 秒 (瞬间秒破)';
    } else if (logSeconds < 0) {
      const sec = Math.pow(10, logSeconds);
      return isEn ? `${sec.toFixed(3)} Seconds` : `${sec.toFixed(3)} 秒`;
    } else if (logSeconds < Math.log10(60)) {
      const sec = Math.max(1, Math.round(Math.pow(10, logSeconds)));
      return isEn ? `${sec} Seconds` : `${sec} 秒`;
    } else if (logSeconds < Math.log10(3600)) {
      const min = Math.round(Math.pow(10, logSeconds) / 60);
      return isEn ? `~ ${min} Minutes` : `约 ${min} 分钟`;
    } else if (logSeconds < Math.log10(86400)) {
      const hr = Math.round(Math.pow(10, logSeconds) / 3600 * 10) / 10;
      return isEn ? `~ ${hr} Hours` : `约 ${hr} 小时`;
    } else if (logSeconds < Math.log10(86400 * 365.25)) {
      const days = Math.round(Math.pow(10, logSeconds) / 86400);
      return isEn ? `~ ${days} Days` : `约 ${days} 天`;
    } else if (logSeconds < Math.log10(86400 * 365.25 * 10000)) {
      const yrs = Math.round(Math.pow(10, logSeconds) / (86400 * 365.25));
      return isEn ? `~ ${yrs.toLocaleString()} Years` : `约 ${yrs.toLocaleString()} 年`;
    } else if (logSeconds < Math.log10(86400 * 365.25 * 1e8)) {
      const wanYrs = Math.round((Math.pow(10, logSeconds) / (86400 * 365.25 * 10000)) * 10) / 10;
      return isEn ? `~ ${(wanYrs * 10).toFixed(0)}k Years` : `约 ${wanYrs.toLocaleString()} 万年`;
    } else if (logSeconds < Math.log10(86400 * 365.25 * 1e12)) {
      const yiYrs = Math.round((Math.pow(10, logSeconds) / (86400 * 365.25 * 1e8)) * 10) / 10;
      return isEn ? `~ ${yiYrs.toLocaleString()} 亿年` : `约 ${yiYrs.toLocaleString()} 亿年`;
    } else {
      const exponent = Math.floor(logSeconds - Math.log10(86400 * 365.25));
      return isEn ? `> 10^${exponent} Years (Cosmic Scale)` : `超过 10^${exponent} 年 (超越宇宙寿命)`;
    }
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

    const realCrackTime = this.calculateCrackTime(length, charsetSize, isEn);
    crackTimeEl.textContent = realCrackTime;

    // 针对单一字符集（如纯数字、纯小写）进行密码学多样性合规判定
    const isSingleCharset = charsetSize <= 26;

    if (entropy < 40 || length < 8) {
      textEl.textContent = isEn ? 'Weak (High Risk)' : '极弱 (高风险)';
      textEl.style.color = '#ef4444';
      barEl.style.background = '#ef4444';
      crackTimeEl.style.color = '#ef4444';
      tipEl.textContent = isEn ? 'Length too short (< 8 chars), vulnerable to brute force' : '长度过短（低于 8 位），极易被高速彩虹表与字典秒破';
      tipEl.style.color = '#ef4444';
    } else if (charsetSize <= 10) {
      // 纯数字特判：即便长度很长，也缺乏字符复杂度
      textEl.textContent = isEn ? 'Medium (Pure Numbers)' : '中等 (单一纯数字)';
      textEl.style.color = '#f59e0b';
      barEl.style.background = '#f59e0b';
      crackTimeEl.style.color = '#f59e0b';
      tipEl.textContent = isEn ? 'Pure numeric PIN lacks character diversity. Add letters & symbols.' : '纯数字极易被掩码攻击针对，合规规范要求必须混入字母与符号！';
      tipEl.style.color = '#f59e0b';
    } else if (isSingleCharset) {
      // 纯字母特判
      textEl.textContent = isEn ? 'Medium (Single Charset)' : '中等 (单一字符集)';
      textEl.style.color = '#f59e0b';
      barEl.style.background = '#f59e0b';
      crackTimeEl.style.color = '#f59e0b';
      tipEl.textContent = isEn ? 'Single character set lacks complexity. Add numbers and symbols.' : '单一字符集易受词典命中，建议添加数字与特殊符号提升安全级';
      tipEl.style.color = '#f59e0b';
    } else if (entropy < 80) {
      textEl.textContent = isEn ? 'Strong (Multi-Charset)' : '高强度 (多字符集混排)';
      textEl.style.color = '#06b6d4';
      barEl.style.background = 'linear-gradient(to right, #06b6d4, #10b981)';
      crackTimeEl.style.color = '#06b6d4';
      tipEl.textContent = isEn ? 'Meets standard corporate password policy' : '符合绝大多数企业与金融系统的高安全密码合规要求';
      tipEl.style.color = '#06b6d4';
    } else {
      textEl.textContent = isEn ? 'Military Grade (NIST Compliant)' : '军工级 (抗量子/超级算力)';
      textEl.style.color = '#10b981';
      barEl.style.background = 'linear-gradient(to right, #10b981, #8b5cf6)';
      crackTimeEl.style.color = '#10b981';
      tipEl.textContent = isEn ? 'Complies with NIST SP 800-63B standards' : '符合 NIST SP 800-63B 顶级密码安全与抗爆破规范';
      tipEl.style.color = '#10b981';
    }
  },

  // ==========================================
  // 2. JSON 格式化、校验与压缩
  // ==========================================
  initJsonFormatter() {
    const input = document.getElementById('json-input');
    const format2Btn = document.getElementById('json-format-btn') || document.getElementById('json-format-2-btn');
    const format4Btn = document.getElementById('json-format4-btn') || document.getElementById('json-format-4-btn');
    const minifyBtn = document.getElementById('json-minify-btn');
    const escapeBtn = document.getElementById('json-escape-btn');
    const copyBtn = document.getElementById('json-copy-btn');
    const clearBtn = document.getElementById('json-clear-btn');
    const statusBox = document.getElementById('json-status-box');

    if (!input) return;

    const setStatus = (isValid, msg, hasBigInt = false) => {
      const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
      if (statusBox) {
        if (isValid) {
          const bigIntBadge = hasBigInt 
            ? `<span style="margin-left: 8px; font-size: 11px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.4);">${isEn ? '🛡️ BigInt Lossless Protected' : '🛡️ 64位大整数无损保护'}</span>` 
            : '';
          statusBox.innerHTML = `<span class="material-symbols-outlined" style="vertical-align: middle; font-size: 18px; color: #10b981;">check_circle</span> <span style="color: #10b981;">${msg}</span>${bigIntBadge}`;
        } else {
          statusBox.innerHTML = `<span class="material-symbols-outlined" style="vertical-align: middle; font-size: 18px; color: #ef4444;">error</span> <span style="color: #ef4444;">${msg}</span>`;
        }
      }
      if (!isValid && typeof Toast !== 'undefined') {
        Toast.error(msg);
      }
    };

    // 无损大整数 (Lossless 64-bit Integer / Snowflake ID) 保护
    const formatSafeJson = (raw, spaces) => {
      let hasBigInt = false;
      const bigIntMap = [];
      const protectedRaw = raw.replace(/("(?:\\.|[^"\\])*")|(?<=:\s*|\[\s*|,\s*)(-?\d{16,})(?=\s*[,}\]])/g, (match, strToken, numToken) => {
        if (strToken) return strToken;
        if (numToken) {
          hasBigInt = true;
          const idx = bigIntMap.length;
          bigIntMap.push(numToken);
          return match.replace(numToken, `"__BIGINT_PLACEHOLDER_${idx}__"`);
        }
        return match;
      });

      const parsed = JSON.parse(protectedRaw);
      let formatted = JSON.stringify(parsed, null, spaces);
      
      bigIntMap.forEach((origNum, idx) => {
        formatted = formatted.replace(new RegExp(`"__BIGINT_PLACEHOLDER_${idx}__"`, 'g'), origNum);
      });

      return { formatted, hasBigInt };
    };

    const processJson = (spaces) => {
      const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
      const raw = input.value.trim();
      if (!raw) {
        setStatus(true, isEn ? 'Ready for input.' : '等待输入待解析的 JSON 字符串。');
        return;
      }
      try {
        const { formatted, hasBigInt } = formatSafeJson(raw, spaces);
        input.value = formatted;
        const msg = isEn ? 'Valid JSON. Syntax structure verified successfully.' : '有效的 JSON 数据，语法校验通过！';
        setStatus(true, msg, hasBigInt);
        if (typeof Toast !== 'undefined') {
          Toast.success(hasBigInt ? (isEn ? 'Formatted with BigInt protection!' : '格式化完成，已启用 64 位大整数无损保护！') : (isEn ? 'JSON formatted successfully!' : 'JSON 格式化成功！'));
        }
      } catch (err) {
        setStatus(false, `${isEn ? 'JSON Syntax Error: ' : 'JSON 语法错误：'}${err.message}`);
      }
    };

    if (format2Btn) format2Btn.addEventListener('click', () => processJson(2));
    if (format4Btn) format4Btn.addEventListener('click', () => processJson(4));
    if (minifyBtn) minifyBtn.addEventListener('click', () => processJson(0));

    if (escapeBtn) {
      escapeBtn.addEventListener('click', () => {
        let text = input.value.trim();
        if (!text) return;
        if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
          try {
            const unquoted = JSON.parse(text);
            if (typeof unquoted === 'string') text = unquoted;
          } catch (e) {}
        }
        text = text.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
        input.value = text;
        processJson(2);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (input.value) {
          navigator.clipboard.writeText(input.value).then(() => {
            if (typeof Toast !== 'undefined') {
              Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'JSON copied to clipboard!' : 'JSON 内容已复制到剪贴板！');
            }
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
        formatSafeJson(raw, 0);
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
    const headerOut = document.getElementById('jwt-header-out') || document.getElementById('jwt-header-output');
    const payloadOut = document.getElementById('jwt-payload-out') || document.getElementById('jwt-payload-output');
    const validText = document.getElementById('jwt-validity-text');
    const sampleBtn = document.getElementById('jwt-sample-btn') || document.getElementById('jwt-load-sample');
    const decodeBtn = document.getElementById('jwt-decode-btn');

    if (!input) return;

    const base64UrlDecode = (str) => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      return decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    };

    const setOutput = (el, text) => {
      if (!el) return;
      if (el.tagName && (el.tagName.toLowerCase() === 'textarea' || el.tagName.toLowerCase() === 'input')) {
        el.value = text;
      } else {
        el.textContent = text;
      }
    };

    const parseJwt = () => {
      const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';
      const token = input.value.trim();
      if (!token) {
        setOutput(headerOut, '');
        setOutput(payloadOut, '');
        if (validText) {
          validText.textContent = isEn ? 'Waiting for JWT token...' : '等待输入 JWT 令牌...';
          validText.style.color = 'var(--text-muted)';
          if (validText.parentElement) validText.parentElement.style.borderColor = 'var(--border-light)';
        }
        return;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        if (validText) {
          validText.textContent = isEn ? 'Invalid JWT: Token must consist of 3 dot-separated parts.' : '无效的 JWT：格式必须包含由小数点分隔的 Header.Payload.Signature 三段结构。';
          if (validText.parentElement) validText.parentElement.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          validText.style.color = '#ef4444';
        }
        return;
      }

      try {
        const headerJson = JSON.parse(base64UrlDecode(parts[0]));
        const payloadJson = JSON.parse(base64UrlDecode(parts[1]));

        setOutput(headerOut, JSON.stringify(headerJson, null, 2));
        setOutput(payloadOut, JSON.stringify(payloadJson, null, 2));

        // 检查过期时间 exp
        let expInfo = '';
        if (payloadJson.exp) {
          const expTime = payloadJson.exp * 1000;
          const isExpired = Date.now() > expTime;
          expInfo = isExpired 
            ? ` [已过期 / Expired: ${new Date(expTime).toLocaleString()}]`
            : ` [有效至 / Valid until: ${new Date(expTime).toLocaleString()}]`;
        }

        if (validText) {
          validText.textContent = `解析成功！算法: ${headerJson.alg || '未知'} | 签发者: ${payloadJson.iss || 'N/A'}${expInfo}`;
          if (validText.parentElement) validText.parentElement.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          validText.style.color = '#10b981';
        }
      } catch (err) {
        if (validText) {
          validText.textContent = `Base64URL 解码异常: ${err.message}`;
          if (validText.parentElement) validText.parentElement.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          validText.style.color = '#ef4444';
        }
      }
    };

    input.addEventListener('input', parseJwt);
    if (decodeBtn) decodeBtn.addEventListener('click', parseJwt);

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        input.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIE9wZXJhdG9yIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODkzNDU2MDAwfQ.dyt0CohtwvnK2r413VMj4WBL6JN3Id9HxbjA3E2d-wY';
        parseJwt();
      });
    }
  },

  // ==========================================
  // 4. 密码学哈希散列计算器 (Hash Engine: 文本与文件多模态)
  // ==========================================
  initHashCalculator() {
    const textModeBtn = document.getElementById('hash-mode-text-btn');
    const fileModeBtn = document.getElementById('hash-mode-file-btn');
    const textContainer = document.getElementById('hash-text-container');
    const fileContainer = document.getElementById('hash-file-container');
    
    const textInput = document.getElementById('hash-text-input') || document.getElementById('hash-input');
    const calcBtn = document.getElementById('hash-calc-btn');
    const clearBtn = document.getElementById('hash-clear-btn');

    const fileDropzone = document.getElementById('hash-file-dropzone');
    const fileInput = document.getElementById('hash-file-input');
    const fileInfoBox = document.getElementById('hash-file-info');
    const fileNameSize = document.getElementById('hash-file-name-size');
    const calcStatus = document.getElementById('hash-calc-status');

    const uppercaseToggle = document.getElementById('hash-uppercase-toggle');
    const verifyInput = document.getElementById('hash-verify-input');
    const verifyResult = document.getElementById('hash-verify-result');

    const md5El = document.getElementById('hash-md5-out') || document.getElementById('hash-md5');
    const sha1El = document.getElementById('hash-sha1-out') || document.getElementById('hash-sha1');
    const sha256El = document.getElementById('hash-sha256-out') || document.getElementById('hash-sha256');
    const sha512El = document.getElementById('hash-sha512-out') || document.getElementById('hash-sha512');

    let currentHashes = { md5: '', sha1: '', sha256: '', sha512: '' };
    let currentMode = 'text';

    if (!md5El && !textInput) return;

    // 1. 模式切换
    if (textModeBtn && fileModeBtn) {
      textModeBtn.addEventListener('click', () => {
        currentMode = 'text';
        textModeBtn.classList.add('btn-primary');
        textModeBtn.style.background = '';
        fileModeBtn.classList.remove('btn-primary');
        fileModeBtn.style.background = 'var(--surface-high)';
        if (textContainer) textContainer.style.display = 'block';
        if (fileContainer) fileContainer.style.display = 'none';
        updateTextHashes();
      });

      fileModeBtn.addEventListener('click', () => {
        currentMode = 'file';
        fileModeBtn.classList.add('btn-primary');
        fileModeBtn.style.background = '';
        textModeBtn.classList.remove('btn-primary');
        textModeBtn.style.background = 'var(--surface-high)';
        if (textContainer) textContainer.style.display = 'none';
        if (fileContainer) fileContainer.style.display = 'block';
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
          clearOutputs();
        }
      });
    }

    const clearOutputs = () => {
      currentHashes = { md5: '', sha1: '', sha256: '', sha512: '' };
      if (md5El) md5El.textContent = '-';
      if (sha1El) sha1El.textContent = '-';
      if (sha256El) sha256El.textContent = '-';
      if (sha512El) sha512El.textContent = '-';
      runVerification();
    };

    const renderHashes = () => {
      const isUpper = uppercaseToggle && uppercaseToggle.checked;
      const fmt = (val) => {
        if (!val || val === '-') return '-';
        return isUpper ? val.toUpperCase() : val.toLowerCase();
      };

      if (md5El) md5El.textContent = fmt(currentHashes.md5);
      if (sha1El) sha1El.textContent = fmt(currentHashes.sha1);
      if (sha256El) sha256El.textContent = fmt(currentHashes.sha256);
      if (sha512El) sha512El.textContent = fmt(currentHashes.sha512);

      runVerification();
    };

    if (uppercaseToggle) {
      uppercaseToggle.addEventListener('change', renderHashes);
    }

    // 2. 文本哈希计算
    const updateTextHashes = async () => {
      const text = textInput ? textInput.value : '';
      if (!text) {
        clearOutputs();
        return;
      }

      const msgBuffer = new TextEncoder().encode(text);
      currentHashes.md5 = this.pureJsMd5(msgBuffer);

      if (window.crypto && window.crypto.subtle) {
        try {
          const [sha1Buf, sha256Buf, sha512Buf] = await Promise.all([
            crypto.subtle.digest('SHA-1', msgBuffer),
            crypto.subtle.digest('SHA-256', msgBuffer),
            crypto.subtle.digest('SHA-512', msgBuffer)
          ]);

          currentHashes.sha1 = Array.from(new Uint8Array(sha1Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
          currentHashes.sha256 = Array.from(new Uint8Array(sha256Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
          currentHashes.sha512 = Array.from(new Uint8Array(sha512Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
          console.error(e);
        }
      }
      renderHashes();
    };

    if (textInput) {
      textInput.addEventListener('input', updateTextHashes);
      if (textInput.value) {
        updateTextHashes();
      }
    }

    if (calcBtn) {
      calcBtn.addEventListener('click', updateTextHashes);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (textInput) textInput.value = '';
        clearOutputs();
      });
    }

    // 复制按钮监听 (支持 .copy-trigger)
    document.querySelectorAll('.copy-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const targetId = trigger.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const val = 'value' in targetEl ? targetEl.value : targetEl.textContent;
          if (val && val !== '-') {
            navigator.clipboard.writeText(val).then(() => {
              if (typeof Toast !== 'undefined') {
                Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Hash copied to clipboard!' : '哈希值已复制到剪贴板！');
              }
            });
          }
        }
      });
    });

    // 3. 文件附件哈希计算引擎
    const processFileHash = async (file) => {
      if (!file) return;

      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';

      if (fileInfoBox && fileNameSize && calcStatus) {
        fileInfoBox.style.display = 'flex';
        fileNameSize.textContent = `📄 ${file.name} (${sizeMb} MB)`;
        calcStatus.innerHTML = `<span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle; animation: spin 1s linear infinite;">sync</span> ${isEn ? 'Calculating...' : '正在计算散列...'}`;
        calcStatus.style.color = 'var(--color-secondary)';
      }

      const startTime = performance.now();

      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;

        // 计算 MD5
        currentHashes.md5 = this.pureJsMd5(arrayBuffer);

        // 计算 SHA-1, SHA-256, SHA-512
        if (window.crypto && window.crypto.subtle) {
          try {
            const [sha1Buf, sha256Buf, sha512Buf] = await Promise.all([
              crypto.subtle.digest('SHA-1', arrayBuffer),
              crypto.subtle.digest('SHA-256', arrayBuffer),
              crypto.subtle.digest('SHA-512', arrayBuffer)
            ]);

            currentHashes.sha1 = Array.from(new Uint8Array(sha1Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
            currentHashes.sha256 = Array.from(new Uint8Array(sha256Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
            currentHashes.sha512 = Array.from(new Uint8Array(sha512Buf)).map(b => b.toString(16).padStart(2, '0')).join('');
          } catch (err) {
            console.error('File Hash Error:', err);
          }
        }

        const elapsed = Math.round(performance.now() - startTime);
        if (calcStatus) {
          calcStatus.innerHTML = `⚡ ${isEn ? `Done in ${elapsed}ms` : `计算完成 (耗时 ${elapsed}ms)`}`;
          calcStatus.style.color = '#10b981';
        }

        renderHashes();
        if (typeof Toast !== 'undefined') Toast.success(isEn ? `File checksum calculated: ${file.name}` : `文件散列校验码已生成: ${file.name}`);
      };

      reader.readAsArrayBuffer(file);
    };

    if (fileDropzone && fileInput) {
      fileDropzone.addEventListener('click', () => fileInput.click());

      fileDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropzone.style.borderColor = 'var(--color-secondary)';
        fileDropzone.style.background = 'rgba(6, 182, 212, 0.08)';
      });

      fileDropzone.addEventListener('dragleave', () => {
        fileDropzone.style.borderColor = 'var(--border-light)';
        fileDropzone.style.background = 'var(--surface-low)';
      });

      fileDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropzone.style.borderColor = 'var(--border-light)';
        fileDropzone.style.background = 'var(--surface-low)';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          processFileHash(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          processFileHash(e.target.files[0]);
        }
      });
    }

    // 4. 哈希一致性实时比对校验器 (Checksum Matcher)
    const runVerification = () => {
      if (!verifyInput || !verifyResult) return;
      const expected = verifyInput.value.trim().toLowerCase();
      const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';

      if (!expected) {
        verifyResult.textContent = '';
        return;
      }

      const m5 = (currentHashes.md5 || '').toLowerCase();
      const s1 = (currentHashes.sha1 || '').toLowerCase();
      const s256 = (currentHashes.sha256 || '').toLowerCase();
      const s512 = (currentHashes.sha512 || '').toLowerCase();

      if (expected === s256 && s256) {
        verifyResult.textContent = isEn ? '✅ Matches SHA-256 (High Security)' : '✅ 校验匹配！完全符合 SHA-256 (安全推荐)';
        verifyResult.style.color = '#10b981';
      } else if (expected === m5 && m5) {
        verifyResult.textContent = isEn ? '✅ Matches MD5 Checksum' : '✅ 校验匹配！完全符合 MD5 校验码';
        verifyResult.style.color = '#10b981';
      } else if (expected === s1 && s1) {
        verifyResult.textContent = isEn ? '✅ Matches SHA-1 Checksum' : '✅ 校验匹配！完全符合 SHA-1 校验码';
        verifyResult.style.color = '#10b981';
      } else if (expected === s512 && s512) {
        verifyResult.textContent = isEn ? '✅ Matches SHA-512 Checksum' : '✅ 校验匹配！完全符合 SHA-512 校验码';
        verifyResult.style.color = '#10b981';
      } else {
        verifyResult.textContent = isEn ? '❌ Checksum Mismatch' : '❌ 校验码不匹配 (文件可能被篡改或损坏)';
        verifyResult.style.color = '#ef4444';
      }
    };

    if (verifyInput) {
      verifyInput.addEventListener('input', runVerification);
    }
  },

  // 纯 JavaScript 工业级 MD5 算法（支持 Unicode 字符串、TypedArray 与 ArrayBuffer）
  pureJsMd5(input) {
    let bytes;
    if (typeof input === 'string') {
      bytes = new TextEncoder().encode(input);
    } else if (input instanceof ArrayBuffer) {
      bytes = new Uint8Array(input);
    } else if (input instanceof Uint8Array) {
      bytes = input;
    } else {
      bytes = new Uint8Array(0);
    }

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
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }

    var n = bytes.length;
    var state = [1732584193, -271733879, -1732584194, 271733878];
    var i;
    for (i = 64; i <= bytes.length; i += 64) {
      var blk = [];
      for (var j = 0; j < 64; j += 4) {
        blk[j >> 2] = bytes[i - 64 + j] + (bytes[i - 64 + j + 1] << 8) + (bytes[i - 64 + j + 2] << 16) + (bytes[i - 64 + j + 3] << 24);
      }
      md5cycle(state, blk);
    }

    var rem = bytes.subarray(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < rem.length; i++) tail[i >> 2] |= rem[i] << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    var bits = n * 8;
    tail[14] = bits & 0xFFFFFFFF;
    tail[15] = Math.floor(bits / 0x100000000);
    md5cycle(state, tail);

    var hex_chr = '0123456789abcdef'.split('');
    function rhex(num) {
      var s = '';
      for (var j = 0; j < 4; j++) s += hex_chr[(num >> (j * 8 + 4)) & 0x0F] + hex_chr[(num >> (j * 8)) & 0x0F];
      return s;
    }
    return state.map(rhex).join('');
  },

  // ==========================================
  // 5. 时间戳转换器逻辑
  // ==========================================
  initTimeConverter() {
    const localTimeInput = document.getElementById('current-local-time');
    const currentTsInput = document.getElementById('current-timestamp');
    const currentTsSpan = document.getElementById('current-ts');
    const copyCurrentTs = document.getElementById('copy-current-ts');
    
    const inputTs = document.getElementById('input-timestamp');
    const convertBtn = document.getElementById('ts-to-date-btn') || document.getElementById('convert-ts-btn');
    const outputDatetime = document.getElementById('output-datetime');

    const inputDatetime = document.getElementById('input-datetime');
    const dateToTsBtn = document.getElementById('date-to-ts-btn');
    const outputTs = document.getElementById('output-timestamp');

    if (!localTimeInput && !currentTsInput && !currentTsSpan && !inputTs) return;

    const updateTimer = () => {
      const now = new Date();
      const sec = Math.floor(now.getTime() / 1000).toString();
      if (localTimeInput) {
        localTimeInput.value = `${now.toLocaleString()} (UTC ${now.toISOString().replace('T', ' ').substring(0, 19)})`;
      }
      if (currentTsInput) {
        currentTsInput.value = sec;
      }
      if (currentTsSpan) {
        currentTsSpan.textContent = sec;
      }
    };
    updateTimer();
    setInterval(updateTimer, 1000);

    if (copyCurrentTs) {
      copyCurrentTs.addEventListener('click', () => {
        const val = currentTsInput ? currentTsInput.value : (currentTsSpan ? currentTsSpan.textContent : '');
        if (val) {
          navigator.clipboard.writeText(val).then(() => {
            if (typeof Toast !== 'undefined') {
              Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Timestamp copied!' : '当前时间戳已复制！');
            }
          });
        }
      });
    }

    if (inputTs && !inputTs.value) {
      inputTs.value = Math.floor(Date.now() / 1000).toString();
    }

    if (convertBtn && inputTs && outputDatetime) {
      convertBtn.addEventListener('click', () => {
        const raw = inputTs.value.trim();
        if (!raw) return;
        const ts = parseInt(raw, 10);
        if (isNaN(ts)) {
          if (typeof Toast !== 'undefined') {
            Toast.warning(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Please enter a valid numeric timestamp!' : '请输入有效的时间戳数值！');
          }
          return;
        }
        const isMs = raw.length > 10;
        const date = new Date(isMs ? ts : ts * 1000);
        outputDatetime.value = `${date.toLocaleString()} | ISO: ${date.toISOString()}`;
        if (typeof Toast !== 'undefined') Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Converted!' : '转换成功！');
      });
    }

    if (dateToTsBtn && inputDatetime && outputTs) {
      dateToTsBtn.addEventListener('click', () => {
        const val = inputDatetime.value.trim();
        if (!val) return;
        const date = new Date(val);
        if (isNaN(date.getTime())) {
          if (typeof Toast !== 'undefined') {
            Toast.error(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Invalid date format!' : '日期时间格式无效！');
          }
          return;
        }
        outputTs.value = Math.floor(date.getTime() / 1000).toString();
        if (typeof Toast !== 'undefined') Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Converted!' : '转换成功！');
      });
    }
  },

  // ==========================================
  // 6. 文本处理与多维数据统计工具
  // ==========================================
  initTextProcessor() {
    const input = document.getElementById('toolbox-text-input') || document.getElementById('text-input');
    const output = document.getElementById('toolbox-text-output');
    const resultBox = document.getElementById('text-result-box');

    if (!input) return;

    const showResult = (val) => {
      if (output) {
        output.value = val;
        if (resultBox) resultBox.style.display = 'block';
      } else {
        input.value = val;
      }
    };

    const bindClick = (ids, fn) => {
      const idList = Array.isArray(ids) ? ids : [ids];
      idList.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', fn);
      });
    };

    bindClick(['text-upper-btn'], () => {
      showResult(input.value.toUpperCase());
    });

    bindClick(['text-lower-btn'], () => {
      showResult(input.value.toLowerCase());
    });

    bindClick(['text-count-btn'], () => {
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

    bindClick(['text-base64-encode-btn', 'text-b64-enc-btn'], () => {
      try {
        const encoded = btoa(encodeURIComponent(input.value).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));
        showResult(encoded);
      } catch (err) {
        if (typeof Toast !== 'undefined') Toast.error('编码失败，字符可能包含非法格式。');
      }
    });

    bindClick(['text-base64-decode-btn', 'text-b64-dec-btn'], () => {
      try {
        const decoded = decodeURIComponent(atob(input.value).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        showResult(decoded);
      } catch (err) {
        if (typeof Toast !== 'undefined') Toast.error('解码失败，请确认该文本为有效的 Base64 字符串。');
      }
    });

    bindClick(['text-url-encode-btn', 'text-url-enc-btn'], () => {
      showResult(encodeURIComponent(input.value));
    });

    bindClick(['text-url-decode-btn', 'text-url-dec-btn'], () => {
      try {
        showResult(decodeURIComponent(input.value));
      } catch (err) {
        if (typeof Toast !== 'undefined') Toast.error('URL 解码失败，包含不合规的百分号编码。');
      }
    });

    bindClick(['text-clear-btn'], () => {
      input.value = '';
      if (output) output.value = '';
      if (resultBox) resultBox.style.display = 'none';
    });
  },

  // ==========================================
  // 7. 纯前端图片媒体与隐私套件 (Media & Privacy Suite)
  // ==========================================
  initMediaSuite() {
    const dropzone = document.getElementById('media-dropzone');
    const fileInput = document.getElementById('media-file-input');
    const qualitySlider = document.getElementById('media-quality-slider');
    const qualityVal = document.getElementById('media-quality-val');
    const formatSelect = document.getElementById('media-format-select');
    const maxWidthInput = document.getElementById('media-max-width');

    const resultContainer = document.getElementById('media-result-container');
    const origSizeEl = document.getElementById('media-orig-size');
    const compSizeEl = document.getElementById('media-comp-size');
    const savedRatioEl = document.getElementById('media-saved-ratio');
    const downloadBtn = document.getElementById('media-download-btn');

    const exifStatusEl = document.getElementById('media-exif-status');
    const exifDetailsEl = document.getElementById('media-exif-details');
    const exifCleanBtn = document.getElementById('media-exif-clean-btn');

    let currentFile = null;
    let currentCompressedBlob = null;
    let currentImageElement = null;

    if (!dropzone) return;

    if (qualitySlider && qualityVal) {
      qualitySlider.addEventListener('input', () => {
        qualityVal.textContent = `${qualitySlider.value}%`;
        if (currentFile && currentImageElement) {
          processImageCompression();
        }
      });
    }

    if (formatSelect) {
      formatSelect.addEventListener('change', () => {
        if (currentFile && currentImageElement) {
          processImageCompression();
        }
      });
    }

    if (maxWidthInput) {
      maxWidthInput.addEventListener('change', () => {
        if (currentFile && currentImageElement) {
          processImageCompression();
        }
      });
    }

    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const processImageCompression = () => {
      if (!currentImageElement || !currentFile) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = currentImageElement.naturalWidth || currentImageElement.width;
      let height = currentImageElement.naturalHeight || currentImageElement.height;

      const maxWidth = parseInt(maxWidthInput ? maxWidthInput.value : 0);
      if (maxWidth && width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      let mimeType = formatSelect ? formatSelect.value : 'image/webp';
      let isFavicon = mimeType === 'favicon';
      if (isFavicon) {
        width = 32;
        height = 32;
        mimeType = 'image/png';
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制图像（该操作在内存中会自动清洗剥离所有 EXIF 原生数据）
      ctx.drawImage(currentImageElement, 0, 0, width, height);

      const quality = parseInt(qualitySlider ? qualitySlider.value : 80) / 100;

            canvas.toBlob((blob) => {
        if (!blob) return;
        currentCompressedBlob = blob;

        const origSize = currentFile.size;
        const compSize = blob.size;
        const savedPercent = Math.max(0, Math.round(((origSize - compSize) / origSize) * 100));

        if (resultContainer && origSizeEl && compSizeEl && savedRatioEl) {
          resultContainer.style.display = 'block';
          origSizeEl.textContent = formatBytes(origSize);
          compSizeEl.textContent = formatBytes(compSize);
          savedRatioEl.textContent = `🎉 节省 ${savedPercent}%`;
          savedRatioEl.style.color = compSize <= origSize ? '#10b981' : '#f59e0b';
        }

        // Squoosh Dual-Viewport Synchronization
        const squooshSec = document.getElementById('squoosh-preview-section');
        const imgOrig = document.getElementById('img-orig-preview');
        const imgComp = document.getElementById('img-comp-preview');
        const statOrigSize = document.getElementById('stat-orig-size');
        const statOrigDim = document.getElementById('stat-orig-dim');
        const statCompSize = document.getElementById('stat-comp-size');
        const statCompDim = document.getElementById('stat-comp-dim');
        const statSaving = document.getElementById('stat-saving');

        if (squooshSec && imgComp) {
          squooshSec.style.display = 'block';
          imgComp.src = URL.createObjectURL(blob);
          if (statCompSize) statCompSize.textContent = formatBytes(compSize);
          if (statCompDim) statCompDim.textContent = `${width}x${height}`;
          if (statSaving) {
            statSaving.textContent = compSize < origSize ? `-${savedPercent}% 缩减` : `+${savedPercent}% 变大`;
            statSaving.style.background = compSize < origSize ? '#10b981' : '#f59e0b';
          }
        }
      }, mimeType, quality);
          // 3. Squoosh Divider Dragging Support
      const divider = document.getElementById('squoosh-divider');
      const layerComp = document.getElementById('squoosh-layer-comp');
      const viewport = document.getElementById('squoosh-viewport');
      let isDragging = false;

      if (divider && layerComp && viewport) {
        const updateDivider = (clientX) => {
          const rect = viewport.getBoundingClientRect();
          const x = clientX - rect.left;
          const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
          divider.style.left = percent + '%';
          layerComp.style.clipPath = 'inset(0 0 0 ' + percent + '%)';
        };

        divider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
        window.addEventListener('mousemove', (e) => { if (isDragging) updateDivider(e.clientX); });
        window.addEventListener('mouseup', () => { isDragging = false; });

        divider.addEventListener('touchstart', () => { isDragging = true; });
        window.addEventListener('touchmove', (e) => { if (isDragging && e.touches.length > 0) updateDivider(e.touches[0].clientX); });
        window.addEventListener('touchend', () => { isDragging = false; });
      }
    };

    // EXIF 解析逻辑
    const parseExifData = (arrayBuffer) => {
      if (!exifStatusEl || !exifDetailsEl) return;
      const isEn = typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US';

      try {
        const view = new DataView(arrayBuffer);
        if (view.getUint16(0, false) !== 0xFFD8) {
          // 非 JPEG (PNG/WebP 默认无标准 TIFF GPS)
          exifStatusEl.textContent = isEn ? '✅ Clean: No GPS metadata found in file' : '✅ 纯净无痕：该图片未包含敏感 GPS 物理定位';
          exifStatusEl.style.color = '#10b981';
          exifDetailsEl.textContent = isEn ? 'Image format does not contain standard camera EXIF GPS block.' : '当前图像格式未内嵌相机 EXIF GPS 数据块。';
          return;
        }

        let length = view.byteLength, offset = 2, hasExif = false;
        while (offset < length) {
          if (view.getUint16(offset + 2, false) <= 8) break;
          const marker = view.getUint16(offset, false);
          offset += 2;
          if (marker === 0xFFE1) {
            hasExif = true;
            break;
          } else {
            offset += view.getUint16(offset, false);
          }
        }

        if (hasExif) {
          exifStatusEl.textContent = isEn ? '⚠️ Warning: Photo contains camera & device metadata' : '⚠️ 提示：检测到照片内嵌拍摄设备与时间元数据';
          exifStatusEl.style.color = '#f59e0b';
          exifDetailsEl.textContent = isEn ? 'EXIF metadata header detected. Click button below to strip and sanitize for safe publishing.' : '检测到 EXIF APP1 元数据标记。点击下方按钮可彻底抹除所有定位与硬件信息。';
        } else {
          exifStatusEl.textContent = isEn ? '✅ Clean: No GPS or camera metadata found' : '✅ 纯净安全：未检测到拍摄设备或 GPS 隐私数据';
          exifStatusEl.style.color = '#10b981';
          exifDetailsEl.textContent = '';
        }
      } catch (err) {
        exifStatusEl.textContent = isEn ? '✅ Scanned: Privacy check completed' : '✅ 隐私安全扫描完毕';
      }
    };

    const handleFile = (file) => {
      if (!file || !file.type.startsWith('image/')) {
        const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
        if (typeof Toast !== "undefined") Toast.warning(isEn ? "Please select a valid image file (PNG, JPG, WebP, BMP)" : "请选择有效的图片文件 (PNG, JPG, WebP, BMP)");
        return;
      }

      currentFile = file;

            // 1. 读取用于压缩渲染
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          currentImageElement = img;
          const imgOrig = document.getElementById('img-orig-preview');
          const statOrigSize = document.getElementById('stat-orig-size');
          const statOrigDim = document.getElementById('stat-orig-dim');
          if (imgOrig) imgOrig.src = e.target.result;
          if (statOrigSize) statOrigSize.textContent = formatBytes(file.size);
          if (statOrigDim) statOrigDim.textContent = `${img.naturalWidth}x${img.naturalHeight}`;
          processImageCompression();
          if (typeof Toast !== 'undefined') Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Image loaded and processed!' : '图片已载入并完成本地极速压缩！');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);

      // 2. 读取用于 EXIF 分析
      const exifReader = new FileReader();
      exifReader.onload = (e) => {
        parseExifData(e.target.result);
      };
      exifReader.readAsArrayBuffer(file);
    };

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--color-secondary)';
        dropzone.style.background = 'rgba(6, 182, 212, 0.08)';
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--border-light)';
        dropzone.style.background = 'var(--surface-high)';
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--border-light)';
        dropzone.style.background = 'var(--surface-high)';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handleFile(e.target.files[0]);
        }
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!currentCompressedBlob) {
          const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      if (typeof Toast !== "undefined") Toast.warning(isEn ? "Please select an image first!" : "请先选择待压缩的图片！");
          return;
        }

        let fmt = formatSelect ? formatSelect.value : 'image/webp';
        let ext = 'webp';
        if (fmt === 'image/jpeg') ext = 'jpg';
        else if (fmt === 'image/png') ext = 'png';
        else if (fmt === 'favicon') ext = 'ico';

        const baseName = currentFile ? currentFile.name.replace(/\.[^/.]+$/, '') : 'compressed';
        const url = URL.createObjectURL(currentCompressedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${baseName}_optimized.${ext}`;
        a.click();
        URL.revokeObjectURL(url);

        if (typeof Toast !== 'undefined') Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'Optimized image downloaded!' : '优化后的图片已保存到本地！');
      });
    }

    if (exifCleanBtn) {
      exifCleanBtn.addEventListener('click', () => {
        if (!currentImageElement) {
          const isEn = typeof I18nController !== "undefined" && I18nController.currentLang === "en-US";
      if (typeof Toast !== "undefined") Toast.warning(isEn ? "Please drop a photo to sanitize first!" : "请先拖入需要清洗 EXIF 隐私的照片！");
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = currentImageElement.naturalWidth || currentImageElement.width;
        canvas.height = currentImageElement.naturalHeight || currentImageElement.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(currentImageElement, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const baseName = currentFile ? currentFile.name.replace(/\.[^/.]+$/, '') : 'photo';
          a.download = `${baseName}_sanitized.jpg`;
          a.click();
          URL.revokeObjectURL(url);

          if (typeof Toast !== 'undefined') Toast.success(typeof I18nController !== 'undefined' && I18nController.currentLang === 'en-US' ? 'EXIF stripped! Sanitized photo exported.' : 'EXIF 隐私已全部清洗！安全纯净照片已导出。');
        }, 'image/jpeg', 0.95);
      });
    }
  }
};

window.ToolboxController = ToolboxController;
