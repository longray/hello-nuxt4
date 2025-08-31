# 项目规则

## 项目概述与适用范围
- **项目目标** 通过重写与扩展 Nuxt4 官方与社区示例，系统提升工程实践与架构理解，形成可复用的经验库与稳定的协作流程。
- **适用范围** 本规则适用于“Nuxt4 示例重写与技能提升”项目中的全部对话、编码、排错、文档与沉淀活动。

## 目录结构与文件约定
- **项目目录结构** 目录与命名严格遵循 Nuxt 官方标准目录结构与约定（不额外创建自定义 `code/` 子目录）。核心结构包括：
    - `nuxt.config.ts`（项目配置）、`app.config.ts`（应用元配置）、`app.vue`（应用根组件）、`error.vue`（错误页）
    - `pages/`（基于文件的路由）、`layouts/`（布局）、`components/`（组件）、`composables/`（可复用逻辑）
    - `plugins/`（运行时插件）、`middleware/`（路由中间件）
    - `server/api/`（API 路由）、`server/routes/`（自定义服务端路由）、`server/plugins/`（Nitro 插件）
    - `assets/`（需经构建处理的静态资源）、`public/`（原样拷贝的静态资源）
    - 可选：`content/`（若使用 @nuxt/content）、`types/`（类型声明）、`tests/`（测试）、`docs/`（项目说明）
