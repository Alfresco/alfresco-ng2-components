/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { NodeEntry, DownloadEntry, DownloadBodyCreate } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { LogService } from './log.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DownloadZipService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    createDownload(payload: DownloadBodyCreate): Observable<DownloadEntry> {
        return from(this.apiService.getInstance().core.downloadsApi.createDownload(payload)).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    getContentUrl(nodeId: string, attachment?: boolean): string {
        return this.apiService.getInstance().content.getContentUrl(nodeId, attachment);
    }

    getNode(nodeId: string): Observable<NodeEntry> {
        return from(this.apiService.getInstance().core.nodesApi.getNode(nodeId));
    }

    getDownload(downloadId: string): Observable<DownloadEntry> {
        return from(this.apiService.getInstance().core.downloadsApi.getDownload(downloadId));
    }

    cancelDownload(downloadId: string) {
        this.apiService.getInstance().core.downloadsApi.cancelDownload(downloadId);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
