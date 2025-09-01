<script setup>
import { useData } from 'vitepress'

const { page } = useData()

function formatDate(val) {
  if (!val) return ''
  // 优先匹配 YYYY-MM-DD，使用 UTC 构造避免时区偏移
  if (typeof val === 'string') {
    const m = val.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (m) {
      const y = Number(m[1])
      const mo = Number(m[2])
      const d = Number(m[3])
      const dt = new Date(Date.UTC(y, mo - 1, d))
      return dt.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
      })
    }
  }
  try {
    const dt = new Date(val)
    return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return String(val)
  }
}
</script>

<template>
  <div v-if="page && page.frontmatter && page.frontmatter.title" class="post-header">
    <h1 class="post-title">{{ page.frontmatter.title }}</h1>
    <div class="post-meta">
  <span v-if="page.frontmatter.date" class="meta-item">{{ formatDate(page.frontmatter.date) }}</span>
      <span v-if="page.frontmatter.author" class="meta-sep">·</span>
      <span v-if="page.frontmatter.author" class="meta-item">{{ page.frontmatter.author }}</span>
    </div>
  </div>
</template>

<style scoped>
.post-header {
  text-align: center;
  margin: 1.25rem 0 1.75rem;
}
.post-title {
  margin: 0.25rem 0 0.5rem;
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
}
.post-meta {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}
.meta-sep { margin: 0 0.5rem; }
</style>
