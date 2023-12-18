import { Observer } from "./observer";
import { ObserverInterface, SubjectInterface } from "./types";
/**
 * Represents a generic subject class that implements the SubjectInterface.
 * The subject is responsible for managing a list of observers and notifying them of updates.
 * @template T - The type of data that the subject will broadcast to its observers.
 */
export declare class Subject<T> implements SubjectInterface<T> {
    /**
     * Array to store the observers subscribed to the subject.
     */
    private _observers;
    /**
     * Adds an observer to the list of observers.
     * @param {Observer<T>} observer - The observer to be added.
     * @returns {void}
     */
    protected addObserver(observer: Observer<T>): void;
    /**
     * Removes an observer from the list of observers.
     * @param {Observer<T>} observer - The observer to be removed.
     * @returns {void}
     */
    removeObserver(observer: Observer<T>): void;
    /**
     * Notifies all observers with the provided data.
     * @param {any} data - The data to be broadcasted to observers.
     * @returns {void}
     */
    protected notify(data: any): void;
    /**
     * Subscribes an observer to the subject.
     * @param {(value: T) => void} event - The observer function to be subscribed.
     * @returns {{ unsubscribe: () => void }} - An object containing the unsubscribe function.
     */
    subscribe(obj: ObserverInterface<T>): {
        unsubscribe: () => void;
    };
    /**
     * Unsubscribes all observers from the subject.
     * @returns {void}
     */
    unsubscribe(): void;
    /**
     * Notifies all observers with the provided value.
     * @param {T} value - The value to be broadcasted to observers.
     * @returns {void}
     */
    next(value: T): void;
}
