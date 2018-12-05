import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

declare const require: any;

interface Icon {
  name?: string;
  namespace?: string;
  svg: string;
}

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.registerIcons([
      {
        name: 'adobe-pdf',
        svg: require('!!raw-loader!./svg/adobe-pdf.svg')
      },
      {
        name: 'eagle',
        svg: require('!!raw-loader!./svg/eagle.svg')
      },
      {
        name: 'eagle-white',
        svg: require('!!raw-loader!./svg/eagle-white.svg')
      },
      {
        name: 'hashtag',
        svg: require('!!raw-loader!./svg/hashtag.svg')
      },
      {
        name: 'modoc-white',
        svg: require('!!raw-loader!./svg/modoc-white.svg')
      },
      {
        name: 'placeholder-image',
        svg: require('!!raw-loader!./svg/placeholder-image.svg')
      },
      {
        name: 'placeholder-receipt',
        svg: require('!!raw-loader!./svg/placeholder-receipt.svg')
      },
      {
        name: 'print',
        svg: require('!!raw-loader!./svg/print.svg')
      },
    ]);
  }

  private registerIcons(icons: Icon[]) {
    icons.forEach(icon => this.registerIcon(icon));
  }

  private registerIcon(icon: Icon) {
    const svg = this.sanitizer.bypassSecurityTrustHtml(icon.svg);

    if (icon.name) {
      if (icon.namespace) {
        this.iconRegistry.addSvgIconLiteralInNamespace(
          icon.namespace,
          icon.name,
          svg,
        );
      } else {
        this.iconRegistry.addSvgIconLiteral(icon.name, svg);
      }
    } else {
      if (icon.namespace) {
        this.iconRegistry.addSvgIconSetLiteralInNamespace(icon.namespace, svg);
      } else {
        this.iconRegistry.addSvgIconSetLiteral(svg);
      }
    }
  }
}
