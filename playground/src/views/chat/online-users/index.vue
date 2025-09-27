<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { Card, Spin, Tag } from 'ant-design-vue';

interface OnlineUsersResponse {
  count: number;
  currentUserId: number;
  onlineUsers: number[];
  success: boolean;
}

const loading = ref(false);
const onlineUsersData = ref<null | OnlineUsersResponse>(null);
const error = ref<null | string>(null);
const accessStore = useAccessStore();

const fetchOnlineUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    const token = accessStore.accessToken;
    if (!token) {
      throw new Error('未找到访问令牌，请重新登录');
    }

    const response = await fetch(
      'http://duducar.cloud:8888/api/v2/chat/online-users',
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

    const data: OnlineUsersResponse = await response.json();
    onlineUsersData.value = data;
  } catch (error_) {
    error.value = error_ instanceof Error ? error_.message : '获取在线用户失败';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOnlineUsers();
});
</script>

<template>
  <Page auto-content-height>
    <div class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold">在线用户</h1>
        <button
          @click="fetchOnlineUsers"
          :disabled="loading"
          class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          刷新
        </button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-8">
        <Spin size="large" />
      </div>

      <div
        v-else-if="error"
        class="rounded-lg border border-red-200 bg-red-50 p-4"
      >
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="onlineUsersData" class="space-y-4">
        <!-- 统计信息 -->
        <Card title="统计信息" class="mb-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">
                {{ onlineUsersData.count }}
              </div>
              <div class="text-gray-600">在线用户数</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">
                {{ onlineUsersData.currentUserId }}
              </div>
              <div class="text-gray-600">当前用户ID</div>
            </div>
            <div class="text-center">
              <Tag :color="onlineUsersData.success ? 'green' : 'red'">
                {{ onlineUsersData.success ? '连接正常' : '连接异常' }}
              </Tag>
            </div>
          </div>
        </Card>

        <!-- 在线用户列表 -->
        <Card title="在线用户列表">
          <div v-if="onlineUsersData.onlineUsers.length > 0" class="space-y-2">
            <div
              v-for="userId in onlineUsersData.onlineUsers"
              :key="userId"
              class="flex items-center justify-between rounded-lg border border-gray-200 p-3"
            >
              <div class="flex items-center">
                <div
                  class="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm text-white"
                >
                  {{ userId.toString().slice(-2) }}
                </div>
                <div>
                  <div class="font-medium">用户 {{ userId }}</div>
                  <div class="text-sm text-gray-500">
                    {{
                      userId === onlineUsersData.currentUserId
                        ? '(当前用户)'
                        : '在线'
                    }}
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <div class="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span class="text-sm text-green-600">在线</span>
              </div>
            </div>
          </div>
          <div v-else class="py-8 text-center text-gray-500">暂无在线用户</div>
        </Card>
      </div>

      <div v-else class="rounded-lg border border-gray-200 bg-white p-6">
        <p class="text-gray-600">无数据</p>
      </div>
    </div>
  </Page>
</template>
