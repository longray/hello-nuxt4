// file: server/api/hello.ts

/**
 * @description 定义一个事件处理器，用于处理对 /api/hello 的请求。
 *
 * defineEventHandler 是 Nitro 提供的核心函数，
 * 用于创建一个标准的、与服务器环境无关的请求处理器。
 *
 * @param {object} event - H3 事件对象，包含了请求的详细信息。
 *                         虽然我们在这个简单的示例中没有使用它，
 *                         但它是所有事件处理器的第一个参数。
 * @returns {object} 返回一个 JSON 对象，这将作为 API 的响应体。
 */
export default defineEventHandler((event) => {
  // 返回一个包含问候消息和时间戳的 JSON 对象
  return {
    message: 'Hello from the API!',
    timestamp: new Date().toISOString(),
  }
})
