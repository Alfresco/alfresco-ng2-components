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

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AlfrescoJsApi, NodePaging, MinimalNodeEntity } from 'alfresco-js-api';
import {
    AlfrescoAuthenticationService,
    AlfrescoContentService
} from 'ng2-alfresco-core';

@Injectable()
export class DocumentListService {

    static DEFAULT_MIME_TYPE_ICON: string = 'ft_ic_miscellaneous.svg';

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
        private authService: AlfrescoAuthenticationService,
        private contentService: AlfrescoContentService
    ) {
    }

    private getAlfrescoApi(): AlfrescoJsApi {
        return this.authService.getAlfrescoApi();
    }

    private getNodesPromise(folder: string, opts?: any): Promise<NodePaging> {
        let nodeId = '-root-';
        let params: any = {
            relativePath: folder,
            include: ['path']
        };

        if (opts) {
            if (opts.maxItems) {
                params.maxItems = opts.maxItems;
            }
            if (opts.skipCount) {
                params.skipCount = opts.skipCount;
            }
        }

        return this.getAlfrescoApi().nodes.getNodeChildren(nodeId, params);
    }

    deleteNode(nodeId: string): Observable<any> {
        return Observable.fromPromise(this.getAlfrescoApi().nodes.deleteNode(nodeId));
    }

    /**
     * Gets the folder node with the content.
     * @param folder Path to folder.
     * @param opts Options.
     * @returns {Observable<NodePaging>} Folder entity.
     */
    getFolder(folder: string, opts?: any) {
        return Observable.fromPromise(this.getNodesPromise(folder, opts))
            .map(res => <NodePaging> res)
            // .do(data => console.log('Node data', data)) // eyeball results in the console
            .catch(this.handleError);
    }

    /**
     * Get thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(node: MinimalNodeEntity) {
        if (node && this.contentService) {
            return this.contentService.getDocumentThumbnailUrl(node);
        }
        return null;
    }

    getMimeTypeIcon(mimeType: string): string {
        let icon = this.mimeTypeIcons[mimeType];
        return icon || DocumentListService.DEFAULT_MIME_TYPE_ICON;
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
