/**
 * Sleeps for a specified duration.
 * @param {number} ms - The duration to sleep in milliseconds.
 * @returns {Promise<void>} - A promise that resolves after the specified duration.
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};



/**
 * Checks if two arrays are equal.
 * @template T array's type
 * @param {Array<T>} array1 - The first array.
 * @param {Array<T>} array2 - The second array.
 * @returns {boolean} - Returns true if the arrays are equal, otherwise returns false.
 */
export const isArrayEqual = <T>(array1: T[], array2: T[]): boolean => {
    // Compare array lengths
    if (array1.length !== array2.length) return false;

    // Compare array elements one by one
    return array1.every((value, index) => value === array2[index]);
};
