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

import { DownloadEntry, DownloadBodyCreate, DownloadsApi } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { LogService } from './log.service';
import { catchError } from 'rxjs/operators';
import { ApiClientsService } from '@alfresco/adf-core/api';

@Injectable({
    providedIn: 'root'
})
export class DownloadZipService {

    get downloadsApi(): DownloadsApi {
        return this.apiClientsService.get('ContentClient.downloads');
    }

    constructor(private apiClientsService: ApiClientsService, private logService: LogService) {}

    /**
     * Creates a new download.
     *
     * @param payload Object containing the node IDs of the items to add to the ZIP file
     * @returns Status object for the download
     */
    createDownload(payload: DownloadBodyCreate): Observable<DownloadEntry> {
        return from(this.downloadsApi.createDownload(payload)).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Gets status information for a download node.
     *
     * @param downloadId ID of the download node
     * @returns Status object for the download
     */
    getDownload(downloadId: string): Observable<DownloadEntry> {
        return from(this.downloadsApi.getDownload(downloadId));
    }

    /**
     * Cancels a download.
     *
     * @param downloadId ID of the target download node
     */
    cancelDownload(downloadId: string) {
        this.downloadsApi.cancelDownload(downloadId);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
