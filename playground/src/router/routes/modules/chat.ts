import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:chat',
      order: 15,
      title: '聊天',
    },
    name: 'Chat',
    path: '/chat',
    children: [
      {
        name: 'ChatIndex',
        path: '/chat',
        component: () => import('#/views/chat/index.vue'),
        meta: {
          icon: 'mdi:chat',
          title: '聊天室',
        },
      },
      {
        name: 'ChatOnlineUsers',
        path: '/chat/online-users',
        component: () => import('#/views/chat/online-users/index.vue'),
        meta: {
          icon: 'mdi:account-multiple',
          title: '在线用户',
        },
      },
    ],
  },
];

export default routes;
