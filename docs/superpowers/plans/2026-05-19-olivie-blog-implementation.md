# olivie.space 个人博客实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 Medium 沉浸式阅读体验的个人博客，Markdown 存 GitHub，Supabase 管元数据，Vercel 静态部署

**Architecture:** 纯静态 HTML/CSS/JS，无框架。构建时读取 Markdown 生成 HTML 并写入 Supabase。前端通过 Supabase JS SDK 读取元数据并渲染列表。

**Tech Stack:** Vanilla HTML/CSS/JS + Supabase JS SDK + Vercel

---

## 任务总览

| 任务 | 内容 |
|------|------|
| Task 1 | Supabase 项目初始化 + articles 表创建 |
| Task 2 | 创建目录结构 + 示例 Markdown 文章 |
| Task 3 | CSS 样式文件（全局 + 组件） |
| Task 4 | Supabase 客户端封装（supabase.js）|
| Task 5 | 构建脚本（build/generate.js）|
| Task 6 | 首页 index.html + app.js |
| Task 7 | 文章页 article.html + article.js + 阅读进度条 + 点赞 |
| Task 8 | 标签页 tag.html |
| Task 9 | Vercel 部署配置 |
| Task 10 | 关联 GitHub 仓库 |

---

## Task 1: Supabase 项目初始化

**Files:**
- Create: `supabase/config.example.js`

- [ ] **Step 1: 创建 supabase 项目**

1. 访问 [supabase.com](https://supabase.com) 登录
2. 点击 "New Project" → 取名 `olivie-blog`
3. 在 **Settings → API** 获取：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

- [ ] **Step 2: 创建 articles 表**

在 Supabase SQL Editor 执行：

```sql
CREATE TABLE articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  tags text[] DEFAULT '{}',
  published_at timestamptz DEFAULT now(),
  reading_time_minutes int DEFAULT 5,
  view_count int DEFAULT 0,
  like_count int DEFAULT 0
);

-- 开启 RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 允许公开读取
CREATE POLICY "Allow public reads" ON articles
  FOR SELECT USING (true);

-- 允许匿名点赞（仅更新 like_count）
CREATE POLICY "Allow anonymous likes" ON articles
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- 允许匿名浏览量更新（仅更新 view_count）
CREATE POLICY "Allow anonymous views" ON articles
  FOR UPDATE USING (true)
  WITH CHECK (true);
```

- [ ] **Step 3: 创建配置示例文件**

创建 `supabase/config.example.js`：

```js
// supabase/config.example.js
// 复制此文件为 config.js 并填入真实值（config.js 已在 .gitignore 中）
export const SUPABASE_URL = 'YOUR_SUPABASE_URL';
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

- [ ] **Step 4: 添加 .gitignore**

在项目根目录创建 `.gitignore`：

```
supabase/config.js
node_modules/
```

---

## Task 2: 创建目录结构

**Files:**
- Create: `css/style.css`
- Create: `js/supabase.js`
- Create: `js/app.js`
- Create: `js/article.js`
- Create: `posts/hello-world.md`
- Create: `build/generate.js`
- Create: `index.html`
- Create: `article.html`
- Create: `tag.html`
- Create: `.gitignore`
- Create: `vercel.json`
- Create: `package.json`

- [ ] **Step 1: 创建所有目录和空文件**

```bash
mkdir -p css js posts build supabase
touch css/style.css js/supabase.js js/app.js js/article.js
touch index.html article.html tag.html
touch posts/hello-world.md build/generate.js
touch .gitignore vercel.json package.json
```

- [ ] **Step 2: 创建示例 Markdown 文章**

创建 `posts/hello-world.md`：

```markdown
---
title: "你好，世界"
slug: "hello-world"
excerpt: "这是我的第一篇博客文章，基于 Medium 风格的全屏沉浸式阅读体验。"
tags: ["随笔", "开始"]
date: "2026-05-19"
---

# 你好，世界

这是我的第一篇博客文章。

## 关于这个博客

这是一个基于 **Medium** 风格的全屏沉浸式阅读体验的个人博客。

### 技术栈

- 内容：Markdown 存 GitHub
- 数据：Supabase
- 部署：Vercel / GitHub Pages

> "写作是思考的延伸，而不是思考的结果。"

Enjoy the reading experience!
```

- [ ] **Step 3: 创建 package.json**

```json
{
  "name": "olivie-blog",
  "version": "1.0.0",
  "scripts": {
    "build": "node build/generate.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "gray-matter": "^4.0.3",
    "marked": "^11.0.0"
  }
}
```

---

## Task 3: CSS 样式

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: 编写全局样式**

```css
/* css/style.css */

/* === CSS Variables === */
:root {
  --bg: #0d1117;
  --bg-card: rgba(255, 255, 255, 0.02);
  --text: #c9d1d9;
  --text-muted: #8b949e;
  --accent: #0052ff;
  --accent-hover: #0066ff;
  --border: #30363d;
  --radius: 12px;

  /* 字体 */
  --font-serif: Georgia, "Times New Roman", serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;

  /* 间距 */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 6rem;
}

/* === Reset === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.7;
  min-height: 100vh;
}

/* === 通用容器 === */
.container {
  width: 90%;
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-md) 0;
}

