import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ErrorStoreService } from '../store/error-store.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  // cannot directly inject services we need, since app injection may be what fails.
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    try {
      const errorStore = this.injector.get<ErrorStoreService>(
        ErrorStoreService
      );
      if (errorStore) {
        if (error.status && error.status === 403) {
          errorStore.logForbidden(error);
          return;
        }
        errorStore.logUnhandledError(error);
      } else {
        console.error('Unhandled App Error:', error);
      }
    } catch (e) {
      console.warn('logging error:', e);
    }
  }
}
