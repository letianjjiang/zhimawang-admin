<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Button, Tag, Image } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getArticleListApi } from '#/api/core/article';
import type { ArticleApi } from '#/api/core/article';

interface RowType extends ArticleApi.ArticleItem {}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { fixed: 'left', title: '序号', type: 'seq', width: 50 },
    { field: 'id', title: '文章ID', width: 80 },
    { field: 'title', title: '文章标题', width: 300 },
    { field: 'author', title: '作者', width: 120 },
    { field: 'cover', title: '封面', width: 70, slots: { default: 'cover' } },
    { 
      field: 'contentType', 
      title: '内容类型', 
      width: 100,
      slots: { default: 'contentType' }
    },
    { field: 'views', title: '浏览量', width: 100 },
    { field: 'comments', title: '评论数', width: 80 },
    {
      field: 'createdAt',
      formatter: 'formatDateTime',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 150,
    },
  ],
  height: 'auto',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        const result = await getArticleListApi({
          limit: page.pageSize,
          offset: (page.currentPage - 1) * page.pageSize,
        });
        
        // 返回符合 VxeGrid 期望的数据格式
        return {
          items: result, // VxeGrid 期望的数据字段名
          total: result.length, // 总数，注意：这里需要根据实际API返回的总数调整
        };
      },
    },
  },
  rowConfig: {
    isHover: true,
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });

// 事件处理函数
const handleView = (row: RowType) => {
  console.log('查看文章:', row);
  // TODO: 跳转到文章详情页面
};

const handleEdit = (row: RowType) => {
  console.log('编辑文章:', row);
  // TODO: 跳转到文章编辑页面
};

const handleDelete = (row: RowType) => {
  console.log('删除文章:', row);
  // TODO: 实现删除逻辑
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #cover="{ row }">
        <Image :src="row.cover" height="30" width="30" />
      </template>

      <template #contentType="{ row }">
        <Tag :color="row.contentType === 'all' ? 'blue' : 'green'">
          {{ row.contentType === 'all' ? '全部' : row.contentType }}
        </Tag>
      </template>
      
      <template #action="{ row }">
        <Button type="link" size="small" @click="handleView(row)">查看</Button>
        <Button type="link" size="small" @click="handleEdit(row)">编辑</Button>
        <Button type="link" size="small" danger @click="handleDelete(row)">删除</Button>
      </template>
    </Grid>
  </Page>
</template>
