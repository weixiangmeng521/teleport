import { Subject } from "./subject";
import { EmitDataType } from "./types";

// Order map
export class OrderMap<K, V> {
    protected map: Map<K, V>;
    protected keys: K[];

    constructor() {
        this.map = new Map<K, V>();
        this.keys = [];
    }

    // Add key-value pairs to the OrderMap
    public set(key: K, value: V): void {
        if (!this.map.has(key)) {
            this.keys.push(key);
        }
        this.map.set(key, value);
    }

    // Get the value by key
    public get(key: K): V | undefined {
        return this.map.get(key);
    }

    // Check if the OrderMap contains a specific key
    public has(key: K): boolean {
        return this.map.has(key);
    }

    // Get the array of keys in the OrderMap
    public keysArray(): K[] {
        return this.keys.slice();
    }

    // Get the array of values in the OrderMap
    public valuesArray(): V[] {
        return this.keys.map(key => this.map.get(key)!);
    }

    // Get the array of key-value pairs in the OrderMap
    public entriesArray(): [K, V][] {
        return this.keys.map(key => [key, this.map.get(key)!]);
    }

    // Delete the key-value pair with the specified key
    public delete(key: K): boolean {
        const index = this.keys.indexOf(key);
        if (index !== -1) {
            this.keys.splice(index, 1);
            return this.map.delete(key);
        }
        return false;
    }

    // Clear the OrderMap
    public clear(): void {
        this.map.clear();
        this.keys = [];
    }

    // Get the size of the OrderMap
    public size(): number {
        return this.keys.length;
    }
}






/**
 * Manages group events using an ordered map to track the state of events and triggers handlers
 * when a specified threshold is reached.
 */
export class GroupSubject extends OrderMap<string | symbol, any> {

    // like RxJS Subject for handling subscriptions
    private _subject = new Subject<any>();

    // Counter for triggered events
    private _triggeredTimes = 0;

    // Threshold for triggering handlers
    private _threshold = 0;

    /**
     * Creates a new instance of GroupSubject.
     */
    constructor() {
        super();
    }

    /**
     * Sets the order of events and initializes the state for each event.
     * @param {Array<symbol | string>} list - The list of events in the desired order.
     */
    public setEventsOrder(list: (symbol | string)[]): void {
        list.forEach((event) => {
            this.set(event, undefined);
        });
        this._threshold = list.length;
    }

    /**
     * Sets the state of an event and checks if the threshold is reached.
     * @param {string | symbol} key - The key of the event.
     * @param {any} value - The value associated with the event.
     */
    public setState(key: string | symbol, value: any): void {
        this.set(key, value);
        this._triggeredTimes++;
        this._checkOverFlow();
    }

    /**
     * Gets the state of an event.
     * @param {string} key - The key of the event.
     * @returns {T | undefined} - The state of the event.
     */
    public getState<T>(key: string): T | undefined {
        return this.get(key);
    }

    /**
     * Checks if the triggered event count has reached or exceeded the threshold.
     * @returns {boolean} - True if the threshold is reached or exceeded; otherwise, false.
     */
    protected _isReachedOrOverThreshold(): boolean {
        return this._triggeredTimes >= this._threshold;
    }

    /**
     * Clears the state and resets the GroupSubject, including the event map and subscription subject.
     */
    public override clear(): void {
        this.map.clear();
        this.keys = [];

        this._subject = new Subject();
        this._triggeredTimes = 0;
        this._threshold = 0;
    }

    /**
     * Checks if the threshold is reached and triggers the handlers if so.
     */
    private _checkOverFlow(): void {
        if (this._isReachedOrOverThreshold()) {
            const resultList = this.valuesArray();
            const emitData: EmitDataType<any> = {
                data: resultList,
                // TODO: Add callback to emitData if needed
            };
            this._subject.next(emitData);
        }
    }

    /**
     * Subscribes a handler to the GroupSubject for handling emitted data.
     * @param {(...data: any[]) => void} handler - The handler function to be called when data is emitted.
     * @returns {{ clear: () => void }} - An object with a 'clear' method to unsubscribe the handler.
     */
    public subscribe(handler: (...data: any[]) => void): { clear: () => void } {
        return this._subject.subscribe({
            next: (emitData: EmitDataType<any>) => {
                handler?.(...emitData.data);
            }
        });
    }
}