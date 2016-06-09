/*!
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

import { Injectable } from 'angular2/core';
import { Response } from 'angular2/http';
import { Observable } from 'rxjs/Rx';
import { NodePaging, MinimalNodeEntity } from './../models/document-library.model';
import { AlfrescoSettingsService } from 'ng2-alfresco-core/dist/ng2-alfresco-core';

declare let AlfrescoApi: any;

// TODO: consider renaming to something like 'DocumentListService'
/**
 * Internal service used by Document List component.
 */
@Injectable()
export class AlfrescoService {

    private _baseUrlPath: string = '/alfresco/api/-default-/public/alfresco/versions/1';

    mimeTypeIcons: any = {
        'image/png': 'ft_ic_raster_image.svg',
        'image/jpeg': 'ft_ic_raster_image.svg',
        'image/gif': 'ft_ic_raster_image.svg',
        'application/pdf': 'ft_ic_pdf.svg',
        'application/vnd.ms-excel': 'ft_ic_ms_excel.svg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'ft_ic_ms_excel.svg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'ft_ic_ms_excel.svg',
        'application/msword': 'ft_ic_ms_word.svg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'ft_ic_ms_word.svg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'ft_ic_ms_word.svg',
        'application/vnd.ms-powerpoint': 'ft_ic_ms_powerpoint.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ft_ic_ms_powerpoint.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.template': 'ft_ic_ms_powerpoint.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ft_ic_ms_powerpoint.svg',
        'video/mp4': 'ft_ic_video.svg',
        'text/plain': 'ft_ic_document.svg',
        'application/x-javascript': 'ft_ic_document.svg',
        'application/json': 'ft_ic_document.svg',
        'image/svg+xml': 'ft_ic_vector_image.svg',
        'text/html': 'ft_ic_website.svg',
        'application/x-compressed': 'ft_ic_archive.svg',
        'application/x-zip-compressed': 'ft_ic_archive.svg',
        'application/zip': 'ft_ic_archive.svg',
        'application/vnd.apple.keynote': 'ft_ic_presentation.svg',
        'application/vnd.apple.pages': 'ft_ic_document.svg',
        'application/vnd.apple.numbers': 'ft_ic_spreadsheet.svg'
    };

    constructor(
        private settings: AlfrescoSettingsService) {
    }

    public getHost(): string {
        return this.settings.host;
    }

    private getBaseUrl(): string {
        return this.getHost() + this._baseUrlPath;
    }

    private getAlfrescoTicket() {
        return localStorage.getItem('token');
    }

    private getAlfrescoClient() {
        return AlfrescoApi.getClientWithTicket(this.getBaseUrl(), this.getAlfrescoTicket());
    }

    private getNodesPromise(folder: string) {
        let alfrescoClient = this.getAlfrescoClient();
        let apiInstance = new AlfrescoApi.Core.NodesApi(alfrescoClient);
        let nodeId = '-root-';
        let opts = {
            relativePath: folder,
            include: ['path']
        };
        return apiInstance.getNodeChildren(nodeId, opts);
    }

    deleteNode(nodeId: string) {
        let client = this.getAlfrescoClient();
        let nodesApi = new AlfrescoApi.Core.NodesApi(client);
        let opts = {};
        return Observable.fromPromise(nodesApi.deleteNode(nodeId, opts));
    }

    /**
     * Gets the folder node with the content.
     * @param folder Path to folder.
     * @returns {Observable<NodePaging>} Folder entity.
     */
    getFolder(folder: string) {
        return Observable.fromPromise(this.getNodesPromise(folder))
            .map(res => <NodePaging> res)
            .do(data => console.log('Node data', data)) // eyeball results in the console
            .catch(this.handleError);
    }

    /**
     * Get thumbnail URL for the given document node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(document: MinimalNodeEntity) {
        return this.getContentUrl(document) + '/thumbnails/doclib?c=queue&ph=true&lastModified=1&alf_ticket=' + this.getAlfrescoTicket();
    }

    /**
     * Get content URL for the given node.
     * @param document Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(document: MinimalNodeEntity) {
        return this.getHost() +
            '/alfresco/service/api/node/workspace/SpacesStore/' +
            document.entry.id + '/content';
    }

    getMimeTypeIcon(mimeType: string): string {
        let icon = this.mimeTypeIcons[mimeType];
        return icon || 'ft_ic_miscellaneous.svg';
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
