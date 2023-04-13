/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AlfrescoApiService, LogService, PaginationModel } from '@alfresco/adf-core';
import {
    NodePaging,
    DeletedNodesPaging,
    SearchRequest,
    SharedLinkPaging,
    FavoritePaging,
    SiteMemberPaging,
    SiteRolePaging,
    PeopleApi,
    SitesApi,
    SearchApi,
    FavoritesApi,
    SharedlinksApi,
    TrashcanApi,
    NodesApi
} from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const CREATE_PERMISSION: string = 'create';

@Injectable({ providedIn: 'root' })
export class CustomResourcesService {

    private _peopleApi: PeopleApi;
    get peopleApi(): PeopleApi {
        this._peopleApi = this._peopleApi ?? new PeopleApi(this.apiService.getInstance());
        return this._peopleApi;
    }

    private _sitesApi: SitesApi;
    get sitesApi(): SitesApi {
        this._sitesApi = this._sitesApi ?? new SitesApi(this.apiService.getInstance());
        return this._sitesApi;
    }

    private _trashcanApi: TrashcanApi;
    get trashcanApi(): TrashcanApi {
        this._trashcanApi = this._trashcanApi ?? new TrashcanApi(this.apiService.getInstance());
        return this._trashcanApi;
    }

    private _searchApi: SearchApi;
    get searchApi(): SearchApi {
        this._searchApi = this._searchApi ?? new SearchApi(this.apiService.getInstance());
        return this._searchApi;
    }

    private _sharedLinksApi: SharedlinksApi;
    get sharedLinksApi(): SharedlinksApi {
        this._sharedLinksApi = this._sharedLinksApi ?? new SharedlinksApi(this.apiService.getInstance());
        return this._sharedLinksApi;
    }

    private _favoritesApi: FavoritesApi;
    get favoritesApi(): FavoritesApi {
        this._favoritesApi = this._favoritesApi ?? new FavoritesApi(this.apiService.getInstance());
        return this._favoritesApi;
    }

    private _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {
    }

    /**
     * Gets files recently accessed by a user.
     *
     * @param personId ID of the user
     * @param pagination Specifies how to paginate the results
     * @param filters Specifies additional filters to apply (joined with **AND**)
     * @returns List of nodes for the recently used files
     */
    getRecentFiles(personId: string, pagination: PaginationModel, filters?: string[]): Observable<NodePaging> {
        const defaultFilter = [
            'TYPE:"content"',
            '-PNAME:"0/wiki"',
            '-TYPE:"app:filelink"',
            '-TYPE:"cm:thumbnail"',
            '-TYPE:"cm:failedThumbnail"',
            '-TYPE:"cm:rating"',
            '-TYPE:"dl:dataList"',
            '-TYPE:"dl:todoList"',
            '-TYPE:"dl:issue"',
            '-TYPE:"dl:contact"',
            '-TYPE:"dl:eventAgenda"',
            '-TYPE:"dl:event"',
            '-TYPE:"dl:task"',
            '-TYPE:"dl:simpletask"',
            '-TYPE:"dl:meetingAgenda"',
            '-TYPE:"dl:location"',
            '-TYPE:"fm:topic"',
            '-TYPE:"fm:post"',
            '-TYPE:"ia:calendarEvent"',
            '-TYPE:"lnk:link"'
        ];

        return new Observable((observer) => {
            this.peopleApi.getPerson(personId)
                .then((person) => {
                        const username = person.entry.id;
                        const filterQueries = [
                            { query: `cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]` },
                            { query: `cm:modifier:'${username}' OR cm:creator:'${username}'` },
                            { query: defaultFilter.join(' AND ') }
                        ];

                        if (filters && filters.length > 0) {
                            filterQueries.push({
                                query: filters.join()
                            });
                        }

                        const query = new SearchRequest({
                            query: {
                                query: '*',
                                language: 'afts'
                            },
                            filterQueries,
                            include: ['path', 'properties', 'allowableOperations'],
                            sort: [{
                                type: 'FIELD',
                                field: 'cm:modified',
                                ascending: false
                            }],
                            paging: {
                                maxItems: pagination.maxItems,
                                skipCount: pagination.skipCount
                            }
                        });
                        return this.searchApi.search(query)
                            .then((searchResult) => {
                                    observer.next(searchResult);
                                    observer.complete();
                                },
                                (err) => {
                                    observer.error(err);
                                    observer.complete();
                                });
                    },
                    (err) => {
                        observer.error(err);
                        observer.complete();
                    });
        }).pipe(catchError((err) => this.handleError(err)));
    }

    /**
     * Gets favorite files for the current user.
     *
     * @param pagination Specifies how to paginate the results
     * @param includeFields List of data field names to include in the results
     * @param where A string to restrict the returned objects by using a predicate
     * @returns List of favorite files
     */
    loadFavorites(pagination: PaginationModel, includeFields: string[] = [], where?: string): Observable<NodePaging> {
        const includeFieldsRequest = this.getIncludesFields(includeFields);
        const defaultPredicate = '(EXISTS(target/file) OR EXISTS(target/folder))';

        const options = {
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount,
            where: where ? `${where} AND ${defaultPredicate}` : defaultPredicate,
            include: includeFieldsRequest
        };

        return new Observable((observer) => {
            this.favoritesApi.listFavorites('-me-', options)
                .then((result: FavoritePaging) => {
                        const page: FavoritePaging = {
                            list: {
                                entries: result.list.entries
                                    .map(({ entry }: any) => {
                                        const target = entry.target.file || entry.target.folder;
                                        target.properties = {
                                            ...(target.properties || {
                                                'cm:title': entry.title || target.title,
                                                'cm:description': entry.description || target.description
                                            }),
                                            ...(entry.properties || {})
                                        };

                                        return {
                                            entry: target
                                        };
                                    }),
                                pagination: result.list.pagination
                            }
                        };

                        observer.next(page);
                        observer.complete();
                    },
                    (err) => {
                        observer.error(err);
                        observer.complete();
                    });
        }).pipe(catchError((err) => this.handleError(err)));
    }

