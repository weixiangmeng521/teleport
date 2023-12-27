import { TaskQueue, Task, LazyTaskQueue } from '../internal/task_queue';

describe('Task and TaskQueue', () => {
    const taskQueue = new TaskQueue();
    const lazyTaskQueue = new LazyTaskQueue();

    beforeEach(() => {
        taskQueue.clear();
        lazyTaskQueue.clear();
    });

    test('Task creation and execution', () => {
        const callbackMock = jest.fn();
        const task = new Task('Task1', callbackMock);

        expect(task.getTaskName()).toBe('Task1');

        task.run();
        expect(callbackMock).toHaveBeenCalledWith('Task1');
    });

    test('TaskQueue add and schedule', () => {
        const callbackMock = jest.fn();

        taskQueue.add('Task1', callbackMock);
        taskQueue.schedule('Task1');

        expect(callbackMock).toHaveBeenCalledWith('Task1');
    });

    test('TaskQueue clear', () => {
        const callbackMock = jest.fn();

        taskQueue.add('Task1', callbackMock);
        taskQueue.add('Task2', callbackMock);
        taskQueue.clear();

        // Use public method to check the length
        expect(taskQueue.getQueueLength()).toBe(0);
    });

    test('TaskQueue multiple tasks with the same name', () => {
        const callbackMock1 = jest.fn();
        const callbackMock2 = jest.fn();

        taskQueue.add('Task1', callbackMock1);
        taskQueue.add('Task1', callbackMock2);
        taskQueue.schedule('Task1');

        expect(callbackMock1).toHaveBeenCalledWith('Task1');
        expect(callbackMock2).toHaveBeenCalledWith('Task1');
    });

    test('LazyTaskQueue multiple tasks with the same name', () => {
        const callbackMock1 = jest.fn();
        const callbackMock2 = jest.fn();

        lazyTaskQueue.add('Task1', callbackMock1);
        lazyTaskQueue.add('Task1', callbackMock2);
        lazyTaskQueue.schedule('Task1');

        expect(callbackMock1).not.toHaveBeenCalled();
        expect(callbackMock2).toHaveBeenCalledWith('Task1');
    });


    test('TaskQueue removing tasks', () => {
        const callbackMock1 = jest.fn();
        const callbackMock2 = jest.fn();

        taskQueue.add('Task1', callbackMock1);
        taskQueue.add('Task2', callbackMock2);

        taskQueue.schedule('Task1');
        expect(callbackMock1).toHaveBeenCalledWith('Task1');
        expect(callbackMock2).not.toHaveBeenCalled();

        // Use public method to check the length
        expect(taskQueue.getQueueLength()).toBe(1);

        const _taskQueue = (taskQueue as any);
        // Use public method to check if the task was removed
        expect(_taskQueue.findTask('Task1')).toBeUndefined();
    });
});
