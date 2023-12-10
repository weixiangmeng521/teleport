export type EmitDataType<T> = {
    data:T,
    callback?:(() => void),
}


export type EventHandler = (...args: any[]) => void;

export type ObservableType = {
    next?: ((value: any) => void),
    error?: ((value: any) => void),
    complete?: ((value: any) => void),
}


export interface SubjectInterface{
    subscribe(teardown:Partial<ObservableType>):void;
    unsubscribe():void;
    next(value:any):void;
}


export interface SubscriptionInterface {
    publish(eventType:(string|symbol), handler:EventHandler):void;
    subscribe(eventType:(string|symbol), handler: EventHandler): void;
    unsubscribe(eventType: string): void;
}