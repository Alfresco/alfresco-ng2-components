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

import {
    DataCellEvent,
    DataColumn,
    DataRowActionEvent,
    DataSorting,
    DataTableComponent,
    ObjectDataColumn,
    PaginatedComponent,
    PaginationQueryParams
} from '@alfresco/adf-core';
import { AlfrescoApiService, AppConfigService, DataColumnListComponent, UserPreferencesService } from '@alfresco/adf-core';
import {
    AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, NgZone,
    OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import {
    DeletedNodesPaging,
    MinimalNodeEntity,
    MinimalNodeEntryEntity,
    NodePaging,
    PersonEntry,
    SitePaging,
    Pagination
} from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { presetsDefaultModel } from '../models/preset.model';
import { ShareDataRow } from './../data/share-data-row.model';
import { ShareDataTableAdapter } from './../data/share-datatable-adapter';

import { ContentActionModel } from './../models/content-action.model';
import { PermissionStyleModel } from './../models/permissions-style.model';
import { DocumentListService } from './../services/document-list.service';
import { NodeEntityEvent, NodeEntryEvent } from './node.event';

export enum PaginationStrategy {
    Finite,
    Infinite
}

@Component({
    selector: 'adf-document-list',
    styleUrls: ['./document-list.component.scss'],
    templateUrl: './document-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DocumentListComponent implements OnInit, OnChanges, AfterContentInit, PaginatedComponent {

    static SINGLE_CLICK_NAVIGATION: string = 'click';
    static DOUBLE_CLICK_NAVIGATION: string = 'dblclick';
    static DEFAULT_PAGE_SIZE: number = 20;

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @Input()
    permissionsStyle: PermissionStyleModel[] = [];

    @Input()
    locationFormat: string = '/';

    @Input()
    navigate: boolean = true;

    @Input()
    navigationMode: string = DocumentListComponent.DOUBLE_CLICK_NAVIGATION; // click|dblclick

    @Input()
    thumbnails: boolean = false;

    @Input()
    selectionMode: string = 'single'; // null|single|multiple

    @Input()
    multiselect: boolean = false;

    @Input()
    contentActions: boolean = false;

    @Input()
    contentActionsPosition: string = 'right'; // left|right

    @Input()
    contextMenuActions: boolean = false;

    @Input()
    emptyFolderImageUrl: string = './assets/images/empty_doc_lib.svg';

    @Input()
    allowDropFiles: boolean = false;

    @Input()
    sorting: string[];

    @Input()
    rowStyle: string;

    @Input()
    rowStyleClass: string;

    @Input()
    loading: boolean = false;

    @Input()
    rowFilter: any | null = null;

    @Input()
    imageResolver: any | null = null;

    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    @Input()
    currentFolderId: string = null;

    @Input()
    folderNode: MinimalNodeEntryEntity = null;

    @Input()
    node: NodePaging = null;

    @Input()
    maxItems: number;

    @Input()
    skipCount: number = 0;

    @Input()
    enableInfiniteScrolling: boolean = false;

    @Output()
    nodeClick: EventEmitter<NodeEntityEvent> = new EventEmitter<NodeEntityEvent>();

    @Output()
    nodeDblClick: EventEmitter<NodeEntityEvent> = new EventEmitter<NodeEntityEvent>();

    @Output()
    folderChange: EventEmitter<NodeEntryEvent> = new EventEmitter<NodeEntryEvent>();

    @Output()
    preview: EventEmitter<NodeEntityEvent> = new EventEmitter<NodeEntityEvent>();

    @Output()
    ready: EventEmitter<NodePaging> = new EventEmitter();

    @Output()
    error: EventEmitter<any> = new EventEmitter();

    @ViewChild(DataTableComponent)
    dataTable: DataTableComponent;

    errorMessage;
    actions: ContentActionModel[] = [];
    emptyFolderTemplate: TemplateRef<any>;
    noPermissionTemplate: TemplateRef<any>;
    contextActionHandler: Subject<any> = new Subject();
    data: ShareDataTableAdapter;
    infiniteLoading: boolean = false;
    noPermission: boolean = false;
    selection = new Array<MinimalNodeEntity>();
    pagination = new Subject<Pagination>();

    private layoutPresets = {};
    private currentNodeAllowableOperations: string[] = [];
    private CREATE_PERMISSION = 'create';

    constructor(private documentListService: DocumentListService,
                private ngZone: NgZone,
                private elementRef: ElementRef,
                private apiService: AlfrescoApiService,
                private appConfig: AppConfigService,
                private preferences: UserPreferencesService) {
        this.maxItems = this.preferences.paginationSize;

        this.pagination.next(<Pagination> {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            totalItems: 0,
            hasMoreItems: false
        });
    }

    getContextActions(node: MinimalNodeEntity) {
        if (node && node.entry) {
            let actions = this.getNodeActions(node);
            if (actions && actions.length > 0) {
                return actions.map((currentAction: ContentActionModel) => {
                    return {
                        model: currentAction,
                        node: node,
                        subject: this.contextActionHandler
                    };
                });
            }
        }
        return null;
    }

    contextActionCallback(action) {
        if (action) {
            this.executeContentAction(action.node, action.model);
        }
    }

    get hasCustomLayout(): boolean {
        return this.columnList && this.columnList.columns && this.columnList.columns.length > 0;
    }

    ngOnInit() {
        this.loadLayoutPresets();
        this.data = new ShareDataTableAdapter(this.documentListService, null, this.getDefaultSorting());
        this.data.thumbnails = this.thumbnails;
        this.data.permissionsStyle = this.permissionsStyle;

        if (this.rowFilter) {
            this.data.setFilter(this.rowFilter);
        }

        if (this.imageResolver) {
            this.data.setImageResolver(this.imageResolver);
        }

        this.contextActionHandler.subscribe(val => this.contextActionCallback(val));

        this.enforceSingleClickNavigationForMobile();
    }

    ngAfterContentInit() {
        let schema: DataColumn[] = [];

        if (this.hasCustomLayout) {
            schema = this.columnList.columns.map(c => <DataColumn> c);
        }

        if (!this.data) {
            this.data = new ShareDataTableAdapter(this.documentListService, schema, this.getDefaultSorting());
        } else if (schema && schema.length > 0) {
            this.data.setColumns(schema);
        }

        let columns = this.data.getColumns();
        if (!columns || columns.length === 0) {
            this.setupDefaultColumns(this.currentFolderId);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isSkipCountChanged(changes) ||
            this.isMaxItemsChanged(changes)) {
            this.reload(this.enableInfiniteScrolling);
        }
        if (changes.folderNode && changes.folderNode.currentValue) {
            this.loadFolder();
        } else if (changes.currentFolderId && changes.currentFolderId.currentValue) {
            if (changes.currentFolderId.previousValue !== changes.currentFolderId.currentValue) {
                this.folderNode = null;
            }
            if (!this.hasCustomLayout) {
                this.setupDefaultColumns(changes.currentFolderId.currentValue);
            }
            this.loadFolderByNodeId(changes.currentFolderId.currentValue);
        } else if (this.data) {
            if (changes.node && changes.node.currentValue) {
                this.resetSelection();
                this.data.loadPage(changes.node.currentValue);
            } else if (changes.rowFilter) {
                this.data.setFilter(changes.rowFilter.currentValue);
                if (this.currentFolderId) {
                    this.loadFolderNodesByFolderNodeId(this.currentFolderId, this.maxItems, this.skipCount);
                }
            } else if (changes.imageResolver) {
                this.data.setImageResolver(changes.imageResolver.currentValue);
            }
        }
    }

    reload(merge: boolean = false) {
        this.ngZone.run(() => {
            this.resetSelection();

            if (this.folderNode) {
                this.loadFolder(merge);
            } else if (this.currentFolderId) {
                this.loadFolderByNodeId(this.currentFolderId, merge);
            } else if (this.node) {
                this.data.loadPage(this.node);
                this.onDataReady(this.node);
            }
        });
    }

    isEmptyTemplateDefined(): boolean {
        if (this.dataTable) {
            if (this.emptyFolderTemplate) {
                return true;
            }
        }
        return false;
    }

    isNoPermissionTemplateDefined(): boolean {
        if (this.dataTable) {
            if (this.noPermissionTemplate) {
                return true;
            }
        }
        return false;
    }

    isMobile(): boolean {
        return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    isEmpty() {
        return !this.data || this.data.getRows().length === 0;
    }

    getNodeActions(node: MinimalNodeEntity | any): ContentActionModel[] {
        let target = null;

        if (node && node.entry) {
            if (node.entry.isFile) {
                target = 'document';
            }

            if (node.entry.isFolder) {
                target = 'folder';
            }

            if (target) {
                let ltarget = target.toLowerCase();
                let actionsByTarget = this.actions.filter(entry => {
                    return entry.target.toLowerCase() === ltarget;
                }).map(action => new ContentActionModel(action));

                actionsByTarget.forEach((action) => {
                    this.checkPermission(node, action);
                });

                return actionsByTarget;
            }
        }

        return [];
    }

    checkPermission(node: any, action: ContentActionModel): ContentActionModel {
        if (action.permission) {
            if (this.hasPermissions(node)) {
                let permissions = node.entry.allowableOperations;
                let findPermission = permissions.find(permission => permission === action.permission);
                if (!findPermission && action.disableWithNoPermission === true) {
                    action.disabled = true;
                }
            }
        }
        return action;
    }

    private hasPermissions(node: any): boolean {
        return node.entry.allowableOperations ? true : false;
    }

    @HostListener('contextmenu', ['$event'])
    onShowContextMenu(e?: Event) {
        if (e && this.contextMenuActions) {
            e.preventDefault();
        }
    }

    performNavigation(node: MinimalNodeEntity): boolean {
        if (this.canNavigateFolder(node)) {
            this.updateFolderData(node);
            return true;
        }
        return false;
    }

    performCustomSourceNavigation(node: MinimalNodeEntity): boolean {
        if (this.isCustomSource(this.currentFolderId)) {
            this.updateFolderData(node);
            return true;
        }
        return false;
    }

    updateFolderData(node: MinimalNodeEntity): void {
        this.currentFolderId = node.entry.id;
        this.folderNode = node.entry;
        this.skipCount = 0;
        this.currentNodeAllowableOperations = node.entry['allowableOperations'] ? node.entry['allowableOperations'] : [];
        this.loadFolder();
        this.folderChange.emit(new NodeEntryEvent(node.entry));
    }

    /**
     * Invoked when executing content action for a document or folder.
     * @param node Node to be the context of the execution.
     * @param action Action to be executed against the context.
     */
    executeContentAction(node: MinimalNodeEntity, action: ContentActionModel) {
        if (node && node.entry && action) {
            let handlerSub;

            if (typeof action.handler === 'function') {
                handlerSub = action.handler(node, this, action.permission);
            } else {
                handlerSub = Observable.of(true);
            }

            if (typeof action.execute === 'function') {
                handlerSub.subscribe(() => {
                    action.execute(node);
                });
            }
        }
    }

    loadFolder(merge: boolean = false) {
        if (merge) {
            this.infiniteLoading = true;
        } else {
            this.loading = true;
        }

        let nodeId = this.folderNode ? this.folderNode.id : this.currentFolderId;

        if (!this.hasCustomLayout) {
            this.setupDefaultColumns(nodeId);
        }
        if (nodeId) {
            this.loadFolderNodesByFolderNodeId(nodeId, this.maxItems, this.skipCount, merge).catch(err => this.error.emit(err));
        }
    }

    // gets folder node and its content
    loadFolderByNodeId(nodeId: string, merge: boolean = false) {
        this.loading = true;
        this.resetSelection();

        if (nodeId === '-trashcan-') {
            this.loadTrashcan(merge);
        } else if (nodeId === '-sharedlinks-') {
            this.loadSharedLinks(merge);
        } else if (nodeId === '-sites-') {
            this.loadSites(merge);
        } else if (nodeId === '-mysites-') {
            this.loadMemberSites(merge);
        } else if (nodeId === '-favorites-') {
            this.loadFavorites(merge);
        } else if (nodeId === '-recent-') {
            this.loadRecent(merge);
        } else {
            this.documentListService
                .getFolderNode(nodeId)
                .then(node => {
                    this.folderNode = node;
                    this.currentFolderId = node.id;
                    this.skipCount = 0;
                    this.currentNodeAllowableOperations = node['allowableOperations'] ? node['allowableOperations'] : [];
                    return this.loadFolderNodesByFolderNodeId(node.id, this.maxItems, this.skipCount, merge);
                })
                .catch(err => {
                    if (JSON.parse(err.message).error.statusCode === 403) {
                        this.loading = false;
                        this.noPermission = true;
                    }
                    this.error.emit(err);
                });
        }
    }

    loadFolderNodesByFolderNodeId(id: string, maxItems: number, skipCount: number, merge: boolean = false): Promise<any> {
        return new Promise((resolve, reject) => {
            this.resetSelection();
            this.documentListService
                .getFolder(null, {
                    maxItems: maxItems,
                    skipCount: skipCount,
                    rootFolderId: id
                })
                .subscribe(
                val => {
                    this.data.loadPage(<NodePaging> val, merge);
                    this.loading = false;
                    this.infiniteLoading = false;
                    this.onDataReady(val);
                    resolve(true);
                },
                error => {
                    reject(error);
                });
        });

    }

    resetSelection() {
        this.dataTable.resetSelection();
        this.selection = [];
    }

    private isSkipCountChanged(changePage: SimpleChanges) {
        return changePage.skipCount &&
            changePage.skipCount.currentValue !== null &&
            changePage.skipCount.currentValue !== undefined &&
            changePage.skipCount.currentValue !== changePage.skipCount.previousValue;
    }

    private isMaxItemsChanged(changePage: SimpleChanges) {
        return changePage.maxItems &&
            changePage.maxItems.currentValue &&
            changePage.maxItems.currentValue !== changePage.maxItems.previousValue;
    }

    private loadTrashcan(merge: boolean = false): void {
        const options = {
            include: ['path', 'properties'],
            maxItems: this.maxItems,
            skipCount: this.skipCount
        };
        this.apiService.nodesApi.getDeletedNodes(options)
            .then((page: DeletedNodesPaging) => this.onPageLoaded(page, merge))
            .catch(error => this.error.emit(error));
    }

    private loadSharedLinks(merge: boolean = false): void {
        const options = {
            include: ['properties', 'allowableOperations', 'path'],
            maxItems: this.maxItems,
            skipCount: this.skipCount
        };
        this.apiService.sharedLinksApi.findSharedLinks(options)
            .then((page: NodePaging) => this.onPageLoaded(page, merge))
            .catch(error => this.error.emit(error));
    }

    private loadSites(merge: boolean = false): void {
        const options = {
            include: ['properties'],
            maxItems: this.maxItems,
            skipCount: this.skipCount
        };

        this.apiService.sitesApi.getSites(options)
            .then((page: NodePaging) => this.onPageLoaded(page, merge))
            .catch(error => this.error.emit(error));
    }

    private loadMemberSites(merge: boolean = false): void {
        const options = {
            include: ['properties'],
            maxItems: this.maxItems,
            skipCount: this.skipCount
        };

        this.apiService.peopleApi.getSiteMembership('-me-', options)
            .then((result: SitePaging) => {
                let page: NodePaging = {
                    list: {
                        entries: result.list.entries
                            .map(({entry: {site}}: any) => {
                                site.allowableOperations = site.allowableOperations ? site.allowableOperations : [this.CREATE_PERMISSION];
                                return {
                                    entry: site
                                };
                            }),
                        pagination: result.list.pagination
                    }
                };

                this.onPageLoaded(page, merge);
            })
            .catch(error => this.error.emit(error));
    }

    private loadFavorites(merge: boolean = false): void {
        const options = {
            maxItems: this.maxItems,
            skipCount: this.skipCount,
            where: '(EXISTS(target/file) OR EXISTS(target/folder))',
            include: ['properties', 'allowableOperations', 'path']
        };

        this.apiService.favoritesApi.getFavorites('-me-', options)
            .then((result: NodePaging) => {
                let page: NodePaging = {
                    list: {
                        entries: result.list.entries
                            .map(({ entry: { target } }: any) => ({
                                entry: target.file || target.folder
                            }))
                            .map(({ entry }: any) => {
                                entry.properties = {
                                    'cm:title': entry.title,
                                    'cm:description': entry.description
                                };
                                return { entry };
                            }),
                        pagination: result.list.pagination
                    }
                };
                this.onPageLoaded(page, merge);
            })
            .catch(error => this.error.emit(error));
    }

    private loadRecent(merge: boolean = false): void {
        this.apiService.peopleApi.getPerson('-me-')
            .then((person: PersonEntry) => {
                const username = person.entry.id;
                const query = {
                    query: {
                        query: '*',
                        language: 'afts'
                    },
                    filterQueries: [
                        { query: `cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]` },
                        { query: `cm:modifier:${username} OR cm:creator:${username}` },
                        { query: `TYPE:"content" AND -TYPE:"app:filelink" AND -TYPE:"fm:post"` }
                    ],
                    include: ['path', 'properties', 'allowableOperations'],
                    sort: [{
                        type: 'FIELD',
                        field: 'cm:modified',
                        ascending: false
                    }],
                    paging: {
                        maxItems: this.maxItems,
                        skipCount: this.skipCount
                    }
                };

                return this.apiService.searchApi.search(query);
            })
            .then((page: NodePaging) => this.onPageLoaded(page, merge))
            .catch(error => this.error.emit(error));
    }

    private onPageLoaded(page: NodePaging, merge: boolean = false) {
        if (page) {
            this.data.loadPage(page, merge);
            this.loading = false;
            this.onDataReady(page);
        }
    }

    /**
     * Creates a set of predefined columns.
     */
    setupDefaultColumns(preset: string = 'default'): void {
        if (this.data) {
            const columns = this.getLayoutPreset(preset);
            this.data.setColumns(columns);
        }
    }

    onPreviewFile(node: MinimalNodeEntity) {
        if (node) {
            this.preview.emit(new NodeEntityEvent(node));
        }
    }

    onNodeClick(node: MinimalNodeEntity) {
        const domEvent = new CustomEvent('node-click', {
            detail: {
                sender: this,
                node: node
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);

        const event = new NodeEntityEvent(node);
        this.nodeClick.emit(event);

        if (!event.defaultPrevented) {
            if (this.navigate && this.navigationMode === DocumentListComponent.SINGLE_CLICK_NAVIGATION) {
                if (node && node.entry) {
                    if (node.entry.isFile) {
                        this.onPreviewFile(node);
                    }

                    if (node.entry.isFolder) {
                        this.performNavigation(node);
                    }
                }
            }
        }
    }

    onNodeDblClick(node: MinimalNodeEntity) {
        const domEvent = new CustomEvent('node-dblclick', {
            detail: {
                sender: this,
                node: node
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);

        const event = new NodeEntityEvent(node);
        this.nodeDblClick.emit(event);

        if (!event.defaultPrevented) {
            if (this.navigate && this.navigationMode === DocumentListComponent.DOUBLE_CLICK_NAVIGATION) {
                if (node && node.entry) {
                    if (node.entry.isFile) {
                        this.onPreviewFile(node);
                    }

                    if (node.entry.isFolder) {
                        this.performNavigation(node);
                    }
                }
            }
        }
    }

    onNodeSelect(event: { row: ShareDataRow, selection: Array<ShareDataRow> }) {
        this.selection = event.selection.map(entry => entry.node);
        const domEvent = new CustomEvent('node-select', {
            detail: {
                node: event.row.node,
                selection: this.selection
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    }

    onNodeUnselect(event: { row: ShareDataRow, selection: Array<ShareDataRow> }) {
        this.selection = event.selection.map(entry => entry.node);
        const domEvent = new CustomEvent('node-unselect', {
            detail: {
                node: event.row.node,
                selection: this.selection
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    }

    onShowRowContextMenu(event: DataCellEvent) {
        if (this.contextMenuActions) {
            let args = event.value;
            let node = (<ShareDataRow> args.row).node;
            if (node) {
                args.actions = this.getContextActions(node) || [];
            }
        }
    }

    onShowRowActionsMenu(event: DataCellEvent) {
        if (this.contentActions) {
            let args = event.value;
            let node = (<ShareDataRow> args.row).node;
            if (node) {
                args.actions = this.getNodeActions(node) || [];
            }
        }
    }

    onExecuteRowAction(event: DataRowActionEvent) {
        if (this.contentActions) {
            let args = event.value;
            let node = (<ShareDataRow> args.row).node;
            let action = (<ContentActionModel> args.action);
            this.executeContentAction(node, action);
        }
    }

    private enforceSingleClickNavigationForMobile(): void {
        if (this.isMobile()) {
            this.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        }
    }

    private getDefaultSorting(): DataSorting {
        let defaultSorting: DataSorting;
        if (this.sorting) {
            const [key, direction] = this.sorting;
            defaultSorting = new DataSorting(key, direction);
        }
        return defaultSorting;
    }

    canNavigateFolder(node: MinimalNodeEntity): boolean {
        if (this.isCustomSource(this.currentFolderId)) {
            return false;
        }

        if (node && node.entry && node.entry.isFolder) {
            return true;
        }

        return false;
    }

    isCustomSource(folderId: string): boolean {
        const sources = ['-trashcan-', '-sharedlinks-', '-sites-', '-mysites-', '-favorites-', '-recent-'];

        if (sources.indexOf(folderId) > -1) {
            return true;
        }

        return false;
    }

    hasCurrentNodePermission(permission: string): boolean {
        let hasPermission: boolean = false;
        if (this.currentNodeAllowableOperations.length > 0) {
            let permFound = this.currentNodeAllowableOperations.find(element => element === permission);
            hasPermission = permFound ? true : false;
        }
        return hasPermission;
    }

    hasCreatePermission() {
        return this.hasCurrentNodePermission(this.CREATE_PERMISSION);
    }

    private loadLayoutPresets(): void {
        const externalSettings = this.appConfig.get('document-list.presets', null);

        if (externalSettings) {
            this.layoutPresets = Object.assign({}, presetsDefaultModel, externalSettings);
        } else {
            this.layoutPresets = presetsDefaultModel;
        }
    }

    private getLayoutPreset(name: string = 'default'): DataColumn[] {
        return (this.layoutPresets[name] || this.layoutPresets['default']).map(col => new ObjectDataColumn(col));
    }

    private onDataReady(page: NodePaging) {
        this.ready.emit(page);

        if (page && page.list && page.list.pagination) {
            this.pagination.next(page.list.pagination);
        } else {
            this.pagination.next(null);
        }
    }

    updatePagination(params: PaginationQueryParams) {
        const needsReload = this.maxItems !== params.maxItems || this.skipCount !== params.skipCount;

        this.maxItems = params.maxItems;
        this.skipCount = params.skipCount;

        if (needsReload) {
            this.reload(this.enableInfiniteScrolling);
        }
    }
}
