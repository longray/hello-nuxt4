<template>
  <UContainer class="p-10">
    <UCard>
      <template #header>
        <div class="text-lg font-bold">
          👋 Hello, World!
        </div>
      </template>

      <p class="py-4">
        这是我们第一个 Nuxt4 示例页面。
      </p>

      <p class="pb-4">
        我们正在使用来自 <code>@nuxt/examples-ui</code> 的组件来构建界面。
      </p>

      <!-- 数据加载状态处理 -->
      <div v-if="pending" class="py-4 text-gray-500">
        正在从后端加载数据...
      </div>
      <div v-else-if="error" class="py-4 text-red-500">
        数据加载失败: {{ error.message }}
      </div>
      <div v-else-if="data" class="py-4 border-t">
        <p class="font-semibold">来自后端的消息:</p>
        <pre class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded"><code>{{ data }}</code></pre>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
// 使用 useFetch 从后端 /api/hello 获取数据
// useFetch 是 Nuxt 提供的组合式函数，可以优雅地处理数据获取、加载状态和错误
const { data, pending, error } = await useFetch('/api/hello')
</script>

<style>
/* 页面专属样式可以写在这里 */
</style>