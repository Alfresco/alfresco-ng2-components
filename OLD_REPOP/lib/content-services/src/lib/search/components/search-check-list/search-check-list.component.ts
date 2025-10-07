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
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchFilterList } from '../../models/search-filter-list.model';
import { TranslationService } from '@alfresco/adf-core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface SearchListOption {
    name: string;
    value: string;
    checked: boolean;
}

@Component({
    selector: 'adf-search-check-list',
    imports: [CommonModule, MatCheckboxModule, TranslatePipe, MatButtonModule, MatIconModule],
    templateUrl: './search-check-list.component.html',
    styleUrls: ['./search-check-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-check-list' }
})
export class SearchCheckListComponent implements SearchWidget, OnInit {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    options: SearchFilterList<SearchListOption>;
    operator: string = 'OR';
    startValue: string;
    pageSize = 5;
    isActive = false;
    enableChangeUpdate = true;
    displayValue$ = new ReplaySubject<string>(1);

    private readonly destroyRef = inject(DestroyRef);

    constructor(private translationService: TranslationService) {
        this.options = new SearchFilterList<SearchListOption>();
    }

    ngOnInit(): void {
        if (this.settings) {
            this.operator = this.settings.operator || 'OR';
            this.pageSize = this.settings.pageSize || 5;

            if (this.settings.options && this.settings.options.length > 0) {
                this.options = new SearchFilterList(this.settings.options, this.pageSize);
            }
            this.enableChangeUpdate = this.settings.allowUpdateOnChange ?? true;
        }

        if (this.startValue) {
            this.setValue(this.startValue);
        } else {
            if (this.id && this.context) {
                this.context.queryFragments[this.id] = '';
            }
        }
        this.context.populateFilters
            .asObservable()
            .pipe(
                map((filtersQueries) => filtersQueries[this.id]),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((filterQuery) => {
                if (filterQuery) {
                    filterQuery.forEach((value) => {
                        const option = this.options.items.find((searchListOption) => searchListOption.value === value);
                        if (option) {
                            option.checked = true;
                        }
                    });
                    this.submitValues(false);
                } else {
                    this.reset(false);
                }
                this.context.filterLoaded.next();
            });
    }

    clear() {
        this.isActive = false;
        this.clearOptions();
        if (this.id && this.context && this.enableChangeUpdate) {
            this.updateDisplayValue();
            this.context.update();
        }
    }

    clearOptions() {
        this.options.items.forEach((opt) => {
            opt.checked = false;
        });

        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
            this.context.filterRawParams[this.id] = undefined;
        }
    }

    reset(updateContext = true) {
        this.isActive = false;
        this.clearOptions();
        if (this.id && this.context) {
            this.updateDisplayValue();
            if (updateContext) {
                this.context.update();
            }
        }
    }

    updateDisplayValue(): void {
        const displayValue = this.options.items
            .filter((option) => option.checked)
            .map(({ name }) => this.translationService.instant(name))
            .join(', ');
        this.displayValue$.next(displayValue);
    }

    changeHandler(event: MatCheckboxChange, option: any) {
        option.checked = event.checked;
        const checkedValues = this.getCheckedValues();
        this.isActive = !!checkedValues.length;
        if (this.enableChangeUpdate) {
            this.submitValues();
        }
    }

    hasValidValue() {
        const checkedValues = this.getCheckedValues();
        return !!checkedValues.length;
    }

    getCurrentValue() {
        return this.getCheckedValues();
    }

    setValue(value: any) {
        this.options.items.filter((item) => value.includes(item.value)).map((item) => (item.checked = true));
        this.submitValues();
    }

    private getCheckedValues() {
        return this.options.items.filter((option) => option.checked).map((option) => option.value);
    }

    submitValues(updateContext = true) {
        const checkedValues = this.getCheckedValues();
        if (checkedValues.length !== 0) {
            this.context.filterRawParams[this.id] = checkedValues;
        }
        const query = checkedValues.join(` ${this.operator} `);
        if (this.id && this.context) {
            this.context.queryFragments[this.id] = query;
            this.updateDisplayValue();
            if (updateContext) {
                this.context.update();
            }
        }
    }
}
