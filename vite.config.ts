/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    css: {
        modules: {
            generateScopedName: '[local]_[hash:base64:4]',
            localsConvention: 'camelCaseOnly',
        },
    },
    plugins: [react()],
    resolve: {
        alias: {
            $__mocks__: resolve(__dirname, './client/__mocks__'),
            $__tests__: resolve(__dirname, './client/__tests__'),
            $app: resolve(__dirname, './client/app'),
            $assets: resolve(__dirname, './client/assets'),
            $pages: resolve(__dirname, './client/pages'),
            $shared: resolve(__dirname, './client/shared'),
            $widgets: resolve(__dirname, './client/widgets'),
        },
    },
});
