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
import { SearchConfig, SearchCategoryConfig, QueryBuilderContext } from './facets/facets-api';

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

    constructor(private preferences: UserPreferencesService,
                private route: ActivatedRoute,
                private api: AlfrescoApiService,
                appConfig: AppConfigService,
                private searchConfig: SearchConfigurationService) {
        this.config = appConfig.get<SearchConfig>('search');
        // tslint:disable-next-line:no-console
        console.log(this.config);

        this.categories = this.config.query.categories.filter(f => f.enabled);

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
            const data: NodePaging = await this.api.searchApi.search(query);
            // tslint:disable-next-line:no-console
            console.log(data);
            this.onDataLoaded(data);
        }
    }

    onDataLoaded(data: NodePaging) {
        this.data = data;
    }

    buildQuery(maxResults: number, skipCount: number): QueryBody {
        let query = '';
        const fields = [];

        this.categories.forEach(facet => {
            const facetQuery = this.context.query[facet.id];
            if (facetQuery) {
                if (query.length > 0) {
                    query += ' AND ';
                }
                query += `(${facetQuery})`;
            }

            const facetFields = this.context.fields[facet.id];
            if (facetFields && facetFields.length > 0) {
                for (const field of facetFields) {
                    if (!fields.includes(field)) {
                        fields.push(field);
                    }
                }
            }
        });

        // tslint:disable-next-line:no-console
        console.log(query, fields, this.context.scope);

        if (query) {

            const result: QueryBody = {
                query: {
                    query: query,
                    language: 'afts'
                },
                include: ['path', 'allowableOperations'],
                fields: fields,
                paging: {
                    // https://issues.alfresco.com/jira/browse/ADF-2448
                    maxItems: `${maxResults}`,
                    skipCount: `${skipCount}`
                },
                filterQueries: [
                    { query: `TYPE:'cm:folder' OR TYPE:'cm:content'` },
                    { query: 'NOT cm:creator:System' }
                ],
                facetQueries: [
                    { query: 'created:2018', label: 'CreatedThisYear' },
                    { query: 'content.mimetype', label: 'Type' },
                    {'query': 'content.size:[0 TO 10240]', 'label': 'xtra small'},
                    {'query': 'content.size:[10240 TO 102400]', 'label': 'small'},
                    {'query': 'content.size:[102400 TO 1048576]', 'label': 'medium'},
                    {'query': 'content.size:[1048576 TO 16777216]', 'label': 'large'},
                    {'query': 'content.size:[16777216 TO 134217728]', 'label': 'xtra large'},
                    {'query': 'content.size:[134217728 TO MAX]', 'label': 'XX large'}
                ],
                facetFields: {
                    facets: [
                        { field: 'content.mimetype' },
                        { field: 'content.size' }
                        // { field: 'creator', mincount: 1 },
                        // { field: 'modifier', mincount: 1 }
                    ]
                },
                limits: this.config.limits,
                scope: this.context.scope
            };

            return result;
        }

        return null;
    }
}
