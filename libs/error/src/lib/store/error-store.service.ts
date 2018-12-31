import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { AccountStoreService } from '@devrec/auth';

import { createError, createInfo, createWarning } from '../models/error.model';
import { ErrorAppState, errorActions } from './error.store';

@Injectable({ providedIn: 'root' })
export class ErrorStoreService {
  constructor(
    private _store: Store<ErrorAppState>,
    private _accountStoreService: AccountStoreService,
    public snackBar: MatSnackBar
  ) {}

  logInfo(source: string, message: string, data: any) {
    this._store.dispatch(
      errorActions.create(
        errorActions.logEvent,
        createInfo(source, message, data)
      )
    );
  }
  logWarning(source: string, message: string, data: any) {
    console.warn(source, message, data);
    this._store.dispatch(
      errorActions.create(
        errorActions.logEvent,
        createWarning(source, message, data)
      )
    );
    this.snackBar.open(message, 'OK', { duration: 6000 });
  }
  logForbidden(error: Error) {
    console.error(error);
    this.snackBar.open('Access Denied', 'OK', { duration: 6000 });
  }
  logError(source: string, message: string, data: any) {
    console.error(source, message, data);
    this._store.dispatch(
      errorActions.create(
        errorActions.logEvent,
        createError(source, message, data)
      )
    );
    if (data.messages) {
      const detail = data.messages.join(' ');
      if (message.indexOf(detail) < 0) {
        message = message + ' ' + detail;
      }
    }
    this.snackBar.open(message, 'OOPS', { duration: 6000 });
    // TODO: include snackbar click handler to error screen to submit a report
  }

  logApiError(error: Error, data: any) {
    this._store.dispatch(
      errorActions.create(
        errorActions.logEvent,
        createError(error.name, error.message, data)
      )
    );
    this.snackBar.open('API error', 'Doh', { duration: 6000 });
  }

  logUnhandledError(error: Error) {
    try {
      // HACK: ng2-pdf-viewer emits this error when working properly. Log to console but don't throw alert.
      if (error.message === "Cannot read property 'getPage' of undefined") {
        return;
      }

      console.error('unhandled error:', error);
      if (error instanceof HttpErrorResponse) {
        let msg = '';
        if (error.error && error.error.messages) {
          msg = Array.isArray(error.error.messages)
            ? error.error.messages.join('. ')
            : error.error.messages;
        } else {
          msg = Array.isArray(error.error)
            ? error.error.join('. ')
            : error.error;
        }
        if (error.status === 403) {
          this.snackBar.open(
            msg || 'You are not authorized for this action',
            'OK'
          );
          return;
        }
        if (error.status >= 500) {
          this.snackBar.open(
            error.status + ': ' + (msg || 'Failed to process your request'),
            'OK'
          );
          return;
        }
        if (error.status >= 400 && error.status !== 401) {
          this.snackBar.open(
            error.status + ': ' + (msg || 'Invalid request'),
            'OK'
          );
          return;
        }
      }
      if (!error) {
        return;
      }

      this._store.dispatch(
        errorActions.create(
          errorActions.logEvent,
          createError(error.name, error.message, error.stack)
        )
      );
      if (!this._accountStoreService.userLoaded) {
        return;
      }

      if (this.snackBar) {
        this.snackBar.open('Fatal error', 'OK');
      } else {
        alert('Fatal error');
      }
    } catch (e) {
      console.warn('logging error:', e);
    }
  }
}
