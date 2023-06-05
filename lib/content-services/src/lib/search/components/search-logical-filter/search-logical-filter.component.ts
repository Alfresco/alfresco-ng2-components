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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { Subject } from 'rxjs';
import { TranslationService } from '@alfresco/adf-core';

export enum LogicalSearchFields {
    MATCH_ALL = 'matchAll',
    MATCH_ANY = 'matchAny',
    EXCLUDE = 'exclude'
}

export type LogicalSearchConditionEnumValuedKeys = { [T in LogicalSearchFields]: string[]; };
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LogicalSearchCondition extends LogicalSearchConditionEnumValuedKeys {}

@Component({
    selector: 'adf-search-logical-filter',
    templateUrl: './search-logical-filter.component.html',
    styleUrls: ['./search-logical-filter.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchLogicalFilterComponent implements SearchWidget, OnInit {
    private searchCondition: LogicalSearchCondition;
    private reset$ = new Subject<void>();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    startValue: string;
    displayValue$: Subject<string> = new Subject<string>();
    resetObservable = this.reset$.asObservable();
    LogicalSearchFields = LogicalSearchFields;

    constructor(private translationService: TranslationService) {}

    ngOnInit(): void {
        this.searchCondition = { matchAll: [], matchAny: [], exclude: [] };
        this.updateDisplayValue();
    }

    onPhraseChange(phrases: string[], field: LogicalSearchFields) {
        this.searchCondition[field] = phrases;
        this.updateDisplayValue();
    }

    submitValues() {
        if (this.hasValidValue() && this.id && this.context && this.settings && this.settings.field) {
            this.updateDisplayValue();
            const fields = this.settings.field.split(',').map((field) => field += ':');
            let query = '';
            Object.keys(this.searchCondition).forEach((key) => {
                if (this.searchCondition[key].length > 0) {
                    let connector = '';
                    let subQuery = '';
                    switch(key) {
                        case LogicalSearchFields.MATCH_ALL:
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
                        this.searchCondition[key].forEach((phrase: string) => {
                            const refinedPhrase = '\"' + phrase + '\"';
                            fieldQuery += fieldQuery === '(' ?
                                `${key === LogicalSearchFields.EXCLUDE ? 'NOT ' : ''}${field}${refinedPhrase}` :
                                ` ${connector} ${field}${refinedPhrase}`;
                        });
                        subQuery += `${fieldQuery})`;
                    });
                    query += query === '' ? `(${subQuery})` : ` AND (${subQuery})`;
                    subQuery = '';
                }
            });
            this.context.queryFragments[this.id] = query;
            this.context.update();
        }
    }

    hasValidValue(): boolean {
        return Object.keys(this.searchCondition).some((key: string) => this.searchCondition[key].length !== 0);
    }

    getCurrentValue(): LogicalSearchCondition {
        return this.searchCondition;
    }

    setValue(value: LogicalSearchCondition) {
        this.searchCondition = value;
        this.updateDisplayValue();
    }

    reset() {
        if (this.id && this.context) {
            this.reset$.next();
            this.context.queryFragments[this.id] = '';
            this.updateDisplayValue();
            this.context.update();
        }
    }

    private updateDisplayValue(): void {
        if (this.hasValidValue()) {
            const displayValue = Object.keys(this.searchCondition).reduce((acc, key) => {
                const fieldIndex = Object.values(LogicalSearchFields).indexOf(key as LogicalSearchFields);
                const fieldKeyTranslated = this.translationService.instant(`SEARCH.LOGICAL_SEARCH.${Object.keys(LogicalSearchFields)[fieldIndex]}`);
                const stackedPhrases = this.searchCondition[key].reduce((phraseAcc, phrase) => `${phraseAcc === '' ? phraseAcc : phraseAcc + ','} ${phrase}`, '');
                return stackedPhrases !== '' ? `${acc} ${fieldKeyTranslated}: ${stackedPhrases}` : acc;
            }, '');
            this.displayValue$.next(displayValue);
        } else {
            this.displayValue$.next('');
        }
    }
}
