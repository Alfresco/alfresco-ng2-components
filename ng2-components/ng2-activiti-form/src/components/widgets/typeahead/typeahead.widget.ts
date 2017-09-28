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

import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LogService } from 'ng2-alfresco-core';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { FormService } from './../../../services/form.service';
import { FormFieldOption } from './../core/form-field-option';
import { baseHost , WidgetComponent } from './../widget.component';

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
                private visibilityService: WidgetVisibilityService,
                private logService: LogService) {
         super(formService);
    }

    ngOnInit() {
        if (this.field.form.taskId) {
            this.getValuesByTaskId();
        } else if (this.field.form.processDefinitionId) {
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
        if (this.value && this.value.length >= this.minTermLength  && this.oldValue !== this.value) {
            if (event.keyCode !== ESCAPE && event.keyCode !== ENTER) {
                if (this.value.length >= this.minTermLength) {
                    this.options = this.getOptions();
                    this.oldValue = this.value;
                }
            }
        }
    }

    flushValue() {
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

        this.field.updateForm();
    }

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

    onItemSelect(item: FormFieldOption) {
        if (item) {
            this.field.value = item.id;
            this.value = item.name;
            this.checkVisibility();
        }
    }

    handleError(error: any) {
        this.logService.error(error);
    }

    checkVisibility() {
        this.visibilityService.refreshVisibility(this.field.form);
    }

    isReadOnlyType(): boolean {
        return this.field.type === 'readonly' ? true : false;
    }

}
