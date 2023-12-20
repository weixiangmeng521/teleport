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
        /**
         * Map to store the count of times each individual event has been triggered.
         * Key: Event name or symbol, Value: Number of times triggered.
         * @protected
         */
        this._eventCountMap = new Map();
        /**
         * Array to store lists of events that are considered as a single multi-event.
         * Each list represents a combination of events to be treated collectively.
         * @protected
         */
        this._multiEventsList = [];
        /**
         * Map to store the last recorded trace of the total number of times a multi-event has been triggered.
         * Key: Combined event name or symbol, Value: Last recorded trace of triggered times.
         * @protected
         */
        this._eventsUpdateMap = new Map();
        /**
         * Map to store arbitrary data associated with individual events.
         * Key: Event name or symbol, Value: Associated data.
         * @protected
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
            return nameList.join(",");
        };
    }
    /**
     * Checks for multi-event conditions and triggers automatic emission if conditions are met.
     * @protected
     */
    _checkMultiEvents() {
        var _a, _b, _c;
        for (let i = 0; i < this._multiEventsList.length; i++) {
            const eventsList = (_a = this._multiEventsList[i]) !== null && _a !== void 0 ? _a : [];
            const timesArr = new Array(eventsList.length).fill(0);
            for (let j = 0; j < eventsList.length; j++) {
                const eventName = (_b = eventsList[j]) !== null && _b !== void 0 ? _b : "";
                const triggeredTimes = this._getEventsTimes(eventName);
                timesArr[j] = triggeredTimes;
            }
            const isNotContainsZero = timesArr.indexOf(0) === -1;
            const updatedEventName = this._generateMultiEventsToken(eventsList);
            const lastTrace = (_c = this._getEventsUpdateMap(updatedEventName)) !== null && _c !== void 0 ? _c : 0;
            const currentUpdateTimes = timesArr.reduce((x, y) => x + y, 0);
            if (isNotContainsZero) {
                if (currentUpdateTimes !== lastTrace) {
                    this._autoEmit(eventsList);
                }
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
        const dataList = [];
        eventsList.forEach((eventName) => {
            const _data = this._getEventsDataMap(eventName);
            dataList.push(_data);
        });
        const emitData = { data: dataList };
        const subject = this._eventMap.get(multiEventsName);
        if (!subject) {
            const _subject = new subject_1.Subject();
            this._eventMap.set(multiEventsName, _subject);
            this._add2WaitMap(multiEventsName, (_name) => {
                const ptr = this._eventMap.get(_name);
                ptr === null || ptr === void 0 ? void 0 : ptr.next(emitData);
            });
            return;
        }
        subject.next(emitData);
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
        const afterEmit = () => {
            this._addEventsTimes(name);
            this._checkMultiEvents();
        };
        const emitData = {
            data: data,
            callback: callback,
        };
        this._add2EventsDataMap(name, data);
        const subject = this._eventMap.get(name);
        if (!subject) {
            const _subject = new subject_1.Subject();
            this._eventMap.set(name, _subject);
            this._add2WaitMap(name, (_name) => {
                const ptr = this._eventMap.get(_name);
                ptr === null || ptr === void 0 ? void 0 : ptr.next(emitData);
                afterEmit();
            });
            return this;
        }
        subject.next(emitData);
        afterEmit();
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
     * Method to handle multiple events with a common handler.
     * @param nameList - The list of event names.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    multiReceive(nameList, handler) {
        var _a;
        this._multiEventsList.push(nameList);
        nameList.forEach((eventName) => {
            this.receive(eventName, () => { });
        });
        const eventHandler = (emitData) => {
            const obj = emitData;
            handler(...obj.data);
            emitData.callback && emitData.callback();
        };
        const eventsNameList = this._generateMultiEventsToken(nameList);
        const subject = this._eventMap.get(eventsNameList);
        if (!subject) {
            const ptr = new subject_1.Subject();
            this._eventMap.set(eventsNameList, ptr);
            ptr.subscribe({ next: eventHandler });
            return this;
        }
        subject.subscribe({ next: eventHandler });
        if (((_a = this._waitQueueMap.get(eventsNameList)) !== null && _a !== void 0 ? _a : []).length) {
            this._fireWaitHandlers(eventsNameList);
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
        this._clearEventCountMap();
        this._clearMultiEventsList();
        this._clearEventsUpdateMap();
        this._clearEventsDataMap();
    }
}
exports.TeleportSingleton = TeleportSingleton;
