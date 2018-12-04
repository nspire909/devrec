import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

import { StorageService } from '../../services/storage.service';
import { BodyClassService } from '../../services/body-class.service';

@Component({
  selector: 'etg-theme-picker',
  templateUrl: 'theme-picker.html',
  styleUrls: ['theme-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ThemePickerComponent {
  currentTheme: any;

  themes = [
    {
      name: 'deeppurple',
      primary: '#673AB7',
    },
    {
      name: 'indigo',
      primary: '#3F51B5',
    },
    {
      name: 'pink',
      primary: '#E91E63',
    },
    {
      name: 'purple',
      primary: '#9C27B0',
    },
  ];

  constructor(
    private bodyClassService: BodyClassService,
    private storageService: StorageService,
  ) {

    const themeName = this.storageService.get('theme') || 'indigo';
    this.switchTheme(this.themes.find(x => x.name === themeName));
  }
  switchTheme(theme: any) {
    this.currentTheme = theme;
    this.bodyClassService.set('theme', theme.name);
  }
}
