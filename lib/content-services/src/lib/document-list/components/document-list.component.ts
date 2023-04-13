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

/* eslint-disable rxjs/no-subject-value */
/* eslint-disable @typescript-eslint/naming-convention */

import {
    AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input,
    OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation
} from '@angular/core';
import { ContentService } from '../../common/services/content.service';

import {
    DataCellEvent,
    DataColumn,
    DataRowActionEvent,
    DataSorting,
    DataTableComponent,
    DisplayMode,
    ShowHeaderMode,
    ObjectDataColumn,
    PaginatedComponent,
    AppConfigService,
    DataColumnListComponent,
    UserPreferencesService,
    PaginationModel,
    ThumbnailService,
    CustomLoadingContentTemplateDirective,
    CustomNoPermissionTemplateDirective,
    CustomEmptyContentTemplateDirective,
    RequestPaginationModel,
    AlfrescoApiService,
    UserPreferenceValues,
    DataRow,
    DataTableService
} from '@alfresco/adf-core';
import { NodesApiService } from '../../common/services/nodes-api.service';

import { Node, NodeEntry, NodePaging, NodesApi, Pagination } from '@alfresco/js-api';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { ShareDataRow } from './../data/share-data-row.model';
import { ShareDataTableAdapter } from './../data/share-datatable-adapter';
import { presetsDefaultModel } from '../models/preset.model';
import { ContentActionModel } from './../models/content-action.model';
import { PermissionStyleModel } from './../models/permissions-style.model';
import { NodeEntityEvent, NodeEntryEvent } from './node.event';
import { NavigableComponentInterface } from '../../breadcrumb/navigable-component.interface';
import { FilterSearch } from './../../search/models/filter-search.interface';
import { RowFilter } from '../data/row-filter.model';
import { DocumentListService } from '../services/document-list.service';
import { LockService } from '../services/lock.service';
import { DocumentLoaderNode } from '../models/document-folder.model';
import { takeUntil } from 'rxjs/operators';
import { ADF_DOCUMENT_PARENT_COMPONENT } from './document-list.token';
import { MatDialog } from '@angular/material/dialog';
import { FileAutoDownloadComponent } from './file-auto-download/file-auto-download.component';

const BYTES_TO_MB_CONVERSION_VALUE = 1048576;

@Component({
    selector: 'adf-document-list',
    templateUrl: './document-list.component.html',
    styleUrls: ['./document-list.component.scss'],
    providers:[{
        provide: ADF_DOCUMENT_PARENT_COMPONENT,
        useExisting: DocumentListComponent
    }, DataTableService],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-document-list' }
})
export class DocumentListComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit, PaginatedComponent, NavigableComponentInterface {

    static SINGLE_CLICK_NAVIGATION: string = 'click';
    static DOUBLE_CLICK_NAVIGATION: string = 'dblclick';

    DEFAULT_PAGINATION: Pagination = new Pagination({
        hasMoreItems: false,
        skipCount: 0,
        maxItems: 25,
        totalItems: 0
    });

    DEFAULT_SORTING: DataSorting[] = [
        new DataSorting('name', 'asc'),
        new DataSorting('isFolder', 'desc')
    ];

    @ContentChild(DataColumnListComponent)
    columnList: DataColumnListComponent;

    @ContentChild(CustomLoadingContentTemplateDirective)
    customLoadingContent: CustomLoadingContentTemplateDirective;

    @ContentChild(CustomNoPermissionTemplateDirective)
    customNoPermissionsTemplate: CustomNoPermissionTemplateDirective;

    @ContentChild(CustomEmptyContentTemplateDirective)
    customNoContentTemplate: CustomEmptyContentTemplateDirective;

    /** Include additional information about the node in the server request. For example: association, isLink, isLocked and others. */
    @Input()
    includeFields: string[];

    /**
     * Filters the Node list using the *where* condition of the REST API
     * (for example, isFolder=true). See the REST API documentation for more information.
     */
    @Input()
    where: string;

