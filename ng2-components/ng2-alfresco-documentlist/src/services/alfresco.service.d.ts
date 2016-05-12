import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { NodePaging, MinimalNodeEntity } from './../models/document-library.model';
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
     * @returns {Observable<NodePaging>} Folder entity.
     */
    getFolder(folder: string): Observable<NodePaging>;
    /**
     * Get thumbnail URL for the given document node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(document: MinimalNodeEntity): string;
    /**
     * Get content URL for the given node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(document: MinimalNodeEntity): string;
    private handleError(error);
}
