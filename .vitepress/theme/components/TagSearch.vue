<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import { data as posts } from '../../../posts/posts.data.mjs'

const show = ref(false)
const q = ref('')
const selected = ref([]) // 选中的标签数组

// 收集所有文章的 tags（frontmatter.tags 可为 string | string[]）
const allTags = computed(() => {
  const set = new Set()
  for (const p of posts) {
    const tags = Array.isArray(p.tags)
      ? p.tags
      : (typeof p.tags === 'string' ? p.tags.split(',') : [])
    for (let t of tags) {
      t = (t || '').trim()
      if (t) set.add(t)
    }
  }
  return Array.from(set).sort()
})

const filteredTags = computed(() => {
  if (!q.value) return allTags.value
  const s = q.value.toLowerCase()
  return allTags.value.filter(t => t.toLowerCase().includes(s))
})

const router = useRouter()

function syncSelectedFromURL() {
  if (typeof window === 'undefined') return
  const usp = new URLSearchParams(window.location.search || '')
  const t = (usp.get('tags') || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
  selected.value = Array.from(new Set(t))
}

function toHomeWithTags(tags) {
  const params = new URLSearchParams()
  if (tags.length) params.set('tags', tags.join(','))
  router.go('/?' + params.toString())
  show.value = false
}

function toggleTag(tag) {
  const i = selected.value.indexOf(tag)
  if (i >= 0) selected.value.splice(i, 1)
  else selected.value.push(tag)
}

function onOpen() {
  syncSelectedFromURL()
  show.value = true
}

onMounted(() => {
  syncSelectedFromURL()
  // 链式包装已有的路由后置钩子，避免相互覆盖
  const prev = router.onAfterRouteChange
  router.onAfterRouteChange = (to) => {
    if (typeof prev === 'function') prev(to)
    syncSelectedFromURL()
  }
})

// 暴露一个点击入口（按钮）
</script>

<template>
  <div class="vp-nav-tagsearch">
    <button class="tagsearch-btn" type="button" @click="onOpen">
      <Icon icon="system-uicons:tags" width="21" height="21" />
    </button>

    <teleport to="body">
      <div v-if="show" class="tagsearch-mask" @click.self="show=false">
        <div class="tagsearch-modal">
          <div class="header">
            <input v-model="q" placeholder="Search tags" />
            <div class="spacer" />
            <button class="close" @click="show=false">
              <Icon icon="material-symbols:close-rounded" width="24" height="24" />
            </button>
          </div>
          <div class="body">
            <div class="tags">
              <button
                v-for="t in filteredTags"
                :key="t"
                class="tag"
                :class="{ active: selected.includes(t) }"
                @click="toggleTag(t)"
              >
                {{ t }}
              </button>
            </div>
          </div>
          <div class="footer">
            <button class="primary" @click="toHomeWithTags(selected)">
              <Icon icon="icon-park-twotone:search" width="24" height="24" />
            </button>
            <button class="secondary" @click="selected=[]">
              <Icon icon="mdi:clear-outline" width="24" height="24" />
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
.vp-nav-tagsearch { display: flex; align-items: center; }
.tagsearch-btn {
  margin-left: 8px;
  padding: 6px 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.tagsearch-mask {
  position: fixed; inset: 0; background: rgba(0,0,0,.35);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.tagsearch-modal {
  width: min(720px, 92vw);
  max-height: 80vh;
  background: var(--vp-c-bg);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.2);
  display: flex; flex-direction: column;
}
.header {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.header input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.header .close {
  margin-left: 8px;
  font-size: 20px;
  padding: 2px 10px;
}

.body {
  padding: 12px;
  overflow: auto;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 999px;
}

.tag.active {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.footer {
  padding: 12px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.primary {
  /* background: var(--vp-c-brand); */
  color: var(--vp-c-text-1);
  border-radius: 6px;
  padding: 8px 8px;
}
.primary:hover {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.secondary {
  padding: 8px 8px;
  border-radius: 6px;
  color: var(--vp-c-text-1);
}
.secondary:hover {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
</style>
