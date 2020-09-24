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

import { Injectable } from '@angular/core';
import { AlfrescoApiService, AppConfigService, NodesApiService } from '@alfresco/adf-core';
import { SearchConfiguration } from './search-configuration.interface';
import { BaseQueryBuilderService } from './base-query-builder.service';
import { SearchCategory } from './search-category.interface';
import { MinimalNode, QueryBody } from '@alfresco/js-api';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SearchSortingDefinition } from './search-sorting-definition.interface';

@Injectable({
    providedIn: 'root'
})
export class SearchFilterQueryBuilderService extends BaseQueryBuilderService {

    private customSources = ['-trashcan-', '-sharedlinks-', '-sites-', '-mysites-', '-favorites-', '-recent-', '-my-'];

    activeFilters: Map<string, string> = new Map();

    constructor(appConfig: AppConfigService, alfrescoApiService: AlfrescoApiService, private nodeApiService: NodesApiService) {
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
        this.activeFilters.set(columnActivated, filterValue);
    }

    getActiveFilters(): Map<string, string> {
        return this.activeFilters;
    }

    isNoFilterActive(): boolean {
        return this.activeFilters.size === 0;
    }

    removeActiveFilter(columnRemoved: string) {
        if (this.activeFilters.get(columnRemoved) !== null) {
            this.activeFilters.delete(columnRemoved);
        }
    }

    setSorting(column: string, direction: string) {
        const optionAscending = direction.toLocaleLowerCase() === 'asc' ? true : false;
        const fieldValue = this.getSortingFieldFromColumnName(column);
        const currentSort: SearchSortingDefinition = { key: column, label: 'current', type: 'FIELD', field: fieldValue, ascending: optionAscending};
        this.sorting = [currentSort];
        this.execute();
    }

    private getSortingFieldFromColumnName(columnName: string) {
        if (this.sortingOptions.length > 0) {
            const sortOption: SearchSortingDefinition = this.sortingOptions.find((option: SearchSortingDefinition) => option.key === columnName);
            return sortOption.field;
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
    }

    isCustomSourceNode(currentNodeId: string): boolean {
        return this.customSources.includes(currentNodeId);
    }

    getNodeIdForCustomSource(customSourceId: string): Observable<MinimalNode> {
        return this.nodeApiService.getNode(customSourceId);
    }

}
