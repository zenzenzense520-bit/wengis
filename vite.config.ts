import { defineConfig } from 'vite';

// Vite 配置：固定开发/预览端口，避免与本机其他项目冲突
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 43200,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 43201,
    strictPort: true,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
