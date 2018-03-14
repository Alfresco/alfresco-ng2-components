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

import { SearchConfig, SearchCategory, FilterQuery } from './search-config-api';
import { Subject } from 'rxjs/Subject';
import { QueryBody } from 'alfresco-js-api';

export class SearchQueryBuilder {

    updated: Subject<QueryBody> = new Subject();

    categories: Array<SearchCategory> = [];
    queryFragments: { [id: string]: string } = {};
    fields: { [id: string]: string } = {};
    scope: { locations?: string };
    filterQueries: FilterQuery[] = [];

    constructor(public config: SearchConfig) {
        if (!config) {
            throw new Error('Search configuration not found.');
        }

        this.categories = config.query.categories.filter(f => f.enabled);
        this.filterQueries = config.filterQueries || [];
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

    update(): void {
        const query = this.buildQuery();
        this.updated.next(query);
    }

    buildQuery(): QueryBody {
        let query = '';
        const fields = [];

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
