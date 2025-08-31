# 21. Nuxt 4 模块: @nuxt/content 最佳实践

## 核心理念：数据与渲染分离

在 Nuxt 4 和最新版的 `@nuxt/content` 中，最稳定、最清晰、最易于调试的内容处理模式是**将数据获取与内容渲染彻底分离**。

这种模式遵循一个简单的逻辑：

1.  **在 `<script setup>` 中，明确地获取数据**：使用 `useAsyncData` 结合 `queryContent()` API 来获取你需要的文档。
2.  **在 `<template>` 中，纯粹地渲染数据**：将获取到的数据对象，直接传递给 `<ContentRenderer />` 组件来负责展示。

这个模式避免了旧版中 `<ContentDoc />` 组件集数据获取与渲染于一身所带来的“黑盒”效应，让数据流变得清晰可见，极大降低了调试难度。

---

## 黄金实践：`useAsyncData` + `queryContent` + `<ContentRenderer />`

这是在 Nuxt 4 中渲染单个 Markdown 文档的**首选推荐方案**。

### 场景：创建动态文章页面 `pages/articles/[...slug].vue`

**代码示例:**

```vue
<script setup>
// 1. 导入必要的 Vue 和 Nuxt 组合式 API
import { useRoute } from 'vue-router'
import { useAsyncData } from 'nuxt/app'

// 2. 获取当前路由信息
const route = useRoute()

// 3. 使用 useAsyncData 异步获取数据
//    - 第一个参数是唯一的 key，确保数据在服务端和客户端之间正确传递。
//      使用 route.path 可以保证每个页面的 key 都是独一无二的。
//    - 第二个参数是一个返回 Promise 的异步函数，在这里我们执行内容查询。
const { data: page, error } = await useAsyncData(`content-${route.path}`, () => {
  // 使用 queryContent() API 来构建查询
  // - .where({ _path: route.path }) 根据当前路由路径精确查找文档
  // - .findOne() 获取单个文档对象
  return queryContent('content').where({ _path: route.path }).findOne()
})

// 4. (可选) 错误处理：如果找不到文档，可以进行重定向或显示错误信息
if (error.value || !page.value) {
  // 例如：抛出一个 404 错误
  // throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
</script>

<template>
  <main>
    <!-- 5. 使用 v-if 确保在数据加载完成后再渲染 -->
    <div v-if="page">
      <h1>{{ page.title }}</h1>
      <p>{{ page.description }}</p>
      
      <!-- 6. 将获取到的 page 对象传递给 ContentRenderer -->
      <!--    ContentRenderer 是一个“纯”组件，它只负责将 AST (抽象语法树) 渲染成 HTML -->
      <ContentRenderer :value="page" />
    </div>
    <div v-else>
      <p>文章正在加载中，或者没有找到...</p>
    </div>
  </main>
</template>
```

### 优势分析

- **清晰性 (Clarity)**: 数据从哪里来 (`useAsyncData` + `queryContent`)，到哪里去 (`<ContentRenderer />`)，一目了然。
- **可控性 (Control)**: 你可以完全控制数据获取的逻辑，例如添加复杂的查询条件、排序、或者在获取后对数据进行二次处理。
- **易调试 (Debuggability)**: 如果页面不显示，你可以轻易地通过 `console.log(page.value)` 或 `console.log(error.value)` 来判断是数据获取出了问题，还是渲染层出了问题。
- **高性能 (Performance)**: `useAsyncData` 完美地处理了服务端渲染（SSR）和客户端导航时的数据获取，避免了重复请求，并确保了 SEO 友好。

---

## 关于 `<ContentDoc />` 的说明

`<ContentDoc />` 组件在 `@nuxt/content` 的新版本中依然存在，但它的角色更像是一个“高级封装”或“语法糖”。它在内部实际上也是调用了 `queryContent` 和 `<ContentRenderer />`。

虽然它可以通过 `v-slot` 提供数据，但在实践中，这种隐式的数据获取方式可能会导致以下问题：

- **调试困难**: 当出现 `[Vue warn]: Failed to resolve component: ContentDoc` 这类错误时，问题的根源（例如模块加载失败）被组件封装所掩盖，难以定位。
- **逻辑耦合**: 将数据获取逻辑和模板渲染逻辑耦合在同一个组件中，违背了关注点分离的原则。

**结论**：为了代码的长期可维护性和健壮性，**强烈建议优先使用 `useAsyncData` + `<ContentRenderer />` 的显式模式**，仅在非常简单的、一次性的场景下，或者在完全理解其内部机制后，才考虑使用 `<ContentDoc />`。