import { useStore } from '@/store/store';
import { useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
export default function useCacheTab() {
    const setCacheTab = useStore(s => s.setCacheTab);
    const getCacheTab = useStore(s => s.getCacheTab);
    const location = useLocation();
    const path = location.pathname;
    const activeTab = useRef('');
    useEffect(() => {
        return () => {
            // 普通卸载时设置缓存
            if (activeTab.current) {
                setCacheTab(path, activeTab.current);
            }
        };
    }, [path]);
    return useMemo(() => {
        return {
            cachedTab: getCacheTab(path),
            setActiveTab: (activeKey: string) => {
                console.log('activeKey', activeKey);
                activeTab.current = activeKey;
            }
        };
    }, [path]);
}
