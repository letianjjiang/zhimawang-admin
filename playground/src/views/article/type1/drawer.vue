<script lang="ts" setup>
import type { ArticleApi } from '#/api/core/article';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { getArticleDetailApi } from '#/api/core/article';

import {
  Descriptions,
  DescriptionsItem,
  Divider,
  Image,
  Tag,
} from 'ant-design-vue';

const articleData = ref<ArticleApi.ArticleDetail | undefined>();
const loading = ref(false);

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const payload = drawerApi.getData<{ articleId: number }>();
      if (payload?.articleId) {
        fetchDetail(payload.articleId);
      }
    } else {
      articleData.value = undefined;
    }
  },
});

async function fetchDetail(articleId: number) {
  try {
    loading.value = true;
    articleData.value = await getArticleDetailApi(articleId);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Drawer title="文章详情" class="w-[800px]">
    <div class="p-6">
      <div v-if="loading" class="py-8 text-center text-gray-500">加载中...</div>
      <div v-else-if="articleData" class="space-y-6">
        <!-- 文章标题 -->
        <div>
          <h2 class="mb-2 text-xl font-bold">{{ articleData.articleName }}</h2>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span>文章ID: {{ articleData.articleId }}</span>
            <span>创建时间: {{ articleData.createdAt }}</span>
          </div>
        </div>

        <Divider />

        <!-- 封面图片 -->
        <div v-if="articleData.images && articleData.images.length > 0">
          <h3 class="mb-3 text-lg font-semibold">封面图片</h3>
          <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Image
              v-for="(image, index) in articleData.images"
              :key="index"
              :src="image.pictureUrl"
              class="rounded-lg"
              :preview="true"
            />
          </div>
        </div>

        <!-- 作者信息 -->
        <div>
          <h3 class="mb-3 text-lg font-semibold">作者信息</h3>
          <div class="flex items-center space-x-4">
            <img
              :src="articleData.author?.userAvatar || ''"
              alt="avatar"
              class="h-12 w-12 rounded-full"
            />
            <div>
            <div class="font-medium">
                {{ articleData.author?.nickname || articleData.author?.username || '未知' }}
              </div>
              <div class="text-sm text-gray-500">
                {{ articleData.author?.ipAddress || '未知' }}
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <!-- 文章统计信息 -->
        <div>
          <h3 class="mb-3 text-lg font-semibold">统计信息</h3>
          <Descriptions :column="2" bordered>
            <DescriptionsItem label="浏览量">
              <Tag color="red">{{ articleData.viewCount }}</Tag>
            </DescriptionsItem>
            <DescriptionsItem label="评论数">
              <Tag color="blue">{{ articleData.replyCount ?? 0 }}</Tag>
            </DescriptionsItem>
            <DescriptionsItem label="创建时间">
              {{ articleData.createdAt }}
            </DescriptionsItem>
            <DescriptionsItem label="最后回复">
              {{ articleData.lastReplyAt || '-' }}
            </DescriptionsItem>
          </Descriptions>
        </div>

        <!-- 目标链接（详情无该字段，移除） -->

        <!-- 正文（HTML） -->
        <div v-if="articleData.articleContent">
          <h3 class="mb-3 text-lg font-semibold">正文</h3>
          <div class="prose max-w-none" v-html="articleData.articleContent"></div>
        </div>
      </div>

      <div v-else class="py-8 text-center text-gray-500">暂无数据</div>
    </div>
  </Drawer>
</template>
