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

/* tslint:disable:rxjs-no-subject-value */

import {
    AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, NgZone,
    OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation
} from '@angular/core';

import {
    ContentService, DataCellEvent, DataColumn, DataRowActionEvent, DataSorting, DataTableComponent,
    DisplayMode, ObjectDataColumn, PaginatedComponent, AppConfigService, DataColumnListComponent,
    UserPreferencesService, PaginationModel, ThumbnailService
} from '@alfresco/adf-core';

import { MinimalNodeEntity, MinimalNodeEntryEntity, NodePaging } from 'alfresco-js-api';
import { Subject, BehaviorSubject, Subscription, of } from 'rxjs';
import { ShareDataRow } from './../data/share-data-row.model';
import { ShareDataTableAdapter } from './../data/share-datatable-adapter';
import { presetsDefaultModel } from '../models/preset.model';
import { ContentActionModel } from './../models/content-action.model';
import { PermissionStyleModel } from './../models/permissions-style.model';
import { DocumentListService } from './../services/document-list.service';
import { NodeEntityEvent, NodeEntryEvent } from './node.event';
import { CustomResourcesService } from './../services/custom-resources.service';
import { NavigableComponentInterface } from '../../breadcrumb/navigable-component.interface';

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
export class DocumentListComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit, PaginatedComponent, NavigableComponentInterface {

    static SINGLE_CLICK_NAVIGATION: string = 'click';
    static DOUBLE_CLICK_NAVIGATION: string = 'dblclick';
    static DEFAULT_PAGE_SIZE: number = 20;

    @ContentChild(DataColumnListComponent)
    columnList: DataColumnListComponent;

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
    sorting = ['name', 'asc'];

    /** Defines sorting mode. Can be either `client` or `server`. */
    @Input()
    sortingMode = 'client';

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

    /**
     * Currently displayed folder node
     * @deprecated 2.3.0 - use currentFolderId or node
     */
    @Input()
    folderNode: MinimalNodeEntryEntity = null;

    /** The Document list will show all the nodes contained in the NodePaging entity */
    @Input()
    node: NodePaging = null;

    /** Default value is stored into user preference settings use it only if you are not using the pagination */
    @Input()
    maxItems: number;

    /**
     * Number of elements to skip over for pagination purposes
     * @deprecated 2.3.0 - define it in pagination
     */
    @Input()
    skipCount: number = 0;

    /**
     * Set document list to work in infinite scrolling mode
     * @deprecated 2.3.0
     */
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

    actions: ContentActionModel[] = [];
    emptyFolderTemplate: TemplateRef<any>;
    noPermissionTemplate: TemplateRef<any>;
    contextActionHandler: Subject<any> = new Subject();
    data: ShareDataTableAdapter;
    noPermission: boolean = false;
    selection = new Array<MinimalNodeEntity>();

    private _pagination: BehaviorSubject<PaginationModel>;
    private layoutPresets = {};
    private subscriptions: Subscription[] = [];
    private rowMenuCache: { [key: string]: ContentActionModel[] } = {};
    private loadingTimeout;

