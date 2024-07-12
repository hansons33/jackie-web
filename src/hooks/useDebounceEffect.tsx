import { DependencyList, useEffect, useMemo, useCallback, useState } from 'react';
import { debounce } from '@/utils/utils';
import { useUpdateEffect } from './useUpdateEffect';
export const useDebounceEffect = (fn: () => void, deps: DependencyList, delay: number) => {
    const [flag, setFlag] = useState({});
    const run = useCallback(
        debounce(() => {
            setFlag({});
        }, delay),
        []
    );
    useEffect(() => {
        run();
    }, deps); // 依赖变化触发该组件的更新
    useUpdateEffect(fn, [flag]);
};
