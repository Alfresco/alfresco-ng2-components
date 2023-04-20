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

import { DownloadBodyCreate, DownloadEntry } from '@alfresco/js-api';
import { from, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { zipNode, downloadEntry } from './download-zip-data.mock';

export class AlfrescoApiServiceMock {
    nodeUpdated = new Subject<Node>();
    alfrescoApiInitialized: ReplaySubject<boolean> = new ReplaySubject(1);
    alfrescoApi = new AlfrescoApiCompatibilityMock();

    load() {}
    getInstance = () => this.alfrescoApi;
}

class AlfrescoApiCompatibilityMock {
    core = new CoreMock();
    content = new ContentApiMock();

    isOauthConfiguration = () => true;
    isLoggedIn = () => true;
    isEcmConfiguration = () => true;
    isEcmLoggedIn = () => true;
}

export class ContentApiMock {
    getContentUrl = (_: string, _1?: boolean, _2?: string): string =>
        zipNode.entry.contentUrl;
}

class CoreMock {
    downloadsApi = new DownloadsApiMock();
    nodesApi = new NodesApiMock();
}

export class NodesApiMock {
    getNode = (_: string, _2?: any): any => of(zipNode.entry);
}

class DownloadsApiMock {
    createDownload = (
        _: DownloadBodyCreate,
        _2?: any
    ): Promise<DownloadEntry> => Promise.resolve(downloadEntry);

    getDownload = (_: string, _2?: any): Promise<DownloadEntry> =>
        Promise.resolve(downloadEntry);
    cancelDownload(_: string) {}
}

export class DownloadZipMockService {
    private _downloadsApi: DownloadsApiMock;
    get downloadsApi(): DownloadsApiMock {
        this._downloadsApi = this._downloadsApi ?? new DownloadsApiMock();
        return this._downloadsApi;
    }

    createDownload(payload: DownloadBodyCreate): Observable<DownloadEntry> {
        return from(this.downloadsApi.createDownload(payload)).pipe(
            catchError((err) => of(err))
        );
    }

    getDownload(downloadId: string): Observable<DownloadEntry> {
        return from(this.downloadsApi.getDownload(downloadId));
    }

    cancelDownload(downloadId: string) {
        this.downloadsApi.cancelDownload(downloadId);
    }

    download(url: string, fileName: string) {
        if (url && fileName) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.download = fileName;
            link.href = url;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
