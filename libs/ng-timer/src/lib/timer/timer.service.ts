import { Injectable } from '@angular/core';
import { interval, BehaviorSubject, Subject, NEVER, EMPTY, Observable, combineLatest } from 'rxjs';
import { switchMap, scan, takeWhile, startWith, mapTo, takeUntil, map } from 'rxjs/operators';
import { Unit, TimerOptions, Timer, Timers } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private defaultTimerOptions: TimerOptions = {
    startTime: 0,
    units: Unit.Milliseconds,
    timeFormat: 'mm:ss.SSS',
    countdown: false,
    autostart: false,
    interval: 100,
    locale: 'en-US',
  };

  timers: Timers = {};

  newTimer(timerName: string, timerOptions?: TimerOptions): Timer {
    if (!timerName) {
      throw(new Error('timerName required'));
    }

    if (!this.timers[timerName]) {
      this.timers[timerName] = {
        ...this.defaultTimerOptions,
        ...timerOptions,
        timer$: NEVER,
        interval$: NEVER,
        pause$: new BehaviorSubject(true),
        reset$: new Subject(),
        addTime$: new BehaviorSubject(1),
      };
    }

    return this.timers[timerName];
  }

  start(timerName: string): Observable<number> {
    const timerObj = this.timers[timerName];

    if (timerObj) {
      timerObj.reset$.next();

      timerObj.interval$ =
        combineLatest(
          interval(timerObj.interval).pipe(
            startWith(0),
            mapTo((timerObj.countdown ? -1 : 1)),
            takeUntil(timerObj.reset$)
          ),
          timerObj.addTime$
        ).pipe(
          map(([int, add]) => int * add)
        );

      timerObj.pause$.next(false);

      timerObj.timer$ = timerObj.pause$
        .pipe(
          switchMap(val => (!val ? timerObj.interval$ : EMPTY)),
          scan((acc, curr) => (curr ? curr + acc : acc), this.startTimeMS(timerName) / timerObj.interval),
          map(x => x * timerObj.interval),
          takeUntil(timerObj.reset$),
          takeWhile(t => t >= 0)
        );

      return timerObj.timer$;
    }
  }

  addTime(timerName: string, ms: number) {
    const timerObj = this.timers[timerName];

    if (timerObj) {
      timerObj.addTime$.next((timerObj.countdown ? -1 : 1) * ms / timerObj.interval);
      timerObj.addTime$.next(1);
    }
  }

  stop(timerName: string) {
    const timerObj = this.timers[timerName];
    if (timerObj) {
      timerObj.reset$.next();
      timerObj.pause$.next(true);
      timerObj.timer$ = NEVER;
    }
  }

  toggle(timerName: string) {
    const timerObj = this.timers[timerName];
    if (timerObj) {
      timerObj.pause$.next(!timerObj.pause$.value);
    }
  }

  startTimeMS(timerName: string) {
    const timerObj = this.timers[timerName];

    if (timerObj) {
      return timerObj.units === Unit.Seconds
        ? timerObj.startTime * 1000
        : timerObj.units === Unit.Minutes
          ? timerObj.startTime * 1000 * 60
          : timerObj.units === Unit.Hours
            ? timerObj.startTime * 1000 * 60 * 60
            : timerObj.startTime;
    }
  }
}
