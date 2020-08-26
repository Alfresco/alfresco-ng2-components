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

import { Component, Inject, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { PaginationModel } from '@alfresco/adf-core';
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
    currentFolderId: string;

    /** Maximum number of search results to show in a page. */
    @Input()
    maxItems: number;

    /** The offset of the start of the page within the results list. */
    @Input()
    skipCount: number;

    /** The sorting to apply to the the filter. */
    @Input()
    sorting: string = null;

    /** Emitted when a filter value is selected */
    @Output()
    filterSelection: EventEmitter<FilterSearch[]> = new EventEmitter();

    isFilterServiceActive: boolean;
    private onDestroy$ = new Subject<boolean>();

    constructor(
        @Inject(DocumentListComponent) private documentList: DocumentListComponent,
        @Inject(SEARCH_QUERY_SERVICE_TOKEN) private searchHeaderQueryBuilder: SearchFilterQueryBuilderService) {
        this.isFilterServiceActive = this.searchHeaderQueryBuilder.isFilterServiceActive();
    }

    ngOnInit() {
        this.documentList.pagination
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((newPagination: PaginationModel) => {
                this.searchHeaderQueryBuilder.setupCurrentPagination(newPagination.maxItems, newPagination.skipCount);
            });

        this.searchHeaderQueryBuilder.executed
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((newNodePaging: NodePaging) => {
                this.documentList.node = newNodePaging;
                this.documentList.reload();
            });

        const [key, direction] = this.documentList.sorting;
        this.searchHeaderQueryBuilder.setSorting(key, direction);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['currentFolderId'] && changes['currentFolderId'].currentValue) {
            this.resetFilterHeader();
            this.configureSearchParent(changes['currentFolderId'].currentValue);
        }
    }

    onFilterSelectionChange() {
        this.filterSelection.emit(this.searchHeaderQueryBuilder.getActiveFilters());
    }

    resetFilterHeader() {
        this.searchHeaderQueryBuilder.resetActiveFilters();
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
