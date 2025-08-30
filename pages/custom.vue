
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Custom Layout Page</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-2">This page uses the "custom" layout, so it should not have a header or footer.</p>
    <nuxt-link to="/" class="text-blue-500 hover:underline mt-4 inline-block">Back to Home</nuxt-link>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'custom',
  });
</script>