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
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationService } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export enum LogicalSearchFields {
    MATCH_ALL = 'matchAll',
    MATCH_ANY = 'matchAny',
    EXCLUDE = 'exclude',
    MATCH_EXACT = 'matchExact'
}

export type LogicalSearchConditionEnumValuedKeys = { [T in LogicalSearchFields]: string };
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LogicalSearchCondition extends LogicalSearchConditionEnumValuedKeys {}

@Component({
    selector: 'adf-search-logical-filter',
    imports: [CommonModule, MatFormFieldModule, TranslateModule, FormsModule],
    templateUrl: './search-logical-filter.component.html',
    styleUrls: ['./search-logical-filter.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchLogicalFilterComponent implements SearchWidget, OnInit {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    startValue: string;
    searchCondition: LogicalSearchCondition;
    fields = Object.keys(LogicalSearchFields);
    LogicalSearchFields = LogicalSearchFields;
    displayValue$ = new ReplaySubject<string>(1);

    private readonly destroyRef = inject(DestroyRef);

    constructor(private translationService: TranslationService) {}

    ngOnInit(): void {
        this.clearSearchInputs();
        this.context.populateFilters
            .asObservable()
            .pipe(
                map((filtersQueries) => filtersQueries[this.id]),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((filterQuery) => {
                if (filterQuery) {
                    this.searchCondition = filterQuery;
                    this.submitValues(false);
                } else {
                    this.reset(false);
                }
                this.context.filterLoaded.next();
            });
    }

    submitValues(updateContext = true) {
        if (this.hasValidValue() && this.id && this.context && this.settings && this.settings.field) {
            this.updateDisplayValue();
            const fields = this.settings.field.split(',').map((field) => (field += ':'));
            let query = '';
            Object.keys(this.searchCondition).forEach((key) => {
                if (this.searchCondition[key] !== '') {
                    let connector = '';
                    let subQuery = '';
                    switch (key) {
                        case LogicalSearchFields.MATCH_ALL:
                        case LogicalSearchFields.MATCH_EXACT:
                            connector = 'AND';
                            break;
                        case LogicalSearchFields.MATCH_ANY:
                            connector = 'OR';
                            break;
                        case LogicalSearchFields.EXCLUDE:
                            connector = 'AND NOT';
                            break;
                        default:
                            break;
                    }
                    fields.forEach((field) => {
                        subQuery += subQuery === '' ? '' : key === LogicalSearchFields.EXCLUDE ? ' AND ' : ' OR ';
                        let fieldQuery = '(';
                        if (key === LogicalSearchFields.MATCH_EXACT) {
                            fieldQuery += field + '"' + this.searchCondition[key].trim() + '"';
                        } else {
                            this.searchCondition[key]
                                .split(' ')
                                .filter((condition: string) => condition !== '')
                                .forEach((phrase: string) => {
                                    const refinedPhrase = '"' + phrase + '"';
                                    fieldQuery +=
                                        fieldQuery === '('
                                            ? `${key === LogicalSearchFields.EXCLUDE ? 'NOT ' : ''}${field}${refinedPhrase}`
                                            : ` ${connector} ${field}${refinedPhrase}`;
                                });
                        }
                        subQuery += `${fieldQuery})`;
                    });
                    query += query === '' ? `(${subQuery})` : ` AND (${subQuery})`;
                    subQuery = '';
                }
            });
            this.context.queryFragments[this.id] = query;
            if (updateContext) {
                this.context.update();
            }
        } else {
            this.reset(updateContext);
        }
    }

    hasValidValue(): boolean {
        return Object.keys(this.searchCondition).some((key: string) => this.searchCondition[key] !== '');
    }

    getCurrentValue(): LogicalSearchCondition {
        return this.searchCondition;
    }

    setValue(value: LogicalSearchCondition) {
        this.searchCondition = value;
        this.updateDisplayValue();
    }

    reset(updateContext = true) {
        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
            this.clearSearchInputs();
            this.context.filterRawParams[this.id] = this.searchCondition;
            if (updateContext) {
                this.context.update();
            }
        }
    }

    private updateDisplayValue(): void {
        this.context.filterRawParams[this.id] = this.searchCondition;
        if (this.hasValidValue()) {
            const displayValue = Object.keys(this.searchCondition).reduce((acc, key) => {
                const fieldIndex = Object.values(LogicalSearchFields).indexOf(key as LogicalSearchFields);
                const fieldKeyTranslated = this.translationService.instant(`SEARCH.LOGICAL_SEARCH.${this.fields[fieldIndex]}`);
                return this.searchCondition[key] !== '' ? `${acc} ${fieldKeyTranslated}: ${this.searchCondition[key]}` : acc;
            }, '');
            this.displayValue$.next(displayValue);
        } else {
            this.displayValue$.next('');
        }
    }

    private clearSearchInputs(): void {
        this.searchCondition = { matchAll: '', matchAny: '', matchExact: '', exclude: '' };
        this.updateDisplayValue();
    }
}
