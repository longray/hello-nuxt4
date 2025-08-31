import { defineStore } from 'pinia'

// 使用 defineStore 定义一个 store
// 第一个参数是 store 的唯一 ID，Pinia 用它来连接 store 和 devtools
// 第二个参数是一个对象，包含 state, getters, 和 actions
export const useCounterStore = defineStore('counter', {
  // state 是一个函数，返回一个初始状态对象
  // 这样做可以确保每个 store 实例都有自己独立的状态
  state: () => ({
    count: 0,
  }),

  // getters 就像是 store 的计算属性
  // 它们可以访问 state 和其他 getters
  getters: {
    // 一个简单的 getter，返回 count 的两倍
    doubleCount: (state) => state.count * 2,
  },

  // actions 是可以修改 state 的方法
  // 它们可以是异步的，可以包含任意复杂的业务逻辑
  actions: {
    // 增加 count 的值
    increment() {
      this.count++
    },
    // 减少 count 的值
    decrement() {
      this.count--
    },

    // 一个用于在服务端初始化的 action
    async init() {
      // 模拟一个异步操作，例如从 API 获取初始值
      await new Promise(resolve => setTimeout(resolve, 100));
      const initialValue = 100;
      this.count = initialValue;
    }
  },
})