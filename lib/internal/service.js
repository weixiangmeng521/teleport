"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teleport = void 0;
const teleport_1 = require("./teleport");
/**
 * The `Teleport` class provides a simplified interface to interact with the underlying `TeleportSingleton` instance.
 * It encapsulates the logic for emitting and receiving events.
 */
class Teleport {
    /**
     * Constructs a new instance of the `Teleport` class.
     */
    constructor() {
        /**
         * The underlying `TeleportSingleton` instance used for event management.
         */
        this._teleportSingleton = teleport_1.TeleportSingleton.getInstance();
    }
    /**
     * Emits an event with the specified name and data.
     * @template T - The type of data to be emitted.
     * @param {string | symbol} name - The name or symbol of the event.
     * @param {T} data - The data to be emitted with the event.
     * @param {() => void} [callback] - Optional callback to be executed after emitting the event.
     * @returns {TeleportSingleton} - The TeleportSingleton instance for chaining.
     */
    emit(name, data, callback) {
        return this._teleportSingleton.emit(name, data, callback);
    }
    /**
     * Registers a handler function for the specified event.
     * @template T - The type of data received by the event.
     * @param {string | symbol} name - The name or symbol of the event.
     * @param {(data: T) => void} handler - The handler function to process the event data.
     */
    receive(name, handler) {
        this._teleportSingleton.receive(name, handler);
    }
    /**
     * Removes a specific event handler for the specified event.
     * @param {string | symbol} name - The name or symbol of the event.
     */
    removeHandle(name) {
        this._teleportSingleton.removeHandle(name);
    }
    /**
     * Removes all event handlers.
     */
    removeAllHandlers() {
        this._teleportSingleton.removeAllHandlers();
    }
    /**
     * Clears any internal state related to emitted events.
     * This method should be adapted based on the specific requirements of your application.
     */
    clear() {
        this._teleportSingleton.clear();
    }
}
exports.Teleport = Teleport;
