import { defineConfig } from 'vite';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default defineConfig({
  define: {
    global: 'window'
  },
  optimizeDeps: {
    include: ['sockjs-client', '@stomp/stompjs']
  },
  resolve: {
    alias: {
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6'
    }
  },
  plugins: [],
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()]
    }
  }
});
