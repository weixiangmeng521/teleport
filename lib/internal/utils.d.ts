/**
 * Sleeps for a specified duration.
 * @param {number} ms - The duration to sleep in milliseconds.
 * @returns {Promise<void>} - A promise that resolves after the specified duration.
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * Checks if two arrays are equal.
 * @template T array's type
 * @param {Array<T>} array1 - The first array.
 * @param {Array<T>} array2 - The second array.
 * @returns {boolean} - Returns true if the arrays are equal, otherwise returns false.
 */
export declare const isArrayEqual: <T>(array1: T[], array2: T[]) => boolean;
