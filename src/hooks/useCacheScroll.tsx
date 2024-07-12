import { useStore } from '@/store/store';
import { useMemo, useRef } from 'react';
export default function useCacheScroll<T = any>() {
    const getCacheScroll = useStore(s => s.getCacheScroll);
    const setCacheScroll = useStore(s => s.setCacheScroll);
    const idRef = useRef('');
    return useMemo(() => {
        return {
            setScroll(id: string, data: any) {
                idRef.current = id;
                setCacheScroll<T>(id, data);
            },
            scrollData: (id: string) => {
                return getCacheScroll<T>(id);
            }
        };
    }, []);
}
