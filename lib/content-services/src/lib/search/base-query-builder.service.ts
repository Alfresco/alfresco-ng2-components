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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import {
    QueryBody,
    RequestFacetFields,
    RequestFacetField,
    RequestSortDefinitionInner,
    ResultSetPaging,
    RequestHighlight
} from '@alfresco/js-api';
import { SearchCategory } from './search-category.interface';
import { FilterQuery } from './filter-query.interface';
import { SearchRange } from './search-range.interface';
import { SearchConfiguration } from './search-configuration.interface';
import { FacetQuery } from './facet-query.interface';
import { SearchSortingDefinition } from './search-sorting-definition.interface';
import { FacetField } from './facet-field.interface';
import { FacetFieldBucket } from './facet-field-bucket.interface';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseQueryBuilderService {

    private _userQuery = '';

    updated = new Subject<QueryBody>();
    executed = new Subject<ResultSetPaging>();
    error = new Subject();

    categories: SearchCategory[] = [];
    queryFragments: { [id: string]: string } = {};
    filterQueries: FilterQuery[] = [];
    paging: { maxItems?: number; skipCount?: number } = null;
    sorting: SearchSortingDefinition[] = [];
    sortingOptions: SearchSortingDefinition[] = [];

    protected userFacetBuckets: { [key: string]: FacetFieldBucket[] } = {};

    get userQuery(): string {
        return this._userQuery;
    }

    set userQuery(value: string) {
        value = (value || '').trim();
        this._userQuery = value ? `(${value})` : '';
    }

    config: SearchConfiguration = {
        categories: []
    };

    // TODO: to be supported in future iterations
    ranges: { [id: string]: SearchRange } = {};

    constructor(protected appConfig: AppConfigService, protected alfrescoApiService: AlfrescoApiService) {
        this.resetToDefaults();
    }

    public abstract loadConfiguration(): SearchConfiguration;

    public abstract isFilterServiceActive(): boolean;

    public resetToDefaults() {
        const currentConfig = this.loadConfiguration();
        this.setUpSearchConfiguration(currentConfig);
    }

    private setUpSearchConfiguration(currentConfiguration: SearchConfiguration) {
        if (currentConfiguration) {
            this.config = JSON.parse(JSON.stringify(currentConfiguration));
            this.categories = (this.config.categories || []).filter(
                category => category.enabled
            );
            this.filterQueries = this.config.filterQueries || [];
            this.userFacetBuckets = {};
            if (this.config.sorting) {
                this.sorting = this.config.sorting.defaults || [];
                this.sortingOptions = this.config.sorting.options || [];
            }
        }
    }

    /**
     * Adds a facet bucket to a field.
     * @param field The target field
     * @param bucket Bucket to add
     */
    addUserFacetBucket(field: FacetField, bucket: FacetFieldBucket) {
        if (field && field.field && bucket) {
            const buckets = this.userFacetBuckets[field.field] || [];
            const existing = buckets.find((facetBucket) => facetBucket.label === bucket.label);
            if (!existing) {
                buckets.push(bucket);
            }
            this.userFacetBuckets[field.field] = buckets;
        }
    }

    /**
     * Gets the buckets currently added to a field
     * @param field The target fields
     * @returns Bucket array
     */
    getUserFacetBuckets(field: string) {
        return this.userFacetBuckets[field] || [];
    }

    /**
     * Removes an existing bucket from a field.
     * @param field The target field
     * @param bucket Bucket to remove
     */
    removeUserFacetBucket(field: FacetField, bucket: FacetFieldBucket) {
        if (field && field.field && bucket) {
            const buckets = this.userFacetBuckets[field.field] || [];
            this.userFacetBuckets[field.field] = buckets
                .filter((facetBucket) => facetBucket.label !== bucket.label);
        }
    }

    /**
     * Adds a filter query to the current query.
     * @param query Query string to add
     */
    addFilterQuery(query: string): void {
        if (query) {
            const existing = this.filterQueries.find((filterQuery) => filterQuery.query === query);
            if (!existing) {
                this.filterQueries.push({ query: query });
            }
        }
    }

    /**
     * Removes an existing filter query.
     * @param query The query to remove
     */
    removeFilterQuery(query: string): void {
        if (query) {
            this.filterQueries = this.filterQueries
                .filter((filterQuery) => filterQuery.query !== query);
        }
    }

    /**
     * Gets a facet query by label.
     * @param label Label of the query
     * @returns Facet query data
     */
    getFacetQuery(label: string): FacetQuery {
        if (label && this.hasFacetQueries) {
            const result = this.config.facetQueries.queries.find((query) => query.label === label);
            if (result) {
                return { ...result };
            }
        }
        return null;
    }

    /**
     * Gets a facet field by label.
     * @param label Label of the facet field
     * @returns Facet field data
     */
    getFacetField(label: string): FacetField {
        if (label) {
            const fields = this.config.facetFields.fields || [];
            const result = fields.find((field) => field.label === label);
            if (result) {
                result.label = this.getSupportedLabel(result.label);
                return { ...result };
            }
        }
        return null;
    }

    /**
     * Builds the current query and triggers the `updated` event.
     */
    update(): void {
        const query = this.buildQuery();
        this.updated.next(query);
    }

    /**
     * Builds and executes the current query.
     * @returns Nothing
     */
    async execute() {
        try {
            const query = this.buildQuery();
            if (query) {
                const resultSetPaging: ResultSetPaging = await this.alfrescoApiService.searchApi.search(query);
                this.executed.next(resultSetPaging);
            }
        } catch (error) {
            this.error.next(error);

            this.executed.next({
                list: {
                    pagination: {
                        totalItems: 0
                    },
                    entries: []
                }
            });
        }
    }

    /**
     * Builds the current query.
     * @returns The finished query
     */
    buildQuery(): QueryBody {
        const query = this.getFinalQuery();

        const include = this.config.include || [];
        if (include.length === 0) {
            include.push('path', 'allowableOperations');
        }

        if (query) {
            const result: QueryBody = <QueryBody> {
                query: {
                    query: query,
                    language: 'afts'
                },
                include: include,
                paging: this.paging,
                fields: this.config.fields,
                filterQueries: this.filterQueries,
                facetQueries: this.facetQueries,
                facetIntervals: this.facetIntervals,
                facetFields: this.facetFields,
                sort: this.sort,
                highlight: this.highlight
            };

            result['facetFormat'] = 'V2';
            return result;
        }

        return null;
    }

    /**
     * Gets the primary sorting definition.
     * @returns The primary sorting definition
     */
    getPrimarySorting(): SearchSortingDefinition {
        if (this.sorting && this.sorting.length > 0) {
            return this.sorting[0];
        }
        return null;
    }

    /**
     * Gets all pre-configured sorting options that users can choose from.
     * @returns Pre-configured sorting options
     */
    getSortingOptions(): SearchSortingDefinition[] {
        if (this.config && this.config.sorting) {
            return this.config.sorting.options || [];
        }
        return [];
    }

    /**
     * Gets the query group.
     * @param query Target query
     * @returns Query group
     */
    getQueryGroup(query) {
        return query.group || this.config.facetQueries.label || 'Facet Queries';
    }

    /**
     * Checks if FacetQueries has been defined
     * @returns True if defined, false otherwise
     */
    get hasFacetQueries(): boolean {
        if (this.config
            && this.config.facetQueries
            && this.config.facetQueries.queries
            && this.config.facetQueries.queries.length > 0) {
            return true;
        }
        return false;
    }

    /**
     * Checks if FacetIntervals has been defined
     * @returns True if defined, false otherwise
     */
    get hasFacetIntervals(): boolean {
        if (this.config
            && this.config.facetIntervals
            && this.config.facetIntervals.intervals
            && this.config.facetIntervals.intervals.length > 0) {
            return true;
        }
        return false;
    }

    get hasFacetHighlight(): boolean {
        return this.config && this.config.highlight ? true : false;
    }

    protected get sort(): RequestSortDefinitionInner[] {
        return this.sorting.map((def) => {
            return new RequestSortDefinitionInner({
                type: def.type,
                field: def.field,
                ascending: def.ascending
            });
        });
    }

    protected get facetQueries(): FacetQuery[] {
        if (this.hasFacetQueries) {
            return this.config.facetQueries.queries.map((query) => {
                query.group = this.getQueryGroup(query);
                return <FacetQuery> { ...query };
            });
        }

        return null;
    }

    protected get facetIntervals(): any {
        if (this.hasFacetIntervals) {
            const configIntervals = this.config.facetIntervals;

            return {
                intervals: configIntervals.intervals.map((interval) => <any> {
                    label: this.getSupportedLabel(interval.label),
                    field: interval.field,
                    sets: interval.sets.map((set) => <any> {
                        label: this.getSupportedLabel(set.label),
                        start: set.start,
                        end: set.end,
                        startInclusive: set.startInclusive,
                        endInclusive: set.endInclusive
                    })
                })
            };
        }

        return null;
    }

    protected get highlight(): RequestHighlight {
        return this.hasFacetHighlight ? this.config.highlight : null;
    }

    protected getFinalQuery(): string {
        let query = '';

        this.categories.forEach((facet) => {
            const customQuery = this.queryFragments[facet.id];
            if (customQuery) {
                if (query.length > 0) {
                    query += ' AND ';
                }
                query += `(${customQuery})`;
            }
        });

        let result = [this.userQuery, query]
            .filter((entry) => entry)
            .join(' AND ');

        if (this.userFacetBuckets) {
            Object.keys(this.userFacetBuckets).forEach((key) => {
                const subQuery = (this.userFacetBuckets[key] || [])
                    .filter((bucket) => bucket.filterQuery)
                    .map((bucket) => bucket.filterQuery)
                    .join(' OR ');
                if (subQuery) {
                    if (result.length > 0) {
                        result += ' AND ';
                    }
                    result += `(${subQuery})`;
                }
            });
        }

        return result;
    }

    protected get facetFields(): RequestFacetFields {
        const facetFields = this.config.facetFields && this.config.facetFields.fields;

        if (facetFields && facetFields.length > 0) {
            return {
                facets: facetFields.map((facet) => <RequestFacetField> {
                    field: facet.field,
                    mincount: facet.mincount,
                    label: this.getSupportedLabel(facet.label),
                    limit: facet.limit,
                    offset: facet.offset,
                    prefix: facet.prefix
                })
            };
        }

        return null;
    }

    /**
     * Encloses a label name with double quotes if it contains whitespace characters.
     * @param configLabel Original label text
     * @returns Label, possibly with quotes if it contains spaces
     */
    getSupportedLabel(configLabel: string): string {
        const spaceInsideLabelIndex = configLabel.search(/\s/g);
        if (spaceInsideLabelIndex > -1) {
            return `"${configLabel}"`;
        }
        return configLabel;
    }
}
