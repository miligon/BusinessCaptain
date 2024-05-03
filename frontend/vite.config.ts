import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  return {
    base: isProduction ? '/static/react/' : '/', // Equivalent to publicPath in Vue
    build: {
      outDir: './dist/static/react/', // Equivalent to outputDir in Vue
    },
    plugins: [react(), tsconfigPaths()],
    server: {
      open: './',
    },
  };
});
