import { Component, OnInit } from '@angular/core';
import { SideNavService } from '@devrec/common';

@Component({
  selector: 'portal-portal-layout',
  templateUrl: './portal-layout.component.html',
  styleUrls: ['./portal-layout.component.scss'],
})
export class PortalLayoutComponent implements OnInit {
  constructor(
    public sideNavService: SideNavService,
  ) {}

  ngOnInit() {
    setTimeout(() => this.sideNavService.sidenav.next(null));
  }
}
