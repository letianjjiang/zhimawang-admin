import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:view-grid-outline',
      order: 11,
      title: $t('section.title'),
    },
    name: 'Section',
    path: '/section',
    children: [
      {
        name: 'SectionList',
        path: '/section/list',
        component: () => import('#/views/section/list/index.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: $t('section.list.title'),
        },
      },
      {
        name: 'SectionAdd',
        path: '/section/add',
        component: () => import('#/views/section/edit/index.vue'),
        meta: {
          icon: 'mdi:plus',
          title: $t('section.add.title'),
        },
      },
      {
        name: 'SectionEdit',
        path: '/section/edit/:id',
        component: () => import('#/views/section/edit/index.vue'),
        meta: {
          icon: 'mdi:pencil',
          title: $t('section.edit.title'),
          hideInMenu: true,
        },
      },
      {
        name: 'SectionDetail',
        path: '/section/detail/:id',
        component: () => import('#/views/section/detail/index.vue'),
        meta: {
          icon: 'mdi:eye',
          title: $t('section.detail.title'),
          hideInMenu: true,
        },
      },
    ],
  },
];

export default routes;
