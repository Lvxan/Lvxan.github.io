---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "CaD Blog"
  # text: "CAD Blog"
  tagline: Security | Programming 
  # actions:
  #   - theme: brand
  #     text: Markdown Examples
  #     link: /markdown-examples
  #   - theme: alt
  #     text: API Examples
  #     link: /api-examples

# features:
#   - title: Feature A
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
#   - title: Feature B
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
#   - title: Feature C
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---

<script setup>
import BlogList from '../.vitepress/theme/components/BlogList.vue'
</script>

<BlogList />
