
// 这是一个定义服务器 API 路由的文件
// 当你访问 /api/hello 时，服务器会返回一个 JSON 对象
export default defineEventHandler((event) => {
  return {
    api: '你好，来自 API 路由！'
  }
})