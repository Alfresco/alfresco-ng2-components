import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { FolderEntity } from "./core/entities/folder.entity";
import { DocumentEntity } from "./core/entities/document.entity";
export declare class AlfrescoService {
    private http;
    constructor(http: Http);
    private _host;
    private _baseUrlPath;
    host: string;
    private getBaseUrl();
    getFolder(folder: string): Observable<FolderEntity>;
    getDocumentThumbnailUrl(document: DocumentEntity): string;
    getContentUrl(document: DocumentEntity): string;
    private handleError(error);
}
