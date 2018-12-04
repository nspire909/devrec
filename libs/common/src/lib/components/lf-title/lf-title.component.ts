import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  filter,
  map,
  mergeMap,
  startWith,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs/operators';

import { Observe } from '../../utility/observe-decorators';
import { CurrentRouteService } from '../../services/current-route.service';
import { BodyClassService } from '../../services/body-class.service';

@Component({
  selector: 'etg-lf-title',
  template: `<!-- no visible title element, in head only -->`,
  styles: [''],
})
export class LfTitleComponent extends Observe.Base.OnDestroy implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public titleService: Title,
    public routeService: CurrentRouteService,
    private bodyClassService: BodyClassService,
  ) {
    super();
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data),
        startWith(null),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$)
      )
      .subscribe(event => {
        if (event !== null && event !== undefined && event.title !== null) {
          this.titleService.setTitle(event.title);
          this.routeService.setRouteData(event);
        }
      });

    // Sets current app name as a class on the body
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute.firstChild || this.activatedRoute),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.firstChild ? route.firstChild.url : route.url),
        startWith([{path: 'portal'}]),
        takeUntil(this.onDestroy$)
      )
      .subscribe((url) => {
        const currentUrlSlug = url.length ? url[0].path : 'portal';

        this.bodyClassService.set('app', currentUrlSlug);
      });
  }
}
