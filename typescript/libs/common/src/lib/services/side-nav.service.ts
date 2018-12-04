import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSidenav } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class SideNavService {
  public sidenav = new BehaviorSubject<MatSidenav | null>(null);
}
