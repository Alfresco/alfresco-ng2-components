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

import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { MinimalNodeEntryEntity, NodePaging } from 'alfresco-js-api';
import { AlfrescoContentService, AlfrescoTranslationService, HighlightDirective, SearchOptions, SearchService, SiteModel } from 'ng2-alfresco-core';
import { ImageResolver, RowFilter } from '../../data/share-datatable-adapter';
import { DocumentListComponent } from '../document-list.component';

export interface ContentNodeSelectorComponentData {
    title: string;
    currentFolderId?: string;
    rowFilter?: RowFilter;
    imageResolver?: ImageResolver;
    select: EventEmitter<MinimalNodeEntryEntity[]>;
}

@Component({
    selector: 'adf-content-node-selector',
    styleUrls: ['./content-node-selector.component.scss'],
    templateUrl: './content-node-selector.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ContentNodeSelectorComponent implements OnInit {

    nodes: NodePaging | Array<any>;
    siteId: null | string;
    searchTerm: string = '';
    showingSearchResults: boolean = false;
    inDialog: boolean = false;
    chosenNode: MinimalNodeEntryEntity | null = null;
    folderIdToShow: string | null = null;

    @Input()
    title: string;

    @Input()
    currentFolderId: string | null = null;

    @Input()
    rowFilter: RowFilter = null;

    @Input()
    imageResolver: ImageResolver = null;

    @Output()
    select: EventEmitter<MinimalNodeEntryEntity[]> = new EventEmitter<MinimalNodeEntryEntity[]>();

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    @ViewChild(HighlightDirective)
    highlighter: HighlightDirective;

    constructor(private searchService: SearchService,
                private contentService: AlfrescoContentService,
                @Optional() translateService: AlfrescoTranslationService,
                @Optional() @Inject(MD_DIALOG_DATA) data?: ContentNodeSelectorComponentData,
                @Optional() private containingDialog?: MdDialogRef<ContentNodeSelectorComponent>) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-alfresco-documentlist', 'assets/ng2-alfresco-documentlist');
        }

        if (data) {
            this.title = data.title;
            this.select = data.select;
            this.currentFolderId = data.currentFolderId;
            this.rowFilter = data.rowFilter;
            this.imageResolver = data.imageResolver;
        }

        if (this.containingDialog) {
            this.inDialog = true;
        }
    }

    ngOnInit() {
        this.folderIdToShow = this.currentFolderId;
    }

    /**
     * Updates the site attribute and starts a new search
     *
     * @param chosenSite Sitemodel to search within
     */
    siteChanged(chosenSite: SiteModel): void {
        this.siteId = chosenSite.guid;
        this.querySearch();
    }

    /**
     * Updates the searchTerm attribute and starts a new search
     *
     * @param searchTerm string value to search against
     */
    search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.querySearch();
    }

    needBreadcrumbs() {
        const whenInFolderNavigation = !this.showingSearchResults,
            whenInSelectingSearchResult = this.showingSearchResults && this.chosenNode;

        return whenInFolderNavigation || whenInSelectingSearchResult;
    }

    /**
     * Returns the actually selected|entered folder node or null in case of searching for the breadcrumb
     */
    get breadcrumbFolderNode(): MinimalNodeEntryEntity|null {
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
        this.nodes = [];
        this.chosenNode = null;
        this.showingSearchResults = false;
        this.folderIdToShow = this.currentFolderId;
    }

    /**
     * Perform the call to searchService with the proper parameters
     */
    private querySearch(): void {
        if (this.searchTerm.length > 3) {
            this.chosenNode = null;

            const searchTerm = this.searchTerm + '*';
            let searchOpts: SearchOptions = {
                include: ['path', 'allowableOperations'],
                skipCount: 0,
                rootNodeId: this.siteId,
                nodeType: 'cm:folder',
                maxItems: 200,
                orderBy: null
            };
            this.searchService
                .getNodeQueryResults(searchTerm, searchOpts)
                .subscribe(
                    results => {
                        this.showingSearchResults = true;
                        this.folderIdToShow = null;
                        this.nodes = results;
                        this.highlight();
                    }
                );
        }
    }

    /**
     * Hightlight the actual searchterm in the next frame
     */
    highlight() {
        setTimeout(() => {
            this.highlighter.highlight(this.searchTerm);
        }, 0);
    }

    /**
     * Invoked when user selects a node
     *
     * @param event CustomEvent for node-select
     */
    onNodeSelect(event: any): void {
        const entry: MinimalNodeEntryEntity = event.detail.node.entry;
        if (this.contentService.hasPermission(entry, 'update')) {
            this.chosenNode = entry;
        } else {
            this.resetChosenNode();
        }
    }

    /**
     * Sets showingSearchResults state to be able to differentiate between search results or folder results
     */
    onFolderChange() {
        this.showingSearchResults = false;
        this.chosenNode = null;
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
        // Multiple selections to be implemented...
        this.select.next([this.chosenNode]);
    }

    /**
     * Close the dialog
     */
    close(): void {
        this.containingDialog.close();
    }
}
