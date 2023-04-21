/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Inject, Injectable, OnDestroy } from '@angular/core';
import { FacetBucketSortBy, FacetBucketSortDirection, FacetField } from '../models/facet-field.interface';
import { Subject, throwError } from 'rxjs';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../search-query-service.token';
import { SearchQueryBuilderService } from './search-query-builder.service';
import { TranslationService } from '@alfresco/adf-core';
import { SearchService } from './search.service';
import { catchError, takeUntil } from 'rxjs/operators';
import { GenericBucket, GenericFacetResponse, ResultSetContext, ResultSetPaging } from '@alfresco/js-api';
import { SearchFilterList } from '../models/search-filter-list.model';
import { FacetFieldBucket } from '../models/facet-field-bucket.interface';
import { CategoryService } from '../../category/services/category.service';

export interface SelectedBucket {
    field: FacetField;
    bucket: FacetFieldBucket;
}

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable({
    providedIn: 'root'
})
export class SearchFacetFiltersService implements OnDestroy {

    /** All facet field items to be displayed in the component. These are updated according to the response.
     *  When a new search is performed, the already existing items are updated with the new bucket count values and
     *  the newly received items are added to the responseFacets.
     */
    responseFacets: FacetField[] = null;

    /** shows the facet chips */
    selectedBuckets: SelectedBucket[] = [];

    private readonly facetQueriesPageSize = DEFAULT_PAGE_SIZE;
    private readonly onDestroy$ = new Subject<boolean>();

