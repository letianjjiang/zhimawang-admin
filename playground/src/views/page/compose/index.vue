<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { requestClient } from '#/api/request';

interface ComposeResult {
  data: any;
  error?: string;
  pageId: number;
}

const loading = ref(false);
const results = ref<ComposeResult[]>([]);
const errorMessage = ref<null | string>(null);

async function fetchComposeAll() {
  loading.value = true;
  errorMessage.value = null;
  results.value = [];
  const ids = Array.from({ length: 8 }, (_, i) => i + 1);
  const tasks = ids.map(async (id) => {
    try {
      const data = await requestClient.get<any>('/api/page/compose', {
        params: { pageId: id },
      });
      return { status: 'fulfilled' as const, value: { pageId: id, data } };
    } catch (error: any) {
      return {
        status: 'rejected' as const,
        reason: error?.message ?? '请求失败',
        pageId: id,
      };
    }
  });

  const settled = await Promise.all(tasks);
  results.value = settled.map((item) => {
    if ((item as any).status === 'fulfilled') {
      const v = (item as any).value as { data: any; pageId: number };
      return { pageId: v.pageId, data: v.data };
    }
    const r = item as any;
    return { pageId: r.pageId, data: null, error: r.reason } as ComposeResult;
  });
  loading.value = false;
}

onMounted(fetchComposeAll);
</script>

<template>
  <Page auto-content-height>
    <div style="padding: 12px 16px">
      <div v-if="loading">请求中…</div>
      <div v-else>
        <div
          v-for="item in results"
          :key="item.pageId"
          style="margin-bottom: 16px"
        >
          <h3 style="margin: 0 0 8px">pageId={{ item.pageId }}</h3>
          <div v-if="item.error" style="color: #c0392b">{{ item.error }}</div>
          <pre v-else class="overflow-auto bg-[#f7f7f7] p-3">{{
            JSON.stringify(item.data, null, 2)
          }}</pre>
        </div>
      </div>
    </div>
  </Page>
</template>
