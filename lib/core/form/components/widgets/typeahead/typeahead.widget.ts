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

/* tslint:disable:component-selector  */

import { LogService } from '../../../../services/log.service';
import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService } from './../../../services/form.service';
import { FormFieldOption } from './../core/form-field-option';
import { baseHost, WidgetComponent } from './../widget.component';

@Component({
    selector: 'typeahead-widget',
    templateUrl: './typeahead.widget.html',
    styleUrls: ['./typeahead.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class TypeaheadWidgetComponent extends WidgetComponent implements OnInit {

    minTermLength: number = 1;
    value: string;
    oldValue: string;
    options: FormFieldOption[] = [];

    constructor(public formService: FormService,
                private logService: LogService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field.form.taskId && this.field.restUrl) {
            this.getValuesByTaskId();
        } else if (this.field.form.processDefinitionId && this.field.restUrl) {
            this.getValuesByProcessDefinitionId();
        }
        if (this.isReadOnlyType()) {
            this.value = this.field.value;
        }
    }

    getValuesByTaskId() {
        this.formService
            .getRestFieldValues(
                this.field.form.taskId,
                this.field.id
            )
            .subscribe(
                (formFieldOption: FormFieldOption[]) => {
                    const options = formFieldOption || [];
                    this.field.options = options;

                    const fieldValue = this.field.value;
                    if (fieldValue) {
                        const toSelect = options.find((item) => item.id === fieldValue || item.name.toLocaleLowerCase() === fieldValue.toLocaleLowerCase());
                        if (toSelect) {
                            this.value = toSelect.name;
                        }
                    }
                    this.onFieldChanged(this.field);
                    this.field.updateForm();
                },
                (err) => this.handleError(err)
            );
    }

    getValuesByProcessDefinitionId() {
        this.formService
            .getRestFieldValuesByProcessId(
                this.field.form.processDefinitionId,
                this.field.id
            )
            .subscribe(
                (formFieldOption: FormFieldOption[]) => {
                    const options = formFieldOption || [];
                    this.field.options = options;

                    const fieldValue = this.field.value;
                    if (fieldValue) {
                        const toSelect = options.find((item) => item.id === fieldValue);
                        if (toSelect) {
                            this.value = toSelect.name;
                        }
                    }
                    this.onFieldChanged(this.field);
                    this.field.updateForm();
                },
                (err) => this.handleError(err)
            );
    }

    getOptions(): FormFieldOption[] {
        const val = this.value.trim().toLocaleLowerCase();
        return this.field.options.filter((item) => {
            const name = item.name.toLocaleLowerCase();
            return name.indexOf(val) > -1;
        });
    }

    isValidOptionName(optionName: string): boolean {
        const option = this.field.options.find((item) => item.name && item.name.toLocaleLowerCase() === optionName.toLocaleLowerCase());
        return option ? true : false;
    }

    onKeyUp(event: KeyboardEvent) {
        if (this.value && this.value.trim().length >= this.minTermLength && this.oldValue !== this.value) {
            if (event.keyCode !== ESCAPE && event.keyCode !== ENTER) {
                if (this.value.length >= this.minTermLength) {
                    this.options = this.getOptions();
                    this.oldValue = this.value;
                    if (this.isValidOptionName(this.value)) {
                        this.field.value = this.options[0].id;
                    }
                }
            }
        }
        if (this.isValueDefined() && this.value.trim().length === 0) {
            this.oldValue = this.value;
            this.options = [];
        }
    }

    onItemSelect(item: FormFieldOption) {
        if (item) {
            this.field.value = item.id;
            this.value = item.name;
            this.onFieldChanged(this.field);
        }
    }

    validate() {
        this.field.value = this.value;
    }

    isValueDefined() {
        return this.value !== null && this.value !== undefined;
    }

    handleError(error: any) {
        this.logService.error(error);
    }

    isReadOnlyType(): boolean {
        return this.field.type === 'readonly' ? true : false;
    }

}
