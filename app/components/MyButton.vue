<template>
  <button @click="handleClick" class="my-special-button">
    点我！(这是一个自动导入的组件)
  </button>
</template>

<script setup>
const handleClick = () => {
  alert('按钮被点击了！我是来自 components 目录的 MyButton 组件！');
}
</script>

<style scoped>
.my-special-button {
  background-color: #00DC82;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: transform 0.2s;
}
.my-special-button:hover {
  transform: scale(1.05);
}
</style>