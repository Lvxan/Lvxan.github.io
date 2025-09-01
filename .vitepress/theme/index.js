import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import TagSearch from './components/TagSearch.vue'
import PostHeader from './components/PostHeader.vue'
import './style.css'
import { Icon } from '@iconify/vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 把标签搜索入口放到导航栏右侧
  'nav-bar-content-after': () => h(TagSearch),
  // 在文档正文前置一个文章头部（标题/日期/作者）
  'doc-before': () => h(PostHeader)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 预留：需要时可在此注册全局组件
    app.component('Icon', Icon)
  }
}
