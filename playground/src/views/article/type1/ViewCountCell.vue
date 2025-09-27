<script lang="ts" setup>
import { ref, onMounted } from 'vue';

interface Props {
  articleId: number;
  fetchViewCount: (articleId: number) => Promise<number>;
}

const props = defineProps<Props>();

const loading = ref(true);
const viewCount = ref<number>(0);

const loadViewCount = async () => {
  try {
    loading.value = true;
    viewCount.value = await props.fetchViewCount(props.articleId);
  } catch (error) {
    console.error(`加载文章 ${props.articleId} 浏览量失败:`, error);
    viewCount.value = 0;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadViewCount();
});
</script>

<template>
  <span v-if="loading" class="text-gray-400 text-sm">加载中...</span>
  <span v-else class="text-gray-700">{{ viewCount.toLocaleString() }}</span>
</template>
