<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ isEdit ? '编辑板块' : '新增板块' }}</h1>
    <div class="bg-white p-6 rounded-lg shadow">
      <p>这里是板块编辑页面</p>
      <p v-if="route.params.id">板块ID: {{ route.params.id }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id);
</script>
