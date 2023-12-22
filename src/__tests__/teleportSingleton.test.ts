import { TeleportSingleton } from '../index';

describe('TeleportSingleton', () => {
    let teleport: TeleportSingleton;

    beforeEach(() => {
        teleport = TeleportSingleton.getInstance();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getInstance() should return the same instance', () => {
        const instance1 = TeleportSingleton.getInstance();
        const instance2 = TeleportSingleton.getInstance();

        expect(instance1).toBe(instance2);
    });

    test('emit() should call the callback when provided', () => {
        const callback = jest.fn();
        teleport.receive('testEvent', (data) => {
            expect(data).toBe("testData");
        });
        teleport.emit('testEvent', 'testData', callback);

        expect(callback).toHaveBeenCalled();
    });

    test('receive() should call the handler when an event is emitted', () => {
        const mockHandler = jest.fn();
        teleport.receive('testEvent', mockHandler);

        teleport.emit('testEvent', 'testData');

        expect(mockHandler).toHaveBeenCalledWith('testData');
    });

    test('removeHandle() should unsubscribe the handler', () => {
        const mockHandler = jest.fn();
        teleport.receive('testEvent', mockHandler);

        teleport.removeHandle('testEvent');
        teleport.emit('testEvent', 'testData');

        expect(mockHandler).not.toHaveBeenCalled();
    });

    test('removeAllHandlers() should remove all handlers', () => {
        const mockHandler1 = jest.fn();
        const mockHandler2 = jest.fn();

        teleport.receive('event1', mockHandler1);
        teleport.receive('event2', mockHandler2);

        teleport.removeAllHandlers();
        teleport.emit('event1', 'data1');
        teleport.emit('event2', 'data2');

        expect(mockHandler1).not.toHaveBeenCalled();
        expect(mockHandler2).not.toHaveBeenCalled();
    });

    test('clear() should clear wait queues and event handlers', () => {
        const mockHandler = jest.fn();
        teleport.receive('testEvent', mockHandler);

        // Use casting to any
        const waitQueueMap: Map<string | symbol, ((name: string | symbol) => void)[]> = (teleport as any)._waitQueueMap;

        expect(waitQueueMap.size).toBeGreaterThan(0);

        teleport.clear();

        expect(waitQueueMap.size).toBe(0);
        expect(teleport['_eventMap'].size).toBe(0); // Direct access to _eventMap without casting
    });

    // Test case for handling multiple events with a common handler
    it('should handle multiple events with a common handler', () => {
        // Arrange
        const teleport = TeleportSingleton.getInstance();
        const eventNames = ['event1', 'event2', 'event3'];
        const expectedData = ['Data 1', 'Data 2', 'Data 3'];
        let receivedData: any[] = [];

        // Act
        teleport.multiReceive(eventNames, (...data) => {
            receivedData = data;
        });

        eventNames.forEach((eventName, index) => {
            teleport.emit(eventName, expectedData[index]);
        });

        // Assert
        expect(receivedData).toEqual(expectedData);
    });


    // Test case for handling multiple events with a common handler
    it('should handle multiple events with a common handler by async', () => {
        // Arrange
        const teleport = TeleportSingleton.getInstance();
        const eventNames = ['event1', 'event2', 'event3'];
        const expectedData = ['Data 1', 'Data 2', 'Data 3'];

        // Act
        setTimeout(() => {
            teleport.multiReceive(eventNames, (...data) => {
                expect(data).toEqual(expectedData);
            });  
        }, 10);

        eventNames.forEach((eventName, index) => {
            teleport.emit(eventName, expectedData[index]);
        });
    });


    test('removeMultiHandle() should unsubscribe the handler', () => {
        const mockHandler = jest.fn();
        const subscriptions = ['testEvent1', 'testEvent2'];
        teleport.multiReceive(subscriptions, mockHandler);

        teleport.removeMultiHandle(subscriptions);
        subscriptions.forEach((sub) => {
            teleport.emit(sub, 'testData');
        })
        
        expect(mockHandler).not.toHaveBeenCalled();
    });

    
});
