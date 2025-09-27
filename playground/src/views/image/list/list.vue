<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { Image, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface ImageItem {
  category: string;
  filename: string;
  fullPath: string;
}

interface ImageListResponse {
  data: {
    advertisements: string[];
    avatar: string[];
    chatsImg: string[];
    common: string[];
  };
  debugInfo: null | string;
  errorCode: null | string;
  message: string;
  status: string;
}

const loading = ref(false);
const tableData = ref<ImageItem[]>([]);
const accessStore = useAccessStore();

const fetchImageList = async () => {
  loading.value = true;
  try {
    const token = accessStore.accessToken;
    if (!token) {
      throw new Error('未找到访问令牌，请重新登录');
    }

    const response = await fetch(
      'http://duducar.cloud:8888/api/cos/image/list',
      {
        method: 'GET',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: ImageListResponse = await response.json();

    // 将分类的图片数据转换为表格数据
    const images: ImageItem[] = [];

    Object.entries(result.data).forEach(([category, files]) => {
      files.forEach((filename: string) => {
        images.push({
          filename,
          category,
          fullPath: `http://duducar.cloud:8888/cos/${filename}`,
        });
      });
    });

    tableData.value = images;

    return {
      items: images,
      total: images.length,
    };
  } catch (error) {
    console.error('获取图片列表失败:', error);
    return {
      items: [],
      total: 0,
    };
  } finally {
    loading.value = false;
  }
};

const gridOptions: VxeGridProps<ImageItem> = {
  columns: [
    { title: '序号', type: 'seq', width: 60 },
    {
      field: 'fullPath',
      slots: { default: 'image' },
      title: '图片预览',
      width: 120,
    },
    {
      field: 'filename',
      title: '文件名',
      width: 300,
      showOverflow: 'tooltip',
    },
    {
      field: 'category',
      slots: { default: 'category' },
      title: '分类',
      width: 120,
    },
    {
      field: 'fullPath',
      title: '完整路径',
      width: 400,
      showOverflow: 'tooltip',
    },
  ],
  height: 600,
  proxyConfig: {
    ajax: {
      query: async () => {
        return await fetchImageList();
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

onMounted(() => {
  fetchImageList();
});
</script>

<script lang="ts">
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    advertisements: 'orange',
    chatsImg: 'blue',
    common: 'green',
    avatar: 'purple',
  };
  return colorMap[category] || 'default';
}

function getCategoryLabel(category: string): string {
  const labelMap: Record<string, string> = {
    advertisements: '广告图片',
    chatsImg: '聊天图片',
    common: '通用图片',
    avatar: '头像图片',
  };
  return labelMap[category] || category;
}
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <h1 class="mb-6 text-2xl font-bold">图片列表</h1>

      <Grid>
        <template #image="{ row }">
          <Image :src="row.fullPath" height="60" width="60" class="rounded" />
        </template>

        <template #category="{ row }">
          <Tag :color="getCategoryColor(row.category)">
            {{ getCategoryLabel(row.category) }}
          </Tag>
        </template>
      </Grid>
    </div>
  </Page>
</template>
