import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'etg-lf-layout',
  templateUrl: './lf-layout.component.html',
  styleUrls: ['./lf-layout.component.scss'],
})
export class LfLayoutComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  public toggle(): Promise<any> {
    return this.sidenav.toggle();
  }
  public open(): Promise<any> {
    return this.sidenav.open();
  }
  public close(): Promise<any> {
    return this.sidenav.close();
  }
}
