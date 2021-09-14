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

import {
    DeletedNodesPaging,
    DiscoveryEntry,
    FavoriteBodyCreate,
    FavoriteEntry,
    FavoritePaging,
    NodeBodyCopy,
    NodeBodyCreate,
    NodeBodyLock,
    NodeBodyMove,
    NodeBodyUpdate,
    NodeChildAssociationPaging,
    NodeEntry,
    PersonEntry,
    RenditionBodyCreate,
    RenditionEntry,
    RenditionPaging,
    ResultSetPaging,
    RevertBody,
    SearchRequest,
    SharedLinkEntry,
    SharedLinkPaging,
    SiteBody,
    SiteEntry,
    SiteMemberPaging,
    SitePaging,
    VersionEntry,
    VersionPaging
} from '@alfresco/js-api';
import { InjectionToken, Provider, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationModel } from '../models/pagination.model';

export const CONTENT_SERVICES_PROVIDERS = new InjectionToken<ContentServiceProvider[]>('content-services-providers');

export const DEFAULT_CONTENT_SERVICES_PROVIDER = new InjectionToken<ContentServiceProvider>('default-content-services-provider');

export function registerContentServiceProvider(implementationClass: Type<ContentServiceProvider>, defaultProvider: boolean): Provider[] {
    const providers = [{
        provide: CONTENT_SERVICES_PROVIDERS,
        multi: true,
        useExisting: implementationClass
    }];

    if (defaultProvider) {
        providers.push({
            provide: DEFAULT_CONTENT_SERVICES_PROVIDER,
            multi: false,
            useExisting: implementationClass
        });
    }

    return providers;
}

export interface ContentServiceProvider {

    getNodePrefix();

    getContentUrl(node: NodeEntry | string, attachment?: boolean, ticket?: string);

    getDocumentThumbnailUrl(nodeId: string, attachment?: boolean, ticket?: string);

    getVersionContentUrl(nodeId: string, versionId: string, attachment?: boolean, ticket?: string);

    getSharedLinkContentUrl(linkId: string, attachment?: boolean);

    getSharedLinkRenditionUrl(sharedId: string, renditionId: string, attachment?: boolean);

    getRenditionUrl(nodeId: string, encoding: string, attachment?: boolean, ticket?: string);

    getVersionRenditionUrl(nodeId: string, versionId: string, encoding: string, attachment?: boolean, ticket?: string): string;

    getNodeContent(nodeId: string): Promise<any>;

    getNode(nodeId: string, opts?: any): Promise<NodeEntry>;

    lockNode(nodeId: string, nodeBodyLock: NodeBodyLock, opts?: any): Promise<NodeEntry>;

    unlockNode(nodeId: string, opts?: any): Promise<NodeEntry>;

    deleteNode(nodeId: string, opts?: any): Promise<any>;

    copyNode(nodeId: string, nodeBodyCopy: NodeBodyCopy, opts?: any): Promise<NodeEntry>;

    moveNode(nodeId: string, nodeBodyMove: NodeBodyMove, opts?: any): Promise<NodeEntry>;

    listNodeChildren(nodeId: string, opts?: any): Promise<NodeChildAssociationPaging>;

    createNode(nodeId: string, nodeBodyCreate: NodeBodyCreate, opts?: any, formParams?: any): Promise<NodeEntry | any>;

    updateNode(nodeId: string, nodeBodyUpdate: NodeBodyUpdate, opts?: any): Promise<NodeEntry>;

    updateNodeContent(nodeId: string, contentBodyUpdate: string, opts?: any): Promise<NodeEntry>;

    revertVersion(nodeId: string, versionId: string, revertBody: RevertBody, opts?: any): Promise<VersionEntry>;

    deleteVersion(nodeId: string, versionId: string): Promise<any>;

    listVersionHistory(nodeId: string, opts?: any): Promise<VersionPaging>;

    getVersion(nodeId: string, versionId: string): Promise<VersionEntry>;

    listVersionRenditions(nodeId: string, versionId: string, opts?: any): Promise<RenditionPaging>;

    createVersionRendition(nodeId: string, versionId: string, renditionBodyCreate: RenditionBodyCreate): Promise<any>;

    getVersionRendition(nodeId: string, versionId: string, renditionId: string): Promise<RenditionEntry>;

    getNodeVersions(nodeId: string, opts?: any);

    deleteDeletedNode(nodeId: string): Promise<any>;

    listDeletedNodes(opts?: any): Promise<DeletedNodesPaging>;

    restoreDeletedNode(nodeId: string, opts?: any): Promise<NodeEntry>;

    getSharedLink(sharedId: string, opts?: any): Promise<SharedLinkEntry>;

    getSharedLinkRendition(sharedId: string, renditionId: string): Promise<RenditionEntry>;

    listSharedLinks(opts?: any): Promise<SharedLinkPaging>;

    deleteSharedLink(sharedId: string): Promise<any>;

    uploadFile(fileDefinition: any, relativePath: string, rootFolderId: string, nodeBody: any, opts?: any): Promise<any>;

    listRenditions(nodeId: string, opts?: any): Promise<RenditionPaging>;

    createRendition(nodeId: string, renditionBodyCreate: RenditionBodyCreate): Promise<any>;

    getRendition(nodeId: string, renditionId: string): Promise<RenditionEntry>;

    getPerson(personId: string, opts?: any): Promise<PersonEntry>;

    getRepositoryInformation(): Promise<DiscoveryEntry>;

    listFavorites(personId: string, opts?: any): Promise<FavoritePaging>;

    createFavorite(personId: string, favoriteBodyCreate: FavoriteBodyCreate, opts?: any): Promise<FavoriteEntry>;

    deleteFavorite(personId: string, favoriteId: string): Promise<any>;

    search(request: SearchRequest): Promise<ResultSetPaging>;

    deleteSite(siteId?: string, opts?: { permanent?: boolean }): Promise<any>;

    deleteSiteMembership(siteId: string, personId: string): Promise<any>;

    createSite(
        siteBody: SiteBody,
        opts?: {
            fields?: Array<string>;
            skipConfiguration?: boolean;
            skipAddToFavorites?: boolean;
        }
    ): Promise<SiteEntry>;

    getSite(siteId?: string, opts?: { relations?: Array<string>; fields?: Array<string> }): Promise<SiteEntry>;

    updateSite(siteId: string, siteBody: SiteBody): Promise<SiteEntry>;

    getRecentFiles(personId: string, pagination: PaginationModel, filters?: string[]): Observable<ResultSetPaging>;

    loadFavorites(pagination: PaginationModel, includeFields: string[], where?: string): Observable<FavoritePaging> ;

    loadMemberSites(pagination: PaginationModel, where?: string): Observable<SiteMemberPaging>;

    loadSites(pagination: PaginationModel, where?: string): Observable<SitePaging>;

    loadTrashcan(pagination: PaginationModel, includeFields: string[]): Observable<DeletedNodesPaging>;

    loadSharedLinks(pagination: PaginationModel, includeFields: string[], where?: string): Observable<SharedLinkPaging>;
}