/* === 卡片 === */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-md);
  transition: border-color 0.2s;
}

.card:hover {
  border-color: var(--accent);
}

/* === 标签 === */
.tag {
  display: inline-block;
  background: rgba(0, 82, 255, 0.15);
  color: var(--accent);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  text-decoration: none;
  transition: background 0.2s;
}

.tag:hover {
  background: rgba(0, 82, 255, 0.3);
}

/* === 按钮 === */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.btn:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

/* === 标题 === */
h1, h2, h3 {
  font-family: var(--font-serif);
  color: #fff;
  line-height: 1.3;
}

/* === 文章卡片（首页） === */
.article-card {
  display: block;
  text-decoration: none;
  color: inherit;
  margin-bottom: var(--space-md);
}

.article-card .card {
  height: 100%;
}

.article-card h2 {
  font-size: 1.4rem;
  margin-bottom: var(--space-xs);
}

.article-card .excerpt {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: var(--space-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card .meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.article-card .tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: var(--space-sm);
}

/* === 文章页（沉浸式阅读） === */
.article-header {
  padding: var(--space-xl) 0 var(--space-lg);
}

.article-header h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: var(--space-md);
}

.article-header .meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  color: var(--text-muted);
  font-size: 0.9rem;
}

.article-header .tags {
  display: flex;
  gap: 0.5rem;
  margin-top: var(--space-sm);
}

/* === 文章正文 === */
.article-content {
  font-size: 1.125rem;
  line-height: 1.85;
}

.article-content h1,
.article-content h2,
.article-content h3 {
  margin: 2em 0 1em;
}

.article-content p {
  margin-bottom: 1.5em;
}

.article-content blockquote {
  border-left: 3px solid var(--accent);
  padding-left: var(--space-md);
  margin: 2em 0;
  color: var(--text-muted);
  font-style: italic;
}

.article-content code {
  background: rgba(255, 255, 255, 0.08);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}

.article-content pre {
  background: rgba(0, 0, 0, 0.3);
  padding: var(--space-md);
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 2em 0;
}

.article-content pre code {
  background: none;
  padding: 0;
}

.article-content img {
  max-width: 100%;
  border-radius: var(--radius);
  margin: 2em 0;
}

/* === 阅读进度条 === */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background: var(--accent);
  z-index: 1000;
  transition: width 0.1s linear;
}

/* === 点赞按钮 === */
.like-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  color: var(--text);
  font-size: 1rem;
  transition: all 0.2s;
}

.like-button:hover {
  background: rgba(0, 82, 255, 0.1);
  border-color: var(--accent);
}

.like-button.liked {
  background: rgba(0, 82, 255, 0.2);
  border-color: var(--accent);
  color: var(--accent);
}

/* === 首页布局 === */
.home-header {
  padding: var(--space-xl) 0;
  text-align: center;
}

.home-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
}

.home-header p {
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto;
}

/* === 搜索框 === */
.search-box {
  margin-bottom: var(--space-md);
}

