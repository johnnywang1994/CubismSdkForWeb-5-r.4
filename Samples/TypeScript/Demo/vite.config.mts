import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import path from 'path';

export default defineConfig((env: ConfigEnv): UserConfig => {
  let common: UserConfig = {
    server: {
      port: 5000,
      middlewareMode: false,
    },
    root: './',
    base: '/',
    publicDir: './public',
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@framework': path.resolve(__dirname, '../../../Framework/src'),
      }
    },
    build: {
      target: 'modules',
      assetsDir: 'assets',
      outDir: './dist',
      sourcemap: env.mode == 'development' ? true : false,
      lib: {
        entry: path.resolve(__dirname, 'src/main.ts'),
        name: 'Live2d',
        formats: ['umd'],
        fileName: (format) => 'bundle.js'
      },
      rollupOptions: {
        output: {
          // 導出為全局變量
          format: "umd",
          name: 'Live2d',
          extend: true,
        }
      }
    },
  };
  return common;
});
