interface Hitokoto {
  id: number;
  uuid: string;
  hitokoto: string;
  type: string;
  from: string;
  from_who: string | null;
  creator: string;
  creator_uid: number;
  reviewer: number;
  commit_from: string;
  created_at: string;
  length: number;
}

export default defineEventHandler(async (event) => {
  // 模拟一个 2 秒的延迟，以便观察前端的 default 和 lazy 效果
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    // 直接请求国内的 “一言” API，不再需要代理
    const data = await $fetch<Hitokoto>('https://v1.hitokoto.cn/');
    return data;
  } catch (error: any) {
    // 如果请求失败，抛出一个统一的错误，方便上层捕获
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch from Hitokoto API',
      data: error.message
    });
  }
});