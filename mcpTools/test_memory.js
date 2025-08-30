import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import path from "node:path";
const memoryPath = path.resolve("./ai_memory/agent.json");

async function main() {
    const transport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-memory"],
        env: {
            MEMORY_FILE_PATH: memoryPath
        }
    });

    const client = new Client(
        { name: "TestClient", version: "1.0.0" },
        { capabilities: {} }
    );

    await client.connect(transport);
    console.log("✅ 已连接到 Memory 服务");

    const toolResult = await client.listTools();
    console.log("🛠 可用工具:", toolResult.tools.map(t => t.name));

    const createToolName = toolResult.tools.find(t => t.name === "create_entities")?.name;
    const readGraphToolName = toolResult.tools.find(t => t.name === "read_graph")?.name;

    if (!createToolName || !readGraphToolName) {
        console.error("❌ 未找到 create_entities 或 read_graph 工具，请检查 Memory 服务");
        await client.close();
        return;
    }

    // 写入一条测试记忆
    console.log(`📌 正在调用 ${createToolName} 写入记忆...`);
    const addResult = await client.callTool({
        name: createToolName,
        arguments: {
            entities: [
                {
                    entityType: "架构偏好",
                    name: "向阳的项目结构偏好",
                    observations: [
                        { type: "text", value: "所有代码都应放在 app 文件夹下，而不是根目录。" }
                    ]
                }
            ]
        }
    });
    console.log("✅ 写入结果:", JSON.stringify(addResult, null, 2));

    // 读取全部记忆
    console.log(`📖 正在调用 ${readGraphToolName} 获取全部记忆...`);
    const listResult = await client.callTool({
        name: readGraphToolName,
        arguments: {}
    });
    console.log("📖 当前记忆数据:", JSON.stringify(listResult, null, 2));

    await client.close();
}

main().catch(err => {
    console.error("❌ 测试失败:", err);
});
