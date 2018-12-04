import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// import { UserSummary } from '../../modules/account/account.model';
import { CurrentRouteService } from '../../services/current-route.service';
import { SideNavService } from '../../services/side-nav.service';
// import { AccountStoreService } from '../../modules/account/account-store.service';
import { EnvironmentService } from '../../services/environment-service';

@Component({
  selector: 'etg-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  // user$: Observable<UserSummary>;
  canGoBack$!: Observable<boolean>;
  onMenuClicked = new BehaviorSubject<Date>(new Date());
  sidenavSpacer$!: Observable<boolean>;
  loading = false;

  constructor(
    public routeService: CurrentRouteService,
    private router: Router,
    private location: Location,
    public media: ObservableMedia,
    public sideNavService: SideNavService,
    // private storeService: AccountStoreService,
    public environmentService: EnvironmentService,
  ) {
    // this.user$ = storeService.user$;
  }

  logout() {
    // this.storeService.logout();
  }

  menuClicked() {
    const sidenav = this.sideNavService.sidenav.value;
    if (sidenav) {
      const isDetail = this.routeService.detailPage$.value;
      const previous = this.routeService.previousRouteData$.value;
      const current = this.routeService.routeData$.value;
      const canGoBack = isDetail && (current.detailParent || previous);

      if (!canGoBack || this.media.isActive('lg') || this.media.isActive('xl')) {
        sidenav.toggle();
        this.onMenuClicked.next(new Date());
      } else {
        if (current.detailParent) {
          this.router.navigateByUrl(current.detailParent);
        } else {
          this.location.back();
        }
      }
    }
  }

  ngOnInit() {
    this.canGoBack$ = combineLatest(
      this.routeService.detailPage$.asObservable(),
      this.routeService.routeData$,
      this.routeService.previousRouteData$
    ).pipe(
      map(([detail, current, previous]) => {
        if (current && current.detailParent) {
          return true;
        }
        if (!previous || !previous) {
          return false;
        }
        return detail && !!previous.title;
      })
    );

    this.sidenavSpacer$ = combineLatest(
      this.media.asObservable(),
      this.sideNavService.sidenav,
      this.onMenuClicked
    ).pipe(
      map(() => {
        return (this.sideNavService.sidenav && this.sideNavService.sidenav.value && this.sideNavService.sidenav.value.opened
          && this.sideNavService.sidenav.value.mode === 'side') as boolean;
      })
    );

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
