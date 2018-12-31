import { Observable, BehaviorSubject, Subject } from 'rxjs';

export enum Unit {
  Milliseconds = 'ms',
  Seconds = 's',
  Minutes = 'm',
  Hours = 'h',
}

export interface SelectListItem<T> {
  name: string;
  value: T;
}

export interface TimerOptions {
  startTime?: number;
  units?: Unit;
  interval?: number;
  timeFormat?: string;
  countdown?: boolean;
  autostart?: boolean;
  locale?: string;
}

export interface Timer extends TimerOptions {
  timer$: Observable<number>;
  interval$: Observable<number>;
  pause$: BehaviorSubject<boolean>;
  reset$: Subject<void>;
  addTime$: BehaviorSubject<number>;
}

export interface Timers {
  [key: string]: Timer;
}
