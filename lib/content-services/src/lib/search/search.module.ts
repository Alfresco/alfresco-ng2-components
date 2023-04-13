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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

import { CoreModule, SearchTextModule } from '@alfresco/adf-core';

import { SearchControlComponent } from './components/search-control.component';
import { SearchComponent } from './components/search.component';
import { EmptySearchResultComponent } from './components/empty-search-result.component';
import { SearchWidgetContainerComponent } from './components/search-widget-container/search-widget-container.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { SearchChipListComponent } from './components/search-chip-list/search-chip-list.component';
import { SearchTextComponent } from './components/search-text/search-text.component';
import { SearchRadioComponent } from './components/search-radio/search-radio.component';
import { SearchSliderComponent } from './components/search-slider/search-slider.component';
import { SearchNumberRangeComponent } from './components/search-number-range/search-number-range.component';
import { SearchPanelComponent } from './components/search-panel/search-panel.component';
import { SearchCheckListComponent } from './components/search-check-list/search-check-list.component';
import { SearchDateRangeComponent } from './components/search-date-range/search-date-range.component';
import { SearchSortingPickerComponent } from './components/search-sorting-picker/search-sorting-picker.component';
import { SEARCH_QUERY_SERVICE_TOKEN } from './search-query-service.token';
import { SearchQueryBuilderService } from './services/search-query-builder.service';
import { SearchFilterContainerComponent } from './components/search-filter-container/search-filter-container.component';
import { SearchDatetimeRangeComponent } from './components/search-datetime-range/search-datetime-range.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchFilterChipsComponent } from './components/search-filter-chips/search-filter-chips.component';
import { SearchFilterMenuCardComponent } from './components/search-filter-chips/search-filter-menu-card/search-filter-menu-card.component';
import { SearchFacetFieldComponent } from './components/search-facet-field/search-facet-field.component';
import { SearchWidgetChipComponent } from './components/search-filter-chips/search-widget-chip/search-widget-chip.component';
import { SearchFacetChipComponent } from './components/search-filter-chips/search-facet-chip/search-facet-chip.component';
import { ResetSearchDirective } from './components/reset-search.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CoreModule,
        SearchTextModule
    ],
    declarations: [
        SearchComponent,
        SearchControlComponent,
        EmptySearchResultComponent,
        SearchFilterComponent,
        SearchChipListComponent,
        SearchWidgetContainerComponent,
        SearchTextComponent,
        SearchRadioComponent,
        SearchSliderComponent,
        SearchNumberRangeComponent,
        SearchPanelComponent,
        SearchCheckListComponent,
        SearchDateRangeComponent,
        SearchDatetimeRangeComponent,
        SearchSortingPickerComponent,
        SearchFilterContainerComponent,
        SearchFormComponent,
        SearchFilterChipsComponent,
        SearchFilterMenuCardComponent,
        SearchFacetFieldComponent,
        SearchWidgetChipComponent,
        SearchFacetChipComponent,
        ResetSearchDirective
    ],
    exports: [
        SearchComponent,
        SearchControlComponent,
        EmptySearchResultComponent,
        SearchFilterComponent,
        SearchChipListComponent,
        SearchWidgetContainerComponent,
        SearchTextComponent,
        SearchRadioComponent,
        SearchSliderComponent,
        SearchNumberRangeComponent,
        SearchPanelComponent,
        SearchCheckListComponent,
        SearchDateRangeComponent,
        SearchDatetimeRangeComponent,
        SearchSortingPickerComponent,
        SearchFilterContainerComponent,
        SearchFormComponent,
        SearchFilterChipsComponent,
        SearchFilterMenuCardComponent,
        SearchFacetFieldComponent,
        ResetSearchDirective
    ],
    providers: [
        { provide: SEARCH_QUERY_SERVICE_TOKEN, useExisting: SearchQueryBuilderService }
    ]
})
export class SearchModule {}
