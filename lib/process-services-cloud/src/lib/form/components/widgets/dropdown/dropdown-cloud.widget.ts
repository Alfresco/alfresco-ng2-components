/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    AppConfigService,
    ErrorMessageModel,
    ErrorWidgetComponent,
    FormFieldEvent,
    FormFieldModel,
    FormFieldOption,
    FormFieldTypes,
    FormService,
    ReactiveFormWidget,
    RuleEntry,
    SelectFilterInputComponent,
    WidgetComponent
} from '@alfresco/adf-core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TaskVariableCloud } from '../../../models/task-variable-cloud.model';
import { FormCloudService } from '../../../services/form-cloud.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormUtilsService } from '../../../services/form-utils.service';
import { defaultValueValidator } from './validators';

export const DEFAULT_OPTION = {
    id: 'empty',
    name: 'Choose one...'
};
export const HIDE_FILTER_LIMIT = 5;

/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'dropdown-cloud-widget',
    templateUrl: './dropdown-cloud.widget.html',
    styleUrls: ['./dropdown-cloud.widget.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        ErrorWidgetComponent,
        TranslateModule,
        SelectFilterInputComponent
    ]
})
export class DropdownCloudWidgetComponent extends WidgetComponent implements OnInit, ReactiveFormWidget {
    public formService = inject(FormService);
    private readonly formCloudService = inject(FormCloudService);
    private readonly appConfig = inject(AppConfigService);
    private readonly formUtilsService = inject(FormUtilsService);
    private destroyRef = inject(DestroyRef);

    typeId = 'DropdownCloudWidgetComponent';
    showInputFilter = false;
    isRestApiFailed = false;
    variableOptionsFailed = false;
    previewState = false;
    restApiHostName: string;
    dropdownControl = new FormControl<FormFieldOption | FormFieldOption[]>(undefined);

    list$ = new BehaviorSubject<FormFieldOption[]>([]);
    filter$ = new BehaviorSubject<string>('');

    private readonly defaultVariableOptionId = 'id';
    private readonly defaultVariableOptionLabel = 'name';
    private readonly defaultVariableOptionPath = 'data';

    get showRequiredMessage(): boolean {
        return this.dropdownControl.touched && this.dropdownControl.errors?.required && !this.isRestApiFailed && !this.variableOptionsFailed;
    }

    get isReadOnlyType(): boolean {
        return this.field.type === 'readonly';
    }

    private get isLinkedWidget(): boolean {
        return !!this.linkedWidgetId;
    }

    private get linkedWidgetId(): string {
        return this.field?.rule?.ruleOn;
    }

    private get isReadOnlyForm(): boolean {
        return !!this.field?.form?.readOnly;
    }

    private get hasRestUrl(): boolean {
        return !!this.field?.restUrl;
    }

    private get isValidRestConfig(): boolean {
        return this.isRestOptionType && this.hasRestUrl;
    }

    private get isRestOptionType(): boolean {
        return this.field?.optionType === 'rest';
    }

    private get isVariableOptionType(): boolean {
        return this.field?.optionType === 'variable';
    }

    ngOnInit() {
        this.setupDropdown();

        this.formService.onFormVariableChanged.subscribe(({ field }) => {
            if (field.id === this.field.id) {
                this.setupDropdown();
            }
        });
    }

    updateReactiveFormControl(): void {
        this.updateFormControlState();
        this.handleErrors();
    }

    compareDropdownValues(opt1: FormFieldOption | string, opt2: FormFieldOption | string): boolean {
        if (!opt1 || !opt2) {
            return false;
        }

        if (typeof opt1 === 'string' && typeof opt2 === 'object') {
            return opt1 === opt2.id || opt1 === opt2.name;
        }

        if (typeof opt1 === 'object' && typeof opt2 === 'string') {
            return opt1.id === opt2 || opt1.name === opt2;
        }

        if (typeof opt1 === 'object' && typeof opt2 === 'object') {
            return opt1.id === opt2.id || opt1.name === opt2.name;
        }

        return opt1 === opt2;
    }

