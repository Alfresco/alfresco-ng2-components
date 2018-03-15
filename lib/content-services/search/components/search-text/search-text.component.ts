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

import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilder } from '../../search-query-builder';

@Component({
    selector: 'adf-search-text',
    templateUrl: './search-text.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-text' }
})
export class SearchTextComponent implements SearchWidget, OnInit {

    @Input()
    value = '';

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilder;

    ngOnInit() {
        if (this.context && this.settings) {
            const pattern = new RegExp(this.settings.pattern, 'g');
            const match = pattern.exec(this.context.queryFragments[this.id] || '');

            if (match && match.length > 1) {
                this.value = match[1];
            }
        }
    }

    onChangedHandler(event) {
        this.value = event.target.value;
        if (this.value) {
            this.context.queryFragments[this.id] = `${this.settings.field}:'${this.value}'`;
            this.context.update();
        }
    }

}
