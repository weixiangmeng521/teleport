"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyTaskQueue = exports.TaskQueue = exports.Task = void 0;
// Task class represents a task with a name and a callback function
class Task {
    // Constructor to initialize the task with a name and a callback
    constructor(name, callback) {
        // Private properties
        this._name = "";
        this._name = name;
        this._callback = callback;
    }
    /**
     * Get the name of the task.
     * @returns {symbol | string} The name of the task.
     */
    getTaskName() {
        return this._name;
    }
    /**
     * Execute the task's callback function.
     */
    run() {
        var _a;
        (_a = this._callback) === null || _a === void 0 ? void 0 : _a.call(this, this._name);
    }
}
exports.Task = Task;
// TaskQueue class manages a queue of tasks
class TaskQueue {
    // Constructor to initialize the task queue
    constructor() {
        // Private property to store the queue of tasks
        this._queue = [];
    }
    /**
     * Find all tasks with a given name.
     * @param {string | symbol} name - The name of the tasks to find.
     * @returns {Task[]} An array of tasks with the specified name.
     */
    _findTasksList(name) {
        return this._queue.filter((task) => task.getTaskName() === name);
    }
    /**
     * Remove all tasks with a given name.
     * @param {string | symbol} name - The name of the tasks to remove.
     */
    _removeTasks(name) {
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
    findTask(name) {
        return this._queue.find((task) => task.getTaskName() === name);
    }
    /**
     * Find a task with a given name.
     * @param {string | symbol} name - The name of the task to find.
     * @returns {number} index
     */
    findTaskIndex(name) {
        return this._queue.findIndex((task) => task.getTaskName() === name);
    }
    /**
     * Add a new task to the queue.
     * @param {string | symbol} name - The name of the task.
     * @param {((name: symbol | string) => void)} callback - The callback function to execute when the task runs.
     */
    add(name, callback) {
        const task = new Task(name, callback);
        this._queue.push(task);
    }
    /**
     * Execute the task with a given name and remove all tasks with that name.
     * @param {string | symbol} name - The name of the tasks to execute and remove.
     */
    schedule(name) {
        const taskIndex = this.findTaskIndex(name);
        const task = this._queue[taskIndex];
        if (taskIndex < 0 || !this._queue.length || !task)
            return;
        task.run();
        this._queue.splice(taskIndex, 1);
        // next
        this.schedule(name);
    }
    /**
     * Clear the entire task queue.
     */
    clear() {
        this._queue.splice(0, this._queue.length);
    }
    /**
     * Get the current length of the task queue.
     * @returns {number} The length of the task queue.
     */
    getQueueLength() {
        return this._queue.length;
    }
}
exports.TaskQueue = TaskQueue;
// In order to reduce the number of executions, 
// the last execution will overwrite the previous ones and 
// only the last task will be executed.
class LazyTaskQueue extends TaskQueue {
    constructor() {
        super();
    }
    /**
     * Execute the last task with a given name and remove all tasks with that name.
     * @param {string | symbol} name - The name of the tasks to execute and remove.
     */
    schedule(name) {
        const tasksList = this._findTasksList(name);
        const finalTask = tasksList[tasksList.length - 1];
        finalTask === null || finalTask === void 0 ? void 0 : finalTask.run();
        this._removeTasks(name);
    }
}
exports.LazyTaskQueue = LazyTaskQueue;
