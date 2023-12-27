"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleportSingleton = void 0;
// Import the required RxJS classes and custom types
const order_map_1 = require("./order_map");
const subject_1 = require("./subject");
const task_queue_1 = require("./task_queue");
/**
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
         * Task queue
         */
        this._taskQueue = new task_queue_1.TaskQueue();
        /**
        * group event map
        */
        this._groupEventMap = new Map();
        /**
         * Generates a unique token representing the combination of events in the provided list.
         * @param nameList - List of event names.
         * @returns The generated token.
         */
        this._generateMultiEventsToken = (nameList) => {
            return Symbol.for(`Teleport:${nameList.join(",")}`);
        };
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
    _add2TaskQueue(name, ...handlers) {
        handlers.forEach((handler) => {
            this._taskQueue.add(name, handler);
        });
    }
    /**
     * Method to execute queued handlers for a specific event.
     * @param name - The name or symbol of the event.
     */
    _fireTaskQueue(name) {
        this._taskQueue.schedule(name);
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
            this._add2TaskQueue(name, (_name) => {
                const ptr = this._eventMap.get(_name);
                ptr === null || ptr === void 0 ? void 0 : ptr.next(emitData);
                this._afterEmit(name);
            });
            return this;
        }
        subject.next(emitData);
        this._afterEmit(name);
        return this;
    }
    /**
     * After emit data then execute.
     * @param name event name
     */
    _afterEmit(_) {
        // TODO:
    }
    /**
     * Method to receive an event and handle it with a provided handler.
     * @param name - The name or symbol of the event.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    receive(name, handler) {
        var _a;
        const subject = (_a = this._eventMap.get(name)) !== null && _a !== void 0 ? _a : new subject_1.Subject();
        this._eventMap.set(name, subject);
        const clearHandler = subject.subscribe({
            next: (emitData) => {
                handler(emitData.data);
                emitData.callback && emitData.callback();
            }
        });
        this._fireTaskQueue(name);
        return clearHandler;
    }
    /**
     * Method to handle multiple events with a common handler.
     * @param nameList - The list of event names.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    multiReceive(nameList, handler) {
        var _a;
        // event's name
        const eventsNameList = this._generateMultiEventsToken(nameList);
        // get or create a instance
        const groupSubject = (_a = this._groupEventMap.get(eventsNameList)) !== null && _a !== void 0 ? _a : new order_map_1.GroupSubject();
        groupSubject.setEventsOrder(nameList);
        this._groupEventMap.set(eventsNameList, groupSubject);
        // clear group subscribe
        const groupSubscribeHandler = groupSubject.subscribe(handler);
        // clear child subscribe
        const clearChildrenHandlers = nameList.map((eventName) => {
            // 收集receive到的数据，储存到一个map里面，如果reset，就同时也reset掉里面的数据。
            return this.receive(eventName, (value) => {
                groupSubject.setState(eventName, value);
            });
        });
        // clear
        return {
            clear: () => {
                groupSubscribeHandler.clear();
                clearChildrenHandlers.forEach((childHandler) => { childHandler.clear(); });
            }
        };
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
     * Remove one of the multi handle
     * @param nameList
     */
    removeMultiHandle(nameList) {
        const token = this._generateMultiEventsToken(nameList);
        // clear children event
        nameList.forEach((evtName) => {
            this.removeHandle(evtName);
        });
        const subject = this._groupEventMap.get(token);
        subject === null || subject === void 0 ? void 0 : subject.clear();
    }
    /**
     * Method to remove all event handlers.
     */
    removeAllHandlers() {
        var _a;
        for (const name of this._eventMap.keys()) {
            this.removeHandle(name);
        }
        for (const token of this._groupEventMap.keys()) {
            (_a = this._groupEventMap.get(token)) === null || _a === void 0 ? void 0 : _a.clear();
        }
        this._eventMap.clear();
    }
    /**
     * Method to clear both wait queues and event handlers.
     */
    clear() {
        this._taskQueue.clear();
        this.removeAllHandlers();
    }
}
exports.TeleportSingleton = TeleportSingleton;
