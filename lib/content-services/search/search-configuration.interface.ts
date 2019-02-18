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

import { FilterQuery } from './filter-query.interface';
import { FacetQuery } from './facet-query.interface';
import { FacetField } from './facet-field.interface';
import { SearchCategory } from './search-category.interface';
import { SearchSortingDefinition } from './search-sorting-definition.interface';

export interface SearchConfiguration {
    include?: Array<string>;
    fields?: Array<string>;
    categories: Array<SearchCategory>;
    filterQueries?: Array<FilterQuery>;
    filterWithContains?: boolean;
    facetQueries?: {
        label?: string;
        pageSize?: number;
        expanded?: boolean;
        mincount?: number;
        queries: Array<FacetQuery>;
    };
    facetFields?: {
        expanded?: boolean;
        fields: Array<FacetField>;
    };
    facetIntervals?: {
        intervals: Array<any>;
    };
    sorting?: {
        options: Array<SearchSortingDefinition>;
        defaults: Array<SearchSortingDefinition>;
    };
}
