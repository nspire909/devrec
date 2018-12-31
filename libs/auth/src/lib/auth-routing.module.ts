import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginCompleteComponent } from './components/login-complete/login-complete.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';

const routes: Routes = [
  {
    path: 'account',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'login-complete',
        component: LoginCompleteComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      }
    ]
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