    /** Change the display mode of the table. Can be "list" or "gallery". */
    @Input()
    display: string = DisplayMode.List;

    /** Define a set of CSS styles to apply depending on the permission
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
    showHeader = ShowHeaderMode.Data;

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

    /**
     * When true, this enables you to drop files directly into subfolders shown
     * as items in the list or into another file to trigger updating it's version.
     * When false, the dropped file will be added to the
     * current folder (ie, the one containing all the items shown in the list).
     * See the Upload directive for further details about how the file drop is
     * handled.
     */
    @Input()
    allowDropFiles: boolean = false;

    /** Defines default sorting. The format is an array of 2 strings `[key, direction]`
     * i.e. `['name', 'desc']` or `['name', 'asc']`. Set this value only if you want to
     * override the default sorting detected by the component based on columns.
     */
    @Input()
    sorting: string[] | DataSorting = ['name', 'asc'];

    /** Defines default sorting. The format is an array of strings `[key direction, otherKey otherDirection]`
     * i.e. `['name desc', 'nodeType asc']` or `['name asc']`. Set this value if you want a base
     * rule to be added to the sorting apart from the one driven by the header.
     */
    @Input()
    additionalSorting: DataSorting = new DataSorting('isFolder', 'desc');

    /** Defines sorting mode. Can be either `client` (items in the list
     * are sorted client-side) or `server` (the ordering supplied by the
     * server is used without further client-side sorting).
     * Note that the `server` option *does not* request the server to sort the data
     * before delivering it.
     */
    @Input()
    sortingMode: 'server' | 'client' = 'server';

    /** The inline style to apply to every row. See
     * the Angular NgStyle
     * docs for more details and usage examples.
     */
    @Input()
    rowStyle: { [key: string]: any };

    /** The CSS class to apply to every row */
    @Input()
    rowStyleClass: string;

    /** Toggles the loading state and animated spinners for the component. Used in
     * combination with `navigate=false` to perform custom navigation and loading
     * state indication.
     */
    @Input()
    loading: boolean = false;

    /** @hidden */
    @Input()
    _rowFilter: RowFilter | null = null;

    /**
     * Custom function to choose whether to show or hide rows.
     * See the [Row Filter Model](row-filter.model.md) page for
     * more information.
     */
    @Input()
    set rowFilter(rowFilter: RowFilter) {
        this._rowFilter = rowFilter;
        if (this.data) {
            this.data.setFilter(this._rowFilter);
            if (this.currentFolderId) {
                this.reload();
            }
        }
    }

    get rowFilter(): RowFilter {
        return this._rowFilter;
    }

    /**
     * Custom function to choose image file paths to show. See the
     * [Image Resolver Model](image-resolver.model.md) page for
     * more information.
     */
    @Input()
    imageResolver: any | null = null;

    /** Toggles the sticky header mode. */
    @Input()
    stickyHeader: boolean = false;

    /** Toggles the header filters mode. */
    @Input()
    headerFilters: boolean = false;

    /** Initial value for filter. */
    @Input()
    filterValue: any;

    /** The ID of the folder node to display or a reserved string alias for special sources */
    @Input()
    currentFolderId: string = null;

    /** Array of nodes to be pre-selected. All nodes in the
     * array are pre-selected in multi selection mode, but only the first node
     * is pre-selected in single selection mode.
     */
    @Input()
    preselectNodes: NodeEntry[] = [];

    /** The Document list will show all the nodes contained in the NodePaging entity */
    @Input()
    node: NodePaging = null;

    /** Default value is stored in the user preference settings. Use this only if you are not using pagination. */
    @Input()
    maxItems: number = this.DEFAULT_PAGINATION.maxItems;

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

    /** Emitted when the node selection change */
    @Output()
    nodeSelected: EventEmitter<NodeEntry[]> = new EventEmitter<NodeEntry[]>();

    /** Emitted when a filter value is selected */
    @Output()
    filterSelection: EventEmitter<FilterSearch[]> = new EventEmitter();

    @ViewChild('dataTable', { static: true })
    dataTable: DataTableComponent;

