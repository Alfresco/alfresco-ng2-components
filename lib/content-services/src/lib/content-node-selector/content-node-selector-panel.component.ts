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

import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import {
    HighlightDirective,
    UserPreferencesService,
    PaginationModel,
    UserPreferenceValues,
    InfinitePaginationComponent, PaginatedComponent,
    NodesApiService,
    SitesService
} from '@alfresco/adf-core';
import { FormControl } from '@angular/forms';
import { Node, NodePaging, Pagination, SiteEntry, SitePaging, NodeEntry } from '@alfresco/js-api';
import { DocumentListComponent } from '../document-list/components/document-list.component';
import { RowFilter } from '../document-list/data/row-filter.model';
import { ImageResolver } from '../document-list/data/image-resolver.model';
import { ContentNodeSelectorService } from './content-node-selector.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { CustomResourcesService } from '../document-list/services/custom-resources.service';
import { NodeEntryEvent, ShareDataRow } from '../document-list';
import { Subject } from 'rxjs';

export type ValidationFunction = (entry: Node) => boolean;

export const defaultValidation = () => true;

@Component({
    selector: 'adf-content-node-selector-panel',
    styleUrls: ['./content-node-selector-panel.component.scss'],
    templateUrl: './content-node-selector-panel.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-content-node-selector-panel' }
})
export class ContentNodeSelectorPanelComponent implements OnInit, OnDestroy {

    DEFAULT_PAGINATION: Pagination = new Pagination({
        maxItems: 25,
        skipCount: 0,
        totalItems: 0,
        hasMoreItems: false
    });

    private showSiteList = true;
    private showSearchField = true;
    private showFiles = false;

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
            this.showFiles = value;
        }
    }

    @Input()
    preSelectedNodes: any;

    /** Emitted when the user has chosen an item. */
    @Output()
    select: EventEmitter<Node[]> = new EventEmitter<Node[]>();

    /** Emitted when the navigation changes. */
    @Output()
    navigationChange: EventEmitter<NodeEntryEvent> = new EventEmitter<NodeEntryEvent>();

    /** Emitted when the select site changes. */
    @Output()
    siteChange: EventEmitter<string> = new EventEmitter<string>();

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

    pagination: PaginationModel = this.DEFAULT_PAGINATION;

    @ViewChild(InfinitePaginationComponent, { static: true })
    infinitePaginationComponent: InfinitePaginationComponent;

    infiniteScroll: boolean = false;
    debounceSearch: number = 200;
    searchInput: FormControl = new FormControl();

    target: PaginatedComponent;

    private onDestroy$ = new Subject<boolean>();

    constructor(private contentNodeSelectorService: ContentNodeSelectorService,
                private customResourcesService: CustomResourcesService,
                private userPreferencesService: UserPreferencesService,
                private nodesApiService: NodesApiService,
                private sitesService: SitesService) {
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
            .subscribe(searchValue => this.search(searchValue));

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
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
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
        this.updateResults();
    }

    /**
     * Updates the searchTerm attribute and starts a new search
     *
     * @param searchTerm string value to search against
     */
    search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.updateResults();
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
     * Clear the search input and reset to last folder node in which search was performed
     */
    clear(): void {
        this.clearSearch();
        this.folderIdToShow = this.siteId || this.currentFolderId;
    }

    /**
     * Clear the search input and search related data
     */
    clearSearch() {
        this.searchTerm = '';
        this.nodePaging = null;
        this.pagination.maxItems = this.pageSize;
        this.chosenNode = null;
        this.showingSearchResults = false;
    }

    /**
     * Update the result list depending on the criteria
     */
    private updateResults(): void {
        this.target = this.searchTerm.length > 0 ? null : this.documentList;

        if (this.searchTerm.length === 0) {
            this.clear();
        } else {
            this.startNewSearch();
        }
    }

    /**
     * Load the first page of a new search result
     */
    private startNewSearch(): void {
        this.nodePaging = null;
        this.pagination.maxItems = this.pageSize;
        if (this.target) {
            this.infinitePaginationComponent.reset();
        }
        this.chosenNode = null;
        this.folderIdToShow = null;
        this.querySearch();
    }

    /**
     * Perform the call to searchService with the proper parameters
     */
    private querySearch(): void {
        this.loadingSearchResults = true;

        if (this.customResourcesService.hasCorrespondingNodeIds(this.siteId)) {
            this.customResourcesService.getCorrespondingNodeIds(this.siteId)
                .subscribe((nodeIds) => {
                        this.contentNodeSelectorService.search(this.searchTerm, this.siteId, this.pagination.skipCount, this.pagination.maxItems, nodeIds, this.showFiles)
                            .subscribe(this.showSearchResults.bind(this));
                    },
                    () => {
                        this.showSearchResults({ list: { entries: [] } });
                    });
        } else {
            this.contentNodeSelectorService.search(this.searchTerm, this.siteId, this.pagination.skipCount, this.pagination.maxItems, [], this.showFiles)
                .subscribe(this.showSearchResults.bind(this));
        }
    }

    /**
     * Show the results of the search
     *
     * @param results Search results
     */
    private showSearchResults(nodePaging: NodePaging): void {
        this.showingSearchResults = true;
        this.loadingSearchResults = false;

        this.nodePaging = nodePaging;
    }

    /**
     * Sets showingSearchResults state to be able to differentiate between search results or folder results
     */
    onFolderChange($event: NodeEntryEvent): void {
        this.showingSearchResults = false;
        this.infiniteScroll = false;
        this.breadcrumbFolderTitle = null;
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
     * @param event Pagination object
     */
    getNextPageOfSearch(pagination: Pagination): void {
        this.infiniteScroll = true;
        this.pagination = pagination;

        if (this.searchTerm.length > 0) {
            this.querySearch();
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
        } else {
            this.resetChosenNode();
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
        const nodes: Node[] = validNodesEntity.map((node) => node.entry );
        this.chosenNode = nodes;
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
}
