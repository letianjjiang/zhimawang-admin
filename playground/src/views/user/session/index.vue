<script setup lang="ts">
import type { UserSessionApi } from '#/api/core/user';

import { onMounted, ref } from 'vue';

import { message } from 'ant-design-vue';

import { getUserSessionsApi } from '#/api/core/user';

// 响应式数据
const sessions = ref<UserSessionApi.SessionInfo[]>([]);
const loading = ref(false);
const error = ref('');

// 获取会话数据
const fetchSessions = async () => {
  try {
    loading.value = true;
    error.value = '';
    const response = await getUserSessionsApi();
    sessions.value = response || [];
  } catch (error_: any) {
    console.error('获取会话数据失败:', error_);
    error.value = error_?.message || '获取会话数据失败';
    message.error(error.value);
  } finally {
    loading.value = false;
  }
};

// 格式化日期时间
const formatDateTime = (dateTime: number[] | string) => {
  if (!dateTime) return '-';
  try {
    let date: Date;
    if (Array.isArray(dateTime) && dateTime.length >= 6) {
      // 处理数组格式 [年, 月, 日, 时, 分, 秒]
      const year = dateTime[0] || 0;
      const month = dateTime[1] || 1;
      const day = dateTime[2] || 1;
      const hour = dateTime[3] || 0;
      const minute = dateTime[4] || 0;
      const second = dateTime[5] || 0;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else if (typeof dateTime === 'string') {
      date = new Date(dateTime);
    } else {
      return '-';
    }

    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return Array.isArray(dateTime) ? dateTime.join('-') : String(dateTime);
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchSessions();
});
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="mb-2 text-2xl font-bold text-gray-900">用户会话管理</h1>
      <p class="text-gray-600">查看和管理用户登录会话信息</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <a-spin size="large" />
    </div>

    <div v-else-if="error" class="py-8 text-center">
      <a-alert :message="error" type="error" show-icon class="mb-4" />
      <a-button @click="fetchSessions" type="primary"> 重新加载 </a-button>
    </div>

    <div v-else-if="sessions.length === 0" class="py-8 text-center">
      <a-empty description="暂无会话数据" />
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="session in sessions"
        :key="session.session_id"
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <div class="mb-4 flex items-start justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"
            >
              <span class="text-sm font-semibold text-blue-600">
                {{ session.device_type?.charAt(0)?.toUpperCase() || 'D' }}
              </span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ session.device_name || '未知设备' }}
              </h3>
              <p class="text-sm text-gray-500">
                设备类型: {{ session.device_type }} | 会话ID:
                {{ session.session_id }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <a-tag color="blue">{{ session.device_type }}</a-tag>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500">会话ID:</span>
              <span class="font-mono text-gray-900">{{
                session.session_id
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">设备名称:</span>
              <span class="text-gray-900">{{
                session.device_name || '未知设备'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">创建时间:</span>
              <span class="text-gray-900">{{
                formatDateTime(session.created_at)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">最后活跃:</span>
              <span class="text-gray-900">{{
                formatDateTime(session.last_seen_at)
              }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500">首次IP:</span>
              <span class="font-mono text-gray-900">{{
                session.ip_first
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">最后IP:</span>
              <span class="font-mono text-gray-900">{{ session.ip_last }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">设备类型:</span>
              <span class="text-gray-900">{{ session.device_type }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 text-center">
      <a-button @click="fetchSessions" :loading="loading" type="primary">
        刷新数据
      </a-button>
    </div>
  </div>
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>