    actions: ContentActionModel[] = [];
    contextActionHandler: Subject<any> = new Subject();
    data: ShareDataTableAdapter;
    noPermission: boolean = false;
    selection = new Array<NodeEntry>();
    $folderNode: Subject<Node> = new Subject<Node>();
    allowFiltering: boolean = true;
    orderBy: string[] = null;
    preselectedRows: DataRow[] = [];

    // @deprecated 3.0.0
    folderNode: Node;

    private _pagination: PaginationModel = this.DEFAULT_PAGINATION;
    pagination: BehaviorSubject<PaginationModel> = new BehaviorSubject<PaginationModel>(this.DEFAULT_PAGINATION);
    sortingSubject: BehaviorSubject<DataSorting[]> = new BehaviorSubject<DataSorting[]>(this.DEFAULT_SORTING);

    private layoutPresets = {};
    private rowMenuCache: { [key: string]: ContentActionModel[] } = {};
    private loadingTimeout;
    private onDestroy$ = new Subject<boolean>();

    _nodesApi: NodesApi;
    get nodesApi(): NodesApi {
        this._nodesApi = this._nodesApi ?? new NodesApi(this.alfrescoApiService.getInstance());
        return this._nodesApi;
    }

    constructor(private documentListService: DocumentListService,
                private elementRef: ElementRef,
                private appConfig: AppConfigService,
                private userPreferencesService: UserPreferencesService,
                private contentService: ContentService,
                private thumbnailService: ThumbnailService,
                private alfrescoApiService: AlfrescoApiService,
                private nodeService: NodesApiService,
                private dataTableService: DataTableService,
                private lockService: LockService,
                private dialog: MatDialog) {

        this.nodeService.nodeUpdated.subscribe((node) => {
            this.dataTableService.rowUpdate.next({id: node.id, obj: {entry: node}});
        });

        this.userPreferencesService
            .select(UserPreferenceValues.PaginationSize)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(pagSize => {
                this.maxItems = this._pagination.maxItems = pagSize;
            });
    }

    getContextActions(node: NodeEntry) {
        if (node && node.entry) {
            const actions = this.getNodeActions(node);
            if (actions && actions.length > 0) {
                return actions.map((currentAction: ContentActionModel) => ({
                    model: currentAction,
                    node,
                    subject: this.contextActionHandler
                }));
            }
        }
        return null;
    }

    get hasCustomLayout(): boolean {
        return this.columnList && this.columnList.columns && this.columnList.columns.length > 0;
    }

    private getDefaultSorting(): DataSorting {
        let defaultSorting: DataSorting;
        if (Array.isArray(this.sorting)) {
            const [key, direction] = this.sorting;
            defaultSorting = new DataSorting(key, direction);
        } else {
            defaultSorting = new DataSorting(this.sorting.key, this.sorting.direction);
        }

        return defaultSorting;
    }

    private getLayoutPreset(name: string = 'default'): DataColumn[] {
        return (this.layoutPresets[name] || this.layoutPresets['default']).map((col) => new ObjectDataColumn(col));
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
        this.data = new ShareDataTableAdapter(this.thumbnailService, this.contentService, null, this.getDefaultSorting(),
            this.sortingMode, this.allowDropFiles);
        this.data.thumbnails = this.thumbnails;
        this.data.permissionsStyle = this.permissionsStyle;

        if (this._rowFilter) {
            this.data.setFilter(this._rowFilter);
        }

        if (this.imageResolver) {
            this.data.setImageResolver(this.imageResolver);
        }

        this.contextActionHandler
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(val => this.contextActionCallback(val));

        this.enforceSingleClickNavigationForMobile();
    }

    ngAfterContentInit() {
        if (this.columnList) {
            this.columnList.columns.changes
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(() => this.setTableSchema());
        }
        this.setTableSchema();
    }

