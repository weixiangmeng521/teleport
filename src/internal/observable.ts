export class Observable<T> {
    // Array to store observers
    protected observers: ((value: T) => void)[] = [];

    /**
     * Adds an observer and returns the unsubscribe function.
     * @param observer - The observer function to add.
     * @returns An object containing the unsubscribe function.
     */
    subscribe(observer: (value: T) => void): { unsubscribe: () => void } {
        this.observers.push(observer);

        return {
            /**
             * Unsubscribe function.
             */
            unsubscribe: () => {
                this.observers = this.observers.filter((obs) => obs !== observer);
            },
        };
    }

    /**
     * Notifies all observers.
     * @param value - The value to notify observers with.
     */
    next(value: T): void {
        this.observers.forEach((observer) => observer(value));
    }
}