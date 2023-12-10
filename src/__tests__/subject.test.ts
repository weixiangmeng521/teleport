import { Subject } from '../internal/subject';


describe('Subject', () => {
  it('should notify multiple subscribers with the correct values', () => {
    const subject = new Subject<number>();

    // Create mock observers
    const mockObserver1 = { next: jest.fn() };
    const mockObserver2 = { next: jest.fn() };
    const mockObserver3 = { next: jest.fn() };

    // Subscribe to the subject
    subject.subscribe(mockObserver1);
    subject.subscribe(mockObserver2);
    subject.subscribe(mockObserver3);

    // Notify the subject
    subject.next(42);

    // Check if all mock observers were called with the correct value
    expect(mockObserver1.next).toHaveBeenCalledWith(42);
    expect(mockObserver2.next).toHaveBeenCalledWith(42);
    expect(mockObserver3.next).toHaveBeenCalledWith(42);
  });


  it('should handle multiple notifications correctly', () => {
    const subject = new Subject<number>();

    // Create mock observer
    const mockObserver = { next: jest.fn() };

    // Subscribe to the subject
    subject.subscribe(mockObserver);

    // Notify the subject multiple times
    subject.next(42);
    subject.next(99);

    // Check if the mock observer was called with the correct values
    expect(mockObserver.next).toHaveBeenCalledWith(42);
    expect(mockObserver.next).toHaveBeenCalledWith(99);
  });
});
