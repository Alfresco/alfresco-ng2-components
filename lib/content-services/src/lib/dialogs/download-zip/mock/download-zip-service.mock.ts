/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DownloadBodyCreate, DownloadEntry, DownloadsApi, Node } from '@alfresco/js-api';
import { from, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { zipNode, downloadEntry } from './download-zip-data.mock';
import { DownloadZipService } from '../services/download-zip.service';
import { ContentService, AlfrescoApiService } from '../../../../..';
import { inject } from '@angular/core';

export class AlfrescoApiServiceMock extends AlfrescoApiService {
    nodeUpdated = new Subject<Node>();
    alfrescoApiInitialized = new ReplaySubject<boolean>(1);
    alfrescoApi = inject(AlfrescoApiMock) as any;

    async load() {}
    getInstance = () => this.alfrescoApi;
}

class AlfrescoApiMock extends AlfrescoApiService {
    core = inject(CoreMock);
    content = inject(ContentApiMock);

    isOauthConfiguration = () => true;
    isLoggedIn = () => true;
    isEcmConfiguration = () => true;
}

export class ContentApiMock extends ContentService {
    getContentUrl = (): string => zipNode.entry.contentUrl;
}

class CoreMock {
    downloadsApi = new DownloadsApiMock();
    nodesApi = new NodesApiMock();
}

export class NodesApiMock {
    getNode = (): any => of(zipNode.entry);
}

class DownloadsApiMock extends DownloadsApi {
    createDownload = (): Promise<DownloadEntry> => Promise.resolve(downloadEntry);

    getDownload = (): Promise<DownloadEntry> => Promise.resolve(downloadEntry);
    cancelDownload = () => Promise.resolve(true);
}

export class DownloadZipMockService extends DownloadZipService {
    private _mockDownloadsApi: DownloadsApi;
    get downloadsApi(): DownloadsApi {
        this._mockDownloadsApi = this._mockDownloadsApi ?? new DownloadsApiMock();
        return this._mockDownloadsApi;
    }

    createDownload(payload: DownloadBodyCreate): Observable<DownloadEntry> {
        return from(this.downloadsApi.createDownload(payload)).pipe(catchError((err) => of(err)));
    }

    getDownload(downloadId: string): Observable<DownloadEntry> {
        return from(this.downloadsApi.getDownload(downloadId));
    }

    cancelDownload(downloadId: string) {
        this.downloadsApi.cancelDownload(downloadId);
    }
}
