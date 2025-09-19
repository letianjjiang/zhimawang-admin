<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, markRaw, ref, useTemplateRef, watch } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

// 国家代码选项
const countryCodeOptions = [
  { label: '+86 中国', value: '+86' },
  { label: '+60 马来西亚', value: '+60' },
];

// 选中的国家代码
const selectedCountryCode = ref('+86');

// 手机号最大长度
const phoneMaxLength = ref(11);

// 根据国家代码获取手机号长度要求
const getPhoneLengthRule = (countryCode: string) => {
  switch (countryCode) {
    case '+60': {
      return { min: 10, max: 11, message: '马来西亚手机号为10-11位数字' };
    }
    case '+86': {
      return { min: 11, max: 11, message: '中国手机号必须是11位数字' };
    }
    default: {
      return { min: 10, max: 11, message: '手机号长度为10-11位数字' };
    }
  }
};

// 监听国家代码变化，更新手机号最大长度
watch(selectedCountryCode, (newCode) => {
  const rule = getPhoneLengthRule(newCode);
  phoneMaxLength.value = rule.max;
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenSelect',
      componentProps: {
        placeholder: '选择国家代码',
        options: countryCodeOptions,
        allowClear: false,
        defaultValue: '+86',
      },
      fieldName: 'countryCode',
      label: '国家代码',
      rules: z.string().min(1, { message: '请选择国家代码' }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入手机号（仅数字）',
        maxlength: phoneMaxLength.value,
      },
      fieldName: 'phoneNumber',
      label: '手机号',
      rules: z
        .string()
        .min(1, { message: '请输入手机号' })
        .regex(/^\d+$/, { message: '手机号只能包含数字' })
        .refine(
          (value) => {
            const countryCode = selectedCountryCode.value;
            const rule = getPhoneLengthRule(countryCode);
            return value.length >= rule.min && value.length <= rule.max;
          },
          {
            message: '手机号长度不符合要求',
          },
        ),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: '请输入密码',
      },
      fieldName: 'identifier',
      label: '密码',
      rules: z.string().min(1, { message: '请输入密码' }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  ];
});

const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationLogin>>('loginRef');

async function onSubmit(params: Recordable<any>) {
  // 更新选中的国家代码
  selectedCountryCode.value = params.countryCode;

  // 组合完整的手机号格式
  const fullPhone = `${params.countryCode}${params.phoneNumber}`;

  // 添加登录类型参数
  const loginParams = {
    type: 'password' as const,
    phone: fullPhone,
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
  />
</template>
