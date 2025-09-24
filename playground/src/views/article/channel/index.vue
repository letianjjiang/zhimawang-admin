<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ArticleApi } from '#/api/core/article';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getChannelListApi } from '#/api/core/article';

// 响应式数据
const selectedPageId = ref<'all' | number>('all');

// 查看频道详情
function viewChannelDetail(channel: ArticleApi.ChannelItem) {
  message.info(`频道详情：${channel.channelName} (ID: ${channel.channelId})`);
}

// 表格
const [Grid, gridApi] = useVbenVxeGrid<
  ArticleApi.ChannelItem & { pageId?: number }
>({
  class: 'flex-1',
  gridEvents: {
    // 可在此扩展事件
  },
  gridOptions: {
    height: 'auto',
    pagerConfig: { enabled: false },
    toolbarConfig: { custom: true, refresh: true, zoom: true },
    columns: [
      { type: 'seq', title: '序号', width: 70 },
      {
        field: 'channelImgUrl',
        title: '频道图标',
        width: 80,
        cellRender: { name: 'CellImage' },
      },
      { field: 'channelId', title: '频道ID', width: 100 },
      {
        field: 'pageId',
        title: 'pageId',
        width: 100,
      },
      {
        field: 'channelName',
        title: '频道名称',
        minWidth: 160,
        showOverflow: 'tooltip',
      },
      {
        field: 'channelType',
        title: '频道类型',
        width: 100,
        cellRender: {
          name: 'CellTag',
          options: [
            { value: 1, label: '子频道', color: 'blue' },
            { value: 0, label: '主频道' },
          ],
        },
      },
      { field: 'parentId', title: '父频道ID', width: 100 },
      { field: 'sort', title: '排序', width: 100 },
      {
        field: 'operation',
        title: '操作',
        width: 120,
        fixed: 'right',
        align: 'center',
        cellRender: {
          name: 'CellOperation',
          options: [{ code: 'view', text: '查看详情' }],
          attrs: {
            onClick: ({
              code,
              row,
            }: {
              code: string;
              row: ArticleApi.ChannelItem;
            }) => {
              if (code === 'view') {
                viewChannelDetail(row);
              }
            },
          },
        },
      },
    ],
    proxyConfig: {
      ajax: {
        query: async () => {
          async function fetchByPage(pageId: number) {
            const list = (await getChannelListApi(pageId)) || [];
            return list.map((item) => ({ ...item, pageId }));
          }
          if (selectedPageId.value === 'all') {
            const [xhs, lxq] = await Promise.all([
              fetchByPage(4),
              fetchByPage(5),
            ]);
            return [...xhs, ...lxq];
          }
          return await fetchByPage(selectedPageId.value as number);
        },
      },
    },
  } as VxeTableGridOptions,
});

function refreshGrid() {
  gridApi.query();
}

// 页面类型改变处理
// 页面类型切换（已移除UI，保留方法供需要时调用）
// function handlePageTypeChange(pageId: number | 'all') {
//   selectedPageId.value = pageId;
//   refreshGrid();
// }

// 组件挂载时的初始化
onMounted(() => {
  selectedPageId.value = 'all';
  refreshGrid();
});
</script>

<template>
  <Page auto-content-height>
    <template #title>
      {{ $t('article.channel.list.title') }}
    </template>

    <div class="flex h-full flex-col p-4">
      <!-- 顶部筛选与刷新区域已移除 -->

      <!-- Vben VXE 表格 -->
      <Grid table-title="频道列表" />
    </div>
  </Page>
</template>

<style scoped>
.p-4 {
  padding: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-8 {
  margin-top: 32px;
}

/* 已移除列表式卡片视图相关样式 */
</style>
