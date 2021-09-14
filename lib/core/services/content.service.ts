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

import { Inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
    DeletedNodesPaging,
    DeletedNodesPagingList,
    DiscoveryEntry,
    FavoriteBodyCreate,
    FavoriteEntry,
    FavoritePaging,
    FavoritePagingList,
    MinimalNode,
    Node,
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
    ResultSetPagingList,
    RevertBody,
    SearchRequest,
    SharedLinkEntry,
    SharedLinkPaging,
    SharedLinkPagingList,
    SiteBody,
    SiteEntry,
    SiteMemberPaging,
    SiteMemberPagingList,
    SitePaging,
    SitePagingList,
    VersionEntry,
    VersionPaging
} from '@alfresco/js-api';
import { Observable, Subject, throwError, forkJoin, from } from 'rxjs';
import { FolderCreatedEvent } from '../events/folder-created.event';
import { AuthenticationService } from './authentication.service';
import { LogService } from './log.service';
import { catchError, map } from 'rxjs/operators';
import { PermissionsEnum } from '../models/permissions.enum';
import { AllowableOperationsEnum } from '../models/allowable-operations.enum';
import { DownloadService } from './download.service';
import { ContentServiceProvider, CONTENT_SERVICES_PROVIDERS, DEFAULT_CONTENT_SERVICES_PROVIDER } from './content-provider.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { AcsContentService } from './acs-content.service';
import { PaginationModel } from '../models/pagination.model';
@Injectable({
    providedIn: 'root'
})
export class ContentService {

    private defaultProvider: ContentServiceProvider;

    folderCreated: Subject<FolderCreatedEvent> = new Subject<FolderCreatedEvent>();
    folderCreate: Subject<MinimalNode> = new Subject<MinimalNode>();
    folderEdit: Subject<MinimalNode> = new Subject<MinimalNode>();

    constructor(
        public authService: AuthenticationService,
        private logService: LogService,
        private sanitizer: DomSanitizer,
        private downloadService: DownloadService,
        private apiService: AlfrescoApiService,
        @Inject(CONTENT_SERVICES_PROVIDERS) private providers: ContentServiceProvider[] = [],
        @Inject(DEFAULT_CONTENT_SERVICES_PROVIDER) private defaultContentServiceProvider: ContentServiceProvider = null) {
        switch (providers.length) {
            case 0:
                this.defaultProvider = new AcsContentService(this.apiService);
                this.providers = [this.defaultProvider];
                break;
            case 1:
                this.defaultProvider = providers[0];
                break;
            default:
                this.defaultProvider = defaultContentServiceProvider ? this.defaultContentServiceProvider : providers[0];
                break;
        }
    }

    private getProviderFromId(id: string): ContentServiceProvider {
        if (this.providers.length > 1) {
            return this.providers.find(provider => id.startsWith(provider.getNodePrefix())) || this.defaultProvider;
        } else {
            return this.defaultProvider;
        }
    }

    /**
     * @deprecated in 3.2.0, use DownloadService instead.
     * Invokes content download for a Blob with a file name.
     * @param blob Content to download.
     * @param fileName Name of the resulting file.
     */
    downloadBlob(blob: Blob, fileName: string): void {
        this.downloadService.downloadBlob(blob, fileName);
    }

    /**
     * Creates a trusted object URL from the Blob.
     * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
     * @param  blob Data to wrap into object URL
     * @returns URL string
     */
    createTrustedUrl(blob: Blob): string {
        const url = window.URL.createObjectURL(blob);
        return <string> this.sanitizer.bypassSecurityTrustUrl(url);
    }

    /**
     * Checks if the user has permission on that node
     * @param node Node to check permissions
     * @param permission Required permission type
     * @param userId Optional current user id will be taken by default
     * @returns True if the user has the required permissions, false otherwise
     */
    hasPermissions(node: Node, permission: PermissionsEnum | string, userId?: string): boolean {
        let hasPermissions = false;
        userId = userId ?? this.authService.getEcmUsername();

        const permissions = [...(node.permissions?.locallySet || []), ...(node.permissions?.inherited || [])]
            .filter((currentPermission) => currentPermission.authorityId === userId);
        if (permissions.length) {
            if (permission && permission.startsWith('!')) {
                hasPermissions = !permissions.find((currentPermission) => currentPermission.name === permission.replace('!', ''));
            } else {
                hasPermissions = !!permissions.find((currentPermission) => currentPermission.name === permission);
            }

        } else {

            if (permission === PermissionsEnum.CONSUMER) {
                hasPermissions = true;
            } else if (permission === PermissionsEnum.NOT_CONSUMER) {
                hasPermissions = false;
            } else if (permission && permission.startsWith('!')) {
                hasPermissions = true;
            }
        }

        return hasPermissions;
    }