    selectionChangedForField(field: FormFieldModel): void {
        const formFieldValueChangedEvent = new FormFieldEvent(field.form, field);
        this.formService.formFieldValueChanged.next(formFieldValueChangedEvent);
        this.onFieldChanged(field);
    }

    private setupDropdown(): void {
        this.setPreviewState();

        this.checkFieldOptionsSource();
        this.updateOptions();

        this.setFormControlValue();
        this.updateFormControlState();
        this.subscribeToInputChanges();
        this.initFilter();
        this.handleErrors();
    }

    private subscribeToInputChanges(): void {
        this.dropdownControl.valueChanges
            .pipe(
                filter(() => !!this.field),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((value) => {
                this.setOptionValue(value, this.field);
                this.handleErrors();
                this.selectionChangedForField(this.field);
            });
    }

    private setFormControlValue(): void {
        if (Array.isArray(this.field.value)) {
            this.dropdownControl.setValue(this.field?.value, { emitEvent: false });
        } else if (this.field?.value && typeof this.field?.value === 'object') {
            this.dropdownControl.setValue({ id: this.field?.value.id, name: this.field?.value.name }, { emitEvent: false });
        } else if (this.field.value === null) {
            this.dropdownControl.setValue(this.field?.value, { emitEvent: false });
        } else {
            this.dropdownControl.setValue({ id: this.field?.value, name: '' }, { emitEvent: false });
        }
    }

    private updateFormControlState(): void {
        const isFieldRequired = this.isRequired();

        this.dropdownControl.setValidators(isFieldRequired && this.field?.isVisible ? [Validators.required] : []);

        const addSelectDefaultOptionValidator = isFieldRequired && this.field.hasEmptyValue;
        if (addSelectDefaultOptionValidator) {
            this.dropdownControl.addValidators([defaultValueValidator(this.field)]);
        }

        this.field?.readOnly || this.readOnly
            ? this.dropdownControl.disable({ emitEvent: false })
            : this.dropdownControl.enable({ emitEvent: false });

        this.dropdownControl.updateValueAndValidity({ emitEvent: false });
    }

    private handleErrors(): void {
        if (this.dropdownControl.valid) {
            this.field.validationSummary = new ErrorMessageModel('');
            this.field.markAsValid();
            return;
        }

        if (this.dropdownControl.invalid && this.dropdownControl.errors.required) {
            this.field.validationSummary = new ErrorMessageModel({ message: 'FORM.FIELD.REQUIRED' });
            this.field.markAsInvalid();
        }
    }

    private initFilter(): void {
        this.filter$
            .pipe(
                filter((search) => search !== undefined),
                map((search) =>
                    search ? this.field.options.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase())) : this.field.options
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.list$.next(result));
    }

    private checkFieldOptionsSource(): void {
        switch (true) {
            case this.isReadOnlyForm:
                break;
            case this.isValidRestConfig && !this.isLinkedWidget:
                this.persistFieldOptionsFromRestApi();
                break;

            case this.isLinkedWidget:
                this.loadFieldOptionsForLinkedWidget();
                break;

            case this.isVariableOptionType:
                this.persistFieldOptionsFromVariable();
                break;

            default:
                break;
        }
    }

    private persistFieldOptionsFromVariable(): void {
        const optionsPath = this.field?.variableConfig?.optionsPath ?? this.defaultVariableOptionPath;
        const variableName = this.field?.variableConfig?.variableName;
        const processVariables = this.field?.form?.processVariables;
        const formVariables = this.field?.form?.variables;

        const dropdownOptions = this.getOptionsFromVariable(processVariables, formVariables, variableName);

        if (dropdownOptions) {
            const formVariableOptions: FormFieldOption[] = this.getOptionsFromPath(dropdownOptions, optionsPath);
            this.updateOptions(formVariableOptions);
            this.resetInvalidValue();
            this.field.updateForm();
        } else {
            this.handleError(`${variableName} not found`);
            this.resetOptions();
            this.variableOptionsFailed = true;
        }
    }

