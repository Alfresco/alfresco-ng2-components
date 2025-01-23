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

import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateRangeType } from './search-date-range/date-range-type';
import { SearchDateRange } from './search-date-range/search-date-range';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { InLastDateType } from './search-date-range/in-last-date-type';
import { TranslationService } from '@alfresco/adf-core';
import { endOfDay, endOfToday, format, formatISO, parseISO, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';
import { CommonModule } from '@angular/common';
import { SearchFilterTabbedComponent } from '../search-filter-tabbed/search-filter-tabbed.component';
import { SearchDateRangeComponent } from './search-date-range/search-date-range.component';
import { SearchFilterTabDirective } from '../search-filter-tabbed/search-filter-tab.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const DEFAULT_DATE_DISPLAY_FORMAT = 'dd-MMM-yy';

@Component({
    selector: 'adf-search-date-range-tabbed',
    imports: [CommonModule, SearchFilterTabbedComponent, SearchDateRangeComponent, SearchFilterTabDirective],
    templateUrl: './search-date-range-tabbed.component.html',
    styleUrls: ['./search-date-range-tabbed.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchDateRangeTabbedComponent implements SearchWidget, OnInit {
    displayValue$ = new ReplaySubject<string>(1);
    id: string;
    startValue: SearchDateRange = {
        dateRangeType: DateRangeType.ANY,
        inLastValueType: InLastDateType.DAYS,
        inLastValue: undefined,
        betweenStartDate: undefined,
        betweenEndDate: undefined
    };
    preselectedValues: { [key: string]: SearchDateRange } = {};
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    fields: string[];
    tabsValidity: { [key: string]: boolean } = {};
    combinedQuery: string;
    combinedDisplayValue: string;

    private value: { [key: string]: Partial<SearchDateRange> } = {};
    private queryMapByField: Map<string, string> = new Map<string, string>();
    private displayValueMapByField: Map<string, string> = new Map<string, string>();

    private readonly destroyRef = inject(DestroyRef);

    constructor(private translateService: TranslationService) {}

    ngOnInit(): void {
        this.fields = this.settings?.field.split(',').map((field) => field.trim());
        this.setDefaultDateFormatSettings();
        this.context.populateFilters
            .asObservable()
            .pipe(
                map((filtersQueries) => filtersQueries[this.id]),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((filterQuery) => {
                if (filterQuery) {
                    Object.keys(filterQuery).forEach((field) => {
                        filterQuery[field].betweenStartDate = filterQuery[field].betweenStartDate
                            ? parseISO(filterQuery[field].betweenStartDate)
                            : undefined;
                        filterQuery[field].betweenEndDate = filterQuery[field].betweenEndDate
                            ? parseISO(filterQuery[field].betweenEndDate)
                            : undefined;
                        this.preselectedValues[field] = filterQuery[field];
                        this.onDateRangedValueChanged(filterQuery[field], field);
                    });
                    this.submitValues(false);
                } else {
                    this.reset(false);
                }
                this.context.filterLoaded.next();
            });
    }
    private setDefaultDateFormatSettings() {
        if (this.settings && !this.settings.dateFormat) {
            this.settings.dateFormat = DEFAULT_DATE_DISPLAY_FORMAT;
        }
    }

    getCurrentValue(): { [key: string]: Partial<SearchDateRange> } {
        return this.value;
    }

    hasValidValue(): boolean {
        return Object.values(this.tabsValidity).every((valid) => valid);
    }

    reset(updateContext = true) {
        this.combinedQuery = '';
        this.combinedDisplayValue = '';
        this.startValue = {
            ...this.startValue
        };
        this.fields.forEach((field) => {
            this.context.filterRawParams[field] = undefined;
        });
        this.context.queryFragments[this.id] = undefined;
        this.context.filterRawParams[this.id] = undefined;
        this.submitValues(updateContext);
    }

    setValue(value: { [key: string]: SearchDateRange }) {
        this.value = value;
    }

    getTabLabel(field: string): string {
        return this.settings?.displayedLabelsByField?.[field] ? this.settings.displayedLabelsByField[field] : field;
    }

    submitValues(updateContext = true) {
        this.context.queryFragments[this.id] = this.combinedQuery;
        this.displayValue$.next(this.combinedDisplayValue);
        if (this.id && this.context && updateContext) {
            this.context.update();
        }
    }
    onDateRangedValueChanged(value: Partial<SearchDateRange>, field: string) {
        this.context.filterRawParams[this.id] ||= {};
        this.context.filterRawParams[this.id][field] = value;
        this.value[field] = value;
        this.updateQuery(value, field);
        this.updateDisplayValue(value, field);
    }

    private generateQuery(value: Partial<SearchDateRange>, field: string): string {
        let query = '';
        let startDate: Date;
        let endDate: Date;
        if (value.dateRangeType === DateRangeType.IN_LAST) {
            if (value.inLastValue) {
                switch (value.inLastValueType) {
                    case InLastDateType.DAYS:
                        startDate = startOfDay(subDays(new Date(), parseInt(value.inLastValue, 10)));
                        break;
                    case InLastDateType.WEEKS:
                        startDate = startOfWeek(subWeeks(new Date(), parseInt(value.inLastValue, 10)));
                        break;
                    case InLastDateType.MONTHS:
                        startDate = startOfMonth(subMonths(new Date(), parseInt(value.inLastValue, 10)));
                        break;
                    default:
                        break;
                }
            }
            endDate = endOfToday();
        } else if (value.dateRangeType === DateRangeType.BETWEEN) {
            if (value.betweenStartDate && value.betweenEndDate) {
                startDate = startOfDay(value.betweenStartDate);
                endDate = endOfDay(value.betweenEndDate);
            }
        }
        if (startDate && endDate) {
            query = `${field}:['${formatISO(startDate)}' TO '${formatISO(endDate)}']`;
        }
        return query;
    }

    private generateDisplayValue(value: Partial<SearchDateRange>): string {
        let displayValue = '';
        if (value.dateRangeType === DateRangeType.IN_LAST && value.inLastValue) {
            displayValue = this.translateService.instant(`SEARCH.DATE_RANGE_ADVANCED.IN_LAST_DISPLAY_LABELS.${value.inLastValueType}`, {
                value: value.inLastValue
            });
        } else if (value.dateRangeType === DateRangeType.BETWEEN && value.betweenStartDate && value.betweenEndDate) {
            displayValue = `${format(startOfDay(value.betweenStartDate), this.settings.dateFormat)} - ${format(
                endOfDay(value.betweenEndDate),
                this.settings.dateFormat
            )}`;
        }
        return displayValue;
    }

    private updateQuery(value: Partial<SearchDateRange>, field: string) {
        this.combinedQuery = '';
        this.queryMapByField.set(field, this.generateQuery(value, field));
        this.queryMapByField.forEach((query: string) => {
            if (query) {
                this.combinedQuery = this.combinedQuery ? `${this.combinedQuery} AND ${query}` : `${query}`;
            }
        });
    }

    private updateDisplayValue(value: Partial<SearchDateRange>, field: string) {
        this.combinedDisplayValue = '';
        this.displayValueMapByField.set(field, this.generateDisplayValue(value));
        this.displayValueMapByField.forEach((displayValue: string, fieldForDisplayLabel: string) => {
            if (displayValue) {
                const displayLabelForField = `${this.translateService
                    .instant(this.getDisplayLabelForField(fieldForDisplayLabel))
                    .toUpperCase()}: ${displayValue}`;
                this.combinedDisplayValue = this.combinedDisplayValue
                    ? `${this.combinedDisplayValue} ${displayLabelForField}`
                    : `${displayLabelForField}`;
            }
        });
    }

    private getDisplayLabelForField(fieldForDisplayLabel: string): string {
        return this.settings?.displayedLabelsByField?.[fieldForDisplayLabel]
            ? this.settings.displayedLabelsByField[fieldForDisplayLabel]
            : fieldForDisplayLabel;
    }
}
