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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchFilterList } from '../../models/search-filter-list.model';
import { TagService } from '../../../tag/services/tag.service';

@Component({
    selector: 'adf-search-filter-autocomplete-chips',
    templateUrl: './search-filter-autocomplete-chips.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterAutocompleteChipsComponent implements SearchWidget, OnInit {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    options: SearchFilterList<string[]>;
    startValue: string[] = null;
    displayValue$ = new Subject<string>();

    private resetSubject$ = new Subject<void>();
    reset$: Observable<void> = this.resetSubject$.asObservable();
    autocompleteOptions: string[] = [];
    selectedOptions: string[] = [];
    enableChangeUpdate: boolean;

    constructor( private tagService: TagService ) {
        this.options = new SearchFilterList<string[]>();
    }

    ngOnInit() {
        if (this.settings) {
            this.setOptions();
            if (this.startValue) {
                this.setValue(this.startValue);
            }
            this.enableChangeUpdate = this.settings.allowUpdateOnChange ?? true;
        }
    }

    reset() {
        this.selectedOptions = [];
        this.resetSubject$.next();
        this.updateQuery();
    }

    submitValues() {
        this.updateQuery();
    }

    hasValidValue(): boolean {
        return !!this.selectedOptions;
    }

    getCurrentValue(): string[]{
        return this.selectedOptions;
    }

    onOptionsChange(selectedOptions: string[]) {
        this.selectedOptions = selectedOptions;
        if (this.enableChangeUpdate) {
            this.updateQuery();
            this.context.update();
        }
    }

    setValue(value: string[]) {
        this.selectedOptions = value;
        this.displayValue$.next(this.selectedOptions.join(', '));
        this.submitValues();
    }

    private updateQuery() {
        this.displayValue$.next(this.selectedOptions.join(', '));
        if (this.context && this.settings && this.settings.field) {
            this.context.queryFragments[this.id] = this.selectedOptions.map(val => `${this.settings.field}: "${val}"`).join(' OR ');
            this.context.update();
        }
    }

    private setOptions() {
        if (this.settings.field === 'TAG') {
            this.tagService.getAllTheTags().subscribe(res => {
                this.autocompleteOptions = res.list.entries.map(tag => tag.entry.tag);
            });
        } else {
            this.autocompleteOptions = this.settings.options;
        }
    }
}
