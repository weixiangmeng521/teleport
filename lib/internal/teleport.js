"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleportSingleton = void 0;
// Import the required RxJS classes and custom types
const subject_1 = require("./subject");
/**
 * Represents a singleton class for handling events using RxJS.
 * @weixiangmeng521
 */
class TeleportSingleton {
    /**
     * Private constructor to enforce singleton pattern.
     */
    constructor() {
        /**
         * Map to store event subjects by name or symbol.
         */
        this._eventMap = new Map();
        /**
         * Map to store queued event handlers waiting for the event to be created.
         */
        this._waitQueueMap = new Map();
    }
    /**
     * Method to get or create the singleton instance.
     * @returns The singleton instance of TeleportSingleton.
     */
    static getInstance() {
        if (!TeleportSingleton._instance) {
            this._instance = new TeleportSingleton();
        }
        return this._instance;
    }
    /**
     * Method to add handlers to the wait queue.
     * @param name - The name or symbol of the event.
     * @param handlers - The event handlers to be added to the wait queue.
     */
    _add2WaitMap(name, ...handlers) {
        var _a;
        if (this._waitQueueMap.has(name)) {
            const queue = (_a = this._waitQueueMap.get(name)) !== null && _a !== void 0 ? _a : [];
            queue.push(...handlers);
            this._waitQueueMap.set(name, queue);
            return;
        }
        this._waitQueueMap.set(name, handlers);
    }
    /**
     * Method to execute queued handlers for a specific event.
     * @param name - The name or symbol of the event.
     */
    _fireWaitHandlers(name) {
        var _a;
        const queue = (_a = this._waitQueueMap.get(name)) !== null && _a !== void 0 ? _a : [];
        while (queue.length) {
            const fn = queue.shift();
            fn && fn(name);
        }
        this._waitQueueMap.set(name, []);
    }
    /**
     * Method to emit an event with data and optional callback.
     * @template T - The type of data to be emitted.
     * @param name - The name or symbol of the event.
     * @param data - The data to be emitted with the event.
     * @param callback - Optional callback to be executed after emitting the event.
     */
    emit(name, data, callback) {
        const emitData = {
            data: data,
            callback: callback,
        };
        const subject = this._eventMap.get(name);
        if (!subject) {
            const _subject = new subject_1.Subject();
            this._eventMap.set(name, _subject);
            this._add2WaitMap(name, (_name) => {
                const ptr = this._eventMap.get(_name);
                ptr === null || ptr === void 0 ? void 0 : ptr.next(emitData);
            });
            return this;
        }
        subject.next(emitData);
        return this;
    }
    /**
     * Method to receive an event and handle it with a provided handler.
     * @template T - The type of data received by the event.
     * @param name - The name or symbol of the event.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    receive(name, handler) {
        var _a;
        const eventHandler = (emitData) => {
            handler(emitData.data);
            emitData.callback && emitData.callback();
        };
        const subject = this._eventMap.get(name);
        if (!subject) {
            const ptr = new subject_1.Subject();
            this._eventMap.set(name, ptr);
            ptr.subscribe({ next: eventHandler });
            return this;
        }
        subject.subscribe({ next: eventHandler });
        if (((_a = this._waitQueueMap.get(name)) !== null && _a !== void 0 ? _a : []).length) {
            this._fireWaitHandlers(name);
        }
        return this;
    }
    /**
     * Method to remove a specific event handler by name.
     * @param name - The name of the event handler to be removed.
     */
    removeHandle(name) {
        const subject = this._eventMap.get(name);
        if (!subject)
            return;
        subject.unsubscribe();
        this._eventMap.delete(name);
    }
    /**
     * Method to remove all event handlers.
     */
    removeAllHandlers() {
        for (const name of this._eventMap.keys()) {
            this.removeHandle(name);
        }
        this._eventMap.clear();
    }
    /**
     * Method to clear both wait queues and event handlers.
     */
    clear() {
        this._waitQueueMap.clear();
        this.removeAllHandlers();
    }
}
exports.TeleportSingleton = TeleportSingleton;
