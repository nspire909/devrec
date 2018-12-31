import { Component, OnInit, Input } from '@angular/core';
import { TimerService } from './timer.service';
import { Timer } from '../models';

@Component({
  selector: 'ng-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input()
  name = 'timer';
  timer: Timer;

  constructor(public timerService: TimerService) {}

  ngOnInit() {
    this.timer = this.timerService.timers[this.name];

    if (this.timer && this.timer.autostart) {
      this.timerService.start(this.name);
    }
  }
}
