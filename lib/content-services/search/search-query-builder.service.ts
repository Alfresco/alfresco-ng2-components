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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { QueryBody, RequestFacetFields, RequestFacetField, RequestSortDefinitionInner } from 'alfresco-js-api';
import { SearchCategory } from './search-category.interface';
import { FilterQuery } from './filter-query.interface';
import { SearchRange } from './search-range.interface';
import { SearchConfiguration } from './search-configuration.interface';
import { FacetQuery } from './facet-query.interface';
import { SearchSortingDefinition } from './search-sorting-definition.interface';
import { FacetField } from './facet-field.interface';

@Injectable()
export class SearchQueryBuilderService {

    private _userQuery = '';

    updated: Subject<QueryBody> = new Subject();
    executed: Subject<any> = new Subject();

    categories: Array<SearchCategory> = [];
    queryFragments: { [id: string]: string } = {};
    filterQueries: FilterQuery[] = [];
    paging: { maxItems?: number; skipCount?: number } = null;
    sorting: Array<SearchSortingDefinition> = [];

    get userQuery(): string {
        return this._userQuery;
    }

    set userQuery(value: string) {
        value = (value || '').trim();
        this._userQuery = value ? `(${value})` : '';
    }

    config: SearchConfiguration;

    // TODO: to be supported in future iterations
    ranges: { [id: string]: SearchRange } = {};

    constructor(appConfig: AppConfigService, private alfrescoApiService: AlfrescoApiService) {
        this.config = appConfig.get<SearchConfiguration>('search');

        if (this.config) {
            this.categories = (this.config.categories || []).filter(category => category.enabled);
            this.filterQueries = this.config.filterQueries || [];

            if (this.config.sorting) {
                this.sorting = this.config.sorting.defaults || [];
            }
        }
    }

    addFilterQuery(query: string): void {
        if (query) {
            const existing = this.filterQueries.find(filterQuery => filterQuery.query === query);
            if (!existing) {
                this.filterQueries.push({ query: query });
            }
        }
    }

    removeFilterQuery(query: string): void {
        if (query) {
            this.filterQueries = this.filterQueries
                .filter(filterQuery => filterQuery.query !== query);
        }
    }

    getFacetQuery(label: string): FacetQuery {
        if (label && this.hasFacetQueries) {
            return this.config.facetQueries.queries.find(query => query.label === label);
        }
        return null;
    }

    getFacetField(label: string): FacetField {
        if (label) {
            const fields = this.config.facetFields || [];
            return fields.find(field => field.label === label);
        }
        return null;
    }

    update(): void {
        const query = this.buildQuery();
        this.updated.next(query);
    }

    async execute() {
        const query = this.buildQuery();
        const data = await this.alfrescoApiService.searchApi.search(query);
        this.executed.next(data);
    }

    buildQuery(): QueryBody {
        let query = this.getFinalQuery();

        const include = this.config.include || [];
        if (include.length === 0) {
            include.push('path', 'allowableOperations');
        }

        if (query) {
            const result: QueryBody = {
                query: {
                    query: query,
                    language: 'afts'
                },
                include: include,
                paging: this.paging,
                fields: this.config.fields,
                filterQueries: this.filterQueries,
                facetQueries: this.facetQueries,
                facetFields: this.facetFields,
                sort: this.sort
            };

            return result;
        }

        return null;
    }

    /**
     * Returns primary sorting definition.
     */
    getPrimarySorting(): SearchSortingDefinition {
        if (this.sorting && this.sorting.length > 0) {
            return this.sorting[0];
        }
        return null;
    }

    /**
     * Returns all pre-configured sorting options that users can choose from.
     */
    getSortingOptions(): SearchSortingDefinition[] {
        if (this.config && this.config.sorting) {
            return this.config.sorting.options || [];
        }
        return [];
    }

    /**
     * Check if FacetQueries has been defined
     */
    get hasFacetQueries(): boolean {
        if (this.config
            && this.config.facetQueries
            && this.config.facetQueries.queries
            && this.config.facetQueries.queries.length > 0) {
            return true;
        }
        return false;
    }

    private get sort(): RequestSortDefinitionInner[] {
        return this.sorting.map(def => {
            return {
                type: def.type,
                field: def.field,
                ascending: def.ascending
            };
        });
    }

    private get facetQueries(): FacetQuery[] {
        if (this.hasFacetQueries) {
            return this.config.facetQueries.queries.map(query => {
                return <FacetQuery> { ...query };
            });
        }

        return null;
    }

    private getFinalQuery(): string {
        let query = '';

        this.categories.forEach(facet => {
            const customQuery = this.queryFragments[facet.id];
            if (customQuery) {
                if (query.length > 0) {
                    query += ' AND ';
                }
                query += `(${customQuery})`;
            }
        });

        const result = [this.userQuery, query]
            .filter(entry => entry)
            .join(' AND ');

        return result;
    }

    private get facetFields(): RequestFacetFields {
        const facetFields = this.config.facetFields;

        if (facetFields && facetFields.length > 0) {
            return {
                facets: facetFields.map(facet => <RequestFacetField> {
                    field: facet.field,
                    mincount: facet.mincount,
                    label: facet.label,
                    limit: facet.limit,
                    offset: facet.offset,
                    prefix: facet.prefix
                })
            };
        }

        return null;
    }
}
