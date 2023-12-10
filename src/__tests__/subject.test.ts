import { Subject } from '../internal/subject'; // 请替换成正确的路径

describe('Subject', () => {
    let subject1: Subject<number>;
    let subject2: Subject<string>;

    beforeEach(() => {
        subject1 = new Subject<number>();
        subject2 = new Subject<string>();
    });

    afterEach(() => {
        subject1.unsubscribe();
        subject2.unsubscribe();
    });

    it('should emit next event when next is called for multiple instances', () => {
        const onNext1 = jest.fn();
        const onNext2 = jest.fn();

        subject1.subscribe({ next: onNext1 });
        subject2.subscribe({ next: onNext2 });

        subject1.next(42);
        subject2.next('Hello');

        expect(onNext1).toHaveBeenCalledWith(42);
        expect(onNext2).toHaveBeenCalledWith('Hello');
    });

    it('should subscribe and unsubscribe correctly for multiple instances', () => {
        const onNext1 = jest.fn();
        const onNext2 = jest.fn();

        subject1.subscribe({ next: onNext1 });
        subject2.subscribe({ next: onNext2 });

        subject1.next(42);
        subject2.next('Hello');

        expect(onNext1).toHaveBeenCalledWith(42);
        expect(onNext2).toHaveBeenCalledWith('Hello');

        subject1.unsubscribe();
        subject1.next(99);

        subject2.unsubscribe();
        subject2.next('World');

        expect(onNext1).toHaveBeenCalledTimes(1); // Ensure no additional calls after unsubscribe
        expect(onNext2).toHaveBeenCalledTimes(1); // Ensure no additional calls after unsubscribe
    });

    it('should handle multiple event types for multiple instances', () => {
        const onNext1 = jest.fn();
        const onError1 = jest.fn();
        const onComplete1 = jest.fn();

        const onNext2 = jest.fn();
        const onError2 = jest.fn();
        const onComplete2 = jest.fn();

        subject1.subscribe({ next: onNext1, error: onError1, complete: onComplete1 });
        subject2.subscribe({ next: onNext2, error: onError2, complete: onComplete2 });

        subject1.next(42);
        subject2.error(new Error('Error'));

        subject1.unsubscribe();
        subject2.complete();

        expect(onNext1).toHaveBeenCalledWith(42);
        expect(onError1).not.toHaveBeenCalled();
        expect(onComplete1).not.toHaveBeenCalled();

        expect(onNext2).not.toHaveBeenCalled();
        expect(onError2).toHaveBeenCalledWith(new Error('Error'));
        expect(onComplete2).toHaveBeenCalled();
    });
});
