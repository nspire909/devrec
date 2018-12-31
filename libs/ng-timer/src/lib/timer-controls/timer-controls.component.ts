import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimerService } from '../timer/timer.service';
import { Timer } from '../models';

@Component({
  selector: 'ng-timer-controls',
  templateUrl: './timer-controls.component.html',
  styleUrls: ['./timer-controls.component.scss']
})
export class TimerControlsComponent implements OnInit, OnDestroy {
  @Input()
  name = 'timer';

  @Input()
  timeFcn: (value: number) => void = (() => {});

  timer: Timer;
  timerSubscription: Subscription;

  constructor(public timerService: TimerService) {}

  ngOnInit() {
    this.timer = this.timerService.timers[this.name];
  }

  startTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = this.timerService.start(this.name)
      .subscribe(this.timeFcn);
  }

  toggleTimer() {
    this.timerService.toggle(this.name);
  }

  stopTimer() {
    this.timerService.stop(this.name);
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }
}
