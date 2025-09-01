<script setup lang="ts">
// 使用 useAsyncData 来异步获取数据
// 'articles' 是一个唯一的 key，用于在服务端和客户端之间共享数据
// 第二个参数是异步函数，负责执行查询
const { data: articles, error } = await useAsyncData('articles-list', () => 
  // queryContent() - 查询 content/ 目录
  // .find() - 获取所有匹配的文档，返回一个数组
  queryCollection('content').all()
)

// 如果出现错误，可以在控制台打印出来方便调试
if (error.value) {
  console.error('获取文章列表失败:', error.value)
}
</script>

<template>
  <main>
    <h1>文章列表</h1>
    <!-- 确保 articles 数据存在且不为空 -->
    <ul v-if="articles && articles.length">
      <!-- 遍历文章数组 -->
      <li v-for="article in articles" :key="article._path">
        <!-- 使用 NuxtLink 实现客户端路由跳转 -->
        <NuxtLink :to="article._path">{{ article.title || article._path }}</NuxtLink>
      </li>
    </ul>
    <!-- 如果没有文章，显示提示信息 -->
    <p v-else>暂时没有文章。</p>
  </main>
</template>

<style scoped>
main {
  font-family: sans-serif;
  padding: 2rem;
}
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
  background-color: #f9f9f9;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
a {
  text-decoration: none;
  color: #2c3e50;
}
a:hover {
  color: #42b983;
  text-decoration: underline;
}
</style>