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
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
    OnDestroy,
    Inject
} from '@angular/core';
import {
    HighlightDirective,
    UserPreferencesService,
    UserPreferenceValues,
    InfinitePaginationComponent, PaginatedComponent,
    NodesApiService,
    SitesService,
    UploadService,
    FileUploadCompleteEvent
} from '@alfresco/adf-core';
import { FormControl } from '@angular/forms';
import { Node, NodePaging, Pagination, SiteEntry, SitePaging, NodeEntry, QueryBody, RequestScope } from '@alfresco/js-api';
import { DocumentListComponent } from '../document-list/components/document-list.component';
import { RowFilter } from '../document-list/data/row-filter.model';
import { ImageResolver } from '../document-list/data/image-resolver.model';
import { debounceTime, takeUntil, scan } from 'rxjs/operators';
import { CustomResourcesService } from '../document-list/services/custom-resources.service';
import { NodeEntryEvent, ShareDataRow } from '../document-list';
import { Subject } from 'rxjs';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../search/search-query-service.token';
import { SearchQueryBuilderService } from '../search/search-query-builder.service';
import { ContentNodeSelectorPanelService } from './content-node-selector-panel.service';

export type ValidationFunction = (entry: Node) => boolean;

export const defaultValidation = () => true;

@Component({
    selector: 'adf-content-node-selector-panel',
    styleUrls: ['./content-node-selector-panel.component.scss'],
    templateUrl: './content-node-selector-panel.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-content-node-selector-panel' },
    providers: [{
        provide: SEARCH_QUERY_SERVICE_TOKEN,
        useClass: SearchQueryBuilderService
    }]
})
export class ContentNodeSelectorPanelComponent implements OnInit, OnDestroy {

    DEFAULT_PAGINATION: Pagination = new Pagination({
        maxItems: 25,
        skipCount: 0
    });

    private showSiteList = true;
    private showSearchField = true;

    /** If true will restrict the search and breadcrumbs to the currentFolderId */
    @Input()
    restrictRootToCurrentFolderId: boolean = false;

    /** Node ID of the folder currently listed. */
    @Input()
    currentFolderId: string = null;

    /** Hide the "My Files" option added to the site list by default.
     * See the [Sites Dropdown component](sites-dropdown.component.md)
     * for more information.
     */
    @Input()
    dropdownHideMyFiles: boolean = false;

    /** Custom site for site dropdown. This is the same as the `siteList`.
     * property of the Sites Dropdown component (see its doc page
     * for more information).
     */
    @Input()
    dropdownSiteList: SitePaging = null;

    _rowFilter: RowFilter = defaultValidation;

    /** Custom *where* filter function. See the
     * Document List component
     * for more information.
     */
    @Input()
    where: string;

    /**
     * Custom row filter function. See the
     * [Row Filter Model](row-filter.model.md) page
     * for more information.
     */
    @Input()
    set rowFilter(rowFilter: RowFilter) {
        this.createRowFilter(rowFilter);
    }

    get rowFilter(): RowFilter {
        return this._rowFilter;
    }

    _excludeSiteContent: string[] = [];

    /** Custom list of site content componentIds.
     * Used to filter out the corresponding items from the displayed nodes
     */
    @Input()
    set excludeSiteContent(excludeSiteContent: string[]) {
        this._excludeSiteContent = excludeSiteContent;
        this.createRowFilter(this._rowFilter);
    }

    get excludeSiteContent(): string[] {
        return this._excludeSiteContent;
    }

    /**
     * Custom image resolver function. See the
     * [Image Resolver Model](image-resolver.model.md) page
     * for more information.
     */
    @Input()
    imageResolver: ImageResolver = null;

    /** Number of items shown per page in the list. */
    @Input()
    pageSize: number = this.DEFAULT_PAGINATION.maxItems;

    /** Define the selection mode for document list. The allowed values are single or multiple */
    @Input()
    selectionMode: 'single' | 'multiple' = 'single';

    /** Function used to decide if the selected node has permission to be selected.
     * Default value is a function that always returns true.
     */
    @Input()
    isSelectionValid: ValidationFunction = defaultValidation;

    /** Transformation to be performed on the chosen/folder node before building the
     * breadcrumb UI. Can be useful when custom formatting is needed for the breadcrumb.
     * You can change the path elements from the node that are used to build the
     * breadcrumb using this function.
     */
    @Input()
    breadcrumbTransform: (node) => any;

    /** Toggle search input rendering */
    @Input()
    set showSearch(value: boolean) {
        if (value !== undefined && value !== null) {
            this.showSearchField = value;
        }
    }

