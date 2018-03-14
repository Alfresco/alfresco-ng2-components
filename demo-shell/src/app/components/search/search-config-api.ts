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

import { SearchQueryBuilder } from './search-query-builder';

/** Holds entire Search configuration  */
export interface SearchConfig {
    query: {
        categories: Array<SearchCategory>
    };
    limits?: {
        permissionEvaluationTime?: number;
        permissionEvaluationCount?: number;
    };
    filterQueries: Array<FilterQuery>;
    facetQueries: Array<FacetQuery>;
    facetFields: {
        facets: Array<FacetField>
    };
}

/** Custom search category configuration */
export interface SearchCategory {
    id: string;
    name: string;
    enabled: boolean;
    expanded: boolean;
    component: {
        selector: string;
        settings: SearchComponentSettings;
    };
}

/** Settings to pass to a particular facet component upon creation */
export interface SearchComponentSettings {
    field: string;
    [indexer: string]: any;
}

/** Contract for a facet component implementation */
export interface FacetComponent {
    id: string;
    settings?: SearchComponentSettings;
    context?: SearchQueryBuilder;
}

// https://docs.alfresco.com/5.2/concepts/search-api-filterQueries.html
export interface FilterQuery {
    query: string;
}

// https://docs.alfresco.com/5.2/concepts/search-api-facetQueries.html
export interface FacetQuery {
    query: string;
    label: string;

    $checked?: boolean;
}

// https://docs.alfresco.com/5.2/concepts/search-api-facetFields.html
export interface FacetField {
    field: string;
    label: string;
    mincount: number;

    $checked?: boolean;
}

export interface ResponseFacetField {
    label: string;
    buckets: Array<FacetFieldBucket>;

    $expanded?: boolean;
}

export interface FacetFieldBucket {
    count: number;
    display?: string;
    label: string;
    filterQuery: string;

    $checked?: boolean;
    $field?: string;
}
