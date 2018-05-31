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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { SearchService, TranslationService } from '@alfresco/adf-core';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { ResponseFacetField } from '../../response-facet-field.interface';
import { FacetFieldBucket } from '../../facet-field-bucket.interface';
import { SearchCategory } from '../../search-category.interface';
import { ResponseFacetQuery } from '../../response-facet-query.interface';
import { ResponseFacetQueryList } from './models/response-facet-query-list.model';
import { SearchFilterList } from './models/search-filter-list.model';

@Component({
    selector: 'adf-search-filter',
    templateUrl: './search-filter.component.html',
    styleUrls: ['./search-filter.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-filter' }
})
export class SearchFilterComponent implements OnInit {

    private DEFAULT_PAGE_SIZE = 5;

    selectedFacetQueries: string[] = [];
    selectedBuckets: FacetFieldBucket[] = [];
    responseFacetQueries: ResponseFacetQueryList;
    responseFacetFields: ResponseFacetField[] = [];

    facetQueriesLabel: string = 'Facet Queries';
    facetQueriesPageSize = this.DEFAULT_PAGE_SIZE;
    facetQueriesExpanded = false;

    constructor(public queryBuilder: SearchQueryBuilderService,
                private searchService: SearchService,
                private translationService: TranslationService) {
        this.responseFacetQueries = new ResponseFacetQueryList();

        if (queryBuilder.config && queryBuilder.config.facetQueries) {
            this.facetQueriesLabel = queryBuilder.config.facetQueries.label || 'Facet Queries';
            this.facetQueriesPageSize = queryBuilder.config.facetQueries.pageSize || this.DEFAULT_PAGE_SIZE;
            this.facetQueriesExpanded = queryBuilder.config.facetQueries.expanded;
        }

        this.queryBuilder.updated.subscribe(query => {
            this.queryBuilder.execute();
        });
    }

    ngOnInit() {
        if (this.queryBuilder) {
            this.queryBuilder.executed.subscribe(data => {
                this.onDataLoaded(data);
                this.searchService.dataLoaded.next(data);
            });
        }
    }

    get isFacetQueriesDefined() {
        return this.queryBuilder.hasFacetQueries;
    }

    onCategoryExpanded(category: SearchCategory) {
        category.expanded = true;
    }

    onCategoryCollapsed(category: SearchCategory) {
        category.expanded = false;
    }

    onFacetFieldExpanded(field: ResponseFacetField) {
        field.expanded = true;
    }

    onFacetFieldCollapsed(field: ResponseFacetField) {
        field.expanded = false;
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
            this.selectedFacetQueries = this.selectedFacetQueries.filter(selectedQuery => selectedQuery !== query.label);

            if (facetQuery) {
                this.queryBuilder.removeFilterQuery(facetQuery.query);
            }
        }

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

    unselectFacetQuery(label: string, reloadQuery: boolean = true) {
        const facetQuery = this.queryBuilder.getFacetQuery(label);
        if (facetQuery) {
            this.queryBuilder.removeFilterQuery(facetQuery.query);
        }

        this.selectedFacetQueries = this.selectedFacetQueries.filter(selectedQuery => selectedQuery !== label);

        if (reloadQuery) {
            this.queryBuilder.update();
        }
    }

    unselectFacetBucket(bucket: FacetFieldBucket, reloadQuery: boolean = true) {
        if (bucket) {
            const idx = this.selectedBuckets.findIndex(
                selectedBucket => selectedBucket.$field === bucket.$field && selectedBucket.label === bucket.label
            );

            if (idx >= 0) {
                this.selectedBuckets.splice(idx, 1);
            }
            this.queryBuilder.removeFilterQuery(bucket.filterQuery);

            bucket.$checked = false;

            if (reloadQuery) {
                this.queryBuilder.update();
            }
        }
    }

    canResetSelectedQueries(): boolean {
        return this.selectedFacetQueries && this.selectedFacetQueries.length > 0;
    }

    resetSelectedQueries() {
        if (this.canResetSelectedQueries()) {
            this.selectedFacetQueries.forEach(query => {
                this.unselectFacetQuery(query, false);
            });
            this.queryBuilder.update();
        }
    }

    canResetSelectedBuckets(field: ResponseFacetField): boolean {
        if (field && field.buckets) {
            return field.buckets.items.some(bucket => bucket.$checked);
        }
        return false;
    }

    resetSelectedBuckets(field: ResponseFacetField) {
        if (field && field.buckets) {
            field.buckets.items.forEach(bucket => {
                this.unselectFacetBucket(bucket, false);
            });
            this.queryBuilder.update();
        }
    }

    onDataLoaded(data: any) {
        const context = data.list.context;

        if (context) {
            const facetQueries = (context.facetQueries || []).map(query => {
                query.label = this.translationService.instant(query.label);
                query.$checked = this.selectedFacetQueries.includes(query.label);
                return query;
            });

            this.responseFacetQueries = new ResponseFacetQueryList(facetQueries, this.facetQueriesPageSize);

            const expandedFields = this.responseFacetFields
                .filter(field => field.expanded)
                .map(field => field.label);

            this.responseFacetFields = (context.facetsFields || []).map(
                field => {
                    const settings = this.queryBuilder.getFacetField(field.label);

                    let fallbackPageSize = this.DEFAULT_PAGE_SIZE;
                    if (settings && settings.pageSize) {
                        fallbackPageSize = settings.pageSize;
                    }

                    field.label = this.translationService.instant(field.label);
                    field.pageSize = field.pageSize || fallbackPageSize;
                    field.currentPageSize = field.pageSize;
                    field.expanded = expandedFields.includes(field.label);

                    const buckets = (field.buckets || []).map(bucket => {
                        bucket.$field = field.label;
                        bucket.$checked = false;
                        bucket.display = this.translationService.instant(bucket.display);
                        bucket.label = this.translationService.instant(bucket.label);

                        const previousBucket = this.selectedBuckets.find(
                            selectedBucket => selectedBucket.$field === bucket.$field && selectedBucket.label === bucket.label
                        );
                        if (previousBucket) {
                           bucket.$checked = true;
                        }
                        return bucket;
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

                    field.buckets = bucketList;
                    return field;
                }
            );
        } else {
            this.responseFacetQueries = new ResponseFacetQueryList([], this.facetQueriesPageSize);
            this.responseFacetFields = [];
        }
    }
}
