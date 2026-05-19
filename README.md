# olivie.space

基于 Medium 沉浸式阅读体验的个人博客，JAMstack 架构。

## 技术栈

- **内容管理**: Markdown 文件（GitHub 仓库）
- **静态生成**: Vercel 构建时预渲染
- **数据层**: Supabase（PostgreSQL）
- **前端**: 纯 HTML + CSS + Vanilla JS

## 快速开始

### 1. Supabase 设置

1. 访问 [supabase.com](https://supabase.com) 创建项目 `olivie-blog`
2. 在 **Settings → API** 获取 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`
3. 在 **SQL Editor** 中执行 `supabase/setup.sql`
4. 复制 `supabase/config.example.js` 为 `supabase/config.js` 并填入真实值

### 2. 本地构建

```bash
# 安装依赖
npm install

# 本地构建（生成 dist/ 目录）
npm run build
```

### 3. GitHub + Vercel 部署

1. 在 GitHub 创建新仓库 `olivie-blog`
2. 推送代码：

```bash
git init
git add .
git commit -m "feat: initial olivie.space blog"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/olivie-blog.git
git push -u origin main
```

3. 在 [vercel.com](https://vercel.com) 导入该仓库
4. 在 Vercel 项目设置中添加环境变量：
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
5. Deploy！

## 写作流程

1. 在 `posts/` 目录下创建 `.md` 文件
2. 使用以下 frontmatter 格式：

```markdown
---
title: "文章标题"
slug: "article-slug"
excerpt: "文章摘要"
tags: ["标签1", "标签2"]
date: "2026-05-19"
---

文章内容...
```

3. 运行 `npm run build` 生成本地 `dist/`
4. 推送到 GitHub，Vercel 自动构建部署

## 项目结构

```
├── index.html          # 首页
├── article.html        # 文章页
├── tag.html            # 标签页
├── css/style.css       # 样式
├── js/
│   ├── supabase.js     # Supabase 客户端
│   ├── app.js          # 首页逻辑
│   └── article.js      # 文章页逻辑
├── posts/              # Markdown 文章
├── build/
│   └── generate.js     # 构建脚本
└── supabase/
    ├── config.example.js
    └── setup.sql       # 数据库建表 SQL
```

## 功能

- 沉浸式阅读体验
- 标签筛选
- 关键词搜索
- 阅读进度条
- 点赞功能
- 响应式设计