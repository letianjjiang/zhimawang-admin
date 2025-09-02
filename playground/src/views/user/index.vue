<script lang="ts" setup>
import { Page } from '@vben/common-ui';

// 用户管理首页
</script>

<template>
  <Page auto-content-height>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">用户管理</h1>
      <p class="text-gray-600">欢迎使用用户管理系统</p>
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">用户列表</h3>
          <p class="text-gray-600">查看和管理所有用户</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">新增用户</h3>
          <p class="text-gray-600">创建新的用户账户</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">用户统计</h3>
          <p class="text-gray-600">查看用户相关统计数据</p>
        </div>
      </div>
    </div>
  </Page>
</template>
