# 项目规则

## 项目概述与适用范围
- **项目目标** 通过重写与扩展 Nuxt4 官方与社区示例，系统提升工程实践与架构理解，形成可复用的经验库与稳定的协作流程。
- **适用范围** 本规则适用于“Nuxt4 示例重写与技能提升”项目中的全部对话、编码、排错、文档与沉淀活动。
- **遵循文件** 回答需同时遵循用户偏好与交互规范。

---

## 目录结构与文件约定
- **根目录** `.ai_memory/` 存放提示词、记忆、任务与知识库等工程化产物。
- **提示词文件** `prompt.md` 仅用于角色设定与总纲，具体执行规则以本文件为准。
- **长期记忆** `memory.db` 存放用户与项目上下文与经验库 `issues` 的 SQLite 数据库，用于回答时的优先引用。
- **任务清单** `task.md` 记录当前任务的 TODO、进度与结果，必须在执行前后同步更新。
- **知识库** `nuxt4-knowledge/` 已建设完毕，包含各主题最佳实践与示例代码，回答时需引用。
- **项目目录结构** 目录与命名严格遵循 Nuxt 官方标准目录结构与约定（不额外创建自定义 `code/` 子目录）。核心结构包括：
    - `nuxt.config.ts`（项目配置）、`app.config.ts`（应用元配置）、`app.vue`（应用根组件）、`error.vue`（错误页）
    - `pages/`（基于文件的路由）、`layouts/`（布局）、`components/`（组件）、`composables/`（可复用逻辑）
    - `plugins/`（运行时插件）、`middleware/`（路由中间件）
    - `server/api/`（API 路由）、`server/routes/`（自定义服务端路由）、`server/plugins/`（Nitro 插件）
    - `assets/`（需经构建处理的静态资源）、`public/`（原样拷贝的静态资源）
    - 可选：`content/`（若使用 @nuxt/content）、`types/`（类型声明）、`tests/`（测试）、`docs/`（项目说明）


---

## 检索与引用优先级 必须遵循
- **优先级 1** 使用 `.ai_memory/memory.db` 数据库中 `issues` 表里标记为 `verified: true` 的已验证经验作为主方案依据。
- **优先级 2** 使用 `nuxt4-knowledge/` 的最佳实践与示例代码进行补充与校验。
- **优先级 3** 查阅 Nuxt 官方文档以对齐最新版 API 与约定，并核对边界与差异。
- **优先级 4** 参考高信誉来源（GitHub、StackOverflow 等）进行交叉复核与风险识别。
- **引用要求** 回答需列出采用方案、备选方案、取舍理由与可能副作用，并标注本地路径或外部链接。

---

## 验证与交付标准
- **运行步骤** 提供可直接运行的步骤与环境要求（依赖安装、脚本命令、Node 版本、配置要点）。
- **最小复现** 提供最小可复现结构或关键文件片段，避免无关大段代码，突出触发点与解决点。
- **预防守则** 给出易错点的预防性守则（如 SSR 状态访问时机、数据获取钩子、同构限制）。
- **实验特性** 如依赖实验性特性，必须明确标注并给出稳定替代方案与回退策略。

---

## 回答模板 建议遵循
1. **问题概述** Issue Overview
2. **诊断与定位** Diagnosis
3. **方案与权衡** Solution & Trade-offs
4. **代码与注释** Code with Comments
5. **验证步骤** Validation Steps
6. **经验沉淀与复用** Knowledge Capture（issueId、是否已更新到 memory.db）
7. **参考资料** References（本地路径 + 官网链接 + 外部链接）

---

## 问题与经验记录规范
- **记录时机** 一旦出现错误、异常、非预期行为或架构性取舍，需立即记录草稿条目并在验证后更新。
- **字段要求** 每条 `issue` 及其关联信息遵循以下数据库表结构，便于检索与复用：
```sql
-- 用户信息表: 存储用户的基本信息、偏好和目标
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 用户唯一标识
    name TEXT NOT NULL, -- 用户名
    preferences TEXT, -- 存储用户偏好，格式为 JSON 字符串，例如：'["结构化输出", "任务驱动"]'
    goals TEXT, -- 存储用户目标，格式为 JSON 字符串，例如：'{"短期": "...", "长期": "..."}'
    challenges TEXT -- 存储用户面临的挑战，格式为 JSON 字符串，例如：'["确保 AI 严格执行 TODO List"]'
);

-- 项目信息表: 存储当前项目的核心配置与状态
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 项目唯一标识
    name TEXT NOT NULL, -- 项目名称
    render_mode TEXT, -- 渲染模式，例如：'SSR + ISR 混合'
    state_management TEXT, -- 状态管理库，例如：'Pinia'
    ui_framework TEXT, -- UI 框架，例如：'Tailwind CSS'
    modules TEXT, -- 项目启用的模块，格式为 JSON 字符串，例如：'["auth", "dashboard"]'
    optimization_focus TEXT, -- 优化方向，格式为 JSON 字符串，例如：'["组件懒加载"]'
    known_issues TEXT -- 已知问题列表，格式为 JSON 字符串，例如：'["SSR 页面首次加载失败"]'
);

-- 问题经验库表: 核心的经验库，记录遇到的问题与解决方案
CREATE TABLE issues (
    id TEXT PRIMARY KEY, -- 问题唯一ID，例如：'ex-001'
    example TEXT, -- 所属示例或项目，例如：'nuxt-official-blog-rewrite'
    context TEXT, -- 问题发生的背景与上下文
    problem TEXT, -- 问题的具体描述
    cause TEXT, -- 问题根源分析
    solution TEXT, -- 解决方案的文字描述
    code TEXT, -- 关键的修复代码片段
    verified BOOLEAN DEFAULT FALSE, -- 该解决方案是否经过用户验证，默认为 false
    last_updated DATE -- 最后更新日期
);

-- 问题标签关联表 (多对多): 用于为 issues 打上多个标签
CREATE TABLE issue_tags (
    issue_id TEXT, -- 对应 issues 表的 id
    tag TEXT, -- 标签名
    PRIMARY KEY (issue_id, tag), -- 复合主键，确保唯一性
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE -- 外键关联，并级联删除
);

-- 问题来源关联表 (多对多): 用于记录 issues 的信息来源
CREATE TABLE issue_sources (
    issue_id TEXT, -- 对应 issues 表的 id
    source TEXT, -- 来源描述或链接
    PRIMARY KEY (issue_id, source), -- 复合主键，确保唯一性
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE -- 外键关联，并级联删除
);
```