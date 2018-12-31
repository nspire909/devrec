import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountStoreService } from '../store/account-store.service';
import { AllowedActionsService } from './allowed-actions.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private actionService: AllowedActionsService,
    private accountStore: AccountStoreService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    localStorage.setItem('loginReturnUrl', state.url);
    return this.accountStore.loadCurrentUser().pipe(
      map(user => {
        if (!user || !user.companies || user.companies.length === 0) {
          this.router.navigate(['not-authorized']);
          return false;
        }

        const routeId = route.data && route.data['id'];
        if (!routeId) {
          throw new Error(
            `'Unable to determine route id for route guard: ${route}`
          );
        }
        const access = this.actionService.roleMap[routeId];
        if (!access) {
          throw new Error(
            `'Unable to determine access for route guard: ${route}`
          );
        }

        // Role independent access
        if (access === true || access === false) {
          return access; // implicitly granted or denied for all
        }

        // CompanyRole access
        for (const userRole of user.companies) {
          const roleAccess = access[userRole.role];
          if (roleAccess === undefined || roleAccess === false) {
            continue; // this role is implicitly excluded or explicitly denied
          }
          return true; // role given access to some actions, so can view the route
        }

        // Project access
        if (
          user.maxProjectRole === undefined ||
          user.maxProjectRole === null ||
          user.maxProjectRole === ''
        ) {
          return false;
        }
        const projectRoleAccess = access[user.maxProjectRole];
        if (projectRoleAccess === undefined || projectRoleAccess === false) {
          return false; // this role is implicitly excluded or explicitly denied
        }
        if (projectRoleAccess === true) {
          return true; // role given access to all actions
        }

        return false;
      })
    );
  }
}
