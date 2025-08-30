<template>
  <div>
    <h1>欢迎来到 Nuxt 自动导入的世界！</h1>
    <p>下面的按钮就是一个自动导入的组件，你不需要在任何地方手动注册它。</p>
    <MyButton />
    <hr>
    <p>下面这个函数也是自动导入的，它来自 `composables` 目录。</p>
    <button @click="showGreeting">打个招呼</button>
  </div>
</template>

<script setup>
const showGreeting = () => {
  const greeting = useGreeting('老板');
  alert(greeting);
}
</script>

<style>
body {
  font-family: sans-serif;
  padding: 2rem;
  background-color: #f4f4f9;
}
h1 {
  color: #333;
}
hr {
  margin: 2rem 0;
}
</style>