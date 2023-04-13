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

import { Component, ViewEncapsulation, Input } from '@angular/core';
import { SearchFilterComponent } from '../../components/search-filter/search-filter.component';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';

@Component({
    selector: 'adf-search-chip-list',
    templateUrl: './search-chip-list.component.html',
    styleUrls: ['./search-chip-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-chip-list' }
})
export class SearchChipListComponent {

    /**
     * Search filter to supply the data for the chips.
     * Not required from 4.5.0 and later versions @deprecated
     * */
    @Input()
    searchFilter: SearchFilterComponent;

    /** Flag used to enable the display of a clear-all-filters button. */
    @Input()
    clearAll: boolean = false;

    constructor(public facetFiltersService: SearchFacetFiltersService) {}
}
