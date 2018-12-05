import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateAdapter, MAT_DATE_FORMATS, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import 'hammerjs';
import {
  CommonModule,
  SnapIsoStringMatDateAdapter,
  snapMatDateFormats,
  ENVIRONMENT_SETTINGS,
} from '@devrec/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    // StoreModule.forRoot(appReducers, { metaReducers: appMetaReducers }),
    // EffectsModule.forRoot([]),
    // StoreRouterConnectingModule,
    // !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
  ],
  providers: [
    // { provide: ALLOWED_ACTIONS_ROLE_MAP, useValue: ROUTE_ACTIONS_TO_ROLE_MAP },
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'} },
    // { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: MAT_DATE_FORMATS, useValue: snapMatDateFormats('DD-MMM-YYYY') },
    { provide: DateAdapter, useClass: SnapIsoStringMatDateAdapter },
    { provide: ENVIRONMENT_SETTINGS, useValue: environment }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
