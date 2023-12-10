# Teleport

[![npm version](https://badge.fury.io/js/@mwx47%2Fteleport.svg)](https://badge.fury.io/js/@mwx47%2Fteleport)
![NPM Downloads](https://img.shields.io/npm/dw/@mwx47/teleport)
![NPM License](https://img.shields.io/npm/l/@mwx47/teleport)


**Teleport** is a lightweight and flexible event handling library for TypeScript, inspired by RxJS. It allows you to manage and communicate events in your application through a singleton pattern. This pattern ensures that there is a single instance of the event manager, making it easy to coordinate and handle events across different parts of your codebase.

## Features

- **Singleton Pattern**: Enforces a singleton pattern to provide a single, centralized instance for managing events.
- **Event Queues**: Supports the queuing of event handlers, allowing you to add handlers even before the corresponding events are created.
- **Event Emission**: Easily emit events with associated data and optional callback functions.
- **Event Handling**: Register handlers for specific events, making it straightforward to respond to different scenarios in your application.
- **Cleanup**: Provides methods to remove specific event handlers, clear all handlers, and reset the entire event manager.

## Installation

Install the **Teleport** library using npm:

```bash
npm install @mwx47/teleport
```

## Usage

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