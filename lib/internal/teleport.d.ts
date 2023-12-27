import { Subject } from "./subject";
import { LazyTaskQueue } from "./task_queue";
/**
 * @weixiangmeng521
 */
export declare class TeleportSingleton {
    /**
     * Map to store event subjects by name or symbol.
     */
    protected _eventMap: Map<string | symbol, Subject<any>>;
    /**
     * Task queue
     */
    protected _taskQueue: LazyTaskQueue;
    /**
     * Singleton instance.
     */
    private static _instance;
    /**
    * group event map
    */
    private _groupEventMap;
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
     * Generates a unique token representing the combination of events in the provided list.
     * @param nameList - List of event names.
     * @returns The generated token.
     */
    protected _generateMultiEventsToken: (nameList: string[]) => symbol;
    /**
     * Method to add handlers to the wait queue.
     * @param name - The name or symbol of the event.
     * @param handlers - The event handlers to be added to the wait queue.
     */
    protected _add2TaskQueue(name: string | symbol, ...handlers: ((name: string | symbol) => void)[]): void;
    /**
     * Method to execute queued handlers for a specific event.
     * @param name - The name or symbol of the event.
     */
    protected _fireTaskQueue(name: string | symbol): void;
    /**
     * Method to emit an event with data and optional callback.
     * @template T - The type of data to be emitted.
     * @param name - The name or symbol of the event.
     * @param data - The data to be emitted with the event.
     * @param callback - Optional callback to be executed after emitting the event.
     */
    emit<T>(name: string | symbol, data: T, callback?: () => void): TeleportSingleton;
    /**
     * After emit data then execute.
     * @param name event name
     */
    private _afterEmit;
    /**
     * Method to receive an event and handle it with a provided handler.
     * @param name - The name or symbol of the event.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    receive(name: string | symbol, handler: (data: any) => void): {
        clear: () => void;
    };
    /**
     * Method to handle multiple events with a common handler.
     * @param nameList - The list of event names.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    multiReceive(nameList: string[], handler: (...data: any[]) => void): {
        clear: () => void;
    };
    /**
     * Method to remove a specific event handler by name.
     * @param name - The name of the event handler to be removed.
     */
    removeHandle(name: string | symbol): void;
    /**
     * Remove one of the multi handle
     * @param nameList
     */
    removeMultiHandle(nameList: string[]): void;
    /**
     * Method to remove all event handlers.
     */
    removeAllHandlers(): void;
    /**
     * Method to clear both wait queues and event handlers.
     */
    clear(): void;
}
