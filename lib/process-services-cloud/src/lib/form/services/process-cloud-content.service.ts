/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    DownloadService
} from '@alfresco/adf-core';
import { ContentService, NodesApiService } from '@alfresco/adf-content-services';
import { AuthenticationApi, Node, UploadApi } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class ProcessCloudContentService {

    private _uploadApi: UploadApi;
    get uploadApi(): UploadApi {
        this._uploadApi = this._uploadApi ?? new UploadApi(this.apiService.getInstance());
        return this._uploadApi;
    }

    private _authenticationApi: AuthenticationApi;
    get authenticationApi(): AuthenticationApi {
        this._authenticationApi = this._authenticationApi ?? new AuthenticationApi(this.apiService.getInstance());
        return this._authenticationApi;
    }

    constructor(
        private apiService: AlfrescoApiService,
        private logService: LogService,
        private nodesApiService: NodesApiService,
        private contentService: ContentService,
        private downloadService: DownloadService
    ) {
    }

    createTemporaryRawRelatedContent(
        file: File,
        nodeId: string
    ): Observable<Node> {

        return from(
            this.uploadApi.uploadFile(file, '', nodeId, '', {overwrite: true})
        ).pipe(
            map((res: any) => ({
                ...res.entry,
                nodeId: res.entry.id
            })),
            catchError(err => this.handleError(err))
        );
    }

    getRawContentNode(nodeId: string): Observable<Blob> {
        return this.nodesApiService.getNodeContent(nodeId);
    }

    downloadNodeContent(blob: Blob, fileName: string): void {
        this.downloadService.downloadBlob(blob, fileName);
    }

    async downloadFile(nodeId: string) {

        const ticket = await this.getAuthTicket();
        const url = this.contentService.getContentUrl(nodeId, true, ticket);

        this.downloadService.downloadUrl(url, nodeId);
    }

    async getAuthTicket(): Promise<string> {
        const ticket = await this.authenticationApi.getTicket();

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
