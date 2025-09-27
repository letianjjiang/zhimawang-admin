<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
import { Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface PageItem {
  name: string;
  pageId: number;
  type: number;
}

interface PageResponse {
  data: PageItem[];
  debugInfo: null | string;
  errorCode: null | string;
  message: string;
  status: string;
}

async function fetchPageList() {
  const resp = await fetch('http://duducar.cloud:8888/api/page/list', {
    method: 'GET',
    headers: {
      accept: '*/*',
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data: PageResponse = await resp.json();
  return {
    items: data.data || [],
    total: data.data?.length || 0,
  };
}

const gridOptions: VxeGridProps<PageItem> = {
  columns: [
    { title: '序号', type: 'seq', width: 60 },
    {
      field: 'pageId',
      title: '页面ID',
      width: 100,
    },
    {
      field: 'name',
      title: '页面名称',
      width: 200,
    },
    {
      field: 'type',
      title: '类型',
      width: 100,
      slots: { default: 'type' },
    },
  ],
  height: 600,
  proxyConfig: {
    ajax: {
      query: async () => {
        return await fetchPageList();
      },
    },
  },
  rowConfig: {
    isHover: true,
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <h1 class="mb-6 text-2xl font-bold">页面按钮列表</h1>
      <Grid>
        <template #type="{ row }">
          <Tag :color="row.type === 0 ? 'green' : 'orange'">
            {{ row.type === 0 ? '普通页面' : `类型${row.type}` }}
          </Tag>
        </template>
      </Grid>
    </div>
  </Page>
</template>
