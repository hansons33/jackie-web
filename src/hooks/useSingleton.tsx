import { useRef } from 'react';

export default function useSingleton(callback: Function) {
    const called = useRef(false);

    if (called.current) return;

    callback();

    called.current = true;
}