    private setTableSchema() {
        let schema: DataColumn[] = [];

        if (this.hasCustomLayout) {
            schema = this.columnList.columns.map((c) => c as DataColumn);
        }

        if (!this.data) {
            this.data = new ShareDataTableAdapter(this.thumbnailService, this.contentService, schema, this.getDefaultSorting(), this.sortingMode);
        } else if (schema && schema.length > 0) {
            this.data.setColumns(schema);
        }

        const columns = this.data.getColumns();
        if (!columns || columns.length === 0) {
            this.setupDefaultColumns(this.currentFolderId);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['preselectNodes']) {
            this.resetSelection();
        }

        if (Array.isArray(this.sorting)) {
            const [key, direction] = this.sorting;
            this.orderBy = this.buildOrderByArray(key, direction);
        } else {
            this.orderBy = this.buildOrderByArray(this.sorting.key, this.sorting.direction);
        }

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

        if (this.currentFolderId && changes['currentFolderId']?.currentValue !== changes['currentFolderId']?.previousValue) {
            this.loadFolder();
        }

        if (this.data) {
            if (changes.node && changes.node.currentValue) {
                const merge = this._pagination ? this._pagination.merge : false;
                this.data.loadPage(changes.node.currentValue, merge, null);
                this.preserveExistingSelection();
                this.onPreselectNodes();
                this.onDataReady(changes.node.currentValue);
            } else if (changes.imageResolver) {
                this.data.setImageResolver(changes.imageResolver.currentValue);
            }
        }
    }

    reload() {
        this.resetSelection();
        this.reloadWithoutResettingSelection();
    }

    reloadWithoutResettingSelection() {
        if (this.node) {
            if (this.data) {
                this.data.loadPage(this.node, this._pagination.merge, null);
                this.preserveExistingSelection();
            }
            this.onPreselectNodes();
            this.syncPagination();
            this.onDataReady(this.node);
        } else {
            this.loadFolder();
        }
    }

    contextActionCallback(action) {
        if (action) {
            this.executeContentAction(action.node, action.model);
        }
    }

    getNodeActions(node: NodeEntry | any): ContentActionModel[] {
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
                    actions.forEach((action) => {
                        this.refreshAction(action, node);
                    });
                    return actions;
                }

                const actionsByTarget = this.actions
                    .filter((entry) => {
                        const isVisible = (typeof entry.visible === 'function')
                            ? entry.visible(node)
                            : entry.visible;

                        return isVisible && entry.target.toLowerCase() === target;
                    })
                    .map((action) => new ContentActionModel(action));

                actionsByTarget.forEach((action) => {
                    this.refreshAction(action, node);
                });

