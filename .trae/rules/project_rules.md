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


## 规则 1：新示例“清盘”规则
---

## 规则 1：新示例“清盘”规则

**一句话原则**：只删代码，不碰基建。

**执行时机**: 当我理解您要开始一个新示例时，此规则将自动触发。

**核心操作**:

1.  **识别目标**: 精准识别并列出所有**业务代码**目录，包括：
    - `components/`
    - `composables/`
    - `layouts/`
    - `middleware/`
    - `pages/`
    - `plugins/`
    - `server/`
    - `stores/`

2.  **彻底删除**: 调用操作系统原生命令，对上述目录执行“斩草除根”式删除，确保文件夹及其所有内容被完全移除。
    - **执行方式**: 使用 `Remove-Item -Recurse -Force` (Windows) 或 `rm -rf` (Linux/macOS) 命令。

3.  **严格保留**: 以下**项目基建**目录和文件**必须保留**，不受任何影响：
    - **框架相关**: `.nuxt/`, `node_modules/`, `pnpm-lock.yaml`
    - **静态资源**: `assets/`, `public/`
    - **项目配置**: `nuxt.config.ts`, `package.json`, 等所有配置文件。
    - **项目管理**: `.git/`, `.ai_memory/`, 等所有隐藏的管理目录。

**最终目标**: 每次清盘后，项目恢复到一个仅包含“基础设施”的纯净状态，为新示例的开发扫清障碍。