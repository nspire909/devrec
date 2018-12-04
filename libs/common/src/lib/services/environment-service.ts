import { Inject, Injectable, InjectionToken } from '@angular/core';

export const ENVIRONMENT_SETTINGS = new InjectionToken('environment-settings');

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  constructor(@Inject(ENVIRONMENT_SETTINGS) public environment: any) {}
}
