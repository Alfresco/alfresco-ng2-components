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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

import { CoreModule } from '@alfresco/adf-core';

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
import { SearchCheckListComponent } from './components/search-check-list/search-check-list.component';
import { SearchDateRangeComponent } from './components/search-date-range/search-date-range.component';
import { SearchSortingPickerComponent } from './components/search-sorting-picker/search-sorting-picker.component';
import { SEARCH_QUERY_SERVICE_TOKEN } from './search-query-service.token';
import { SearchQueryBuilderService } from './search-query-builder.service';
import { SearchFilterContainerComponent } from './components/search-filter-container/search-filter-container.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CoreModule
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
        SearchCheckListComponent,
        SearchDateRangeComponent,
        SearchSortingPickerComponent,
        SearchFilterContainerComponent
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
        SearchCheckListComponent,
        SearchDateRangeComponent,
        SearchSortingPickerComponent,
        SearchFilterContainerComponent
    ],
    providers: [
        { provide: SEARCH_QUERY_SERVICE_TOKEN, useExisting: SearchQueryBuilderService },
        SearchSortingPickerComponent
    ]
})
export class SearchModule {}
