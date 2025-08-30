# Nuxt4 应用安全：为你的“星际飞船”加装护盾

我们的 Nuxt “星际飞船”不仅要飞得快、飞得远，更要飞得稳、飞得安全。在浩瀚的互联网宇宙中，充满了各种潜在的威胁，比如“宇宙海盗”（黑客）的攻击。因此，为我们的飞船加装坚不可摧的“能量护盾”至关重要。

## 1. 核心机密隔离：运行时配置 (Runtime Config)

**比喻：** 这就像飞船的“舰长保险箱”。

你绝对不想把连接数据库的密码、API 的私钥这类核心机密直接写在代码里，那样太容易被窃取了。Nuxt 的 `runtimeConfig` 就是这个保险箱。

*   `runtimeConfig`: 这里的配置在服务端和客户端都可以访问，但只能在服务端通过环境变量覆盖。
*   `runtimeConfig.public`: 这里的配置在两端都可以访问，并且可以在客户端通过环境变量覆盖（适合存放不敏感的公开密钥）。

**操作方法：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 这个私钥只在服务端可用
    apiSecret: '123', 
    // public 中的配置会暴露给客户端
    public: {
      apiBase: '/api' 
    }
  }
})
```

**在服务端 API 中使用：**

```typescript
// server/api/secret.ts
export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  // 只能在服务端安全地访问 apiSecret
  return { aipSecret: config.apiSecret }
})
```

**关键：** 真正的私钥要通过 `.env` 文件来管理，并加入到 `.gitignore` 中，避免上传到代码仓库。

```.env
# 这个值会在构建时覆盖 nuxt.config.ts 中的默认值
NUXT_API_SECRET=super-secret-key-from-server
```

## 2. 防御“注入攻击”：XSS 防护

**比喻：** 防止“宇宙海盗”在你的飞船广播系统里插播恶意广告。

跨站脚本攻击 (XSS) 是指攻击者将恶意脚本注入到你的网页中。幸运的是，Vue 和 Nuxt 默认就为我们开启了强大的护盾。无论是使用双大括号 `{{ }}` 插值，还是 `v-bind`，所有内容都会被自动转义。这意味着 `<script>alert('hack')</script>` 会被渲染成纯文本，而不会执行。

**你需要警惕的：** `v-html` 指令。它就像一个“紧急舱门”，允许你直接渲染 HTML。除非你完全信任内容的来源，或者已经对内容进行了严格的“消毒”（比如使用 `DOMPurify` 这样的库），否则绝对不要使用它。

## 3. 跨域资源共享：CORS 策略

**比喻：** 设置飞船的“访客白名单”。

当你的前端应用和后端 API 不在同一个“星球”（域名）上时，浏览器的安全策略会阻止它们之间的通信。我们需要在服务端明确设置 CORS (Cross-Origin Resource Sharing) 策略，告诉浏览器：“嘿，来自 `https://my-awesome-frontend.com` 的请求是自己人，请放行！”

**操作方法：** 在 `server/` 目录下的 API 或中间件中配置响应头。

```typescript
// server/middleware/cors.ts
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Origin": "*", // 生产环境建议指定具体的域名
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "*"
  });
  if(getMethod(event) === 'OPTIONS'){
    event.res.statusCode = 204
    event.res.statusMessage = "No Content."
    return ''
  }
})
```

Nuxt 也提供了更强大的 `nuxt-security` 模块来简化这些配置。

## 4. 其他重要的“护盾”

*   **CSRF 防护 (Cross-Site Request Forgery):** 如果你的应用有用户会话和表单提交（特别是传统的非 AJAX 表单），需要注意防范 CSRF 攻击。通常通过在表单中加入一个随机的、一次性的 token 来实现。对于主要依赖 `useFetch` 的现代 Nuxt 应用，风险相对较低，但仍需保持警惕。
*   **安全响应头 (Security Headers):** 使用 `nuxt-security` 模块可以轻松地为你的应用添加一系列推荐的安全头部，如 `Content-Security-Policy`, `X-Content-Type-Options` 等，它们能抵御多种类型的攻击。

---

安全是一个持续的过程，而不是一次性的任务。通过理解并实践这些核心的安全概念，我们的 Nuxt “飞船”就能在复杂的网络宇宙中，更有信心地抵御风暴，保护我们的应用和用户数据安全。现在，安全区的灯塔已被点亮！接下来，我们将向着最后一站——**测试 (Testing)** 进发！