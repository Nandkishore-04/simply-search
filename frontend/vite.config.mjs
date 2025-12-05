import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './', // Important for Electron to load files correctly
    build: {
        outDir: 'build', // Keep same output directory as CRA for compatibility
        emptyOutDir: true,
        rollupOptions: {
            output: {
                // Ensure consistent asset naming for Electron
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    },
    server: {
        port: 3000, // Keep same port as CRA
        strictPort: true,
        open: false, // Don't auto-open browser
        watch: {
            // Exclude directories we don't need to watch
            ignored: ['**/electron/**', '**/build/**', '**/dist/**', '**/node_modules/**']
        }
    },
    optimizeDeps: {
        exclude: ['electron'] // Don't try to optimize electron
    }
});
