import { Injectable, Renderer2, Inject, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { StorageService, StorageKey } from './storage.service';

@Injectable({providedIn: 'root'})
export class BodyClassService {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    private storageService: StorageService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  set(key: StorageKey, currentValue: string) {
    const previousValue = this.storageService.get(key);

    if (previousValue) {
      this.renderer.removeClass(this.document.body, previousValue);
    }

    if (currentValue) {
      this.renderer.addClass(this.document.body, currentValue);
    }

    this.storageService.set(key, currentValue);
  }
}
