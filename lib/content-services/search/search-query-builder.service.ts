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
import { QueryBody } from 'alfresco-js-api';
import { SearchCategory } from './search-category.interface';
import { FilterQuery } from './filter-query.interface';
import { SearchRange } from './search-range.interface';
import { SearchConfiguration } from './search-configuration.interface';
import { FacetQuery } from './facet-query.interface';

@Injectable()
export class SearchQueryBuilderService {

    updated: Subject<QueryBody> = new Subject();
    executed: Subject<any> = new Subject();

    categories: Array<SearchCategory> = [];
    queryFragments: { [id: string]: string } = {};
    fields: { [id: string]: string[] } = {};
    scope: { locations?: string };
    filterQueries: FilterQuery[] = [];
    ranges: { [id: string]: SearchRange } = {};

    config: SearchConfiguration;

    constructor(appConfig: AppConfigService,  private api: AlfrescoApiService) {
        this.config = appConfig.get<SearchConfiguration>('search');
        if (!this.config) {
            throw new Error('Search configuration not found.');
        }

        if (this.config.query && this.config.query.categories) {
            this.categories = this.config.query.categories.filter(f => f.enabled);
        }

        this.filterQueries = this.config.filterQueries || [];
        this.scope = {
            locations: null
        };
    }

    addFilterQuery(query: string): void {
        if (query) {
            const existing = this.filterQueries.find(q => q.query === query);
            if (!existing) {
                this.filterQueries.push({ query: query });
            }
        }
    }

    removeFilterQuery(query: string): void {
        if (query) {
            this.filterQueries = this.filterQueries.filter(f => f.query !== query);
        }
    }

    getFacetQuery(label: string): FacetQuery {
        if (label) {
            const queries = this.config.facetQueries || [];
            return queries.find(q => q.label === label);
        }
        return null;
    }

    update(): void {
        const query = this.buildQuery();
        this.updated.next(query);
    }

    async execute() {
        const query = this.buildQuery();
        const data = await this.api.searchApi.search(query);
        this.executed.next(data);
    }

    buildQuery(): QueryBody {
        let query = '';
        const fields: string[] = [];

        this.categories.forEach(facet => {
            const customQuery = this.queryFragments[facet.id];
            if (customQuery) {
                if (query.length > 0) {
                    query += ' AND ';
                }
                query += `(${customQuery})`;
            }

            const customFields = this.fields[facet.id];
            if (customFields && customFields.length > 0) {
                for (const field of customFields) {
                    if (!fields.includes(field)) {
                        fields.push(field);
                    }
                }
            }
        });

        if (query) {

            const result: QueryBody = {
                query: {
                    query: query,
                    language: 'afts'
                },
                include: ['path', 'allowableOperations'],
                fields: fields,
                /*
                paging: {
                    maxItems: maxResults,
                    skipCount: skipCount
                },
                */
                filterQueries: this.filterQueries,
                facetQueries: this.config.facetQueries,
                facetFields: this.config.facetFields,
                limits: this.config.limits,
                scope: this.scope
            };

            return result;
        }

        return null;
    }
}
