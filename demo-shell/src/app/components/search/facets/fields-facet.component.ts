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
import { MatCheckboxChange } from '@angular/material';

@Component({
    selector: 'app-fields-facet',
    template: `
        <mat-checkbox
            *ngFor="let option of settings.options"
            [checked]="option.checked"
            (change)="changeHandler($event, option)">
            {{ option.name }}
        </mat-checkbox>
    `,
    styles: [`
        .app-fields-facet {
            display: flex;
            flex-direction: column;
        }

        .app-fields-facet .mat-checkbox {
            margin: 5px;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'app-fields-facet' }
})
export class FieldsFacetComponent implements FacetComponent, OnInit {

    @Input()
    value: string;

    id: string;
    settings: FacetComponentSettingsConfig;
    context: QueryBuilderContext;

    ngOnInit() {
        const defaultOptions = (this.settings.options || [])
            .filter(opt => opt.default)
            .map(opt => {
                opt.checked = true;
                return opt;
            });

        if (defaultOptions.length > 0) {
            this.flush(defaultOptions);
        }
    }

    changeHandler(event: MatCheckboxChange, option: any) {
        option.checked = event.checked;
        this.flush(this.settings.options);
    }

    flush(opts: any[] = []) {
        const checkedValues = opts
            .filter(v => v.checked)
            .map(v => v.fields)
            .reduce((prev, curr) => {
                return prev.concat(curr);
            }, []);

        this.context.fields[this.id] = checkedValues;
        this.context.update();
    }
}
