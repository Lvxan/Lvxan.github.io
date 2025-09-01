<script setup>
import { data as posts } from '../../../posts/posts.data.mjs'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vitepress'

function html2text(html) {
  if (!html) return ''
  // SSR 环境没有 document，降级为简单的标签剥离
  if (typeof window === 'undefined') {
    return html
      // 移除样式/脚本内容
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      // 移除所有标签
      .replace(/<[^>]+>/g, '')
      // 解码常见 HTML 实体
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim()
  }
  const div = document.createElement('div')
  div.innerHTML = html
  const text = div.innerText || div.textContent || ''
  return text.trim()
}

const route = useRoute()
const router = useRouter()
// 触发器：每次路由变化都 +1，用于让依赖 window.location.search 的计算属性重新计算
const routeTick = ref(0)
if (typeof window !== 'undefined') {
  router.onAfterRouteChange = () => {
    routeTick.value++
  }
}

const activeTags = computed(() => {
  // 引用 routeTick 以建立依赖
  void routeTick.value
  if (typeof window === 'undefined') return []
  const usp = new URLSearchParams(window.location.search || '')
  const t = (usp.get('tags') || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
  return Array.from(new Set(t))
})

const filtered = computed(() => {
  const want = activeTags.value
  if (!want.length) return posts
  return posts.filter(p => {
    const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',') : [])
    const set = new Set(tags.map(v => String(v).trim()).filter(Boolean))
    // 需要全部包含（AND），如需改为 OR，把 every 改为 some
    return want.every(t => set.has(t))
  })
})

function clearTags() {
  router.go('/')
}
</script>

<template>
  <div class="blog-list">
    <div v-if="activeTags.length" class="active-tags">
      <span>标签筛选：</span>
      <span v-for="t in activeTags" :key="t" class="pill">{{ t }}</span>
      <button class="link" @click="clearTags">清空</button>
    </div>
    <ul class="posts">
      <li
        v-for="p in filtered"
        :key="p.url"
        class="post-item"
      >
        <a :href="p.url" style="display:block;text-decoration:none;color:inherit">
          <span class="title">
            {{ p.title }}
          </span>
          <small class="date">{{ p.date }}</small>
          <p class="excerpt">{{ html2text(p.excerpt) }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>

.blog-list {
  max-width: 780px;
  margin: 2rem auto;
  /* padding: 0 1rem; */
}

.active-tags {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pill {
  padding: 2px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
}

.link {
  background: none;
  border: none;
  color: var(--vp-c-brand);
  cursor: pointer;
}
.posts {
  list-style: none;
  margin: 0;
  padding: 0;
}

.post-item {
  margin: 0 0 1.2rem;
  padding: 1.25rem 1.5rem;
  background: var(--vp-c-bg-soft, #f8f9fb);
  border: 1px solid var(--vp-c-divider, #e5e7eb);
  border-radius: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.post-item:hover {
  border-color: var(--vp-c-brand-1, var(--vp-c-brand));
}

.post-item .title {
  /* display: block; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.28rem;
  line-height: 1.35;
  font-weight: 700;
  color: var(--vp-c-brand);
  text-decoration: none;
}
.post-item .title:hover {
  text-decoration: underline;
}
.date {
  float: right;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  margin-left: 0.75rem;
}

.post-item .excerpt {
  clear: both;
  font-size: small;
}

.excerpt {
  margin-top: 0.75rem;
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--vp-c-default-2, --vp-c-text-2);
  /* 标准属性与 WebKit 兼容写法 */
  line-clamp: 3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
