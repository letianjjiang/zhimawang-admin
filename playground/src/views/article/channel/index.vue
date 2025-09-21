<script lang="ts" setup>
import type { ArticleApi } from '#/api/core/article';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { getChannelListApi } from '#/api/core/article';

// 响应式数据
const selectedPageId = ref<number | undefined>(undefined);
const channelList = ref<ArticleApi.ChannelItem[]>([]);
const studyAbroadChannels = ref<ArticleApi.ChannelItem[]>([]);
const loading = ref(false);

// 表格列配置
const columns = [
  {
    title: '序号',
    key: 'index',
    width: 80,
    customRender: ({ index }: { index: number }) => index + 1,
  },
  {
    title: '频道图标',
    key: 'channelImg',
    width: 80,
  },
  {
    title: '频道ID',
    dataIndex: 'channelId',
    key: 'channelId',
    width: 100,
  },
  {
    title: '频道名称',
    dataIndex: 'channelName',
    key: 'channelName',
    ellipsis: true,
  },
  {
    title: '频道类型',
    dataIndex: 'channelType',
    key: 'channelType',
    width: 100,
  },
  {
    title: '父频道ID',
    dataIndex: 'parentId',
    key: 'parentId',
    width: 100,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 100,
  },
  {
    title: '操作',
    key: 'operation',
    width: 120,
    fixed: 'right',
  },
];

// 页面类型改变处理
const handlePageTypeChange = (pageId: number) => {
  selectedPageId.value = pageId;
  loadChannelList();
};

// 加载频道列表
const loadChannelList = async () => {
  if (!selectedPageId.value) {
    message.warning('请先选择页面类型');
    return;
  }

  loading.value = true;
  try {
    const response = await getChannelListApi(selectedPageId.value);
    channelList.value = response || [];
    message.success(`成功加载 ${channelList.value.length} 个频道`);
  } catch (error) {
    console.error('加载频道列表失败:', error);
    message.error('加载频道列表失败，请稍后重试');
    channelList.value = [];
  } finally {
    loading.value = false;
  }
};

// 加载留学圈频道列表
const loadStudyAbroadChannels = async () => {
  try {
    const response = await getChannelListApi(5); // pageId = 5 是留学圈
    studyAbroadChannels.value = response || [];
    // console.log('留学圈频道加载成功:', studyAbroadChannels.value);
  } catch (error) {
    console.error('加载留学圈频道失败:', error);
    studyAbroadChannels.value = [];
  }
};

// 查看频道详情
const viewChannelDetail = (channel: ArticleApi.ChannelItem) => {
  message.info(`频道详情：${channel.channelName} (ID: ${channel.channelId})`);
  // 这里可以添加跳转到频道详情页面的逻辑
};

// 组件挂载时的初始化
onMounted(() => {
  // 默认选择小红书页面类型
  selectedPageId.value = 4;
  loadChannelList();
  // 同时加载留学圈频道
  loadStudyAbroadChannels();
});
</script>

