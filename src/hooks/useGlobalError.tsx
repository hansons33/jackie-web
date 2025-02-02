import { useLayoutEffect } from 'react';

export default function useGlobalError() {
    useLayoutEffect(() => {
        window.onerror = function (message, url, line, column, error) {
            if (message == 'ResizeObserver loop limit exceeded') {
                return;
            }
            console.warn('onerror:', message, url, line, column, error);
        };
        // new Image错误，不能捕获
        // fetch错误，不能捕获
        window.addEventListener(
            'error',
            error => {
                const { message } = error;
                if (error instanceof ErrorEvent && message === 'ResizeObserver loop limit exceeded') {
                    return;
                }
                console.warn('addEventListener.error', error);
            },
            true
        );
        // 全局统一处理Promise
        window.addEventListener('unhandledrejection', function (e) {
            console.warn('addEventListener.unhandledrejection ：', e);
        });
    }, []);
    return true;
}
