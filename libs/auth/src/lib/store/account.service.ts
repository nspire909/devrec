import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from '@devrec/common';

import {
  UserSummary,
  CredentialsViewModel,
  MicrosoftAuthViewModel,
  MicrosoftOptions
} from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private baseUrl: string;

  constructor(
    private _http: HttpClient,
    environmentService: EnvironmentService
  ) {
    this.baseUrl =
      environmentService.environment.server +
      environmentService.environment.apiUrl +
      'auth';
  }

  public getAuth(user: UserSummary) {
    if (!user || !user.jwtToken) {
      return {};
    }
    const headers = { Authorization: 'Bearer ' + user.jwtToken };
    return { headers: headers };
  }

  public verifyUser(user: UserSummary): Observable<UserSummary> {
    const model = {};
    const options = this.getAuth(user);
    return this._http.post<UserSummary>(
      this.baseUrl + '/verify',
      model,
      options
    );
  }

  public login(credentials: CredentialsViewModel): Observable<UserSummary> {
    return this._http.post<UserSummary>(this.baseUrl + '/login', credentials);
  }

  public logout(): Observable<any> {
    return this._http.post<any>(this.baseUrl + '/logout', {});
  }

  public microsoftOptions(): Observable<MicrosoftOptions> {
    return this._http.get<MicrosoftOptions>(
      this.baseUrl + '/external/microsoft'
    );
  }
  public microsoft(
    credentials: MicrosoftAuthViewModel
  ): Observable<UserSummary> {
    return this._http.post<UserSummary>(
      this.baseUrl + '/external/microsoft',
      credentials
    );
  }
}
