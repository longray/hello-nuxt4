<template>
  <p>{{ $route.params.group }}</p>
</template>
<script setup lang="ts">
const route = useRoute()
if (route.params.group === 'admins' && "0" === route.params.id) {
  console.log('Warning! Make sure user is authenticated!')
}
</script>
