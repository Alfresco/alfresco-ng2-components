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

import { Injectable } from '@angular/core';
import {
    ContentApi,
    DeletedNodesPaging,
    DiscoveryApi,
    DiscoveryEntry,
    FavoriteBodyCreate,
    FavoriteEntry,
    FavoritePaging,
    FavoritesApi,
    NodeBodyCopy,
    NodeBodyCreate,
    NodeBodyLock,
    NodeBodyMove,
    NodeBodyUpdate,
    NodeChildAssociationPaging,
    NodeEntry,
    NodesApi,
    PeopleApi,
    PersonEntry,
    RenditionBodyCreate,
    RenditionEntry,
    RenditionPaging,
    RenditionsApi,
    ResultSetPaging,
    RevertBody,
    SearchApi,
    SearchRequest,
    SharedLinkEntry,
    SharedLinkPaging,
    SharedlinksApi,
    SiteBody,
    SiteEntry,
    SiteMemberPaging,
    SitePaging,
    SiteRolePaging,
    SitesApi,
    TrashcanApi,
    UploadApi,
    VersionEntry,
    VersionPaging,
    VersionsApi
} from '@alfresco/js-api';
import { Observable, from } from 'rxjs';
import { AlfrescoApiService } from './alfresco-api.service';
import { ContentServiceProvider } from './content-provider.service';
import { PaginationModel } from '../models/pagination.model';

@Injectable({
    providedIn: 'root'
})
export class AcsContentService implements ContentServiceProvider {

    private CREATE_PERMISSION = 'create';

    _contentApi: ContentApi;
    get contentApi(): ContentApi {
        this._contentApi = this._contentApi ?? new ContentApi(this.apiService.getInstance());
        return this._contentApi;
    }

