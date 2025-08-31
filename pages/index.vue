<script setup lang="ts">
const { data: articles } = await useAsyncData(() => queryCollection('content').all())
  // console.log(articles.value)
</script>

<template>
  <div>
    <h1>文章列表</h1>
    <ul>
      <li v-for="article in articles" :key="article.path">
        <NuxtLink :to="article.path">{{ article.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
