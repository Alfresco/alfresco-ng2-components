/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/**
 * A simple facet field
 */
export interface RequestFacetField {
    /**
     * The facet field
     */
    field?: string;
    /**
     * A label to include in place of the facet field
     */
    label?: string;
    /**
     * Restricts the possible constraints to only indexed values with a specified prefix.
     */
    prefix?: string;
    sort?: 'COUNT' | 'INDEX' | string;
    method?: 'ENUM' | 'FC' | string;
    /**
     * When true, count results that match the query but which have no facet value for the field (in addition to the Term-based constraints).
     */
    missing?: boolean;
    limit?: number;
    offset?: number;
    /**
     * The minimum count required for a facet field to be included in the response.
     */
    mincount?: number;
    facetEnumCacheMinDf?: number;
    /**
     * Filter Queries with tags listed here will not be included in facet counts.
     * This is used for multi-select facetting.
     */
    excludeFilters?: string[];
}
