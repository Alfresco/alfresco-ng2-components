import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { FolderEntity, DocumentEntity } from './../models/document-library.model';
import { AlfrescoSettingsService } from '../../../ng2-alfresco-core/services';
export declare class AlfrescoService {
    private http;
    private settings;
    constructor(http: Http, settings: AlfrescoSettingsService);
    private _host;
    private _baseUrlPath;
    host: string;
    private getBaseUrl();
    getFolder(folder: string): Observable<FolderEntity>;
    getDocumentThumbnailUrl(document: DocumentEntity): string;
    getContentUrl(document: DocumentEntity): string;
    private handleError(error);
}
