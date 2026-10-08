#!/usr/bin/env node

/**
 * 825412.xyz - IndexNow 搜索引擎即时推送工具
 * 适用引擎: 微软必应 (Microsoft Bing)、Yandex、Seznam 等开放引擎
 * 官方标准: https://www.indexnow.org/
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const HOST = '825412.xyz';
const KEY = '825412a9e3d74c0b8f15ec62b083d47f';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_FILE = path.join(ROOT_DIR, 'sitemap.xml');

// 1. 获取要推送的 URL 列表
let targetUrls = [];

const args = process.argv.slice(2);
if (args.length > 0 && args[0].startsWith('http')) {
  // 单个或指定 URL
  targetUrls = args;
  console.log(`[IndexNow] 接收到指定单个 URL 推送: ${targetUrls[0]}`);
} else {
  // 从 sitemap.xml 提取全站 Clean URL
  if (!fs.existsSync(SITEMAP_FILE)) {
    console.error(`❌ 未找到 sitemap.xml: ${SITEMAP_FILE}`);
    process.exit(1);
  }

  const sitemapContent = fs.readFileSync(SITEMAP_FILE, 'utf8');
  const matches = [...sitemapContent.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)];
  targetUrls = matches.map(m => m[1].trim());

  // 过滤掉任何可能存在的不规范或已废弃链接
  targetUrls = targetUrls.filter(url => !url.includes('ai-3d-photo'));

  console.log(`[IndexNow] 从 sitemap.xml 提取到 ${targetUrls.length} 个有效索引 URL`);
}

if (targetUrls.length === 0) {
  console.warn('⚠️ 没有需要推送的 URL。');
  process.exit(0);
}

// 2. 构造 IndexNow 标准载荷
const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: targetUrls
});

// 3. 执行推送函数
function submitToIndexNow(apiHost, apiPath = '/indexnow') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: apiHost,
      port: 443,
      path: apiPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log(`\n====================================================`);
  console.log(`🚀 开始向 IndexNow 广播 825412.xyz 的全站网页...`);
  console.log(`目标域名: ${HOST}`);
  console.log(`密钥验证: ${KEY_LOCATION}`);
  console.log(`推送页面总数: ${targetUrls.length} 个`);
  console.log(`====================================================\n`);

  const endpoints = [
    { name: 'IndexNow 联合网关 (api.indexnow.org)', host: 'api.indexnow.org' },
    { name: 'Microsoft Bing 专用网关 (www.bing.com)', host: 'www.bing.com' }
  ];

  for (const ep of endpoints) {
    try {
      console.log(`📡 正在推送至: ${ep.name}...`);
      const res = await submitToIndexNow(ep.host);
      
      if (res.statusCode === 200 || res.statusCode === 202) {
        console.log(`✅ [成功] ${ep.name} 返回 ${res.statusCode} (${res.statusMessage || 'OK'})`);
        console.log(`   搜索引擎已接收到推送请求，将在数小时内调度爬虫进场抓取！`);
      } else {
        console.warn(`⚠️ [提示] ${ep.name} 返回 HTTP ${res.statusCode}: ${res.body || res.statusMessage}`);
        console.warn(`   (注: 若尚未将网站部署上线到公网，IndexNow 校验 key.txt 可能返回 403/422，上线后即生效)`);
      }
    } catch (err) {
      console.error(`❌ [网络异常] 无法连接到 ${ep.name}:`, err.message);
    }
    console.log('----------------------------------------------------');
  }

  console.log(`\n🎉 IndexNow 推送任务执行完成！`);
}

run();
