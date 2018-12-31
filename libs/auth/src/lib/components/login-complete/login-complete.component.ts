import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountStoreService } from '../../store/account-store.service';

@Component({
  templateUrl: './login-complete.component.html',
  styleUrls: ['./login-complete.component.scss']
})
export class LoginCompleteComponent {
  code = '';
  sessionState = '';

  constructor(
    public route: ActivatedRoute,
    private accountStoreService: AccountStoreService
  ) {
    // params: 'code', 'session_state'
    this.route.queryParamMap.subscribe(prms => {
      this.code = prms.get('code') || '';
      this.sessionState = prms.get('session_state') || '';
      if (this.code) {
        this.accountStoreService.loginMicrosoft(this.code, this.sessionState);
      }
    });
  }
}
