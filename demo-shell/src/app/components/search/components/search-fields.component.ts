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
import { MatCheckboxChange } from '@angular/material';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'adf-search-fields',
    template: `
        <mat-checkbox
            *ngFor="let option of settings.options"
            [checked]="option.checked"
            (change)="changeHandler($event, option)">
            {{ option.name }}
        </mat-checkbox>
    `,
    styles: [`
        .adf-search-fields {
            display: flex;
            flex-direction: column;
        }

        .adf-search-fields .mat-checkbox {
            margin: 5px;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-fields' }
})
export class SearchFieldsComponent implements SearchComponent, OnInit {

    @Input()
    value: string;

    id: string;
    settings: SearchComponentSettings;
    context: SearchQueryBuilder;

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
