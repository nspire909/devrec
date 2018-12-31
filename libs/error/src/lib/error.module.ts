import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@devrec/common';

import { ErrorRoutingModule } from './error-routing.module';
import { errorReducer } from './store/error.store';

@NgModule({
  imports: [
    CommonModule,
    ErrorRoutingModule,
    StoreModule.forFeature('errors', errorReducer)
  ]
})
export class ErrorModule {}