    private getOptionsFromPath(data: any, path: string): FormFieldOption[] {
        const optionsId = this.field?.variableConfig?.optionsId ?? this.defaultVariableOptionId;
        const optionsLabel = this.field?.variableConfig?.optionsLabel ?? this.defaultVariableOptionLabel;

        const properties = path.split('.');
        const currentProperty = properties.shift();

        if (!Object.prototype.hasOwnProperty.call(data, currentProperty)) {
            this.handleError(`${currentProperty} not found in ${JSON.stringify(data)}`);
            this.variableOptionsFailed = true;
            return [];
        }

        const nestedData = data[currentProperty];

        if (Array.isArray(nestedData)) {
            return this.getOptionsFromArray(nestedData, optionsId, optionsLabel);
        }

        return this.getOptionsFromPath(nestedData, properties.join('.'));
    }

    private getOptionsFromArray(nestedData: any[], id: string, label: string): FormFieldOption[] {
        const options = nestedData.map((item) => this.createOption(item, id, label));
        const hasInvalidOption = options.some((option) => !option);

        if (hasInvalidOption) {
            this.variableOptionsFailed = true;
            return [];
        }

        this.variableOptionsFailed = false;
        return options;
    }

    private createOption(item: any, id: string, label: string): FormFieldOption {
        const option: FormFieldOption = {
            id: item[id],
            name: item[label]
        };

        if (!option.id || !option.name) {
            this.handleError(`'id' or 'label' is not properly defined`);
            return undefined;
        }

        return option;
    }

    private getOptionsFromVariable(
        processVariables: TaskVariableCloud[],
        formVariables: TaskVariableCloud[],
        variableName: string
    ): TaskVariableCloud {
        const processVariableDropdownOptions: TaskVariableCloud = this.getVariableValueByName(processVariables, variableName);
        const formVariableDropdownOptions: TaskVariableCloud = this.getVariableValueByName(formVariables, variableName);

        return processVariableDropdownOptions ?? formVariableDropdownOptions;
    }

    private getVariableValueByName(variables: TaskVariableCloud[], variableName: string): any {
        return variables?.find((variable: TaskVariableCloud) => variable?.name === `variables.${variableName}` || variable?.name === variableName)
            ?.value;
    }

