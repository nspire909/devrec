import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AllMaterialImportsModule } from './imports/all-material-imports.module';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { LfLayoutNavComponent } from './components/lf-layout-nav/lf-layout-nav.component';
import { LfLayoutComponent } from './components/lf-layout/lf-layout.component';
import { LfTitleComponent } from './components/lf-title/lf-title.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker';
import { UnsupportedBrowserComponent } from './components/unsupported-browser/unsupported-browser.component';
import { ClickPointerDirective } from './directives/click-pointer.directive';
import { ProperNamePipe } from './pipes/proper-name.pipe';
import { IconsService } from './services/icons/icons.service';

@NgModule({
  imports: [
    AngularCommonModule,
    AllMaterialImportsModule,
    RouterModule,
  ],
  exports: [
    AngularCommonModule,
    AllMaterialImportsModule,
    AppLayoutComponent,
    LfLayoutNavComponent,
    LfLayoutComponent,
    LfTitleComponent,
    ThemePickerComponent,
    UnsupportedBrowserComponent,
    ClickPointerDirective,
    ProperNamePipe,
  ],
  declarations: [
    AppLayoutComponent,
    LfLayoutNavComponent,
    LfLayoutComponent,
    LfTitleComponent,
    ThemePickerComponent,
    UnsupportedBrowserComponent,
    ClickPointerDirective,
    ProperNamePipe,
  ],
})
export class CommonModule {
  constructor(iconService: IconsService) {}
}
