import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Use VITE_BASE_PATH for subpath deployments (e.g. GitHub Pages).
  const base = env.VITE_BASE_PATH || "/";

  return {
  base,
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit'],
          'vendor-ui': ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'framer-motion', 'lucide-react'],
          'vendor-data': ['d3', 'date-fns'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/analytics', 'firebase/firestore']
        }
      }
    }
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }
  };
});