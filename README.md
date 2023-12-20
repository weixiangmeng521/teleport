# Teleport

[![npm version](https://badge.fury.io/js/@mwx47%2Fteleport.svg)](https://badge.fury.io/js/@mwx47%2Fteleport)
![NPM Downloads](https://img.shields.io/npm/dw/@mwx47/teleport)
![NPM License](https://img.shields.io/npm/l/@mwx47/teleport)
![GitHub Workflow Status](https://github.com/weixiangmeng521/teleport/actions/workflows/master.yml/badge.svg)


**Teleport** is a lightweight and versatile event handling library crafted for TypeScript, drawing inspiration from RxJS. It empowers you to effectively manage and communicate events within your application using a singleton pattern. This approach guarantees a single, centralized instance of the event manager, simplifying event coordination and handling across various sections of your codebase.

## Key Features

- **Singleton Design**: Implements a singleton pattern, providing a unified and singular instance for streamlined event management.
- **Event Queues**: Facilitates event handler queuing, enabling the addition of handlers even before the corresponding events are created.
- **Effortless Event Emission**: Easily emits events with associated data and optional callback functions.
- **Event Registration**: Simple registration of handlers for specific events, making it easy to respond to diverse scenarios in your application.
- **Maintenance**: Offers methods to remove specific event handlers, clear all handlers, and reset the entire event manager.

This solution stands independently, devoid of any dependencies on RxJS or external libraries.

## Installation

Install the **Teleport** library using npm:

```bash
npm install @mwx47/teleport
```

## Usage

### First Example
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();

// send data
teleport.emit('eventName', "hello world!");

teleport.receive('eventName', (data) => {
    console.log('Event data:', data); // ✅ Event data: hello world! 
});
```


### Examples with delayed subscription
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// send data
teleport.emit('eventName', "hello world!");

// Although it is delayed by 1000ms, the data can still be obtained
setTimeout(() => {
    teleport.receive('eventName', (data) => {
        console.log('Event data:', data); // ✅ Event data: hello world! 
    });
}, 1000);
```



### Examples with multiple subscriptions
```typescript
import { Teleport } from '@mwx47/teleport';

const teleport = new Teleport();
// send data
teleport.emit('eventName1', "Tokyo!");
teleport.emit('eventName2', "China!");
teleport.emit('eventName3', "London!");

const subscriptions = ['eventName1', 'eventName2', 'eventName3'];
teleport.receive(subscriptions, (arg1:string, arg2:string, arg3:string) => {
    console.log('Hello', arg1); // ✅ Hello Tokyo!
    console.log('Hello', arg1); // ✅ Hello China!
    console.log('Hello', arg1); // ✅ Hello London!
});
```


### Importing

```typescript
import { Teleport } from '@mwx47/teleport';
```

### Getting or Creating the Singleton Instance

```typescript
const teleport = new Teleport();
```

### Emitting an Event

```typescript
teleport.emit('eventName', eventData, () => {
    // Optional callback function
    console.log('Event emitted successfully!');
});
```

### Receiving and Handling an Event

```typescript
teleport.receive('eventName', (data) => {
    // Handle the event data
    console.log('Event data:', data);
});
```

### Receiving and Handling Events

```typescript
teleport.multiReceive(['eventName1', 'eventName2'], (data1:any, data2:any) => {
    // Handle the event data
    console.log('Events data:', data1, data2);
});
```

### Removing a Specific Event Handler

```typescript
teleport.removeHandle('eventName');
```

### Removing All Event Handlers

```typescript
teleport.removeAllHandlers();
```

### Clearing the Event Manager

```typescript
teleport.clear();
```

## Contribution

Contributions are welcome! Feel free to open issues, submit pull requests, or provide suggestions to improve the **Teleport** library.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 