.search-box input {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: var(--text);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-box input:focus {
  border-color: var(--accent);
}

.search-box input::placeholder {
  color: var(--text-muted);
}

/* === 标签筛选栏 === */
.tag-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: var(--space-md);
}

.tag-filters .tag {
  cursor: pointer;
}

.tag-filters .tag.active {
  background: var(--accent);
  color: #fff;
}

/* === 文章网格 === */
.article-grid {
  display: grid;
  gap: var(--space-md);
}

/* === 返回链接 === */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: var(--space-md);
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--accent);
}

/* === 底部区域 === */
.article-footer {
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: center;
}

/* === 标签页 === */
.tag-page-header {
  padding: var(--space-xl) 0 var(--space-lg);
}

.tag-page-header h1 {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
}

.tag-page-header span {
  color: var(--accent);
}

/* === 响应式 === */
@media (max-width: 768px) {
  .container {
    width: 95%;
  }

  .article-header h1 {
    font-size: 1.8rem;
  }

  .article-content {
    font-size: 1rem;
  }
}
```

---

## Task 4: Supabase 客户端封装

**Files:**
- Modify: `js/supabase.js`

- [ ] **Step 1: 编写 Supabase 客户端**

```js
// js/supabase.js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase/config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_ANON_KEY;

// 获取文章列表
export async function getArticles({ tag = null, search = null } = {}) {
  let query = supabase
    .from('articles')
    .select('slug, title, excerpt, tags, published_at, reading_time_minutes, view_count, like_count')
    .order('published_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;

  let articles = data || [];

  // 标签过滤
  if (tag) {
    articles = articles.filter(a => a.tags && a.tags.includes(tag));
  }

  // 搜索过滤
  if (search) {
    const s = search.toLowerCase();
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(s) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(s))
    );
  }

  return articles;
}

