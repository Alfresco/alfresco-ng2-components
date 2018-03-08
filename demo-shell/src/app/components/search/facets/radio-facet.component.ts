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
import { MatRadioChange } from '@angular/material';

@Component({
    selector: 'app-radio-facet',
    template: `
        <div>
            <mat-radio-group [(ngModel)]="value" (change)="changeHandler($event)">
                <mat-radio-button
                    *ngFor="let option of settings.options" [value]="option.value">
                    {{ option.name }}
                </mat-radio-button>
            </mat-radio-group>
        </div>
    `,
    styles: [`
        .app-radio-facet .mat-radio-group {
            display: inline-flex;
            flex-direction: column;
        }

        .app-radio-facet .mat-radio-button {
            margin: 5px;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'app-radio-facet' }
})
export class RadioFacetComponent implements FacetComponent, OnInit {

    @Input()
    value: string;

    id: string;
    settings: FacetComponentSettingsConfig;
    context: QueryBuilderContext;

    ngOnInit() {
        // tslint:disable-next-line:no-console
        console.log(this.id, this.context);

        this.setValue(
            this.getSelectedValue()
        );

        /*
        if (this.context) {
            this.value = this.context.query[this.id] || '';
        }
        */
    }

    private getSelectedValue(): string {
        const options: any[] = this.settings['options'] || [];
        if (options && options.length > 0) {
            let selected = options.find(opt => opt.default);
            if (!selected) {
                selected = options[0];
            }
            return selected.value;
        }
        return null;
    }

    private setValue(newValue: string) {
        this.value = newValue;
        this.context.query[this.id] = newValue;
        this.context.update();
    }

    changeHandler(event: MatRadioChange) {
        // tslint:disable-next-line:no-console
        console.log(event);
        this.setValue(event.value);
    }
}
