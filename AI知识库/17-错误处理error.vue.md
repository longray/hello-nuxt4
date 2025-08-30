# Nuxt4 错误处理 (error.vue)：一场优雅的“谢幕”

在任何精良的戏剧表演中，即使出现了意料之外的状况（比如演员忘词、道具损坏），也需要一个优雅的“谢幕”来维持观众的体验。在 Web 应用中，`error.vue` 文件扮演的就是这个角色。当灾难性的错误发生时，它会接管舞台，给用户一个友好而清晰的交代，而不是让他们看到冰冷、令人困惑的错误代码。

## 什么时候会触发“谢幕”？

Nuxt 会在遇到两种无法挽回的错误时，自动寻找并渲染 `error.vue` 页面：

1.  **客户端错误：** 在页面切换（路由导航）过程中，如果 Nuxt 无法加载所需的页面组件（比如网络问题，或者该路由根本不存在），就会触发 404 (Not Found) 错误。
2.  **服务端错误：** 在服务端渲染期间，如果代码（比如在 `setup` 或生命周期钩子中）抛出了一个未被捕获的异常，就会触发 500 (Internal Server Error) 错误。

## 如何打造你的“谢幕”舞台？

非常简单，只需在你的项目根目录下创建一个 `error.vue` 文件即可。

```vue
<!-- error.vue -->
<template>
  <div class="error-page">
    <div v-if="error.statusCode === 404">
      <h1>404 - 页面迷路了</h1>
      <p>抱歉，您要找的页面好像去星际旅行了。</p>
    </div>
    <div v-else>
      <h1>{{ error.statusCode }} - 啊哦，出错了</h1>
      <p>我们的服务器好像打了个盹，请稍后再试。</p>
      <p v-if="isDev">错误详情: {{ error.message }}</p>
    </div>
    <button @click="handleError">返回首页</button>
  </div>
</template>

<script setup>
// `useError` composable 会返回当前发生的错误对象
const error = useError()
const isDev = process.dev

const handleError = () => {
  // `clearError` 会清除当前的错误状态，并重定向到指定路径
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  text-align: center;
  padding-top: 5rem;
}
</style>
```

### 关键知识点：

*   **`useError()`:** 这是一个 Composable，调用它会返回一个包含错误信息的对象，通常结构如下：
    *   `statusCode`: HTTP 状态码 (如 404, 500)。
    *   `message`: 错误的具体信息。
    *   `statusMessage`: 状态码对应的文本消息 (如 'Not Found')。
    *   `stack`: (仅在开发模式下) 错误的堆栈跟踪信息。
*   **`clearError({ redirect: '/' })`:** 这是最重要的函数！当用户点击“返回首页”时，你必须调用 `clearError` 来告诉 Nuxt：“好了，错误已经处理完毕，我们可以翻篇了”。它会清除内部的错误状态，然后通过 `redirect` 参数将用户导航到一个安全的页面。

## 主动触发错误

在某些情况下，你可能需要自己手动触发一个错误。例如，在 `server/api` 或页面中，如果根据业务逻辑判断这是一个错误状态（比如根据 ID 未找到文章），你可以使用 `createError` 函数。

```typescript
// pages/posts/[id].vue
const { data: post } = await useFetch(`/api/posts/${route.params.id}`)

if (!post.value) {
  throw createError({ 
    statusCode: 404, 
    statusMessage: 'Post Not Found', 
    fatal: true // `fatal: true` 告诉 Nuxt 这是一个严重错误，必须渲染 error.vue
  })
}
```

---

一个健壮的应用，不仅要在正常情况下表现出色，更要在异常发生时处理得体。`error.vue` 就是你实现这种“健壮性”的最后一道防线。花点时间打造一个友好的错误页面，它会在关键时刻挽救你的用户体验。