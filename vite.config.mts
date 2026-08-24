import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'lucide-react-native': 'lucide-react',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
