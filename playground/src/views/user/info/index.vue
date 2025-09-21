<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { getUserInfoApi } from '#/api/core/user';
import { VbenAvatar } from '@vben/common-ui';
import { computed, onMounted, ref } from 'vue';

// 用户信息状态
const userInfo = ref<any>(null);
const loading = ref(true);

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true;
    const response = await getUserInfoApi();
    userInfo.value = response;
  } catch (error) {
    console.error('获取用户信息失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserInfo();
});

// 解析IP地址信息
const ipInfo = computed(() => {
  if (!userInfo.value?.ipAddress) return null;
  try {
    const ipData = JSON.parse(userInfo.value.ipAddress);
    if (ipData.ret === 'ok' && ipData.data && Array.isArray(ipData.data)) {
      return {
        ip: ipData.ip,
        country: ipData.data[0] || '',
        province: ipData.data[1] || '',
        city: ipData.data[2] || '',
      };
    }
  } catch (e) {
    console.warn('Failed to parse IP address info:', e);
  }
  return null;
});

// 格式化角色显示
const roleDisplay = computed(() => {
  const role = userInfo.value?.role;
  const roleMap: Record<string, string> = {
    USER: '普通用户',
    ADMIN: '管理员',
    SYS_ADMIN: '系统管理员',
  };
  return roleMap[role || ''] || role || '未知';
});
</script>

<template>
  <Page auto-content-height>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">个人资料</h1>
        <p class="text-gray-600">查看和管理您的个人信息</p>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="userInfo" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- 用户头像和基本信息 -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div class="flex items-center space-x-4">
            <VbenAvatar
              :src="userInfo.userAvatar"
              :alt="userInfo.nickname || userInfo.username"
              :size="80"
              class="ring-4 ring-white/20"
            />
            <div>
              <h2 class="text-xl font-semibold">{{ userInfo.nickname || userInfo.username }}</h2>
              <p class="text-blue-100">{{ userInfo.username }}</p>
              <span class="inline-block px-2 py-1 bg-white/20 rounded-full text-sm mt-1">
                {{ roleDisplay }}
              </span>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 基本信息 -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">基本信息</h3>
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">用户ID</span>
                  <span class="font-medium">{{ userInfo.userId }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">用户名</span>
                  <span class="font-medium">{{ userInfo.username }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">昵称</span>
                  <span class="font-medium">{{ userInfo.nickname || '未设置' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">角色</span>
                  <span class="font-medium">{{ roleDisplay }}</span>
                </div>
              </div>
            </div>

            <!-- 联系信息 -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">联系信息</h3>
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">手机号</span>
                  <span class="font-medium">{{ userInfo.phone || '未设置' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">国际格式</span>
                  <span class="font-medium">{{ userInfo.phoneE164 || '未设置' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">微信OpenID</span>
                  <span class="font-medium">{{ userInfo.wechatOpenid || '未绑定' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- IP地址信息 -->
          <div v-if="ipInfo" class="mt-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">网络信息</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">IP地址</span>
                  <span class="font-medium font-mono">{{ ipInfo.ip }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">国家</span>
                  <span class="font-medium">{{ ipInfo.country }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">省份</span>
                  <span class="font-medium">{{ ipInfo.province }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">城市</span>
                  <span class="font-medium">{{ ipInfo.city }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-gray-500">获取用户信息失败</p>
      </div>
    </div>
  </Page>
</template>
