import { TeleportSingleton } from './teleport';

/**
 * The `Teleport` class provides a simplified interface to interact with the underlying `TeleportSingleton` instance.
 * It encapsulates the logic for emitting and receiving events.
 */
export class Teleport {
  /**
   * The underlying `TeleportSingleton` instance used for event management.
   */
  private _teleportSingleton: TeleportSingleton = TeleportSingleton.getInstance();

  /**
   * Constructs a new instance of the `Teleport` class.
   */
  constructor() { }

  /**
   * Emits an event with the specified name and data.
   * @template T - The type of data to be emitted.
   * @param {string | symbol} name - The name or symbol of the event.
   * @param {T} data - The data to be emitted with the event.
   * @param {() => void} [callback] - Optional callback to be executed after emitting the event.
   * @returns {TeleportSingleton} - The TeleportSingleton instance for chaining.
   */
  public emit<T>(name: string | symbol, data: T, callback?: () => void): TeleportSingleton {
    return this._teleportSingleton.emit<T>(name, data, callback);
  }

  /**
   * Registers a handler function for the specified event.
   * @template T - The type of data received by the event.
   * @param {string | symbol} name - The name or symbol of the event.
   * @param {(data: T) => void} handler - The handler function to process the event data.
   */
  public receive<T>(name: string | symbol, handler: (data: T) => void): void {
    this._teleportSingleton.receive<T>(name, handler);
  }

  /**
   * Listens for multiple events with a common handler.
   * When any of the specified events is emitted, the provided handler will be called.
   * @template T - The type of data received by the handler.
   * @param nameList - The list of event names to listen for.
   * @param handler - The handler function to process the event data.
   */
  public multiReceive(nameList: string[], handler: (...data: any[]) => void): void {
    this._teleportSingleton.multiReceive(nameList, handler);
  }

  /**
   * Removes a specific event handler for the specified event.
   * @param {string | symbol} name - The name or symbol of the event.
   */
  public removeHandle(name: string | symbol): void {
    this._teleportSingleton.removeHandle(name);
  }

  /**
   * Removes all event handlers.
   */
  public removeAllHandlers(): void {
    this._teleportSingleton.removeAllHandlers();
  }

  /**
   * Clears any internal state related to emitted events.
   * This method should be adapted based on the specific requirements of your application.
   */
  public clear(): void {
    this._teleportSingleton.clear();
  }
}
