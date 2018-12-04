import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { isPresent } from './type-utils';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

export function applyPatch(formGroup: FormGroup, newValue: any) {
  const patch = makePatch(formGroup.value, newValue);
  if (Object.keys(patch).length > 0) {
    formGroup.patchValue(patch);
  }
}

export function makePatch(prevValue: any, newValue: any): any {
  //TODO type
  const ret: any = {};
  let prevKeys = Object.keys(prevValue);
  Object.keys(newValue).forEach(k => {
    prevKeys = prevKeys.filter(pk => pk !== k);
    const n = newValue[k];
    const p = prevValue[k];
    if (n !== p) {
      if (n === null || p === null) {
        ret[k] = n;
      } else if (Array.isArray(p) || Array.isArray(n)) {
        ret[k] = n; // TODO: compare array items?
      } else if (typeof p === 'object' && typeof n === 'object') {
        //TODO Dates, other?
        ret[k] = makePatch(p, n);
      } else {
        ret[k] = newValue[k];
      }
    }
  });
  prevKeys.forEach(k => {
    ret[k] = undefined;
  });

  return ret;
}

export function subscribeForPatch(
  source$: Observable<any>,
  form: FormGroup,
  until$: Observable<any>
) {
  source$
    .pipe(filter(isPresent), distinctUntilChanged(), takeUntil(until$))
    .subscribe(newValue => {
      const patch = makePatch(form.value, newValue);
      if (Object.keys(patch).length > 0) {
        form.patchValue(patch);
      }
    });
}
