import { Observable } from "./observable";
import { SubjectInterface } from "./types";


export class Subject<T> extends Observable<T> implements SubjectInterface<T> {
    private subscription: { unsubscribe: () => void; closed?: boolean } | null = null;

    constructor() {
        super();
    }

    override subscribe(observer: (value: T) => void): { unsubscribe: () => void; closed?: boolean };
    override subscribe(observer: { next: (value: T) => void }): { unsubscribe: () => void; closed?: boolean };
    override subscribe(observer: ((value: T) => void) | { next: (value: T) => void }): { unsubscribe: () => void; closed?: boolean } {
        if (typeof observer === 'function') {
            this.subscription = super.subscribe(observer);
        } else if (typeof observer === 'object' && observer !== null && 'next' in observer && typeof observer.next === 'function') {
            // Observer is an object with a 'next' method
            this.subscription = super.subscribe(observer.next);
        } else {
            throw new TypeError('Observer must be a function or an object with a "next" method.');
        }

        return {
            unsubscribe: () => this.unsubscribe(),
            closed: false,
        };
    }
    

    unsubscribe(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription.closed = true; // Set the closed state
        }
    }

    getClosedState(): boolean {
        return this.subscription?.closed || false;
    }

    override next(value: T): void {
        this.observers.forEach((observer) => observer(value));
    }
}