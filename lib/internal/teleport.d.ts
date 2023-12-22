import { Subject } from "./subject";
/**
 * @weixiangmeng521
 */
export declare class TeleportSingleton {
    /**
     * Map to store event subjects by name or symbol.
     */
    protected _eventMap: Map<string | symbol, Subject<any>>;
    /**
     * Map to store queued event handlers waiting for the event to be created.
     */
    protected _waitQueueMap: Map<string | symbol, ((name: string | symbol) => void)[]>;
    /**
     * Singleton instance.
     */
    private static _instance;
    /**
     * Map to store the count of times each individual event has been triggered.
     * Key: Event name or symbol, Value: Number of times triggered.
     */
    protected _eventCountMap: Map<string | symbol, number>;
    /**
     * Array to store lists of events that are considered as a single multi-event.
     * Each list represents a combination of events to be treated collectively.
     */
    protected _multiEventsList: string[][];
    /**
     * Map to store the last recorded trace of the total number of times a multi-event has been triggered.
     * Key: Combined event name or symbol, Value: Last recorded trace of triggered times.
     */
    protected _eventsUpdateMap: Map<string | symbol, number>;
    /**
     * Map to store arbitrary data associated with individual events.
     * Key: Event name or symbol, Value: Associated data.
     */
    protected _eventsDataMap: Map<string | symbol, any>;
    /**
     * Private constructor to enforce singleton pattern.
     */
    private constructor();
    /**
     * Method to get or create the singleton instance.
     * @returns The singleton instance of TeleportSingleton.
     */
    static getInstance(): TeleportSingleton;
    /**
     * Clears the map storing the count of times each individual event has been triggered.
     */
    protected _clearEventCountMap: () => void;
    /**
     * Clears the array storing lists of events that are considered as single multi-events.
     */
    protected _clearMultiEventsList: () => void;
    /**
     * remove one of the multi event
     */
    protected _removeMultiEvent: (nameList: string[]) => void;
    /**
     * Clears the map storing the last recorded trace of the total number of times a multi-event has been triggered.
     */
    protected _clearEventsUpdateMap: () => void;
    /**
     * Clears the map storing arbitrary data associated with individual events.
     */
    protected _clearEventsDataMap: () => void;
    /**
     * Adds or updates the total number of times a multi-event has been triggered to the map.
     * @param name - Combined event name or symbol.
     * @param times - Number of times the multi-event has been triggered.
     */
    protected _add2EventsUpdateMap: (name: string | symbol, times: number) => void;
    /**
     * Retrieves the last recorded trace of the total number of times a multi-event has been triggered from the map.
     * @param name - Combined event name.
     * @returns The last recorded trace of triggered times for the multi-event.
     */
    protected _getEventsUpdateMap: (name: string | symbol) => number;
    /**
     * Adds or updates arbitrary data associated with individual events to the map.
     * @param name - Event name.
     * @param data - Associated data.
     */
    protected _add2EventsDataMap: (name: string | symbol, data: any) => void;
    /**
     * Retrieves arbitrary data associated with an individual event from the map.
     * @param name - Event name.
     * @returns The associated data for the event.
     */
    protected _getEventsDataMap: (name: string) => any;
    /**
     * Increments the count of times an individual event has been triggered.
     * @param name - Event name or symbol.
     */
    protected _addEventsTimes: (name: string | symbol) => void;
    /**
     * Retrieves the count of times an individual event has been triggered.
     * @param name - Event name.
     * @returns The count of times the event has been triggered.
     */
    protected _getEventsTimes: (name: string) => number;
    /**
     * Generates a unique token representing the combination of events in the provided list.
     * @param nameList - List of event names.
     * @returns The generated token.
     */
    protected _generateMultiEventsToken: (nameList: string[]) => symbol;
    /**
     * Checks for multi-event conditions and triggers automatic emission if conditions are met.
     * @protected
     */
    protected _checkMultiEvents(): void;
    /**
     * Automatically emits a multi-event with the provided list of events and their associated data.
     * Creates a combined event with a unique token and triggers emission to subscribers.
     *
     * @param {string[]} eventsList - The list of events to be combined and emitted.
     */
    protected _autoEmit(eventsList: string[]): void;
    /**
     * Method to add handlers to the wait queue.
     * @param name - The name or symbol of the event.
     * @param handlers - The event handlers to be added to the wait queue.
     */
    protected _add2WaitMap(name: string | symbol, ...handlers: ((name: string | symbol) => void)[]): void;
    /**
     * Method to execute queued handlers for a specific event.
     * @param name - The name or symbol of the event.
     */
    protected _fireWaitHandlers(name: string | symbol): void;
    /**
     * Method to emit an event with data and optional callback.
     * @template T - The type of data to be emitted.
     * @param name - The name or symbol of the event.
     * @param data - The data to be emitted with the event.
     * @param callback - Optional callback to be executed after emitting the event.
     */
    emit<T>(name: string | symbol, data: T, callback?: () => void): TeleportSingleton;
    /**
     * After emit data then execute.
     * @param name event name
     */
    private _afterEmit;
    /**
     * handler‘s wrapper
     * @param handler
     * @param mode 0 => single, 1=> multiple
     */
    private _eventHandler;
    /**
     * Method to receive an event and handle it with a provided handler.
     * @param name - The name or symbol of the event.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    receive(name: string | symbol, handler: (data: any) => void): {
        clear: () => void;
    };
    /**
     * Method to handle multiple events with a common handler.
     * @param nameList - The list of event names.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    multiReceive(nameList: string[], handler: (...data: any[]) => void): {
        clear: () => void;
    };
    /**
     * Method to remove a specific event handler by name.
     * @param name - The name of the event handler to be removed.
     */
    removeHandle(name: string | symbol): void;
    /**
     * Remove one of the multi handle
     * @param nameList
     */
    removeMultiHandle(nameList: string[]): void;
    /**
     * Method to remove all event handlers.
     */
    removeAllHandlers(): void;
    /**
     * Method to clear both wait queues and event handlers.
     */
    clear(): void;
}
