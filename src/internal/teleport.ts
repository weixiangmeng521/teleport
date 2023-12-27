// Import the required RxJS classes and custom types
import { GroupSubject } from "./order_map";
import { Subject } from "./subject";
import { TaskQueue, LazyTaskQueue } from "./task_queue";
import { EmitDataType } from "./types";


/**
 * @weixiangmeng521
 */
export class TeleportSingleton {
    /**
     * Map to store event subjects by name or symbol.
     */
    protected _eventMap: Map<string | symbol, Subject<any>> = new Map();


    /**
     * Task queue
     */
    protected _taskQueue:LazyTaskQueue = new TaskQueue();


    /**
     * Singleton instance.
     */
    private static _instance: TeleportSingleton;

    /**
    * group event map
    */
    private _groupEventMap:Map<symbol, GroupSubject> = new Map(); 



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
     * Generates a unique token representing the combination of events in the provided list.
     * @param nameList - List of event names.
     * @returns The generated token.
     */
    protected _generateMultiEventsToken = (nameList: string[]): symbol => {
        return Symbol.for(`Teleport:${nameList.join(",")}`);
    }




    /**
     * Method to add handlers to the wait queue.
     * @param name - The name or symbol of the event.
     * @param handlers - The event handlers to be added to the wait queue.
     */
    protected _add2TaskQueue(name: string | symbol, ...handlers: ((name: string | symbol) => void)[]): void {
        handlers.forEach((handler) => {
            this._taskQueue.add(name, handler);
        })
    }

    /**
     * Method to execute queued handlers for a specific event.
     * @param name - The name or symbol of the event.
     */
    protected _fireTaskQueue(name: string | symbol): void {
        this._taskQueue.schedule(name);
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

        const subject = this._eventMap.get(name);
        if (!subject) {
            const _subject = new Subject<EmitDataType<T>>();
            this._eventMap.set(name, _subject);
            this._add2TaskQueue(name, (_name: string | symbol) => {
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
    private _afterEmit(_: string | symbol) {
        // TODO:
    }



    /**
     * Method to receive an event and handle it with a provided handler.
     * @param name - The name or symbol of the event.
     * @param handler - The handler function to process the event data.
     * @returns The TeleportSingleton instance for chaining.
     */
    public receive(name: string | symbol, handler: (data: any) => void): { clear: () => void } {
        const subject = this._eventMap.get(name) ?? new Subject<any>();
        this._eventMap.set(name, subject);
        const clearHandler = subject.subscribe({ 
            next: (emitData: EmitDataType<any>) => {
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
    public multiReceive(nameList: string[], handler: (...data: any[]) => void): { clear: () => void } {
        // event's name
        const eventsNameList = this._generateMultiEventsToken(nameList);

        // get or create a instance
        const groupSubject = this._groupEventMap.get(eventsNameList) ?? new GroupSubject();
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
                clearChildrenHandlers.forEach((childHandler) => { childHandler.clear() });
            }
        }
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
     * Remove one of the multi handle
     * @param nameList 
     */
    public removeMultiHandle(nameList:string[]){
        const token = this._generateMultiEventsToken(nameList);
        // clear children event
        nameList.forEach((evtName) => {
            this.removeHandle(evtName);
        });
        const subject = this._groupEventMap.get(token);
        subject?.clear();
    }


    /**
     * Method to remove all event handlers.
     */
    public removeAllHandlers(): void {
        for (const name of this._eventMap.keys()) {
            this.removeHandle(name);
        }
        for (const token of this._groupEventMap.keys()) {
            this._groupEventMap.get(token)?.clear();
        }        
        this._eventMap.clear();
    }


    /**
     * Method to clear both wait queues and event handlers.
     */
    public clear(): void {
        this._taskQueue.clear();
        this.removeAllHandlers();
    }
}
