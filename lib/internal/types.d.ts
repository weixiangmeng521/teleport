export type EmitDataType<T> = {
    data: T;
    callback?: (() => void);
};
export type EventHandler = (...args: any[]) => void;
export interface ObserverInterface<T> {
    next(data: T): void;
}
export interface SubjectInterface<T> {
    subscribe(observer: ObserverInterface<T>): {
        unsubscribe: () => void;
    };
    unsubscribe(): void;
    next(value: any): void;
}
