#!/usr/bin/env node

/**
 * Google AdSense Pre-Submission & Compliance Auditor
 * Comprehensive CLI tool for checking website readiness for Google AdSense.
 */

const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] || process.cwd();

console.log('====================================================');
console.log('      Google AdSense 网站合规自动化审计工具          ');
console.log('====================================================');
console.log(`目标扫描目录: ${path.resolve(targetDir)}\n`);

function scanHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (item.startsWith('.') || item === 'node_modules') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      // 忽略 Google 站长验证专用 html
      if (!item.startsWith('google')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const htmlFiles = scanHtmlFiles(targetDir);
console.log(`[+] 发现有效内容 HTML 页面: ${htmlFiles.length} 个`);

// 1. 检查 ads.txt
console.log('\n--- [1/6] 检查 ads.txt ---');
const adsTxtPath = path.join(targetDir, 'ads.txt');
let pubIdFound = null;
if (!fs.existsSync(adsTxtPath)) {
  console.error('❌ [严重] 根目录下未找到 ads.txt 文件！Google AdSense 强烈要求此文件。');
} else {
  const adsContent = fs.readFileSync(adsTxtPath, 'utf8').trim();
  const match = adsContent.match(/google\.com,\s*(pub-\d+),\s*(DIRECT|RESELLER),\s*f08c47fec0942fa0/i);
  if (match) {
    pubIdFound = match[1];
    console.log(`✅ ads.txt 格式有效: 发布商 ID 为 ${pubIdFound} (${match[2]})`);
  } else {
    console.warn(`⚠️ ads.txt 内容格式可能不标准: "${adsContent}"`);
  }
}

// 2. 检查 robots.txt
console.log('\n--- [2/6] 检查 robots.txt ---');
const robotsTxtPath = path.join(targetDir, 'robots.txt');
if (!fs.existsSync(robotsTxtPath)) {
  console.warn('⚠️ 根目录下未找到 robots.txt');
} else {
  const robotsContent = fs.readFileSync(robotsTxtPath, 'utf8');
  if (robotsContent.includes('Disallow: /') && !robotsContent.includes('Allow: /')) {
    console.error('❌ [严重] robots.txt 中存在禁止所有爬虫的规则 (Disallow: /)！');
  } else {
    console.log('✅ robots.txt 允许搜索引擎爬取。');
  }
  if (robotsContent.includes('sitemap.xml')) {
    console.log('✅ robots.txt 正确声明了 Sitemap 路径。');
  }
}

// 3. 检查 sitemap.xml
console.log('\n--- [3/6] 检查 sitemap.xml ---');
const sitemapPath = path.join(targetDir, 'sitemap.xml');
let sitemapUrls = [];
if (!fs.existsSync(sitemapPath)) {
  console.warn('⚠️ 根目录下未找到 sitemap.xml');
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  sitemapUrls = [...sitemapContent.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);
  console.log(`✅ sitemap.xml 声明了 ${sitemapUrls.length} 个索引 URL`);
  
  const htmlInSitemap = sitemapUrls.filter(u => u.endsWith('.html'));
  if (htmlInSitemap.length > 0) {
    console.warn(`⚠️ [警告] sitemap.xml 中有 ${htmlInSitemap.length} 个 URL 带有 .html 后缀！`);
    console.warn('   若托管在 Cloudflare Pages 等平台，可能导致 307 临时重定向死循环，建议移除 .html。');
  } else {
    console.log('✅ sitemap.xml 中所有 URL 均为 Clean URL (无 .html 尾缀)。');
  }
}

// 4. 页面内容、TDK、Canonical 与 AdSense 代码详细审查
console.log('\n--- [4/6] 页面合规性深度扫描 ---');
const report = [];
let totalErrors = 0;
let totalWarnings = 0;

htmlFiles.forEach(filePath => {
  const relPath = path.relative(targetDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // 若页面标记了 noindex (例如维护或下线页面)，则跳过严苛内容审计
  const isNoIndex = /<meta\s+name=["\x27]robots["\x27]\s+content=["\x27][^"\x27]*noindex[^"\x27]*["\x27]/i.test(content);
  if (isNoIndex) {
    return; // 不作为有效对外索引页面审查
  }

  // Title (支持带属性的 <title data-i18n="...">)
  const titleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) {
    issues.push('缺少 <title> 标签');
  }

  // Description
  const descMatch = content.match(/<meta\s+name=["\x27]description["\x27]\s+content=["\x27]([^"\x27]*)["\x27]/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  if (!desc) {
    issues.push('缺少 meta description');
  }

  // Canonical
  const canonicalMatch = content.match(/<link\s+rel=["\x27]canonical["\x27]\s+href=["\x27]([^"\x27]*)["\x27]/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';
  if (!canonical) {
    issues.push('缺少 <link rel="canonical"> 规范标签');
  } else if (canonical.endsWith('.html')) {
    issues.push(`Canonical 含有 .html (${canonical})，可能触发 307 重定向`);
  }

  // AdSense Code
  const hasAdSense = content.includes('pagead2.googlesyndication.com') || (pubIdFound && content.includes(pubIdFound));
  if (!hasAdSense) {
    issues.push('未检测到 AdSense 代码片段');
  }

  // Text content depth
  const textContent = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (textContent.length < 300) {
    issues.push(`正文文本过少 (${textContent.length} 字符)，容易被判定为“低价值内容”`);
  }

  // Internal links containing .html
  const internalHtmlLinks = [...content.matchAll(/href=["\x27]((?:\/|\.\/|\.\.\/)[^"\x27]*\.html)["\x27]/gi)].map(m => m[1]);
  if (internalHtmlLinks.length > 0) {
    issues.push(`内部链接仍指向 .html 文件 (${internalHtmlLinks.length} 处)，易导致重定向`);
  }

  if (issues.length > 0) {
    report.push({ file: relPath, issues });
    totalErrors += issues.length;
  }
});

if (report.length === 0) {
  console.log(`✅ 全部 ${htmlFiles.length} 个页面全部完美通过 TDK、Canonical、AdSense 代码与文本字数审查！`);
} else {
  console.log(`⚠️ 发现 ${report.length} 个页面存在需优化的项目:`);
  report.forEach(r => {
    console.log(`  📄 [${r.file}]`);
    r.issues.forEach(iss => console.log(`     - ${iss}`));
  });
}

// 5. 必备法律合规页面检查
console.log('\n--- [5/6] 必备政策与法律页面核查 ---');
const legalKeywords = ['privacy', 'terms', 'about', 'contact'];
const legalFound = {};
htmlFiles.forEach(f => {
  const base = path.basename(f).toLowerCase();
  legalKeywords.forEach(k => {
    if (base.includes(k)) legalFound[k] = true;
  });
});

legalKeywords.forEach(k => {
  if (legalFound[k]) {
    console.log(`✅ 已具备 ${k.toUpperCase()} (合规页面)`);
  } else {
    console.warn(`⚠️ [建议] 未检测到明显的 ${k.toUpperCase()} 页面 (如 ${k}.html)，建议补充。`);
  }
});

// 6. 最终审查总结
console.log('\n====================================================');
console.log('                 审计评估总计                       ');
console.log('====================================================');
if (totalErrors === 0) {
  console.log('🎉 恭喜！当前网站在代码、SEO 架构、法律政策与防重定向设计上均达到 AdSense 最佳标准！');
  console.log('💡 提交 AdSense 审核前，请确认：');
  console.log('   1. Cloudflare WAF 中已添加对 Googlebot 和 Mediapartners-Google 的放行跳过规则。');
  console.log('   2. Google Search Console 实时测试 (Live Test) 确认子页面能正常渲染。');
} else {
  console.log(`⚠️ 发现共计 ${totalErrors} 个潜在问题，请根据上述提示修复后再提交审核。`);
}
console.log('====================================================\n');
