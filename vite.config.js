import path from 'path';
import checker from 'vite-plugin-checker';
import { loadEnv, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const PORT = 3031;
const BACKEND_PORT = 3000;

const env = loadEnv('all', process.cwd());

export default defineConfig({
  // base: env.VITE_BASE_PATH,
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  optimizeDeps: {
    include: [
      'prop-types',
      '@emotion/react',
      '@emotion/styled',
      '@mui/styled-engine',
      '@mui/material',
      '@mui/material/styles',
      '@mui/material/CssBaseline',
      '@mui/material/Box',
      '@mui/system',
      '@mui/utils',
    ],
  },
  resolve: {
    dedupe: ['react', 'react-dom', '@mui/material', '@mui/system', '@mui/utils'],
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: PORT,
    host: true,
    // Proxy API to backend so Admin + Vendor Web can run together (avoids browser connection limit to localhost:3000)
    proxy: {
      '/api': {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
      },
    },
  },
  preview: { port: PORT, host: true },
});
