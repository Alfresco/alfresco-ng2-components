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

import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';

@Component({
    selector: 'adf-search-filter-chips',
    templateUrl: './search-filter-chips.component.html',
    styleUrls: ['./search-filter-chips.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterChipsComponent {
    /** Toggles whether to show or not the context facet filters. */
    @Input()
    showContextFacets: boolean = true;

    constructor(
        @Inject(SEARCH_QUERY_SERVICE_TOKEN)
        public queryBuilder: SearchQueryBuilderService,
        public facetFiltersService: SearchFacetFiltersService) {}

}
