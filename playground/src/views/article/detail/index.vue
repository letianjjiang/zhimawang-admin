<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">文章详情</h1>
    <div class="bg-white p-6 rounded-lg shadow">
      <p>这里是文章详情页面</p>
      <p v-if="route.params.id">文章ID: {{ route.params.id }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
