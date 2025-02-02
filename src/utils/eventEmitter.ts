type EventType = string | number;
export type BaseEvents = Record<EventType, any[]>;
// event[type] = callback[]
export class EventEmitter<Events extends BaseEvents> {
    private readonly events = new Map<keyof Events, Function[]>();

    add<E extends keyof Events>(type: E, callback: (...args: Events[E]) => void) {
        const callbacks = this.events.get(type) || [];
        callbacks.push(callback);
        this.events.set(type, callbacks);
        return this;
    }

    removeByType<E extends keyof Events>(type: E) {
        this.events.delete(type);
        return this;
    }

    remove<E extends keyof Events>(type: E, callback: (...args: Events[E]) => void) {
        const callbacks = this.events.get(type) || [];
        this.events.set(
            type,
            callbacks.filter((fn: any) => fn !== callback)
        );
        return this;
    }

    emit<E extends keyof Events>(type: E, ...args: Events[E]) {
        const callbacks = this.events.get(type) || [];
        callbacks.map(fn => fn(...args));
        return this;
    }

    listeners<E extends keyof Events>(type: E) {
        return Object.freeze(this.events.get(type) || []);
    }
}
