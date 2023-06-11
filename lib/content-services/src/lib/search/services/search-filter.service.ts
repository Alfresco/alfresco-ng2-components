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

import { Injectable, Type } from '@angular/core';
import { SearchTextComponent } from '../components/search-text/search-text.component';
import { SearchRadioComponent } from '../components/search-radio/search-radio.component';
import { SearchSliderComponent } from '../components/search-slider/search-slider.component';
import { SearchNumberRangeComponent } from '../components/search-number-range/search-number-range.component';
import { SearchCheckListComponent } from '../components/search-check-list/search-check-list.component';
import { SearchDateRangeComponent } from '../components/search-date-range/search-date-range.component';
import { SearchDatetimeRangeComponent } from '../components/search-datetime-range/search-datetime-range.component';
import { SearchLogicalFilterComponent } from '../components/search-logical-filter/search-logical-filter.component';
import { SearchFilterAutocompleteChipsComponent } from '../components/search-filter-autocomplete-chips/search-filter-autocomplete-chips.component';

@Injectable({
    providedIn: 'root'
})
export class SearchFilterService {

    /**
     * Contains string-to-type mappings for registered widgets.
     */
    widgets: { [id: string]: Type<any> } = {
        text: SearchTextComponent,
        radio: SearchRadioComponent,
        slider: SearchSliderComponent,
        'number-range': SearchNumberRangeComponent,
        'check-list': SearchCheckListComponent,
        'date-range': SearchDateRangeComponent,
        'datetime-range': SearchDatetimeRangeComponent,
        'logical-filter': SearchLogicalFilterComponent,
        'autocomplete-chips': SearchFilterAutocompleteChipsComponent
    };

}
