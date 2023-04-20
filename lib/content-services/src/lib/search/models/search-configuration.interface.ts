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

import { FilterQuery } from './filter-query.interface';
import { FacetQuery } from './facet-query.interface';
import { FacetField, FacetFieldSettings } from './facet-field.interface';
import { SearchCategory } from './search-category.interface';
import { SearchSortingDefinition } from './search-sorting-definition.interface';
import { RequestHighlight } from '@alfresco/js-api';

export interface SearchConfiguration {
    include?: string[];
    fields?: string[];
    categories?: SearchCategory[];
    filterQueries?: FilterQuery[];
    filterWithContains?: boolean;
    resetButton?: boolean;
    facetQueries?: {
        label?: string;
        pageSize?: number;
        expanded?: boolean;
        mincount?: number;
        queries: FacetQuery[];
        settings?: FacetFieldSettings;
    };
    facetFields?: {
        expanded?: boolean;
        fields: FacetField[];
    };
    facetIntervals?: {
        expanded?: boolean;
        intervals: FacetField[];
    };
    sorting?: {
        options: SearchSortingDefinition[];
        defaults: SearchSortingDefinition[];
    };
    highlight?: RequestHighlight;
    name?: string;
    default?: boolean;
}