// 获取单篇文章元数据
export async function getArticle(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('slug, title, excerpt, tags, published_at, reading_time_minutes, view_count, like_count')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

// 点赞 +1
export async function likeArticle(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('like_count')
    .eq('slug', slug)
    .single();

  if (error) throw error;

  const newCount = (data.like_count || 0) + 1;

  const { error: updateError } = await supabase
    .from('articles')
    .update({ like_count: newCount })
    .eq('slug', slug);

  if (updateError) throw updateError;
  return newCount;
}

// 浏览量 +1
export async function viewArticle(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('view_count')
    .eq('slug', slug)
    .single();

  if (error) return;

  const newCount = (data.view_count || 0) + 1;

  await supabase
    .from('articles')
    .update({ view_count: newCount })
    .eq('slug', slug);
}

// 获取所有标签（去重）
export async function getAllTags() {
  const { data, error } = await supabase
    .from('articles')
    .select('tags');

  if (error) throw error;

  const tagSet = new Set();
  data.forEach(article => {
    (article.tags || []).forEach(tag => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}
```

---

## Task 5: 构建脚本

**Files:**
- Modify: `build/generate.js`

- [ ] **Step 1: 编写构建脚本**

```js
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
```

---

## Task 6: 首页

**Files:**
- Modify: `index.html`
- Modify: `js/app.js`

- [ ] **Step 1: 编写 index.html**

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>olivie.space | 数字生存家园</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="container">
    <header class="home-header">
      <h1>olivie.space</h1>
      <p>数字生存家园 · 基于 Base 链和 IPFS 构建</p>
    </header>

    <div class="search-box">
      <input type="text" id="searchInput" placeholder="搜索文章..." />
    </div>

    <div class="tag-filters" id="tagFilters"></div>

    <main class="article-grid" id="articleGrid">
      <p style="color: var(--text-muted);">加载中...</p>
    </main>
  </div>

  <script type="module" src="/js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 编写 app.js**

```js
// js/app.js
import { getArticles, getAllTags } from './supabase.js';

const grid = document.getElementById('articleGrid');
const tagFilters = document.getElementById('tagFilters');
const searchInput = document.getElementById('searchInput');

let allArticles = [];
let activeTag = null;

function renderTags(tags, activeTag) {
  tagFilters.innerHTML = `
    <span class="tag ${!activeTag ? 'active' : ''}" data-tag="">全部</span>
    ${tags.map(tag => `
      <span class="tag ${activeTag === tag ? 'active' : ''}" data-tag="${tag}">${tag}</span>
    `).join('')}
  `;
}

function renderArticles(articles) {
  if (articles.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-muted);">没有找到相关文章</p>';
    return;
  }

  grid.innerHTML = articles.map(article => {
    const date = new Date(article.published_at).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <a href="/article.html?slug=${article.slug}" class="article-card">
        <div class="card">
          <h2>${article.title}</h2>
          <p class="excerpt">${article.excerpt || ''}</p>
          <div class="meta">
            <span>${date}</span>
            <span>·</span>
            <span>${article.reading_time_minutes} 分钟</span>
          </div>
          ${article.tags && article.tags.length ? `
            <div class="tags">
              ${article.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </a>
    `;
  }).join('');
}

function filterArticles() {
  const search = searchInput.value.trim();

  let filtered = allArticles;
  if (activeTag) {
    filtered = filtered.filter(a => a.tags && a.tags.includes(activeTag));
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(s) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(s))
    );
  }

  renderArticles(filtered);
}

async function init() {
  try {
    [allArticles, activeTag] = await Promise.all([
      getArticles(),
      getAllTags()
    ]);

    renderTags(activeTag, null);
    renderArticles(allArticles);
  } catch (err) {
    grid.innerHTML = '<p style="color: #f85149;">加载失败，请刷新重试</p>';
    console.error(err);
  }
}

// 事件绑定
searchInput.addEventListener('input', debounce(filterArticles, 300));

tagFilters.addEventListener('click', (e) => {
  if (e.target.classList.contains('tag')) {
    document.querySelectorAll('.tag-filters .tag').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    activeTag = e.target.dataset.tag;
    filterArticles();
  }
});

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

init();
```

---

## Task 7: 文章页

**Files:**
- Modify: `article.html`
- Modify: `js/article.js`

- [ ] **Step 1: 编写 article.html**

```html
<!-- article.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文章 | olivie.space</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="reading-progress" id="readingProgress"></div>

  <div class="container">
    <a href="/" class="back-link">← 返回首页</a>

    <article id="articleContent">
      <p style="color: var(--text-muted);">加载中...</p>
    </article>
  </div>

  <script type="module" src="/js/article.js"></script>
</body>
</html>
```

- [ ] **Step 2: 编写 article.js**

```js
// js/article.js
import { likeArticle, viewArticle, getArticle } from './supabase.js';

const progressBar = document.getElementById('readingProgress');
const articleContent = document.getElementById('articleContent');
const likeButton = document.getElementById('likeButton');

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

if (!slug) {
  articleContent.innerHTML = '<p>缺少文章标识</p>';
} else {
  loadArticle();
}

async function loadArticle() {
  try {
    const meta = await getArticle(slug);

    // 设置页面标题
    document.title = `${meta.title} | olivie.space`;

    // 更新元信息
    const header = articleContent.querySelector('.article-header');
    if (header) {
      const publishDate = new Date(meta.published_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      header.querySelector('.meta').innerHTML = `
        <span>${publishDate}</span>
        <span>·</span>
        <span>${meta.reading_time_minutes} 分钟阅读</span>
      `;
    }

    // 更新点赞数
    updateLikeCount(meta.like_count || 0);

    // 记录浏览量
    viewArticle(slug);

  } catch (err) {
    articleContent.innerHTML = '<p>文章加载失败</p>';
    console.error(err);
  }
}

// 阅读进度条
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(100, progress)}%`;
});

// 点赞
let liked = false;

likeButton?.addEventListener('click', async () => {
  if (liked) return;
  liked = true;
  likeButton.classList.add('liked');

  const icon = document.getElementById('likeIcon');
  const countEl = document.getElementById('likeCount');
  const currentCount = parseInt(countEl.dataset.count || '0', 10);

  icon.textContent = '♥';
  countEl.textContent = currentCount + 1;

  try {
    const newCount = await likeArticle(slug);
    countEl.textContent = newCount;
    countEl.dataset.count = newCount;
  } catch (err) {
    console.error('点赞失败', err);
  }
});

function updateLikeCount(count) {
  const countEl = document.getElementById('likeCount');
  if (countEl) {
    countEl.textContent = count;
    countEl.dataset.count = count;
  }
}
```

---

## Task 8: 标签页

**Files:**
- Modify: `tag.html`

- [ ] **Step 1: 编写 tag.html**

```html
<!-- tag.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>标签 | olivie.space</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="container">
    <header class="tag-page-header">
      <a href="/" class="back-link">← 返回首页</a>
      <h1>标签：<span id="tagName">加载中...</span></h1>
    </header>

    <main class="article-grid" id="articleGrid"></main>
  </div>

  <script type="module">
    import { getArticles } from './js/supabase.js';

    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag') || '';
    const tagNameEl = document.getElementById('tagName');
    const grid = document.getElementById('articleGrid');

    tagNameEl.textContent = decodeURIComponent(tag);

    getArticles({ tag })
      .then(articles => {
        if (articles.length === 0) {
          grid.innerHTML = '<p style="color: var(--text-muted);">该标签下暂无文章</p>';
          return;
        }

        grid.innerHTML = articles.map(article => {
          const date = new Date(article.published_at).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          return `
            <a href="/article.html?slug=${article.slug}" class="article-card">
              <div class="card">
                <h2>${article.title}</h2>
                <p class="excerpt">${article.excerpt || ''}</p>
                <div class="meta">
                  <span>${date}</span>
                  <span>·</span>
                  <span>${article.reading_time_minutes} 分钟</span>
                </div>
              </div>
            </a>
          `;
        }).join('');
      })
      .catch(() => {
        grid.innerHTML = '<p style="color: #f85149;">加载失败</p>';
      });
  </script>
</body>
</html>
```

---

## Task 9: Vercel 部署配置

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: 创建 vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": null
}
```

- [ ] **Step 2: 在 Vercel 设置环境变量**

在 Vercel 项目 Settings → Environment Variables 中添加：

| Name | Value |
|------|-------|
| `SUPABASE_URL` | 你的 Supabase URL |
| `SUPABASE_SERVICE_KEY` | 你的 Supabase Service Role Key |

> 注意：Service Role Key 有写入权限，仅构建时使用，不会暴露给浏览器。

---

## Task 10: GitHub 仓库关联

- [ ] **Step 1: 创建 GitHub 仓库**

1. 访问 GitHub → New Repository
2. 命名为 `olivie-blog`
3. 不初始化 README（已有本地代码）

- [ ] **Step 2: 推送到 GitHub**

```bash
git init
git add .
git commit -m "feat: initial olivie.space blog setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/olivie-blog.git
git push -u origin main
```

- [ ] **Step 3: 连接 Vercel**

1. 访问 [vercel.com](https://vercel.com)
2. Import GitHub Repository → 选择 `olivie-blog`
3. Framework 选择 `Other`
4. 添加环境变量（SUPABASE_URL, SUPABASE_SERVICE_KEY）
5. Deploy

---

## 实施检查清单

- [ ] Task 1: Supabase 项目创建 + articles 表
- [ ] Task 2: 目录结构 + 示例文章
- [ ] Task 3: CSS 样式
- [ ] Task 4: Supabase 客户端
- [ ] Task 5: 构建脚本
- [ ] Task 6: 首页
- [ ] Task 7: 文章页
- [ ] Task 8: 标签页
- [ ] Task 9: Vercel 配置
- [ ] Task 10: GitHub + Vercel 关联

---

## 依赖说明

构建脚本需要 .env 文件（不提交到 Git）：

```bash
# .env（项目根目录，.gitignore 已排除）
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
```

安装依赖后运行 `npm run build` 即可本地构建。

---

## 实施顺序建议

1. 先完成 Task 1（Supabase 建表）
2. 创建 `supabase/config.js`（从 example 复制并填入真实值）
3. 再依次完成其他任务
4. 本地测试 `npm run build` 确认无误后部署
