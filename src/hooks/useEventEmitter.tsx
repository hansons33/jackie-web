import { DependencyList, useCallback, useContext, useEffect, useMemo } from 'react';
import { BaseEvents, EventEmitter } from '@/utils/eventEmitter';
import { PropsWithChildren, createContext } from 'react';

export const EventEmitterContext = createContext<EventEmitter<any>>(null as any);
export function EventEmitterRC<T extends BaseEvents>(props: PropsWithChildren<{ value: EventEmitter<T> }>) {
    return <EventEmitterContext.Provider value={props.value}>{props.children}</EventEmitterContext.Provider>;
}

function useEmit<Events extends BaseEvents>() {
    const em = useContext(EventEmitterContext);
    return useCallback(
        <E extends keyof Events>(type: E, ...args: Events[E]) => {
            console.log('emitter emit: ', type, ...args);
            em.emit(type, ...args);
        },
        [em]
    );
}

export default function useEventEmitter<Events extends BaseEvents>() {
    const emit = useEmit<Events>();
    const emitter = useMemo<EventEmitter<any>>(() => {
        return new EventEmitter<Events>();
    }, []);
    return {
        emit,
        emitter,
        useListener: <E extends keyof Events>(
            type: E,
            listener: (...args: Events[E]) => void,
            deps: DependencyList = []
        ) => {
            const em = useContext(EventEmitterContext);
            console.log(type, '添加监听事件', em);
            useEffect(() => {
                em.add(type, listener);
                return () => {
                    em.remove(type, listener);
                };
            }, [type, listener, ...deps]);
        }
    };
}
