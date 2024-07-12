import React, { useEffect } from 'react';

export default function useRaceCondition<T>(fn: Promise<T>, handler: (res: T) => void, deps: React.DependencyList) {
    useEffect(() => {
        let didCancel = false;
        fn.then(res => {
            if (!didCancel) {
                handler(res);
            }
        });
        return () => {
            didCancel = true;
        };
    }, deps);
}
