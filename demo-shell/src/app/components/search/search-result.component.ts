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
import { MatCheckboxChange } from '@angular/material';
import { NodePaging, QueryBody } from 'alfresco-js-api';
import { AppConfigService, AlfrescoApiService } from '@alfresco/adf-core';
import {
    SearchConfiguration, SearchCategory, FacetQuery, FacetFieldBucket,
    ResponseFacetField, ResponseFacetQuery, SearchQueryBuilder
} from '@alfresco/adf-content-services';

@Component({
    selector: 'app-search-result-component',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

    data: NodePaging;
    config: SearchConfiguration;

    queryBuilder: SearchQueryBuilder;

    responseFacetQueries: FacetQuery[] = [];
    responseFacetFields: ResponseFacetField[] = [];

    selectedFacetQueries: string[] = [];
    selectedBuckets: FacetFieldBucket[] = [];

    constructor(private route: ActivatedRoute,
                private api: AlfrescoApiService,
                appConfig: AppConfigService) {
        this.config = appConfig.get<SearchConfiguration>('search');

        this.queryBuilder = new SearchQueryBuilder(this.config);
        this.queryBuilder.updated.subscribe(query => {
            this.search(query);
        });
    }

    async ngOnInit() {
        if (this.route) {
            this.route.params.subscribe(params => {
                const searchTerm = params['q'];
                if (searchTerm) {
                    this.queryBuilder.queryFragments['queryName'] = `cm:name:'${searchTerm}'`;
                    this.queryBuilder.update();
                }
            });
        }
    }

    async search(query: QueryBody) {
        if (query) {
            const data = await this.api.searchApi.search(query);
            this.onDataLoaded(data);
        }
    }

    onDataLoaded(data: any) {
        this.data = data;
        const context = data.list.context;

        if (context) {
            this.responseFacetQueries = (context.facetQueries || []).map(q => {
                q.$checked = this.selectedFacetQueries.includes(q.label);
                return q;
            });

            const expandedFields = this.responseFacetFields.filter(f => f.$expanded).map(f => f.label);

            this.responseFacetFields = (context.facetsFields || []).map(
                (field: ResponseFacetField) => {
                    field.$expanded = expandedFields.includes(field.label);

                    (field.buckets || []).forEach(bucket => {
                        bucket.$field = field.label;
                        bucket.$checked = false;

                        const previousBucket = this.selectedBuckets.find(
                            b => b.$field === bucket.$field && b.label === bucket.label
                        );
                        if (previousBucket) {
                           bucket.$checked = true;
                        }
                    });
                    return field;
                }
            );
        } else {
            this.responseFacetQueries = [];
            this.responseFacetFields = [];
        }
    }

    onFacetQueryToggle(event: MatCheckboxChange, query: ResponseFacetQuery) {
        const facetQuery = this.queryBuilder.getFacetQuery(query.label);

        if (event.checked) {
            query.$checked = true;
            this.selectedFacetQueries.push(facetQuery.label);

            if (facetQuery) {
                this.queryBuilder.addFilterQuery(facetQuery.query);
            }
        } else {
            query.$checked = false;
            this.selectedFacetQueries = this.selectedFacetQueries.filter(q => q !== query.label);

            if (facetQuery) {
                this.queryBuilder.removeFilterQuery(facetQuery.query);
            }
        }

        this.queryBuilder.update();
    }

    /* chip list */
    onRemoveFacetQuery(label: string) {
        const facetQuery = this.queryBuilder.getFacetQuery(label);
        this.selectedFacetQueries = this.selectedFacetQueries.filter(q => q !== label);

        this.queryBuilder.removeFilterQuery(facetQuery.query);
        this.queryBuilder.update();
    }

    /* chip list */
    onRemoveSelectedBucket(bucket: FacetFieldBucket) {
        const idx = this.selectedBuckets.findIndex(
            b => b.$field === bucket.$field && b.label === bucket.label
        );

        if (idx >= 0) {
            this.selectedBuckets.splice(idx, 1);
        }
        this.queryBuilder.removeFilterQuery(bucket.filterQuery);
        this.queryBuilder.update();
    }

    onFacetToggle(event: MatCheckboxChange, field: ResponseFacetField, bucket: FacetFieldBucket) {
        if (event.checked) {
            bucket.$checked = true;
            this.selectedBuckets.push({ ...bucket });
            this.queryBuilder.addFilterQuery(bucket.filterQuery);
        } else {
            bucket.$checked = false;
            const idx = this.selectedBuckets.findIndex(
                b => b.$field === bucket.$field && b.label === bucket.label
            );

            if (idx >= 0) {
                this.selectedBuckets.splice(idx, 1);
            }
            this.queryBuilder.removeFilterQuery(bucket.filterQuery);
        }

        this.queryBuilder.update();
    }

    onCategoryExpanded(category: SearchCategory) {
        category.expanded = true;
    }

    onCategoryCollapsed(category: SearchCategory) {
        category.expanded = false;
    }

    onFacetFieldExpanded(field: ResponseFacetField) {
        field.$expanded = true;
    }

    onFacetFieldCollapsed(field: ResponseFacetField) {
        field.$expanded = false;
    }
}
