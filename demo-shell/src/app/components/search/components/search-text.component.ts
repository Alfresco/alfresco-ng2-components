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
import { SearchComponent, SearchComponentSettings, SearchQueryBuilder } from '@alfresco/adf-core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'adf-search-text',
    template: `
        <div>
            <mat-form-field>
                <input
                    matInput
                    [placeholder]="settings?.placeholder"
                    [value]="value"
                    (change)="onChangedHandler($event)">
            </mat-form-field>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-text' }
})
export class SearchTextComponent implements SearchComponent, OnInit {

    @Input()
    value = '';

    id: string;
    settings: SearchComponentSettings;
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
