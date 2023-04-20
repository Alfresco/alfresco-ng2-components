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
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'adf-search-text',
    templateUrl: './search-text.component.html',
    styleUrls: ['./search-text.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-text' }
})
export class SearchTextComponent implements SearchWidget, OnInit {

    /** The content of the text box. */
    @Input()
    value = '';

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilderService;
    startValue: string;
    isActive = false;
    enableChangeUpdate = true;
    displayValue$: Subject<string> = new Subject<string>();

    ngOnInit() {
        if (this.context && this.settings && this.settings.pattern) {
            const pattern = new RegExp(this.settings.pattern, 'g');
            const match = pattern.exec(this.context.queryFragments[this.id] || '');
            if (this.settings.allowUpdateOnChange !== undefined &&
                this.settings.allowUpdateOnChange !== null) {
                this.enableChangeUpdate = this.settings.allowUpdateOnChange;
            }

            if (match && match.length > 1) {
                this.value = match[1];
            }

            if (this.startValue) {
                this.setValue(this.startValue);
            }
        }
    }

    clear() {
        this.isActive = false;
        this.value = '';
        if (this.enableChangeUpdate) {
            this.updateQuery(null);
        }
    }

    reset() {
        this.value = '';
        this.updateQuery(null);
    }

    onChangedHandler(event) {
        this.value = event.target.value;
        this.isActive = !!this.value;
        if (this.enableChangeUpdate) {
            this.updateQuery(this.value);
        }
    }

    private updateQuery(value: string) {
        this.displayValue$.next(value);
        if (this.context && this.settings && this.settings.field) {
            this.context.queryFragments[this.id] = value ? `${this.settings.field}:'${this.getSearchPrefix()}${value}${this.getSearchSuffix()}'` : '';
            this.context.update();
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
