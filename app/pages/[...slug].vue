<template>
  <p>{{ $route.params.slug }}</p>
</template>
<script setup lang="ts">
definePageMeta({
  title: '我是被定义的元数据：title'
})

const route = useRoute()

console.log(route.meta.title) // My home page
</script>
