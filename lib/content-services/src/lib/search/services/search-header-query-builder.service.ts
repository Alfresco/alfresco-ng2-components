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

import { Injectable } from '@angular/core';
import { AlfrescoApiService, AppConfigService, DataSorting } from '@alfresco/adf-core';
import { SearchConfiguration } from '../models/search-configuration.interface';
import { BaseQueryBuilderService } from './base-query-builder.service';
import { SearchCategory } from '../models/search-category.interface';
import { MinimalNode, QueryBody } from '@alfresco/js-api';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SearchSortingDefinition } from '../models/search-sorting-definition.interface';
import { FilterSearch } from '../models/filter-search.interface';
import { NodesApiService } from '../../common/services/nodes-api.service';

@Injectable({
    providedIn: 'root'
})
export class SearchHeaderQueryBuilderService extends BaseQueryBuilderService {

    private customSources = ['-trashcan-', '-sharedlinks-', '-sites-', '-mysites-', '-favorites-', '-recent-', '-my-'];

    activeFilters: FilterSearch[] = [];

    constructor(appConfig: AppConfigService,
                alfrescoApiService: AlfrescoApiService,
                private nodeApiService: NodesApiService) {
        super(appConfig, alfrescoApiService);

        this.updated.pipe(
            filter((query: QueryBody) => !!query)).subscribe(() => {
            this.execute();
        });
    }

    public isFilterServiceActive(): boolean {
        return true;
    }

    loadConfiguration(): SearchConfiguration {
        return this.appConfig.get<SearchConfiguration>('search-headers');
    }

    setupCurrentPagination(maxItems: number, skipCount: number) {
        if (!this.paging ||
            (this.paging &&
                this.paging.maxItems !== maxItems || this.paging.skipCount !== skipCount)) {
            this.paging = { maxItems, skipCount };
            this.execute();
        }
    }

    setActiveFilter(columnActivated: string, filterValue: string) {
        const selectedFilter = this.activeFilters.find((activeFilter) => activeFilter.key === columnActivated);
        if (!selectedFilter) {
            this.activeFilters.push({
                key: columnActivated,
                value: filterValue
            });
        } else {
            selectedFilter.value = filterValue;
        }
    }

    resetActiveFilters() {
        this.activeFilters = [];
    }

    getActiveFilters(): FilterSearch[] {
        return this.activeFilters;
    }

    isNoFilterActive(): boolean {
        return this.activeFilters.length === 0;
    }

    removeActiveFilter(columnRemoved: string) {
        const filterIndex = this.activeFilters.map((activeFilter) => activeFilter.key).indexOf(columnRemoved);
        if (filterIndex >= 0) {
            this.activeFilters.splice(filterIndex, 1);
        }
    }

    setSorting(dataSorting: DataSorting[]) {
        this.sorting = [];
        dataSorting.forEach((columnSorting: DataSorting) => {
            const fieldValue = this.getSortingFieldFromColumnName(columnSorting.key);
            if (fieldValue) {
                const optionAscending = columnSorting.direction.toLocaleLowerCase() === 'asc';
                const type = fieldValue === 'score' ? 'SCORE' : 'FIELD';
                const currentSort: SearchSortingDefinition = {
                    key: columnSorting.key,
                    label: 'current',
                    type,
                    field: fieldValue,
                    ascending: optionAscending
                };
                this.sorting.push(currentSort);
            }
        });

        this.execute();
    }

    private getSortingFieldFromColumnName(columnName: string) {
        if (this.sortingOptions.length > 0) {
            const sortOption: SearchSortingDefinition = this.sortingOptions.find((option: SearchSortingDefinition) => option.key === columnName);
            return sortOption ? sortOption.field : '';
        }
        return '';
    }

    getCategoryForColumn(columnKey: string): SearchCategory {
        let foundCategory = null;
        if (this.categories !== null) {
            foundCategory = this.categories.find(
                category => category.columnKey === columnKey
            );
        }
        return foundCategory;
    }

    setCurrentRootFolderId(currentFolderId: string) {
        const alreadyAddedFilter = this.filterQueries.find(filterQueries =>
            filterQueries.query.includes(currentFolderId)
        );

        if (alreadyAddedFilter !== undefined) {
            this.filterQueries = [];
        }

        this.filterQueries = [{
            query: `PARENT:"workspace://SpacesStore/${currentFolderId}"`
        }];

        this.execute();
    }

    isCustomSourceNode(currentNodeId: string): boolean {
        return this.customSources.includes(currentNodeId);
    }

    getNodeIdForCustomSource(customSourceId: string): Observable<MinimalNode> {
        return this.nodeApiService.getNode(customSourceId);
    }

}
