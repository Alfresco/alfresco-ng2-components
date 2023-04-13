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
import { MatSliderChange } from '@angular/material/slider';
import { Subject } from 'rxjs';

@Component({
    selector: 'adf-search-slider',
    templateUrl: './search-slider.component.html',
    styleUrls: ['./search-slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-slider' }
})
export class SearchSliderComponent implements SearchWidget, OnInit {
    isActive?: boolean;
    startValue: any;

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilderService;
    step: number;
    min: number;
    max: number;
    thumbLabel = false;
    enableChangeUpdate: boolean;
    displayValue$: Subject<string> = new Subject<string>();

    /** The numeric value represented by the slider. */
    @Input()
    value: number | null;

    ngOnInit() {
        if (this.settings) {
            if (this.settings.hasOwnProperty('min')) {
                this.min = this.settings['min'];
            }

            if (this.settings.hasOwnProperty('max')) {
                this.max = this.settings['max'];
            }

            if (this.settings.hasOwnProperty('step')) {
                this.step = this.settings['step'];
            }

            this.thumbLabel = this.settings['thumbLabel'] ? true : false;
            this.enableChangeUpdate = this.settings.allowUpdateOnChange ?? true;
        }

        if (this.startValue) {
            this.setValue(this.startValue);
        }
    }

    clear() {
        this.value = this.min || 0;
        if (this.enableChangeUpdate) {
            this.updateQuery(null);
        }
    }

    reset() {
        this.value = this.min || 0;
        this.updateQuery(null);
    }

    onChangedHandler(event: MatSliderChange) {
        this.value = event.value;
        if (this.enableChangeUpdate) {
            this.updateQuery(this.value);
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

    setValue(value: any) {
        this.value = value;
        this.submitValues();
    }

    private updateQuery(value: number | null) {
        this.displayValue$.next( this.value ? `${this.value} ${this.settings.unit ?? ''}` : '' );
        if (this.id && this.context && this.settings && this.settings.field) {
            if (value === null) {
                this.context.queryFragments[this.id] = '';
            } else {
                this.context.queryFragments[this.id] = `${this.settings.field}:[0 TO ${value}]`;
            }
            this.context.update();
        }
    }

}
