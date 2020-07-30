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
import { throwError, Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
    AlfrescoApiService,
    LogService,
    ContentService,
    DownloadService
} from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class ProcessCloudContentService {
    constructor(
        private apiService: AlfrescoApiService,
        private logService: LogService,
        public contentService: ContentService,
        private downloadService: DownloadService
    ) {}

    createTemporaryRawRelatedContent(
        file: File,
        nodeId: string
    ): Observable<Node> {

        return from(
            this.apiService
                .getInstance()
                .upload.uploadFile(file, '', nodeId, '', { overwrite: true })
        ).pipe(
            map((res: any) => {
                return {
                    ...res.entry,
                    nodeId: res.entry.id
                };
            }),
            catchError(err => this.handleError(err))
        );
    }

    getRawContentNode(nodeId: string): Observable<Blob> {
        return this.contentService.getNodeContent(nodeId);
    }

    downloadNodeContent(blob: Blob, fileName: string): void {
        this.contentService.downloadBlob(blob, fileName);
    }

    async downloadFile(nodeId: string) {

        const ticket = await this.getAuthTicket();
        const url = this.contentService.getContentUrl(nodeId, true, ticket);

        this.downloadService.downloadUrl(url, nodeId);
    }

    async getAuthTicket(): Promise<string> {
        const { auth } = this.apiService.getInstance();
        const ticket = await auth.authenticationApi.getTicket();

        if (ticket && ticket.entry) {
            return ticket.entry.id || '';
        }

        return '';
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
