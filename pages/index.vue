<template>
  <div>
    <h1>首页</h1>
    <button @click="fetchApiData">请求 /api/hello</button>
    <p v-if="apiData">API 返回的数据: {{ apiData }}</p>
    <NuxtLink to="/about">去关于页面</NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const apiData = ref(null)

const fetchApiData = async () => {
  try {
    const data = await $fetch('/api/hello')
    apiData.value = data
  } catch (error) {
    console.error('请求 API 出错:', error)
    apiData.value = { error: '加载失败' }
  }
}
</script>