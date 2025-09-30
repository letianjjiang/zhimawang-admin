import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:account-group',
      order: 30,
      title: $t('roles.title'),
    },
    name: 'Roles',
    path: '/roles',
    children: [
      {
        path: '/roles/users',
        name: 'RolesUsers',
        meta: {
          icon: 'mdi:account-multiple',
          title: $t('roles.users.title'),
        },
        component: () => import('#/views/roles/users/index.vue'),
      },
      {
        path: '/roles/list',
        name: 'RolesList',
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: $t('roles.list.title'),
        },
        component: () => import('#/views/roles/list/index.vue'),
      },
      {
        path: '/roles/channels',
        name: 'RolesChannels',
        meta: {
          icon: 'mdi:source-branch',
          title: $t('roles.channels.title'),
        },
        component: () => import('#/views/roles/channels/index.vue'),
      },
    ],
  },
];

export default routes;
