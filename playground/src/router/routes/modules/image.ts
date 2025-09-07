import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:image-multiple-outline',
      order: 20,
      title: $t('image.title'),
    },
    name: 'Image',
    path: '/image',
    children: [
      {
        name: 'ImageList',
        path: '/image/list',
        component: () => import('#/views/image/list/index.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: $t('image.list.title'),
        },
      },
      {
        name: 'ImageAds',
        path: '/image/ads',
        component: () => import('#/views/image/ads/index.vue'),
        meta: {
          icon: 'mdi:bullhorn-outline',
          title: $t('image.ads.title'),
        },
      },
      {
        name: 'ImageAvatars',
        path: '/image/avatars',
        component: () => import('#/views/image/avatars/index.vue'),
        meta: {
          icon: 'mdi:account-circle-outline',
          title: $t('image.avatars.title'),
        },
      },
    ],
  },
];

export default routes;


