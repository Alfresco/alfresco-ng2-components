import { DownloadBodyCreate, DownloadEntry } from '@alfresco/js-api';
import { LogService } from './../../../services/log.service';
import { from, Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';

const zipNode = {
    entry: {
        name: 'files.zip',
        contentUrl: './../assets/files.zip',
        id: 'files_in_zip'
    }
};

const downloadEntry: DownloadEntry = {
    entry: {
        id: 'entryId',
        status: 'DONE'
    }
};

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
    getNode = (_: string, _2?: any): any => {
        console.log('lol xd');
        return of(zipNode.entry);
    };
}

class DownloadsApiStub {
    createDownload = (
        _: DownloadBodyCreate,
        _2?: any
    ): Promise<DownloadEntry> => {
        console.log(_);
        return Promise.resolve(downloadEntry);
    };

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
        console.log('ja tu jestem');
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
