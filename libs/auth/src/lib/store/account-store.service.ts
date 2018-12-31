import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserSummary, anonymousUser } from '../models/account.model';
import { UserAppState, selectUser, userActions } from './account.store';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class AccountStoreService {
  userLoaded = false;
  cachedUser: UserSummary;
  user$: Observable<UserSummary>;

  constructor(
    private router: Router,
    private _store: Store<UserAppState>,
    private _accountService: AccountService,
    public snackBar: MatSnackBar,
    private platformLocation: PlatformLocation
  ) {
    this.user$ = this._store.pipe(select(selectUser));
    this.cachedUser = anonymousUser();
    const cu = localStorage.getItem('currentUser');
    if (cu) {
      this.cachedUser = <UserSummary>JSON.parse(cu);
      this._store.dispatch(
        userActions.create(userActions.userInitFromLocal, this.cachedUser)
      );
    }
  }

  get user(): Observable<UserSummary> {
    return this.user$;
  }

  public getAuthHeaders(): any {
    const cu = localStorage.getItem('currentUser');
    if (!cu) {
      return {}; // API will return unauthenticated response
    }

    const currentUser: UserSummary = JSON.parse(cu);
    return this._accountService.getAuth(currentUser);
  }

  public loadCurrentUser(): Observable<UserSummary> {
    if (this.userLoaded) {
      return this.user$;
    }

    return this._accountService.verifyUser(this.cachedUser).pipe(
      tap(
        (auth: UserSummary) => {
          // now that the verify check is back, attempt to navigate to trigger access check again.
          this.userLoaded = true;
          this.loginComplete(auth);
        },
        error => {
          // Ok, verify said they are not logged in, so send them to login
          console.error(error);
          this.loginStart();
        }
      )
    );
  }

  public loginComplete(data: UserSummary) {
    this.cachedUser = data;
    this._store.dispatch(
      userActions.create(userActions.userLoginComplete, data)
    );
    localStorage.setItem('currentUser', JSON.stringify(data));
    if (!data.companies || data.companies.length === 0) {
      // no access?  shouldn't happen, redirect to a page not needing login
      this.router.navigate(['/account/login']);
      this.snackBar.open('No Access', '', { duration: 3000 });
    } else {
      this.snackBar.open('Login Complete', '', { duration: 3000 });
      const returnUrl = localStorage.getItem('loginReturnUrl') || '';
      this.router.navigate([returnUrl]);
    }
  }

  public loginStart() {
    this.cachedUser = anonymousUser();
    localStorage.removeItem('currentUser');
    this._store.dispatch(
      userActions.create(userActions.userLogoutComplete, true)
    );
    // window.location.href = '/account/login';
    this.router.navigate(['/account/login']);
  }

  public loginMicrosoft(code: string, state: string) {
    this.snackBar.open('Validating Login...', '', { duration: 8000 });
    this._accountService
      .microsoft({
        accessToken: code,
        state: state,
        baseHref: this.platformLocation.getBaseHrefFromDOM()
      })
      .subscribe(
        user => {
          this.loginComplete(user);
        },
        resp => {
          console.error(resp);
          this.snackBar.open(resp.error.message, 'Ok');
        }
      );
  }

  public logout() {
    this.cachedUser = anonymousUser();
    localStorage.removeItem('currentUser');
    this._store.dispatch(
      userActions.create(userActions.userLogoutComplete, true)
    );

    this._accountService.logout().subscribe(() => {
      this.router.navigate(['./account/logout']);
    });
  }
}
