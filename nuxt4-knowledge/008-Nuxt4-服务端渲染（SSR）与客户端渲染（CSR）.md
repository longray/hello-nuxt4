# Nuxt4 服务端渲染（SSR）与客户端渲染（CSR）
标签: Nuxt4, SSR, CSR, 渲染模式

## 问题描述
SSR（服务端渲染）和 CSR（客户端渲染）是现代 Web 应用的两种核心渲染模式。它们各自有什么优缺点？在 Nuxt4 中如何选择和配置这两种模式？理解它们的差异对于构建高性能、SEO 友好的应用至关重要。

## 解决方案
Nuxt4 默认采用 SSR 模式，但可以非常轻松地切换到 CSR 模式。这两种模式的选择取决于你的应用场景和需求。

### 服务端渲染 (SSR - Server-Side Rendering)
SSR 是 Nuxt4 的默认模式，也被称为“同构渲染” (Universal Rendering)。

-   **工作流程**:
    1.  当用户请求一个页面时，请求首先到达 Node.js 服务器。
    2.  服务器执行 Vue 组件代码，获取数据，并将组件渲染成完整的 HTML 字符串。
    3.  服务器将这个包含所有内容的 HTML 发送给浏览器。
    4.  浏览器立即显示页面内容（首屏加载速度快）。
    5.  同时，客户端会下载 JavaScript 代码，并在后台进行“激活” (Hydration)，接管页面交互。

-   **优点**:
    -   **更好的 SEO**: 搜索引擎可以直接抓取到完整的页面内容，有利于收录和排名。
    -   **更快的首屏加载速度 (FCP)**: 用户能更快地看到页面内容，提升了感知性能。
    -   **一致的用户体验**: 无论在何种网络环境下，用户都能看到一个基本可用的页面。

-   **缺点**:
    -   **更高的服务器负载**: 每次请求都需要在服务器上进行渲染，对服务器性能有一定要求。
    -   **更复杂的开发心智**: 需要考虑代码在服务端和客户端两种环境下的兼容性问题（例如，避免在服务端直接访问 `window` 对象）。

### 客户端渲染 (CSR - Client-Side Rendering)
CSR 是传统单页应用 (SPA - Single Page Application) 的渲染模式。

-   **工作流程**:
    1.  当用户请求应用时，服务器只返回一个几乎空白的 HTML 文件和一个 JavaScript 包的链接。
    2.  浏览器下载并执行 JavaScript 代码。
    3.  JavaScript 代码（通常是 Vue）在客户端动态创建 DOM、获取数据并渲染页面。

-   **优点**:
    -   **更低的服务器负载**: 服务器只负责提供静态文件，无需进行页面渲染。
    -   **丰富的交互体验**: 页面加载后，路由切换和交互都在客户端完成，体验流畅，类似原生应用。
    -   **开发简单**: 无需过多关心服务端环境的兼容性问题。

-   **缺点**:
    -   **较差的 SEO**: 搜索引擎抓取到的可能只是一个空壳 HTML，不利于内容收录。
    -   **较慢的首屏加载速度**: 用户需要等待所有 JavaScript 下载并执行完毕后才能看到页面内容，可能出现“白屏”时间。

### 如何在 Nuxt4 中切换模式
你可以在 `nuxt.config.ts` 文件中通过 `ssr` 选项来轻松切换渲染模式。

-   **开启 SSR (默认)**:
    ```typescript
    // nuxt.config.ts
    export default defineNuxtConfig({
      ssr: true
    })
    ```

-   **切换到 CSR (SPA 模式)**:
    ```typescript
    // nuxt.config.ts
    export default defineNuxtConfig({
      ssr: false
    })
    ```
    将 `ssr` 设置为 `false` 后，Nuxt 将不再进行服务端渲染，`npm run build` 会生成一个纯静态的单页应用。

## 示例代码

### 示例：处理环境差异
在 SSR 应用中，你经常需要编写只在特定环境下运行的代码。

```vue
<template>
  <div>
    <p>当前时间: {{ time }}</p>
    <p v-if="isClient">这段文字只在客户端显示！</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const time = ref(new Date().toLocaleTimeString());
const isClient = ref(false);

// onMounted 钩子只在客户端执行
onMounted(() => {
  console.log('组件已在客户端挂载！');
  isClient.value = true;
  // 访问 window 对象是安全的
  console.log('窗口宽度:', window.innerWidth);
});

// process.server 和 process.client 可用于判断当前环境
if (process.server) {
  console.log('这段日志在服务端打印');
}
if (process.client) {
  console.log('这段日志在客户端打印');
}
</script>
```

## 常见坑点与注意事项
-   **`window` / `document` is not defined**: 这是 SSR 开发中最常见的错误。原因是你在服务端的代码中尝试访问只存在于浏览器环境的全局对象。务必将这类代码放在 `onMounted` 钩子或 `if (process.client)` 判断中。
-   **选择困难症**: 该选 SSR 还是 CSR？
    -   **需要 SEO 的内容型网站** (博客、新闻、电商)：**首选 SSR**。
    -   **重交互的管理后台、仪表盘** (Dashboard)：**CSR 更合适**，因为 SEO 通常不重要，且用户愿意为流畅的交互体验等待片刻。
    -   **混合需求**: Nuxt4 也支持按路由配置渲染模式，实现更精细的控制。
-   **激活错误 (Hydration Mismatch)**: 当服务端渲染的 HTML 与客户端渲染的虚拟 DOM 不匹配时，会发生此错误。常见原因包括：在 `setup` 中使用了不确定的数据（如 `new Date()`）、HTML 结构不规范等。

## 参考链接
-   [Nuxt4 官方文档 - 渲染模式](https://nuxt.com/docs/guide/concepts/rendering)
-   [Vue.js 官方文档 - 服务端渲染](https://vuejs.org/guide/scaling-up/ssr.html)