                this.rowMenuCache[node.entry.id] = actionsByTarget;
                return actionsByTarget;
            }
        }

        return [];
    }

    private refreshAction(action: ContentActionModel, node: NodeEntry) {
        action.disabled = this.isActionDisabled(action, node);
        action.visible = this.isActionVisible(action, node);
    }

    private isActionVisible(action: ContentActionModel, node: NodeEntry): boolean {
        if (typeof action.visible === 'function') {
            return action.visible(node);
        }

        return action.visible;
    }

    private isActionDisabled(action: ContentActionModel, node: NodeEntry): boolean {
        if (typeof action.disabled === 'function') {
            return action.disabled(node);
        }

        if ((action.permission &&
            action.disableWithNoPermission &&
            !this.contentService.hasAllowableOperations(node.entry, action.permission)) ||
            this.lockService.isLocked(node.entry)) {
            return true;
        } else {
            return action.disabled;
        }
    }

    @HostListener('contextmenu', ['$event'])
    onShowContextMenu(e?: Event) {
        if (e && this.contextMenuActions) {
            e.preventDefault();
        }
    }

    navigateTo(node: Node | string): boolean {
        if (typeof node === 'string') {
            this.resetNewFolderPagination();
            this.currentFolderId = node;
            this.folderChange.emit(new NodeEntryEvent({ id: node } as Node));
            this.reload();
            return true;
        } else {
            if (this.canNavigateFolder(node)) {
                this.resetNewFolderPagination();
                this.currentFolderId = this.getNodeFolderDestinationId(node);
                this.folderChange.emit(new NodeEntryEvent({ id: this.currentFolderId } as Node));
                this.reload();
                return true;
            }
        }
        return false;
    }

    private getNodeFolderDestinationId(node: Node) {
        return this.isLinkFolder(node) ? node.properties['cm:destination'] : node.id;
    }

    private isLinkFolder(node: Node) {
        return node.nodeType === 'app:folderlink' && node.properties &&
            node.properties['cm:destination'];
    }

    updateCustomSourceData(nodeId: string): void {
        this.currentFolderId = nodeId;
    }

    /**
     * Invoked when executing content action for a document or folder.
     *
     * @param node Node to be the context of the execution.
     * @param action Action to be executed against the context.
     */
    executeContentAction(node: NodeEntry, action: ContentActionModel) {
        if (node && node.entry && action) {
            const handlerSub = (typeof action.handler === 'function') ? action.handler(node, this, action.permission) : of(true);

            if (typeof action.execute === 'function' && handlerSub) {
                handlerSub
                    .pipe(takeUntil(this.onDestroy$))
                    .subscribe(() => action.execute(node));
            }
        }
    }

    private setLoadingState(value: boolean) {
        if (this.data?.getRows().length > 0) {
            if (value) {
                clearTimeout(this.loadingTimeout);
                this.loadingTimeout = setTimeout(() => {
                    this.loading = true;
                }, 1000);
            } else {
                clearTimeout(this.loadingTimeout);
                this.loading = false;
            }
        } else {
            clearTimeout(this.loadingTimeout);
            this.loading = value;
        }
    }

    loadFolder() {
        if (!this._pagination.merge) {
            this.setLoadingState(true);
        }

        if (!this.hasCustomLayout) {
            this.setupDefaultColumns(this.currentFolderId);
        }

        if (this.documentListService.isCustomSourceService(this.currentFolderId)) {
            this.updateCustomSourceData(this.currentFolderId);
        }

        this.documentListService.loadFolderByNodeId(this.currentFolderId, this._pagination, this.includeFields, this.where, this.orderBy)
            .subscribe((documentNode: DocumentLoaderNode) => {
                if (documentNode.currentNode) {
                    this.folderNode = documentNode.currentNode.entry;
                    this.$folderNode.next(documentNode.currentNode.entry);
                }
                this.onPageLoaded(documentNode.children);
            }, (err) => {
                this.handleError(err);
            });
    }

    resetSelection() {
        this.dataTable.resetSelection();
        this.selection = [];
        this.noPermission = false;
    }

    onPageLoaded(nodePaging: NodePaging) {
        if (nodePaging) {
            if (this.data) {
                this.data.loadPage(nodePaging, this._pagination.merge, this.allowDropFiles);
                this.preserveExistingSelection();
            }
            this.onPreselectNodes();
            this.setLoadingState(false);
            this.onDataReady(nodePaging);
        }
    }

    onSortingChanged(event: CustomEvent) {
        this.orderBy = this.buildOrderByArray(event.detail.sortingKey, event.detail.direction);
        this.sortingSubject.next([this.additionalSorting, event.detail]);

        if (this.sortingMode === 'server') {
            this.reload();
        }
    }

    private buildOrderByArray(currentKey: string, currentDirection: string): string[] {
        return [
            `${this.additionalSorting.key} ${this.additionalSorting.direction}`,
            `${currentKey} ${currentDirection}`
        ];
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

    onPreviewFile(node: NodeEntry) {
        if (node) {
            const sizeInMB = node.entry?.content?.sizeInBytes / BYTES_TO_MB_CONVERSION_VALUE;

            const fileAutoDownloadFlag: boolean = this.appConfig.get('viewer.enableFileAutoDownload', true);
            const sizeThreshold: number = this.appConfig.get('viewer.fileAutoDownloadSizeThresholdInMB', 15);

            if (fileAutoDownloadFlag && sizeInMB && sizeInMB > sizeThreshold) {
                this.dialog.open(FileAutoDownloadComponent, { disableClose: true, data: node });
            } else {
                this.preview.emit(new NodeEntityEvent(node));
            }
        }
    }

    onNodeClick(nodeEntry: NodeEntry) {
        const domEvent = new CustomEvent('node-click', {
            detail: {
                sender: this,
                node: nodeEntry
            },
            bubbles: true
        });

        this.elementRef.nativeElement.dispatchEvent(domEvent);

        const event = new NodeEntityEvent(nodeEntry);
        this.nodeClick.emit(event);

        if (!event.defaultPrevented) {
            if (this.navigate && this.navigationMode === DocumentListComponent.SINGLE_CLICK_NAVIGATION) {
                this.executeActionClick(nodeEntry);
            }
        }

    }

    onNodeDblClick(nodeEntry: NodeEntry) {
        const domEvent = new CustomEvent('node-dblclick', {
            detail: {
                sender: this,
                node: nodeEntry
            },
            bubbles: true
        });
        this.elementRef.nativeElement.dispatchEvent(domEvent);

        const event = new NodeEntityEvent(nodeEntry);
        this.nodeDblClick.emit(event);

        if (!event.defaultPrevented) {
            if (this.navigate && this.navigationMode === DocumentListComponent.DOUBLE_CLICK_NAVIGATION) {
                this.executeActionClick(nodeEntry);
            }
        }
    }

    executeActionClick(nodeEntry: NodeEntry) {
        if (nodeEntry && nodeEntry.entry) {
            if (nodeEntry.entry.isFile) {
                this.onPreviewFile(nodeEntry);
            }

            if (nodeEntry.entry.isFolder) {
                this.navigateTo(nodeEntry.entry);
            }

            if (nodeEntry.entry['guid']) {
                const options = {
                    include: this.includeFields
                };

                this.nodesApi.getNode(nodeEntry.entry['guid'], options)
                    .then((node: NodeEntry) => {
                        this.navigateTo(node.entry);
                    });
            }
        }
    }

    onNodeSelect(event: { row: ShareDataRow; selection: Array<ShareDataRow> }) {
        this.selection = event.selection.map((entry) => entry.node);
        const domEvent = new CustomEvent('node-select', {
            detail: {
                node: event.row ? event.row.node : null,
                selection: this.selection
            },
            bubbles: true
        });
        this.nodeSelected.emit(this.selection);
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    }

    onNodeUnselect(event: { row: ShareDataRow; selection: Array<ShareDataRow> }) {
        this.selection = event.selection.map((entry) => entry.node);
        const domEvent = new CustomEvent('node-unselect', {
            detail: {
                node: event.row ? event.row.node : null,
                selection: this.selection
            },
            bubbles: true
        });
        this.nodeSelected.emit(this.selection);
        this.elementRef.nativeElement.dispatchEvent(domEvent);
    }

    onShowRowContextMenu(event: DataCellEvent) {
        if (this.contextMenuActions) {
            const args = event.value;
            const node = args.row.node;
            if (node) {
                args.actions = this.getContextActions(node) || [];
            }
        }
    }

    onShowRowActionsMenu(event: DataCellEvent) {
        if (this.contentActions) {
            const args = event.value;
            const node = args.row.node;
            if (node) {
                args.actions = this.getNodeActions(node) || [];
            }
        }
    }

    onExecuteRowAction(event: DataRowActionEvent) {
        if (this.contentActions) {
            const args = event.value;
            const node = args.row.node;
            const action = args.action;
            this.executeContentAction(node, action);
        }
    }

    private enforceSingleClickNavigationForMobile(): void {
        if (this.isMobile()) {
            this.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        }
    }

    canNavigateFolder(node: Node): boolean {
        let canNavigateFolder: boolean = false;

        if (node && node.isFolder) {
            canNavigateFolder = true;
        }

        return canNavigateFolder;
    }

    private loadLayoutPresets(): void {
        const externalSettings = this.appConfig.get('document-list.presets', null);
        this.layoutPresets = externalSettings ? Object.assign({}, presetsDefaultModel, externalSettings) : presetsDefaultModel;
    }

    private onDataReady(nodePaging: NodePaging) {
        this.ready.emit(nodePaging);
        this.pagination.next(nodePaging.list.pagination);
    }

    updatePagination(requestPaginationModel: RequestPaginationModel) {
        this._pagination.maxItems = requestPaginationModel.maxItems;
        this._pagination.merge = requestPaginationModel.merge;
        this._pagination.skipCount = requestPaginationModel.skipCount;
        this.reload();
    }

    private syncPagination() {
        this.node.list.pagination.maxItems = this._pagination.maxItems;
        this.node.list.pagination.skipCount = this._pagination.skipCount;
    }

    onFilterSelectionChange(activeFilters: FilterSearch[]) {
        this.filterSelection.emit(activeFilters);
    }

    resetNewFolderPagination() {
        this._pagination.skipCount = 0;
        this._pagination.maxItems = this.maxItems;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    private handleError(err: any) {
        if (err.message) {
            try {
                if (JSON.parse(err.message).error.statusCode === 403) {
                    this.noPermission = true;
                }
            } catch (error) {
            }
        }
        this.setLoadingState(false);
        this.error.emit(err);
    }

    getPreselectedNodesBasedOnSelectionMode(): NodeEntry[] {
        return this.hasPreselectedNodes() ? (this.isSingleSelectionMode() ? [this.preselectNodes[0]] : this.preselectNodes) : [];
    }

    getPreselectedRowsBasedOnSelectionMode(): DataRow[] {
        return this.hasPreselectedRows() ? (this.isSingleSelectionMode() ? [this.preselectedRows[0]] : this.preselectedRows) : [];
    }

    getSelectionBasedOnSelectionMode(): DataRow[] {
        return this.hasPreselectedRows() ? (this.isSingleSelectionMode() ? [this.preselectedRows[0]] : this.data.getSelectedRows()) : this.data.getSelectedRows();
    }

    onPreselectNodes() {
        if (this.hasPreselectedNodes()) {
            this.preselectRowsOfPreselectedNodes();
            const preselectedRows = this.getPreselectedRowsBasedOnSelectionMode();
            const selection = this.data.getSelectedRows() as ShareDataRow[];

            for (const node of preselectedRows) {
                this.dataTable.selectRow(node, true);
            }
            this.onNodeSelect({ row: undefined, selection });
        }
    }

    preserveExistingSelection() {
        if (this.isMultipleSelectionMode()) {
            for (const selection of this.selection) {
                const rowOfSelection = this.data.getRowByNodeId(selection.entry.id);
                if (rowOfSelection) {
                    rowOfSelection.isSelected = true;
                }
            }
        }
    }

    preselectRowsOfPreselectedNodes() {
        this.preselectedRows = [];
        const preselectedNodes = this.getPreselectedNodesBasedOnSelectionMode();

        preselectedNodes.forEach((preselectedNode: NodeEntry) => {
            const rowOfPreselectedNode = this.data.getRowByNodeId(preselectedNode.entry.id);
            if (rowOfPreselectedNode) {
                rowOfPreselectedNode.isSelected = true;
                this.preselectedRows.push(rowOfPreselectedNode);
            }
        });
    }

    unselectRowFromNodeId(nodeId: string) {
        const rowToUnselect = this.data.getRowByNodeId(nodeId);
        if (rowToUnselect?.isSelected) {
            rowToUnselect.isSelected = false;
            this.dataTable.selectRow(rowToUnselect, false);
            const selection = this.getSelectionBasedOnSelectionMode() as ShareDataRow[];
            this.onNodeUnselect({ row: undefined, selection });
        }
    }

    isSingleSelectionMode(): boolean {
        return this.selectionMode === 'single';
    }

    isMultipleSelectionMode(): boolean {
        return this.selectionMode === 'multiple';
    }

    hasPreselectedNodes(): boolean {
        return this.preselectNodes?.length > 0;
    }

    hasPreselectedRows(): boolean {
        return this.preselectedRows?.length > 0;
    }
}
