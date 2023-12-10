import { EventHandler, SubscriptionInterface } from "./types";



/**
 * Represents a subscription manager for handling events.
 */
export class Subscription implements SubscriptionInterface{
    /**
     * Map to store event handlers by event type.
     */
    private events: Map<string | symbol, EventHandler[]> = new Map();

    /**
     * Constructs a new instance of Subscription.
     */
    constructor() { }

    /**
     * Subscribe to a specific event type with a handler.
     * @param eventType - The type of the event to subscribe to (string or symbol).
     * @param handler - The event handler function to be executed when the event is published.
     */
    public subscribe(eventType: string | symbol, handler: EventHandler): void {
        if (!this.events.has(eventType)) {
            this.events.set(eventType, []);
        }
        const handlers = this.events.get(eventType);
        handlers?.push(handler);
    }

    /**
     * Publish an event of a specific type with optional data.
     * @param eventType - The type of the event to publish (string or symbol).
     * @param args - Optional data to be passed to the event handlers.
     */
    public publish(eventType: string | symbol, ...args: any[]): void {
        const handlers = this.events.get(eventType);
        if (handlers) {
            handlers.forEach(handler => handler(...args));
        }
    }

    /**
     * Unsubscribe a specific event handler from an event type.
     * @param eventType - The type of the event to unsubscribe from (string or symbol).
     * @param handler - The event handler function to be unsubscribed.
     */
    public unsubscribe(eventType: string | symbol, handler?: EventHandler): void {
        const handlers = this.events.get(eventType);
        if (handlers) {
            this.events.set(eventType, handlers.filter(h => h !== handler));
        }
    }


}
