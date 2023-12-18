"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
/**
 * Generic observer class that implements the ObserverInterface.
 * The observer is notified of updates through the provided handler function.
 * @template T - The type of data that the observer will receive.
 */
class Observer {
    /**
     * Constructs an instance of the Observer class with the provided handler function.
     * @param {function} handler - The function to be called when the observer is updated.
     */
    constructor(handler) {
        /**
         * The function called when the observer is updated with new data.
         */
        this.handler = () => { };
        this.handler = handler;
    }
    /**
     * Updates the observer with new data.
     * Invokes the handler function provided during construction.
     * @param {T} data - The data to be passed to the observer.
     */
    next(data) {
        this.handler(data);
    }
}
exports.Observer = Observer;
