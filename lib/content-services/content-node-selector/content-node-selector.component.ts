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
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    AlfrescoApiService,
    ContentService,
    HighlightDirective,
    SiteModel,
    UserPreferencesService
} from '@alfresco/adf-core';
import { FormControl } from '@angular/forms';
import { MinimalNodeEntryEntity, NodePaging, Pagination, Site } from 'alfresco-js-api';
import { DocumentListComponent, PaginationStrategy } from '../document-list/components/document-list.component';
import { RowFilter } from '../document-list/data/row-filter.model';
import { ImageResolver } from '../document-list/data/image-resolver.model';
import { ContentNodeSelectorService } from './content-node-selector.service';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'adf-content-node-selector',
    styleUrls: ['./content-node-selector.component.scss'],
    templateUrl: './content-node-selector.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorComponent implements OnInit {

    nodes: NodePaging | null = null;
    siteId: null | string;
    searchTerm: string = '';
    showingSearchResults: boolean = false;
    loadingSearchResults: boolean = false;
    inDialog: boolean = false;
    chosenNode: MinimalNodeEntryEntity | Site | null = null;
    folderIdToShow: string | null = null;
    paginationStrategy: PaginationStrategy;
    pagination: Pagination;
    skipCount: number = 0;
    infiniteScroll: boolean = false;

    @Input()
    title: string;

    @Input()
    actionName: string;

    @Input()
    currentFolderId: string = null;

    @Input()
    dropdownHideMyFiles: boolean = false;

    @Input()
    dropdownSiteList: any[] = null;

    @Input()
    rowFilter: RowFilter = null;

    @Input()
    imageResolver: ImageResolver = null;

    @Input()
    pageSize: number;

    @Output()
    select: EventEmitter<MinimalNodeEntryEntity[]> = new EventEmitter<MinimalNodeEntryEntity[]>();

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    @ViewChild(HighlightDirective)
    highlighter: HighlightDirective;

    debounceSearch: number= 200;

    searchInput: FormControl = new FormControl();

    constructor(private contentNodeSelectorService: ContentNodeSelectorService,
                private contentService: ContentService,
                private apiService: AlfrescoApiService,
                private preferences: UserPreferencesService) {
        this.searchInput.valueChanges
            .pipe(
                debounceTime(this.debounceSearch)
            )
            .subscribe((searchValue) => {
                this.search(searchValue);
            });

        this.pageSize = this.preferences.paginationSize;
    }

    ngOnInit() {
        this.folderIdToShow = this.currentFolderId;
        this.paginationStrategy = PaginationStrategy.Infinite;
    }

    /**
     * Updates the site attribute and starts a new search
     *
     * @param chosenSite Sitemodel to search within
     */
    siteChanged(chosenSite: SiteModel): void {
        this.siteId = chosenSite.guid;
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
     * Returns whether breadcrumb has to be shown or not
     */
    needBreadcrumbs() {
        const whenInFolderNavigation = !this.showingSearchResults,
            whenInSelectingSearchResult = this.showingSearchResults && this.chosenNode;

        return whenInFolderNavigation || whenInSelectingSearchResult;
    }

    /**
     * Returns the actually selected|entered folder node or null in case of searching for the breadcrumb
     */
    get breadcrumbFolderNode(): MinimalNodeEntryEntity | null {
        if (this.showingSearchResults && this.chosenNode) {
            return this.chosenNode;
        } else {
            return this.documentList.folderNode;
        }
    }

    /**
     * Clear the search input
     */
    clear(): void {
        this.searchTerm = '';
        this.nodes = null;
        this.skipCount = 0;
        this.chosenNode = null;
        this.showingSearchResults = false;
        this.folderIdToShow = this.currentFolderId;
    }

    /**
     * Update the result list depending on the criterias
     */
    private updateResults(): void {
        if (this.searchTerm.length === 0) {
            this.folderIdToShow = this.siteId || this.currentFolderId;
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
    getNextPageOfSearch(event: Pagination): void {
        this.infiniteScroll = true;
        this.skipCount = event.skipCount;
        this.querySearch();
    }

    /**
     * Perform the call to searchService with the proper parameters
     */
    private querySearch(): void {
        this.loadingSearchResults = true;

        this.contentNodeSelectorService.search(this.searchTerm, this.siteId, this.skipCount, this.pageSize)
            .subscribe(this.showSearchResults.bind(this));
    }

    /**
     * Show the results of the search
     *
     * @param results Search results
     */
    private showSearchResults(results: NodePaging): void {
        this.showingSearchResults = true;
        this.loadingSearchResults = false;

        // Documentlist hack, since data displaying for preloaded nodes is a little bit messy there
        if (!this.nodes) {
            this.nodes = results;
        } else {
            this.documentList.data.loadPage(results, true);
        }

        this.pagination = results.list.pagination;
        this.highlight();
    }

    /**
     * Hightlight the actual searchterm in the next frame
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
        this.skipCount = 0;
        this.infiniteScroll = false;
        this.showingSearchResults = false;
    }

    /**
     * Attempts to set the currently loaded node
     */
    onFolderLoaded(nodePage: NodePaging): void {
        this.attemptNodeSelection(this.documentList.folderNode);
        this.pagination = nodePage.list.pagination;
    }

    /**
     * Selects node as chosen if it has the right permission, clears the selection otherwise
     *
     * @param entry
     */
    private attemptNodeSelection(entry: MinimalNodeEntryEntity): void {
        if (this.contentService.hasPermission(entry, 'create')) {
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
     * Emit event with the chosen node
     */
    choose(): void {
        const entry: any = this.chosenNode;

        if (entry && entry.guid) {
            const options = {
                include: ['path', 'properties', 'allowableOperations']
            };
            this.apiService.nodesApi.getNode(entry.guid, options)
                .then(chosenSiteNode => {
                    this.select.next([chosenSiteNode.entry]);
                });

        } else {
            this.select.next([this.chosenNode]);

        }
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
