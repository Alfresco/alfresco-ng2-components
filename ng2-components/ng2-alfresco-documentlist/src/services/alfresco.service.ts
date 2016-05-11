/**
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {FolderEntity, DocumentEntity} from './../models/document-library.model';
import {AlfrescoSettingsService} from '../../../ng2-alfresco-core/services';

/**
 * Internal service used by Document List component.
 */
@Injectable()
export class AlfrescoService {

    constructor(
        private http: Http,
        private settings: AlfrescoSettingsService
    ) {
        if (settings) {
            this._host = settings.host;
        }
    }

    private _host: string = 'http://127.0.0.1:8080';
    private _baseUrlPath: string = '/alfresco/service/slingshot/doclib/doclist/all/site/';

    public get host():string {
        return this._host;
    }

    public set host(value:string) {
        this._host = value;
    }

    private getBaseUrl():string {
        return this.host + this._baseUrlPath;
    }

    /**
     * Gets the folder node with the content.
     * @param folder Path to folder.
     * @returns {Observable<FolderEntity>} Folder entity.
     */
    getFolder(folder: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.settings.getAuthToken()
        });
        let options = new RequestOptions({ headers: headers });
        return this.http
            .get(this.getBaseUrl() + folder, options)
            .map(res => <FolderEntity> res.json())
            .do(data => console.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    /**
     * Get thumbnail URL for the given document node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(document: DocumentEntity): string {
        return this._host +
            '/alfresco/service/api/node/' +
            document.nodeRef.replace('://', '/') + '/content/thumbnails/doclib?c=queue&amp;ph=true&amp;lastModified=1';
    }

    /**
     * Get content URL for the given node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(document: DocumentEntity): string {
        return this._host + '/alfresco/service/' + document.contentUrl;
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
