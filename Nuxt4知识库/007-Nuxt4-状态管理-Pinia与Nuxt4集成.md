# Nuxt4 状态管理：Pinia 与 Nuxt4 集成
标签: Nuxt4, Pinia, 状态管理, Store

## 问题描述
在大型 Nuxt4 应用中，如何有效地管理全局状态？如何在服务端渲染（SSR）环境下正确地使用 Pinia？如何确保状态在服务端和客户端之间的一致性？

## 解决方案
Pinia 是 Vue 生态系统中的新一代状态管理库，它完全支持 TypeScript，并且与 Nuxt4 有着深度集成。相比 Vuex，它提供了更简单的 API、更好的开发体验和更强大的类型推导。

### 安装与配置
1.  首先，安装 Pinia 和 Nuxt 的 Pinia 模块：
```bash
npm install @pinia/nuxt
```

2.  在 `nuxt.config.ts` 中启用 Pinia 模块：
```typescript
export default defineNuxtConfig({
  modules: ['@pinia/nuxt']
});
```

### Store 的定义
在 Nuxt4 中，推荐将 store 文件放在 `stores/` 目录下。Nuxt 会自动扫描并导入这些文件。

- `stores/counter.ts`:
```typescript
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  // 状态（类似于组件的 data）
  state: () => ({
    count: 0,
    lastUpdated: null as Date | null,
  }),

  // Getters（类似于组件的 computed）
  getters: {
    doubleCount: (state) => state.count * 2,
    isPositive: (state) => state.count > 0,
  },

  // Actions（类似于组件的 methods）
  actions: {
    increment() {
      this.count++;
      this.lastUpdated = new Date();
    },
    async fetchInitialCount() {
      const response = await $fetch('/api/counter');
      this.count = response.count;
    },
  },
});
```

### 组合式 API 风格的 Store
Pinia 也支持使用组合式 API 风格来定义 store，这种方式更接近 Vue3 的编程范式：

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null);
  const token = ref('');

  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const fullName = computed(() => 
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  );

  // Actions
  async function login(credentials) {
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: credentials,
    });
    token.value = response.token;
    user.value = response.user;
  }

  function logout() {
    token.value = '';
    user.value = null;
  }

  return {
    user,
    token,
    isLoggedIn,
    fullName,
    login,
    logout,
  };
});
```

### 在组件中使用 Store

```vue
<template>
  <div>
    <p>当前计数: {{ counter.count }}</p>
    <p>双倍计数: {{ counter.doubleCount }}</p>
    <button @click="counter.increment">+1</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '~/stores/counter';

// 获取 store 实例
const counter = useCounterStore();

// 如果需要在组件挂载时获取初始数据
onMounted(async () => {
  await counter.fetchInitialCount();
});
</script>
```

### SSR 注意事项
在 SSR 环境下使用 Pinia 时，需要特别注意：

1.  **状态初始化**: 在服务端渲染时，每个请求都需要一个新的 store 实例，以避免状态污染。Nuxt 的 Pinia 模块已经帮我们处理好了这一点。

2.  **状态序列化**: 确保 store 中的数据是可序列化的，因为它们需要从服务端传输到客户端。

```typescript
// ❌ 错误：Date 对象不能正确序列化
state: () => ({
  currentTime: new Date()
})

// ✅ 正确：使用时间戳或 ISO 字符串
state: () => ({
  currentTime: Date.now() // 或 new Date().toISOString()
})
```

## 示例代码

### 示例 1: 购物车 Store
```typescript
// stores/cart.ts
import { defineStore } from 'pinia';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    addItem(item: Omit<CartItem, 'quantity'>) {
      const existingItem = this.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ ...item, quantity: 1 });
      }
    },

    removeItem(itemId: number) {
      const index = this.items.findIndex(item => item.id === itemId);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },
  },
});
```

### 示例 2: 主题设置 Store（持久化）
```typescript
// stores/theme.ts
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    accentColor: '#42b883',
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      // 在客户端保存主题设置
      if (process.client) {
        localStorage.setItem('theme', JSON.stringify({
          isDark: this.isDark,
          accentColor: this.accentColor,
        }));
      }
    },

    // 初始化主题设置
    initTheme() {
      if (process.client) {
        const saved = localStorage.getItem('theme');
        if (saved) {
          const theme = JSON.parse(saved);
          this.isDark = theme.isDark;
          this.accentColor = theme.accentColor;
        }
      }
    },
  },
});
```

## 常见坑点与注意事项
-   **状态持久化**: 如果需要持久化 store 状态（例如保存到 localStorage），记得只在客户端执行相关操作。可以使用 `process.client` 来判断当前运行环境。
-   **SSR 状态污染**: 在服务端，每个请求都应该有独立的 store 实例。使用 Nuxt 的 Pinia 模块时，这一点已经自动处理了。
-   **订阅 Store 变化**: 在使用 `watch` 或 `subscribe` 监听 store 变化时，记得在组件卸载时取消订阅，以避免内存泄漏。
-   **TypeScript 支持**: Pinia 提供了出色的 TypeScript 支持。确保正确定义 state、getters 和 actions 的类型，以获得最佳的开发体验。

## 参考链接
-   [Pinia 官方文档](https://pinia.vuejs.org/)
-   [Nuxt4 Pinia 模块文档](https://nuxt.com/modules/pinia)
-   [Pinia SSR 指南](https://pinia.vuejs.org/ssr/)