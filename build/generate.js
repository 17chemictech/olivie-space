// build/generate.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '../posts');
const OUTPUT_DIR = path.join(__dirname, '../dist');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// 初始化 Supabase 客户端（服务端用 service key）
const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 复制静态文件到输出目录
function copyStaticFile(src, dest) {
  const srcPath = path.join(__dirname, '..', src);
  const destPath = path.join(OUTPUT_DIR, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  📋 复制 ${src} → dist/${dest}`);
  }
}

function copyStaticDir(src, dest) {
  const srcPath = path.join(__dirname, '..', src);
  const destPath = path.join(OUTPUT_DIR, dest);
  if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    fs.readdirSync(srcPath).forEach(file => {
      const srcFile = path.join(srcPath, file);
      const destFile = path.join(destPath, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`  📋 复制 ${src}/${file} → dist/${dest}/${file}`);
      }
    });
  }
}

// 读取所有 Markdown 文件
function getPostFiles() {
  return fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
}

// 计算阅读时间（按中文字符速率：每分钟 400 字）
function calculateReadingTime(content) {
  const chineseChars = (content.match(/[一-鿿]/g) || []).length;
  const englishWords = content.split(/\s+/).length;
  const totalChars = chineseChars + englishWords * 0.5;
  return Math.max(1, Math.ceil(totalChars / 400));
}

// 解析 Markdown 文件
function parsePost(filename) {
  const filepath = path.join(POSTS_DIR, filename);
  const content = fs.readFileSync(filepath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  const slug = frontmatter.slug || filename.replace('.md', '');
  const html = marked(body);
  const readingTime = calculateReadingTime(body);

  return {
    slug,
    title: frontmatter.title || 'Untitled',
    excerpt: frontmatter.excerpt || '',
    tags: frontmatter.tags || [],
    date: frontmatter.date || new Date().toISOString().split('T')[0],
    readingTime,
    html
  };
}

// 生成文章 HTML
function generateArticleHTML(post) {
  const publishDate = new Date(post.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | olivie.space</title>
  <link rel="stylesheet" href="/css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    window.SUPABASE_URL = 'https://zgavnpctmhoffuucmgml.supabase.co';
    window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnYXZucGN0bWhvZmZ1dWNtZ21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzA5NTIsImV4cCI6MjA5NDc0Njk1Mn0.8Jz_78CABoDdDgUdvAkt9yM-y-HcWuD-c0p5eUdB6H4';
  </script>
</head>
<body>
  <div class="reading-progress" id="readingProgress"></div>

  <div class="container">
    <a href="/" class="back-link">← 返回首页</a>

    <article>
      <header class="article-header">
        <h1>${post.title}</h1>
        <div class="meta">
          <span>${publishDate}</span>
          <span>·</span>
          <span>${post.readingTime} 分钟阅读</span>
        </div>
        ${post.tags.length ? `
        <div class="tags">
          ${post.tags.map(tag => `<a href="/tag.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`).join('')}
        </div>` : ''}
      </header>

      <div class="article-content">
        ${post.html}
      </div>

      <footer class="article-footer">
        <button class="like-button" id="likeButton" data-slug="${post.slug}">
          <span id="likeIcon">♡</span>
          <span id="likeCount">赞</span>
        </button>
      </footer>
    </article>
  </div>

  <script type="module" src="/js/article.js"></script>
</body>
</html>`;
}

// 写入 Supabase
async function upsertToSupabase(post) {
  if (!supabase) {
    console.log('⚠️ Supabase 未配置，跳过数据库写入');
    return;
  }

  const { error } = await supabase
    .from('articles')
    .upsert({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags,
      published_at: new Date(post.date).toISOString(),
      reading_time_minutes: post.readingTime
    }, {
      onConflict: 'slug'
    });

  if (error) {
    console.error(`❌ 写入 ${post.slug} 失败:`, error.message);
  } else {
    console.log(`✅ 写入 ${post.slug}`);
  }
}

// 主流程
async function main() {
  console.log('🚀 开始构建...\n');

  // 复制静态文件
  console.log('📁 复制静态文件:');
  copyStaticFile('index.html', 'index.html');
  copyStaticFile('tag.html', 'tag.html');
  copyStaticDir('css', 'css');
  copyStaticDir('js', 'js');
  console.log('');

  const files = getPostFiles();
  console.log(`📄 找到 ${files.length} 篇文章\n`);

  for (const file of files) {
    const post = parsePost(file);

    // 生成静态 HTML
    const html = generateArticleHTML(post);
    const outputPath = path.join(OUTPUT_DIR, `${post.slug}.html`);
    fs.writeFileSync(outputPath, html);

    // 写入数据库
    await upsertToSupabase(post);
  }

  console.log('\n✨ 构建完成！');
}

main().catch(console.error);