import { TeleportSingleton } from './teleport';

/**
 * The `Teleport` class provides a simplified interface to interact with the underlying `TeleportSingleton` instance.
 * It encapsulates the logic for emitting and receiving events.
 */
export class Teleport {
    /**
     * The underlying `TeleportSingleton` instance used for event management.
     */
    private _teleportSingleton = TeleportSingleton.getInstantce();

    /**
     * Constructs a new instance of the `Teleport` class.
     */
    constructor() {}

    /**
     * Emits an event with the specified name and data.
     * @template T - The type of data to be emitted.
     * @param {string | symbol} name - The name or symbol of the event.
     * @param {T} data - The data to be emitted with the event.
     * @param {() => void} [callback] - Optional callback to be executed after emitting the event.
     * @returns {TeleportSingleton} - The `TeleportSingleton` instance for chaining.
     */
    public emit<T>(name: string | symbol, data: T, callback?: () => void): TeleportSingleton {
        return this._teleportSingleton.emit<T>(name, data, callback);
    }

    /**
     * Registers a handler function for the specified event.
     * @template T - The type of data received by the event.
     * @param {string | symbol} name - The name or symbol of the event.
     * @param {(data: T) => void} handler - The handler function to process the event data.
     */
    public receive<T>(name: string | symbol, handler: (data: T) => void): void {
        this._teleportSingleton.receive<T>(name, handler);
    }
}
