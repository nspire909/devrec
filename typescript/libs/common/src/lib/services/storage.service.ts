import {Injectable} from '@angular/core';

export type StorageKey = 'app' | 'theme' | 'current-user' | 'login-return-url';

@Injectable({providedIn: 'root'})
export class StorageService {
  set(key: StorageKey, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) { }
  }

  get(key: StorageKey): any {
    try {
      return JSON.parse(localStorage.getItem(key) || '');
    } catch (e) {
      return null;
    }
  }

  clear(key: StorageKey) {
    try {
      localStorage.removeItem(key);
    } catch (e) { }
  }
}
