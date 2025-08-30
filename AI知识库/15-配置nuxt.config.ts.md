# Nuxt4 配置 (nuxt.config.ts)：应用的“总控制室”

如果说你的 Nuxt 应用是一艘功能强大的星际飞船，那么 `nuxt.config.ts` 文件就是这艘飞船的“舰桥”或“总控制室”。你在这里按下的每一个按钮、输入的每一条指令，都将决定飞船的航向、装备和行为。

## 什么是 `nuxt.config.ts`？

它是你 Nuxt 项目的中央配置文件，是你与 Nuxt 框架沟通的主要渠道。几乎所有关于项目的定制化配置，从注册模块、添加全局 CSS，到定义环境变量，都在这里完成。

Nuxt 推荐使用 TypeScript (`.ts`) 来编写配置文件，因为通过 `defineNuxtConfig` 辅助函数，你可以获得完美的类型提示和自动补全，就像有位智能副官在你旁边指导一样，再也不怕配错了！

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 在这里配置你的应用
})
```

## 核心配置选项一览

这里是“总控制室”里一些最常用、最重要的控制台：

### 1. `app` - 全局应用配置

在这里配置会应用到每个页面的 `<head>` 信息，是设置全局 SEO 默认值的好地方。

```typescript
app: {
  head: {
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
    title: '我的神奇 Nuxt 飞船',
    meta: [
      { name: 'description', content: '一艘用 Nuxt4 打造的星际飞船' }
    ],
  }
}
```

### 2. `modules` - 加装“武器”与“装备”

Nuxt 的模块生态是其强大功能的核心。想给飞船加装“UI 引擎”（如 Nuxt UI）、“图像优化引擎”（Nuxt Image）或“状态管理引擎”（Pinia）？在这里登记一下即可。

```typescript
modules: [
  '@nuxt/ui',
  '@nuxt/image',
  '@pinia/nuxt',
]
```

### 3. `css` - 统一“着装”

需要引入全局的 CSS 文件，比如一个 `main.css` 来统一所有页面的基础样式？在这里声明它的路径。

```typescript
css: ['@/assets/css/main.css']
```

### 4. `runtimeConfig` - “机密信使”

当你的应用需要连接后端，或者使用一些敏感的 API 密钥时，`runtimeConfig` 就派上用场了。它允许你安全地定义环境变量，并控制它们是只在服务端可用，还是可以暴露给客户端。

```typescript
runtimeConfig: {
  // 只在服务端可用的私密密钥
  apiSecret: 'my-secret-key',
  // public 对象中的内容会暴露给客户端
  public: {
    apiBase: '/api'
  }
}
```

### 5. `vite` - “引擎改装”

Nuxt4 底层使用 Vite 作为构建工具。如果你需要对 Vite 进行更深度的定制，比如添加一个特殊的 Vite 插件，可以在这里操作。

```typescript
vite: {
  plugins: [
    // 添加你的 Vite 插件
  ]
}
```

---

`nuxt.config.ts` 是你作为“舰长”指挥 Nuxt 应用的权力中心。熟悉并掌握它，你就能随心所欲地定制和扩展你的应用，让它完全按照你的意图去航行。现在，开始探索你的“总控制室”吧！