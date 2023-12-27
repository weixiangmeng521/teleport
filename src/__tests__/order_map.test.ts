// orderMap.test.ts - Your Jest test cases

import { OrderMap } from '../internal/order_map';

describe('OrderMap', () => {
    let orderMap: OrderMap<number, string>;

    beforeEach(() => {
        orderMap = new OrderMap<number, string>();
    });

    test('Adding and getting key-value pairs', () => {
        orderMap.set(1, 'One');
        orderMap.set(2, 'Two');

        expect(orderMap.get(1)).toBe('One');
        expect(orderMap.get(2)).toBe('Two');
    });

    test('Checking if a key exists', () => {
        orderMap.set(1, 'One');

        expect(orderMap.has(1)).toBe(true);
        expect(orderMap.has(2)).toBe(false);
    });

    test('Getting keys array', () => {
        orderMap.set(1, 'One');
        orderMap.set(2, 'Two');
        orderMap.set(3, 'Three');

        expect(orderMap.keysArray()).toEqual([1, 2, 3]);
    });

    test('Deleting a key-value pair', () => {
        orderMap.set(1, 'One');
        orderMap.set(2, 'Two');

        orderMap.delete(1);

        expect(orderMap.has(1)).toBe(false);
        expect(orderMap.size()).toBe(1);
    });

    test('Clearing the OrderMap', () => {
        orderMap.set(1, 'One');
        orderMap.set(2, 'Two');

        orderMap.clear();

        expect(orderMap.size()).toBe(0);
        expect(orderMap.has(1)).toBe(false);
        expect(orderMap.has(2)).toBe(false);
    });
});
