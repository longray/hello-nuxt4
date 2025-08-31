<script setup lang="ts">
// 这是一个“同构”的 fetch 请求，它在服务端和客户端都会执行。
// 1. 服务端渲染 (SSR) 期间：在服务器上执行，获取数据并直接渲染到 HTML 中。
// 2. 客户端导航期间：在浏览器中执行，通过 API 请求获取数据。
const { data: hitokoto, error, pending } = useFetch('/api/post', {
  server: false,
  key: 'hitokoto-ssr',
  // lazy: true 告诉 Nuxt 在后台获取数据，不要阻塞页面渲染
  lazy: true,
  // default 会在 lazy 加载完成前，作为初始数据显示
  default: () => ({ hitokoto: '正在获取今日一言...' })
});

// 如果在服务端或客户端获取数据时发生错误，Nuxt 会自动处理并显示错误页面。
// 我们也可以在这里添加自定义的错误处理逻辑。
if (error.value) {
  console.error("获取一言失败:", error.value);
}
</script>

<template>
  <div>
    <h1>服务端渲染 (SSR) - 国内 API</h1>
    <p>这句话来自 <a href="https://hitokoto.cn/" target="_blank">一言 (Hitokoto)</a>，由我们的 Nuxt 服务器在渲染页面时直接获取。</p>
    
    <div v-if="pending && !hitokoto.hitokoto">
      <p>加载中...</p>
    </div>

    <div v-else-if="error">
      <h2 style="color: red;">加载一言时出错</h2>
      <pre>{{ error }}</pre>
    </div>

    <figure v-else-if="hitokoto">
      <blockquote :cite="`https://hitokoto.cn/?uuid=${hitokoto.uuid}`">
        <p><strong>{{ hitokoto.hitokoto }}</strong></p>
      </blockquote>
      <figcaption>—— {{ hitokoto.from_who || '无名氏' }} <cite>《{{ hitokoto.from }}》</cite></figcaption>
    </figure>

  </div>
</template>

<style scoped>
blockquote {
  border-left: 5px solid #eee;
  padding-left: 1em;
  margin-left: 0;
  font-style: italic;
}

figcaption {
  text-align: right;
  color: #555;
}
</style>