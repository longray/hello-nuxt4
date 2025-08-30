# TypeScript 在 Nuxt4 中的最佳实践
标签: Nuxt4, TypeScript, 类型安全, 最佳实践

## 问题描述
如何在 Nuxt4 项目中充分利用 TypeScript 的优势？如何配置 `tsconfig.json`？如何为组件、API、状态管理等添加类型定义？遵循哪些最佳实践可以提高代码质量和开发效率？

## 解决方案
Nuxt4 对 TypeScript 提供了一流的支持，大部分配置都已开箱即用。以下是提升 TypeScript 使用体验的最佳实践。

### 1. 启用严格模式
为了获得最强的类型检查，建议在 `tsconfig.json` 中启用严格模式。

```json
// tsconfig.json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 2. 类型化的组件 Props
使用 `<script setup lang="ts">` 和 `defineProps` 来为组件的 props 添加类型。

```vue
<template>
  <div>
    <h1>{{ user.name }}</h1>
    <p>年龄: {{ user.age }}</p>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number;
  name: string;
  age: number;
  isActive?: boolean;
}

defineProps<{
  user: User;
}>();
</script>
```

### 3. 类型化的组件 Emits
使用 `defineEmits` 为组件的事件提供类型定义。

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update', id: number, data: Partial<User>): void;
  (e: 'delete', id: number): void;
}>();

function updateUser() {
  emit('update', 1, { name: '新名字' });
}
</script>
```

### 4. 类型化的 `useFetch` 和 `useAsyncData`
为数据获取函数提供泛型参数，以获得类型化的返回值。

```typescript
// composables/useUsers.ts
interface User {
  id: number;
  name: string;
  email: string;
}

export const useUsers = () => {
  const { data: users, pending, error } = useFetch<User[]>('/api/users');

  return { users, pending, error };
};
```

### 5. 类型化的 API 路由 (Nitro)
Nitro 支持为 API 路由的请求体和返回值定义类型。

```typescript
// server/api/users.post.ts
import { z } from 'zod';

// 使用 Zod 进行运行时验证和类型推断
const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

type UserPayload = z.infer<typeof UserSchema>;

export default defineEventHandler(async (event) => {
  const body = await readBody<UserPayload>(event);

  // Zod 会在解析时验证数据
  const validation = UserSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的输入',
      data: validation.error.errors,
    });
  }

  // 此处 `validation.data` 是类型安全的
  const newUser = { id: Date.now(), ...validation.data };

  return newUser;
});
```

### 6. 类型化的状态管理 (Pinia)
Pinia 天然支持 TypeScript，可以轻松创建类型安全的 Store。

```typescript
// store/cart.ts
import { defineStore } from 'pinia';

interface Product {
  id: string;
  name: string;
  price: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<Product[]>([]);

  const totalItems = computed(() => items.value.length);
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price, 0);
  });

  function addItem(item: Product) {
    items.value.push(item);
  }

  function removeItem(id: string) {
    items.value = items.value.filter(item => item.id !== id);
  }

  return { items, totalItems, totalPrice, addItem, removeItem };
});
```

### 7. 扩展 Nuxt 类型
有时需要为 `NuxtApp` 或其他 Nuxt 实例添加自定义属性，可以通过类型声明合并来实现。

```typescript
// types/nuxt.d.ts
declare module '#app' {
  interface NuxtApp {
    $myAnalytics: {
      trackEvent: (name: string, props: Record<string, any>) => void;
    };
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $myAnalytics: {
      trackEvent: (name: string, props: Record<string, any>) => void;
    };
  }
}

export {};
```

## 常见坑点与注意事项

-   **`tsconfig.json` 的作用**:
    -   项目根目录的 `tsconfig.json` 主要用于配置你的 IDE (如 VSCode) 和类型检查行为。
    -   Nuxt 在构建时会使用 `.nuxt/tsconfig.json`，它继承自你的根配置并添加了 Nuxt 特有的路径别名和类型。

-   **自动生成的类型**:
    -   Nuxt 会在 `.nuxt/` 目录下生成大量类型定义，包括组件、路由、模块等。
    -   如果遇到类型问题，可以尝试重启开发服务器 (`npm run dev`) 或手动运行 `nuxi prepare` 来重新生成类型。

-   **`any` vs `unknown`**:
    -   尽量避免使用 `any`，因为它会完全绕过类型检查。
    -   优先使用 `unknown`，它更安全，因为在使用前必须先进行类型断言或类型收窄。

-   **类型收窄 (Type Narrowing)**:
    -   在处理联合类型或 `unknown` 类型时，善用 `typeof`、`instanceof` 或自定义的类型守卫函数来收窄类型范围。

    ```typescript
    function handleInput(input: string | number) {
      if (typeof input === 'string') {
        // 此处 input 被收窄为 string 类型
        console.log(input.toUpperCase());
      } else {
        // 此处 input 被收窄为 number 类型
        console.log(input.toFixed(2));
      }
    }
    ```

-   **Zod 集成**:
    -   强烈推荐使用 [Zod](https://zod.dev/) 库来同时进行运行时的数据验证和静态类型推断，尤其是在处理外部 API 数据和用户输入时。

## 参考链接
-   [Nuxt4 官方文档 - TypeScript](https://nuxt.com/docs/guide/concepts/typescript)
-   [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
-   [Zod - TypeScript-first schema validation](https://zod.dev/)