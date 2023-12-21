// Import the required RxJS classes and custom types
import { Subject } from "./subject";
import { EmitDataType } from "./types";

/**
 * Represents a singleton class for handling events using RxJS.
 * @weixiangmeng521
 */
export class TeleportSingleton {
    /**
     * Map to store event subjects by name or symbol.
     */
    protected _eventMap: Map<string | symbol, Subject<any>> = new Map();

    /**
     * Map to store queued event handlers waiting for the event to be created.
     */
    protected _waitQueueMap: Map<string | symbol, ((name: string | symbol) => void)[]> = new Map();

    /**
     * Singleton instance.
     */
    private static _instance: TeleportSingleton;


    /**
     * Map to store the count of times each individual event has been triggered.
     * Key: Event name or symbol, Value: Number of times triggered.
     */
    protected _eventCountMap: Map<string | symbol, number> = new Map();

    /**
     * Array to store lists of events that are considered as a single multi-event.
     * Each list represents a combination of events to be treated collectively.
     */
    protected _multiEventsList: string[][] = [];

    /**
     * Map to store the last recorded trace of the total number of times a multi-event has been triggered.
     * Key: Combined event name or symbol, Value: Last recorded trace of triggered times.
     */
    protected _eventsUpdateMap: Map<string | symbol, number> = new Map();

    /**
     * Map to store arbitrary data associated with individual events.
     * Key: Event name or symbol, Value: Associated data.
     */
    protected _eventsDataMap: Map<string | symbol, any> = new Map();


    /**
     * Private constructor to enforce singleton pattern.
     */
    private constructor() { }


    /**
     * Method to get or create the singleton instance.
     * @returns The singleton instance of TeleportSingleton.
     */
    public static getInstance(): TeleportSingleton {
        if (!TeleportSingleton._instance) {
            this._instance = new TeleportSingleton();
        }
        return this._instance;
    }

    /**
     * Clears the map storing the count of times each individual event has been triggered.
     */
    protected _clearEventCountMap = () => {
        this._eventCountMap = new Map();
    }

    /**
     * Clears the array storing lists of events that are considered as single multi-events.
     */
    protected _clearMultiEventsList = () => {
        this._multiEventsList = [];
    }

    /**
     * Clears the map storing the last recorded trace of the total number of times a multi-event has been triggered.
     */
    protected _clearEventsUpdateMap = () => {
        this._eventsUpdateMap = new Map();
    }

    /**
     * Clears the map storing arbitrary data associated with individual events.
     */
    protected _clearEventsDataMap = () => {
        this._eventsDataMap = new Map();
    }

    /**
     * Adds or updates the total number of times a multi-event has been triggered to the map.
     * @param name - Combined event name or symbol.
     * @param times - Number of times the multi-event has been triggered.
     */
    protected _add2EventsUpdateMap = (name: string | symbol, times: number) => {
        this._eventsUpdateMap.set(name, times);
    }

    /**
     * Retrieves the last recorded trace of the total number of times a multi-event has been triggered from the map.
     * @param name - Combined event name.
     * @returns The last recorded trace of triggered times for the multi-event.
     */
    protected _getEventsUpdateMap = (name: string | symbol): number => {
        return this._eventsUpdateMap.get(name) ?? 0;
    }

    /**
     * Adds or updates arbitrary data associated with individual events to the map.
     * @param name - Event name.
     * @param data - Associated data.
     */
    protected _add2EventsDataMap = (name: string | symbol, data: any) => {
        this._eventsDataMap.set(name, data);
    }

    /**
     * Retrieves arbitrary data associated with an individual event from the map.
     * @param name - Event name.
     * @returns The associated data for the event.
     */
    protected _getEventsDataMap = (name: string): any => {
        return this._eventsDataMap.get(name);
    }

    /**
     * Increments the count of times an individual event has been triggered.
     * @param name - Event name or symbol.
     */
    protected _addEventsTimes = (name: string | symbol) => {
        let times = this._eventCountMap.get(name) ?? 0;
        times += 1;
        this._eventCountMap.set(name, times);
    }

    /**
     * Retrieves the count of times an individual event has been triggered.
     * @param name - Event name.
     * @returns The count of times the event has been triggered.
     */
    protected _getEventsTimes = (name: string): number => {
        return this._eventCountMap.get(name) ?? 0;
    }

    /**
     * Generates a unique token representing the combination of events in the provided list.
     * @param nameList - List of event names.
     * @returns The generated token.
     */
    protected _generateMultiEventsToken = (nameList: string[]): symbol => {
        return Symbol.for(`Teleport:${nameList.join(",")}`);
    }


