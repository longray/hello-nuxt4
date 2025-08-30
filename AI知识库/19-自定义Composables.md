# Nuxt4 自定义 Composables：打造你的“可复用魔法”

在 Nuxt 的世界里，我们已经用过很多官方提供的“魔法”，比如 `useState` 用于状态管理，`useFetch` 用于数据获取。但真正的“大法师”，不仅会使用现成的魔法，更懂得如何创造属于自己的、可复用的魔法。这，就是自定义 Composables 的魅力所在。

## 什么是 Composable？

**比喻：** 把它想象成一个“魔法工具包”。

一个 Composable 就是一个函数，它的名字通常以 `use` 开头（例如 `useMyMagic`）。这个函数将 Vue 的响应式 API（如 `ref`, `reactive`）与相关的逻辑打包在一起，形成一个独立的、可复用的单元。任何组件都可以“调用”这个工具包，轻松获得其中封装好的能力，而无需关心其内部复杂的实现细节。

Nuxt 会自动扫描 `composables/` 目录，并让其中的所有“工具包”在你的应用中全局可用，无需手动导入！

## 为什么要创造自己的“魔法”？

1.  **代码复用 (DRY - Don't Repeat Yourself):** 当你发现自己在多个组件里写着同样的代码（比如一个控制弹窗显示/隐藏的逻辑），就是时候把它提取成一个 Composable 了。
2.  **逻辑分离：** 让你的组件代码更专注于“长相”（模板和样式），而把复杂的“内涵”（业务逻辑）抽离出去，使代码结构更清晰。
3.  **更好的可读性与可维护性：** 一段逻辑被良好地封装在 Composable 中，就像给它贴上了一个清晰的标签，一目了然。
4.  **状态共享：** Composables 可以在多个组件之间轻松共享响应式状态，这是它们最强大的能力之一。

## 如何锻造一个 Composable？

让我们来打造一个最经典的“魔法”：一个计数器。

**第一步：创建文件**

在你的项目根目录下创建 `composables/useCounter.ts` 文件。

**第二步：编写魔法代码**

```typescript
// composables/useCounter.ts

// 你可以从 'vue' 或 '#imports' 导入 ref
import { ref, readonly } from 'vue'

export const useCounter = () => {
  // 1. 创建一个响应式的内部状态
  const count = ref(0)

  // 2. 创建一个修改状态的方法
  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  // 3. 将需要暴露给外面的状态和方法返回
  // 使用 readonly() 可以防止外部组件直接修改 count.value
  return {
    count: readonly(count),
    increment,
    decrement,
  }
}
```

## 如何在组件中使用“魔法”？

现在，任何组件都可以轻松使用这个计数器了。

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <h1>计数器</h1>
    <!-- 直接使用从 Composable 中获得的状态 -->
    <p>当前计数值: {{ count }}</p>
    
    <!-- 调用 Composable 中的方法 -->
    <button @click="increment">增加</button>
    <button @click="decrement">减少</button>
  </div>
</template>

<script setup>
// 直接调用，无需 import！
const { count, increment, decrement } = useCounter()
</script>
```

## 进阶魔法：共享状态的 Composable

如果一个 Composable 在其顶层作用域定义了状态，那么这个状态将在所有使用该 Composable 的组件之间共享（单例模式）。为了确保这个状态在服务端渲染（SSR）时不会出现问题（比如一个用户的数据泄露给另一个用户），我们应该使用 `useState` 来创建这个共享状态。

让我们创建一个 `useCart`（购物车）的例子：

```typescript
// composables/useCart.ts

export const useCart = () => {
  // 使用 useState 来创建 SSR 友好的共享状态
  const items = useState<string[]>('cart-items', () => [])

  const addItem = (item: string) => {
    items.value.push(item)
  }

  const removeItem = (item: string) => {
    const index = items.value.findIndex(i => i === item)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  // 使用 computed 来创建衍生状态
  const itemCount = computed(() => items.value.length)

  return {
    items,
    addItem,
    removeItem,
    itemCount,
  }
}
```

现在，你可以在 `ProductPage.vue` 中调用 `addItem`，然后在 `Navbar.vue` 中调用 `useCart` 来显示 `itemCount`，它们将完美同步！

---

自定义 Composables 是 Nuxt 4 和 Vue 3 架构思想的核心。掌握它，你就能写出高度组织化、可维护、可扩展的优雅代码，真正从“魔法使用者”蜕变为“魔法创造者”。