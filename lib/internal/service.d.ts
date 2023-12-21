import { TeleportSingleton } from './teleport';
/**
 * The `Teleport` class provides a simplified interface to interact with the underlying `TeleportSingleton` instance.
 * It encapsulates the logic for emitting and receiving events.
 */
export declare class Teleport {
    /**
     * The underlying `TeleportSingleton` instance used for event management.
     */
    private _teleportSingleton;
    /**
     * Constructs a new instance of the `Teleport` class.
     */
    constructor();
    /**
     * Emits an event with the specified name and data.
     * @template T - The type of data to be emitted.
     * @param {string | symbol} name - The name or symbol of the event.
     * @param {T} data - The data to be emitted with the event.
     * @param {() => void} [callback] - Optional callback to be executed after emitting the event.
     * @returns {TeleportSingleton} - The TeleportSingleton instance for chaining.
     */
    emit<T>(name: string | symbol, data: T, callback?: () => void): TeleportSingleton;
    /**
     * Registers a handler function for the specified event.
     * @template T - The type of data received by the event.
     * @param {string | symbol} name - The name or symbol of the event.
     * @param {(data: any) => void} handler - The handler function to process the event data.
     */
    receive(name: string | symbol, handler: (data: any) => void): void;
    /**
     * Listens for multiple events with a common handler.
     * When any of the specified events is emitted, the provided handler will be called.
     * @template T - The type of data received by the handler.
     * @param nameList - The list of event names to listen for.
     * @param handler - The handler function to process the event data.
     */
    multiReceive(nameList: string[], handler: (...data: any[]) => void): void;
    /**
     * Removes a specific event handler for the specified event.
     * @param {string | symbol} name - The name or symbol of the event.
     */
    removeHandle(name: string | symbol): void;
    /**
     * Removes all event handlers.
     */
    removeAllHandlers(): void;
    /**
     * Clears any internal state related to emitted events.
     * This method should be adapted based on the specific requirements of your application.
     */
    clear(): void;
}
