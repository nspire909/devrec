import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'properName',
})
export class ProperNamePipe implements PipeTransform {
  transform(value: string, args?: any): any {
    return (
      (value || '')
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str) {
          return str.toUpperCase();
        })
    );
  }
}
