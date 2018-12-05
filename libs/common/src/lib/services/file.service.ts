import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { FileMetadata } from './file.model';
import { memorize } from '../utility/observable-utils';
import { EnvironmentService } from './environment-service';

@Injectable({ providedIn: 'root'})
export class FileService {
  private baseUrl: string;

  constructor(private _http: HttpClient, environmentService: EnvironmentService) {
    this.baseUrl = environmentService.environment.server + environmentService.environment.apiUrl + 'file';
  }

  public getFileMetaData(fileId: string): Observable<FileMetadata> {
    if (fileId.startsWith('00000000')) {
      return of({ fileId, size: 0, extension: '', contentType: '' });
    }
    return this._http
      .get<FileMetadata>(this.baseUrl + '/' + fileId + '/filedata')
      .pipe(memorize());
  }

  thumbnailUrl(fileId: string): string {
    if (!fileId || fileId.startsWith('00000000')) {
      return '/assets/svg/placeholder-receipt.svg';
    }
    return '/api/file/' + fileId + '/thumbnail';
  }

  mediumUrl(fileId: string): string {
    if (!fileId || fileId.startsWith('00000000')) {
      return '/assets/svg/placeholder-receipt.svg';
    }
    return '/api/file/' + fileId + '/medium';
  }

  largeUrl(fileId: string): string {
    if (!fileId || fileId.startsWith('00000000')) {
      return '/assets/svg/placeholder-receipt.svg';
    }
    return '/api/file/' + fileId + '/large';
  }

  upload(file: FormData): Observable<FileMetadata> {
    return this._http
      .post<FileMetadata>(this.baseUrl + '/upload', file)
      .pipe(memorize());
  }
}
