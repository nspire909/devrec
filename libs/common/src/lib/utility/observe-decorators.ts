import { OnDestroy } from '@angular/core';
import { Subject,  Observable } from 'rxjs';

type Constructor<T> = new(...args: any[]) => T;

class DefaultBase {}

const onDestroySubject = Symbol('');

//TODO add decorators for other lifecycle events - SNAP-594
// @dynamic
export class Observe {
  /**
   * Creates an observable that is emitted and completed when the
   * angular OnDestroy lifecycle event occurs.
   *
   * Usage: @Observe.OnDestroy() onDestroy$: Observable<void>;
   *
   * NOTE: Due to an angular AOT issue, the component must have an existing ngOnDestroy implementation:
   *    [
   *      Angular compiler - custom decorators with ngOnDestroy does not work with AOT build
   *    ](https://github.com/angular/angular/issues/16023)
   *
   *   To fix this either add an empty ngOnDestroy method, or extend Observe.Base.OnDestroy instead.
   */
  static OnDestroy() {
    return function (target: any, propertyKey: string): void {

      Object.defineProperty(target, propertyKey, {
        get: function(this: { [onDestroySubject]: Subject<void>; }) {
          if (!this[onDestroySubject]) {
            this[onDestroySubject] = new Subject<void>();
          }
          return this[onDestroySubject];
        },
        set: () => {
          throw new Error('set not supported for OnDestroy');
        }
      });

      const originalOnDestroy = target.ngOnDestroy; // || (() => {});
      if (!originalOnDestroy) {
        throw new Error(`Observe.OnDestroy class must implement the angular OnDestroy interface.
           This is due to an AOT issue: https://github.com/angular/angular/issues/16023
            To fix this either add an empty ngOnDestroy method, or extend Observe.Base.OnDestroy instead.
        `);
      }
      target.ngOnDestroy = function () { //no => so we get target's this
        this[propertyKey].next();
        this[propertyKey].complete();
        originalOnDestroy.call(this);
      };

    };
  }

  //TODO this doesn't work with AOT :>(
  // static Mixin = {
  //   OnDestroy<T extends Constructor<{}>>(base: T) {
  //     return class MixinOnDestroy extends base implements OnDestroy {
  //       constructor(...args: any[]) { super(...args); }
  //
  //       private $subject = new Subject<void>();
  //       onDestroy$: Observable<void> = this.$subject.asObservable();
  //
  //       ngOnDestroy() {
  //         this.$subject.next();
  //         this.$subject.complete();
  //       }
  //     };
  //   }
  // };

  static Base = {
    OnDestroy: class implements OnDestroy {
      //TODO investigate why this needs to be public and why @dynamic is needed above
      /* private */ $subject = new Subject<void>();
      onDestroy$: Observable<void> = this.$subject.asObservable();

      ngOnDestroy() {
        this.$subject.next();
        this.$subject.complete();
      }
    }
  };
}
