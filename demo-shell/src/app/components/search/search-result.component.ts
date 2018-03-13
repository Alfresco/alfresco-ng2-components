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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodePaging, QueryBody } from 'alfresco-js-api';
import { UserPreferencesService, AppConfigService, AlfrescoApiService, SearchConfigurationService } from '@alfresco/adf-core';
import { SearchConfig, SearchCategoryConfig, QueryBuilderContext, FacetQuery, FacetField, FilterQuery, FacetFieldBucket, ResponseFacetField } from './facets/facets-api';
import { MatCheckboxChange } from '@angular/material';

@Component({
    selector: 'app-search-result-component',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

    data: NodePaging;
    config: SearchConfig;

    categories: Array<SearchCategoryConfig> = [];
    context: QueryBuilderContext;

    responseFacetQueries: FacetQuery[] = [];
    responseFacetFields: FacetField[] = [];
    filterQueries: FilterQuery[] = [];

    selectedFacetQueries: FacetQuery[] = [];
    selectedBuckets: FacetFieldBucket[] = [];

    constructor(private preferences: UserPreferencesService,
                private route: ActivatedRoute,
                private api: AlfrescoApiService,
                appConfig: AppConfigService,
                private searchConfig: SearchConfigurationService) {
        this.config = appConfig.get<SearchConfig>('search');
        this.categories = this.config.query.categories.filter(f => f.enabled);
        this.filterQueries = this.config.filterQueries || [];

        this.context = {
            config: this.config,
            query: {},
            fields: {},
            scope: {
                locations: null // nodes|deleted-nodes|versions
            },
            update: () => this.updateQuery()
        };
    }

    async ngOnInit() {
        if (this.route) {
            this.route.params.subscribe(params => {
                const searchTerm = params['q'];
                if (searchTerm) {
                    const query = this.searchConfig.generateQueryBody(searchTerm, '100', '0');
                    this.api.searchApi.search(query).then(data => this.onDataLoaded(data));
                }
            });
        }
    }

    async updateQuery() {
        // tslint:disable-next-line:no-console
        console.log(this.context);
        this.search();
    }

    async search() {
        const query = this.buildQuery(this.preferences.paginationSize, 0);
        if (query) {
            const data = await this.api.searchApi.search(query);
            this.onDataLoaded(data);
        }
    }

    onDataLoaded(data: any) {
        this.data = data;
        const context = data.list.context;

        if (context) {
            const queryLabels = this.selectedFacetQueries.map(q => q.label);
            this.responseFacetQueries = (context.facetQueries || []).map(q => {
                if (queryLabels.includes(q.label)) {
                    q.$checked = true;
                }
                return q;
            });

            const bucketLabels = this.selectedBuckets.map(b => b.label);
            this.responseFacetFields = (context.facetsFields || []).map(
                (f: ResponseFacetField) => {
                    (f.buckets || []).forEach(b => {
                        if (bucketLabels.includes(b.label)) {
                            b.$checked = true;
                        }
                    });
                    return f;
                }
            );
        } else {
            this.responseFacetQueries = [];
            this.responseFacetFields = [];
        }
    }

    buildQuery(maxResults: number, skipCount: number): QueryBody {
        let query = '';
        const fields = [];

        this.categories.forEach(facet => {
            const customQuery = this.context.query[facet.id];
            if (customQuery) {
                if (query.length > 0) {
                    query += ' AND ';
                }
                query += `(${customQuery})`;
            }

            const customFields = this.context.fields[facet.id];
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
                paging: {
                    maxItems: maxResults,
                    skipCount: skipCount
                },
                filterQueries: this.filterQueries,
                facetQueries: this.config.facetQueries,
                facetFields: this.config.facetFields,
                limits: this.config.limits,
                scope: this.context.scope
            };

            return result;
        }

        return null;
    }

    onFacetQueryToggle(event: MatCheckboxChange, query: FacetQuery) {
        const facetQuery = this.config.facetQueries.find(q => q.label === query.label);

        if (event.checked) {
            this.selectedFacetQueries.push({ ...facetQuery });
            if (facetQuery) {
                this.filterQueries.push({ query: facetQuery.query });
            }
            query.$checked = true;
        } else {
            this.selectedFacetQueries = this.selectedFacetQueries.filter(q => q.label !== query.label);
            if (facetQuery) {
                this.filterQueries = this.filterQueries.filter(f => f.query !== facetQuery.query);
            }
            query.$checked = false;
        }

        this.search();
    }

    removeFacetQuery(query: FacetQuery) {
        this.selectedFacetQueries = this.selectedFacetQueries.filter(q => q.label !== query.label);
        this.filterQueries = this.filterQueries.filter(f => f.query !== query.query);

        this.search();
    }

    onFacetToggle(event: MatCheckboxChange, field: ResponseFacetField, bucket: FacetFieldBucket) {
        // tslint:disable-next-line:no-console
        console.log(event, field, bucket);
        if (event.checked) {
            this.selectedBuckets.push({ ...bucket });
            this.filterQueries.push({ query: bucket.filterQuery });
            bucket.$checked = true;
        } else {
            this.selectedBuckets = this.selectedBuckets.filter(b => b.label !== bucket.label);
            this.filterQueries = this.filterQueries.filter(f => f.query !== bucket.filterQuery);
            bucket.$checked = false;
        }

        this.search();
    }
}
