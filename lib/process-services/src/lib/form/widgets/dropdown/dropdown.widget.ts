/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import {
    FormService,
    FormFieldOption,
    WidgetComponent,
    LogService
} from '@alfresco/adf-core';
import { ProcessDefinitionService } from '../../services/process-definition.service';
import { TaskFormService } from '../../services/task-form.service';

@Component({
    selector: 'dropdown-widget',
    templateUrl: './dropdown.widget.html',
    styleUrls: ['./dropdown.widget.scss'],
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
export class DropdownWidgetComponent extends WidgetComponent implements OnInit {

    constructor(public formService: FormService,
                public taskFormService: TaskFormService,
                public processDefinitionService: ProcessDefinitionService,
                private logService: LogService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field && this.field.restUrl) {
            if (this.field.form.taskId) {
                this.getValuesByTaskId();
            } else {
                this.getValuesByProcessDefinitionId();
            }
        }
    }

    getValuesByTaskId() {
        this.taskFormService
            .getRestFieldValues(
                this.field.form.taskId,
                this.field.id
            )
            .subscribe(
                (formFieldOption: FormFieldOption[]) => {
                    const options = [];
                    if (this.field.emptyOption) {
                        options.push(this.field.emptyOption);
                    }
                    this.field.options = options.concat((formFieldOption || []));
                    this.field.updateForm();
                },
                (err) => this.handleError(err)
            );
    }

    getValuesByProcessDefinitionId() {
        this.processDefinitionService
            .getRestFieldValuesByProcessId(
                this.field.form.processDefinitionId,
                this.field.id
            )
            .subscribe(
                (formFieldOption: FormFieldOption[]) => {
                    const options = [];
                    if (this.field.emptyOption) {
                        options.push(this.field.emptyOption);
                    }
                    this.field.options = options.concat((formFieldOption || []));
                    this.field.updateForm();
                },
                (err) => this.handleError(err)
            );
    }

    getOptionValue(option: FormFieldOption, fieldValue: string): string {
        let optionValue: string = '';
        if (option.id === 'empty' || option.name !== fieldValue) {
            optionValue = option.id;
        } else {
            optionValue = option.name;
        }
        return optionValue;
    }

    handleError(error: any) {
        this.logService.error(error);
    }

    isReadOnlyType(): boolean {
        return this.field.type === 'readonly';
    }

    showRequiredMessage(): boolean {
        return (this.isInvalidFieldRequired() || this.field.value === 'empty') && this.isTouched();
    }
}
