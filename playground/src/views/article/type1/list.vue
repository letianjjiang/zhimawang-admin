<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { ArticleApi } from '#/api/core/article';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Image, message, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getArticleListApi } from '#/api/core/article';

import ExtraDrawer from './drawer.vue';

interface RowType extends ArticleApi.ArticleItem {}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 60 },
    {
      field: 'createdAt',
      title: '创建时间',
      width: 200,
    },
    {
      field: 'images',
      slots: { default: 'image' },
      title: '封面',
      width: 80,
    },
    {
      field: 'articleName',
      title: '文章标题',
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'author.userAvatar',
      slots: { default: 'userAvatar' },
      title: '头像',
      width: 80,
    },
    {
      field: 'author.nickname',
      title: '昵称',
      width: 100,
    },
    {
      field: 'author.username',
      title: '用户名',
      width: 100,
    },
    {
      field: 'author.userId',
      title: '用户ID',
      width: 80,
    },
    {
      field: 'author.ipLocation',
      title: 'IP位置',
      width: 100,
    },
    {
      field: 'articleId',
      title: '文章ID',
      width: 80,
    },
    {
      field: 'isLiked',
      slots: { default: 'liked' },
      title: '点赞状态',
      width: 100,
    },
    {
      field: 'likeCount',
      title: '点赞数',
      width: 80,
    },
    {
      field: 'commentCount',
      title: '评论数',
      width: 80,
    },
    {
      field: 'isAds',
      slots: { default: 'ads' },
      title: '广告',
      width: 80,
    },
    {
      field: 'targetUrl',
      title: '目标链接',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 150,
    },
  ],
  height: 600,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        const response = await getArticleListApi({
          pageId: 1,
          channelId: 1,
          limit: page.pageSize,
          offset: (page.currentPage - 1) * page.pageSize,
          randomSeed: 12_345,
        });
        return {
          items: response,
          total: 1000, // 设置一个合理的总数，避免无限滚动
        };
      },
    },
  },
  rowConfig: {
    isHover: true,
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });

// 抽屉相关
const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: ExtraDrawer,
});

// 点赞处理
const handleEdit = (row: RowType) => {
  // TODO: 实现编辑文章API调用
  message.info(`编辑文章: ${row.articleName}`);
};

// 查看详情
const handleViewDetail = (row: RowType) => {
  drawerApi.setData({ articleId: row.articleId }).open();
};

// 删除
const handleDelete = (row: RowType) => {
  // TODO: 实现删除文章API调用
  message.info(`删除文章: ${row.articleName}`);
};
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <h1 class="mb-6 text-2xl font-bold">小红书文章列表</h1>

      <Drawer />

      <Grid>
        <template #image="{ row }">
          <Image
            v-if="row.images && row.images.length > 0"
            :src="row.images[0]?.pictureUrl"
            height="40"
            width="40"
            class="rounded"
          />
          <div
            v-else
            class="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-400"
          >
            无图
          </div>
        </template>

        <template #userAvatar="{ row }">
          <Image
            v-if="row.author && row.author.userAvatar"
            :src="row.author.userAvatar"
            height="40"
            width="40"
            class="rounded"
          />
          <div
            v-else
            class="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-400"
          >
            无头像
          </div>
        </template>

        <template #liked="{ row }">
          <Tag :color="row.isLiked ? 'red' : 'default'">
            {{ row.isLiked ? '已赞' : '未赞' }}
          </Tag>
        </template>

        <template #ads="{ row }">
          <Tag :color="row.isAds ? 'orange' : 'green'">
            {{ row.isAds ? '广告' : '正常' }}
          </Tag>
        </template>

        <template #targetUrl="{ row }">
          <span
            v-if="row.targetUrl"
            class="block max-w-20 truncate text-blue-500"
          >
            {{ row.targetUrl }}
          </span>
          <span v-else class="text-gray-400">无</span>
        </template>

        <template #action="{ row }">
          <Button type="link" size="small" @click="handleEdit(row)">
            编辑
          </Button>
          <Button type="link" size="small" @click="handleViewDetail(row)">
            详情
          </Button>
          <Button type="link" size="small" danger @click="handleDelete(row)">
            删除
          </Button>
        </template>
      </Grid>
    </div>
  </Page>
</template>
