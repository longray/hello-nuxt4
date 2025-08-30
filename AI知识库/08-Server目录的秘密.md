# Nuxt4 Server 目录：你的“秘密后端厨房”

到目前为止，我们讨论的大多是 Nuxt 在“前台”——也就是浏览器中的表现。但 Nuxt 的野心远不止于此，它想让你成为一名“全栈大厨”！而 `server/` 目录，就是 Nuxt 为你精心打造的、功能完备的“秘密后端厨房”。在这里，你可以烹饪出属于你自己的 API 大餐，而无需启动另一个后端服务。

## `server/` 厨房重地，闲人免进

*   **比喻：** 如果你的 Nuxt 应用是一个生意火爆的餐厅，`pages/`、`components/` 这些就是你精心布置的、面向顾客的“前厅”。而 `server/` 目录，则是你的“后厨”。顾客（浏览器）不能直接闯进来，但他们可以通过“服务员”（`$fetch` 或 `useFetch`）来点单，然后由后厨的你来准备菜品（处理请求、返回数据）。

*   **工作原理：** `server/` 目录下的所有文件，都不会被打包到你的前端代码中。它们运行在一个由 Nuxt 提供的、名为 [Nitro](https://nitro.unjs.io/) 的高性能服务器引擎上。这意味着你可以在这里安全地使用服务器端专属的代码，比如连接数据库、使用私密 API 密钥等，完全不用担心会泄露到客户端。

## 厨房里的“黄金区域”

`server/` 厨房里有几个核心的功能区，各司其职：

### 1. `server/api/` - 菜品研发中心 (API Routes)

这是你定义 API 接口的地方。你在这里创建的每个文件，都会自动映射成一个 API 路由。

*   **创建一道菜（一个 API 端点）：**

    在 `server/api/` 下创建一个文件，比如 `hello.ts`：

    ```typescript
    // server/api/hello.ts
    export default defineEventHandler((event) => {
      // event 对象包含了请求的所有信息
      return {
        message: '你好，来自我的秘密厨房！'
      }
    })
    ```

*   **点这道菜：**

    现在，你就可以在你的任何页面或组件中，通过访问 `/api/hello` 来获取这个数据了。

    ```vue
    <script setup>
    const { data } = await useFetch('/api/hello')
    </script>
    <template>
      <p>{{ data.message }}</p> <!-- 显示：你好，来自我的秘密厨房！ -->
    </template>
    ```

    你还可以在 API 路由中处理不同的 HTTP 方法（GET, POST, PUT, DELETE），读取请求体、查询参数等等，就像使用 Express 或 Koa 一样。

### 2. `server/routes/` - 固定套餐区 (Server Routes)

这个目录和 `api/` 很像，但它通常用于创建非 JSON 的响应，比如直接返回一个 HTML 页面、一个 XML 文件（用于 RSS feed），或者重定向到一个新的地址。

    ```typescript
    // server/routes/legacy-page.ts
    export default defineEventHandler((event) => {
      // 将所有访问 /legacy-page 的请求重定向到首页
      return sendRedirect(event, '/', 301) 
    })
    ```

### 3. `server/middleware/` - 传菜通道质检员 (Server Middleware)

这里的中间件会在每一个服务器请求（包括页面请求和 API 请求）到达你的“厨房”之前运行。你可以用它来做一些全局的事情。

*   **比喻：** 就像是传菜通道上的“质检员”，每一道菜（请求）都要经过他的检查。

*   **用途：**
    *   记录请求日志。
    *   进行身份验证，检查用户是否登录。
    *   给请求添加一些额外的信息。

    ```typescript
    // server/middleware/logger.ts
    export default defineEventHandler((event) => {
      console.log('新的请求: ' + event.node.req.url)
    })
    ```

---

`server/` 目录是 Nuxt 全栈能力的集中体现。它让你能够用同一种语言（TypeScript/JavaScript）、在同一个项目中，无缝地完成前后端的开发工作，极大地提升了开发效率和体验。现在，你是不是已经迫不及待想去你的“秘密厨房”里大展身手了呢？