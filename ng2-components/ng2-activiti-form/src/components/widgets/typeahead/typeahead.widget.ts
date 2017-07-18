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

 /* tslint:disable:component-selector  */

import { Component, OnInit } from '@angular/core';
import { LogService } from 'ng2-alfresco-core';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { FormService } from './../../../services/form.service';
import { FormFieldOption } from './../core/form-field-option';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'typeahead-widget',
    templateUrl: './typeahead.widget.html',
    styleUrls: ['./typeahead.widget.scss'],
    host: baseHost
})
export class TypeaheadWidgetComponent extends WidgetComponent implements OnInit {

    popupVisible: boolean = false;
    minTermLength: number = 1;
    value: string;
    options: FormFieldOption[] = [];

    constructor(public formService: FormService,
                private visibilityService: WidgetVisibilityService,
                private logService: LogService) {
         super(formService);
    }

    ngOnInit() {
        if (this.field.form.taskId) {
            this.getValuesByTaskId();
        } else {
            this.getValuesByProcessDefinitionId();
        }
    }

    getValuesByTaskId() {
        this.formService
            .getRestFieldValues(
                this.field.form.taskId,
                this.field.id
            )
            .subscribe(
                (result: FormFieldOption[]) => {
                    let options = result || [];
                    this.field.options = options;

                    let fieldValue = this.field.value;
                    if (fieldValue) {
                        let toSelect = options.find(item => item.id === fieldValue);
                        if (toSelect) {
                            this.value = toSelect.name;
                        }
                    }
                    this.field.updateForm();
                    this.visibilityService.refreshEntityVisibility(this.field);
                },
                err => this.handleError(err)
            );
    }

    getValuesByProcessDefinitionId() {
        this.formService
            .getRestFieldValuesByProcessId(
                this.field.form.processDefinitionId,
                this.field.id
            )
            .subscribe(
                (result: FormFieldOption[]) => {
                    let options = result || [];
                    this.field.options = options;

                    let fieldValue = this.field.value;
                    if (fieldValue) {
                        let toSelect = options.find(item => item.id === fieldValue);
                        if (toSelect) {
                            this.value = toSelect.name;
                        }
                    }
                    this.field.updateForm();
                    this.visibilityService.refreshEntityVisibility(this.field);
                },
                err => this.handleError(err)
            );
    }

    getOptions(): FormFieldOption[] {
        let val = this.value.toLocaleLowerCase();
        return this.field.options.filter(item => {
            let name = item.name.toLocaleLowerCase();
            return name.indexOf(val) > -1;
        });
    }

    onKeyUp(event: KeyboardEvent) {
        if (this.value && this.value.length >= this.minTermLength) {
            this.options = this.getOptions();
            this.popupVisible = this.options.length > 0;
        } else {
            this.popupVisible = false;
        }
    }

    onBlur() {
        setTimeout(() => {
            this.flushValue();
            this.checkVisibility();
        }, 200);
    }

    flushValue() {
        this.popupVisible = false;

        let options = this.field.options || [];
        let lValue = this.value ? this.value.toLocaleLowerCase() : null;

        let field = options.find(item => item.name && item.name.toLocaleLowerCase() === lValue);
        if (field) {
            this.field.value = field.id;
            this.value = field.name;
        } else {
            this.field.value = null;
            this.value = null;
        }

        // TODO: seems to be not needed as field.value setter calls it
        this.field.updateForm();
    }

    // TODO: still causes onBlur execution
    onItemClick(item: FormFieldOption, event: Event) {
        if (item) {
            this.field.value = item.id;
            this.value = item.name;
            this.checkVisibility();
        }
        if (event) {
            event.preventDefault();
        }
    }

    handleError(error: any) {
        this.logService.error(error);
    }

    checkVisibility() {
        this.visibilityService.refreshVisibility(this.field.form);
    }

}
