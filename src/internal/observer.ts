import { ObserverInterface } from "./types";

/**
 * Generic observer class that implements the ObserverInterface.
 * The observer is notified of updates through the provided handler function.
 * @typeparam T - The type of data that the observer will receive.
 */
export class Observer<T> implements ObserverInterface<T> {
    /**
     * The function called when the observer is updated with new data.
     */
    protected handler: (arg: T) => void = () => {};

    /**
     * Constructs an instance of the Observer class with the provided handler function.
     * @param {function} handler - The function to be called when the observer is updated.
     */
    constructor(handler: (arg: T) => void) {
        this.handler = handler;
    }

    /**
     * Updates the observer with new data.
     * Invokes the handler function provided during construction.
     * @param {T} data - The data to be passed to the observer.
     */
    public next(data: T): void {
        this.handler(data);
    }
}
