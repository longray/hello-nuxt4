# Nuxt4 布局 (Layouts)：应用的“百变时装”

当你的应用逐渐复杂，你会发现很多页面都有着相似的结构，比如相同的页头、页脚或侧边栏。难道每个页面都要重复写一遍这些代码吗？当然不！Nuxt4 的布局 (Layouts) 系统，就是为了解决这个问题而生的“百变时装间”。

## 什么是布局？

*   **比喻：** 想象一下，你的页面内容（`pages/` 目录下的组件）就是“你”这个人。而布局，就是你为了适应不同场合而准备的“时装”。
    *   去上班，你穿上“工装”（`layouts/default.vue`），这套时装有标准的页头和页脚。
    *   去健身，你换上“运动装”（`layouts/custom.vue`），这套时装可能只有一个简单的头部，没有页脚，为你提供更大的活动空间。
    *   参加晚宴，你穿上“晚礼服”（`layouts/auth.vue`），这套时装的风格完全不同，可能用于登录/注册页面。

    无论你穿哪套时装，“你”这个核心（页面内容）始终被包裹在中间，而时装（布局）则提供了外部的框架和风格。

*   **工作原理：** 布局是包含一个 `<slot />` 组件的 Vue 组件。这个 `<slot />` 就是一个“占位符”，Nuxt 会将当前路由匹配到的页面组件，自动渲染到这个“占位符”里。

## 如何打造你的“时装”？

1.  **创建布局文件：**

    在项目根目录下创建一个 `layouts/` 文件夹，然后在里面创建 `.vue` 文件。每个文件代表一套“时装”。

    ```vue
    <!-- layouts/default.vue -->
    <template>
      <div>
        <TheHeader />
        <main>
          <!-- 你的页面内容会在这里显示 -->
          <slot />
        </main>
        <TheFooter />
      </div>
    </template>
    ```

    `layouts/default.vue` 是一个特殊的文件，Nuxt 会默认将它作为所有页面的布局，除非你为页面指定了其他的布局。

2.  **为页面“换装”：**

    默认情况下，所有页面都会穿上 `default` 这套时装。如果你想给某个特定的页面换一套，可以在页面组件中使用 `definePageMeta` 宏。

    ```vue
    <!-- pages/login.vue -->
    <script setup>
    definePageMeta({
      layout: 'auth' // 指定使用 layouts/auth.vue 这个布局
    })
    </script>
    ```

    你甚至可以动态地禁用布局：

    ```vue
    definePageMeta({
      layout: false // 这个页面将“裸奔”，不使用任何布局
    })
    ```

## 动态切换布局

在更复杂的场景下，你可能需要根据用户的状态或其他条件来动态改变布局。这时，你可以使用 `setPageLayout` 这个辅助函数。

```vue
<script setup>
const { setPageLayout } = useNuxtApp()

function enableCustomLayout () {
  setPageLayout('custom')
}
</script>
```

---

布局系统是 Nuxt 提高代码复用性、保持应用结构一致性的关键特性。掌握了它，你就能像一位出色的时装设计师一样，轻松地为你的应用程序打造出既美观又统一的视觉风格。告别重复代码，从使用布局开始！