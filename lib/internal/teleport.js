"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleportSingleton = void 0;
// Import the required RxJS classes and custom types
const subject_1 = require("./subject");
const task_queue_1 = require("./task_queue");
const utils_1 = require("./utils");
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
         * Map to store the count of times each individual event has been triggered.
         * Key: Event name or symbol, Value: Number of times triggered.
         */
        this._eventCountMap = new Map();
        /**
         * Array to store lists of events that are considered as a single multi-event.
         * Each list represents a combination of events to be treated collectively.
         */
        this._multiEventsList = [];
        /**
         * Map to store the last recorded trace of the total number of times a multi-event has been triggered.
         * Key: Combined event name or symbol, Value: Last recorded trace of triggered times.
         */
        this._eventsUpdateMap = new Map();
        /**
         * Map to store arbitrary data associated with individual events.
         * Key: Event name or symbol, Value: Associated data.
         */
        this._eventsDataMap = new Map();
        /**
         * Clears the map storing the count of times each individual event has been triggered.
         */
        this._clearEventCountMap = () => {
            this._eventCountMap = new Map();
        };
        /**
         * Clears the array storing lists of events that are considered as single multi-events.
         */
        this._clearMultiEventsList = () => {
            this._multiEventsList = [];
        };
        /**
         * remove one of the multi event
         */
        this._removeMultiEvent = (nameList) => {
            var _a;
            for (let i = 0; i < this._multiEventsList.length; i++) {
                const multiEvent = (_a = this._multiEventsList[i]) !== null && _a !== void 0 ? _a : [];
                if ((0, utils_1.isArrayEqual)(nameList, multiEvent)) {
                    this._multiEventsList.splice(i, 1);
                }
            }
        };
        /**
         * Clears the map storing the last recorded trace of the total number of times a multi-event has been triggered.
         */
        this._clearEventsUpdateMap = () => {
            this._eventsUpdateMap = new Map();
        };
        /**
         * Clears the map storing arbitrary data associated with individual events.
         */
        this._clearEventsDataMap = () => {
            this._eventsDataMap = new Map();
        };
        /**
         * Adds or updates the total number of times a multi-event has been triggered to the map.
         * @param name - Combined event name or symbol.
         * @param times - Number of times the multi-event has been triggered.
         */
        this._add2EventsUpdateMap = (name, times) => {
            this._eventsUpdateMap.set(name, times);
        };
        /**
         * Retrieves the last recorded trace of the total number of times a multi-event has been triggered from the map.
         * @param name - Combined event name.
         * @returns The last recorded trace of triggered times for the multi-event.
         */
        this._getEventsUpdateMap = (name) => {
            var _a;
            return (_a = this._eventsUpdateMap.get(name)) !== null && _a !== void 0 ? _a : 0;
        };
        /**
         * Adds or updates arbitrary data associated with individual events to the map.
         * @param name - Event name.
         * @param data - Associated data.
         */
        this._add2EventsDataMap = (name, data) => {
            this._eventsDataMap.set(name, data);
        };
        /**
         * Retrieves arbitrary data associated with an individual event from the map.
         * @param name - Event name.
         * @returns The associated data for the event.
         */
        this._getEventsDataMap = (name) => {
            return this._eventsDataMap.get(name);
        };
        /**
         * Increments the count of times an individual event has been triggered.
         * @param name - Event name or symbol.
         */
        this._addEventsTimes = (name) => {
            var _a;
            let times = (_a = this._eventCountMap.get(name)) !== null && _a !== void 0 ? _a : 0;
            times += 1;
            this._eventCountMap.set(name, times);
        };
        /**
         * Retrieves the count of times an individual event has been triggered.
         * @param name - Event name.
         * @returns The count of times the event has been triggered.
         */
        this._getEventsTimes = (name) => {
            var _a;
            return (_a = this._eventCountMap.get(name)) !== null && _a !== void 0 ? _a : 0;
        };
        /**
         * Generates a unique token representing the combination of events in the provided list.
         * @param nameList - List of event names.
         * @returns The generated token.
         */
        this._generateMultiEventsToken = (nameList) => {
            return Symbol.for(`Teleport:${nameList.join(",")}`);
        };
        /**
         * handler‘s wrapper
         * @param handler
         * @param mode 0 => single, 1=> multiple
         */
        this._eventHandler = (handler, mode) => {
            return (emitData) => {
                if (mode === 0)
                    handler(emitData.data);
                if (mode === 1)
                    handler(...emitData.data);
                emitData.callback && emitData.callback();
            };
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
     * Checks for multi-event conditions and triggers automatic emission if conditions are met.
     * @protected
     */
    _checkMultiEvents() {
        var _a, _b;
        for (let i = 0; i < this._multiEventsList.length; i++) {
            const eventsList = (_a = this._multiEventsList[i]) !== null && _a !== void 0 ? _a : [];
            // every event that be executed times
            const timesArr = eventsList.map((eventName) => this._getEventsTimes(eventName));
            // is that one of the event that executed times not 0
            const isNotContainsZero = !timesArr.includes(0);
            const updatedEventName = this._generateMultiEventsToken(eventsList);
            const lastTrace = (_b = this._getEventsUpdateMap(updatedEventName)) !== null && _b !== void 0 ? _b : 0;
            const currentUpdateTimes = timesArr.reduce((pre, cur) => pre + cur, 0);
            if (isNotContainsZero) {
                if (currentUpdateTimes !== lastTrace)
                    this._autoEmit(eventsList);
                this._add2EventsUpdateMap(updatedEventName, currentUpdateTimes);
            }
        }
    }
    /**
     * Automatically emits a multi-event with the provided list of events and their associated data.
     * Creates a combined event with a unique token and triggers emission to subscribers.
     *
     * @param {string[]} eventsList - The list of events to be combined and emitted.
     */
    _autoEmit(eventsList) {
        const multiEventsName = this._generateMultiEventsToken(eventsList);
        const dataList = eventsList.map(eventName => this._getEventsDataMap(eventName));
        const emitData = { data: dataList };
        const subject = this._eventMap.get(multiEventsName);
        if (!subject) {
            const _subject = new subject_1.Subject();
            this._eventMap.set(multiEventsName, _subject);
            return this._add2TaskQueue(multiEventsName, (_name) => {
                const ptr = this._eventMap.get(_name);
                ptr === null || ptr === void 0 ? void 0 : ptr.next(emitData);
            });
        }
        subject.next(emitData);
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
        this._add2EventsDataMap(name, data);
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
    _afterEmit(name) {
        this._addEventsTimes(name);
        this._checkMultiEvents();
    }
    /**
     * Method to receive an event and handle it with a provided handler.
     * @param name - The name or symbol of the event.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    receive(name, handler) {
        const subject = this._eventMap.get(name);
        if (!subject) {
            const ptr = new subject_1.Subject();
            this._eventMap.set(name, ptr);
            return ptr.subscribe({ next: this._eventHandler(handler, 0) });
        }
        const clearHandler = subject.subscribe({ next: this._eventHandler(handler, 0) });
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
        this._multiEventsList.push(nameList);
        const clearChildrenHandlers = nameList.map((eventName) => {
            // TODO: 收集receive到的数据，储存到一个map里面，如果clear，就同时也clear掉里面的数据。
            return this.receive(eventName, () => { });
        });
        // clear child handlers and father handler
        const clearAll = (names, clearHandler) => {
            return { clear: () => {
                    this._removeMultiEvent(names);
                    clearHandler.clear();
                    clearChildrenHandlers.forEach((childHandler) => { childHandler.clear(); });
                } };
        };
        const eventsNameList = this._generateMultiEventsToken(nameList);
        const subject = this._eventMap.get(eventsNameList);
        if (!subject) {
            const ptr = new subject_1.Subject();
            this._eventMap.set(eventsNameList, ptr);
            const clearHandler = ptr.subscribe({ next: this._eventHandler(handler, 1) });
            return clearAll(nameList, clearHandler);
        }
        const clearHandler = subject.subscribe({ next: this._eventHandler(handler, 1) });
        this._fireTaskQueue(eventsNameList);
        return clearAll(nameList, clearHandler);
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
        this._removeMultiEvent(nameList);
        const token = this._generateMultiEventsToken(nameList);
        this.removeHandle(token);
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
        this._taskQueue.clear();
        this.removeAllHandlers();
        this._clearEventCountMap();
        this._clearMultiEventsList();
        this._clearEventsUpdateMap();
        this._clearEventsDataMap();
    }
}
exports.TeleportSingleton = TeleportSingleton;
