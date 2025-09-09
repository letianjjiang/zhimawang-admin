import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:account-circle',
      order: 22,
      title: $t('personal.title'),
    },
    name: 'Personal',
    path: '/personal',
    component: () => import('#/views/personal/index.vue'),
    children: [
      {
        name: 'PersonalProfile',
        path: '/personal/profile',
        component: () => import('#/views/personal/profile/index.vue'),
        meta: {
          icon: 'mdi:account',
          title: $t('personal.profile.title'),
        },
      },
      {
        name: 'PersonalSettings',
        path: '/personal/settings',
        component: () => import('#/views/personal/settings/index.vue'),
        meta: {
          icon: 'mdi:cog',
          title: $t('personal.settings.title'),
        },
      },
      {
        name: 'PersonalSecurity',
        path: '/personal/security',
        component: () => import('#/views/personal/security/index.vue'),
        meta: {
          icon: 'mdi:shield-lock',
          title: $t('personal.security.title'),
        },
      },
    ],
  },
];

export default routes;


