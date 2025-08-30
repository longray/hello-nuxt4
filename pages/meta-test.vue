<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Meta 标签测试页面</h1>
    <p class="mb-4">这个页面用来演示如何使用 `useHead` 动态管理 Meta 标签。</p>
    <p class="mb-4">当前的页面标题是：<span class="font-semibold text-blue-500">{{ title }}</span></p>
    <button @click="changeTitle" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      改变标题
    </button>
    <div class="mt-8 p-4 border rounded bg-gray-50 dark:bg-gray-800">
      <h2 class="text-lg font-semibold mb-2">如何验证？</h2>
      <p>1. 查看浏览器标签页的标题，它应该显示为 "动态标题 - Meta 示例"。</p>
      <p>2. 打开浏览器的开发者工具，检查 `<head>` 标签，你应该能找到 `description` meta 标签。</p>
      <p>3. 点击 "改变标题" 按钮，观察浏览器标签页的标题是否变成了 "新的动态标题！"。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('动态标题 - Meta 示例')

useHead({
  title: title,
  meta: [
    {
      name: 'description',
      content: '这是一个使用 useHead 动态设置的页面描述。'
    }
  ]
})

function changeTitle() {
  title.value = '新的动态标题！'
}
</script>