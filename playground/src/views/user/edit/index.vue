<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Page } from '@vben/common-ui';
import { Form, Input, Button, Select } from 'ant-design-vue';

// 这里可以添加用户编辑的逻辑
const formRef = ref();
const formState = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  status: 'active',
});

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  nickname: [{ required: true, message: '请输入昵称' }],
  email: [{ required: true, message: '请输入邮箱' }],
  phone: [{ required: true, message: '请输入手机号' }],
};

const onFinish = (values: any) => {
  console.log('提交表单:', values);
};
</script>

<template>
  <Page auto-content-height>
    <div class="p-6">
      <h2 class="text-xl font-bold mb-6">用户信息</h2>
      <Form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="onFinish"
      >
        <Form.Item label="用户名" name="username">
          <Input v-model:value="formState.username" placeholder="请输入用户名" />
        </Form.Item>
        
        <Form.Item label="昵称" name="nickname">
          <Input v-model:value="formState.nickname" placeholder="请输入昵称" />
        </Form.Item>
        
        <Form.Item label="邮箱" name="email">
          <Input v-model:value="formState.email" placeholder="请输入邮箱" />
        </Form.Item>
        
        <Form.Item label="手机号" name="phone">
          <Input v-model:value="formState.phone" placeholder="请输入手机号" />
        </Form.Item>
        
        <Form.Item label="状态" name="status">
          <Select v-model:value="formState.status">
            <Select.Option value="active">启用</Select.Option>
            <Select.Option value="inactive">禁用</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" html-type="submit">保存</Button>
        </Form.Item>
      </Form>
    </div>
  </Page>
</template>
