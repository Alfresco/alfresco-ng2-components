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

import { Component, Host, Inject, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { DocumentListComponent } from '../document-list.component';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../../search/search-query-service.token';
import { SearchFilterQueryBuilderService } from '../../../search/search-filter-query-builder.service';
import { FilterSearch } from './../../../search/filter-search.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NodePaging, MinimalNode } from '@alfresco/js-api';

@Component({
    selector: 'adf-filter-header',
    templateUrl: './filter-header.component.html'
})
export class FilterHeaderComponent implements OnInit, OnChanges {

    /** (optional) Initial filter value to sort . */
    @Input()
    value: any;

    /** The id of the current folder of the document list. */
    @Input()
    currentFolderNodeId: string;

    /** Maximum number of search results to show in a page. */
    @Input()
    maxItems: number;

    /** The offset of the start of the page within the results list. */
    @Input()
    skipCount: number;

    /** The sorting to apply to the the filter. */
    @Input()
    sorting: string = null;

    /** Emitted when the result of the filter is received from the API. */
    @Output()
    update: EventEmitter<NodePaging> = new EventEmitter();

    /** Emitted when the last of all the filters is cleared. */
    @Output()
    resetFilter: EventEmitter<any> = new EventEmitter();

    /** Emitted when a filter value is selected */
    @Output()
    selection: EventEmitter<Map<string, string>> = new EventEmitter();

    isFilterServiceActive: boolean;
    private onDestroy$ = new Subject<boolean>();

    constructor(
        @Host() documentList: DocumentListComponent,
        @Inject(SEARCH_QUERY_SERVICE_TOKEN) private searchHeaderQueryBuilder: SearchFilterQueryBuilderService) {

        this.isFilterServiceActive = this.searchHeaderQueryBuilder.isFilterServiceActive();
    }

    ngOnInit() {
        this.searchHeaderQueryBuilder.executed
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((newNodePaging: NodePaging) => {
                this.update.emit(newNodePaging);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['currentFolderNodeId'] && changes['currentFolderNodeId'].currentValue) {
            this.resetFilterHeader();
            this.configureSearchParent(changes['currentFolderNodeId'].currentValue);
        }

        if (changes['maxItems'] || changes['skipCount']) {
            let actualMaxItems = this.maxItems;
            let actualSkipCount = this.skipCount;

            if (changes['maxItems'] && changes['maxItems'].currentValue) {
                actualMaxItems = changes['maxItems'].currentValue;
            }
            if (changes['skipCount'] && changes['skipCount'].currentValue) {
                actualSkipCount = changes['skipCount'].currentValue;
            }

            this.searchHeaderQueryBuilder.setupCurrentPagination(actualMaxItems, actualSkipCount);
        }

        if (changes['sorting'] && changes['sorting'].currentValue) {
            // const [key, value] = changes['sorting'].currentValue.split('-');
            // if (key === this.col.key) {
            //     this.searchHeaderQueryBuilder.setSorting(key, value);
            // }
        }

    }

    onFilterSelected(newSearch: FilterSearch) {
        this.searchHeaderQueryBuilder.setActiveFilter(newSearch.key, newSearch.value);
        this.selection.emit(this.searchHeaderQueryBuilder.getActiveFilters());
    }

    resetFilterHeader() {
        // if (this.widgetContainer && this.isActive()) {
        //     this.widgetContainer.resetInnerWidget();
        //     this.searchHeaderQueryBuilder.removeActiveFilter(this.category.columnKey);
        //     this.selection.emit(this.searchHeaderQueryBuilder.getActiveFilters());
        //     if (this.searchHeaderQueryBuilder.isNoFilterActive()) {
        //         this.clear.emit();
        //     }
        // }
    }

    private configureSearchParent(currentFolderNodeId: string) {
        if (this.searchHeaderQueryBuilder.isCustomSourceNode(currentFolderNodeId)) {
            this.searchHeaderQueryBuilder.getNodeIdForCustomSource(currentFolderNodeId).subscribe((node: MinimalNode) => {
                this.initSearchHeader(node.id);
            });
        } else {
            this.initSearchHeader(currentFolderNodeId);
        }
    }

    private initSearchHeader(currentFolderId: string) {
        this.searchHeaderQueryBuilder.setCurrentRootFolderId(currentFolderId);
        // if (this.value) {
        //     this.searchHeaderQueryBuilder.setActiveFilter(this.category.columnKey, this.initialValue);
        //     this.initialValue = this.value;
        // }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

}
