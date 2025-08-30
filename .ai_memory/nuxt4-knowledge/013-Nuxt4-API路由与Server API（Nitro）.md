# Nuxt4 API 路由与 Server API（Nitro）
标签: Nuxt4, API, Nitro, 服务端

## 问题描述
在构建全栈应用时，我们需要实现服务端 API 来处理数据库操作、身份验证、文件上传等功能。Nuxt4 的 Nitro 引擎如何帮助我们构建高性能、类型安全的 API 接口？如何正确组织和管理这些 API 路由？

## 解决方案
Nuxt4 使用 Nitro 作为其服务器引擎，它提供了一种简单而强大的方式来创建 API 路由。你可以在 `server/` 目录下创建 API 处理程序，Nitro 会自动为它们创建对应的路由。

### 基础 API 路由
在 `server/api/` 目录下创建文件，文件路径会自动映射为 API 路由。

#### 简单的 GET 接口
`server/api/hello.ts`:
```typescript
export default defineEventHandler((event) => {
  return {
    message: '你好，世界！',
    time: new Date().toLocaleString()
  }
})
```
这个接口可以通过 `GET /api/hello` 访问。

#### 处理查询参数
`server/api/greet.ts`:
```typescript
export default defineEventHandler((event) => {
  // 获取查询参数
  const query = getQuery(event)
  const name = query.name || '访客'
  
  return {
    message: `你好，${name}！`
  }
})
```

#### POST 请求处理
`server/api/users.post.ts`:
```typescript
export default defineEventHandler(async (event) => {
  // 获取请求体
  const body = await readBody(event)
  
  // 验证请求数据
  if (!body.username || !body.email) {
    throw createError({
      statusCode: 400,
      message: '用户名和邮箱是必需的'
    })
  }
  
  // 处理业务逻辑（这里是示例）
  const user = {
    id: Date.now(),
    username: body.username,
    email: body.email,
    createdAt: new Date()
  }
  
  return user
})
```

### 高级功能

#### 中间件
`server/middleware/auth.ts`:
```typescript
export default defineEventHandler((event) => {
  const token = getHeader(event, 'authorization')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: '未授权的访问'
    })
  }
  
  // 在事件上下文中存储用户信息
  event.context.user = { id: 1, role: 'admin' }
})
```

#### 错误处理
`server/utils/errors.ts`:
```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function handleError(error: Error) {
  if (error instanceof ValidationError) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }
  
  // 记录未知错误
  console.error('未捕获的错误:', error)
  throw createError({
    statusCode: 500,
    message: '服务器内部错误'
  })
}
```

## 示例代码

### 示例 1: RESTful API 实现

```typescript
// server/api/todos/[id].ts
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = event.context.params.id
  
  try {
    switch (method) {
      case 'GET':
        const todo = await db.todos.findUnique({ where: { id } })
        if (!todo) {
          throw createError({
            statusCode: 404,
            message: '待办事项未找到'
          })
        }
        return todo
        
      case 'PUT':
        const updateData = await readBody(event)
        return await db.todos.update({
          where: { id },
          data: updateData
        })
        
      case 'DELETE':
        await db.todos.delete({ where: { id } })
        return { message: '删除成功' }
        
      default:
        throw createError({
          statusCode: 405,
          message: '不支持的请求方法'
        })
    }
  } catch (error) {
    handleError(error)
  }
})
```

### 示例 2: 文件上传处理

```typescript
// server/api/upload.post.ts
import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event)
    
    if (!files?.length) {
      throw new ValidationError('没有找到上传的文件')
    }
    
    const results = await Promise.all(
      files.map(async (file) => {
        const fileName = `${Date.now()}-${file.filename}`
        const filePath = join('public', 'uploads', fileName)
        
        await writeFile(filePath, file.data)
        
        return {
          originalName: file.filename,
          fileName,
          path: `/uploads/${fileName}`,
          size: file.data.length
        }
      })
    )
    
    return {
      message: '文件上传成功',
      files: results
    }
  } catch (error) {
    handleError(error)
  }
})
```

### 示例 3: API 缓存实现

```typescript
// server/utils/cache.ts
import { createStorage } from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'

const storage = createStorage({
  driver: memoryDriver()
})

export async function cachedEventHandler(
  event: any,
  handler: Function,
  options: { ttl?: number; key?: string } = {}
) {
  const key = options.key || event.path
  const ttl = options.ttl || 60 // 默认缓存 60 秒
  
  // 尝试从缓存获取
  const cached = await storage.getItem(key)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // 执行处理程序
  const result = await handler(event)
  
  // 存入缓存
  await storage.setItem(key, JSON.stringify(result), { ttl: ttl * 1000 })
  
  return result
}

// server/api/weather.get.ts
export default defineEventHandler((event) => {
  return cachedEventHandler(
    event,
    async () => {
      // 假设这是一个耗时的天气 API 调用
      const weather = await fetchWeatherData()
      return weather
    },
    { ttl: 300 } // 缓存 5 分钟
  )
})
```

## 常见坑点与注意事项

### API 设计注意事项
-   **路由命名**: 使用清晰的命名约定，例如 `users.get.ts`、`users.post.ts` 来区分不同的 HTTP 方法。
-   **错误处理**: 统一错误响应格式，使用 `createError` 函数来创建标准的错误响应。
-   **参数验证**: 在处理请求之前验证所有输入参数，避免安全漏洞。
-   **响应格式**: 保持一致的响应格式，便于前端处理。

### 性能优化
-   **缓存策略**: 对于不经常变化的数据，使用适当的缓存机制。
-   **数据库连接**: 正确管理数据库连接，避免连接泄漏。
-   **大文件处理**: 使用流式处理来处理大文件上传和下载。

### 安全性
-   **CORS**: 正确配置跨域资源共享策略。
-   **输入净化**: 清理和验证所有用户输入。
-   **认证授权**: 实现适当的身份验证和授权机制。

### 开发调试
-   **日志记录**: 使用适当的日志级别记录关键操作。
-   **开发工具**: 利用 Nuxt Devtools 调试 API 请求。
-   **测试**: 编写单元测试和集成测试确保 API 的可靠性。

## 参考链接
-   [Nuxt4 官方文档 - Server API](https://nuxt.com/docs/guide/directory-structure/server)
-   [Nitro 文档](https://nitro.unjs.io/)
-   [H3 文档](https://github.com/unjs/h3)