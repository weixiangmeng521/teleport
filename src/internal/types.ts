export type EmitDataType<T> = {
    data:T,
    callback?:(() => void),
}


export type EventHandler = (...args: any[]) => void;

export interface ObservableType {
    next: (value: any) => void;
    error?: (value: any) => void;
    complete?: (value: any) => void;
}
  

export interface SubjectInterface<T>{
    subscribe(observer: (value: T) => void): { unsubscribe: () => void };
    unsubscribe():void;
    next(value:any):void;
}

