<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, markRaw, onMounted, ref, useTemplateRef, watch } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

// 登录类型状态
const loginType = ref<'password' | 'sms'>('password');

const formSchema = computed((): VbenFormSchema[] => {
  const baseSchema: VbenFormSchema[] = [
    {
      component: 'VbenSelect',
      componentProps: {
        placeholder: '请选择登录方式',
        options: [
          { label: '密码登录', value: 'password' },
          { label: '短信登录', value: 'sms' },
        ],
      },
      fieldName: 'type',
      label: '登录方式',
      defaultValue: 'password',
      rules: z.string().min(1, { message: '请选择登录方式' }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入手机号',
      },
      fieldName: 'phone',
      label: '手机号',
      rules: z.string().min(1, { message: '请输入手机号' }),
    },
  ];

  // 根据登录类型添加不同的字段
  if (loginType.value === 'password') {
    baseSchema.push({
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: '请输入密码',
      },
      fieldName: 'identifier',
      label: '密码',
      rules: z.string().min(1, { message: '请输入密码' }),
    });
  } else {
    baseSchema.push({
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入验证码',
        maxlength: 6,
      },
      fieldName: 'identifier',
      label: '验证码',
      rules: z.string().min(1, { message: '请输入验证码' }),
    });
  }

  // 添加验证码组件
  baseSchema.push({
    component: markRaw(SliderCaptcha),
    fieldName: 'captcha',
    rules: z.boolean().refine((value) => value, {
      message: $t('authentication.verifyRequiredTip'),
    }),
  });

  return baseSchema;
});

const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationLogin>>('loginRef');

// 监听登录类型变化，重置表单
watch(loginType, () => {
  const formApi = loginRef.value?.getFormApi();
  if (formApi) {
    // 清空identifier字段
    formApi.setFieldValue('identifier', '', false);
    // 重置验证码
    formApi.setFieldValue('captcha', false, false);
    formApi
      ?.getFieldComponentRef<InstanceType<typeof SliderCaptcha>>('captcha')
      ?.resume();
  }
});

// 处理登录类型选择变化
function onLoginTypeChange(value: 'password' | 'sms') {
  loginType.value = value;
}

// 组件挂载时设置默认值
onMounted(() => {
  const formApi = loginRef.value?.getFormApi();
  if (formApi) {
    formApi.setFieldValue('type', 'password', false);
  }
});

async function onSubmit(params: Recordable<any>) {
  // 使用用户选择的登录类型
  const loginParams = {
    type: params.type as 'password' | 'sms',
    phone: params.phone,
    identifier: params.identifier,
  };

  authStore.authLogin(loginParams).catch(() => {
    // 登陆失败，刷新验证码的演示
    const formApi = loginRef.value?.getFormApi();
    // 重置验证码组件的值
    formApi?.setFieldValue('captcha', false, false);
    // 使用表单API获取验证码组件实例，并调用其resume方法来重置验证码
    formApi
      ?.getFieldComponentRef<InstanceType<typeof SliderCaptcha>>('captcha')
      ?.resume();
  });
}
</script>

<template>
  <AuthenticationLogin
    ref="loginRef"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="onSubmit"
    @field-change="
      (field: string, value: any) => {
        if (field === 'type') {
          onLoginTypeChange(value);
        }
      }
    "
  />
</template>
