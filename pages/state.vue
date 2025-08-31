<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Pinia 状态管理示例</h1>

    <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <p class="text-lg mb-2">
        当前计数值 (State): <span class="font-mono text-xl text-blue-500">{{ counter.count }}</span>
      </p>
      <p class="text-lg mb-4">
        双倍计数值 (Getter): <span class="font-mono text-xl text-green-500">{{ counter.doubleCount }}</span>
      </p>

      <div class="flex space-x-4">
        <button @click="counter.increment" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          增加 (Action: increment)
        </button>
        <button @click="counter.decrement" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          减少 (Action: decrement)
        </button>
      </div>
    </div>

    <div class="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
      <h2 class="text-xl font-semibold mb-2">工作原理说明</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>页面通过 `useCounterStore()` 导入并订阅了 store 的状态。</li>
        <li>`counter.count` 直接绑定到 state 的 `count` 属性。</li>
        <li>`counter.doubleCount` 实时反映了 getter `doubleCount` 的计算结果。</li>
        <li>点击按钮会直接调用 store 中定义的 `increment` 和 `decrement` actions，实现对 state 的修改。</li>
        <li>这一切都具备完整的 TypeScript 类型提示和自动补全。</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// 导入我们刚刚创建的 counter store
import { useCounterStore } from '~/stores/counter'
import { onServerPrefetch } from 'vue'

// 在 setup 函数中获取 store 实例
// Nuxt 会自动处理 store 的初始化和跨请求状态同步
const counter = useCounterStore()

// onServerPrefetch 是 Vue 3 的一个生命周期钩子，它只在服务端渲染 (SSR) 期间执行
// 我们在这里调用 store 的 init action，来模拟在服务端获取初始数据的过程
// 这个钩子是异步的，Nuxt 会等待它执行完毕再将页面发送给客户端
onServerPrefetch(async () => {
  await counter.init()
})
</script>