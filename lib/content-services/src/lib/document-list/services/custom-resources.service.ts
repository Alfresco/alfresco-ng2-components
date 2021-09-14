/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ContentService, LogService, PaginationModel } from '@alfresco/adf-core';
import {
    NodePaging,
    DeletedNodesPaging,
    SharedLinkPaging,
    SiteMemberPaging
} from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomResourcesService {

    constructor(private contentService: ContentService, private logService: LogService) {
    }

    private getAsNodePaging(nodes: { list?: any }): NodePaging {
        const result = new NodePaging();
        result.list = nodes.list;
        return result;
    }

    /**
     * Gets files recently accessed by a user.
     * @param personId ID of the user
     * @param pagination Specifies how to paginate the results
     * @param filters Specifies additional filters to apply (joined with **AND**)
     * @returns List of nodes for the recently used files
     */
    getRecentFiles(personId: string, pagination: PaginationModel, filters?: string[]): Observable<NodePaging> {
        return this.contentService.getRecentFiles(personId, pagination, filters).pipe(map(nodes => this.getAsNodePaging(nodes)), catchError((err) => this.handleError(err)));
    }

    /**
     * Gets favorite files for the current user.
     * @param pagination Specifies how to paginate the results
     * @param includeFields List of data field names to include in the results
     * @param where A string to restrict the returned objects by using a predicate
     * @returns List of favorite files
     */
    loadFavorites(pagination: PaginationModel, includeFields: string[] = [], where?: string): Observable<NodePaging> {
        return this.contentService.loadFavorites(pagination, includeFields, where).pipe(map(nodes => this.getAsNodePaging(nodes)), catchError((err) => this.handleError(err)));
    }

    /**
     * Gets sites that the current user is a member of.
     * @param pagination Specifies how to paginate the results
     * @param where A string to restrict the returned objects by using a predicate
     * @returns List of sites
     */
    loadMemberSites(pagination: PaginationModel, where?: string): Observable<SiteMemberPaging> {
        return this.contentService.loadMemberSites(pagination, where).pipe(catchError((err) => this.handleError(err)));
    }

    /**
     * Gets all sites in the repository.
     * @param pagination Specifies how to paginate the results
     * @param where A string to restrict the returned objects by using a predicate
     * @returns List of sites
     */
    loadSites(pagination: PaginationModel, where?: string): Observable<NodePaging> {
        return this.contentService.loadSites(pagination, where).pipe(map(nodes => this.getAsNodePaging(nodes)), catchError((err) => this.handleError(err)));
    }

    /**
     * Gets all items currently in the trash.
     * @param pagination Specifies how to paginate the results
     * @param includeFields List of data field names to include in the results
     * @returns List of deleted items
     */
    loadTrashcan(pagination: PaginationModel, includeFields: string[] = []): Observable<DeletedNodesPaging> {
        return this.contentService.loadTrashcan(pagination, includeFields).pipe(catchError((err) => this.handleError(err)));

    }

    /**
     * Gets shared links for the current user.
     * @param pagination Specifies how to paginate the results
     * @param includeFields List of data field names to include in the results
     * @param where A string to restrict the returned objects by using a predicate
     * @returns List of shared links
     */
    loadSharedLinks(pagination: PaginationModel, includeFields: string[] = [], where?: string): Observable<SharedLinkPaging> {
        return this.contentService.loadSharedLinks(pagination, includeFields, where).pipe(catchError((err) => this.handleError(err)));
    }

    /**
     * Is the folder ID one of the well-known aliases?
     * @param folderId Folder ID name to check
     * @returns True if the ID is a well-known name, false otherwise
     */
    isCustomSource(folderId: string): boolean {
        let isCustomSources = false;
        const sources = ['-trashcan-', '-sharedlinks-', '-sites-', '-mysites-', '-favorites-', '-recent-'];

        if (sources.indexOf(folderId) > -1) {
            isCustomSources = true;
        }

        return isCustomSources;
    }

    /**
     * Is the folder ID a "-my", "-root-", or "-shared-" alias?
     * @param folderId Folder ID name to check
     * @returns True if the ID is one of the supported sources, false otherwise
     */
    isSupportedSource(folderId: string): boolean {
        let isSupportedSources = false;
        const sources = ['-my-', '-root-', '-shared-'];

        if (sources.indexOf(folderId) > -1) {
            isSupportedSources = true;
        }

        return isSupportedSources;
    }

    /**
     * Gets a folder's contents.
     * @param nodeId ID of the target folder node
     * @param pagination Specifies how to paginate the results
     * @param includeFields List of data field names to include in the results
     * @param where  Filters the Node list using the *where* condition of the REST API (for example, isFolder=true). See the REST API documentation for more information.
     * @returns List of items contained in the folder
     */
    loadFolderByNodeId(nodeId: string, pagination: PaginationModel, includeFields: string[] = [], where?: string): any {
        if (nodeId === '-trashcan-') {
            return this.loadTrashcan(pagination, includeFields);
        } else if (nodeId === '-sharedlinks-') {
            return this.loadSharedLinks(pagination, includeFields, where);
        } else if (nodeId === '-sites-') {
            return this.loadSites(pagination, where);
        } else if (nodeId === '-mysites-') {
            return this.loadMemberSites(pagination, where);
        } else if (nodeId === '-favorites-') {
            return this.loadFavorites(pagination, includeFields, where);
        } else if (nodeId === '-recent-') {
            return this.getRecentFiles('-me-', pagination);
        }
    }

    // TODO: remove it from here

    /**
     * Gets the contents of one of the well-known aliases in the form of node ID strings.
     * @param nodeId ID of the target folder node
     * @param pagination Specifies how to paginate the results
     * @returns List of node IDs
     */
    getCorrespondingNodeIds(nodeId: string, pagination: PaginationModel = {}): Observable<string[]> {
        if (this.isCustomSource(nodeId)) {

            return this.loadFolderByNodeId(nodeId, pagination)
                .pipe(map((result: any): string[] => {
                    return result.list.entries.map((node: any): string => this.getIdFromEntry(node, nodeId));
                }));

        } else if (nodeId) {
            // cases when nodeId is '-my-', '-root-' or '-shared-'
            return this.contentService.getNode(nodeId).pipe(map((node) => [node.entry.id]));
        }

        return of([]);
    }

    /**
     * Does the well-known alias have a corresponding node ID?
     * @param nodeId Node to check
     * @returns True if the alias has a corresponding node ID, false otherwise
     */
    hasCorrespondingNodeIds(nodeId: string): boolean {
        return this.isCustomSource(nodeId) || this.isSupportedSource(nodeId);
    }

    private getIdFromEntry(node: any, nodeId: string): string {
        if (nodeId === '-sharedlinks-') {
            return node.entry.nodeId;
        } else if (nodeId === '-sites-' || nodeId === '-mysites-') {
            return node.entry.guid;
        } else if (nodeId === '-favorites-') {
            return node.entry.targetGuid;
        } else {
            return node.entry.id;
        }
    }

    private handleError(error: Response) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
