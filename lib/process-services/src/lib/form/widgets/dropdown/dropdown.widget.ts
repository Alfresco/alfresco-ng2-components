/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService, FormFieldOption, WidgetComponent, ErrorWidgetComponent, ErrorMessageModel, FormFieldModel } from '@alfresco/adf-core';
import { ProcessDefinitionService } from '../../services/process-definition.service';
import { TaskFormService } from '../../services/task-form.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { filter, Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'dropdown-widget',
    standalone: true,
    imports: [CommonModule, TranslateModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, ErrorWidgetComponent],
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
export class DropdownWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {
    public formsService = inject(FormService);
    public taskFormService = inject(TaskFormService);
    public processDefinitionService = inject(ProcessDefinitionService);

    dropdownControl = new FormControl<FormFieldOption | string>(undefined);

    private readonly onDestroy$ = new Subject<void>();

    get isReadOnlyType(): boolean {
        return this.field.type === 'readonly';
    }

    get isReadOnlyField(): boolean {
        return this.field.readOnly;
    }

    private get isRestType(): boolean {
        return this.field?.optionType === 'rest';
    }

    private get hasRestUrl(): boolean {
        return !!this.field?.restUrl;
    }

    private get isValidRestConfig(): boolean {
        return this.isRestType && this.hasRestUrl;
    }

    ngOnInit() {
        if (this.isValidRestConfig && !this.isReadOnlyForm()) {
            if (this.field.form.taskId) {
                this.getValuesByTaskId();
            } else {
                this.getValuesByProcessDefinitionId();
            }
        }

        this.initFormControl();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    getValuesByTaskId() {
        this.taskFormService.getRestFieldValues(this.field.form.taskId, this.field.id).subscribe((formFieldOption) => {
            const options = [];
            if (this.field.emptyOption) {
                options.push(this.field.emptyOption);
            }
            this.field.options = options.concat(formFieldOption || []);
            this.field.updateForm();
        });
    }

    getValuesByProcessDefinitionId() {
        this.processDefinitionService
            .getRestFieldValuesByProcessId(this.field.form.processDefinitionId, this.field.id)
            .subscribe((formFieldOption) => {
                const options = [];
                if (this.field.emptyOption) {
                    options.push(this.field.emptyOption);
                }
                this.field.options = options.concat(formFieldOption || []);
                this.field.updateForm();
            });
    }

    private isReadOnlyForm(): boolean {
        return !!this.field?.form?.readOnly;
    }

    private initFormControl() {
        if (this.field?.required) {
            this.dropdownControl.addValidators([this.customRequiredValidator(this.field)]);
        }

        if (this.field?.readOnly || this.readOnly) {
            this.dropdownControl.disable({ emitEvent: false });
        }

        this.dropdownControl.valueChanges
            .pipe(
                filter(() => !!this.field),
                takeUntil(this.onDestroy$)
            )
            .subscribe((value) => {
                this.setOptionValue(value, this.field);
                this.handleErrors();
                this.onFieldChanged(this.field);
            });

        this.dropdownControl.setValue(this.getOptionValue(this.field?.value), { emitEvent: false });
        this.handleErrors();
    }

    private handleErrors() {
        if (!this.field) {
            return;
        }

        if (this.dropdownControl.valid) {
            this.field.validationSummary = new ErrorMessageModel('');
            return;
        }

        if (this.dropdownControl.invalid && this.dropdownControl.errors.required) {
            this.field.validationSummary = new ErrorMessageModel({ message: 'FORM.FIELD.REQUIRED' });
        }
    }

    private setOptionValue(option: string | FormFieldOption, field: FormFieldModel) {
        if (typeof option === 'string') {
            field.value = option;
            return;
        }
        if (option.id === 'empty' || option.name !== field.value) {
            field.value = option.id;
            return;
        }

        field.value = option.name;
    }

    private getOptionValue(value?: string | FormFieldOption) {
        if (this.field?.readOnly || this.readOnly) {
            return value;
        }

        if (typeof value === 'string') {
            return this.field.options.find((option) => option.id === value || option.name === value);
        }

        return value as FormFieldOption | undefined;
    }

    private customRequiredValidator(field: FormFieldModel): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const isEmptyInputValue = (value: any) => value == null || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
            const isEqualToEmptyValue = (value: any) =>
                field.hasEmptyValue &&
                (value === field.emptyOption.id ||
                    value === field.emptyOption.name ||
                    (value.id === field.emptyOption.id && value.name === field.emptyOption.name));

            return isEmptyInputValue(control.value) || isEqualToEmptyValue(control.value) ? { required: true } : null;
        };
    }
}