    get showSearch(): boolean {
        return this.showSearchField;
    }

    /** Toggle sites list dropdown rendering */
    @Input()
    set showDropdownSiteList(value: boolean) {
        if (value !== undefined && value !== null) {
            this.showSiteList = value;
        }
    }

    get showDropdownSiteList(): boolean {
        return this.showSiteList;
    }

    /** Shows the files and folders in the search result */
    @Input()
    set showFilesInResult(value: boolean) {
        if (value !== undefined && value !== null) {
            const showFilesQuery = `TYPE:'cm:folder'${value ? " OR TYPE:'cm:content'" : ''}`;
            this.queryBuilderService.addFilterQuery(showFilesQuery);
        }
    }

    /** Emitted when the user has chosen an item. */
    @Output()
    select: EventEmitter<Node[]> = new EventEmitter<Node[]>();

    /** Emitted when the navigation changes. */
    @Output()
    navigationChange: EventEmitter<NodeEntryEvent> = new EventEmitter<NodeEntryEvent>();

    /** Emitted when the select site changes. */
    @Output()
    siteChange: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when search is running. */
    @Output()
    showingSearch: EventEmitter<boolean> = new EventEmitter<boolean>();

    /** Emitted when current folder loaded. */
    @Output()
    currentFolder: EventEmitter<Node> = new EventEmitter<Node>();

    /** Emitted when folder loaded. */
    @Output()
    folderLoaded: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('documentList', { static: true })
    documentList: DocumentListComponent;

    @ViewChild(HighlightDirective, { static: true })
    highlighter: HighlightDirective;

    nodePaging: NodePaging | null = null;
    siteId: null | string;
    breadcrumbRootId: null | string;
    searchTerm: string = '';
    showingSearchResults: boolean = false;
    loadingSearchResults: boolean = false;
    inDialog: boolean = false;
    _chosenNode: Node [] = null;
    folderIdToShow: string | null = null;
    breadcrumbFolderTitle: string | null = null;
    startSiteGuid: string | null = null;

    @ViewChild(InfinitePaginationComponent, { static: true })
    infinitePaginationComponent: InfinitePaginationComponent;

    infiniteScroll: boolean = false;
    debounceSearch: number = 200;
    searchInput: FormControl = new FormControl();

    target: PaginatedComponent;
    preselectNodes: NodeEntry[] = [];

    searchPanelExpanded: boolean = false;

    private onDestroy$ = new Subject<boolean>();

    constructor(private customResourcesService: CustomResourcesService,
                @Inject(SEARCH_QUERY_SERVICE_TOKEN) public queryBuilderService: SearchQueryBuilderService,
                private userPreferencesService: UserPreferencesService,
                private nodesApiService: NodesApiService,
                private uploadService: UploadService,
                private sitesService: SitesService,
                private contentNodeSelectorPanelService: ContentNodeSelectorPanelService) {
    }

    set chosenNode(value: Node[]) {
        this._chosenNode = value;
        this.select.next(value);
    }

    get chosenNode() {
        return this._chosenNode;
    }

