<template>
  <div>
    <h1>登录页面</h1>
    <p>您需要登录后才能访问个人资料页面。</p>
    <button @click="handleLogin">模拟登录</button>
  </div>
</template>

<script setup lang="ts">
// 从 composables 中导入 useAuth
const { login } = useAuth()
// 导入 Nuxt 的导航工具
const router = useRouter()

/**
 * 处理登录按钮点击事件
 */
const handleLogin = () => {
  // 调用 login 方法，模拟用户名为 'test-user' 的用户登录
  login('test-user')

  // 登录成功后，使用 router.push 跳转到个人资料页面
  router.push('/profile')
}
</script>

<style scoped>
div {
  padding: 2rem;
  text-align: center;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>