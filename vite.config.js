import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      protocol: 'wss',
      host: 'e6be-2402-d000-8130-7b0b-9d04-ecd6-3e71-5b8c.ngrok-free.app',
      port: 443,
    },
  }
});
