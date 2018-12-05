import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@devrec/common';

import { PortalRoutingModule } from './portal-routing.module';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { PortalDashboardComponent } from './portal-dashboard/portal-dashboard.component';
import { PortalLayoutComponent } from './portal-layout/portal-layout.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    PortalRoutingModule,
  ],
  declarations: [
    PortalDashboardComponent,
    PortalLayoutComponent,
    AnnouncementsComponent
  ],
  providers: [
  ]
})
export class PortalModule { }
