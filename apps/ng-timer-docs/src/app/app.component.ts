import { Component } from '@angular/core';
import { TimerService, Unit } from '@devrec/ng-timer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  timer1 = 'timer1';
  timer2 = 'timer2';
  isDarkTheme = true;

  timeFcn = (x => {
    if (x === 31000 || x === 30000 || x === 29000) {
      console.log(x);
    } else if (x === 2000) {
      console.log(x);
    } else if (x === 0) {
      console.log(x);
    }
  });

  constructor(timerService: TimerService) {
    timerService.newTimer(this.timer1);
    timerService.newTimer(this.timer2, {
      startTime: 15,
      units: Unit.Minutes,
      countdown: true,
      autostart: true,
      timeFormat: 'mm:ss.SSS'
    });
  }
}
