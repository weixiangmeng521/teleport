export declare class Task {
    private _name;
    private _callback;
    constructor(name: string | symbol, callback: ((name: symbol | string) => void));
    /**
     * Get the name of the task.
     * @returns {symbol | string} The name of the task.
     */
    getTaskName(): symbol | string;
    /**
     * Execute the task's callback function.
     */
    run(): void;
}
export declare class TaskQueue {
    private readonly _queue;
    constructor();
    /**
     * Find all tasks with a given name.
     * @param {string | symbol} name - The name of the tasks to find.
     * @returns {Task[]} An array of tasks with the specified name.
     */
    protected _findTasksList(name: string | symbol): Task[];
    /**
     * Remove all tasks with a given name.
     * @param {string | symbol} name - The name of the tasks to remove.
     */
    protected _removeTasks(name: string | symbol): void;
    /**
     * Find a task with a given name.
     * @param {string | symbol} name - The name of the task to find.
     * @returns {Task | undefined} The task with the specified name, or undefined if not found.
     */
    protected findTask(name: string | symbol): Task | undefined;
    /**
     * Find a task with a given name.
     * @param {string | symbol} name - The name of the task to find.
     * @returns {number} index
     */
    protected findTaskIndex(name: string | symbol): number;
    /**
     * Add a new task to the queue.
     * @param {string | symbol} name - The name of the task.
     * @param {((name: symbol | string) => void)} callback - The callback function to execute when the task runs.
     */
    add(name: string | symbol, callback: ((name: symbol | string) => void)): void;
    /**
     * Execute the task with a given name and remove all tasks with that name.
     * @param {string | symbol} name - The name of the tasks to execute and remove.
     */
    schedule(name: string | symbol): void;
    /**
     * Clear the entire task queue.
     */
    clear(): void;
    /**
     * Get the current length of the task queue.
     * @returns {number} The length of the task queue.
     */
    getQueueLength(): number;
}
export declare class LazyTaskQueue extends TaskQueue {
    constructor();
    /**
     * Execute the last task with a given name and remove all tasks with that name.
     * @param {string | symbol} name - The name of the tasks to execute and remove.
     */
    schedule(name: string | symbol): void;
}