    _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.apiService.getInstance());
        return this._nodesApi;
    }

    _versionsApi: VersionsApi;
    get versionsApi(): VersionsApi {
        this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
        return this._versionsApi;
    }

    _trashcanApi: TrashcanApi;
    get trashcanApi(): TrashcanApi {
        this._trashcanApi = this._trashcanApi ?? new TrashcanApi(this.apiService.getInstance());
        return this._trashcanApi;
    }

    _sharedLinksApi: SharedlinksApi;
    get sharedLinksApi(): SharedlinksApi {
        this._sharedLinksApi = this._sharedLinksApi ?? new SharedlinksApi(this.apiService.getInstance());
        return this._sharedLinksApi;
    }

    _uploadApi: UploadApi;
    get uploadApi(): UploadApi {
        this._uploadApi = this._uploadApi ?? new UploadApi(this.apiService.getInstance());
        return this._uploadApi;
    }

    _renditionsApi: RenditionsApi;
    get renditionsApi(): RenditionsApi {
        this._renditionsApi = this._renditionsApi ?? new RenditionsApi(this.apiService.getInstance());
        return this._renditionsApi;
    }

    _peopleApi: PeopleApi;
    get peopleApi(): PeopleApi {
        this._peopleApi = this._peopleApi ?? new PeopleApi(this.apiService.getInstance());
        return this._peopleApi;
    }

    _sitesApi: SitesApi;
    get sitesApi(): SitesApi {
        this._sitesApi = this._sitesApi ?? new SitesApi(this.apiService.getInstance());
        return this._sitesApi;
    }

    _searchApi: SearchApi;
    get searchApi(): SearchApi {
        this._searchApi = this._searchApi ?? new SearchApi(this.apiService.getInstance());
        return this._searchApi;
    }

    _favoritesApi: FavoritesApi;
    get favoritesApi(): FavoritesApi {
        this._favoritesApi = this._favoritesApi ?? new FavoritesApi(this.apiService.getInstance());
        return this._favoritesApi;
    }

    _discoveryApi: DiscoveryApi;
    get discoveryApi(): DiscoveryApi {
        this._discoveryApi = this._discoveryApi ?? new DiscoveryApi(this.apiService.getInstance());
        return this._discoveryApi;
    }

    constructor(public apiService: AlfrescoApiService) {
    }

    getNodePrefix() {
        return 'alfresco://';
    }

    getContentUrl(node: NodeEntry | string, attachment?: boolean, ticket?: string): string {
        if (node) {
            let nodeId: string;

            if (typeof node === 'string') {
                nodeId = node;
            } else if (node.entry) {
                nodeId = node.entry.id;
            }

            return this.contentApi.getContentUrl(nodeId, attachment, ticket);
        }

        return null;
    }

    getDocumentThumbnailUrl(nodeId: string, attachment?: boolean, ticket?: string): string {
        return this.contentApi.getDocumentThumbnailUrl(nodeId, attachment, ticket);
    }

    getVersionContentUrl(nodeId: string, versionId: string, attachment?: boolean, ticket?: string): string {
        return this.contentApi.getVersionContentUrl(nodeId, versionId, attachment, ticket);
    }

    getSharedLinkContentUrl(linkId: string, attachment?: boolean): string {
        return this.contentApi.getSharedLinkContentUrl(linkId, attachment);
    }

    getSharedLinkRenditionUrl(sharedId: string, renditionId: string, attachment?: boolean): string {
        return this.contentApi.getSharedLinkRenditionUrl(sharedId, renditionId, attachment);
    }

    getRenditionUrl(nodeId: string, encoding: string, attachment?: boolean, ticket?: string): string {
        return this.contentApi.getRenditionUrl(nodeId, encoding, attachment, ticket);
    }

    getVersionRenditionUrl(nodeId: string, versionId: string, encoding: string, attachment?: boolean, ticket?: string): string {
        return this.contentApi.getVersionRenditionUrl(nodeId, versionId, encoding, attachment, ticket);
    }

    getNodeContent(nodeId: string): Promise<any> {
        return this.nodesApi.getNodeContent(nodeId);
    }

    getNode(nodeId: string, opts?: any): Promise<NodeEntry> {
        return this.nodesApi.getNode(nodeId, opts);
    }

    lockNode(nodeId: string, nodeBodyLock: NodeBodyLock, opts?: any): Promise<NodeEntry> {
        return this.nodesApi.lockNode(nodeId, nodeBodyLock, opts);
    }

    unlockNode(nodeId: string, opts?: any): Promise<NodeEntry> {
        return this.nodesApi.unlockNode(nodeId, opts);
    }

    deleteNode(nodeId: string, opts?: any): Promise<any> {
        return this.nodesApi.deleteNode(nodeId, opts);
    }

    copyNode(nodeId: string, nodeBodyCopy: NodeBodyCopy, opts?: any): Promise<NodeEntry> {
        return this.nodesApi.copyNode(nodeId, nodeBodyCopy, opts);
    }

    moveNode(nodeId: string, nodeBodyMove: NodeBodyMove, opts?: any): Promise<NodeEntry> {
        return this.nodesApi.moveNode(nodeId, nodeBodyMove, opts);
    }

    listNodeChildren(nodeId: string, opts?: any): Promise<NodeChildAssociationPaging> {
        return this.nodesApi.listNodeChildren(nodeId, opts);
    }

    createNode(nodeId: string, nodeBodyCreate: NodeBodyCreate, opts?: any, formParams?: any): Promise<NodeEntry | any> {
        return this.nodesApi.createNode(nodeId, nodeBodyCreate, opts, formParams);
    }

    updateNode(nodeId: string, nodeBodyUpdate: NodeBodyUpdate, opts?: any): Promise<NodeEntry> {
        return this.nodesApi.updateNode(nodeId, nodeBodyUpdate, opts);
    }

    updateNodeContent(nodeId: string, contentBodyUpdate: string, opts?: any): Promise<NodeEntry> {
        return this.nodesApi.updateNodeContent(nodeId, contentBodyUpdate, opts);
    }

    revertVersion(nodeId: string, versionId: string, revertBody: RevertBody, opts?: any): Promise<VersionEntry> {
        return this.versionsApi.revertVersion(nodeId, versionId, revertBody, opts);
    }

    deleteVersion(nodeId: string, versionId: string): Promise<any> {
        return this.versionsApi.deleteVersion(nodeId, versionId);
    }

    listVersionHistory(nodeId: string, opts?: any): Promise<VersionPaging> {
        return this.versionsApi.listVersionHistory(nodeId, opts);
    }

    getVersion(nodeId: string, versionId: string): Promise<VersionEntry> {
        return this.versionsApi.getVersion(nodeId, versionId);
    }

    listVersionRenditions(nodeId: string, versionId: string, opts?: any): Promise<RenditionPaging> {
        return this.versionsApi.listVersionRenditions(nodeId, versionId, opts);
    }

    createVersionRendition(nodeId: string, versionId: string, renditionBodyCreate: RenditionBodyCreate): Promise<any> {
        return this.versionsApi.createVersionRendition(nodeId, versionId, renditionBodyCreate);
    }

    getVersionRendition(nodeId: string, versionId: string, renditionId: string): Promise<RenditionEntry> {
        return this.versionsApi.getVersionRendition(nodeId, versionId, renditionId);
    }

    getNodeVersions(nodeId: string, opts?: any) {
        return from(this.versionsApi.listVersionHistory(nodeId, opts));
    }

    deleteDeletedNode(nodeId: string): Promise<any> {
        return this.trashcanApi.deleteDeletedNode(nodeId);
    }

    listDeletedNodes(opts?: any): Promise<DeletedNodesPaging> {
        return this.trashcanApi.listDeletedNodes(opts);
    }

    restoreDeletedNode(nodeId: string, opts?: any): Promise<NodeEntry> {
        return this.trashcanApi.restoreDeletedNode(nodeId, opts);
    }

    getSharedLink(sharedId: string, opts?: any): Promise<SharedLinkEntry> {
        return this.sharedLinksApi.getSharedLink(sharedId, opts);
    }

    getSharedLinkRendition(sharedId: string, renditionId: string): Promise<RenditionEntry> {
        return this.sharedLinksApi.getSharedLinkRendition(sharedId, renditionId);
    }

    listSharedLinks(opts?: any): Promise<SharedLinkPaging> {
        return this.sharedLinksApi.listSharedLinks(opts);
    }

    deleteSharedLink(sharedId: string): Promise<any> {
        return this.sharedLinksApi.deleteSharedLink(sharedId);
    }

    uploadFile(fileDefinition: any, relativePath: string, rootFolderId: string, nodeBody: any, opts?: any): Promise<any> {
        return this.uploadApi.uploadFile(fileDefinition, relativePath, rootFolderId, nodeBody, opts);
    }

    listRenditions(nodeId: string, opts?: any): Promise<RenditionPaging> {
        return this.renditionsApi.listRenditions(nodeId, opts);
    }

    createRendition(nodeId: string, renditionBodyCreate: RenditionBodyCreate): Promise<any> {
        return this.renditionsApi.createRendition(nodeId, renditionBodyCreate);
    }

    getRendition(nodeId: string, renditionId: string): Promise<RenditionEntry> {
        return this.renditionsApi.getRendition(nodeId, renditionId);
    }

    getPerson(personId: string, opts?: any): Promise<PersonEntry> {
        return this.peopleApi.getPerson(personId, opts);
    }

    getRepositoryInformation(): Promise<DiscoveryEntry> {
        return this.discoveryApi.getRepositoryInformation();
    }

    listFavorites(personId: string, opts?: any): Promise<FavoritePaging> {
        return this.favoritesApi.listFavorites(personId, opts);
    }

    createFavorite(personId: string, favoriteBodyCreate: FavoriteBodyCreate, opts?: any): Promise<FavoriteEntry> {
        return this.favoritesApi.createFavorite(personId, favoriteBodyCreate, opts);
    }

    deleteFavorite(personId: string, favoriteId: string): Promise<any> {
        return this.favoritesApi.deleteFavorite(personId, favoriteId);
    }

    search(request: SearchRequest): Promise<ResultSetPaging> {
        return this.searchApi.search(request);
    }

    deleteSite(siteId?: string, opts?: { permanent?: boolean }): Promise<any> {
        return this.sitesApi.deleteSite(siteId, opts);
    }

    deleteSiteMembership(siteId: string, personId: string): Promise<any> {
        return this.sitesApi.deleteSiteMembership(siteId, personId);
    }

    createSite(
        siteBody: SiteBody,
        opts?: {
            fields?: Array<string>;
            skipConfiguration?: boolean;
            skipAddToFavorites?: boolean;
        }
    ): Promise<SiteEntry> {
        return this.sitesApi.createSite(siteBody, opts);
    }

    getSite(siteId?: string, opts?: { relations?: Array<string>; fields?: Array<string> }): Promise<SiteEntry> {
        return this.sitesApi.getSite(siteId, opts);
    }

    updateSite(siteId: string, siteBody: SiteBody): Promise<SiteEntry> {
        return this.sitesApi.updateSite(siteId, siteBody);
    }

    getRecentFiles(personId: string, pagination: PaginationModel, filters?: string[]): Observable<ResultSetPaging> {
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
                            { query: `cm:modifier:${username} OR cm:creator:${username}` },
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
        });
    }

    loadFavorites(pagination: PaginationModel, includeFields: string[] = [], where?: string): Observable<FavoritePaging> {
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
        });
    }

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
                                        site.allowableOperations = site.allowableOperations ? site.allowableOperations : [this.CREATE_PERMISSION];
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
        });
    }

    loadSites(pagination: PaginationModel, where?: string): Observable<SitePaging> {
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
        });
    }

    loadTrashcan(pagination: PaginationModel, includeFields: string[] = []): Observable<DeletedNodesPaging> {
        const includeFieldsRequest = this.getIncludesFields(includeFields);

        const options = {
            include: includeFieldsRequest,
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount
        };

        return from(this.trashcanApi.listDeletedNodes(options));

    }

    loadSharedLinks(pagination: PaginationModel, includeFields: string[] = [], where?: string): Observable<SharedLinkPaging> {
        const includeFieldsRequest = this.getIncludesFields(includeFields);

        const options = {
            include: includeFieldsRequest,
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount,
            where
        };

        return from(this.sharedLinksApi.listSharedLinks(options));
    }

    private getIncludesFields(includeFields: string[]): string[] {
        return ['path', 'properties', 'allowableOperations', 'permissions', 'aspectNames', ...includeFields]
            .filter((element, index, array) => index === array.indexOf(element));
    }
}
