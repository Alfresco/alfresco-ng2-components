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

import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    AlfrescoApiService, HighlightDirective, UserPreferencesService,
    PaginatedComponent, PaginationModel
} from '@alfresco/adf-core';
import { FormControl } from '@angular/forms';
import { MinimalNodeEntryEntity, NodePaging, Pagination, SiteEntry, SitePaging } from 'alfresco-js-api';
import { DocumentListComponent, PaginationStrategy } from '../document-list/components/document-list.component';
import { RowFilter } from '../document-list/data/row-filter.model';
import { ImageResolver } from '../document-list/data/image-resolver.model';
import { ContentNodeSelectorService } from './content-node-selector.service';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { CustomResourcesService } from '../document-list/services/custom-resources.service';

export type ValidationFunction = (entry: MinimalNodeEntryEntity) => boolean;

const defaultValidation = () => true;

@Component({
    selector: 'adf-content-node-selector-panel',
    styleUrls: ['./content-node-selector-panel.component.scss'],
    templateUrl: './content-node-selector-panel.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-content-node-selector-panel' }
})
export class ContentNodeSelectorPanelComponent implements OnInit, PaginatedComponent {

    /** Node ID of the folder currently listed. */
    @Input()
    currentFolderId: string = null;

    /** Hide the "My Files" option added to the site list by default.
     * See the [Sites Dropdown component](sites-dropdown.component.md)
     * for more information.
     */
    @Input()
    dropdownHideMyFiles: boolean = false;

    /** Custom site for site dropdown same as siteList. See the
     * [Sites Dropdown component](sites-dropdown.component.md)
     * for more information.
     */
    @Input()
    dropdownSiteList: SitePaging = null;

    /** Custom row filter function. See the
     * [Document List component](document-list.component.md#custom-row-filter)
     * for more information.
     */
    @Input()
    rowFilter: RowFilter = null;

    /** Custom image resolver function. See the
     * [Document List component](document-list.component.md#custom-row-filter)
     * for more information.
     */
    @Input()
    imageResolver: ImageResolver = null;

    /** Number of items shown per page in the list. */
    @Input()
    pageSize: number;

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

    /** Emitted when the user has chosen an item. */
    @Output()
    select: EventEmitter<MinimalNodeEntryEntity[]> = new EventEmitter<MinimalNodeEntryEntity[]>();

    @ViewChild('documentList')
    documentList: DocumentListComponent;

    @ViewChild(HighlightDirective)
    highlighter: HighlightDirective;

    nodes: NodePaging | null = null;
    siteId: null | string;
    searchTerm: string = '';
    showingSearchResults: boolean = false;
    loadingSearchResults: boolean = false;
    inDialog: boolean = false;
    _chosenNode: MinimalNodeEntryEntity = null;
    folderIdToShow: string | null = null;
    paginationStrategy: PaginationStrategy = PaginationStrategy.Infinite;
    pagination: BehaviorSubject<PaginationModel>;

    skipCount: number = 0;
    infiniteScroll: boolean = false;
    debounceSearch: number = 200;
    searchInput: FormControl = new FormControl();

    constructor(private contentNodeSelectorService: ContentNodeSelectorService,
                private apiService: AlfrescoApiService,
                private customResourcesService: CustomResourcesService,
                private preferences: UserPreferencesService) {
        this.searchInput.valueChanges
            .pipe(
                debounceTime(this.debounceSearch)
            )
            .subscribe((searchValue) => {
                this.search(searchValue);
            });
        this.pageSize = this.preferences.paginationSize;

        let defaultPagination = <PaginationModel> {
            maxItems: this.pageSize,
            skipCount: 0,
            totalItems: 0,
            hasMoreItems: false
        };
        this.pagination = new BehaviorSubject<PaginationModel>(defaultPagination);
    }

    set chosenNode(value: MinimalNodeEntryEntity) {
        this._chosenNode = value;
        let valuesArray = null;
        if (value) {
            valuesArray = [value];
        }
        this.select.next(valuesArray);
    }

    get chosenNode() {
        return this._chosenNode;
    }

