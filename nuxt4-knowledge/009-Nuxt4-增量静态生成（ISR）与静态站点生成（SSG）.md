# Nuxt4 增量静态生成（ISR）与静态站点生成（SSG）
标签: Nuxt4, ISR, SSG, 静态生成, 性能优化

## 问题描述
如何在 Nuxt4 中实现高性能的静态站点生成（SSG）？如何使用增量静态生成（ISR）来平衡内容的实时性和性能？这些技术如何帮助我们构建既快速又易于维护的网站？

## 解决方案
Nuxt4 提供了两种强大的静态生成方案：传统的静态站点生成（SSG）和创新的增量静态生成（ISR）。它们各自适用于不同的场景，让我们深入了解。

### 静态站点生成（SSG - Static Site Generation）
SSG 在构建时预渲染所有页面，生成纯静态的 HTML 文件。这些文件可以部署到任何静态托管服务（如 Vercel、Netlify、GitHub Pages 等）。

#### 开启 SSG 模式
在 `nuxt.config.ts` 中配置：

```typescript
export default defineNuxtConfig({
  // 开启静态生成
  nitro: {
    preset: 'static'
  }
})
```

#### 生成静态文件
```bash
# 构建并生成静态文件
npm run generate
```
这会在 `.output/public/` 目录下生成所有静态文件。

#### 动态路由的静态生成
对于动态路由（如 `/posts/[id].vue`），你需要告诉 Nuxt 要生成哪些具体的路由：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/posts/1', '/posts/2', '/posts/3']
    }
  }
})
```

或者使用 `crawlLinks` 选项自动爬取所有链接：
```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true
    }
  }
})
```

### 增量静态生成（ISR - Incremental Static Regeneration）
ISR 允许你在用户请求时重新生成特定页面，同时保持其他页面的静态特性。这是一种混合方案，结合了 SSG 的性能优势和动态内容的实时性。

#### 配置 ISR
在页面组件中使用 `defineNuxtRouteRules` 来配置 ISR：

```vue
<script setup>
defineNuxtRouteRules({
  // 每 60 秒重新生成一次
  isr: 60
})

// 获取博客文章数据
const { data: post } = await useFetch('/api/posts/1')
</script>

<template>
  <article>
    <h1>{{ post.title }}</h1>
    <p>{{ post.content }}</p>
    <p>最后更新时间：{{ new Date().toLocaleString() }}</p>
  </article>
</template>
```

也可以在 `nuxt.config.ts` 中全局配置：

```typescript
export default defineNuxtConfig({
  routeRules: {
    // 对所有博客文章使用 ISR
    '/blog/**': { isr: true },
    // 指定更新间隔（秒）
    '/products/**': { isr: 60 },
    // 某些页面保持纯静态
    '/about': { static: true }
  }
})
```

## 示例代码

### 示例 1：博客系统的静态生成

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      ignore: ['/admin']  // 忽略管理后台
    }
  }
})
```

```vue
<!-- pages/blog/[slug].vue -->
<script setup>
const route = useRoute()
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)

// 使用 ISR，每小时更新一次
defineNuxtRouteRules({
  isr: 3600
})

useHead({
  title: post.value?.title,
  meta: [
    { name: 'description', content: post.value?.description }
  ]
})
</script>

<template>
  <article class="blog-post">
    <h1>{{ post.title }}</h1>
    <time>{{ new Date(post.publishedAt).toLocaleDateString() }}</time>
    <div v-html="post.content"></div>
  </article>
</template>
```

### 示例 2：电商产品页面

```vue
<!-- pages/products/[id].vue -->
<script setup>
const route = useRoute()
const config = useRuntimeConfig()

// 根据环境决定是否使用 ISR
defineNuxtRouteRules({
  isr: process.env.NODE_ENV === 'production' ? 300 : false
})

const { data: product } = await useFetch(`${config.apiBase}/products/${route.params.id}`)

// 处理 404
if (!product.value) {
  throw createError({
    statusCode: 404,
    message: '产品未找到'
  })
}
</script>

<template>
  <div class="product-page">
    <h1>{{ product.name }}</h1>
    <div class="product-price">
      ¥{{ product.price.toFixed(2) }}
    </div>
    <div class="product-stock">
      库存: {{ product.stock }}
      <span v-if="product.stock < 10" class="low-stock">
        库存告急！
      </span>
    </div>
    <div class="product-description">
      {{ product.description }}
    </div>
  </div>
</template>
```

## 常见坑点与注意事项

### SSG 相关
-   **动态路由处理**: 必须明确指定要生成的动态路由，否则这些页面将不会被预渲染。
-   **API 依赖**: 在构建时，确保所有必需的 API 端点都是可访问的。
-   **构建时间**: 页面数量很多时，构建可能会很慢。考虑使用 `generate` 命令的 `--parallel` 选项来并行生成。
-   **客户端 API**: 某些只在客户端可用的 API（如 `localStorage`）需要在 `onMounted` 钩子中使用。

### ISR 相关
-   **缓存控制**: ISR 页面的缓存时间需要根据数据更新频率来合理设置。
-   **存储要求**: ISR 需要一个支持缓存的存储系统（如 Redis）来存储生成的页面。
-   **回退机制**: 当 ISR 重新生成失败时，确保有适当的错误处理和回退策略。
-   **验证数据**: 在显示缓存的内容之前，可能需要在客户端验证数据的新鲜度。

### 部署注意事项
-   **托管平台**: 不是所有托管平台都支持 ISR，选择平台时需要确认。
-   **构建输出**: SSG 生成的文件在 `.output/public/` 目录，确保正确部署这个目录。
-   **环境变量**: 确保在构建环境中设置了所有必需的环境变量。
-   **预渲染超时**: 对于生成时间较长的页面，可能需要调整构建工具的超时设置。

## 参考链接
-   [Nuxt4 官方文档 - 静态站点生成](https://nuxt.com/docs/getting-started/deployment#static-hosting)
-   [Nuxt4 官方文档 - 增量静态生成](https://nuxt.com/docs/guide/concepts/rendering#incremental-static-regeneration)
-   [Nitro 引擎文档](https://nitro.unjs.io/)