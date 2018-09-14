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

import { Component, ViewEncapsulation, Input } from '@angular/core';
import { SearchFilterComponent } from '../../components/search-filter/search-filter.component';

@Component({
    selector: 'adf-search-chip-list',
    templateUrl: './search-chip-list.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-chip-list' }
})
export class SearchChipListComponent {

    /** Search filter to supply the data for the chips. */
    @Input()
    searchFilter: SearchFilterComponent;
}
