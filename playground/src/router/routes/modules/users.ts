import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:account-multiple',
      order: 21,
      title: '关注管理',
    },
    name: 'UsersFollow',
    path: '/users',
    component: () => import('#/views/users/index.vue'),
    children: [
      {
        name: 'UsersFollowing',
        path: '/users/following',
        component: () => import('#/views/users/following/index.vue'),
        meta: {
          icon: 'mdi:account-arrow-right',
          title: '我关注的人',
        },
      },
      {
        name: 'UsersFollowers',
        path: '/users/followers',
        component: () => import('#/views/users/followers/index.vue'),
        meta: {
          icon: 'mdi:account-arrow-left',
          title: '关注我的人',
        },
      },
      {
        name: 'UsersCounts',
        path: '/users/counts',
        component: () => import('#/views/users/counts/index.vue'),
        meta: {
          icon: 'mdi:counter',
          title: '关注统计',
        },
      },
      {
        name: 'UsersMutual',
        path: '/users/mutual',
        component: () => import('#/views/users/mutual/index.vue'),
        meta: {
          icon: 'mdi:account-check',
          title: '互相关注',
        },
      },
    ],
  },
];

export default routes;


