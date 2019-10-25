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

    /**
     * Creates a new download.
     * @param payload Object containing the node IDs of the items to add to the ZIP file
     * @returns Status object for the download
     */
    createDownload(payload: DownloadBodyCreate): Observable<DownloadEntry> {
        return from(this.apiService.getInstance().core.downloadsApi.createDownload(payload)).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Gets a content URL for the given node.
     * @param nodeId Node to get URL for.
     * @param attachment Toggles whether to retrieve content as an attachment for download
     * @returns URL string
     */
    getContentUrl(nodeId: string, attachment?: boolean): string {
        return this.apiService.getInstance().content.getContentUrl(nodeId, attachment);
    }

    /**
     * Gets a Node via its node ID.
     * @param nodeId ID of the target node
     * @returns Details of the node
     */
    getNode(nodeId: string): Observable<NodeEntry> {
        return from(this.apiService.getInstance().core.nodesApi.getNode(nodeId));
    }

    /**
     * Gets status information for a download node.
     * @param downloadId ID of the download node
     * @returns Status object for the download
     */
    getDownload(downloadId: string): Observable<DownloadEntry> {
        return from(this.apiService.getInstance().core.downloadsApi.getDownload(downloadId));
    }

    /**
     * Cancels a download.
     * @param downloadId ID of the target download node
     */
    cancelDownload(downloadId: string) {
        this.apiService.getInstance().core.downloadsApi.cancelDownload(downloadId);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
