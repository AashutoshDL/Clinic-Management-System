import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    host: true, // Or use '0.0.0.0' for explicit binding
    port: 5173, // Optional: Ensure this matches your expected port
  },
  build: {
    outDir: 'dist', // Default build output directory
    base: '/', // Adjust if you're using a subfolder (e.g., '/myapp/')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Add alias for '@/'
    },
  },
});
