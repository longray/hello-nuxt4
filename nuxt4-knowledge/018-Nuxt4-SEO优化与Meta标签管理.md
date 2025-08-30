# Nuxt4 SEO 优化与 Meta 标签管理
标签: Nuxt4, SEO, Meta 标签, 搜索引擎优化

## 问题描述
如何为 Nuxt4 应用实现强大的 SEO（搜索引擎优化）？如何动态管理每个页面的 `title`, `description` 等 meta 标签？如何处理 Open Graph (OG) 标签和 JSON-LD，以增强社交分享和搜索结果的展示效果？

## 解决方案
Nuxt4 提供了多种内置方法和组合式函数（Composables）来轻松管理头部信息和 SEO 相关的标签。由于 Nuxt4 默认是服务端渲染（SSR），这对 SEO 非常友好，因为搜索引擎爬虫可以直接抓取到完全渲染后的 HTML 内容。

### 1. `useHead` 组合式函数
这是在组件级别管理头部信息最灵活、最推荐的方式。

```vue
<template>
  <div>
    <h1>文章标题：{{ article.title }}</h1>
    <p>...</p>
  </div>
</template>

<script setup lang="ts">
const { data: article } = await useFetch('/api/articles/some-slug');

useHead({
  title: () => article.value?.title || '默认标题',
  meta: [
    { 
      name: 'description', 
      content: () => article.value?.excerpt || '默认描述' 
    },
    // Open Graph 标签
    { property: 'og:title', content: () => article.value?.title },
    { property: 'og:description', content: () => article.value?.excerpt },
    { property: 'og:image', content: () => article.value?.imageUrl },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: () => `https://example.com/articles/${article.value?.slug}` },
  ],
  link: [
    { 
      rel: 'canonical', 
      href: () => `https://example.com/articles/${article.value?.slug}` 
    }
  ]
});
</script>
```
**关键点**:
- **响应式**: `useHead` 的参数可以是响应式的 `ref` 或返回字符串的函数。当数据变化时，meta 标签会自动更新。
- **合并策略**: 如果多个组件（例如布局和页面）都使用了 `useHead`，Nuxt 会智能地合并它们。子组件的定义会覆盖父组件的相同标签。

### 2. `definePageMeta` (页面级别)
对于静态的、只在该页面生效的 meta 信息，可以在 `<script>` 块中使用 `definePageMeta`。这在页面组件中定义，并且比 `useHead` 有更高的性能，因为它在编译时处理。

```vue
<script setup lang="ts">
definePageMeta({
  title: '关于我们',
  meta: [
    { name: 'description', content: '了解我们公司的历史和团队。' }
  ],
});
</script>
```
**注意**: `definePageMeta` 中的值不是响应式的。

### 3. 全局配置 (`nuxt.config.ts`)
你可以在 `nuxt.config.ts` 中设置全局的、默认的 meta 标签。这对于设置网站名称、主题颜色等非常有用。

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      title: '我的 Nuxt4 网站', // 默认标题
      titleTemplate: '%s - 我的 Nuxt4 网站', // 标题模板，%s 会被具体页面的标题替换
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '这是一个用 Nuxt4 构建的超棒网站！' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
        // 可以在这里添加全局脚本，如分析工具
      ]
    }
  }
})
```

### 4. JSON-LD (结构化数据)
使用 `useHead` 可以方便地注入 JSON-LD 脚本，这对提升富文本搜索结果（Rich Snippets）至关重要。

```vue
<script setup lang="ts">
const article = ref({
  title: "探索 Nuxt4 的 SEO 功能",
  author: "AI 助手",
  publishedAt: "2024-01-01",
  // ...
});

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  'headline': article.value.title,
  'author': {
    '@type': 'Person',
    'name': article.value.author
  },
  'datePublished': article.value.publishedAt
}));

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: () => JSON.stringify(jsonLd.value)
    }
  ]
});
</script>
```

### 5. 生成 `robots.txt` 和 `sitemap.xml`
- **`robots.txt`**: 可以在 `public/` 目录下直接创建一个 `robots.txt` 文件。对于更动态的需求，可以使用社区模块或创建一个 server route。
- **`sitemap.xml`**: 强烈推荐使用社区模块，如 `@nuxtjs/sitemap`，它可以根据你的页面路由自动生成站点地图。

**使用 `@nuxtjs/sitemap` 示例:**
1.  安装: `npm install -D @nuxtjs/sitemap`
2.  配置:
    ```typescript
    // nuxt.config.ts
    export default defineNuxtConfig({
      modules: [
        '@nuxtjs/sitemap'
      ],
      site: {
        url: 'https://example.com', // 你的网站 URL
      },
      sitemap: {
        // 可选的额外配置
        // ...
      }
    })
    ```

## 常见坑点与注意事项

-   **`title` vs `titleTemplate`**:
    -   `titleTemplate` 在 `nuxt.config.ts` 中定义一次。如果页面设置了 `title`，它会替换 `%s`。如果页面没有设置 `title`，则会显示 `titleTemplate` 本身（不含 `%s`）。
    -   为了避免这种情况，可以在 `useHead` 中提供一个默认标题。

-   **`body: true`**:
    -   `useHead` 默认将标签添加到 `<head>`。对于某些需要放在 `<body>` 末尾的脚本，可以设置 `body: true`。
    -   `useHead({ script: [{ src: '...', body: true }] })`

-   **避免重复的 Meta 标签**:
    -   Nuxt `useHead` 会通过一个唯一的 `hid` 或 `key` 来识别和覆盖标签。建议为关键的 meta 标签（如 `description`, `og:title`）提供一个 `key`，以确保它们被正确地覆盖而不是重复添加。
    -   `useHead({ meta: [{ name: 'description', content: '...', key: 'desc' }] })`

-   **绝对 URL**:
    -   对于 `canonical` 链接、`og:url` 和 `og:image` 等，始终使用绝对 URL（`https://...`），而不是相对路径（`/...`）。这对于搜索引擎和社交媒体平台至关重要。

-   **测试工具**:
    -   使用 [Google Rich Results Test](https://search.google.com/test/rich-results) 来验证你的结构化数据。
    -   使用 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 来检查 Open Graph 标签。

## 参考链接
-   [Nuxt4 官方文档 - `useHead`](https://nuxt.com/docs/api/composables/use-head)
-   [Nuxt4 官方文档 - Meta 标签和 SEO](https://nuxt.com/docs/getting-started/seo-meta)
-   [Nuxt SEO 模块](https://nuxt.com/modules/seo) (一个集成了多种 SEO 功能的元模块)
-   [@nuxtjs/sitemap 模块](https://nuxt.com/modules/sitemap)
-   [Schema.org](https://schema.org/)