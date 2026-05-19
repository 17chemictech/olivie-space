# olivie.space 个人博客设计文档

## 概述

基于 Medium 沉浸式阅读体验的个人博客，采用 JAMstack 架构，Markdown 存 GitHub，Supabase 管元数据，Vercel 静态部署。

## 技术架构

| 层级 | 技术 |
|------|------|
| 内容管理 | Markdown 文件（GitHub 仓库） |
| 静态生成 | Vercel 构建时预渲染 |
| 数据层 | Supabase（PostgreSQL） |
| 前端 | 纯 HTML + CSS + Vanilla JS |
| 部署 | Vercel / GitHub Pages |

## 数据库设计

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
```

## 页面结构

### 1. 首页（index.html）
- 博客标题 + 简介
- 文章卡片列表（标题、摘要、标签、发布日期、阅读时间）
- 标签筛选（点击标签过滤文章）
- 搜索框（按标题/摘要关键词搜索）

### 2. 文章页（article.html?slug=xxx）
- 全屏沉浸式阅读布局
- 文章标题 + 元信息（日期、阅读时间、标签）
- Markdown 正文渲染（支持代码高亮）
- 顶部阅读进度条
- 底部点赞按钮（点击 +1，存入 Supabase）
- 返回首页链接

### 3. 标签页（tag.html?tag=xxx）
- 显示特定标签下的所有文章

## 视觉风格

沿用现有 olivie.space 深色主题：

- 背景色：`#0d1117`
- 主色调：`#0052ff`（Base 蓝）
- 文字色：`#c9d1d9`
- 边框色：`#30363d`
- 标题字体：衬线体（Georgia / serif）
- 正文字体：系统无衬线体
- 大留白、聚焦内容

## 目录结构

```
olivie.space/
├── index.html          # 首页
├── article.html        # 文章页
├── tag.html            # 标签页
├── css/
│   └── style.css       # 样式
├── js/
│   ├── app.js          # 首页逻辑
│   ├── article.js      # 文章页逻辑
│   └── supabase.js     # Supabase 客户端封装
├── posts/              # Markdown 文章（构建时被处理）
├── build/              # 构建脚本
│   └── generate.js     # Markdown → HTML + 写入 Supabase
└── docs/
    └── specs/          # 设计文档
```

## 构建流程

1. 文章以 Markdown 格式存入 `/posts/*.md`
2. `build/generate.js` 读取所有 Markdown 文件
3. 提取 frontmatter 元数据（title, tags, date, excerpt）
4. 计算阅读时间
5. 生成静态 HTML 文件
6. 将元数据写入 Supabase articles 表
7. Vercel 拉取代码并执行构建脚本

## 待实现功能

- [ ] Supabase 项目初始化 + articles 表创建
- [ ] build/generate.js 构建脚本
- [ ] index.html 首页 + 文章列表
- [ ] article.html 文章页 + 阅读进度条
- [ ] 点赞功能（Supabase update）
- [ ] 标签筛选
- [ ] 暗色主题（默认）

## 不包含

- 评论系统
- 向量搜索（内容少时收益不大，后续可加）
