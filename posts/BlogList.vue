<script setup>
// 从同目录的数据加载文件导入
import { data as posts } from './posts.data.mjs'
console.log(posts)
</script>

<template>
  <div class="blog-list">
    <ul class="posts">
      <li
        v-for="p in posts"
        :key="p.url"
        class="post-item"
      >
        <a :href="p.url" style="display:block;text-decoration:none;color:inherit">
          <span class="title">
            {{ p.title }}
          </span>
          <small class="date">{{ p.date }}</small>
          <p class="excerpt" v-html="p.excerpt"></p>
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

.posts {
  list-style: none;
  margin: 0;
  padding: 0;
}

.post-item {
  margin: 0 0 1.2rem;
  /* padding: 1.25rem 1.5rem; */
  /* background: var(--vp-c-bg-soft, #f8f9fb);
  border: 1px solid var(--vp-c-divider, #e5e7eb); */
  /* border-radius: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; */
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
}

.excerpt {
  margin-top: 0.75rem;
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--vp-c-text-1, #374151);
  /* 标准属性与 WebKit 兼容写法 */
  line-clamp: 3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
