import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router) {
    localStorage.removeItem('currentUser');
  }

  login() {
    this.router.navigate(['account', 'login']);
  }
}
