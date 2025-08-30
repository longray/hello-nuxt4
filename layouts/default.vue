<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
    <header class="bg-gray-100 dark:bg-gray-900 py-4 shadow">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl font-bold">Nuxt Layouts 示例</h1>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-8">
      <!-- 页面内容将在这里注入 -->
      <slot />
    </main>

    <footer class="bg-gray-200 dark:bg-gray-800 py-4 mt-auto">
      <div class="container mx-auto px-4 text-center">
        <p>一个很棒的页脚 &copy; 2024</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 这是一个简单的布局文件，通常不需要复杂的逻辑。
// Nuxt 会自动识别并使用它作为默认布局。
</script>

<style>
/* 我们可以在这里添加一些针对布局的全局样式 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>