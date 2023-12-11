import { Observer } from "./observer";
import { ObserverInterface, SubjectInterface } from "./types";


/**
 * Represents a generic subject class that implements the SubjectInterface.
 * The subject is responsible for managing a list of observers and notifying them of updates.
 * @template T - The type of data that the subject will broadcast to its observers.
 */
export class Subject<T> implements SubjectInterface<T> {
    /**
     * Array to store the observers subscribed to the subject.
     */
    private _observers: Observer<T>[] = [];

    /**
     * Adds an observer to the list of observers.
     * @param {Observer<T>} observer - The observer to be added.
     * @returns {void}
     */
    protected addObserver(observer: Observer<T>): void {
        this._observers.push(observer);
    }

    /**
     * Removes an observer from the list of observers.
     * @param {Observer<T>} observer - The observer to be removed.
     * @returns {void}
     */
    public removeObserver(observer: Observer<T>): void {
        const index = this._observers.indexOf(observer);
        if (index !== -1) {
            this._observers.splice(index, 1);
        }
    }

    /**
     * Notifies all observers with the provided data.
     * @param {any} data - The data to be broadcasted to observers.
     * @returns {void}
     */
    protected notify(data: any): void {
        this._observers.forEach(observer => {
            observer.next(data);
        });
    }

    /**
     * Subscribes an observer to the subject.
     * @param {(value: T) => void} event - The observer function to be subscribed.
     * @returns {{ unsubscribe: () => void }} - An object containing the unsubscribe function.
     */
    public subscribe(obj: ObserverInterface<T>): { unsubscribe: () => void } {
        const observer = new Observer<T>(obj.next);
        this.addObserver(observer);
        return {
            unsubscribe: () => {
                this.removeObserver(observer);
            },
        };        
    }

    /**
     * Unsubscribes all observers from the subject.
     * @returns {void}
     */
    public unsubscribe(): void {
        this._observers = [];
    }

    /**
     * Notifies all observers with the provided value.
     * @param {T} value - The value to be broadcasted to observers.
     * @returns {void}
     */
    public next(value: T): void {
        this.notify(value);
    }
}
