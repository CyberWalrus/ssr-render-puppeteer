/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react-swc';
// @ts-ignore
// import { generate } from 'critical';
// import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

// const generateCriticalCSS = () => ({
// apply: 'build' as const,
// async closeBundle() {
// try {
// const criticalCSS = await generate({
// base: resolve('dist'),
// inline: true,
// src: 'dist/index.html',
// target: 'dist/index.html',
// });
//
// writeFileSync(resolve('dist', 'index.html'), criticalCSS.html as string);
// } catch (error) {
// console.error('Critical CSS generation failed: ', error);
// }
// },
// enforce: 'post' as const,
//
// name: 'vite-plugin-critical',
// });

export default defineConfig({
    css: {
        modules: {
            generateScopedName: '[local]_[hash:base64:4]',
            localsConvention: 'camelCaseOnly',
        },
    },
    plugins: [
        react(),
        // generateCriticalCSS(),
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            filter: (fileName) => /\.(js|css|html|svg)$/.test(fileName),
            threshold: 0,
        }),
        viteCompression({
            algorithm: 'gzip',
            filter: (fileName) => /\.(js|css|html|svg)$/.test(fileName),
            threshold: 0,
        }),
    ],
    resolve: {
        alias: {
            $__mocks__: resolve(__dirname, './src/__mocks__'),
            $__tests__: resolve(__dirname, './src/__tests__'),
            $app: resolve(__dirname, './src/app'),
            $assets: resolve(__dirname, './src/assets'),
            $pages: resolve(__dirname, './src/pages'),
            $shared: resolve(__dirname, './src/shared'),
            $widgets: resolve(__dirname, './src/widgets'),
        },
    },
});
