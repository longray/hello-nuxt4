export default defineNuxtRouteMiddleware((to, from) => {
  console.log(`[路由日志] 从: ${from.fullPath} 到: ${to.fullPath}`)
})