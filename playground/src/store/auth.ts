import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getAccessCodesApi, getUserInfoApi, loginApi, logoutApi } from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   * @param onSuccess 成功之后的回调函数
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      const response = await loginApi(params);

      // 如果成功获取到 token
      if (response.token) {
        accessStore.setAccessToken(response.token);

        // 存储refreshToken和sessionId
        if (response.refreshToken) {
          accessStore.setRefreshToken(response.refreshToken);
        }
        if (response.sessionId) {
          accessStore.setSessionId(response.sessionId);
        }

        // 从登录响应中直接获取用户信息，避免额外请求
        userInfo = {
          userId: response.userId,
          username: response.username,
          realName: response.nickname || response.username,
          avatar: '', // 登录响应中没有头像信息
          homePath: preferences.app.defaultHomePath,
          phone: response.phone,
          role: response.role,
        };

        userStore.setUserInfo(userInfo);

        // 获取权限码（知马网API暂不支持，返回空数组）
        const accessCodes = await getAccessCodesApi();
        accessStore.setAccessCodes(accessCodes);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo?.homePath || preferences.app.defaultHomePath,
              );
        }

        if (userInfo?.realName) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }

    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null;
    const response = await getUserInfoApi();

    // 将API返回的用户信息转换为系统需要的格式
    userInfo = {
      userId: response.userId?.toString() || '',
      username: response.username || '',
      realName: response.nickname || response.username || '',
      avatar: response.userAvatar || '',
      roles: response.role ? [response.role] : [],
      nickname: response.nickname,
      ipAddress: response.ipAddress,
      wechatOpenid: response.wechatOpenid,
      userAvatar: response.userAvatar,
      desc: '',
      homePath: preferences.app.defaultHomePath,
      token: '',
    };

    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
