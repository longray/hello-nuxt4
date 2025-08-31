-- 用户信息表: 存储用户的基本信息、偏好和目标
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 用户唯一标识
    name TEXT NOT NULL, -- 用户名
    preferences TEXT, -- 存储用户偏好，格式为 JSON 字符串
    goals TEXT, -- 存储用户目标，格式为 JSON 字符串
    challenges TEXT -- 存储用户面临的挑战，格式为 JSON 字符串
);

-- 项目信息表: 存储当前项目的核心配置与状态
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 项目唯一标识
    name TEXT NOT NULL, -- 项目名称
    render_mode TEXT, -- 渲染模式
    state_management TEXT, -- 状态管理库
    ui_framework TEXT, -- UI 框架
    modules TEXT, -- 项目启用的模块，格式为 JSON 字符串
    optimization_focus TEXT, -- 优化方向，格式为 JSON 字符串
    known_issues TEXT -- 已知问题列表，格式为 JSON 字符串
);

-- 问题经验库表: 核心的经验库
CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY, -- 问题唯一ID
    example TEXT, -- 所属示例或项目
    context TEXT, -- 问题发生的背景与上下文
    problem TEXT, -- 问题的具体描述
    cause TEXT, -- 问题根源分析
    solution TEXT, -- 解决方案的文字描述
    code TEXT, -- 关键的修复代码片段
    verified BOOLEAN DEFAULT FALSE, -- 是否经过用户验证
    last_updated DATE -- 最后更新日期
);

-- 问题标签关联表 (多对多)
CREATE TABLE IF NOT EXISTS issue_tags (
    issue_id TEXT, -- 对应 issues 表的 id
    tag TEXT, -- 标签名
    PRIMARY KEY (issue_id, tag), -- 复合主键
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE -- 外键关联，并级联删除
);

-- 问题来源关联表 (多对多)
CREATE TABLE IF NOT EXISTS issue_sources (
    issue_id TEXT, -- 对应 issues 表的 id
    source TEXT, -- 来源描述或链接
    PRIMARY KEY (issue_id, source), -- 复合主键
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE -- 外键关联，并级联删除
);