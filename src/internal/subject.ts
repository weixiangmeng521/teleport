import { Subscription } from "./subscription";
import { ObservableType, SubjectInterface } from "./types";

/**
 * Represents a generic subject that allows observers to subscribe to different types of events.
 * @template T - The type of data emitted by the subject.
 */
export class Subject<T> implements SubjectInterface {
    /**
     * Symbol used as a unique token for the subject.
     */
    protected __TOKEN__ = Symbol("Subject");

    /**
     * Subscription for next events.
     */
    private _nextEvents = new Subscription();

    /**
     * Subscription for error events.
     */
    private _errorEvents = new Subscription();

    /**
     * Subscription for complete events.
     */
    private _completeEvents = new Subscription();

    /**
     * Constructs a new instance of the Subject class.
     */
    constructor() {}

    /**
     * Subscribe to the subject for different types of events.
     * @param {Partial<ObservableType>} teardown - Teardown object containing functions for next, error, and complete events.
     */
    public subscribe(teardown: Partial<ObservableType>): void {
        const { next, error, complete } = teardown;
        next && this._nextEvents.subscribe(this.__TOKEN__, next);
        error && this._errorEvents.subscribe(this.__TOKEN__, error);
        complete && this._completeEvents.subscribe(this.__TOKEN__, complete);
    }

    /**
     * Unsubscribe from all events of the subject.
     */
    public unsubscribe(): void {
        this._nextEvents = new Subscription();
        this._errorEvents = new Subscription();
        this._completeEvents = new Subscription();
    }

    /**
     * TODO: if err or complete, then throw error.
     * Emit a next event with the provided value.
     * @param {T} value - The value to be emitted.
     */
    public next(value: T): void {
        this._nextEvents.publish(this.__TOKEN__, value);
    }



    /**
     * Emit an error event with the provided error.
     * @param {Error} err - The error to be emitted.
     */
    public error(err: Error): void {
        this._errorEvents.publish(this.__TOKEN__, err);
    }

    /**
     * Emit a complete event.
     */
    public complete(): void {
        this._completeEvents.publish(this.__TOKEN__);
    }
}