    /**
     * Checks for multi-event conditions and triggers automatic emission if conditions are met.
     * @protected
     */
    protected _checkMultiEvents() {
        for (let i = 0; i < this._multiEventsList.length; i++) {
            const eventsList = this._multiEventsList[i] ?? [];
            // every event that be executed times
            const timesArr = eventsList.map((eventName) => this._getEventsTimes(eventName));
            // is that one of the event that executed times not 0
            const isNotContainsZero = !timesArr.includes(0);
            const updatedEventName = this._generateMultiEventsToken(eventsList);
            const lastTrace = this._getEventsUpdateMap(updatedEventName) ?? 0;
            const currentUpdateTimes = timesArr.reduce((pre, cur) => pre + cur, 0);
            if (isNotContainsZero) {
                if (currentUpdateTimes !== lastTrace) this._autoEmit(eventsList);
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

    protected _autoEmit(eventsList: string[]) {
        const multiEventsName = this._generateMultiEventsToken(eventsList);
        const dataList = eventsList.map(eventName => this._getEventsDataMap(eventName));
        const emitData: EmitDataType<any[]> = { data: dataList }
        const subject = this._eventMap.get(multiEventsName);
        if (!subject) {
            const _subject = new Subject<any>();
            this._eventMap.set(multiEventsName, _subject);
            return this._add2WaitMap(multiEventsName, (_name: string | symbol) => {
                const ptr = this._eventMap.get(_name);
                ptr?.next(emitData);
            })
        }
        subject.next(emitData);
    }


    /**
     * Method to add handlers to the wait queue.
     * @param name - The name or symbol of the event.
     * @param handlers - The event handlers to be added to the wait queue.
     */
    protected _add2WaitMap(name: string | symbol, ...handlers: ((name: string | symbol) => void)[]): void {
        if (this._waitQueueMap.has(name)) {
            const queue = this._waitQueueMap.get(name) ?? [];
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
    protected _fireWaitHandlers(name: string | symbol): void {
        const queue = this._waitQueueMap.get(name) ?? [];
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
    public emit<T>(name: string | symbol, data: T, callback?: () => void): TeleportSingleton {
        const emitData: EmitDataType<T> = {
            data: data,
            callback: callback,
        };

        this._add2EventsDataMap(name, data);

        const subject = this._eventMap.get(name);
        if (!subject) {
            const _subject = new Subject<EmitDataType<T>>();
            this._eventMap.set(name, _subject);
            this._add2WaitMap(name, (_name: string | symbol) => {
                const ptr = this._eventMap.get(_name);
                ptr?.next(emitData);
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
    private _afterEmit(name: string | symbol) {
        this._addEventsTimes(name);
        this._checkMultiEvents();
    }


    /**
     * handler‘s wrapper
     * @param handler 
     * @param mode 0 => single, 1=> multiple  
     */
    private _eventHandler = (handler: (...data: any[]) => void, mode:0|1) => {
        return (emitData: EmitDataType<any>) => {
            if(mode === 0) handler(emitData.data);
            if(mode === 1) handler(...emitData.data);
            emitData.callback && emitData.callback();
        }
    }


    /**
     * Method to receive an event and handle it with a provided handler.
     * @param name - The name or symbol of the event.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    public receive(name: string | symbol, handler: (data: any) => void): TeleportSingleton {
        const subject = this._eventMap.get(name);
        if (!subject) {
            const ptr = new Subject<any>();
            this._eventMap.set(name, ptr);
            ptr.subscribe({ next: this._eventHandler(handler, 0) });
            return this;
        }

        subject.subscribe({ next: this._eventHandler(handler, 0) });
        if ((this._waitQueueMap.get(name) ?? []).length) {
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
    public multiReceive(nameList: string[], handler: (...data: any[]) => void): TeleportSingleton {
        this._multiEventsList.push(nameList);

        nameList.forEach((eventName) => {
            this.receive(eventName, () => { });
        });

        const eventsNameList = this._generateMultiEventsToken(nameList);
        const subject = this._eventMap.get(eventsNameList);
        if (!subject) {
            const ptr = new Subject<any>();
            this._eventMap.set(eventsNameList, ptr);
            ptr.subscribe({ next: this._eventHandler(handler, 1) });
            return this;
        }

        subject.subscribe({ next: this._eventHandler(handler, 1) });
        if ((this._waitQueueMap.get(eventsNameList) ?? []).length) {
            this._fireWaitHandlers(eventsNameList);
        }
        return this;
    }






    /**
     * Method to remove a specific event handler by name.
     * @param name - The name of the event handler to be removed.
     */
    public removeHandle(name: string | symbol): void {
        const subject = this._eventMap.get(name);
        if (!subject) return;
        subject.unsubscribe();
        this._eventMap.delete(name);
    }

    /**
     * Method to remove all event handlers.
     */
    public removeAllHandlers(): void {
        for (const name of this._eventMap.keys()) {
            this.removeHandle(name);
        }
        this._eventMap.clear();
    }

    /**
     * Method to clear both wait queues and event handlers.
     */
    public clear(): void {
        this._waitQueueMap.clear();
        this.removeAllHandlers();
        this._clearEventCountMap();
        this._clearMultiEventsList();
        this._clearEventsUpdateMap();
        this._clearEventsDataMap();
    }
}
