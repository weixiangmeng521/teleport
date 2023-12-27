export declare class OrderMap<K, V> {
    protected map: Map<K, V>;
    protected keys: K[];
    constructor();
    set(key: K, value: V): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    keysArray(): K[];
    valuesArray(): V[];
    entriesArray(): [K, V][];
    delete(key: K): boolean;
    clear(): void;
    size(): number;
}
/**
 * Manages group events using an ordered map to track the state of events and triggers handlers
 * when a specified threshold is reached.
 */
export declare class GroupSubject extends OrderMap<string | symbol, any> {
    private _subject;
    private _triggeredTimes;
    private _threshold;
    /**
     * Creates a new instance of GroupSubject.
     */
    constructor();
    /**
     * Sets the order of events and initializes the state for each event.
     * @param {Array<symbol | string>} list - The list of events in the desired order.
     */
    setEventsOrder(list: (symbol | string)[]): void;
    /**
     * Sets the state of an event and checks if the threshold is reached.
     * @param {string | symbol} key - The key of the event.
     * @param {any} value - The value associated with the event.
     */
    setState(key: string | symbol, value: any): void;
    /**
     * Gets the state of an event.
     * @param {string} key - The key of the event.
     * @returns {T | undefined} - The state of the event.
     */
    getState<T>(key: string): T | undefined;
    /**
     * Checks if the triggered event count has reached or exceeded the threshold.
     * @returns {boolean} - True if the threshold is reached or exceeded; otherwise, false.
     */
    protected _isReachedOrOverThreshold(): boolean;
    /**
     * Clears the state and resets the GroupSubject, including the event map and subscription subject.
     */
    clear(): void;
    /**
     * Checks if the threshold is reached and triggers the handlers if so.
     */
    private _checkOverFlow;
    /**
     * Subscribes a handler to the GroupSubject for handling emitted data.
     * @param {(...data: any[]) => void} handler - The handler function to be called when data is emitted.
     * @returns {{ clear: () => void }} - An object with a 'clear' method to unsubscribe the handler.
     */
    subscribe(handler: (...data: any[]) => void): {
        clear: () => void;
    };
}
