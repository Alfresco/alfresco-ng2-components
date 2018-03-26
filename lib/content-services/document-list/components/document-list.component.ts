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
    DisplayMode,
    ObjectDataColumn,
    PaginatedComponent,
    PaginationQueryParams,
    PermissionsEnum
} from '@alfresco/adf-core';
import {
    AlfrescoApiService,
    AppConfigService,
    DataColumnListComponent,
    UserPreferencesService
} from '@alfresco/adf-core';
import {
    AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, NgZone,
    OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import {
    MinimalNodeEntity,
    MinimalNodeEntryEntity,
    NodePaging,
    Pagination
} from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { presetsDefaultModel } from '../models/preset.model';
import { ShareDataRow } from './../data/share-data-row.model';
import { ShareDataTableAdapter } from './../data/share-datatable-adapter';

import { ContentActionModel } from './../models/content-action.model';
import { PermissionStyleModel } from './../models/permissions-style.model';
import { DocumentListService } from './../services/document-list.service';
import { CustomResourcesService } from './../services/custom-resources.service';
import { NodeEntityEvent, NodeEntryEvent } from './node.event';
import { Subscription } from 'rxjs/Subscription';

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
export class DocumentListComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit, PaginatedComponent {

    static SINGLE_CLICK_NAVIGATION: string = 'click';
    static DOUBLE_CLICK_NAVIGATION: string = 'dblclick';
    static DEFAULT_PAGE_SIZE: number = 20;

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    /** Include additional information about the node in the server request.for example: association, isLink, isLocked and others. */
    @Input()
    includeFields: string[];

    /** Change the display mode of the table. Can be "list" or "gallery". */
    @Input()
    display: string = DisplayMode.List;

    /** Define a set of CSS styles styles to apply depending on the permission
     * of the user on that node. See the Permission Style model
     * page for further details and examples.
     */
    @Input()
    permissionsStyle: PermissionStyleModel[] = [];

    /** The default route for all the location-based columns (if declared). */
    @Input()
    locationFormat: string = '/';

    /** Toggles navigation to folder content or file preview */
    @Input()
    navigate: boolean = true;

    /** Toggles the header */
    @Input()
    showHeader: boolean = true;

    /** User interaction for folder navigation or file preview.
     * Valid values are "click" and "dblclick". Default value: "dblclick"
     */
    @Input()
    navigationMode: string = DocumentListComponent.DOUBLE_CLICK_NAVIGATION; // click|dblclick

    /** Show document thumbnails rather than icons */
    @Input()
    thumbnails: boolean = false;

    /** Row selection mode. Can be null, `single` or `multiple`. For `multiple` mode,
     * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // null|single|multiple

    /** Toggles multiselect mode */
    @Input()
    multiselect: boolean = false;

    /** Toggles content actions for each row */
    @Input()
    contentActions: boolean = false;

    /** Position of the content actions dropdown menu. Can be set to "left" or "right". */
    @Input()
    contentActionsPosition: string = 'right'; // left|right

    /** Toggles context menus for each row */
    @Input()
    contextMenuActions: boolean = false;

    /** Custom image for empty folder. Default value: './assets/images/empty_doc_lib.svg' */
    @Input()
    emptyFolderImageUrl: string = './assets/images/empty_doc_lib.svg';

    /** Toggle file drop support for rows (see Upload Directive for further details */
    @Input()
    allowDropFiles: boolean = false;

    /** Defines default sorting. The format is an array of 2 strings `[key, direction]`
     * i.e. `['name', 'desc']` or `['name', 'asc']`. Set this value only if you want to
     * override the default sorting detected by the component based on columns.
     */
    @Input()
    sorting: string[];

    /** The inline style to apply to every row. See
     * the Angular NgStyle
     * docs for more details and usage examples.
     */
    @Input()
    rowStyle: string;

    /** The CSS class to apply to every row */
    @Input()
    rowStyleClass: string;

    /** Toggles the loading state and animated spinners for the component. Used in
     * combination with `navigate=false` to perform custom navigation and loading
     * state indication.
     */
    @Input()
    loading: boolean = false;

    /** Custom row filter */
    @Input()
    rowFilter: any | null = null;

    /** Custom image resolver */
    @Input()
    imageResolver: any | null = null;

    /** The ID of the folder node to display or a reserved string alias for special sources */
    @Input()
    currentFolderId: string = null;

    /** Currently displayed folder node */
    @Input()
    folderNode: MinimalNodeEntryEntity = null;

    /** The Document list will show all the nodes contained in the NodePaging entity */
    @Input()
    node: NodePaging = null;

    /** Default value is stored into user preference settings */
    @Input()
    maxItems: number;

    /** Number of elements to skip over for pagination purposes */
    @Input()
    skipCount: number = 0;

    /** Set document list to work in infinite scrolling mode */
    @Input()
    enableInfiniteScrolling: boolean = false;

    /** Emitted when the user clicks a list node */
    @Output()
    nodeClick: EventEmitter<NodeEntityEvent> = new EventEmitter<NodeEntityEvent>();

    /** Emitted when the user double-clicks a list node */
    @Output()
    nodeDblClick: EventEmitter<NodeEntityEvent> = new EventEmitter<NodeEntityEvent>();

    /** Emitted when the current display folder changes */
    @Output()
    folderChange: EventEmitter<NodeEntryEvent> = new EventEmitter<NodeEntryEvent>();

    /** Emitted when the user acts upon files with either single or double click
     * (depends on `navigation-mode`). Useful for integration with the
     * Viewer component.
     */
    @Output()
    preview: EventEmitter<NodeEntityEvent> = new EventEmitter<NodeEntityEvent>();

    /** Emitted when the Document List has loaded all items and is ready for use */
    @Output()
    ready: EventEmitter<NodePaging> = new EventEmitter();

    /** Emitted when the API fails to get the Document List data */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    @ViewChild('dataTable')
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

    pagination: BehaviorSubject<Pagination>;
    isSkipCountChanged = false;

    private layoutPresets = {};
    private currentNodeAllowableOperations: string[] = [];

    private contextActionHandlerSubscription: Subscription;

    constructor(private documentListService: DocumentListService,
                private ngZone: NgZone,
                private elementRef: ElementRef,
                private apiService: AlfrescoApiService,
                private appConfig: AppConfigService,
                private preferences: UserPreferencesService,
                private customResourcesService: CustomResourcesService) {
        this.maxItems = this.preferences.paginationSize;

        this.pagination = new BehaviorSubject<Pagination>(<Pagination> {
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

        this.contextActionHandlerSubscription = this.contextActionHandler.subscribe(val => this.contextActionCallback(val));

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
        this.updateSkipCountChanged(changes);
        if (this.isSkipCountChanged ||
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
                this.pagination.next(changes.node.currentValue.list.pagination);
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
        if (action.permission && action.permission !== PermissionsEnum.COPY) {
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

    updateCustomSourceData(nodeId: string, merge: boolean): void {
        this.folderNode = null;
        this.currentFolderId = nodeId;
        if (!merge && !this.isSkipCountChanged) {
            this.skipCount = 0;
        }
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
            this.updateCustomSourceData('-trashcan-', merge);
            this.customResourcesService.loadTrashcan(this.pagination, this.includeFields).subscribe((page: NodePaging) => {
                this.onPageLoaded(page, merge);
            });
        } else if (nodeId === '-sharedlinks-') {
            this.updateCustomSourceData('-sharedlinks-', merge);
            this.customResourcesService.loadSharedLinks(this.pagination, this.includeFields).subscribe((page: NodePaging) => {
                this.onPageLoaded(page, merge);
            });
        } else if (nodeId === '-sites-') {
            this.updateCustomSourceData('-sites-', merge);
            this.customResourcesService.loadSites(this.pagination).subscribe((page: NodePaging) => {
                this.onPageLoaded(page, merge);
            });
        } else if (nodeId === '-mysites-') {
            this.updateCustomSourceData('-mysites-', merge);
            this.customResourcesService.loadMemberSites(this.pagination).subscribe((page: NodePaging) => {
                this.onPageLoaded(page, merge);
            });
        } else if (nodeId === '-favorites-') {
            this.updateCustomSourceData('-favorites-', merge);
            this.customResourcesService.loadFavorites(this.pagination, this.includeFields).subscribe((page: NodePaging) => {
                this.onPageLoaded(page, merge);
            });
        } else if (nodeId === '-recent-') {
            this.loadRecent(merge);
        } else {
            this.documentListService
                .getFolderNode(nodeId, this.includeFields)
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
                }, this.includeFields)
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
        this.noPermission = false;
    }

    private updateSkipCountChanged(changePage: SimpleChanges) {
        this.isSkipCountChanged = changePage.skipCount &&
            !changePage.skipCount.isFirstChange() &&
            changePage.skipCount.currentValue &&
            changePage.skipCount.currentValue !== changePage.skipCount.previousValue;
    }

    private isMaxItemsChanged(changePage: SimpleChanges) {
        return changePage.maxItems &&
            !changePage.maxItems.isFirstChange() &&
            changePage.maxItems.currentValue &&
            changePage.maxItems.currentValue !== changePage.maxItems.previousValue;
    }

    private loadRecent(merge: boolean = false): void {
        this.updateCustomSourceData('-recent-', merge);

        this.customResourcesService.getRecentFiles('-me-', this.pagination)
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
        this.isSkipCountChanged = false;
    }

    updatePagination(params: PaginationQueryParams) {
        this.isSkipCountChanged = this.skipCount !== params.skipCount;

        const needsReload = this.maxItems !== params.maxItems || this.isSkipCountChanged;

        this.maxItems = params.maxItems;
        this.skipCount = params.skipCount;

        if (needsReload) {
            this.reload(this.enableInfiniteScrolling);
        }
    }

    get supportedPageSizes(): number[] {
        return this.preferences.getDefaultPageSizes();
    }

    ngOnDestroy() {
        if (this.contextActionHandlerSubscription) {
            this.contextActionHandlerSubscription.unsubscribe();
            this.contextActionHandlerSubscription = null;
        }
    }

    getCorrespondingNodeIds(nodeId: string): Promise<string[]> {
        if (nodeId === '-trashcan-') {
            return this.apiService.nodesApi.getDeletedNodes()
                .then(result => result.list.entries.map(node => node.entry.id));

        } else if (nodeId === '-sharedlinks-') {
            return this.apiService.sharedLinksApi.findSharedLinks()
                .then(result => result.list.entries.map(node => node.entry.nodeId));

        } else if (nodeId === '-sites-') {
            return this.apiService.sitesApi.getSites()
                .then(result => result.list.entries.map(node => node.entry.guid));

        } else if (nodeId === '-mysites-') {
            return this.apiService.peopleApi.getSiteMembership('-me-')
                .then(result => result.list.entries.map(node => node.entry.guid));

        } else if (nodeId === '-favorites-') {
            return this.apiService.favoritesApi.getFavorites('-me-')
                .then(result => result.list.entries.map(node => node.entry.targetGuid));

        } else if (nodeId === '-recent-') {
            return this.customResourcesService.getRecentFiles('-me-', this.pagination)
                .then(result => result.list.entries.map(node => node.entry.id));

        } else if (nodeId) {
            return this.documentListService.getFolderNode(nodeId, this.includeFields)
                .then(node => [node.id]);
        }

        return new Promise((resolve) => {
            resolve([]);
        });
    }

}
