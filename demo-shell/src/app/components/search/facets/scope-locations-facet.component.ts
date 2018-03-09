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
import { FacetComponent, QueryBuilderContext, FacetComponentSettingsConfig } from './facets-api';
import { MatSelectChange } from '@angular/material';

@Component({
    selector: 'app-scope-locations-facet',
    template: `
        <mat-form-field>
            <mat-select
                [(value)]="value"
                (selectionChange)="changeHandler($event)">
                <mat-option
                    *ngFor="let option of settings.options"
                    [value]="option.value">
                    {{option.name}}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `,
    styles: [`
    `],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'app-scope-locations-facet' }
})
export class ScopeLocationsFacetComponent implements FacetComponent, OnInit {

    @Input()
    value: string;

    id: string;
    settings: FacetComponentSettingsConfig;
    context: QueryBuilderContext;

    ngOnInit() {

        const defaultSelection = (this.settings.options || []).find(opt => opt.default);
        if (defaultSelection) {
            this.flush(defaultSelection.value);
        }
    }

    changeHandler(event: MatSelectChange) {
        this.flush(event.value);
    }

    flush(value: string) {
        this.value = value;
        this.context.scope.locations = value;
        this.context.update();
    }
}
