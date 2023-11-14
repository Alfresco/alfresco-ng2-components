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

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchFilterList } from '../../models/search-filter-list.model';
import { Subject } from 'rxjs';

export interface SearchRadioOption {
    name: string;
    value: string;
}

@Component({
    selector: 'adf-search-radio',
    templateUrl: './search-radio.component.html',
    styleUrls: ['./search-radio.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-radio' }
})
export class SearchRadioComponent implements SearchWidget, OnInit {

    /** The value of the selected radio button. */
    @Input()
    value: string;

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilderService;
    options: SearchFilterList<SearchRadioOption>;
    pageSize = 5;
    isActive = false;
    startValue: any;
    enableChangeUpdate: boolean;
    displayValue$: Subject<string> = new Subject<string>();

    constructor() {
        this.options = new SearchFilterList<SearchRadioOption>();
    }

    ngOnInit() {
        if (this.settings) {
            this.pageSize = this.settings.pageSize || 5;

            if (this.settings.options && this.settings.options.length > 0) {
                this.options = new SearchFilterList<SearchRadioOption>(
                    this.settings.options, this.pageSize
                );
            }
        }

        const initialValue = this.getSelectedValue();

        if (initialValue !== null) {
            this.value = initialValue;
            this.context.queryFragments[this.id] = initialValue;
        } else if (this.startValue !== null) {
            this.value = initialValue;
            this.context.queryFragments[this.id] = initialValue;
        }
        this.enableChangeUpdate = this.settings.allowUpdateOnChange ?? true;
        this.updateDisplayValue();
    }

    private getSelectedValue(): string {
        const options: any[] = this.settings['options'] || [];
        if (options && options.length > 0) {
            this.isActive = true;

            let selected = options.find((opt) => opt.default);
            if (!selected) {
                selected = options[0];
            }
            return selected.value;
        }
        return null;
    }

    submitValues() {
        this.setValue(this.value);
        this.updateDisplayValue();
        this.context.update();
    }

    hasValidValue() {
        const currentValue = this.getSelectedValue();
        return !!currentValue;
    }

    setValue(newValue: string) {
        this.value = newValue;
        this.context.queryFragments[this.id] = newValue;
        if (this.enableChangeUpdate) {
            this.updateDisplayValue();
            this.context.update();
        }
    }

    getCurrentValue() {
        return this.getSelectedValue();
    }

    updateDisplayValue(): void {
        const selectOptions = this.options.items.find(({ value}) => value === this.value);
        if (selectOptions) {
            this.displayValue$.next(selectOptions.name);
        } else {
            this.displayValue$.next('');
        }
    }

    changeHandler(event: MatRadioChange) {
        this.setValue(event.value);
    }

    clear() {
        this.isActive = false;
        const initialValue = this.getSelectedValue();
        if (initialValue !== null) {
            this.setValue(initialValue);
        }
    }

    reset() {
        const initialValue = this.getSelectedValue();
        if (initialValue !== null) {
            this.setValue(initialValue);
            this.updateDisplayValue();
            this.context.update();
        }
    }
}
