import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // 知马网API服务器地址
            target: 'http://duducar.cloud:8888',
            ws: true,
          },
        },
      },
    },
  };
});
