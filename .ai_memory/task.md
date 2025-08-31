# ✅ 当前任务计划：状态管理 (State Management)

## 📌 任务列表
1.  ✅ **安装与配置 Pinia**: 安装 `@pinia/nuxt` 模块，并在 `nuxt.config.ts` 中进行配置。
    *   **结果与验证**: `package.json` 中已包含依赖，`nuxt.config.ts` 中已添加模块，应用正常启动。
2.  ✅ **创建第一个 Store**: 创建一个 `stores/counter.ts` 文件，定义一个管理计数器的 store，包含 state、getter 和 action。
    *   **结果与验证**: `stores/counter.ts` 文件已创建，包含 `state`, `getters`, `actions`，符合 Pinia 规范。
3.  ✅ **创建交互页面**: 创建 `pages/state.vue` 页面。
    *   **结果与验证**: `pages/state.vue` 已创建，并成功从 store 中读取状态和调用 actions。
4.  ✅ **验证基础功能**: 访问 `/state` 页面，验证核心功能。
    *   **结果与验证**: 页面正确显示初始值 `0`，按钮可正常增减，DevTools 可观察到变化。
5.  ✅ **探索 SSR 与状态**: 探索 Pinia 在服务端渲染（SSR）下的工作机制。
    *   **结果与验证**: 通过 `onServerPrefetch` 在服务端调用 action 将初始值设为 `100`，刷新页面直接显示 `100`，验证成功。
6.  ✅ **任务总结与沉淀**: 总结 Pinia 在 Nuxt 4 中的使用要点。
    *   **结果与验证**: 任务完成，知识点已总结。

## 🧾 状态更新机制
- 每完成一项任务，标记 ✅ 并简要总结“结果 + 验证方式 + 关联 issueId”
- 如发现遗漏任务，立即补充并编号
- 所有任务完成后，输出任务完成报告与“新增/更新的 issues 清单”