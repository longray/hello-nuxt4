# Nuxt4 布局系统（Layouts）与全局 UI 结构
标签: Nuxt4, 布局, Layouts, UI

## 问题描述
在构建一个网站时，通常会有一些通用的 UI 结构，比如所有页面共享的页头（Header）、页脚（Footer）和导航栏。如何优雅地在 Nuxt4 中管理这些可复用的布局，避免在每个页面中重复编写相同的代码？

## 解决方案
Nuxt4 提供了一个强大的**布局系统**，它基于 `layouts/` 目录的约定。你可以创建多个布局文件，并在页面中轻松切换，从而实现灵活且可维护的 UI 结构。

### 创建布局
1.  在项目根目录下创建 `layouts/` 文件夹。
2.  在 `layouts/` 文件夹中创建一个 `.vue` 文件，例如 `default.vue`。
3.  一个布局文件必须包含一个 `<slot />` 组件，用于承载和渲染页面内容。

- `layouts/default.vue`:
```vue
<template>
  <div class="app-container">
    <header class="main-header">
      <!-- 通用页头 -->
      <AppHeader />
    </header>
    <main class="main-content">
      <!-- 页面内容会在这里被渲染 -->
      <slot />
    </main>
    <footer class="main-footer">
      <!-- 通用页脚 -->
      <AppFooter />
    </footer>
  </div>
</template>

<script setup>
// 你可以在这里导入页头、页脚等全局组件
import AppHeader from '~/components/global/AppHeader.vue';
import AppFooter from '~/components/global/AppFooter.vue';
</script>

<style scoped>
/* 布局相关的样式 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
}
</style>
```

### 使用布局
- **默认布局**: 如果 `layouts/default.vue` 文件存在，它将成为所有页面的默认布局。你无需任何额外配置。
- **指定布局**: 你可以在页面组件中使用 `definePageMeta` 宏来为特定页面指定一个不同的布局。

  - 首先，创建另一个布局文件，例如 `layouts/custom.vue`:
  ```vue
  <template>
    <div>
      <h2>这是一个自定义的简约布局</h2>
      <slot />
    </div>
  </template>
  ```

  - 然后，在页面中应用它，例如 `pages/special-page.vue`:
  ```vue
  <template>
    <h1>这是一个需要特殊布局的页面</h1>
  </template>

  <script setup>
  definePageMeta({
    layout: 'custom', // 告诉 Nuxt 使用 custom.vue 布局
  });
  </script>
  ```

### 动态切换布局
你甚至可以在运行时动态地改变一个页面的布局。

```vue
<template>
  <div>
    <button @click="enableCustomLayout">切换到自定义布局</button>
    <p>当前布局: {{ layoutName }}</p>
  </div>
</template>

<script setup>
const layoutName = ref('default'); // 初始布局

function enableCustomLayout() {
  setPageLayout('custom'); // 使用 setPageLayout 辅助函数切换布局
  layoutName.value = 'custom';
}
</script>
```

### `<NuxtLayout>` 组件
在 `app.vue` 文件中，`<NuxtLayout>` 组件负责包裹和渲染当前页面所使用的布局。

- `app.vue`:
```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

## 常见坑点与注意事项
- **`<slot />` 是必须的**: 每个布局文件都必须包含一个 `<slot />` 或 `<slot></slot>`，否则 Nuxt 不知道在哪里插入页面内容，会导致页面无法渲染。
- **布局命名**: 布局名称是根据 `layouts/` 目录下的文件名（不含扩展名）自动生成的，且是 kebab-case 格式。例如，`myLayout.vue` 会被识别为 `my-layout`。
- **禁用布局**: 如果某个页面（例如登录页或 404 页面）不需要任何布局，你可以通过 `definePageMeta({ layout: false })` 来禁用它。
- **响应式布局**: 结合 CSS 媒体查询和 Nuxt 的响应式工具，你可以创建能够适应不同屏幕尺寸的复杂布局。

## 参考链接
- [Nuxt4 官方文档 - 布局系统](https://nuxt.com/docs/guide/directory-structure/layouts)
- [Nuxt4 官方文档 - `<NuxtLayout>` 组件](https://nuxt.com/docs/api/components/nuxt-layout)