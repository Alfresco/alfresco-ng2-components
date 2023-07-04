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

import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewEncapsulation } from '@angular/core';
import { SearchFilterTabDirective } from './search-filter-tab.directive';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'adf-search-filter-tabbed',
  templateUrl: './search-filter-tabbed.component.html',
  styleUrls: ['./search-filter-tabbed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchFilterTabbedComponent {
    @Input()
    set settings(settings: SearchWidgetSettings) {
        this.fieldsChanged.emit(settings?.field.split(',').map(field => field.trim()));
        this.displayedLabelsByField = settings.displayedLabelsByField ? Object.entries<string>(settings.displayedLabelsByField)
            .reduce((displayLabelsByField, displayLabelAndField) => ({
                [displayLabelAndField[0]]: this.translateService.instant(displayLabelAndField[1]),
                ...displayLabelsByField
            }), {}) : {};
        this.displayedLabelsByFieldTranslated.emit(this.displayedLabelsByField);
    }

    @Input()
    set queries(queries: { [key: string]: string }) {
        this.queriesCombined.emit(Object.values(queries)
            .reduce((wholeQuery, query) => wholeQuery ? `${wholeQuery} AND ${query}` : query, ''));
    }

    @Input()
    set valuesToDisplay(valuesToDisplay: { [key: string]: string }) {
        this.valuesToDisplayCombined.emit(Object.values(valuesToDisplay).every((value) => !value) ?
            '' : Object.entries(valuesToDisplay).reduce((wholeValueToDisplay, valueToDisplayByField) => this.getWholeDisplayValue(wholeValueToDisplay, valueToDisplayByField), ''));
    }

    @Output()
    fieldsChanged = new EventEmitter<string[]>();
    @Output()
    displayedLabelsByFieldTranslated = new EventEmitter<{ [key: string]: string }>();
    @Output()
    queriesCombined = new EventEmitter<string>();
    @Output()
    valuesToDisplayCombined = new EventEmitter<string>();

    @ContentChildren(SearchFilterTabDirective)
    tabsContents: QueryList<SearchFilterTabDirective>;

    private displayedLabelsByField: { [key: string]: string };

    constructor(private translateService: TranslateService) {}

    private getWholeDisplayValue(wholeValueToDisplay, valueToDisplayByField): string {
        let displayValue = '';
        if(valueToDisplayByField?.[1] !== '') {
            if(wholeValueToDisplay) {
                displayValue = `${wholeValueToDisplay} ${this.displayedLabelsByField[valueToDisplayByField[0]].toUpperCase()}: ${valueToDisplayByField[1]}`;
            } else {
                displayValue = `${this.displayedLabelsByField[valueToDisplayByField[0]].toUpperCase()}: ${valueToDisplayByField[1]}`;
            }
        }
        return displayValue;
    }
}
