import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from '@devrec/common';
import { PortalLayoutComponent } from './portal-layout/portal-layout.component';
import { PortalDashboardComponent } from './portal-dashboard/portal-dashboard.component';

const routes: Routes = [{
  path: '',
  component: PortalLayoutComponent,
  children: [
    {
      path: '',
      component: PortalDashboardComponent,
      data: { id: 'portal', title: 'MODOC Portal' },
      // canActivate: [AuthGuard],
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
