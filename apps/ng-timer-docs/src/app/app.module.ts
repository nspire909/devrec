import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimerModule } from '@devrec/ng-timer';

import { AppComponent } from './app.component';
import { AllMaterialImportsModule } from './shared/all-material-imports.module';
import { ExampleComponent } from './example/example.component';

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AllMaterialImportsModule,
    TimerModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
