import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipeBase } from '@devrec/common';

import { AccountStoreService } from '../store/account-store.service';
import { AllowedActionsService } from '../services/allowed-actions.service';

@Pipe({
  name: 'allowedAction',
  pure: false
})
export class AllowedActionPipe extends AsyncPipeBase<boolean>
  implements PipeTransform {
  constructor(
    ref: ChangeDetectorRef,
    private accountStore: AccountStoreService,
    private actionService: AllowedActionsService
  ) {
    super(ref);
  }

  protected transformAsync(
    allowedAction: string,
    routeId: string
  ): Observable<boolean> {
    return this.accountStore.user$.pipe(
      map(user => {
        // user.roles is AspNet Roles, not used
        // user.companies[i].role is company role
        // user.maxProjectRole is project role

        // Role independent access
        const access = this.actionService.roleMap[routeId];
        if (access === undefined || access === true) {
          return true; // implicit allow for all
        }
        if (access === false) {
          return false; // route is currently disabled
        }
        if (!user) {
          return false; // not logged in, and no uniform access for all
        }

        // CompanyRole access
        if (
          user.companies === undefined ||
          user.companies === null ||
          user.companies.length === 0
        ) {
          return false;
        }
        for (const company of user.companies) {
          const roleAccess = access[company.role];
          if (roleAccess === undefined || roleAccess === false) {
            continue; // this role is implicitly excluded or explicitly denied
          }
          if (roleAccess === true) {
            return true; // role given access to all actions
          }
          const actionAccess = roleAccess[allowedAction];
          if (actionAccess === undefined || !actionAccess) {
            continue; // this role is implicitly excluded / denied
          }
          return true; // one of the roles has the required access
        }

        // ProjectRole access, just need highest role
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
        const projectActionAccess = projectRoleAccess[allowedAction];
        if (projectActionAccess === undefined || !projectActionAccess) {
          return false; // this role is implicitly excluded / denied
        }
        if (projectActionAccess === true) {
          return true; // role given access to this action
        }

        return false; // none of the roles had the required access
      })
    );
  }
}
