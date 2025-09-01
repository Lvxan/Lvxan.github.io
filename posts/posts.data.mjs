import { createContentLoader } from 'vitepress'

// srcDir 已设置为 './posts'，因此此处的匹配应相对于 srcDir；
// 使用 '*.md'（而不是 'posts/*.md'），并在 transform 中排除首页 index.md。
export default createContentLoader('**/*.md', {
  excerpt: true,
  transform(rawData) {
    return rawData
      // item.url 在设置了 srcDir 后一般形如 '/xxx'，首页为 '/'
      .filter((item) => {
        const url = item.url || ''
        return url !== '/' && !/\/(?:index.html|About.html|Publication.html)$/i.test(url)
      })
      .map((item) => {
        const fm = item.frontmatter || {}
        const title = fm.title || item.url?.split('/').pop()?.replace(/\.(md|html)$/i, '') || '未命名文章'
        const dateStr = fm.date || '1970-01-01'
        const date = new Date(dateStr)
        const tags = Array.isArray(fm.tags)
          ? fm.tags
          : (typeof fm.tags === 'string' ? fm.tags.split(',') : [])
        const normTags = Array.from(new Set(tags.map(t => String(t).trim()).filter(Boolean)))
        const safeDate = isNaN(+date) ? new Date('1970-01-01') : date
        return {
          url: item.url,
          title,
          date: safeDate.toISOString().slice(0, 10),
          excerpt: item.excerpt || '',
          tags: normTags
        }
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }
})