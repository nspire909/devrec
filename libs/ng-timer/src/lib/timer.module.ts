import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { TimerComponent } from './timer/timer.component';
import { TimerInputComponent } from './timer-input/timer-input.component';
import { TimerControlsComponent } from './timer-controls/timer-controls.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  declarations: [
    TimerComponent,
    TimerInputComponent,
    TimerControlsComponent
  ],
  exports: [
    TimerComponent,
    TimerInputComponent,
    TimerControlsComponent
  ]
})
export class TimerModule { }
