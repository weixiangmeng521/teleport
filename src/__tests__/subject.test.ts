import { Subject } from '../internal/subject';

import { ObserverInterface } from '../internal/types';

describe('Subject', () => {
    it('should notify subscribed observers with the correct data', () => {
        // Arrange
        const subject = new Subject<number>();
        const mockObserver: ObserverInterface<number> = { next: jest.fn() };

        // Act
        const subscription = subject.subscribe(mockObserver);
        subject.next(42);

        // Assert
        expect(mockObserver.next).toHaveBeenCalledWith(42);

        // Cleanup
        subscription.clear();
    });

    it('should unsubscribe observers', () => {
        // Arrange
        const subject = new Subject<string>();
        const mockObserver: ObserverInterface<string> = { next: jest.fn() };

        // Act
        const subscription = subject.subscribe(mockObserver);
        subject.next('Hello, Subject!');
        subscription.clear();
        subject.next('This should not be received');

        // Assert
        expect(mockObserver.next).toHaveBeenCalledWith('Hello, Subject!');
        expect(mockObserver.next).not.toHaveBeenCalledWith('This should not be received');
    });

    // Add more test cases as needed
});