    constructor(private documentListService: DocumentListService,
                private ngZone: NgZone,
                private elementRef: ElementRef,
                private appConfig: AppConfigService,
                private preferences: UserPreferencesService,
                private customResourcesService: CustomResourcesService,
                private contentService: ContentService,
                private thumbnailService: ThumbnailService) {
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

    /** @deprecated 2.3.0 define it in pagination */
    get supportedPageSizes(): number[] {
        return this.preferences.getDefaultPageSizes();
    }

    get hasCustomLayout(): boolean {
        return this.columnList && this.columnList.columns && this.columnList.columns.length > 0;
    }

    private getDefaultSorting(): DataSorting {
        let defaultSorting: DataSorting;
        if (this.sorting) {
            const [key, direction] = this.sorting;
            defaultSorting = new DataSorting(key, direction);
        }
        return defaultSorting;
    }

    private getLayoutPreset(name: string = 'default'): DataColumn[] {
        return (this.layoutPresets[name] || this.layoutPresets['default']).map(col => new ObjectDataColumn(col));
    }

    get pagination(): BehaviorSubject<PaginationModel> {
        let maxItems = this.preferences.paginationSize;

        if (!this._pagination) {
            if (this.maxItems) {
                maxItems = this.maxItems;
            }

            let defaultPagination = <PaginationModel> {
                maxItems: maxItems,
                skipCount: 0,
                totalItems: 0,
                hasMoreItems: false
            };

            this._pagination = new BehaviorSubject<PaginationModel>(defaultPagination);
        }

        return this._pagination;
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

    ngOnInit() {
        this.rowMenuCache = {};
        this.loadLayoutPresets();
        this.data = new ShareDataTableAdapter(this.documentListService, this.thumbnailService, null, this.getDefaultSorting(), this.sortingMode);
        this.data.thumbnails = this.thumbnails;
        this.data.permissionsStyle = this.permissionsStyle;

        if (this.rowFilter) {
            this.data.setFilter(this.rowFilter);
        }

        if (this.imageResolver) {
            this.data.setImageResolver(this.imageResolver);
        }

        this.subscriptions.push(
            this.contextActionHandler.subscribe(val => this.contextActionCallback(val))
        );

        this.enforceSingleClickNavigationForMobile();
    }

    ngAfterContentInit() {
        if (this.columnList) {
            this.subscriptions.push(
                this.columnList.columns.changes.subscribe(() => {
                    this.setTableSchema();
                })
            );
        }
        this.setTableSchema();
    }

    private setTableSchema() {
        let schema: DataColumn[] = [];

        if (this.hasCustomLayout) {
            schema = this.columnList.columns.map(c => <DataColumn> c);
        }

        if (!this.data) {
            this.data = new ShareDataTableAdapter(this.documentListService, this.thumbnailService, schema, this.getDefaultSorting(), this.sortingMode);
        } else if (schema && schema.length > 0) {
            this.data.setColumns(schema);
        }

        let columns = this.data.getColumns();
        if (!columns || columns.length === 0) {
            this.setupDefaultColumns(this.currentFolderId);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.resetSelection();
        if (this.data) {
            this.data.thumbnails = this.thumbnails;

        }
        if (changes.sortingMode && !changes.sortingMode.firstChange && this.data) {
            this.data.sortingMode = changes.sortingMode.currentValue;
        }

        if (changes.sorting && !changes.sorting.firstChange && this.data) {
            const newValue = changes.sorting.currentValue;
            if (newValue && newValue.length > 0) {
                const [key, direction] = newValue;
                this.data.setSorting(new DataSorting(key, direction));
            }
        }

        if (changes.folderNode && changes.folderNode.currentValue) {
            this.currentFolderId = changes.folderNode.currentValue.id;
            this.resetNewFolderPagination();
            this.loadFolder();
        } else if (changes.currentFolderId &&
            changes.currentFolderId.currentValue &&
            changes.currentFolderId.currentValue !== changes.currentFolderId.previousValue) {
            this.resetNewFolderPagination();
            this.loadFolder();
        } else if (this.data) {
            if (changes.node && changes.node.currentValue) {
                this.data.loadPage(changes.node.currentValue);
                this.onDataReady(changes.node.currentValue);
            } else if (changes.rowFilter && changes.rowFilter.currentValue !== changes.rowFilter.previousValue) {
                this.data.setFilter(changes.rowFilter.currentValue);
                if (this.currentFolderId) {
                    this.loadFolderNodesByFolderNodeId(this.currentFolderId, this.pagination.getValue()).catch(err => this.error.emit(err));
                }
            } else if (changes.imageResolver) {
                this.data.setImageResolver(changes.imageResolver.currentValue);
            }
        }
    }

    reload() {
        this.ngZone.run(() => {
            this.resetSelection();
            if (this.node) {
                this.data.loadPage(this.node);
                this.onDataReady(this.node);
            } else {
                this.loadFolder();
            }
        });
    }

    contextActionCallback(action) {
        if (action) {
            this.executeContentAction(action.node, action.model);
        }
    }

    getNodeActions(node: MinimalNodeEntity | any): ContentActionModel[] {
        if (node && node.entry) {
            let target = null;

            if (node.entry.isFile) {
                target = 'document';
            } else if (node.entry.isFolder) {
                target = 'folder';
            }

            if (target) {
                const actions = this.rowMenuCache[node.entry.id];
                if (actions) {
                    actions.forEach(action => {
                        this.refreshAction(action, node);
                    });
                    return actions;
                }

                let actionsByTarget = this.actions
                    .filter(entry => {
                        const isVisible = (typeof entry.visible === 'function')
                            ? entry.visible(node)
                            : entry.visible;

                        return isVisible && entry.target.toLowerCase() === target;
                    })
                    .map(action => new ContentActionModel(action));

                actionsByTarget.forEach((action) => {
                    this.refreshAction(action, node);
                });

                this.rowMenuCache[node.entry.id] = actionsByTarget;
                return actionsByTarget;
            }
        }

        return [];
    }

    private refreshAction(action: ContentActionModel, node: MinimalNodeEntity) {
        action.disabled = this.isActionDisabled(action, node);
        action.visible = this.isActionVisible(action, node);
    }

    private isActionVisible(action: ContentActionModel, node: MinimalNodeEntity): boolean {
        if (typeof action.visible === 'function') {
            return action.visible(node);
        }

        return action.visible;
    }

    private isActionDisabled(action: ContentActionModel, node: MinimalNodeEntity): boolean {
        if (typeof action.disabled === 'function') {
            return action.disabled(node);
        }

        if (action.permission && action.disableWithNoPermission && !this.contentService.hasPermission(node.entry, action.permission)) {
            return true;
        }

        return action.disabled;
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
        if (this.customResourcesService.isCustomSource(this.currentFolderId)) {
            this.updateFolderData(node);
            return true;
        }
        return false;
    }

    updateFolderData(node: MinimalNodeEntity): void {
        this.resetNewFolderPagination();
        this.currentFolderId = node.entry.id;
        this.reload();
        this.folderChange.emit(new NodeEntryEvent(node.entry));
    }

    updateCustomSourceData(nodeId: string): void {
        this.folderNode = null;
        this.currentFolderId = nodeId;
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
                handlerSub = of(true);
            }

            if (typeof action.execute === 'function' && handlerSub) {
                handlerSub.subscribe(() => {
                    action.execute(node);
                });
            }
        }
    }

    private setLoadingState(value: boolean) {
        if (value) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = setTimeout(() => {
                this.loading = true;
            }, 1000);
        } else {
            clearTimeout(this.loadingTimeout);
            this.loading = false;
        }
    }

