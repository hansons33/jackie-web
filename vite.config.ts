import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import pxToRem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';
import { createHtmlPlugin } from 'vite-plugin-html';
import legacy from '@vitejs/plugin-legacy';
import vitePluginImp from 'vite-plugin-imp';
import { name } from './package.json';

import path from 'path';
// https://vitejs.dev/config/
function pathResolve(str: string) {
    return path.resolve(__dirname, str);
}
export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    console.log(mode, env);
    return defineConfig({
        plugins: [
            react(),
            vitePluginImp({
                // 按需加载antd-mobile
                libList: [
                    {
                        libName: 'antd-mobile',
                        libDirectory: 'es/components',
                        style: () => {
                            return true;
                        }
                    }
                ]
            }),
            legacy({
                // 兼容老版本浏览器，polyfill（vite会先判断是否需要polyfill，按需加载polyfill文件）
                targets: ['chrome 37'],
                modernPolyfills: true
            }),
            createHtmlPlugin({
                // index.html注入模板配置
                template: 'index.html',
                inject: {
                    data: {
                        // 页面title默认取自项目名称,apollo配置也根据项目名取,非开发环境取域名origin区分环境
                        title: name,
                        configPath:
                            env.VITE_CONFIG_FILE_ORIGIN || (window as any).location.origin + `/web-conf/${name}-conf.js`
                    }
                }
            })
        ],
        resolve: {
            alias: {
                '@': pathResolve('src'),
                components: pathResolve('src/components'),
                assets: pathResolve('src/assets'),
                pages: pathResolve('src/pages'),
                service: pathResolve('src/service'),
                hooks: pathResolve('src/hooks')
            }
        },
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_PROXY_TARGET,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, '')
                }
            },
            port: 4000
        },
        css: {
            preprocessorOptions: {
                less: {
                    additionalData: '@import "./src/global.less";'
                }
            },
            postcss: {
                plugins: [
                    autoprefixer(),
                    pxToRem({
                        rootValue: 37.5,
                        unitPrecision: 5,
                        propList: ['*']
                    })
                ]
            }
        },
        base: './', //引入路径相当于webpack中的 baseUrl 或 publicPath
        build: {
            sourcemap: mode === 'development',
            outDir: 'dist',
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]' // 静态资源默认会单独打包出来，但小于assetsInlineLimit(默认4kb)的会转成base64
                }
            }
        },
        optimizeDeps: {
            exclude: ['pdfh5']
        }
    });
};
