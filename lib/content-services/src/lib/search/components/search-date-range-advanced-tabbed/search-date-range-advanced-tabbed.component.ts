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

import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchDateRangeAdvanced } from './search-date-range-advanced/search-date-range-advanced';
import { DateRangeType } from './search-date-range-advanced/date-range-type';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { InLastDateType } from './search-date-range-advanced/in-last-date-type';

@Component({
  selector: 'adf-search-date-range-advanced-tabbed',
  templateUrl: './search-date-range-advanced-tabbed.component.html',
  styleUrls: ['./search-date-range-advanced-tabbed.component.scss']
})
export class SearchDateRangeAdvancedTabbedComponent implements SearchWidget {
    displayValue$ = new Subject<string>();
    id: string;
    startValue: SearchDateRangeAdvanced = {
        dateRangeType: DateRangeType.ANY,
        inLastValueType: InLastDateType.DAYS
    };
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    disableUpdateOnSubmit?: boolean;
    fields: string[];
    displayedLabelsByField: { [key: string]: string } = {};

    private _queries: { [key: string]: string } = {};
    private _valuesToDisplay: { [key: string]: string } = {};
    private value: { [key: string]: Partial<SearchDateRangeAdvanced> } = {};
    private _tabsValidity: { [key: string]: boolean } = {};
    private _combinedQuery: string;
    private _combinedValuesToDisplay: string;

    get queries(): { [key: string]: string } {
        return this._queries;
    }

    get valuesToDisplay(): { [key: string]: string } {
        return this._valuesToDisplay;
    }

    get tabsValidity(): { [key: string]: boolean } {
        return this._tabsValidity;
    }

    set combinedQuery(query: string) {
        this._combinedQuery = query;
    }

    set combinedValuesToDisplay(combinedValuesToDisplay: string) {
        this._combinedValuesToDisplay = combinedValuesToDisplay;
    }

    getCurrentValue(): { [key: string]: Partial<SearchDateRangeAdvanced> } {
        return this.value;
    }

    hasValidValue(): boolean {
        return !Object.values(this.tabsValidity).some((valid) => !valid);
    }

    reset(): void {
        this._queries = {};
        this._valuesToDisplay = {};
        this.startValue = {
            ...this.startValue
        };
        setTimeout(() => {
            this.submitValues();
        });
    }

    setValue(value: { [key: string]: SearchDateRangeAdvanced }) {
        this.value = value;
    }

    submitValues(): void {
        this.context.queryFragments[this.id] = this._combinedQuery;
        this.displayValue$.next(this._combinedValuesToDisplay);
        if (!this.disableUpdateOnSubmit && this.id && this.context) {
            this.context.update();
        }
    }

    onDisplayValueUpdate(valueToDisplay: string, field: string) {
        this._valuesToDisplay = {
            ...this.valuesToDisplay,
            [field]: valueToDisplay
        };
    }

    onQueryUpdate(query: string, field: string) {
        this._queries = {
            ...this._queries,
            [field]: query
        };
    }
}
