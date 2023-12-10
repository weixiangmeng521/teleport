import { Subscription } from '../internal/subscription';

// Mock event handler
const mockHandler = jest.fn();

describe('Subscription', () => {
    let subscription: Subscription;

    beforeEach(() => {
        subscription = new Subscription();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should subscribe to an event type', () => {
        subscription.subscribe('eventType', mockHandler);
        expect(subscription['events'].has('eventType')).toBeTruthy();
        expect(subscription['events'].get('eventType')).toHaveLength(1);
    });

    it('should publish an event with data', () => {
        subscription.subscribe('eventType', mockHandler);
        subscription.publish('eventType', 'testData');
        expect(mockHandler).toHaveBeenCalledWith('testData');
    });

    it('should unsubscribe from an event type', () => {
        subscription.subscribe('eventType', mockHandler);
        subscription.unsubscribe('eventType', mockHandler);
        expect(subscription['events'].get('eventType')).toHaveLength(0);
    });
});
