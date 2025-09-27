<script setup lang="ts">
import type { UserSessionApi } from '#/api/core/user';

import { onMounted, ref } from 'vue';

import { message } from 'ant-design-vue';

import { getUserSessionsApi } from '#/api/core/user';

// 响应式数据
const sessions = ref<UserSessionApi.SessionInfo[]>([]);
const loading = ref(false);
const error = ref('');

// 表格列定义
const columns = [
  {
    title: '设备信息',
    key: 'device',
    width: 200,
  },
  {
    title: '会话ID',
    key: 'session_id',
    width: 150,
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 160,
  },
  {
    title: '最后活跃',
    key: 'last_seen_at',
    width: 160,
  },
  {
    title: '首次IP',
    key: 'ip_first',
    width: 120,
  },
  {
    title: '最后IP',
    key: 'ip_last',
    width: 120,
  },
];

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
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="mb-2 text-2xl font-bold text-gray-900">用户会话管理</h1>
        <p class="text-gray-600">查看和管理用户登录会话信息</p>
      </div>
      <a-button @click="fetchSessions" :loading="loading" type="primary">
        刷新数据
      </a-button>
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

    <div v-else class="bg-white rounded-lg shadow-sm">
      <a-table
        :columns="columns"
        :data-source="sessions"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }"
        row-key="session_id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'device'">
            <div class="flex items-center space-x-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span class="text-xs font-semibold text-blue-600">
                  {{ record.device_type?.charAt(0)?.toUpperCase() || 'D' }}
                </span>
              </div>
              <div>
                <div class="font-medium text-gray-900">
                  {{ record.device_name || '未知设备' }}
                </div>
                <div class="text-sm text-gray-500">
                  <a-tag color="blue" size="small">{{ record.device_type }}</a-tag>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'session_id'">
            <span class="font-mono text-sm">{{ record.session_id }}</span>
          </template>
          <template v-else-if="column.key === 'created_at'">
            <span class="text-sm">{{ formatDateTime(record.created_at) }}</span>
          </template>
          <template v-else-if="column.key === 'last_seen_at'">
            <span class="text-sm">{{ formatDateTime(record.last_seen_at) }}</span>
          </template>
          <template v-else-if="column.key === 'ip_first'">
            <span class="font-mono text-sm">{{ record.ip_first }}</span>
          </template>
          <template v-else-if="column.key === 'ip_last'">
            <span class="font-mono text-sm">{{ record.ip_last }}</span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>
