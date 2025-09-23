<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Alert, Empty, List, Spin } from 'ant-design-vue';

interface MobilePageItem {
  [key: string]: unknown;
  cover?: string;
  description?: string;
  id?: number | string;
  title?: string;
}

const loading = ref(false);
const error = ref<null | string>(null);
const items = ref<MobilePageItem[]>([]);

function getItemId(item: MobilePageItem) {
  return (
    item.id ?? (item as any).pageId ?? (item as any).uuid ?? (item as any).key
  );
}

function getItemTitle(item: MobilePageItem) {
  const title =
    (item as any).title ??
    (item as any).name ??
    (item as any).pageTitle ??
    (item as any).page_name;
  const id = getItemId(item);
  if (title !== null && title !== undefined && title !== '')
    return String(title);
  return id === null || id === undefined ? '未命名' : `#${id}`;
}

function getItemDesc(item: MobilePageItem) {
  return (
    (item as any).description ??
    (item as any).desc ??
    (item as any).summary ??
    (item as any).remark ??
    ''
  );
}

async function fetchPageList() {
  loading.value = true;
  error.value = null;
  try {
    const resp = await fetch('http://duducar.cloud:8888/api/page/list', {
      method: 'GET',
      headers: {
        accept: '*/*',
      },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    // 兼容多种返回结构：数组或 { data: [] }
    const list = Array.isArray(data) ? data : (data?.data ?? []);
    items.value = list as MobilePageItem[];
  } catch (error_: unknown) {
    error.value = (error_ as Error).message ?? '请求失败';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchPageList);
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <Spin :spinning="loading">
        <template v-if="error">
          <Alert type="error" :message="`加载失败：${error}`" show-icon />
        </template>

        <template v-else>
          <template v-if="items.length === 0">
            <Empty description="暂无数据" />
          </template>
          <template v-else>
            <List :data-source="items" item-layout="horizontal">
              <template #renderItem="{ item }">
                <List.Item>
                  <List.Item.Meta
                    :title="getItemTitle(item)"
                    :description="getItemDesc(item)"
                  />
                </List.Item>
              </template>
            </List>
          </template>
        </template>
      </Spin>
    </div>
  </Page>
</template>
