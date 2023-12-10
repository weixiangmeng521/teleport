import { Observable } from '../internal/observable';

describe('Observable', () => {
  it('should notify a single subscriber with the correct value', () => {
    const observable = new Observable<number>();

    // Create a mock observer
    const mockObserver = jest.fn();

    // Subscribe to the observable
    const subscription = observable.subscribe(mockObserver);

    // Notify the observable
    observable.next(42);

    // Check if the mock observer was called with the correct value
    expect(mockObserver).toHaveBeenCalledWith(42);

    // Unsubscribe
    subscription.unsubscribe();

    // Notify the observable again
    observable.next(99);

    // Check that the mock observer is not called after unsubscribing
    expect(mockObserver).toHaveBeenCalledTimes(1);
  });

  it('should notify multiple subscribers with the correct values', () => {
    const observable = new Observable<number>();
  
    // Create mock observers
    const mockObserver1 = jest.fn();
    const mockObserver2 = jest.fn();
  
    // Subscribe to the observable
    const subscription1 = observable.subscribe(mockObserver1);
    observable.subscribe(mockObserver2);  // Removed the declaration of subscription2
  
    // Notify the observable
    observable.next(42);
  
    // Check if both mock observers were called with the correct value
    expect(mockObserver1).toHaveBeenCalledWith(42);
    expect(mockObserver2).toHaveBeenCalledWith(42);
  
    // Unsubscribe one subscriber
    subscription1.unsubscribe();
  
    // Notify the observable again
    observable.next(99);
  
    // Check that the first mock observer is not called after unsubscribing
    expect(mockObserver1).toHaveBeenCalledTimes(1);
  
    // Check that the second mock observer is called with the correct value
    expect(mockObserver2).toHaveBeenCalledWith(99);
  });
  
  it('should handle multiple notifications correctly', () => {
    const observable = new Observable<number>();

    // Create a mock observer
    const mockObserver = jest.fn();

    // Subscribe to the observable
    const subscription = observable.subscribe(mockObserver);

    // Notify the observable multiple times
    observable.next(42);
    observable.next(99);

    // Check if the mock observer was called with the correct values
    expect(mockObserver).toHaveBeenCalledWith(42);
    expect(mockObserver).toHaveBeenCalledWith(99);

    // Unsubscribe
    subscription.unsubscribe();

    // Notify the observable again
    observable.next(123);

    // Check that the mock observer is not called after unsubscribing
    expect(mockObserver).toHaveBeenCalledTimes(2);
  });
});
