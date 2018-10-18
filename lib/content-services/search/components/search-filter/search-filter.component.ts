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
import { takeWhile } from 'rxjs/operators';

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
    facetFieldsExpanded = false;
    canResetSelectedQueries = false;

    selectedFacetQueries: Array<FacetQuery> = [];
    selectedBuckets: Array<{ field: FacetField, bucket: FacetFieldBucket }> = [];

    constructor(public queryBuilder: SearchQueryBuilderService,
                private searchService: SearchService,
                private translationService: TranslationService) {
        if (queryBuilder.config && queryBuilder.config.facetQueries) {
            this.facetQueriesLabel = queryBuilder.config.facetQueries.label || 'Facet Queries';
            this.facetQueriesPageSize = queryBuilder.config.facetQueries.pageSize || this.DEFAULT_PAGE_SIZE;
            this.facetQueriesExpanded = queryBuilder.config.facetQueries.expanded;
        }
        if (queryBuilder.config && queryBuilder.config.facetFields) {
            this.facetFieldsExpanded = queryBuilder.config.facetFields.expanded;
        }

        this.queryBuilder.updated.pipe(
            takeWhile(() => this.isAlive)
        ).subscribe(() => {
            this.queryBuilder.execute();
        });
    }

    ngOnInit() {
        if (this.queryBuilder) {
            this.queryBuilder.executed.pipe(
                takeWhile(() => this.isAlive)
            ).subscribe((data) => {
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
            if (event.checked) {
                this.selectFacetQuery(facetQuery);
            } else {
                this.unselectFacetQuery(facetQuery);
            }
        }
    }

    selectFacetQuery(query: FacetQuery) {
        if (query) {
            query.checked = true;
            this.queryBuilder.addUserFacetQuery(query);
            this.updateSelectedFields();
            this.queryBuilder.update();
        }
    }

    unselectFacetQuery(query: FacetQuery) {
        if (query) {
            query.checked = false;
            this.queryBuilder.removeUserFacetQuery(query);
            this.updateSelectedFields();
            this.queryBuilder.update();
        }
    }

    private updateSelectedBuckets() {
        if (this.responseFacetFields) {
            this.selectedBuckets = [];
            for (let field of this.responseFacetFields) {
                if (field.buckets) {
                    this.selectedBuckets.push(
                        ...this.queryBuilder.getUserFacetBuckets(field.field)
                            .filter(bucket => bucket.checked)
                            .map(bucket => {
                                return { field, bucket };
                            })
                    );
                }
            }
        } else {
            this.selectedBuckets = [];
        }
    }

    private updateSelectedFields() {
        if (this.responseFacetQueries) {
            this.selectedFacetQueries = this.responseFacetQueries.items.filter(item => item.checked);
            this.canResetSelectedQueries = this.selectedFacetQueries.length > 0;
        } else {
            this.selectedFacetQueries = [];
            this.canResetSelectedQueries = false;
        }
    }

    onToggleBucket(event: MatCheckboxChange, field: FacetField, bucket: FacetFieldBucket) {
        if (event && bucket) {
            if (event.checked) {
                this.selectFacetBucket(field, bucket);
            } else {
                this.unselectFacetBucket(field, bucket);
            }
        }
    }

    selectFacetBucket(field: FacetField, bucket: FacetFieldBucket) {
        if (bucket) {
            bucket.checked = true;
            this.queryBuilder.addUserFacetBucket(field, bucket);
            this.updateSelectedBuckets();
            this.queryBuilder.update();
        }
    }

    unselectFacetBucket(field: FacetField, bucket: FacetFieldBucket) {
        if (bucket) {
            bucket.checked = false;
            this.queryBuilder.removeUserFacetBucket(field, bucket);
            this.updateSelectedBuckets();
            this.queryBuilder.update();
        }
    }

    resetSelectedQueries() {
        if (this.canResetSelectedQueries) {
            for (let query of this.responseFacetQueries.items) {
                query.checked = false;
                this.queryBuilder.removeUserFacetQuery(query);
            }
            this.selectedFacetQueries = [];
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
                this.queryBuilder.removeUserFacetBucket(field, bucket);
            }
            this.updateSelectedBuckets();
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
            const configFacetFields = this.queryBuilder.config.facetFields && this.queryBuilder.config.facetFields.fields || [];

            this.responseFacetFields = configFacetFields.map(field => {
                const responseField = (context.facetsFields || []).find(response => response.label === field.label);
                const buckets: FacetFieldBucket[] = ((responseField && responseField.buckets) || []).map(bucket => {
                    const selectedBucket = this.selectedBuckets.find(facetBucket =>
                        facetBucket.bucket.label === bucket.label && facetBucket.field.field === field.field);

                    return <FacetFieldBucket> {
                        ...bucket,
                        checked: !!selectedBucket,
                        display: bucket.display,
                        label: bucket.label
                    };
                });
                const bucketList = new SearchFilterList<FacetFieldBucket>(buckets, field.pageSize);
                bucketList.filter = (bucket: FacetFieldBucket): boolean => {
                    if (bucket && bucketList.filterText) {
                        const pattern = (bucketList.filterText || '').toLowerCase();
                        const label = (this.translationService.instant(bucket.display) || this.translationService.instant(bucket.label)).toLowerCase();
                        return label.startsWith(pattern);
                    }
                    return true;
                };
                return {
                    ...field,
                    label: field.label,
                    pageSize: field.pageSize | this.DEFAULT_PAGE_SIZE,
                    currentPageSize: field.pageSize | this.DEFAULT_PAGE_SIZE,
                    buckets: bucketList
                };
            });

        } else {

            this.responseFacetFields = this.responseFacetFields
                .map(field => {

                    let responseField = (context.facetsFields || []).find(response => response.label === field.label);

                    (field && field.buckets && field.buckets.items || [])
                        .map(bucket => {
                            const responseBucket = ((responseField && responseField.buckets) || []).find(respBucket => respBucket.label === bucket.label);

                            bucket.count = responseBucket ? responseBucket.count : 0;
                            return bucket;
                        });

                    return field;
                });
        }
    }

    private parseFacetQueries(context: any) {
        const responseQueries = this.getFacetQueryMap(context);
        if (this.queryBuilder.config.facetQueries) {
            const bkpResponseFacetQueries =  Object.assign({}, this.responseFacetQueries);
            const facetQueries = (this.queryBuilder.config.facetQueries.queries || [])
                .map(query => {

                    const queryResult = responseQueries[query.label];
                    const bkpQuery = (bkpResponseFacetQueries.items || []).find(item => item.label === query.label);

                    if (bkpQuery) {
                        bkpQuery.count = queryResult.count;
                        return bkpQuery;
                    }
                    return <FacetQuery> {
                        ...query,
                        label: query.label,
                        count: queryResult.count
                    };
                });

            if (facetQueries.length > 0) {
                if (this.responseFacetQueries) {
                    this.responseFacetQueries.items = facetQueries;

                } else {
                    this.responseFacetQueries = new ResponseFacetQueryList(facetQueries, this.translationService, this.facetQueriesPageSize);
                }

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
