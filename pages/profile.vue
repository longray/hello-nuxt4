<template>
  <div>
    <!-- v-if 用来确保在 user 对象存在时才渲染欢迎信息 -->
    <h1 v-if="user">欢迎，{{ user.username }}！</h1>
    <p>这里是您的个人资料页面。</p>
    <button @click="handleLogout">登出</button>
  </div>
</template>

<script setup lang="ts">
// 通过 definePageMeta 指定该页面需要使用 'auth' 中间件
// 这是一个编译时宏，会自动处理
definePageMeta({
  middleware: 'auth',
})

// 从 composables 中导入 useAuth
const { user, logout } = useAuth()
// 导入 Nuxt 的导航工具
const router = useRouter()

/**
 * 处理登出按钮点击事件
 */
const handleLogout = () => {
  // 调用 logout 方法清空用户状态
  logout()

  // 登出后，跳转回登录页面
  router.push('/login')
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