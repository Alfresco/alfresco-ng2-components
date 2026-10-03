/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService, FormFieldOption, WidgetComponent, FormFieldModel, ReactiveFormWidget } from '@alfresco/adf-core';
import { ProcessDefinitionService } from '../../services/process-definition.service';
import { TaskFormService } from '../../services/task-form.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { setDropdownRestOptionsLoaded } from './dropdown-rest-options';

/**
 * Returns the value the dropdown widget holds in its form control for a field value, resolving a string by option id or name.
 *
 * @param field Dropdown form field
 * @param value Field value
 * @param readOnly Whether the widget is read-only
 * @returns Form control value
 */
export const getDropdownOptionValue = (
    field: FormFieldModel,
    value?: string | FormFieldOption,
    readOnly = false
): FormFieldOption | string | undefined => {
    if (field?.readOnly || readOnly) {
        return value;
    }

    if (typeof value === 'string') {
        return field.options.find((option) => option.id === value || option.name === value);
    }

    return value as FormFieldOption | undefined;
};

/**
 * Checks whether a dropdown field loads its options from a REST endpoint.
 *
 * @param field Dropdown form field
 * @returns `true` when the field has a REST option source
 */
export const isDropdownRestField = (field: FormFieldModel): boolean => field?.optionType === 'rest' && !!field?.restUrl;

/**
 * Creates the required validator of the dropdown widget, which also treats the empty option as no value.
 *
 * @param field Dropdown form field
 * @returns Validator function
 */
export const dropdownRequiredValidator =
    (field: FormFieldModel): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
        const isEmptyInputValue = (value: any) => value == null || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
        const isEqualToEmptyValue = (value: any) =>
            field.hasEmptyValue &&
            (value === field.emptyOption.id ||
                value === field.emptyOption.name ||
                (value.id === field.emptyOption.id && value.name === field.emptyOption.name));

        return isEmptyInputValue(control.value) || isEqualToEmptyValue(control.value) ? { required: true } : null;
    };

@Component({
    selector: 'dropdown-widget',
    imports: [CommonModule, TranslatePipe, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatIconModule],
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
export class DropdownWidgetComponent extends WidgetComponent implements OnInit, ReactiveFormWidget {
    public formService = inject(FormService);
    public taskFormService = inject(TaskFormService);
    public processDefinitionService = inject(ProcessDefinitionService);
    private readonly destroyRef = inject(DestroyRef);

    dropdownControl = new FormControl<FormFieldOption | string>(undefined);

    readonly errorStateMatcher: ErrorStateMatcher = {
        isErrorState: (control) => !!control?.touched && this.hasValidationError()
    };

    get isReadOnlyType(): boolean {
        return this.field.type === 'readonly';
    }

    get isReadOnlyField(): boolean {
        return this.field.readOnly;
    }

    private get isValidRestConfig(): boolean {
        return isDropdownRestField(this.field);
    }

    ngOnInit() {
        if (this.isValidRestConfig && !this.isReadOnlyForm()) {
            if (this.field.form.taskId) {
                this.getValuesByTaskId();
            } else {
                this.getValuesByProcessDefinitionId();
            }
        }

        this.setFormControlValue();
        this.updateFormControlState();
        this.subscribeToInputChanges();
        this.validateField();
    }

    updateReactiveFormControl(): void {
        this.updateFormControlState();
        if (this.field?.form?.showAllValidationErrors) {
            this.dropdownControl.markAsTouched();
        }
        this.validateField();
    }

    getValuesByTaskId() {
        this.taskFormService
            .getRestFieldValues(this.field.form.taskId, this.field.id)
            .pipe(tap({ error: () => this.onRestOptionsFailed() }))
            .subscribe((formFieldOption) => {
                const options = [];
                if (this.field.emptyOption) {
                    options.push(this.field.emptyOption);
                }
                this.field.options = options.concat(formFieldOption || []);
                setDropdownRestOptionsLoaded(this.field);
                this.setFormControlValue();
                this.field.updateForm();
            });
    }

    getValuesByProcessDefinitionId() {
        this.processDefinitionService
            .getRestFieldValuesByProcessId(this.field.form.processDefinitionId, this.field.id)
            .pipe(tap({ error: () => this.onRestOptionsFailed() }))
            .subscribe((formFieldOption) => {
                const options = [];
                if (this.field.emptyOption) {
                    options.push(this.field.emptyOption);
                }
                this.field.options = options.concat(formFieldOption || []);
                setDropdownRestOptionsLoaded(this.field);
                this.setFormControlValue();
                this.field.updateForm();
            });
    }

    private onRestOptionsFailed(): void {
        setDropdownRestOptionsLoaded(this.field);
        this.validateField();
        this.field.form?.validateForm();
    }

    private isReadOnlyForm(): boolean {
        return !!this.field?.form?.readOnly;
    }

    private subscribeToInputChanges(): void {
        this.dropdownControl.valueChanges
            .pipe(
                filter(() => !!this.field),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((value) => {
                this.setOptionValue(value, this.field);
                this.validateField();
                this.onFieldChanged(this.field);
            });
    }

    private setFormControlValue(): void {
        this.dropdownControl.setValue(getDropdownOptionValue(this.field, this.field?.value, this.readOnly), { emitEvent: false });
    }

    hasValidationError(): boolean {
        return !this.field.isValid && this.field.validationSummary.isActive();
    }

    private updateFormControlState(): void {
        this.field?.readOnly || this.readOnly
            ? this.dropdownControl.disable({ emitEvent: false })
            : this.dropdownControl.enable({ emitEvent: false });

        if (this.field) {
            this.field.inputDisabled = this.readOnly;
        }
        this.dropdownControl.updateValueAndValidity({ emitEvent: false });
    }

    private validateField(): void {
        this.field?.validate();
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
}
