"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayEqual = exports.sleep = void 0;
/**
 * Sleeps for a specified duration.
 * @param {number} ms - The duration to sleep in milliseconds.
 * @returns {Promise<void>} - A promise that resolves after the specified duration.
 */
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
/**
 * Checks if two arrays are equal.
 * @template T array's type
 * @param {Array<T>} array1 - The first array.
 * @param {Array<T>} array2 - The second array.
 * @returns {boolean} - Returns true if the arrays are equal, otherwise returns false.
 */
const isArrayEqual = (array1, array2) => {
    // Compare array lengths
    if (array1.length !== array2.length)
        return false;
    // Compare array elements one by one
    return array1.every((value, index) => value === array2[index]);
};
exports.isArrayEqual = isArrayEqual;