    /**
     * Gets sites that the current user is a member of.
     *
     * @param pagination Specifies how to paginate the results
     * @param where A string to restrict the returned objects by using a predicate
     * @returns List of sites
     */
    loadMemberSites(pagination: PaginationModel, where?: string): Observable<SiteMemberPaging> {
        const options = {
            include: ['properties'],
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount,
            where
        };

        return new Observable((observer) => {
            this.sitesApi.listSiteMembershipsForPerson('-me-', options)
                .then((result: SiteRolePaging) => {
                        const page: SiteMemberPaging = new SiteMemberPaging({
                            list: {
                                entries: result.list.entries
                                    .map(({ entry: { site } }: any) => {
                                        site.allowableOperations = site.allowableOperations ? site.allowableOperations : [CREATE_PERMISSION];
                                        site.name = site.name || site.title;
                                        return {
                                            entry: site
                                        };
                                    }),
                                pagination: result.list.pagination
                            }
                        });

                        observer.next(page);
                        observer.complete();
                    },
                    (err) => {
                        observer.error(err);
                        observer.complete();
                    });
        }).pipe(catchError((err) => this.handleError(err)));
    }

    /**
     * Gets all sites in the repository.
     *
     * @param pagination Specifies how to paginate the results
     * @param where A string to restrict the returned objects by using a predicate
     * @returns List of sites
     */
    loadSites(pagination: PaginationModel, where?: string): Observable<NodePaging> {
        const options = {
            include: ['properties', 'aspectNames'],
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount,
            where
        };

        return new Observable((observer) => {
            this.sitesApi
                .listSites(options)
                .then(
                    (page) => {
                        page.list.entries.map(
                            ({ entry }: any) => {
                                entry.name = entry.name || entry.title;
                                return { entry };
                            }
                        );
                        observer.next(page);
                        observer.complete();
                    },
                    (err) => {
                        observer.error(err);
                        observer.complete();
                    });
        }).pipe(catchError((err) => this.handleError(err)));
    }

    /**
     * Gets all items currently in the trash.
     *
     * @param pagination Specifies how to paginate the results
     * @param includeFields List of data field names to include in the results
     * @returns List of deleted items
     */
    loadTrashcan(pagination: PaginationModel, includeFields: string[] = []): Observable<DeletedNodesPaging> {
        const includeFieldsRequest = this.getIncludesFields(includeFields);

        const options = {
            include: includeFieldsRequest,
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount
        };

        return from(this.trashcanApi.listDeletedNodes(options))
            .pipe(catchError((err) => this.handleError(err)));

    }

    /**
     * Gets shared links for the current user.
     *
     * @param pagination Specifies how to paginate the results
     * @param includeFields List of data field names to include in the results
     * @param where A string to restrict the returned objects by using a predicate
     * @returns List of shared links
     */
    loadSharedLinks(pagination: PaginationModel, includeFields: string[] = [], where?: string): Observable<SharedLinkPaging> {
        const includeFieldsRequest = this.getIncludesFields(includeFields);

        const options = {
            include: includeFieldsRequest,
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount,
            where
        };

        return from(this.sharedLinksApi.listSharedLinks(options))
            .pipe(catchError((err) => this.handleError(err)));
    }

    /**
     * Is the folder ID one of the well-known aliases?
     *
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
     *
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
     *
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
     *
     * @param nodeId ID of the target folder node
     * @param pagination Specifies how to paginate the results
     * @returns List of node IDs
     */
    getCorrespondingNodeIds(nodeId: string, pagination: PaginationModel = {}): Observable<string[]> {
        if (this.isCustomSource(nodeId)) {

            return this.loadFolderByNodeId(nodeId, pagination)
                .pipe(map((result: any): string[] => result.list.entries.map((node: any): string => this.getIdFromEntry(node, nodeId))));

        } else if (nodeId) {
            // cases when nodeId is '-my-', '-root-' or '-shared-'
            return from(this.nodesApi.getNode(nodeId)
                .then((node) => [node.entry.id]));
        }

        return of([]);
    }

    /**
     * Chooses the correct ID for a node entry.
     *
     * @param node Node object
     * @param nodeId ID of the node object
     * @returns ID value
     */
    getIdFromEntry(node: any, nodeId: string): string {
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

    /**
     * Does the well-known alias have a corresponding node ID?
     *
     * @param nodeId Node to check
     * @returns True if the alias has a corresponding node ID, false otherwise
     */
    hasCorrespondingNodeIds(nodeId: string): boolean {
        return this.isCustomSource(nodeId) || this.isSupportedSource(nodeId);
    }

    private getIncludesFields(includeFields: string[]): string[] {
        return ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', ...includeFields]
            .filter((element, index, array) => index === array.indexOf(element));
    }

    private handleError(error: Response) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
