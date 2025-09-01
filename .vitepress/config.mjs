import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig(async () => {
  const fs = await import('node:fs')
  const path = await import('node:path')

  // 根目录下的内容目录（与 srcDir 对齐）
  const contentRoot = path.resolve(process.cwd(), 'posts')

  const collator = new Intl.Collator('zh-Hans', { numeric: true, sensitivity: 'base' })

  function sortByName(a, b) {
    return collator.compare(a.name, b.name)
  }

  function readDir(dir) {
    const entries = fs.readdirSync(dir)
    const dirs = []
    const files = []
    for (const name of entries) {
      const full = path.join(dir, name)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) {
        dirs.push({ name, full })
      } else if (name.toLowerCase().endsWith('.md')) {
        files.push({ name, full })
      }
    }
    dirs.sort(sortByName)
    files.sort(sortByName)
    return { dirs, files }
  }

  function buildItems(dir) {
    const { dirs, files } = readDir(dir)
    const items = []

    // 当前目录下的文件（排除 index.md 和 About.md，大小写不敏感，兼容 About/index.md 等）
    for (const file of files) {
      const rel = path.relative(contentRoot, file.full).replace(/\\/g, '/')
      const relLower = rel.toLowerCase()

      const isIndex = relLower === 'index.md' || relLower.endsWith('/index.md')
      const isAbout = relLower === 'about.md' || relLower.endsWith('/about.md')
      if (isIndex || isAbout) continue

      const link = encodeURI('/' + rel.replace(/\.md$/i, ''))
      const text = path.basename(file.name, '.md')
      items.push({ text, link })
    }

    // 子目录 -> 分组
    for (const dirent of dirs) {
      const groupItems = buildItems(dirent.full)
      if (groupItems.length === 0) continue
      items.push({
        text: dirent.name,
        items: groupItems,
        collapsible: true,
        collapsed: false,
      })
    }

    return items
  }

  const sidebarItems = buildItems(contentRoot)

  return {
    title: 'CaD Blog',
    description: 'just some blogs',
    markdown: {
      math: true,
      config(md) {
        // 移除 frontmatter 之后到第一个水平线（--- 或 *** 或 ___）之间的“摘要”段落在文章页的渲染
        md.core.ruler.after('block', 'strip-top-excerpt', state => {
          const tokens = state.tokens
          // 找到第一个主题分隔线(hr)
          let firstHR = -1
          for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i]
            if (t.type === 'hr') { firstHR = i; break }
          }
          if (firstHR === -1) return
          // 移除从文档开头到第一个 hr 之前的所有可见内容
          // 保留前导的 front_matter 等非渲染 token
          let start = 0
          // 跳过 front_matter
          while (start < tokens.length && tokens[start].type === 'front_matter') start++
          if (start >= firstHR) return
          // 删除区间 [start, firstHR) 以及 hr 自身
          tokens.splice(start, firstHR - start + 1)
        })
      }
    },
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      // 右侧大纲层级：显示 H1 ~ H3
      outline: [2, 4],
        nav: [
          { text: 'Blog', link: '/' },
          { text: 'About', link: '/About' }
        ],

      sidebar: sidebarItems,

      // socialLinks: [
      //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
      // ]
    },
    srcDir: './posts',
  }
})
