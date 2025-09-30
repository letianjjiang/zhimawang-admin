<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Button, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRolesChannelsApi } from '#/api/roles/channels';

interface RowType {
  [key: string]: any;
  created_at: string;
  description?: string;
  id: number;
  name: string;
  status: number;
  updated_at: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { fixed: 'left', title: '序号', type: 'seq', width: 50 },
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: '频道名称', width: 150 },
    { field: 'description', title: '描述', width: 200 },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    {
      field: 'created_at',
      formatter: 'formatDateTime',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'updated_at',
      formatter: 'formatDateTime',
      title: '更新时间',
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
  pagerConfig: {
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        const result = await getRolesChannelsApi({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
        return {
          items: result,
          total: result.length,
        };
      },
    },
  },
  rowConfig: {
    isHover: true,
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });

// 状态格式化函数
const formatStatus = (status: number) => {
  return status === 1 ? '启用' : '禁用';
};

const getStatusColor = (status: number) => {
  return status === 1 ? 'success' : 'default';
};

// 编辑处理
const handleEdit = (_row: RowType) => {
  // TODO: 实现编辑功能
};

// 删除处理
const handleDelete = (_row: RowType) => {
  // TODO: 实现删除功能
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ row }">
        <Tag :color="getStatusColor(row.status)">
          {{ formatStatus(row.status) }}
        </Tag>
      </template>
      <template #action="{ row }">
        <Button type="link" size="small" @click="handleEdit(row)">编辑</Button>
        <Button type="link" size="small" danger @click="handleDelete(row)">
          删除
        </Button>
      </template>
    </Grid>
  </Page>
</template>