    constructor(@Inject(SEARCH_QUERY_SERVICE_TOKEN) public queryBuilder: SearchQueryBuilderService,
                private searchService: SearchService,
                private translationService: TranslationService,
                private categoryService: CategoryService
    ) {
        if (queryBuilder.config && queryBuilder.config.facetQueries) {
            this.facetQueriesPageSize = queryBuilder.config.facetQueries.pageSize || DEFAULT_PAGE_SIZE;
        }

        this.queryBuilder.configUpdated
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.selectedBuckets = [];
                this.responseFacets = null;
            });

        this.queryBuilder.updated
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((query) => this.queryBuilder.execute(query));

        this.queryBuilder.executed
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((resultSetPaging: ResultSetPaging) => {
                this.onDataLoaded(resultSetPaging);
                this.searchService.dataLoaded.next(resultSetPaging);
            });
    }

    onDataLoaded(data: any) {
        const context = data.list.context;

        if (context) {
            this.parseFacets(context);
        } else {
            this.responseFacets = null;
        }
    }

    private parseFacets(context: ResultSetContext) {
        this.parseFacetFields(context);
        this.parseFacetIntervals(context);
        this.parseFacetQueries(context);
        this.sortFacets();
    }

    private parseFacetItems(context: ResultSetContext, configFacetFields: FacetField[], itemType: string) {
        configFacetFields.forEach((field) => {
            const responseField = this.findFacet(context, itemType, field.label);
            const responseBuckets = this.getResponseBuckets(responseField, field)
                .filter(this.getFilterByMinCount(field.mincount));
            this.sortFacetBuckets(responseBuckets, field.settings?.bucketSortBy, field.settings?.bucketSortDirection ?? FacetBucketSortDirection.ASCENDING);
            const alreadyExistingField = this.findResponseFacet(itemType, field.label);

            if (field.field === 'cm:categories'){
                this.loadCategoryNames(responseBuckets);
            }

            if (alreadyExistingField) {
                const alreadyExistingBuckets = alreadyExistingField.buckets && alreadyExistingField.buckets.items || [];

                this.updateExistingBuckets(responseField, responseBuckets, alreadyExistingField, alreadyExistingBuckets);
            } else if (responseField) {
                if (responseBuckets.length > 0) {
                    const bucketList = new SearchFilterList<FacetFieldBucket>(responseBuckets, field.pageSize);
                    bucketList.filter = this.getBucketFilterFunction(bucketList);

                    if (!this.responseFacets) {
                        this.responseFacets = [];
                    }
                    this.responseFacets.push({
                        ...field,
                        type: responseField.type || itemType,
                        label: field.label,
                        pageSize: field.pageSize | DEFAULT_PAGE_SIZE,
                        currentPageSize: field.pageSize | DEFAULT_PAGE_SIZE,
                        buckets: bucketList
                    });
                }
            }
        });
    }

    private parseFacetFields(context: ResultSetContext) {
        const configFacetFields = this.queryBuilder.config.facetFields && this.queryBuilder.config.facetFields.fields || [];
        this.parseFacetItems(context, configFacetFields, 'field');
    }

    private parseFacetIntervals(context: ResultSetContext) {
        const configFacetIntervals = this.queryBuilder.config.facetIntervals && this.queryBuilder.config.facetIntervals.intervals || [];
        this.parseFacetItems(context, configFacetIntervals, 'interval');
    }

    private parseFacetQueries(context: ResultSetContext) {
        const facetQuerySetting = this.queryBuilder.config.facetQueries?.settings || {};
        const configFacetQueries = this.queryBuilder.config.facetQueries && this.queryBuilder.config.facetQueries.queries || [];
        const configGroups = configFacetQueries.reduce((acc, query) => {
            const group = this.queryBuilder.getQueryGroup(query);
            if (acc[group]) {
                acc[group].push(query);
            } else {
                acc[group] = [query];
            }
            return acc;
        }, []);

        const mincount = this.queryBuilder.config.facetQueries && this.queryBuilder.config.facetQueries.mincount;
        const mincountFilter = this.getFilterByMinCount(mincount);

        Object.keys(configGroups).forEach((group) => {
            const responseField = this.findFacet(context, 'query', group);
            const responseBuckets = this.getResponseQueryBuckets(responseField, configGroups[group])
                .filter(mincountFilter);
            this.sortFacetBuckets(responseBuckets, facetQuerySetting?.bucketSortBy, facetQuerySetting.bucketSortDirection ?? FacetBucketSortDirection.ASCENDING);
            const alreadyExistingField = this.findResponseFacet('query', group);

            if (alreadyExistingField) {
                const alreadyExistingBuckets = alreadyExistingField.buckets && alreadyExistingField.buckets.items || [];

                this.updateExistingBuckets(responseField, responseBuckets, alreadyExistingField, alreadyExistingBuckets);
            } else if (responseField) {
                if (responseBuckets.length > 0) {
                    const bucketList = new SearchFilterList<FacetFieldBucket>(responseBuckets, this.facetQueriesPageSize);
                    bucketList.filter = this.getBucketFilterFunction(bucketList);

                    if (!this.responseFacets) {
                        this.responseFacets = [];
                    }
                    this.responseFacets.push({
                        field: group,
                        type: responseField.type || 'query',
                        label: group,
                        pageSize: DEFAULT_PAGE_SIZE,
                        currentPageSize: DEFAULT_PAGE_SIZE,
                        buckets: bucketList,
                        settings: facetQuerySetting
                    });
                }
            }
        });

    }

    private sortFacets() {
        this.responseFacets?.sort((facet1, facet2) => (facet1.settings?.facetOrder ?? 0) - (facet2.settings?.facetOrder ?? 0));
    }

    private getResponseBuckets(responseField: GenericFacetResponse, configField: FacetField): FacetFieldBucket[] {
        return ((responseField && responseField.buckets) || []).map((respBucket) => {

            respBucket['count'] = this.getCountValue(respBucket);
            respBucket.filterQuery = respBucket.filterQuery || this.getCorrespondingFilterQuery(configField, respBucket.label);
            return {
                ...respBucket,
                checked: false,
                display: respBucket.display,
                label: respBucket.label
            } as FacetFieldBucket;
        });
    }

    private getResponseQueryBuckets(responseField: GenericFacetResponse, configGroup: any): FacetFieldBucket[] {
        return (configGroup || []).map((query) => {
            const respBucket = ((responseField && responseField.buckets) || [])
                .find((bucket) => bucket.label === query.label) || {};

            respBucket['count'] = this.getCountValue(respBucket);
            return {
                ...respBucket,
                checked: false,
                display: respBucket.display,
                label: respBucket.label
            };
        });
    }

    private sortFacetBuckets(buckets: FacetFieldBucket[], sortBy: FacetBucketSortBy, sortDirection: FacetBucketSortDirection) {
        switch (sortBy) {
            case FacetBucketSortBy.LABEL:
                buckets.sort((bucket1, bucket2) =>
                    sortDirection === FacetBucketSortDirection.ASCENDING ? bucket1.label.localeCompare(bucket2.label) : bucket2.label.localeCompare(bucket1.label)
                );
                break;
            case FacetBucketSortBy.COUNT:
                buckets.sort((bucket1, bucket2) =>
                    sortDirection === FacetBucketSortDirection.ASCENDING ? bucket1.count - bucket2.count : bucket2.count - bucket1.count
                );
                break;
            default:
                return;
        }
    }

    private getCountValue(bucket: GenericBucket): number {
        return (!!bucket && !!bucket.metrics && bucket.metrics[0]?.value?.count) || 0;
    }

    getBucketCountDisplay(bucket: FacetFieldBucket): string {
        return bucket.count === null ? '' : `(${bucket.count})`;
    }

    private getFilterByMinCount(mincountInput: number) {
        return (bucket) => {
            let mincount = mincountInput;
            if (mincount === undefined) {
                mincount = 1;
            }
            return bucket.count >= mincount;
        };
    }

    private getCorrespondingFilterQuery(configFacetItem: FacetField, bucketLabel: string): string {
        let filterQuery = null;

        if (configFacetItem.field && bucketLabel) {

            if (configFacetItem.sets) {
                const configSet = configFacetItem.sets.find((set) => bucketLabel === set.label);

                if (configSet) {
                    filterQuery = this.buildIntervalQuery(configFacetItem.field, configSet);
                }

            } else {
                filterQuery = `${configFacetItem.field}:"${bucketLabel}"`;
            }
        }

        return filterQuery;
    }

    private buildIntervalQuery(fieldName: string, interval: any): string {
        const start = interval.start;
        const end = interval.end;
        const startLimit = (interval.startInclusive === undefined || interval.startInclusive === true) ? '[' : '<';
        const endLimit = (interval.endInclusive === undefined || interval.endInclusive === true) ? ']' : '>';

        return `${fieldName}:${startLimit}"${start}" TO "${end}"${endLimit}`;
    }

    private findFacet(context: ResultSetContext, itemType: string, fieldLabel: string): GenericFacetResponse {
        return (context.facets || []).find((response) => response.type === itemType && response.label === fieldLabel) || {};
    }

    private findResponseFacet(itemType: string, fieldLabel: string): FacetField {
        return (this.responseFacets || []).find((response) => response.type === itemType && response.label === fieldLabel);
    }

    private updateExistingBuckets(responseField, responseBuckets, alreadyExistingField, alreadyExistingBuckets) {
        const bucketsToDelete = [];

        alreadyExistingBuckets
            .map((bucket) => {
                const responseBucket = ((responseField && responseField.buckets) || []).find((respBucket) => respBucket.label === bucket.label);

                if (!responseBucket) {
                    bucketsToDelete.push(bucket);
                }
                bucket.count = this.getCountValue(responseBucket);
                return bucket;
            });

        const hasSelection = this.selectedBuckets
            .find((selBuckets) => alreadyExistingField.label === selBuckets.field.label && alreadyExistingField.type === selBuckets.field.type);

        if (!hasSelection && bucketsToDelete.length) {
            bucketsToDelete.forEach((bucket) => {
                alreadyExistingField.buckets.deleteItem(bucket);
            });
        }

        responseBuckets.forEach((respBucket) => {
            const existingBucket = alreadyExistingBuckets.find((oldBucket) => oldBucket.label === respBucket.label);

            if (!existingBucket) {
                alreadyExistingField.buckets.addItem(respBucket);
            }
        });
    }

    private getBucketFilterFunction(bucketList) {
        return (bucket: FacetFieldBucket): boolean => {
            if (bucket && bucketList.filterText) {
                const pattern = (bucketList.filterText || '').toLowerCase();
                const label = (this.translationService.instant(bucket.display) || this.translationService.instant(bucket.label)).toLowerCase();
                return this.queryBuilder.config.filterWithContains ? label.indexOf(pattern) !== -1 : label.startsWith(pattern);
            }
            return true;
        };
    }

    private loadCategoryNames(bucketList: FacetFieldBucket[]) {
        bucketList.forEach((item) => {
            const categoryId = item.label.split('/').pop();
            this.categoryService.getCategory(categoryId, {include: ['path']})
                .pipe(catchError(error => throwError(error)))
                .subscribe(
                    category => {
                        const nextAfterGeneralPathPartIndex = 3;
                        const pathSeparator = '/';
                        const path = category.entry.path.split(pathSeparator).slice(nextAfterGeneralPathPartIndex).join('/');
                        item.display = path ? `${path}/${category.entry.name}` : category.entry.name;
                    }
                );
        });
    }

    unselectFacetBucket(field: FacetField, bucket: FacetFieldBucket) {
        if (bucket) {
            bucket.checked = false;
            this.queryBuilder.removeUserFacetBucket(field, bucket);
            this.updateSelectedBuckets();
            this.queryBuilder.update();
        }
    }

    /* update adf-search-chip-list component view */
    updateSelectedBuckets() {
        if (this.responseFacets) {
            this.selectedBuckets = [];
            for (const field of this.responseFacets) {
                if (field.buckets) {
                    this.selectedBuckets.push(
                        ...this.queryBuilder.getUserFacetBuckets(field.field)
                            .filter((bucket) => bucket.checked)
                            .map((bucket) => ({field, bucket}))
                    );
                }
            }
        } else {
            this.selectedBuckets = [];
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    resetAllSelectedBuckets() {
        this.responseFacets.forEach((field) => {
            if (field && field.buckets) {
                for (const bucket of field.buckets.items) {
                    bucket.checked = false;
                    this.queryBuilder.removeUserFacetBucket(field, bucket);
                }
                this.updateSelectedBuckets();
            }
        });
        this.queryBuilder.update();
    }

    resetQueryFragments() {
        this.queryBuilder.queryFragments = {};
        this.queryBuilder.resetToDefaults();
    }

    reset() {
        this.responseFacets = [];
        this.selectedBuckets = [];
        this.queryBuilder.resetToDefaults();
        this.queryBuilder.update();
    }
}