    ngOnInit() {
        this.searchInput.valueChanges
            .pipe(
                debounceTime(this.debounceSearch),
                takeUntil(this.onDestroy$)
            )
            .subscribe((searchValue: string) => {
                this.searchTerm = searchValue;
                this.queryBuilderService.userQuery = searchValue.length > 0 ? `${searchValue}*` : searchValue ;
                this.queryBuilderService.update();
            });

        this.queryBuilderService.updated
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((queryBody: QueryBody) => {
                if (queryBody) {
                    this.prepareDialogForNewSearch(queryBody);
                    this.queryBuilderService.execute(queryBody);
                } else {
                    this.resetFolderToShow();
                    this.clearSearch();
                }
            });

        this.queryBuilderService.executed
            .pipe(takeUntil(this.onDestroy$))
            .subscribe( (results: NodePaging) => {
                this.showSearchResults(results);
            });

        this.userPreferencesService
            .select(UserPreferenceValues.PaginationSize)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(pagSize => this.pageSize = pagSize);

        this.target = this.documentList;
        this.folderIdToShow = this.currentFolderId;
        if (this.currentFolderId) {
            if (this.restrictRootToCurrentFolderId) {
                this.breadcrumbRootId = this.currentFolderId;
                this.siteId = this.currentFolderId;
            } else {
                this.getStartSite();
            }
        }

        this.breadcrumbTransform = this.breadcrumbTransform ? this.breadcrumbTransform : null;
        this.isSelectionValid = this.isSelectionValid ? this.isSelectionValid : defaultValidation;
        this.onFileUploadEvent();
        this.resetPagination();
        this.setSearchScopeToNodes();

        this.documentList.$folderNode
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((currentNode: Node) => {
            this.currentFolder.emit(currentNode);
    });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    toggleSearchPanel() {
        this.searchPanelExpanded = !this.searchPanelExpanded;
    }

    hasCustomModels(): boolean {
        return this.contentNodeSelectorPanelService?.customModels?.length > 0;
    }

    private onFileUploadEvent() {
        this.uploadService.fileUploadComplete
        .pipe(
            debounceTime(300),
            scan((files, currentFile) => [...files, currentFile], []),
            takeUntil(this.onDestroy$)
        )
        .subscribe((uploadedFiles: FileUploadCompleteEvent[]) => {
            this.preselectNodes = this.getPreselectNodesBasedOnSelectionMode(uploadedFiles);
            this.documentList.reload();
        });
    }

    private getStartSite() {
        this.nodesApiService.getNode(this.currentFolderId).subscribe((startNodeEntry) => {
            this.startSiteGuid = this.sitesService.getSiteNameFromNodePath(startNodeEntry);
            if (this.startSiteGuid) {
                this.sitesService.getSite(this.startSiteGuid).subscribe((startSiteEntry) => {
                    if (startSiteEntry instanceof SiteEntry) {
                        this.siteChange.emit(startSiteEntry.entry.title);
                    }
                });
            }
        });
    }

    private createRowFilter(filter?: RowFilter) {
        if (!filter) {
            filter = () => true;
        }
        this._rowFilter = (value: ShareDataRow, index: number, array: ShareDataRow[]) => {
            return filter(value, index, array) &&
                !this.isExcludedSiteContent(value);
        };
    }

    private isExcludedSiteContent(row: ShareDataRow): boolean {
        const entry = row.node.entry;
        if (this._excludeSiteContent && this._excludeSiteContent.length &&
            entry &&
            entry.properties &&
            entry.properties['st:componentId']) {
            const excludedItem = this._excludeSiteContent.find(
                (id: string) => entry.properties['st:componentId'] === id
            );
            return !!excludedItem;
        }
        return false;
    }

    /**
     * Updates the site attribute and starts a new search
     *
     * @param chosenSite SiteEntry to search within
     */
    siteChanged(chosenSite: SiteEntry): void {
        this.siteId = chosenSite.entry.guid;
        this.setTitleIfCustomSite(chosenSite);
        this.siteChange.emit(chosenSite.entry.title);
        this.queryBuilderService.update();
    }

    /**
     * Returns the actually selected|entered folder node or null in case of searching for the breadcrumb
     */
    get breadcrumbFolderNode(): Node | null {
        let folderNode: Node;

        if (this.showingSearchResults && this.chosenNode) {
            folderNode = this.chosenNode[0];
        } else {
            folderNode = this.documentList.folderNode;
        }

        return folderNode;
    }

    /**
     * Prepares the dialog for a new search
     */
    prepareDialogForNewSearch(queryBody: QueryBody): void {
        this.target = queryBody ? null : this.documentList;
        if (this.target) {
            this.infinitePaginationComponent.reset();
        }
        this.folderIdToShow = null;
        this.loadingSearchResults = true;
        this.addCorrespondingNodeIdsQuery();
        this.resetChosenNode();
    }

    /**
     * Clear the search input and reset to last folder node in which search was performed
     */
    clear(): void {
        this.searchTerm = '';
        this.queryBuilderService.userQuery = '';
        this.queryBuilderService.update();
    }

    /**
     * Resets the folder to be shown with the site selection or the initial landing folder
     */
    resetFolderToShow(): void {
        this.folderIdToShow = this.siteId || this.currentFolderId;
    }

    /**
     * Clear the search input and search related data
     */
    clearSearch() {
        this.searchTerm = '';
        this.nodePaging = null;
        this.resetPagination();
        this.resetChosenNode();
        this.showingSearchResults = false;
        this.showingSearch.emit(this.showingSearchResults);
    }

    private addCorrespondingNodeIdsQuery() {
        let extraParentFiltering = '';

        if (this.customResourcesService.hasCorrespondingNodeIds(this.siteId)) {
            this.customResourcesService.getCorrespondingNodeIds(this.siteId)
                .subscribe((nodeIds) => {
                    if (nodeIds && nodeIds.length) {
                        nodeIds
                            .filter((id) => id !== this.siteId)
                            .forEach((extraId) => {
                                extraParentFiltering += ` OR ANCESTOR:'workspace://SpacesStore/${extraId}'`;
                            });
                    }
                    const parentFiltering = this.siteId ? `ANCESTOR:'workspace://SpacesStore/${this.siteId}'${extraParentFiltering}` : '';
                    this.queryBuilderService.addFilterQuery(parentFiltering);
                });
        } else {
            const parentFiltering = this.siteId ? `ANCESTOR:'workspace://SpacesStore/${this.siteId}'` : '';
            this.queryBuilderService.addFilterQuery(parentFiltering);
        }
    }

    private setSearchScopeToNodes() {
        const scope: RequestScope = {
            locations: 'nodes'
        };
        this.queryBuilderService.setScope(scope);
    }

    /**
     * Show the results of the search
     *
     * @param results Search results
     */
    private showSearchResults(results: NodePaging): void {
        this.showingSearchResults = true;
        this.loadingSearchResults = false;
        this.showingSearch.emit(this.showingSearchResults);

        this.nodePaging = results;
    }

    /**
     * Sets showingSearchResults state to be able to differentiate between search results or folder results
     */
    onFolderChange($event: NodeEntryEvent): void {
        this.showingSearchResults = false;
        this.infiniteScroll = false;
        this.breadcrumbFolderTitle = null;
        this.preselectNodes = [];
        this.clearSearch();
        this.navigationChange.emit($event);
    }

    /**
     * Attempts to set the currently loaded node
     */
    onFolderLoaded(): void {
        if (!this.showingSearchResults) {
            this.attemptNodeSelection(this.documentList.folderNode);
        }
        this.folderLoaded.emit();
    }

    /**
     * Returns whether breadcrumb has to be shown or not
     */
    showBreadcrumbs() {
        return !this.showingSearchResults || this.chosenNode;
    }

    /**
     * Loads the next batch of search results
     *
     * @param pagination Pagination object
     */
    getNextPageOfSearch(pagination: Pagination): void {
        this.infiniteScroll = true;
        this.queryBuilderService.paging.maxItems = pagination.maxItems;
        this.queryBuilderService.paging.skipCount = pagination.skipCount;

        if (this.searchTerm.length > 0) {
            this.queryBuilderService.update();
        }
    }

    /**
     * Selects node as chosen if it has the right permission, clears the selection otherwise
     *
     * @param entry
     */
    private attemptNodeSelection(entry: Node): void {
        if (entry && this.isSelectionValid(entry)) {
            this.chosenNode = [entry];
        }
    }

    /**
     * Clears the chosen node
     */
    resetChosenNode(): void {
        this.chosenNode = null;
    }

    /**
     * It filters and emit the selection coming from the document list
     *
     * @param nodesEntries
     */
    onCurrentSelection(nodesEntries: NodeEntry[]): void {
        const validNodesEntity = nodesEntries.filter((node) => this.isSelectionValid(node.entry));
        this.chosenNode = validNodesEntity.map((node) => node.entry );
    }

    setTitleIfCustomSite(site: SiteEntry) {
        if (this.customResourcesService.isCustomSource(site.entry.guid)) {
            this.breadcrumbFolderTitle = site.entry.title;
            if (this.documentList.folderNode.path.elements) {
                this.breadcrumbFolderNode.name = site.entry.title;
                this.documentList.folderNode.path.elements = null;
            }
        } else {
            this.breadcrumbFolderTitle = null;
        }
    }

    hasPreselectNodes(): boolean {
        return this.preselectNodes && this.preselectNodes.length > 0;
    }

    isSingleSelectionMode(): boolean {
        return this.selectionMode === 'single';
    }

    private getPreselectNodesBasedOnSelectionMode(uploadedFiles: FileUploadCompleteEvent[]): NodeEntry[] {
        let selectedNodes: NodeEntry[] = [];

        if (uploadedFiles && uploadedFiles.length > 0 ) {
            if (this.isSingleSelectionMode()) {
                selectedNodes = [...[uploadedFiles[uploadedFiles.length - 1]].map((uploadedFile) => uploadedFile.data)];
            } else {
                selectedNodes = [...uploadedFiles.map((uploadedFile) => uploadedFile.data)];
            }
        }

        return selectedNodes;
    }

    private resetPagination(): void {
        this.queryBuilderService.paging = {
            maxItems: this.pageSize,
            skipCount: this.DEFAULT_PAGINATION.skipCount
        };
    }
}
