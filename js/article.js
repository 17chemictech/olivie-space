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