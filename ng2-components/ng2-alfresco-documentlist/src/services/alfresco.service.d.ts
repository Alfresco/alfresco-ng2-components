import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { FolderEntity, DocumentEntity } from './../models/document-library.model';
import { AlfrescoSettingsService } from '../../../ng2-alfresco-core/services';
/**
 * Internal service used by Document List component.
 */
export declare class AlfrescoService {
    private http;
    private settings;
    constructor(http: Http, settings: AlfrescoSettingsService);
    private _host;
    private _baseUrlPath;
    host: string;
    private getBaseUrl();
    /**
     * Gets the folder node with the content.
     * @param folder Path to folder.
     * @returns {Observable<FolderEntity>} Folder entity.
     */
    getFolder(folder: string): Observable<FolderEntity>;
    /**
     * Get thumbnail URL for the given document node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(document: DocumentEntity): string;
    /**
     * Get content URL for the given node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(document: DocumentEntity): string;
    private handleError(error);
}
