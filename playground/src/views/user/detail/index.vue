<script lang="ts" setup>
import { reactive } from 'vue';
import { Page } from '@vben/common-ui';
import { Descriptions } from 'ant-design-vue';

// 模拟用户数据
const userInfo = reactive({
  id: '1',
  username: 'admin',
  nickname: '管理员',
  email: 'admin@example.com',
  phone: '13800138000',
  status: '启用',
  createTime: '2024-01-01 00:00:00',
  lastLoginTime: '2024-01-15 10:30:00',
  role: '超级管理员',
  dept: '技术部',
});
</script>

<template>
  <Page auto-content-height>
    <div class="p-6">
      <h2 class="text-xl font-bold mb-6">用户详情</h2>
      <Descriptions :column="2" bordered>
        <Descriptions.Item label="用户ID">{{ userInfo.id }}</Descriptions.Item>
        <Descriptions.Item label="用户名">{{ userInfo.username }}</Descriptions.Item>
        <Descriptions.Item label="昵称">{{ userInfo.nickname }}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{{ userInfo.email }}</Descriptions.Item>
        <Descriptions.Item label="手机号">{{ userInfo.phone }}</Descriptions.Item>
        <Descriptions.Item label="状态">{{ userInfo.status }}</Descriptions.Item>
        <Descriptions.Item label="角色">{{ userInfo.role }}</Descriptions.Item>
        <Descriptions.Item label="部门">{{ userInfo.dept }}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{{ userInfo.createTime }}</Descriptions.Item>
        <Descriptions.Item label="最后登录时间">{{ userInfo.lastLoginTime }}</Descriptions.Item>
      </Descriptions>
    </div>
  </Page>
</template>
