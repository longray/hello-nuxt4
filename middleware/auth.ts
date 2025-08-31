// middleware/auth.ts

/**
 * @description 认证中间件
 *
 * 这个中间件用于保护特定路由，确保只有已登录的用户才能访问。
 * 它会在路由切换前被调用。
 *
 * @param to - 目标路由对象
 * @param from - 源路由对象
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 从 useAuth composable 中获取当前用户状态
  const { user } = useAuth()

  // 检查用户是否未登录，并且目标路径是受保护的 /profile
  if (!user.value && to.path === '/profile') {
    // 打印提示信息，便于调试
    console.log('中间件：用户未登录，正在重定向到 /login')

    // 如果用户未登录，则重定向到登录页面
    // navigateTo 是 Nuxt 提供的用于程序化导航的函数
    return navigateTo('/login')
  }

  // 如果用户已登录，或访问的不是受保护页面，则允许导航
  console.log('中间件：用户已登录或访问公共页面，允许访问', to.path)
})