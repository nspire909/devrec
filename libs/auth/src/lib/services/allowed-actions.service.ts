import { Inject, Injectable, InjectionToken } from '@angular/core';

export const ALLOWED_ACTIONS_ROLE_MAP = new InjectionToken<any>(
  'ALLOWED_ACTIONS_ROLE_MAP'
);

@Injectable({ providedIn: 'root' })
export class AllowedActionsService {
  constructor(@Inject(ALLOWED_ACTIONS_ROLE_MAP) public roleMap: any) {}
}
