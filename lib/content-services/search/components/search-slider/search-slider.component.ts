/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { MatSliderChange } from '@angular/material';

@Component({
    selector: 'adf-search-slider',
    templateUrl: './search-slider.component.html',
    styleUrls: ['./search-slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-slider' }
})
export class SearchSliderComponent implements SearchWidget, OnInit {

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilderService;
    step: number;
    min: number;
    max: number;
    thumbLabel = false;
    value: number;

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
        }
    }

    onChangedHandler(event: MatSliderChange) {
        this.value = event.value;

        if (this.id && this.context && this.settings && this.settings.field) {
            this.context.queryFragments[this.id] = `${this.settings.field}:[0 TO ${this.value}]`;
            this.context.update();
        }
    }

}
