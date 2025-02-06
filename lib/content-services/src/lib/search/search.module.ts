/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgModule } from '@angular/core';
import { SearchControlComponent } from './components/search-control.component';
import { SearchComponent } from './components/search.component';
import { EmptySearchResultComponent } from './components/empty-search-result.component';
import { SearchWidgetContainerComponent } from './components/search-widget-container/search-widget-container.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { SearchFilterCardComponent } from './components/search-filter/search-filter-card/search-filter-card.component';
import { SearchChipListComponent } from './components/search-chip-list/search-chip-list.component';
import { SearchTextComponent } from './components/search-text/search-text.component';
import { SearchChipAutocompleteInputComponent } from './components/search-chip-autocomplete-input/search-chip-autocomplete-input.component';
import { SearchFilterAutocompleteChipsComponent } from './components/search-filter-autocomplete-chips/search-filter-autocomplete-chips.component';
import { SearchRadioComponent } from './components/search-radio/search-radio.component';
import { SearchSliderComponent } from './components/search-slider/search-slider.component';
import { SearchNumberRangeComponent } from './components/search-number-range/search-number-range.component';
import { SearchPanelComponent } from './components/search-panel/search-panel.component';
import { SearchCheckListComponent } from './components/search-check-list/search-check-list.component';
import { SearchSortingPickerComponent } from './components/search-sorting-picker/search-sorting-picker.component';
import { SearchFilterContainerComponent } from './components/search-filter-container/search-filter-container.component';
import { SearchDatetimeRangeComponent } from './components/search-datetime-range/search-datetime-range.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchFilterChipsComponent } from './components/search-filter-chips/search-filter-chips.component';
import { SearchFilterMenuCardComponent } from './components/search-filter-chips/search-filter-menu-card/search-filter-menu-card.component';
import { SearchFacetFieldComponent } from './components/search-facet-field/search-facet-field.component';
import { SearchWidgetChipComponent } from './components/search-filter-chips/search-widget-chip/search-widget-chip.component';
import { SearchFacetChipComponent } from './components/search-filter-chips/search-facet-chip/search-facet-chip.component';
import { SearchLogicalFilterComponent } from './components/search-logical-filter/search-logical-filter.component';
import { ResetSearchDirective } from './components/reset-search.directive';
import { SearchPropertiesComponent } from './components/search-properties/search-properties.component';
import { SearchFilterTabbedComponent } from './components/search-filter-tabbed/search-filter-tabbed.component';
import { SearchDateRangeComponent } from './components/search-date-range-tabbed/search-date-range/search-date-range.component';
import { SearchDateRangeTabbedComponent } from './components/search-date-range-tabbed/search-date-range-tabbed.component';
import { SearchFilterTabDirective } from './components/search-filter-tabbed/search-filter-tab.directive';
import { SearchFacetChipTabbedComponent } from './components/search-filter-chips/search-facet-chip-tabbed/search-facet-chip-tabbed.component';
import { SearchFacetTabbedContentComponent } from './components/search-filter-chips/search-facet-chip-tabbed/search-facet-tabbed-content.component';

export const CONTENT_SEARCH_DIRECTIVES = [
    SearchCheckListComponent,
    SearchChipAutocompleteInputComponent,
    SearchChipListComponent,
    EmptySearchResultComponent,
    SearchFilterComponent,
    SearchFilterCardComponent,
    SearchWidgetContainerComponent,
    SearchTextComponent,
    SearchFilterAutocompleteChipsComponent,
    SearchDatetimeRangeComponent,
    SearchFacetFieldComponent,
    ResetSearchDirective,
    SearchDateRangeComponent,
    SearchFilterMenuCardComponent,
    SearchFacetChipTabbedComponent,
    SearchFacetTabbedContentComponent,
    SearchFilterTabbedComponent,
    SearchFilterTabDirective,
    SearchDateRangeTabbedComponent,
    SearchSortingPickerComponent,
    SearchSliderComponent,
    SearchNumberRangeComponent,
    SearchPanelComponent,
    SearchRadioComponent,
    SearchFilterContainerComponent,
    SearchFormComponent,
    SearchFilterChipsComponent,
    SearchWidgetChipComponent,
    SearchFacetChipComponent,
    SearchLogicalFilterComponent,
    SearchPropertiesComponent,
    SearchComponent,
    SearchControlComponent
] as const;

/** @deprecated use `...CONTENT_SEARCH_DIRECTIVES` or import the specific component */
@NgModule({
    imports: [...CONTENT_SEARCH_DIRECTIVES],
    exports: [...CONTENT_SEARCH_DIRECTIVES]
})
export class SearchModule {}
