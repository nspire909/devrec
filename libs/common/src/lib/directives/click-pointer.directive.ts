import { Directive, HostBinding } from '@angular/core';

@Directive({
  //tslint:disable-next-line:directive-selector
  selector: '[click]:not(.no-pointer),[matMenuTriggerFor]:not(.no-pointer)'
})
export class ClickPointerDirective {
   @HostBinding('style.cursor') cursor = 'pointer';
}
