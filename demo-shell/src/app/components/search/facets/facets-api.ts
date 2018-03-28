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

/** Holds entire Search configuration  */
export interface SearchConfig {
    query: {
        categories: Array<SearchCategoryConfig>
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
export interface SearchCategoryConfig {
    id: string;
    name: string;
    enabled: boolean;
    component: SearchComponentConfig;
}

/** Custom search component configuration  */
export interface SearchComponentConfig {
    selector: string;
    settings: SearchComponentSettingsConfig;
}

/** Settings to pass to a particular facet component upon creation */
export interface SearchComponentSettingsConfig {
    field: string;
    [indexer: string]: any;
}

/** Runtime context for query builder, all facet components has access to it. */
export interface QueryBuilderContext {
    config: SearchConfig;
    query: { [id: string]: string };
    fields: { [id: string]: string };
    scope: {
        locations?: string
    };
    update: Function;
}

/** Contract for a facet component implementation */
export interface FacetComponent {
    id: string;
    settings?: SearchComponentSettingsConfig;
    context?: QueryBuilderContext;
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
}

export interface FacetFieldBucket {
    count: number;
    display?: string;
    label: string;
    filterQuery: string;

    $checked?: boolean;
}
