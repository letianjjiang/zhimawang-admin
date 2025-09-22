<script lang="ts" setup>
import type { ArticleApi } from '#/api/core/article';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  Descriptions,
  DescriptionsItem,
  Divider,
  Image,
  Tag,
} from 'ant-design-vue';

const articleData = ref<ArticleApi.ArticleItem | undefined>();

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ data: ArticleApi.ArticleItem }>();
      articleData.value = data?.data;
    }
  },
});
</script>

<template>
  <Drawer title="文章详情" class="w-[800px]">
    <div class="p-6">
      <div v-if="articleData" class="space-y-6">
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
              :src="articleData.author.userAvatar"
              :alt="articleData.author.displayName"
              class="h-12 w-12 rounded-full"
            />
            <div>
              <div class="font-medium">
                {{ articleData.author.displayName }}
              </div>
              <div class="text-sm text-gray-500">
                {{ articleData.author.ipLocation }}
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <!-- 文章统计信息 -->
        <div>
          <h3 class="mb-3 text-lg font-semibold">统计信息</h3>
          <Descriptions :column="2" bordered>
            <DescriptionsItem label="点赞数">
              <Tag color="red">{{ articleData.likeCount }}</Tag>
            </DescriptionsItem>
            <DescriptionsItem label="评论数">
              <Tag color="blue">{{ articleData.commentCount }}</Tag>
            </DescriptionsItem>
            <DescriptionsItem label="点赞状态">
              <Tag :color="articleData.isLiked ? 'red' : 'default'">
                {{ articleData.isLiked ? '已赞' : '未赞' }}
              </Tag>
            </DescriptionsItem>
            <DescriptionsItem label="广告状态">
              <Tag :color="articleData.isAds ? 'orange' : 'green'">
                {{ articleData.isAds ? '广告' : '正常' }}
              </Tag>
            </DescriptionsItem>
          </Descriptions>
        </div>

        <!-- 目标链接 -->
        <div v-if="articleData.targetUrl">
          <h3 class="mb-3 text-lg font-semibold">目标链接</h3>
          <div class="rounded-lg bg-gray-50 p-3">
            <a
              :href="articleData.targetUrl"
              target="_blank"
              class="break-all text-blue-500 hover:text-blue-700"
            >
              {{ articleData.targetUrl }}
            </a>
          </div>
        </div>
      </div>

      <div v-else class="py-8 text-center text-gray-500">暂无数据</div>
    </div>
  </Drawer>
</template>
