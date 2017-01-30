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
import { Observable } from 'rxjs/Rx';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { AlfrescoAuthenticationService, AlfrescoContentService, AlfrescoApiService } from 'ng2-alfresco-core';
export declare class DocumentListService {
    private authService;
    private contentService;
    private apiService;
    static DEFAULT_MIME_TYPE_ICON: string;
    static ROOT_ID: string;
    mimeTypeIcons: any;
    constructor(authService: AlfrescoAuthenticationService, contentService: AlfrescoContentService, apiService: AlfrescoApiService);
    private getNodesPromise(folder, opts?);
    deleteNode(nodeId: string): Observable<any>;
    createFolder(name: string, path: string): Observable<any>;
    getFolder(folder: string, opts?: any): Observable<any>;
    getDocumentThumbnailUrl(node: MinimalNodeEntity): string;
    getMimeTypeIcon(mimeType: string): string;
    private handleError(error);
}