<template>
  <Page>
    <template #title>
      {{ $t('article.channel.list.title') }}
    </template>

    <div class="p-4">
      <!-- 页面类型选择器 -->
      <div class="mb-4">
        <a-row :gutter="16" align="middle">
          <a-col :span="6">
            <a-select
              v-model:value="selectedPageId"
              :placeholder="$t('article.channel.selectPageType')"
              style="width: 100%"
              @change="handlePageTypeChange"
            >
              <a-select-option :value="4">小红书 (pageId: 4)</a-select-option>
              <a-select-option :value="5">留学圈 (pageId: 5)</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-button
              type="primary"
              :loading="loading"
              @click="loadChannelList"
            >
              {{ $t('article.channel.refresh') }}
            </a-button>
          </a-col>
        </a-row>
      </div>

      <!-- 频道信息显示 -->
      <div v-if="channelList.length > 0" class="mb-4">
        <a-card title="频道列表" size="small">
          <div class="channel-list">
            <p>
              <strong>当前页面类型：</strong
              >{{ selectedPageId === 4 ? '小红书' : '留学圈' }}
            </p>
            <p><strong>频道总数：</strong>{{ channelList.length }} 个</p>
            <p><strong>频道列表：</strong></p>
            <ul class="channel-items">
              <li
                v-for="channel in channelList"
                :key="channel.channelId"
                class="channel-item"
              >
                <span class="channel-id">[{{ channel.channelId }}]</span>
                <span class="channel-name">{{ channel.channelName }}</span>
                <a-tag
                  :color="channel.channelType === 1 ? 'blue' : 'default'"
                  size="small"
                >
                  {{ channel.channelType === 1 ? '子频道' : '主频道' }}
                </a-tag>
                <span class="channel-sort">排序: {{ channel.sort }}</span>
              </li>
            </ul>
          </div>
        </a-card>
      </div>

      <!-- 留学圈频道列表 -->
      <div v-if="studyAbroadChannels.length > 0" class="mb-4">
        <a-card title="留学圈频道列表" size="small">
          <div class="channel-list">
            <p><strong>页面类型：</strong>留学圈 (pageId: 5)</p>
            <p>
              <strong>频道总数：</strong>{{ studyAbroadChannels.length }} 个
            </p>
            <p><strong>频道列表：</strong></p>
            <ul class="channel-items study-abroad">
              <li
                v-for="channel in studyAbroadChannels"
                :key="channel.channelId"
                class="channel-item"
              >
                <span class="channel-id">[{{ channel.channelId }}]</span>
                <span class="channel-name">{{ channel.channelName }}</span>
                <a-tag
                  :color="channel.channelType === 1 ? 'green' : 'default'"
                  size="small"
                >
                  {{ channel.channelType === 1 ? '子频道' : '主频道' }}
                </a-tag>
                <span class="channel-sort">排序: {{ channel.sort }}</span>
                <span class="parent-id">父频道: {{ channel.parentId }}</span>
              </li>
            </ul>
          </div>
        </a-card>
      </div>

      <!-- 频道列表表格 -->
      <a-table
        :columns="columns"
        :data-source="channelList"
        :loading="loading"
        :pagination="false"
        row-key="channelId"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'channelImg'">
            <a-avatar
              v-if="record.channelImgUrl"
              :src="record.channelImgUrl"
              :size="32"
            />
            <a-avatar v-else :size="32">
              {{ record.channelName.charAt(0) }}
            </a-avatar>
          </template>
          <template v-else-if="column.key === 'channelType'">
            <a-tag :color="record.channelType === 1 ? 'blue' : 'default'">
              {{ record.channelType === 1 ? '子频道' : '主频道' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-space>
              <a-button
                type="link"
                size="small"
                @click="viewChannelDetail(record)"
              >
                查看详情
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- 空状态 -->
      <a-empty
        v-if="!loading && channelList.length === 0 && selectedPageId"
        description="暂无频道数据"
        class="mt-8"
      />
    </div>
  </Page>
</template>

<style scoped>
.p-4 {
  padding: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-8 {
  margin-top: 32px;
}

.channel-list {
  font-size: 14px;
  line-height: 1.6;
}

.channel-list p {
  margin-bottom: 8px;
}

.channel-items {
  padding: 0;
  margin: 8px 0 0;
  list-style: none;
}

.channel-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 6px;
  background-color: #f8f9fa;
  border-left: 3px solid #1890ff;
  border-radius: 6px;
}

.channel-id {
  min-width: 60px;
  margin-right: 8px;
  font-size: 12px;
  color: #666;
}

.channel-name {
  flex: 1;
  margin-right: 12px;
  font-weight: 500;
}

.channel-sort {
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}

.parent-id {
  padding: 2px 6px;
  margin-left: 8px;
  font-size: 11px;
  color: #666;
  background-color: #e6f7ff;
  border-radius: 3px;
}

/* 留学圈频道特殊样式 */
.study-abroad .channel-item {
  background-color: #f6ffed;
  border-left-color: #52c41a;
}

.study-abroad .channel-item:hover {
  background-color: #f0f9ff;
}
</style>