    /**
     * Checks if the user has permissions on that node
     * @param node Node to check allowableOperations
     * @param allowableOperation Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
     * @returns True if the user has the required permissions, false otherwise
     */
    hasAllowableOperations(node: Node, allowableOperation: AllowableOperationsEnum | string): boolean {
        let hasAllowableOperations = false;

        if (node && node.allowableOperations) {
            if (allowableOperation && allowableOperation.startsWith('!')) {
                hasAllowableOperations = !node.allowableOperations.find((currentOperation) => currentOperation === allowableOperation.replace('!', ''));
            } else {
                hasAllowableOperations = !!node.allowableOperations.find((currentOperation) => currentOperation === allowableOperation);
            }

        } else {
            if (allowableOperation && allowableOperation.startsWith('!')) {
                hasAllowableOperations = true;
            }
        }

        if (allowableOperation === AllowableOperationsEnum.COPY) {
            hasAllowableOperations = true;
        }

        if (allowableOperation === AllowableOperationsEnum.LOCK) {
            hasAllowableOperations = node.isFile;

            if (node.isLocked && node.allowableOperations) {
                hasAllowableOperations = !!~node.allowableOperations.indexOf('updatePermissions');
            }
        }

        return hasAllowableOperations;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

    getDocumentThumbnailUrl(nodeId: string, attachment?: boolean, ticket?: string): string {
        return this.getProviderFromId(nodeId).getDocumentThumbnailUrl(nodeId, attachment, ticket);
    }

    /**
     * Gets a content URL for the given node.
     * @param node Node or Node ID to get URL for.
     * @param attachment Toggles whether to retrieve content as an attachment for download
     * @param ticket Custom ticket to use for authentication
     * @returns URL string or `null`
     */
    getContentUrl(node: NodeEntry | string, attachment?: boolean, ticket?: string): string {
        if (node) {
            let nodeId: string;

            if (typeof node === 'string') {
                nodeId = node;
            } else if (node.entry) {
                nodeId = node.entry.id;
            }

            return this.getProviderFromId(nodeId).getContentUrl(nodeId, attachment, ticket);
        }

        return null;
    }

    getVersionContentUrl(nodeId: string, versionId: string, attachment?: boolean, ticket?: string): string {
        return this.getProviderFromId(nodeId).getVersionContentUrl(nodeId, versionId, attachment, ticket);
    }

    getSharedLinkContentUrl(linkId: string, attachment?: boolean): string {
        return this.getProviderFromId(linkId).getSharedLinkContentUrl(linkId, attachment);
    }

    getSharedLinkRenditionUrl(sharedId: string, renditionId: string, attachment?: boolean): string {
        return this.getProviderFromId(sharedId).getSharedLinkRenditionUrl(sharedId, renditionId, attachment);
    }

    getRenditionUrl(nodeId: string, encoding: string, attachment?: boolean, ticket?: string): string {
        return this.getProviderFromId(nodeId).getRenditionUrl(nodeId, encoding, attachment, ticket);
    }

    getVersionRenditionUrl(nodeId: string, versionId: string, encoding: string, attachment?: boolean, ticket?: string): string {
        return this.getProviderFromId(nodeId).getVersionRenditionUrl(nodeId, versionId, encoding, attachment, ticket);
    }

    /**
     * Gets content for the given node.
     * @param nodeId ID of the target node
     * @returns Content data
     */
    getNodeContent(nodeId: string): Observable<any> {
        return from(this.getProviderFromId(nodeId).getNodeContent(nodeId))
            .pipe(
                catchError((err: any) => this.handleError(err)));
    }

    /**
     * Gets a Node via its node ID.
     * @param nodeId ID of the target node
     * @param opts Options supported by JS-API
     * @returns Details of the folder
     */
    getNode(nodeId: string, opts?: any): Observable<NodeEntry> {
        return from(this.getProviderFromId(nodeId).getNode(nodeId, opts));
    }

    lockNode(nodeId: string, nodeBodyLock: NodeBodyLock, opts?: any): Promise<NodeEntry> {
        return this.getProviderFromId(nodeId).lockNode(nodeId, nodeBodyLock, opts);
    }

    unlockNode(nodeId: string, opts?: any): Promise<NodeEntry> {
        return this.getProviderFromId(nodeId).unlockNode(nodeId, opts);
    }

    deleteNode(nodeId: string, opts?: any): Promise<any> {
        return this.getProviderFromId(nodeId).deleteNode(nodeId, opts);
    }

    copyNode(nodeId: string, nodeBodyCopy: NodeBodyCopy, opts?: any): Promise<NodeEntry> {
        return this.getProviderFromId(nodeId).copyNode(nodeId, nodeBodyCopy, opts);
    }

    moveNode(nodeId: string, nodeBodyMove: NodeBodyMove, opts?: any): Promise<NodeEntry> {
        return this.getProviderFromId(nodeId).moveNode(nodeId, nodeBodyMove, opts);
    }

    listNodeChildren(nodeId: string, opts?: any): Promise<NodeChildAssociationPaging> {
        return this.getProviderFromId(nodeId).listNodeChildren(nodeId, opts);
    }

    createNode(nodeId: string, nodeBodyCreate: NodeBodyCreate, opts?: any, formParams?: any): Promise<NodeEntry | any> {
        return this.getProviderFromId(nodeId).createNode(nodeId, nodeBodyCreate, opts, formParams);
    }

    updateNode(nodeId: string, nodeBodyUpdate: NodeBodyUpdate, opts?: any): Promise<NodeEntry> {
        return this.getProviderFromId(nodeId).updateNode(nodeId, nodeBodyUpdate, opts);
    }

    updateNodeContent(nodeId: string, contentBodyUpdate: string, opts?: any): Promise<NodeEntry> {
        return this.getProviderFromId(nodeId).updateNodeContent(nodeId, contentBodyUpdate, opts);
    }

    revertVersion(nodeId: string, versionId: string, revertBody: RevertBody, opts?: any): Promise<VersionEntry> {
        return this.getProviderFromId(nodeId).revertVersion(nodeId, versionId, revertBody, opts);
    }

    deleteVersion(nodeId: string, versionId: string): Promise<any> {
        return this.getProviderFromId(nodeId).deleteVersion(nodeId, versionId);
    }

    listVersionHistory(nodeId: string, opts?: any): Promise<VersionPaging> {
        return this.getProviderFromId(nodeId).listVersionHistory(nodeId, opts);
    }

    getVersion(nodeId: string, versionId: string): Promise<VersionEntry> {
        return this.getProviderFromId(nodeId).getVersion(nodeId, versionId);
    }

    listVersionRenditions(nodeId: string, versionId: string, opts?: any): Promise<RenditionPaging> {
        return this.getProviderFromId(nodeId).listVersionRenditions(nodeId, versionId, opts);
    }

    createVersionRendition(nodeId: string, versionId: string, renditionBodyCreate: RenditionBodyCreate): Promise<any> {
        return this.getProviderFromId(nodeId).createVersionRendition(nodeId, versionId, renditionBodyCreate);
    }

    getVersionRendition(nodeId: string, versionId: string, renditionId: string): Promise<RenditionEntry> {
        return this.getProviderFromId(nodeId).getVersionRendition(nodeId, versionId, renditionId);
    }

    deleteDeletedNode(nodeId: string): Promise<any> {
        return this.getProviderFromId(nodeId).deleteDeletedNode(nodeId);
    }

    listDeletedNodes(opts?: any): Promise<DeletedNodesPaging> {
        const deletedNodes: Promise<DeletedNodesPaging>[] = [];
        this.providers.map(provider => deletedNodes.push(provider.listDeletedNodes(opts)));

        return Promise.all(deletedNodes).then(nodes => this.mergeDeletedNodesPaging(nodes));
    }

    restoreDeletedNode(nodeId: string, opts?: any): Promise<NodeEntry> {
        return this.getProviderFromId(nodeId).restoreDeletedNode(nodeId, opts);
    }

    getSharedLink(sharedId: string, opts?: any): Promise<SharedLinkEntry> {
        return this.getProviderFromId(sharedId).getSharedLink(sharedId, opts);
    }

    getSharedLinkRendition(sharedId: string, renditionId: string): Promise<RenditionEntry> {
        return this.getProviderFromId(sharedId).getSharedLinkRendition(sharedId, renditionId);
    }

    listSharedLinks(opts?: any): Promise<SharedLinkPaging> {
        const paging: Promise<SharedLinkPaging>[] = [];
        this.providers.map(provider => paging.push(provider.listSharedLinks(opts)));

        return Promise.all(paging).then(nodes => this.mergeSharedLinkPaging(nodes));
    }

    deleteSharedLink(sharedId: string): Promise<any> {
        return this.getProviderFromId(sharedId).deleteSharedLink(sharedId);
    }

    uploadFile(fileDefinition: any, relativePath: string, rootFolderId: string, nodeBody: any, opts?: any): Promise<any> {
        return this.getProviderFromId(rootFolderId).uploadFile(fileDefinition, relativePath, rootFolderId, nodeBody, opts);
    }

    listRenditions(nodeId: string, opts?: any): Promise<RenditionPaging> {
        return this.getProviderFromId(nodeId).listRenditions(nodeId, opts);
    }

    createRendition(nodeId: string, renditionBodyCreate: RenditionBodyCreate): Promise<any> {
        return this.getProviderFromId(nodeId).createRendition(nodeId, renditionBodyCreate);
    }

    getRendition(nodeId: string, renditionId: string): Promise<RenditionEntry> {
        return this.getProviderFromId(nodeId).getRendition(nodeId, renditionId);
    }

    getPerson(personId: string, opts?: any): Promise<PersonEntry> {
        return this.defaultProvider.getPerson(personId, opts);
    }

    getRepositoryInformation(): Promise<DiscoveryEntry> {
        return this.defaultProvider.getRepositoryInformation();
    }

    listFavorites(personId: string, opts?: any): Promise<FavoritePaging> {
        return this.defaultProvider.listFavorites(personId, opts);
    }

    createFavorite(personId: string, favoriteBodyCreate: FavoriteBodyCreate, opts?: any): Promise<FavoriteEntry> {
        return this.defaultProvider.createFavorite(personId, favoriteBodyCreate, opts);
    }

    deleteFavorite(personId: string, favoriteId: string): Promise<any> {
        return this.getProviderFromId(favoriteId).deleteFavorite(personId, favoriteId);
    }

    search(request: SearchRequest): Promise<ResultSetPaging> {
        const searchResultNodes: Promise<ResultSetPaging>[] = [];
        this.providers.map(provider => searchResultNodes.push(provider.search(request)));

        return Promise.all(searchResultNodes).then(nodes => this.mergeResultSetPaging(nodes));
    }

    deleteSite(siteId?: string, opts?: { permanent?: boolean }): Promise<any> {
        return this.getProviderFromId(siteId).deleteSite(siteId, opts);
    }

    leaveSite(siteId?: string, personId?: string): Promise<any> {
        return this.getProviderFromId(siteId).deleteSiteMembership(siteId, personId);
    }

    createSite(
        siteBody: SiteBody,
        opts?: {
            fields?: Array<string>;
            skipConfiguration?: boolean;
            skipAddToFavorites?: boolean;
        }
    ): Promise<SiteEntry> {
        return this.getProviderFromId(siteBody.id).createSite(siteBody, opts);
    }

    getSite(siteId?: string, opts?: { relations?: Array<string>; fields?: Array<string> }): Promise<SiteEntry> {
        return this.getProviderFromId(siteId).getSite(siteId, opts);
    }

    updateSite(siteId: string, siteBody: SiteBody): Promise<SiteEntry> {
        return this.getProviderFromId(siteId).updateSite(siteId, siteBody);
    }

    getRecentFiles(personId: string, pagination: PaginationModel, filters?: string[]): Observable<ResultSetPaging> {
        const resultSetPaging: Observable<ResultSetPaging>[] = [];
        this.providers.map(provider => resultSetPaging.push(provider.getRecentFiles(personId, pagination, filters)));

        return forkJoin(resultSetPaging).pipe(map(nodes => this.mergeResultSetPaging(nodes)));
    }

    loadFavorites(pagination: PaginationModel, includeFields: string[], where?: string): Observable<FavoritePaging> {
        const paging: Observable<FavoritePaging>[] = [];
        this.providers.map(provider => paging.push(provider.loadFavorites(pagination, includeFields, where)));

        return forkJoin(paging).pipe(map(nodes => this.mergeFavoritePaging(nodes)));
    }

    loadMemberSites(pagination: PaginationModel, where?: string): Observable<SiteMemberPaging> {
        const paging: Observable<SiteMemberPaging>[] = [];
        this.providers.map(provider => paging.push(provider.loadMemberSites(pagination, where)));

        return forkJoin(paging).pipe(map(nodes => this.mergeSiteMemberPaging(nodes)));
    }

    loadSites(pagination: PaginationModel, where?: string): Observable<SitePaging> {
        const paging: Observable<SitePaging>[] = [];
        this.providers.map(provider => paging.push(provider.loadSites(pagination, where)));

        return forkJoin(paging).pipe(map(nodes => this.mergeSitePaging(nodes)));
    }

    loadTrashcan(pagination: PaginationModel, includeFields: string[]): Observable<DeletedNodesPaging> {
        const paging: Observable<DeletedNodesPaging>[] = [];
        this.providers.map(provider => paging.push(provider.loadTrashcan(pagination, includeFields)));

        return forkJoin(paging).pipe(map(nodes => this.mergeDeletedNodesPaging(nodes)));
    }

    loadSharedLinks(pagination: PaginationModel, includeFields: string[], where?: string): Observable<SharedLinkPaging> {
        const paging: Observable<SharedLinkPaging>[] = [];
        this.providers.map(provider => paging.push(provider.loadSharedLinks(pagination, includeFields, where)));

        return forkJoin(paging).pipe(map(nodes => this.mergeSharedLinkPaging(nodes)));
    }

    private mergeDeletedNodesPaging(nodes: DeletedNodesPaging[]): DeletedNodesPaging {
        const result = new DeletedNodesPaging();
        result.list = new DeletedNodesPagingList();
        result.list.pagination = nodes[0].list.pagination;
        result.list.entries = [];
        nodes.map(node => result.list.entries = result.list.entries.concat(node.list.entries));
        return result;
    }

    private mergeResultSetPaging(nodes: ResultSetPaging[]): ResultSetPaging {
        const result = new ResultSetPaging();
        result.list = new ResultSetPagingList();
        result.list.pagination = nodes[0].list.pagination;
        result.list.entries = [];
        nodes.map(node => result.list.entries = result.list.entries.concat(node.list.entries));
        return result;
    }

    private mergeFavoritePaging(nodes: FavoritePaging[]): FavoritePaging {
        const result = new FavoritePaging();
        result.list = new FavoritePagingList();
        result.list.pagination = nodes[0].list.pagination;
        result.list.entries = [];
        nodes.map(node => result.list.entries = result.list.entries.concat(node.list.entries));
        return result;
    }

    private mergeSiteMemberPaging(nodes: SiteMemberPaging[]): SiteMemberPaging {
        const result = new SiteMemberPaging();
        result.list = new SiteMemberPagingList();
        result.list.pagination = nodes[0].list.pagination;
        result.list.entries = [];
        nodes.map(node => result.list.entries = result.list.entries.concat(node.list.entries));
        return result;
    }

    private mergeSitePaging(nodes: SitePaging[]): SitePaging {
        const result = new SitePaging();
        result.list = new SitePagingList();
        result.list.pagination = nodes[0].list.pagination;
        result.list.entries = [];
        nodes.map(node => result.list.entries = result.list.entries.concat(node.list.entries));
        return result;
    }

    private mergeSharedLinkPaging(nodes: SharedLinkPaging[]): SharedLinkPaging {
        const result = new SharedLinkPaging();
        result.list = new SharedLinkPagingList();
        result.list.pagination = nodes[0].list.pagination;
        result.list.entries = [];
        nodes.map(node => result.list.entries = result.list.entries.concat(node.list.entries));
        return result;
    }
}
