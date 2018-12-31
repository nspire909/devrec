import { Component, Input, OnInit} from '@angular/core';
import { Unit, SelectListItem } from '../models';
import { TimerService } from '../timer/timer.service';
import { Timer } from '../models';

@Component({
  selector: 'ng-timer-input',
  templateUrl: './timer-input.component.html',
  styleUrls: ['./timer-input.component.scss']
})
export class TimerInputComponent implements OnInit {
  @Input()
  name = 'timer';

  @Input()
  showStartTime = true;

  @Input()
  showUnits = false;

  @Input()
  showTimeFormat = false;

  @Input()
  showCountdown = false;

  @Input()
  showAutostart = false;

  timer: Timer;

  unitTypes: SelectListItem<string>[];
  timeFormats: string[];

  constructor(public timerService: TimerService) {}

  ngOnInit() {
    this.timer = this.timerService.timers[this.name];

    if (this.timer) {
      this.unitTypes = Object.keys(Unit)
        .filter(key => typeof Unit[key] === 'string')
        .map(key => ({ name: key, value: Unit[key] }));
      this.timeFormats = [
        'mm:ss',
        'mm:ss.SSS',
        'hh:mm:ss.SSS',
        'hh:mm:ss'
      ];
    }
  }
}
