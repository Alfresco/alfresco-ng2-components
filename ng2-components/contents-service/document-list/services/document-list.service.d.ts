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
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoAuthenticationService, AlfrescoContentService, AlfrescoApiService, LogService } from 'ng2-alfresco-core';
export declare class DocumentListService {
    private authService;
    private contentService;
    private apiService;
    private logService;
    static DEFAULT_MIME_TYPE_ICON: string;
    static ROOT_ID: string;
    mimeTypeIcons: any;
    constructor(authService: AlfrescoAuthenticationService, contentService: AlfrescoContentService, apiService: AlfrescoApiService, logService: LogService);
    private getNodesPromise(folder, opts?);
    deleteNode(nodeId: string): Observable<any>;
    /**
     * Create a new folder in the path.
     * @param name Folder name
     * @param parentId Parent folder ID
     * @returns {any}
     */
    createFolder(name: string, parentId: string): Observable<MinimalNodeEntity>;
    /**
     * Gets the folder node with the specified relative name path below the root node.
     * @param folder Path to folder.
     * @param opts Options.
     * @returns {Observable<NodePaging>} Folder entity.
     */
    getFolder(folder: string, opts?: any): Observable<any>;
    getFolderNode(nodeId: string): Promise<MinimalNodeEntryEntity>;
    /**
     * Get thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(node: MinimalNodeEntity): string;
    getMimeTypeIcon(mimeType: string): string;
    private handleError(error);
}
