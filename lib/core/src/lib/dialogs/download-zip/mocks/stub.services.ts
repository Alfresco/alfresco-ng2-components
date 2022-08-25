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

import { DownloadBodyCreate, DownloadEntry } from '@alfresco/js-api';
import { from, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { zipNode, downloadEntry } from './stub.data';
export class AlfrescoApiServiceStub {
    nodeUpdated = new Subject<Node>();
    alfrescoApiInitialized: ReplaySubject<boolean> = new ReplaySubject(1);
    alfrescoApi = new AlfrescoApiCompatibilityStub();

    load() {}
    getInstance = () => this.alfrescoApi;
}

class AlfrescoApiCompatibilityStub {
    core = new CoreStub();
    content = new ContentApiStub();

    isOauthConfiguration = () => true;
    isLoggedIn = () => true;
    isEcmConfiguration = () => true;
    isEcmLoggedIn = () => true;
}

export class ContentApiStub {
    getContentUrl = (_: string, _1?: boolean, _2?: string): string =>
        zipNode.entry.contentUrl;
}

class CoreStub {
    downloadsApi = new DownloadsApiStub();
    nodesApi = new NodesApiStub();
}

export class NodesApiStub {
    getNode = (_: string, _2?: any): any => of(zipNode.entry);
}

class DownloadsApiStub {
    createDownload = (
        _: DownloadBodyCreate,
        _2?: any
    ): Promise<DownloadEntry> => Promise.resolve(downloadEntry);

    getDownload = (_: string, _2?: any): Promise<DownloadEntry> =>
        Promise.resolve(downloadEntry);
    cancelDownload(_: string) {}
}

export class DownloadZipMockService {
    private _downloadsApi: DownloadsApiStub;
    get downloadsApi(): DownloadsApiStub {
        this._downloadsApi = this._downloadsApi ?? new DownloadsApiStub();
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
