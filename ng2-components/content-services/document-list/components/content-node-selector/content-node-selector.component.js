"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@adf/core");
var core_2 = require("@angular/core");
var material_1 = require("@angular/material");
var document_list_component_1 = require("../document-list.component");
var ContentNodeSelectorComponent = (function () {
    function ContentNodeSelectorComponent(contentNodeSelectorService, contentService, data, containingDialog) {
        this.contentNodeSelectorService = contentNodeSelectorService;
        this.contentService = contentService;
        this.containingDialog = containingDialog;
        this.nodes = null;
        this.searchTerm = '';
        this.showingSearchResults = false;
        this.loadingSearchResults = false;
        this.inDialog = false;
        this.chosenNode = null;
        this.folderIdToShow = null;
        this.skipCount = 0;
        this.currentFolderId = null;
        this.rowFilter = null;
        this.imageResolver = null;
        this.pageSize = 10;
        this.select = new core_2.EventEmitter();
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
    ContentNodeSelectorComponent.prototype.ngOnInit = function () {
        this.folderIdToShow = this.currentFolderId;
        this.paginationStrategy = document_list_component_1.PaginationStrategy.Infinite;
    };
    /**
     * Updates the site attribute and starts a new search
     *
     * @param chosenSite Sitemodel to search within
     */
    ContentNodeSelectorComponent.prototype.siteChanged = function (chosenSite) {
        this.siteId = chosenSite.guid;
        this.updateResults();
    };
    /**
     * Updates the searchTerm attribute and starts a new search
     *
     * @param searchTerm string value to search against
     */
    ContentNodeSelectorComponent.prototype.search = function (searchTerm) {
        this.searchTerm = searchTerm;
        this.updateResults();
    };
    /**
     * Returns whether breadcrumb has to be shown or not
     */
    ContentNodeSelectorComponent.prototype.needBreadcrumbs = function () {
        var whenInFolderNavigation = !this.showingSearchResults, whenInSelectingSearchResult = this.showingSearchResults && this.chosenNode;
        return whenInFolderNavigation || whenInSelectingSearchResult;
    };
    Object.defineProperty(ContentNodeSelectorComponent.prototype, "breadcrumbFolderNode", {
        /**
         * Returns the actually selected|entered folder node or null in case of searching for the breadcrumb
         */
        get: function () {
            if (this.showingSearchResults && this.chosenNode) {
                return this.chosenNode;
            }
            else {
                return this.documentList.folderNode;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clear the search input
     */
    ContentNodeSelectorComponent.prototype.clear = function () {
        this.searchTerm = '';
        this.nodes = null;
        this.skipCount = 0;
        this.chosenNode = null;
        this.showingSearchResults = false;
        this.folderIdToShow = this.currentFolderId;
    };
    /**
     * Update the result list depending on the criterias
     */
    ContentNodeSelectorComponent.prototype.updateResults = function () {
        if (this.searchTerm.length === 0) {
            this.folderIdToShow = this.siteId || this.currentFolderId;
        }
        else {
            this.startNewSearch();
        }
    };
    /**
     * Load the first page of a new search result
     */
    ContentNodeSelectorComponent.prototype.startNewSearch = function () {
        this.nodes = null;
        this.skipCount = 0;
        this.chosenNode = null;
        this.folderIdToShow = null;
        this.querySearch();
    };
    /**
     * Loads the next batch of search results
     *
     * @param event Pagination object
     */
    ContentNodeSelectorComponent.prototype.getNextPageOfSearch = function (event) {
        this.skipCount = event.skipCount;
        this.querySearch();
    };
    /**
     * Perform the call to searchService with the proper parameters
     */
    ContentNodeSelectorComponent.prototype.querySearch = function () {
        if (this.isSearchTermLongEnough()) {
            this.loadingSearchResults = true;
            this.contentNodeSelectorService.search(this.searchTerm, this.siteId, this.skipCount, this.pageSize)
                .subscribe(this.showSearchResults.bind(this));
        }
    };
    /**
     * Show the results of the search
     *
     * @param results Search results
     */
    ContentNodeSelectorComponent.prototype.showSearchResults = function (results) {
        this.showingSearchResults = true;
        this.loadingSearchResults = false;
        // Documentlist hack, since data displaying for preloaded nodes is a little bit messy there
        if (!this.nodes) {
            this.nodes = results;
        }
        else {
            this.documentList.data.loadPage(results, true);
        }
        this.pagination = results.list.pagination;
        this.highlight();
    };
    /**
     * Predicate method to decide whether searchTerm fulfills the necessary criteria
     */
    ContentNodeSelectorComponent.prototype.isSearchTermLongEnough = function () {
        return this.searchTerm.length > 3;
    };
    /**
     * Hightlight the actual searchterm in the next frame
     */
    ContentNodeSelectorComponent.prototype.highlight = function () {
        var _this = this;
        setTimeout(function () {
            _this.highlighter.highlight(_this.searchTerm);
        }, 0);
    };
    /**
     * Invoked when user selects a node
     *
     * @param event CustomEvent for node-select
     */
    ContentNodeSelectorComponent.prototype.onNodeSelect = function (event) {
        this.attemptNodeSelection(event.detail.node.entry);
    };
    /**
     * Sets showingSearchResults state to be able to differentiate between search results or folder results
     */
    ContentNodeSelectorComponent.prototype.onFolderChange = function () {
        this.showingSearchResults = false;
    };
    /**
     * Attempts to set the currently loaded node
     */
    ContentNodeSelectorComponent.prototype.onFolderLoaded = function () {
        this.attemptNodeSelection(this.documentList.folderNode);
    };
    /**
     * Selects node as chosen if it has the right permission, clears the selection otherwise
     *
     * @param entry
     */
    ContentNodeSelectorComponent.prototype.attemptNodeSelection = function (entry) {
        if (this.contentService.hasPermission(entry, 'create')) {
            this.chosenNode = entry;
        }
        else {
            this.resetChosenNode();
        }
    };
    /**
     * Clears the chosen node
     */
    ContentNodeSelectorComponent.prototype.resetChosenNode = function () {
        this.chosenNode = null;
    };
    /**
     * Emit event with the chosen node
     */
    ContentNodeSelectorComponent.prototype.choose = function () {
        this.select.next([this.chosenNode]);
    };
    /**
     * Close the dialog
     */
    ContentNodeSelectorComponent.prototype.close = function () {
        this.containingDialog.close();
    };
    __decorate([
        core_2.Input()
    ], ContentNodeSelectorComponent.prototype, "title", void 0);
    __decorate([
        core_2.Input()
    ], ContentNodeSelectorComponent.prototype, "currentFolderId", void 0);
    __decorate([
        core_2.Input()
    ], ContentNodeSelectorComponent.prototype, "rowFilter", void 0);
    __decorate([
        core_2.Input()
    ], ContentNodeSelectorComponent.prototype, "imageResolver", void 0);
    __decorate([
        core_2.Input()
    ], ContentNodeSelectorComponent.prototype, "pageSize", void 0);
    __decorate([
        core_2.Output()
    ], ContentNodeSelectorComponent.prototype, "select", void 0);
    __decorate([
        core_2.ViewChild(document_list_component_1.DocumentListComponent)
    ], ContentNodeSelectorComponent.prototype, "documentList", void 0);
    __decorate([
        core_2.ViewChild(core_1.HighlightDirective)
    ], ContentNodeSelectorComponent.prototype, "highlighter", void 0);
    ContentNodeSelectorComponent = __decorate([
        core_2.Component({
            selector: 'adf-content-node-selector',
            styleUrls: ['./content-node-selector.component.scss'],
            templateUrl: './content-node-selector.component.html',
            encapsulation: core_2.ViewEncapsulation.None
        }),
        __param(2, core_2.Optional()), __param(2, core_2.Inject(material_1.MAT_DIALOG_DATA)),
        __param(3, core_2.Optional())
    ], ContentNodeSelectorComponent);
    return ContentNodeSelectorComponent;
}());
exports.ContentNodeSelectorComponent = ContentNodeSelectorComponent;
