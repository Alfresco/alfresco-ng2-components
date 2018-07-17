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

import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { SearchService, TranslationService } from '@alfresco/adf-core';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { FacetFieldBucket } from '../../facet-field-bucket.interface';
import { ResponseFacetQueryList } from './models/response-facet-query-list.model';
import { FacetQuery } from '../../facet-query.interface';
import { FacetField } from '../../facet-field.interface';
import { SearchFilterList } from './models/search-filter-list.model';

@Component({
    selector: 'adf-search-filter',
    templateUrl: './search-filter.component.html',
    styleUrls: ['./search-filter.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-filter' }
})
export class SearchFilterComponent implements OnInit, OnDestroy {

    private DEFAULT_PAGE_SIZE = 5;

    isAlive = true;
    responseFacetQueries: ResponseFacetQueryList = null;
    responseFacetFields: FacetField[] = null;

    private facetQueriesPageSize = this.DEFAULT_PAGE_SIZE;
    facetQueriesLabel: string = 'Facet Queries';
    facetQueriesExpanded = false;
    canResetSelectedQueries = false;

    constructor(public queryBuilder: SearchQueryBuilderService,
                private searchService: SearchService,
                private translationService: TranslationService) {
        if (queryBuilder.config && queryBuilder.config.facetQueries) {
            this.facetQueriesLabel = queryBuilder.config.facetQueries.label || 'Facet Queries';
            this.facetQueriesPageSize = queryBuilder.config.facetQueries.pageSize || this.DEFAULT_PAGE_SIZE;
            this.facetQueriesExpanded = queryBuilder.config.facetQueries.expanded;
        }

        this.queryBuilder.updated
            .takeWhile(() => this.isAlive)
            .subscribe(() => {
                this.queryBuilder.execute();
            });
    }

    ngOnInit() {
        if (this.queryBuilder) {
            this.queryBuilder.executed
                .takeWhile(() => this.isAlive)
                .subscribe(data => {
                    this.onDataLoaded(data);
                    this.searchService.dataLoaded.next(data);
                });
        }
    }

    ngOnDestroy() {
       this.isAlive = false;
    }

    onToggleFacetQuery(event: MatCheckboxChange, facetQuery: FacetQuery) {
        if (event && facetQuery) {
            facetQuery.checked = event.checked;

            if (event.checked) {
                this.queryBuilder.addUserFacetQuery(facetQuery);
                this.canResetSelectedQueries = true;
            } else {
                this.queryBuilder.removeUserFacetQuery(facetQuery);
                if (this.responseFacetQueries) {
                    this.canResetSelectedQueries = this.responseFacetQueries.items.some(item => item.checked);
                }
            }

            this.queryBuilder.update();
        }
    }

    onToggleBucket(event: MatCheckboxChange, bucket: FacetFieldBucket) {
        if (event && bucket) {
            bucket.checked = event.checked;

            if (event.checked) {
                this.queryBuilder.addUserFacetBucket(bucket);
            } else {
                this.queryBuilder.removeUserFacetBucket(bucket);
            }

            this.queryBuilder.update();
        }
    }

    resetSelectedQueries() {
        if (this.canResetSelectedQueries) {
            for (let query of this.responseFacetQueries.items) {
                query.checked = false;
                this.queryBuilder.removeUserFacetQuery(query);
            }
            this.canResetSelectedQueries = false;
            this.queryBuilder.update();
        }
    }

    canResetSelectedBuckets(field: FacetField): boolean {
        if (field && field.buckets) {
            return field.buckets.items.some(bucket => bucket.checked);
        }
        return false;
    }

    resetSelectedBuckets(field: FacetField) {
        if (field && field.buckets) {
            for (let bucket of field.buckets.items) {
                bucket.checked = false;
                this.queryBuilder.removeUserFacetBucket(bucket);
            }
            this.queryBuilder.update();
        }
    }

    onDataLoaded(data: any) {
        const context = data.list.context;

        if (context) {
            this.parseFacetFields(context);
            this.parseFacetQueries(context);
        } else {
            this.responseFacetQueries = null;
            this.responseFacetFields = null;
        }
    }

    private parseFacetFields(context: any) {
        if (!this.responseFacetFields) {
            const configFacetFields = this.queryBuilder.config.facetFields || [];
            this.responseFacetFields = configFacetFields.map(field => {
                const responseField = (context.facetsFields || []).find(response => response.label === field.label);
                const buckets: FacetFieldBucket[] = (responseField.buckets || []).map(bucket => {
                    return <FacetFieldBucket> {
                        ...bucket,
                        checked: false,
                        display: this.translationService.instant(bucket.display),
                        label: this.translationService.instant(bucket.label)
                    };
                });
                const bucketList = new SearchFilterList<FacetFieldBucket>(buckets, field.pageSize);
                bucketList.filter = (bucket: FacetFieldBucket): boolean => {
                    if (bucket && bucketList.filterText) {
                        const pattern = (bucketList.filterText || '').toLowerCase();
                        const label = (bucket.display || bucket.label || '').toLowerCase();
                        return label.startsWith(pattern);
                    }
                    return true;
                };
                return {
                    ...field,
                    label: this.translationService.instant(field.label),
                    pageSize: field.pageSize | this.DEFAULT_PAGE_SIZE,
                    currentPageSize: field.pageSize | this.DEFAULT_PAGE_SIZE,
                    buckets: bucketList
                };
            });
        }
    }

    private parseFacetQueries(context: any) {
        const responseQueries = this.getFacetQueryMap(context);
        if (!this.responseFacetQueries) {
            const facetQueries = (this.queryBuilder.config.facetQueries.queries || [])
                .map(query => {
                    const queryResult = responseQueries[query.label];
                    return <FacetQuery> {
                        ...query,
                        label: this.translationService.instant(query.label),
                        count: queryResult.count
                    };
                });

            if (facetQueries.length > 0) {
                this.responseFacetQueries = new ResponseFacetQueryList(facetQueries, this.facetQueriesPageSize);
            } else {
                this.responseFacetQueries = null;
            }
        }
    }

    private getFacetQueryMap(context: any): { [key: string]: any } {
        const result = {};

        (context.facetQueries || []).forEach(query => {
            result[query.label] = query;
        });

        return result;
    }
}
