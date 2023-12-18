"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = void 0;
const observer_1 = require("./observer");
/**
 * Represents a generic subject class that implements the SubjectInterface.
 * The subject is responsible for managing a list of observers and notifying them of updates.
 * @template T - The type of data that the subject will broadcast to its observers.
 */
class Subject {
    constructor() {
        /**
         * Array to store the observers subscribed to the subject.
         */
        this._observers = [];
    }
    /**
     * Adds an observer to the list of observers.
     * @param {Observer<T>} observer - The observer to be added.
     * @returns {void}
     */
    addObserver(observer) {
        this._observers.push(observer);
    }
    /**
     * Removes an observer from the list of observers.
     * @param {Observer<T>} observer - The observer to be removed.
     * @returns {void}
     */
    removeObserver(observer) {
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
    notify(data) {
        this._observers.forEach(observer => {
            observer.next(data);
        });
    }
    /**
     * Subscribes an observer to the subject.
     * @param {(value: T) => void} event - The observer function to be subscribed.
     * @returns {{ unsubscribe: () => void }} - An object containing the unsubscribe function.
     */
    subscribe(obj) {
        const observer = new observer_1.Observer(obj.next);
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
    unsubscribe() {
        this._observers = [];
    }
    /**
     * Notifies all observers with the provided value.
     * @param {T} value - The value to be broadcasted to observers.
     * @returns {void}
     */
    next(value) {
        this.notify(value);
    }
}
exports.Subject = Subject;
