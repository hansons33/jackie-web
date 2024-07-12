import { DependencyList, useEffect, useRef, useState } from 'react';
export function useUpdateEffect(effect: () => void, deps: DependencyList) {
    const isMounted = useRef(false);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            return effect();
        }
    }, deps);
}
