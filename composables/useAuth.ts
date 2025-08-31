// composables/useAuth.ts

/**
 * @description 模拟用户认证状态的管理逻辑
 *
 * 这个 Composable 提供了一个响应式的 `user` 状态和 `login`/`logout` 方法，
 * 用于在应用中模拟用户的登录和登出行为。
 * 它使用了 Nuxt 的 `useState` 来创建可在组件和页面间共享的状态。
 */
export const useAuth = () => {
  // 使用 useState 创建一个跨组件共享的、响应式的 user 状态
  // 'user' 是这个状态的唯一 key
  // () => null 是状态的初始值工厂函数
  const user = useState('user', () => null)

  /**
   * 模拟用户登录
   * @param username - 登录的用户名
   */
  const login = (username: string) => {
    // 在实际应用中，这里会调用 API 进行验证
    // 成功后，将用户信息存入状态
    user.value = { username }
    console.log('用户已登录:', user.value)
  }

  /**
   * 模拟用户登出
   */
  const logout = () => {
    // 将 user 状态重置为 null
    user.value = null
    console.log('用户已登出')
  }

  return {
    user,
    login,
    logout,
  }
}