    loadFolder() {
        if (!this.pagination.getValue().merge) {
            this.setLoadingState(true);
        }

        if (!this.hasCustomLayout) {
            this.setupDefaultColumns(this.currentFolderId);
        }

        if (this.folderNode) {
            return this.loadFolderNodesByFolderNodeId(this.folderNode.id, this.pagination.getValue())
                .catch(err => this.handleError(err));
        } else {
            this.loadFolderByNodeId(this.currentFolderId);
        }
    }

    loadFolderByNodeId(nodeId: string) {
        if (this.customResourcesService.isCustomSource(nodeId)) {
            this.updateCustomSourceData(nodeId);
            this.customResourcesService.loadFolderByNodeId(nodeId, this.pagination.getValue(), this.includeFields)
                .subscribe((page: NodePaging) => {
                    this.onPageLoaded(page);
                }, err => {
                    this.error.emit(err);
                });
        } else {
            this.documentListService
                .getFolderNode(nodeId, this.includeFields)
                .subscribe((node: MinimalNodeEntryEntity) => {
                    this.folderNode = node;
                    return this.loadFolderNodesByFolderNodeId(node.id, this.pagination.getValue())
                        .catch(err => this.handleError(err));
                }, err => {
                    this.handleError(err);
                });
        }
    }

    loadFolderNodesByFolderNodeId(id: string, pagination: PaginationModel): Promise<any> {
        return new Promise((resolve, reject) => {

            this.documentListService
                .getFolder(null, {
                    maxItems: pagination.maxItems,
                    skipCount: pagination.skipCount,
                    rootFolderId: id
                }, this.includeFields)
                .subscribe(
                    nodePaging => {
                        this.data.loadPage(<NodePaging> nodePaging, this.pagination.getValue().merge);
                        this.setLoadingState(false);
                        this.onDataReady(nodePaging);
                        resolve(true);
                    }, err => {
                        this.handleError(err);
                    });
        });
    }

    resetSelection() {
        this.dataTable.resetSelection();
        this.selection = [];
        this.noPermission = false;
    }

    onPageLoaded(nodePaging: NodePaging) {
        if (nodePaging) {
            this.data.loadPage(nodePaging, this.pagination.getValue().merge);
            this.setLoadingState(false);
            this.onDataReady(nodePaging);
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

    canNavigateFolder(node: MinimalNodeEntity): boolean {
        let canNavigateFolder: boolean = false;

        if (this.customResourcesService.isCustomSource(this.currentFolderId)) {
            canNavigateFolder = false;
        } else if (node && node.entry && node.entry.isFolder) {
            canNavigateFolder = true;
        }

        return canNavigateFolder;
    }

    private loadLayoutPresets(): void {
        const externalSettings = this.appConfig.get('document-list.presets', null);

        if (externalSettings) {
            this.layoutPresets = Object.assign({}, presetsDefaultModel, externalSettings);
        } else {
            this.layoutPresets = presetsDefaultModel;
        }
    }

    private onDataReady(nodePaging: NodePaging) {
        this.ready.emit(nodePaging);

        this.pagination.next(nodePaging.list.pagination);
    }

    updatePagination(pagination: PaginationModel) {
        this.pagination.next(pagination);
        this.reload();
    }

    navigateTo(nodeId: string) {
        this.currentFolderId = nodeId;
        this.resetNewFolderPagination();
        this.loadFolder();
        this.folderChange.emit(new NodeEntryEvent({ id: nodeId }));
    }

    private resetNewFolderPagination() {
        this.folderNode = null;
        this.pagination.value.skipCount = 0;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];
    }

    private handleError(err: any) {
        if (err.message) {
            if (JSON.parse(err.message).error.statusCode === 403) {
                this.setLoadingState(false);
                this.noPermission = true;
            }
        }
        this.error.emit(err);

    }

}
