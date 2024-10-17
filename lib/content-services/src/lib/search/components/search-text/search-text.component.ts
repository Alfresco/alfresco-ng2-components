/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'adf-search-text',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, TranslateModule, MatInputModule, MatButtonModule, FormsModule, MatIconModule],
    templateUrl: './search-text.component.html',
    styleUrls: ['./search-text.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-text' }
})
export class SearchTextComponent implements SearchWidget, OnInit, OnDestroy {
    /** The content of the text box. */
    @Input()
    value = '';

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilderService;
    startValue: string;
    isActive = false;
    enableChangeUpdate = true;
    displayValue$ = new ReplaySubject<string>(1);

    private readonly destroy$ = new Subject<void>();

    ngOnInit() {
        if (this.context && this.settings && this.settings.pattern) {
            const pattern = new RegExp(this.settings.pattern, 'g');
            const match = pattern.exec(this.context.queryFragments[this.id] || '');
            if (this.settings.allowUpdateOnChange !== undefined && this.settings.allowUpdateOnChange !== null) {
                this.enableChangeUpdate = this.settings.allowUpdateOnChange;
            }

            if (match && match.length > 1) {
                this.value = match[1];
            }

            if (this.startValue) {
                this.setValue(this.startValue);
            } else {
                if (this.context?.queryFragments) {
                    this.context.queryFragments[this.id] = '';
                }
            }
        }
        this.context.populateFilters
            .asObservable()
            .pipe(
                map((filtersQueries) => filtersQueries[this.id]),
                takeUntil(this.destroy$)
            )
            .subscribe((filterQuery) => {
                if (filterQuery) {
                    this.value = filterQuery;
                    this.updateQuery(this.value, false);
                } else {
                    this.reset(false);
                }
                this.context.filterLoaded.next();
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    clear() {
        this.isActive = false;
        this.value = '';
        if (this.enableChangeUpdate) {
            this.updateQuery(null);
        }
    }

    reset(updateContext = true) {
        this.value = '';
        this.updateQuery(null, updateContext);
    }

    onChangedHandler(event) {
        this.value = event.target.value;
        this.isActive = !!this.value;
        if (this.enableChangeUpdate) {
            this.updateQuery(this.value);
        }
    }

    private updateQuery(value: string, updateContext = true) {
        this.context.filterRawParams[this.id] = value;
        this.displayValue$.next(value);
        if (this.context && this.settings && this.settings.field) {
            this.context.queryFragments[this.id] = value ? `${this.settings.field}:'${this.getSearchPrefix()}${value}${this.getSearchSuffix()}'` : '';
            if (updateContext) {
                this.context.update();
            }
        }
    }

    submitValues() {
        this.updateQuery(this.value);
    }

    hasValidValue() {
        return !!this.value;
    }

    getCurrentValue() {
        return this.value;
    }

    setValue(value: string) {
        this.value = value;
        this.displayValue$.next(this.value);
        this.submitValues();
    }

    private getSearchPrefix(): string {
        return this.settings.searchPrefix ? this.settings.searchPrefix : '';
    }

    private getSearchSuffix(): string {
        return this.settings.searchSuffix ? this.settings.searchSuffix : '';
    }
}
