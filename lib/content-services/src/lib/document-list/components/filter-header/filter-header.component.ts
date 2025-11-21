/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataSorting, HeaderFilterTemplateDirective, PaginationModel } from '@alfresco/adf-core';
import { SearchHeaderQueryBuilderService } from '../../../search/services/search-header-query-builder.service';
import { FilterSearch } from './../../../search/models/filter-search.interface';
import { SearchFilterContainerComponent } from '../../../search/components/search-filter-container/search-filter-container.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { NodePaging } from '@alfresco/js-api';

@Component({
    selector: 'adf-filter-header',
    imports: [HeaderFilterTemplateDirective, SearchFilterContainerComponent],
    templateUrl: './filter-header.component.html'
})
export class FilterHeaderComponent implements OnInit, OnChanges {
    /** (optional) Initial filter value to sort . */
    @Input()
    value: any = {};

    /** The id of the current folder of the document list. */
    @Input({ required: true })
    currentFolderId: string;

    /** Pagination model from the document list */
    @Input()
    pagination: PaginationModel;

    /** Sorting configuration from the document list */
    @Input()
    sorting: DataSorting[];

    /** Emitted when a filter value is selected */
    @Output()
    filterSelection: EventEmitter<FilterSearch[]> = new EventEmitter();

    /** Emitted when search results are ready */
    @Output()
    searchResultsReady: EventEmitter<NodePaging> = new EventEmitter();

    /** Emitted when filters are cleared and document list should reload */
    @Output()
    filtersCleared: EventEmitter<void> = new EventEmitter();

    isFilterServiceActive: boolean;

    private readonly destroyRef = inject(DestroyRef);

    constructor(private searchFilterQueryBuilder: SearchHeaderQueryBuilderService) {
        this.isFilterServiceActive = this.searchFilterQueryBuilder.isFilterServiceActive();
    }

    ngOnInit() {
        this.searchFilterQueryBuilder.executed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((resultSetPaging) => {
            // ResultSetPaging is structurally compatible with NodePaging for the document list
            // The data adapter can handle both types
            this.searchResultsReady.emit(resultSetPaging as unknown as NodePaging);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['currentFolderId']?.currentValue) {
            this.resetFilterHeader();
            this.configureSearchParent(changes['currentFolderId'].currentValue);
        }

        if (changes['pagination']?.currentValue) {
            const pagination = changes['pagination'].currentValue as PaginationModel;
            this.searchFilterQueryBuilder.setupCurrentPagination(pagination.maxItems, pagination.skipCount);
        }

        if (changes['sorting']?.currentValue) {
            const sorting = changes['sorting'].currentValue as DataSorting[];
            this.searchFilterQueryBuilder.setSorting(sorting);
        }
    }

    onFilterSelectionChange() {
        this.filterSelection.emit(this.searchFilterQueryBuilder.getActiveFilters());
        if (this.searchFilterQueryBuilder.isNoFilterActive()) {
            this.filtersCleared.emit();
        }
    }

    resetFilterHeader() {
        this.searchFilterQueryBuilder.resetActiveFilters();
    }

    private configureSearchParent(currentFolderId: string) {
        if (this.searchFilterQueryBuilder.isCustomSourceNode(currentFolderId)) {
            this.searchFilterQueryBuilder.getNodeIdForCustomSource(currentFolderId).subscribe((node) => {
                this.initSearchHeader(node.id);
            });
        } else {
            this.initSearchHeader(currentFolderId);
        }
    }

    private initSearchHeader(currentFolderId: string) {
        this.searchFilterQueryBuilder.setCurrentRootFolderId(currentFolderId);
        if (this.value) {
            Object.keys(this.value).forEach((columnKey) => {
                this.searchFilterQueryBuilder.setActiveFilter(columnKey, this.value[columnKey]);
            });
        }
    }
}
