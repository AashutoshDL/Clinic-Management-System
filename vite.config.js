import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Or use '0.0.0.0' for explicit binding
    port: 5173, // Optional: Ensure this matches your expected port
  },
  build: {
    outDir: 'dist', // Default build output directory
    // If needed, set a base path for production deployment (e.g., if serving from a subdirectory)
    base: '/',  // Adjust if you're using a subfolder (e.g., '/myapp/')
  },
});