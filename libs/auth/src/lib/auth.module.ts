import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@devrec/common';

import { AuthRoutingModule } from './auth-routing.module';
import { userReducer } from './store/account.store';
import { LoginComponent } from './components/login/login.component';
import { LoginCompleteComponent } from './components/login-complete/login-complete.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { AllowedActionPipe } from './pipes/allowed-action.pipe';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    StoreModule.forFeature('user', userReducer),
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    LoginCompleteComponent,
    LogoutComponent,
    NotAuthorizedComponent,
    AllowedActionPipe
  ],
  exports: [AllowedActionPipe]
})
export class AuthModule {}
