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
     * @param {(data: T) => void} handler - The handler function to process the event data.
     */
    receive<T>(name: string | symbol, handler: (data: T) => void): void;
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
