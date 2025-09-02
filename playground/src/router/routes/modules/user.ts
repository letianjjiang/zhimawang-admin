import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:account-group',
      order: 20,
      title: $t('user.title'),
    },
    name: 'User',
    path: '/user',
    component: () => import('#/views/user/index.vue'),
    children: [
      {
        name: 'UserList',
        path: '/user/list',
        component: () => import('#/views/user/list/index.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: $t('user.list.title'),
        },
      },
      {
        name: 'UserAdd',
        path: '/user/add',
        component: () => import('#/views/user/edit/index.vue'),
        meta: {
          icon: 'mdi:plus',
          title: $t('user.add.title'),
        },
      },
      {
        name: 'UserEdit',
        path: '/user/edit/:id',
        component: () => import('#/views/user/edit/index.vue'),
        meta: {
          icon: 'mdi:pencil',
          title: $t('user.edit.title'),
          hideInMenu: true,
        },
      },
      {
        name: 'UserDetail',
        path: '/user/detail/:id',
        component: () => import('#/views/user/detail/index.vue'),
        meta: {
          icon: 'mdi:eye',
          title: $t('user.detail.title'),
          hideInMenu: true,
        },
      },
    ],
  },
];

export default routes;
