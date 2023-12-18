"use strict";
// import { TeleportSingleton } from "./teleport";
// /**
//  * Example usage:
//  * @class DataReceiver
//  */
// class DataReceiver {
//     @ReceiveData('exampleEvent')
//     public receivedData: string | undefined;
//     // ... other properties and methods
// }
// export function TeleportReceive(eventName?: string | symbol): PropertyDecorator {
//     return function (target: Object, propertyKey: string | symbol): void {
//         const teleportSingleton = TeleportSingleton.getInstantce();
//         // Save the original property value
//         let value: any;
//         // Subscribe to the specified event and update the property with received data
//         teleportSingleton.receive<any>(eventName || propertyKey, (data: any) => {
//             value = data;
//         });
//         // Getter function to retrieve the property value
//         const getter = function () {
//             return value;
//         };
//         // Setter function to update the property value and subscribe to the event
//         const setter = function (newValue: any) {
//             value = newValue;
//         };
//         // Define the property with the getter and setter
//         Object.defineProperty(target, propertyKey, {
//             get: getter,
//             set: setter,
//             enumerable: true,
//             configurable: true,
//         } as PropertyDescriptor); // 明确指定类型为 PropertyDescriptor
//     } as PropertyDecorator; // 明确指定类型为 PropertyDecorator
// }
