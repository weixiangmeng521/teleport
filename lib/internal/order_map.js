"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSubject = exports.OrderMap = void 0;
const subject_1 = require("./subject");
// Order map
class OrderMap {
    constructor() {
        this.map = new Map();
        this.keys = [];
    }
    // Add key-value pairs to the OrderMap
    set(key, value) {
        if (!this.map.has(key)) {
            this.keys.push(key);
        }
        this.map.set(key, value);
    }
    // Get the value by key
    get(key) {
        return this.map.get(key);
    }
    // Check if the OrderMap contains a specific key
    has(key) {
        return this.map.has(key);
    }
    // Get the array of keys in the OrderMap
    keysArray() {
        return this.keys.slice();
    }
    // Get the array of values in the OrderMap
    valuesArray() {
        return this.keys.map(key => this.map.get(key));
    }
    // Get the array of key-value pairs in the OrderMap
    entriesArray() {
        return this.keys.map(key => [key, this.map.get(key)]);
    }
    // Delete the key-value pair with the specified key
    delete(key) {
        const index = this.keys.indexOf(key);
        if (index !== -1) {
            this.keys.splice(index, 1);
            return this.map.delete(key);
        }
        return false;
    }
    // Clear the OrderMap
    clear() {
        this.map.clear();
        this.keys = [];
    }
    // Get the size of the OrderMap
    size() {
        return this.keys.length;
    }
}
exports.OrderMap = OrderMap;
/**
 * Manages group events using an ordered map to track the state of events and triggers handlers
 * when a specified threshold is reached.
 */
class GroupSubject extends OrderMap {
    /**
     * Creates a new instance of GroupSubject.
     */
    constructor() {
        super();
        // like RxJS Subject for handling subscriptions
        this._subject = new subject_1.Subject();
        // Counter for triggered events
        this._triggeredTimes = 0;
        // Threshold for triggering handlers
        this._threshold = 0;
    }
    /**
     * Sets the order of events and initializes the state for each event.
     * @param {Array<symbol | string>} list - The list of events in the desired order.
     */
    setEventsOrder(list) {
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
    setState(key, value) {
        this.set(key, value);
        this._triggeredTimes++;
        this._checkOverFlow();
    }
    /**
     * Gets the state of an event.
     * @param {string} key - The key of the event.
     * @returns {T | undefined} - The state of the event.
     */
    getState(key) {
        return this.get(key);
    }
    /**
     * Checks if the triggered event count has reached or exceeded the threshold.
     * @returns {boolean} - True if the threshold is reached or exceeded; otherwise, false.
     */
    _isReachedOrOverThreshold() {
        return this._triggeredTimes >= this._threshold;
    }
    /**
     * Clears the state and resets the GroupSubject, including the event map and subscription subject.
     */
    clear() {
        this.map.clear();
        this.keys = [];
        this._subject = new subject_1.Subject();
        this._triggeredTimes = 0;
        this._threshold = 0;
    }
    /**
     * Checks if the threshold is reached and triggers the handlers if so.
     */
    _checkOverFlow() {
        if (this._isReachedOrOverThreshold()) {
            const resultList = this.valuesArray();
            const emitData = {
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
    subscribe(handler) {
        return this._subject.subscribe({
            next: (emitData) => {
                handler === null || handler === void 0 ? void 0 : handler(...emitData.data);
            }
        });
    }
}
exports.GroupSubject = GroupSubject;