    private persistFieldOptionsFromRestApi() {
        if (this.isValidRestConfig) {
            this.resetRestApiErrorMessage();
            const bodyParam = this.buildBodyParam();
            this.formCloudService
                .getRestWidgetData(this.field.form.id, this.field.id, bodyParam)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (result: FormFieldOption[]) => {
                        this.resetRestApiErrorMessage();
                        this.updateOptions(result);
                        this.field.updateForm();
                        this.resetInvalidValue();
                    },
                    error: (err) => {
                        this.resetRestApiOptions();
                        this.handleError(err);
                    }
                });
        }
    }

    private buildBodyParam(): any {
        const bodyParam = Object.assign({});
        if (this.isLinkedWidget) {
            const parentWidgetValue = this.getParentWidgetValue();
            const parentWidgetId = this.linkedWidgetId;
            bodyParam[parentWidgetId] = parentWidgetValue;
        }

        return this.formUtilsService.getRestUrlVariablesMap(this.field.form, this.field.restUrl, bodyParam);
    }

    private loadFieldOptionsForLinkedWidget() {
        const parentWidgetValue = this.getParentWidgetValue();
        this.parentValueChanged(parentWidgetValue);

        this.formService.formFieldValueChanged
            .pipe(
                filter((event: FormFieldEvent) => this.isFormFieldEventOfTypeDropdown(event) && this.isParentFormFieldEvent(event)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event: FormFieldEvent) => {
                const valueOfParentWidget = event.field.value;
                this.parentValueChanged(valueOfParentWidget);
            });
    }

    private getParentWidgetValue(): string {
        const parentWidgetId = this.linkedWidgetId;
        const parentWidget = this.getFormFieldById(parentWidgetId);
        return parentWidget?.value;
    }

    private parentValueChanged(value: string) {
        if (value && !this.isNoneValueSelected(value)) {
            this.isValidRestConfig ? this.persistFieldOptionsFromRestApi() : this.persistFieldOptionsFromManualList(value);
        } else if (this.isNoneValueSelected(value)) {
            this.resetRestApiErrorMessage();
            this.resetOptions();
            this.resetInvalidValue();
        } else {
            this.updateOptions([]);
            this.resetInvalidValue();
        }
    }

    private isNoneValueSelected(value: string): boolean {
        return value === undefined;
    }

    private getFormFieldById(fieldId): FormFieldModel {
        return this.field.form.getFormFields().filter((field: FormFieldModel) => field.id === fieldId)[0];
    }

    private persistFieldOptionsFromManualList(value: string) {
        if (this.hasRuleEntries()) {
            const rulesEntries = this.field.rule.entries;
            rulesEntries.forEach((ruleEntry: RuleEntry) => {
                if (ruleEntry.key === value) {
                    this.updateOptions(ruleEntry.options);
                    this.resetInvalidValue();
                    this.field.updateForm();
                }
            });
        }
    }

    private resetInvalidValue() {
        if (!this.isValidValue()) {
            this.resetValue();
        }
    }

    private resetValue() {
        this.field.value = '';
        this.selectionChangedForField(this.field);
        this.updateOptions();
        this.field.updateForm();
    }

    private isValidValue(): boolean {
        return this.field.value && this.isSelectedValueInOptions();
    }

    private isSelectedValueInOptions(): boolean {
        if (Array.isArray(this.field.value)) {
            const optionIdList = [...this.field.options].map((option) => option.id);
            const fieldValueIds = this.field.value.map((valueOption) => valueOption.id);
            return fieldValueIds.every((valueOptionId) => optionIdList.includes(valueOptionId));
        } else {
            if (this.field?.value && typeof this.field?.value === 'object') {
                return [...this.field.options].map((option) => option.id).includes(this.field.value.id);
            } else {
                return [...this.field.options].map((option) => option.id).includes(this.field.value);
            }
        }
    }

    private hasRuleEntries(): boolean {
        return !!this.field.rule.entries.length;
    }

    private resetOptions() {
        this.updateOptions([]);
    }

    private isParentFormFieldEvent(event: FormFieldEvent): boolean {
        return event.field.id === this.linkedWidgetId;
    }

    private isFormFieldEventOfTypeDropdown(event: FormFieldEvent): boolean {
        return event.field.type === FormFieldTypes.DROPDOWN;
    }

    private setOptionValue(option: FormFieldOption | FormFieldOption[], field: FormFieldModel) {
        if (Array.isArray(option) || field.hasMultipleValues) {
            field.value = option;
            return;
        }

        let optionValue: string = '';
        if (option.id === DEFAULT_OPTION.id) {
            optionValue = undefined;
        } else if (option.name !== field.value) {
            optionValue = option.id;
        } else {
            optionValue = option.name;
        }

        field.value = optionValue;
    }

    private setPreviewState(): void {
        this.previewState = this.formCloudService.getPreviewState();
    }

    private handleError(error: any) {
        if (!this.previewState) {
            this.widgetError.emit(error);
        }
    }

    private updateOptions(options?: FormFieldOption[]): void {
        if (!this.field) {
            return;
        }

        if (options) {
            this.field.options = options;
        }

        this.list$.next(this.field.options);
        this.showInputFilter = this.field.options.length > this.appConfig.get<number>('form.dropDownFilterLimit', HIDE_FILTER_LIMIT);
    }

    private resetRestApiErrorMessage(): void {
        this.isRestApiFailed = false;
        this.restApiHostName = '';
    }

    private resetRestApiOptions(): void {
        this.updateOptions([]);
        this.resetValue();
        this.isRestApiFailed = true;
        this.restApiHostName = this.getRestUrlHostName();
    }

    private getRestUrlHostName(): string {
        try {
            return new URL(this.field?.restUrl).hostname;
        } catch {
            return this.field?.restUrl;
        }
    }
}
