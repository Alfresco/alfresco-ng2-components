/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { FacetField } from '../../facet-field.interface';
import { SearchFilterList } from './models/search-filter-list.model';
import { takeWhile } from 'rxjs/operators';
import { ResultSetPaging, GenericBucket, GenericFacetResponse, ResultSetContext } from '@alfresco/js-api';

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
    responseFacets: FacetField[] = null;

    private facetQueriesPageSize = this.DEFAULT_PAGE_SIZE;
    facetQueriesLabel: string = 'Facet Queries';
    facetQueriesExpanded = false;
    facetFieldsExpanded = false;

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
            ).subscribe((resultSetPaging: ResultSetPaging) => {
                this.onDataLoaded(resultSetPaging);
                this.searchService.dataLoaded.next(resultSetPaging);
            });
        }
    }

    ngOnDestroy() {
        this.isAlive = false;
    }

    private updateSelectedBuckets() {
        if (this.responseFacets) {
            this.selectedBuckets = [];
            for (let field of this.responseFacets) {
                if (field.buckets) {
                    this.selectedBuckets.push(
                        ...this.queryBuilder.getUserFacetBuckets(field.field)
                            .filter((bucket) => bucket.checked)
                            .map((bucket) => {
                                return { field, bucket };
                            })
                    );
                }
            }
        } else {
            this.selectedBuckets = [];
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

    canResetSelectedBuckets(field: FacetField): boolean {
        if (field && field.buckets) {
            return field.buckets.items.some((bucket) => bucket.checked);
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

    shouldExpand(field: FacetField): boolean {
        return field.type === 'query' ? this.facetQueriesExpanded : this.facetFieldsExpanded;
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
        if (!this.responseFacets) {
            const responseFacetFields = this.parseFacetFields(context);
            const responseFacetIntervals = this.parseFacetIntervals(context);
            const responseGroupedFacetQueries = this.parseFacetQueries(context);
            this.responseFacets = responseFacetFields.concat(...responseGroupedFacetQueries, ...responseFacetIntervals);

        } else {
            this.responseFacets = this.responseFacets
                .map((field) => {

                    let responseField = (context.facets || []).find((response) => response.label === field.label && response.type === field.type);

                    (field && field.buckets && field.buckets.items || [])
                        .map((bucket) => {
                            const responseBucket = ((responseField && responseField.buckets) || []).find((respBucket) => respBucket.label === bucket.label);

                            bucket.count = responseBucket ? this.getCountValue(responseBucket) : 0;
                            return bucket;
                        });

                    return field;
                });
        }
    }

    private parseFacetItems(context: ResultSetContext, configFacetFields, itemType): FacetField[] {
        return configFacetFields.map((field) => {
            const responseField = (context.facets || []).find((response) => response.type === itemType && response.label === field.label) || {};
            const responseBuckets = this.getResponseBuckets(responseField);

            const bucketList = new SearchFilterList<FacetFieldBucket>(responseBuckets, field.pageSize);
            bucketList.filter = (bucket: FacetFieldBucket): boolean => {
                if (bucket && bucketList.filterText) {
                    const pattern = (bucketList.filterText || '').toLowerCase();
                    const label = (this.translationService.instant(bucket.display) || this.translationService.instant(bucket.label)).toLowerCase();
                    return this.queryBuilder.config.filterWithContains ? label.indexOf(pattern) !== -1 : label.startsWith(pattern);
                }
                return true;
            };

            return <FacetField> {
                ...field,
                type: responseField.type,
                label: field.label,
                pageSize: field.pageSize | this.DEFAULT_PAGE_SIZE,
                currentPageSize: field.pageSize | this.DEFAULT_PAGE_SIZE,
                buckets: bucketList
            };
        });
    }

    private parseFacetFields(context: ResultSetContext): FacetField[] {
        const configFacetFields = this.queryBuilder.config.facetFields && this.queryBuilder.config.facetFields.fields || [];
        return this.parseFacetItems(context, configFacetFields, 'field');
    }

    private parseFacetIntervals(context: ResultSetContext): FacetField[] {
        const configFacetIntervals = this.queryBuilder.config.facetIntervals && this.queryBuilder.config.facetIntervals.intervals || [];
        return this.parseFacetItems(context, configFacetIntervals, 'interval');
    }

    private parseFacetQueries(context: ResultSetContext): FacetField[] {
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

        const result = [];

        Object.keys(configGroups).forEach((group) => {
            const responseField = (context.facets || []).find((response) => response.type === 'query' && response.label === group) || {};
            const responseBuckets = this.getResponseQueryBuckets(responseField, configGroups[group]);

            const bucketList = new SearchFilterList<FacetFieldBucket>(responseBuckets, this.facetQueriesPageSize);
            bucketList.filter = (bucket: FacetFieldBucket): boolean => {
                if (bucket && bucketList.filterText) {
                    const pattern = (bucketList.filterText || '').toLowerCase();
                    const label = (this.translationService.instant(bucket.display) || this.translationService.instant(bucket.label)).toLowerCase();
                    return this.queryBuilder.config.filterWithContains ? label.indexOf(pattern) !== -1 : label.startsWith(pattern);
                }
                return true;
            };

            result.push(<FacetField> {
                field: group,
                type: responseField.type,
                label: group,
                pageSize: this.DEFAULT_PAGE_SIZE,
                currentPageSize: this.DEFAULT_PAGE_SIZE,
                buckets: bucketList
            });
        });

        return result;
    }

    private getResponseBuckets(responseField: GenericFacetResponse): FacetFieldBucket[] {
        return ((responseField && responseField.buckets) || []).map((respBucket) => {

            respBucket['count'] = this.getCountValue(respBucket);
            return <FacetFieldBucket> {
                ...respBucket,
                checked: false,
                display: respBucket.display,
                label: respBucket.label
            };
        });
    }

    private getResponseQueryBuckets(responseField: GenericFacetResponse, configGroup: any): FacetFieldBucket[] {
        return (configGroup || []).map((query) => {
            const respBucket = ((responseField && responseField.buckets) || [])
                .find((bucket) => bucket.label === query.label);

            respBucket['count'] = this.getCountValue(respBucket);
            return <FacetFieldBucket> {
                ...respBucket,
                checked: false,
                display: respBucket.display,
                label: respBucket.label
            };
        }).filter((bucket) => {
            let mincount = this.queryBuilder.config.facetQueries.mincount;
            if (mincount === undefined) {
                    mincount = 1;
            }
            return bucket.count >= mincount;
        });
    }

    private getCountValue(bucket: GenericBucket): number {
        return (!!bucket && !!bucket.metrics && bucket.metrics[0] && bucket.metrics[0].value && bucket.metrics[0].value.count)
            || 0;
    }
}
