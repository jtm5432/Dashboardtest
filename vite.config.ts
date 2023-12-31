import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    
    port: 3001
  },
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  base: '/Dashboardtest/'
});
