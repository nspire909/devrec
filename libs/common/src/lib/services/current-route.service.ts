import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentRouteService {
  pageTitle$ = new BehaviorSubject<string>('');
  detailPage$ = new BehaviorSubject<boolean>(false);
  routeData$ = new BehaviorSubject<any>({});
  previousRouteData$ = new BehaviorSubject<any>({});

  setPageTitle(title: string) {
    this.pageTitle$.next(title);
  }
  setRouteData(data: any) {
    const copy = { ...data };
    if (this.routeData$.value) {
      this.previousRouteData$.next(this.routeData$.value);
    }
    this.routeData$.next(copy);
    this.detailPage$.next(!!copy.detailPage);
    if (copy.title) {
      this.setPageTitle(copy.title);
    }
  }
}
