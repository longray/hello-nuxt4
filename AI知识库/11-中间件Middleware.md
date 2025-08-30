# Nuxt4 中间件：你的“路由守卫”

在构建 Web 应用时，我们经常需要在用户访问某个页面之前或之后执行一些逻辑。比如，检查用户是否登录，如果没登录就强制跳转到登录页。在 Nuxt4 中，完成这项任务的“专业保镖”，就是中间件 (Middleware)。

## 什么是中间件？

*   **比喻：** 想象你的网站是一座戒备森严的城堡，而每一个页面都是城堡里的一个重要房间。中间件，就是站在每个房间门口的“路由守卫”。
    *   **全局守卫 (`addRouteMiddleware`):** 这是守在城堡大门口的“总教头”。任何想要进入城堡的人（访问任何页面），都必须先经过他的盘问。
    *   **路由中间件 (`defineNuxtRouteMiddleware`):** 这是守在特定房间（如“藏宝室”或“议事厅”）门口的“精英护卫”。只有访问这些特定房间时，才需要接受他们的检查。

*   **工作原理：** 中间件是在页面渲染之前执行的导航钩子。它接收两个参数 `to` 和 `from`，分别代表即将进入的目标路由对象和离开的当前路由对象。在中间件里，你可以分析这两个对象，然后决定下一步该怎么做：是放行，还是重定向到其他页面。

## 如何部署你的“守卫”？

Nuxt 中间件都存放在 `middleware/` 目录下。

### 1. 创建路由中间件 (精英护卫)

在 `middleware/` 目录下创建一个文件，比如 `auth.ts`。这个文件名 (`auth`) 将成为中间件的名字。

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // 在这个中间件中，我们假设有一个 `useAuth` 的 composable 来获取用户状态
  const { isLoggedIn } = useAuth()

  // 如果用户没有登录，并且访问的不是登录页面
  if (!isLoggedIn() && to.path !== '/login') {
    // 那么就把他“请”到登录页面去
    // navigateTo 会返回一个重定向的错误，Nuxt 会捕获并处理它
    return navigateTo('/login')
  }
})
```

**使用这个中间件：**

你可以在页面中通过 `definePageMeta` 来指定使用哪个“护卫”。

```vue
<!-- pages/dashboard.vue -->
<script setup>
definePageMeta({
  middleware: 'auth' // 在访问这个页面前，会先执行 auth 中间件
  // 也可以使用数组来指定多个中间件
  // middleware: ['auth', 'analytics']
})
</script>
```

### 2. 创建全局中间件 (总教头)

如果你想让一个中间件在每次路由切换时都执行，只需要在它的文件名后加上 `.global` 后缀。

```typescript
// middleware/analytics.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // 每次路由变化时，都打印出目标路径
  console.log(`用户正在从 ${from.path} 前往 ${to.path}`)
  // 在这里可以调用你的分析服务，记录页面浏览量等
})
```

全局中间件无需在页面中手动指定，Nuxt 会自动应用它们。

## `navigateTo()`：你的“传送令牌”

`navigateTo()` 是 Nuxt 提供的用于编程式导航的辅助函数。在中间件中，当你需要中断当前导航并重定向到新页面时，`navigateTo()` 是你的首选工具。它可以在客户端和服务器端无缝工作。

---

中间件是保护你应用路由安全、实现复杂导航逻辑的强大工具。无论是做权限控制、A/B 测试的流量分配，还是根据设备类型重定向到不同页面，中间件都能优雅地完成任务。现在，去为你的城堡部署上可靠的“路由守卫”吧！