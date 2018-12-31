import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  @Input()
  name: string;
  @Input()
  timeFcn: (value: number) => void = (() => {});

  constructor() { }
}
