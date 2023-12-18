import { Subject } from "./subject";
/**
 * Represents a singleton class for handling events using RxJS.
 * @weixiangmeng521
 */
export declare class TeleportSingleton {
    /**
     * Map to store event subjects by name or symbol.
     */
    protected _eventMap: Map<string | symbol, Subject<any>>;
    /**
     * Map to store queued event handlers waiting for the event to be created.
     */
    protected _waitQueueMap: Map<string | symbol, ((name: string | symbol) => void)[]>;
    /**
     * Singleton instance.
     */
    private static _instance;
    /**
     * Private constructor to enforce singleton pattern.
     */
    private constructor();
    /**
     * Method to get or create the singleton instance.
     * @returns The singleton instance of TeleportSingleton.
     */
    static getInstance(): TeleportSingleton;
    /**
     * Method to add handlers to the wait queue.
     * @param name - The name or symbol of the event.
     * @param handlers - The event handlers to be added to the wait queue.
     */
    protected _add2WaitMap(name: string | symbol, ...handlers: ((name: string | symbol) => void)[]): void;
    /**
     * Method to execute queued handlers for a specific event.
     * @param name - The name or symbol of the event.
     */
    protected _fireWaitHandlers(name: string | symbol): void;
    /**
     * Method to emit an event with data and optional callback.
     * @template T - The type of data to be emitted.
     * @param name - The name or symbol of the event.
     * @param data - The data to be emitted with the event.
     * @param callback - Optional callback to be executed after emitting the event.
     */
    emit<T>(name: string | symbol, data: T, callback?: () => void): TeleportSingleton;
    /**
     * Method to receive an event and handle it with a provided handler.
     * @template T - The type of data received by the event.
     * @param name - The name or symbol of the event.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    receive<T>(name: string | symbol, handler: (data: T) => void): TeleportSingleton;
    /**
     * Method to remove a specific event handler by name.
     * @param name - The name of the event handler to be removed.
     */
    removeHandle(name: string | symbol): void;
    /**
     * Method to remove all event handlers.
     */
    removeAllHandlers(): void;
    /**
     * Method to clear both wait queues and event handlers.
     */
    clear(): void;
}
