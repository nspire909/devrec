import { Component } from '@angular/core';
import { Router, Route } from '@angular/router';

interface DashboardCard {
  title: string;
  icon: string;
  path: string | undefined;
  active: boolean;
}

@Component({
  selector: 'portal-portal-dashboard',
  templateUrl: './portal-dashboard.component.html',
  styleUrls: ['./portal-dashboard.component.scss']
})
export class PortalDashboardComponent {
  dashboardCards: DashboardCard[];

  constructor(router: Router) {
    this.dashboardCards = ((router.config.find(r => r.path === '') as Route).children || [])
      .filter(r => r.path !== '')
      .map(r => ({
        ...r.data as DashboardCard,
        path: r.path
      }));
  }
}
