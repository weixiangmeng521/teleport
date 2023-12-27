// Task class represents a task with a name and a callback function
export class Task {
    // Private properties
    private _name: symbol | string = "";
    private _callback: ((name: any) => void) | void;

    // Constructor to initialize the task with a name and a callback
    constructor(name: string | symbol, callback: ((name: symbol | string) => void)) {
        this._name = name;
        this._callback = callback;
    }

    /**
     * Get the name of the task.
     * @returns {symbol | string} The name of the task.
     */
    public getTaskName(): symbol | string {
        return this._name;
    }

    /**
     * Execute the task's callback function.
     */
    public run(): void {
        this._callback?.(this._name);
    }
}







// TaskQueue class manages a queue of tasks
export class TaskQueue {
    // Private property to store the queue of tasks
    private readonly _queue: Task[] = [];

    // Constructor to initialize the task queue
    constructor() { }

    /**
     * Find all tasks with a given name.
     * @param {string | symbol} name - The name of the tasks to find.
     * @returns {Task[]} An array of tasks with the specified name.
     */
    protected _findTasksList(name: string | symbol): Task[] {
        return this._queue.filter((task: Task) => task.getTaskName() === name);
    }

    /**
     * Remove all tasks with a given name.
     * @param {string | symbol} name - The name of the tasks to remove.
     */
    protected _removeTasks(name: string | symbol): void {
        for (let i = this._queue.length - 1; i >= 0; i--) {
            const currentTask = this._queue[i];
            if (currentTask && currentTask.getTaskName() === name) {
                this._queue.splice(i, 1);
            }
        }
    }

    /**
     * Find a task with a given name.
     * @param {string | symbol} name - The name of the task to find.
     * @returns {Task | undefined} The task with the specified name, or undefined if not found.
     */
    protected findTask(name: string | symbol): Task | undefined{
        return this._queue.find((task: Task) => task.getTaskName() === name);
    }


    /**
     * Find a task with a given name.
     * @param {string | symbol} name - The name of the task to find.
     * @returns {number} index
     */
    protected findTaskIndex(name: string | symbol):number{
        return this._queue.findIndex((task: Task) => task.getTaskName() === name);
    }

    /**
     * Add a new task to the queue.
     * @param {string | symbol} name - The name of the task.
     * @param {((name: symbol | string) => void)} callback - The callback function to execute when the task runs.
     */
    public add(name: string | symbol, callback: ((name: symbol | string) => void)): void {
        const task = new Task(name, callback);
        this._queue.push(task);
    }

    /**
     * Execute the task with a given name and remove all tasks with that name.
     * @param {string | symbol} name - The name of the tasks to execute and remove.
     */
    public schedule(name: string | symbol): void {
        const taskIndex = this.findTaskIndex(name);
        const task = this._queue[taskIndex];
        if(taskIndex < 0 || !this._queue.length || !task) return;
        task.run();
        this._queue.splice(taskIndex, 1);
        // next
        this.schedule(name);
    }

    /**
     * Clear the entire task queue.
     */
    public clear(): void {
        this._queue.splice(0, this._queue.length);
    }


    /**
     * Get the current length of the task queue.
     * @returns {number} The length of the task queue.
     */
    public getQueueLength(): number {
        return this._queue.length;
    }
}








// In order to reduce the number of executions, 
// the last execution will overwrite the previous ones and 
// only the last task will be executed.
export class LazyTaskQueue extends TaskQueue{
    
    constructor(){
        super()
    }

    /**
     * Execute the last task with a given name and remove all tasks with that name.
     * @param {string | symbol} name - The name of the tasks to execute and remove.
     */
    override schedule(name: string | symbol): void {
        const tasksList = this._findTasksList(name);
        const finalTask = tasksList[tasksList.length - 1];
        finalTask?.run();
        this._removeTasks(name);
    }

}