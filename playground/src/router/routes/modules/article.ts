import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:file-document-outline',
      order: 10,
      title: $t('article.title'),
    },
    name: 'Article',
    path: '/article',
    children: [
      {
        name: 'ArticleList',
        path: '/article/list',
        component: () => import('#/views/article/list/list.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: $t('article.list.title'),
        },
      },
      {
        name: 'ArticleAdd',
        path: '/article/add',
        component: () => import('#/views/article/edit/index.vue'),
        meta: {
          icon: 'mdi:plus',
          title: $t('article.add.title'),
        },
      },
      {
        name: 'ArticleEdit',
        path: '/article/edit/:id',
        component: () => import('#/views/article/edit/index.vue'),
        meta: {
          icon: 'mdi:pencil',
          title: $t('article.edit.title'),
          hideInMenu: true,
        },
      },
      {
        name: 'ArticleDetail',
        path: '/article/detail/:id',
        component: () => import('#/views/article/detail/index.vue'),
        meta: {
          icon: 'mdi:eye',
          title: $t('article.detail.title'),
          hideInMenu: true,
        },
      },
      {
        name: 'ArticleCategory',
        path: '/article/category',
        component: () => import('#/views/article/category/index.vue'),
        meta: {
          icon: 'mdi:tag-multiple',
          title: $t('article.category.title'),
        },
      },
      {
        name: 'ArticleTag',
        path: '/article/tag',
        component: () => import('#/views/article/tag/index.vue'),
        meta: {
          icon: 'mdi:tag',
          title: $t('article.tag.title'),
        },
      },
      {
        name: 'ArticleType1',
        path: '/article/1',
        component: () => import('#/views/article/type1/list.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: '文章列表',
        },
      },
      {
        name: 'ArticleType2',
        path: '/article/2',
        component: () => import('#/views/article/type2/list.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: '论坛列表',
        },
      },
      {
        name: 'ArticleType3',
        path: '/article/3',
        component: () => import('#/views/article/type3/list.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: '流贴列表',
        },
      },
    ],
  },
];

export default routes;
