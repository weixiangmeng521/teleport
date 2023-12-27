import { GroupSubject } from '../internal/order_map';


describe('GroupSubject', () => {
    let groupSubject: GroupSubject;

    beforeEach(() => {
        groupSubject = new GroupSubject();
    });

    test('Setting events order', () => {
        const eventsOrder = ['event1', 'event2', 'event3'];
        groupSubject.setEventsOrder(eventsOrder);

        expect(groupSubject.keysArray()).toEqual(eventsOrder);
    });

    test('Setting and getting state of an event', () => {
        const eventKey = 'event1';
        const eventValue = 'value1';

        groupSubject.setState(eventKey, eventValue);

        expect(groupSubject.getState(eventKey)).toBe(eventValue);
    });

    test('Checking if the threshold is reached', () => {
        const eventsOrder = ['event1', 'event2', 'event3'];
        groupSubject.setEventsOrder(eventsOrder);

        eventsOrder.forEach((event) => {
            groupSubject.setState(event, 'value');
        });

        expect(groupSubject['_isReachedOrOverThreshold']()).toBe(true);
    });

    test('Subscribing and emitting data', (done) => {
        const eventsOrder = ['event1', 'event2', 'event3'];
        groupSubject.setEventsOrder(eventsOrder);

        const expectedResult = ['value1', 'value2', 'value3'];

        groupSubject.subscribe((...data) => {
            expect(data).toEqual(expectedResult);
            done();
        });

        eventsOrder.forEach((event, index) => {
            groupSubject.setState(event, expectedResult[index]);
        });
    });

    test('Clearing the GroupSubject', () => {
        const eventsOrder = ['event1', 'event2', 'event3'];
        groupSubject.setEventsOrder(eventsOrder);

        eventsOrder.forEach((event) => {
            groupSubject.setState(event, 'value');
        });

        groupSubject.clear();

        expect(groupSubject.size()).toBe(0);
        expect(groupSubject['_triggeredTimes']).toBe(0);
        expect(groupSubject['_threshold']).toBe(0);
    });
});