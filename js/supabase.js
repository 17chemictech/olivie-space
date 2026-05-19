// js/supabase.js
// 使用全局 supabase client（由 HTML 中 CDN 引入）
const { createClient } = supabase;

const supabaseUrl = window.SUPABASE_URL;
const supabaseKey = window.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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
