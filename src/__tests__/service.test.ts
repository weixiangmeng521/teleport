import { Teleport } from '../internal/service';

describe('Teleport', () => {
  let teleport: Teleport;

  beforeEach(() => {
    teleport = new Teleport();
  });

  afterEach(() => {
    // Clean up after each test
    teleport.clear();
  });

  it('should emit an event and receive it correctly', () => {
    const eventName = 'testEvent';
    const eventData = { message: 'Hello, Teleport!' };

    // Create a mock handler function
    const mockHandler = jest.fn();

    // Register the mock handler for the event
    teleport.receive(eventName, mockHandler);

    // Emit the event
    teleport.emit(eventName, eventData);

    // Check if the mock handler was called with the correct data
    expect(mockHandler).toHaveBeenCalledWith(eventData);
  });

  it('should remove a specific event handler', () => {
    const eventName = 'testEvent';

    // Create a mock handler function
    const mockHandler = jest.fn();

    // Register the mock handler for the event
    teleport.receive(eventName, mockHandler);

    // Remove the event handler
    teleport.removeHandle(eventName);

    // Emit the event
    teleport.emit(eventName, { message: 'This should not be handled' });

    // Check that the mock handler was not called
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should remove all event handlers', () => {
    const eventName1 = 'event1';
    const eventName2 = 'event2';

    // Create mock handler functions
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();

    // Register mock handlers for events
    teleport.receive(eventName1, mockHandler1);
    teleport.receive(eventName2, mockHandler2);

    // Remove all event handlers
    teleport.removeAllHandlers();

    // Emit events
    teleport.emit(eventName1, { message: 'Event 1 data' });
    teleport.emit(eventName2, { message: 'Event 2 data' });

    // Check that mock handlers were not called
    expect(mockHandler1).not.toHaveBeenCalled();
    expect(mockHandler2).not.toHaveBeenCalled();
  });

  it('should clear all emitted events', () => {

    const eventName = 'testEvent123';

    // Create a mock handler function
    const mockHandler = jest.fn();

    // Register mock handlers for events
    teleport.receive(eventName, mockHandler);

    // Emit the event
    teleport.emit(eventName, { message: 'This should not be handled' });

    // Clear all handlers and emitted events
    teleport.clear();

    // Emit the event again
    teleport.emit(eventName, { message: 'This should not be handled' });

    // Check that the mock handler was not called
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });


  it('should emit and receive a message after subscription', async () => {
    const eventName = 'testEvent';
    const eventData = { message: 'Hello, Teleport!' };

    // Emit the event with a delay
    setTimeout(() => {
      teleport.emit(eventName, eventData);
    }, 1000);

    // Subscribe to the event
    const receivedDataPromise: Promise<any> = new Promise((resolve) => {
      teleport.receive(eventName, (data) => {
        resolve(data);
      });
    });

    // Wait for the subscription to receive the message
    const receivedData = await receivedDataPromise;

    // Check if the received data matches the emitted data
    expect(receivedData).toEqual(eventData);
  });
});
