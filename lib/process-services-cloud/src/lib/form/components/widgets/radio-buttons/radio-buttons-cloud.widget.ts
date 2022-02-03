/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WidgetComponent, FormService, LogService, FormFieldOption } from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'radio-buttons-cloud-widget',
    templateUrl: './radio-buttons-cloud.widget.html',
    styleUrls: ['./radio-buttons-cloud.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class RadioButtonsCloudWidgetComponent extends WidgetComponent implements OnInit {

    typeId = 'RadioButtonsCloudWidgetComponent';
    protected onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService,
                private formCloudService: FormCloudService,
                private logService: LogService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field && this.field.restUrl) {
            this.getValuesFromRestApi();
        }
    }

    getValuesFromRestApi() {
        this.formCloudService.getRestWidgetData(this.field.form.id, this.field.id)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((result: FormFieldOption[]) => {
                this.field.options = result;
                this.field.updateForm();
            }, (err) => this.handleError(err));
    }

    onOptionClick(optionSelected: any) {
        this.field.value = optionSelected;
        this.fieldChanged.emit(this.field);
    }

    handleError(error: any) {
        this.logService.error(error);
    }

    isChecked(option: FormFieldOption): boolean {
        if (this.field.value && typeof this.field.value === 'object') {
            let id = 'id';
            let name = 'name';
            if (this.field.restUrl) {
                id = this.field.restIdProperty ?? 'id';
                name = this.field.restLabelProperty ?? 'name';
            }
            return this.field.value[id] === option.id || this.field.value[name] === option.name;
        }
        return this.field.value === option.id;
    }
}
