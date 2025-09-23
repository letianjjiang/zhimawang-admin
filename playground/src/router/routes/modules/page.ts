import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:page-layout-header',
      order: 25,
      title: '页面管理',
    },
    name: 'Page',
    path: '/page',
    children: [
      {
        name: 'PageList',
        path: '/page/list',
        component: () => import('#/views/page/list/index.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: '页面列表',
        },
      },
      {
        name: 'PageCompose',
        path: '/page/compose',
        component: () => import('#/views/page/compose/index.vue'),
        meta: {
          icon: 'mdi:plus',
          title: '页面编排',
        },
      },
    ],
  },
];

export default routes;
