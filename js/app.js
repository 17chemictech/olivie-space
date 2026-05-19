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