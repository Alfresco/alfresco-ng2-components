/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { throwError, Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AlfrescoApiService, LogService } from '@alfresco/adf-core';

@Injectable({
  providedIn: 'root'
})
export class ProcessCloudContentService {

  constructor(
    private apiService: AlfrescoApiService,
    private logService: LogService
  ) { }

  createTemporaryRawRelatedContent(file, nodeId, contentHost): Observable<any> {

    const changedConfig = this.apiService.lastConfig;
    changedConfig.provider = 'ALL';
    changedConfig.hostEcm = contentHost.replace('/alfresco', '');
    this.apiService.getInstance().setConfig(changedConfig);
    return from(this.apiService.getInstance().upload.uploadFile(
      file, '', nodeId, '', { overwrite: true })).pipe(
        map((res: any) => {
          return (res.entry);
        }),
        catchError((err) => this.handleError(err))
      );
  }

  /**
 * Gets the preview for a related content file.
 * @param contentId ID of the related content
 * @returns Binary data of the content preview
 */
  getContentPreview(contentId: number): Observable<any> {
    return of(null);
  }

  /**
 * Gets raw binary content data for a related content file.
 * @param contentId ID of the related content
 * @returns Binary data of the related content
 */
  getFileRawContent(contentId: number): Observable<any> {
    return of(null);
  }

  private handleError(error: any) {
    this.logService.error(error);
    return throwError(error || 'Server error');
  }
}
