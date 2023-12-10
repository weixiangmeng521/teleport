// Import the required RxJS classes and custom types
import { Subject } from "./subject";
import { EmitDataType } from "./types";

/**
 * Represents a singleton class for handling events using RxJS.
 * @weixiangmeng521
 */
export class TeleportSingleton {
    /**
     * Map to store event subjects by name or symbol.
     */
    protected _eventMap: Map<string | symbol, Subject<any>> = new Map();

    /**
     * Map to store queued event handlers waiting for the event to be created.
     */
    protected _waitQueueMap: Map<string | symbol, ((name: string | symbol) => void)[]> = new Map();

    /**
     * Singleton instance.
     */
    private static _instance: TeleportSingleton;

    /**
     * Private constructor to enforce singleton pattern.
     */
    private constructor() {}

    /**
     * Method to get or create the singleton instance.
     * @returns The singleton instance of TeleportSingleton.
     */
    public static getInstantce(): TeleportSingleton {
        if (!TeleportSingleton._instance) {
            this._instance = new TeleportSingleton();
        }
        return this._instance;
    }

    /**
     * Method to add handlers to the wait queue.
     * @param name - The name or symbol of the event.
     * @param handlers - The event handlers to be added to the wait queue.
     */
    protected _add2WaitMap(name: string | symbol, ...handlers: ((name: string | symbol) => void)[]): void {
        if (this._waitQueueMap.has(name)) {
            const queue = this._waitQueueMap.get(name) ?? [];
            queue.push(...handlers);
            this._waitQueueMap.set(name, queue);
            return;
        }
        this._waitQueueMap.set(name, handlers);
    }

    /**
     * Method to execute queued handlers for a specific event.
     * @param name - The name or symbol of the event.
     */
    protected _fireWaitHandlers(name: string | symbol): void {
        const queue = this._waitQueueMap.get(name) ?? [];
        while (queue.length) {
            const fn = queue.shift();
            fn && fn(name);
        }
        this._waitQueueMap.set(name, []);
    }

    /**
     * Method to emit an event with data and optional callback.
     * @template T - The type of data to be emitted.
     * @param name - The name or symbol of the event.
     * @param data - The data to be emitted with the event.
     * @param callback - Optional callback to be executed after emitting the event.
     */
    public emit<T>(name: string | symbol, data: T, callback?: () => void): TeleportSingleton {
        const emitData: EmitDataType<T> = {
            data: data,
            callback: callback,
        };

        const subject = this._eventMap.get(name);
        if (!subject) {
            const _subject = new Subject<EmitDataType<T>>();
            this._eventMap.set(name, _subject);
            this._add2WaitMap(name, (_name: string | symbol) => {
                const ptr = this._eventMap.get(_name);
                ptr?.next(emitData);
            });
            return this;
        }
        subject.next(emitData);
        return this;
    }

    /**
     * Method to receive an event and handle it with a provided handler.
     * @template T - The type of data received by the event.
     * @param name - The name or symbol of the event.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    public receive<T>(name: string | symbol, handler: (data: T) => void): TeleportSingleton {
        const eventHandler = (emitData: EmitDataType<T>) => {
            handler(emitData.data);
            emitData.callback && emitData.callback();
        };

        const subject = this._eventMap.get(name);
        if (!subject) {
            const ptr = new Subject<any>();
            this._eventMap.set(name, ptr);
            ptr.subscribe({ next: eventHandler });
            return this;
        }

        subject.subscribe({ next: eventHandler });

        if ((this._waitQueueMap.get(name) ?? []).length) {
            this._fireWaitHandlers(name);
        }

        return this;
    }

    /**
     * Method to remove a specific event handler by name.
     * @param name - The name of the event handler to be removed.
     */
    public removeHandle(name: string|symbol): void {
        const subject = this._eventMap.get(name);
        subject?.unsubscribe();
        this._eventMap.delete(name);
    }

    /**
     * Method to remove all event handlers.
     */
    public removeAllHandlers(): void {
        for (const name of this._eventMap.keys()) {
            this.removeHandle(name);
        }
        this._eventMap.clear();
    }

    /**
     * Method to clear both wait queues and event handlers.
     */
    public clear(): void {
        this._waitQueueMap.clear();
        this.removeAllHandlers();
    }
}