    ngOnInit() {
        this.folderIdToShow = this.currentFolderId;

        this.breadcrumbTransform = this.breadcrumbTransform ? this.breadcrumbTransform : null;
        this.isSelectionValid = this.isSelectionValid ? this.isSelectionValid : defaultValidation;
    }

    /**
     * Updates the site attribute and starts a new search
     *
     * @param chosenSite SiteEntry to search within
     */
    siteChanged(chosenSite: SiteEntry): void {
        this.siteId = chosenSite.entry.guid;
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
    get breadcrumbFolderNode(): MinimalNodeEntryEntity | null {
        let folderNode: MinimalNodeEntryEntity;

        if (this.showingSearchResults && this.chosenNode) {
            folderNode = this.chosenNode;
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
        this.nodes = null;
        this.skipCount = 0;
        this.chosenNode = null;
        this.showingSearchResults = false;
    }

    /**
     * Update the result list depending on the criterias
     */
    private updateResults(): void {
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
        this.nodes = null;
        this.skipCount = 0;
        this.chosenNode = null;
        this.folderIdToShow = null;
        this.querySearch();
    }

    /**
     * Loads the next batch of search results
     *
     * @param event Pagination object
     */
    updatePagination(pagination: Pagination): void {
        this.infiniteScroll = true;
        this.skipCount = pagination.skipCount;

        if (this.searchTerm.length > 0) {
            this.querySearch();
        }
    }

    /**
     * Perform the call to searchService with the proper parameters
     */
    private querySearch(): void {
        this.loadingSearchResults = true;

        if (this.customResourcesService.hasCorrespondingNodeIds(this.siteId)) {
            this.customResourcesService.getCorrespondingNodeIds(this.siteId)
                .subscribe(nodeIds => {
                        this.contentNodeSelectorService.search(this.searchTerm, this.siteId, this.skipCount, this.pageSize, nodeIds)
                            .subscribe(this.showSearchResults.bind(this));
                    },
                    () => {
                        this.showSearchResults({ list: { entries: [] } });
                    });
        } else {
            this.contentNodeSelectorService.search(this.searchTerm, this.siteId, this.skipCount, this.pageSize)
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

        // DocumentList hack, since data displaying for preloaded nodes is a little bit messy there
        if (!this.nodes) {
            this.nodes = nodePaging;
        } else {
            this.documentList.data.loadPage(nodePaging, true);
        }

        this.pagination.next(nodePaging.list.pagination);
        this.highlight();
    }

    /**
     * Highlight the actual search term in the next frame
     */
    highlight(): void {
        setTimeout(() => {
            this.highlighter.highlight(this.searchTerm);
        }, 0);
    }

    /**
     * Sets showingSearchResults state to be able to differentiate between search results or folder results
     */
    onFolderChange(): void {
        this.showingSearchResults = false;
        this.infiniteScroll = false;
        this.clearSearch();
    }

    /**
     * Attempts to set the currently loaded node
     */
    onFolderLoaded(nodePaging: NodePaging): void {
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
    getNextPageOfSearch(event: Pagination): void {
        this.infiniteScroll = true;
        this.skipCount = event.skipCount;

        if (this.searchTerm.length > 0) {
            this.querySearch();
        }
    }

    /**
     * Selects node as chosen if it has the right permission, clears the selection otherwise
     *
     * @param entry
     */
    private attemptNodeSelection(entry: MinimalNodeEntryEntity): void {
        if (this.isSelectionValid(entry)) {
            this.chosenNode = entry;
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
     * Invoked when user selects a node
     *
     * @param event CustomEvent for node-select
     */
    onNodeSelect(event: any): void {
        this.attemptNodeSelection(event.detail.node.entry);
    }

    onNodeDoubleClick(e: CustomEvent) {
        const node: any = e.detail.node.entry;

        if (node && node.guid) {
            const options = {
                maxItems: this.pageSize,
                skipCount: this.skipCount,
                include: ['path', 'properties', 'allowableOperations']
            };

            this.apiService.nodesApi.getNode(node.guid, options)
                .then(documentLibrary => {
                    this.documentList.performCustomSourceNavigation(documentLibrary);
                });
        }
    }
}
