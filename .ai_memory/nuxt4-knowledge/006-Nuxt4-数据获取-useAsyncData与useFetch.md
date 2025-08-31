# Nuxt4 数据获取：useAsyncData 与 useFetch
标签: Nuxt4, 数据获取, useFetch, useAsyncData, SSR

## 问题描述
在现代 Web 应用中，从 API 获取数据是核心功能。在 Nuxt4 的同构环境（SSR + CSR）下，如何高效、安全地获取数据，同时确保良好的 SEO 和用户体验？如何避免在服务端和客户端重复请求数据？

## 解决方案
Nuxt4 提供了两个强大的组合式函数 (Composables) 来处理数据获取：`useFetch` 和 `useAsyncData`。它们是构建高性能 Nuxt 应用的基石。

这两个函数的核心优势在于：
-   在服务端渲染（SSR）期间获取数据，并将数据内联到 HTML 中。
-   在客户端激活（Hydration）时，直接从内联数据中恢复状态，避免了客户端的二次请求。
-   提供了加载状态、错误处理、刷新机制等一系列开箱即用的功能。

### `useFetch`
`useFetch` 是最常用、最便捷的数据获取方式。它实际上是 `useAsyncData` 的一个封装，专门用于处理对外部 API 的 GET 请求。

-   **基础用法**

```vue
<template>
  <div>
    <p v-if="pending">加载中...</p>
    <pre v-else-if="error">请求失败: {{ error.message }}</pre>
    <pre v-else>{{ data }}</pre>
  </div>
</template>

<script setup>
// 自动向 /api/mountains/everest 发起 GET 请求
const { data, pending, error, refresh } = await useFetch('/api/mountains/everest');
</script>
```

-   **返回的值**:
    -   `data`: 响应式的数据引用。
    -   `pending`: 布尔值，表示请求是否正在进行中。
    -   `error`: 如果请求失败，则包含一个错误对象。
    -   `refresh`: 一个函数，可以手动重新触发请求。

### `useAsyncData`
`useAsyncData` 提供了更底层的控制，它允许你包裹任何异步操作，而不仅仅是 `fetch` 请求。当你需要更复杂的逻辑（例如，使用第三方 SDK、访问多个数据源）时，它就派上用场了。

-   **基础用法**

`useAsyncData` 接收两个参数：
1.  一个唯一的 key，用于在多次请求之间缓存结果。
2.  一个返回 Promise 的异步函数（handler）。

```vue
<template>
  <div>
    <p v-if="pending">加载文章中...</p>
    <article v-else>
      <h1>{{ article.title }}</h1>
      <p>{{ article.content }}</p>
    </article>
  </div>
</template>

<script setup>
// 使用文章 slug 作为唯一 key
const { data: article, pending } = await useAsyncData('article-mountain', () => {
  // 这里的 $fetch 是 Nuxt 提供的全局 fetch 实例
  return $fetch('/api/articles/mountain');
});
</script>
```

### 两者的选择
-   **优先使用 `useFetch`**: 对于标准的 RESTful API GET 请求，`useFetch` 更简洁，因为它会自动生成 key 并处理 `fetch` 调用。
-   **使用 `useAsyncData`**: 当你需要：
    -   自定义缓存 key。
    -   在获取数据前执行复杂的同步或异步逻辑。
    -   使用非 `fetch` 的数据源（如数据库客户端、gRPC 等）。

## 示例代码

### 示例 1: `useFetch` 结合动态路由

`pages/mountains/[slug].vue`:

```vue
<template>
  <div>
    <button @click="refresh">刷新数据</button>
    <div v-if="pending">正在加载...</div>
    <div v-else-if="mountain">
      <h1>{{ mountain.title }}</h1>
      <p>{{ mountain.description }}</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

// URL 会自动变成响应式的，当 slug 变化时会重新请求
const { data: mountain, pending, refresh } = await useFetch(() => `/api/mountains/${slug}`);

useHead({ title: () => mountain.value?.title || '山峰详情' });
</script>
```

### 示例 2: `useAsyncData` 结合 Pinia

```vue
<script setup>
import { useMyStore } from '~/stores/myStore';

const store = useMyStore();

// 如果 store 中已有数据，则直接使用，否则发起请求
// key 确保了这个请求在整个应用中只执行一次
const { data: settings } = await useAsyncData('site-settings', async () => {
  if (store.settings) {
    return store.settings;
  }
  const fetchedSettings = await $fetch('/api/settings');
  store.setSettings(fetchedSettings);
  return fetchedSettings;
});
</script>
```

## 黄金实践：与 `@nuxt/content` 模块结合

`@nuxt/content` 是 Nuxt 生态中用于处理 Markdown 和其他内容的强大模块。`useAsyncData` 是与它配合获取内容的**首选方式**。

这种模式将**数据获取**与**内容渲染**彻底分离，让代码更清晰、更易于调试。

**示例：在动态路由页面获取 Markdown 内容**

```vue
// pages/articles/[...slug].vue

<script setup>
const route = useRoute()

// 使用 useAsyncData 包装 queryContent 调用
const { data: page, error } = await useAsyncData(`content-${route.path}`, () => 
  queryContent('content').where({ _path: route.path }).findOne()
)
</script>

<template>
  <main v-if="page">
    <h1>{{ page.title }}</h1>
    <!-- 将获取的数据交由 ContentRenderer 纯粹地渲染 -->
    <ContentRenderer :value="page" />
  </main>
</template>
```

> **[info] 深入学习**
> 关于 `@nuxt/content` 的更多最佳实践，请参考我们的专题知识文档：
> `021-Nuxt4-模块-@nuxt_content最佳实践.md`

## 常见坑点与注意事项
-   **`await` 的重要性**: 在 `setup` 中使用 `useFetch` 或 `useAsyncData` 时，务必配合 `await`。这会确保在服务端完成数据获取之前，不会发送页面响应，这是实现 SSR 的关键。
-   **唯一 Key**: `useAsyncData` 的 key 必须是唯一的。如果多个地方使用相同的 key，它们将共享同一份数据。`useFetch` 会根据 URL 和参数自动生成一个唯一的 key。
-   **`$fetch` vs `fetch`**: 在 Nuxt 应用中，推荐使用 Nuxt 提供的 `$fetch`。它是一个增强版的 `fetch`，能自动处理 API 前缀、解析 JSON，并且在服务端调用时能直接调用内部 API，无需发起 HTTP 请求，性能更高。
-   **响应式**: 传递给 `useFetch` 的 URL 可以是一个响应式引用（如 ref 或 computed），当它变化时，`useFetch` 会自动重新发起请求。

## 参考链接
-   [Nuxt4 官方文档 - `useFetch`](https://nuxt.com/docs/api/composables/use-fetch)
-   [Nuxt4 官方文档 - `useAsyncData`](https://nuxt.com/docs/api/composables/use-async-data)
-   [Nuxt4 官方文档 - 数据获取概念](https://nuxt.com/docs/getting-started/data-fetching)