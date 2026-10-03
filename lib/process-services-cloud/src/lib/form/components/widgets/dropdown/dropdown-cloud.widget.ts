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

import {
    AppConfigService,
    FormFieldEvent,
    FormFieldModel,
    FormFieldOption,
    FormFieldTypes,
    FormFieldValueFormatterService,
    ADF_TYPED_VALUE_FORMATTING_ENABLED,
    FormService,
    ReactiveFormWidget,
    RuleEntry,
    SelectFilterInputComponent,
    VariableConfig,
    WidgetComponent
} from '@alfresco/adf-core';
import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, isObservable, Subject } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { FormCloudService } from '../../../services/form-cloud.service';
import { FormUtilsService } from '../../../services/form-utils.service';
import { defaultValueValidator } from './validators';

export const DEFAULT_OPTION = {
    id: 'empty',
    name: 'Choose one...'
};
export const HIDE_FILTER_LIMIT = 5;
export const DROPDOWN_CLOUD_WIDGET_SET_VALUE_DEBOUNCE = 100;

const DEFAULT_VARIABLE_OPTION_ID = 'id';
const DEFAULT_VARIABLE_OPTION_LABEL = 'name';
const DEFAULT_VARIABLE_OPTION_PATH = 'data';

export const toDropdownCloudControlValue = (value: any): FormFieldOption | FormFieldOption[] | null => {
    if (Array.isArray(value)) {
        return value;
    }
    if (value && typeof value === 'object') {
        return { id: value.id, name: value.name };
    }
    if (value === null || value === undefined || value === '') {
        return null;
    }
    return { id: value, name: '' };
};

export const isDropdownCloudValueInOptions = (value: any, options: FormFieldOption[]): boolean => {
    const optionIds = new Set(options.map((option) => option.id));
    if (Array.isArray(value)) {
        return value.every((valueOption) => optionIds.has(valueOption.id));
    }
    if (value && typeof value === 'object') {
        return optionIds.has(value.id);
    }
    return optionIds.has(value);
};

export const isDropdownCloudValidValue = (value: any, options: FormFieldOption[]): boolean =>
    !!value && isDropdownCloudValueInOptions(value, options);

export const isDropdownCloudRestField = (field: FormFieldModel): boolean => field?.optionType === 'rest' && !!field?.restUrl;

export const isDropdownCloudLinkedField = (field: FormFieldModel): boolean => !!field?.rule?.ruleOn;

export const getDropdownCloudRequiredValidators = (field: FormFieldModel, options?: FormFieldOption[]): ValidatorFn[] => {
    if (!field.hasEmptyValue) {
        return [Validators.required];
    }
    return [Validators.required, defaultValueValidator(options ? ({ options } as FormFieldModel) : field)];
};

const getOptionsFromPath = (data: any, path: string, id: string, label: string): { options: FormFieldOption[]; errors: string[] } => {
    const properties = path.split('.');
    const currentProperty = properties.shift();

    if (data === null || typeof data !== 'object' || !Object.prototype.hasOwnProperty.call(data, currentProperty)) {
        return { options: [], errors: [`${currentProperty} not found in ${JSON.stringify(data)}`] };
    }

    const nestedData = data[currentProperty];

    if (Array.isArray(nestedData)) {
        const options: FormFieldOption[] = nestedData.map((item) => ({ id: item?.[id], name: item?.[label] }));
        const invalidOptionErrors = options.filter((option) => !option.id || !option.name).map(() => `'id' or 'label' is not properly defined`);
        return invalidOptionErrors.length ? { options: [], errors: invalidOptionErrors } : { options, errors: [] };
    }

    return getOptionsFromPath(nestedData, properties.join('.'), id, label);
};

export const resolveDropdownCloudVariableOptions = (
    field: FormFieldModel,
    variableConfig: VariableConfig | undefined = field?.variableConfig
): { options: FormFieldOption[]; errors: string[] } | null => {
    const data = field?.form?.resolveVariableValue(variableConfig?.variableName);

    if (data == null) {
        return null;
    }

    return getOptionsFromPath(
        data,
        variableConfig?.optionsPath ?? DEFAULT_VARIABLE_OPTION_PATH,
        variableConfig?.optionsId ?? DEFAULT_VARIABLE_OPTION_ID,
        variableConfig?.optionsLabel ?? DEFAULT_VARIABLE_OPTION_LABEL
    );
};

/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'dropdown-cloud-widget',
    templateUrl: './dropdown-cloud.widget.html',
    styleUrls: ['./dropdown-cloud.widget.scss'],
    host: {
        '(click)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None,
    imports: [AsyncPipe, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, TranslatePipe, SelectFilterInputComponent, MatIconModule]
})
export class DropdownCloudWidgetComponent extends WidgetComponent implements OnInit, ReactiveFormWidget {
    public formService = inject(FormService);
    private readonly formCloudService = inject(FormCloudService);
    private readonly appConfig = inject(AppConfigService);
    private readonly formUtilsService = inject(FormUtilsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly formatter = inject(FormFieldValueFormatterService);
    private readonly formattingEnabledToken = inject(ADF_TYPED_VALUE_FORMATTING_ENABLED, { optional: true });
    private formattingEnabled = false;
    readOnlyDisplayValue: string | undefined;

    typeId = 'DropdownCloudWidgetComponent';
    showInputFilter = false;
    isRestApiFailed = false;
    variableOptionsFailed = false;
    previewState = false;
    restApiHostName: string;
    dropdownControl = new FormControl<FormFieldOption | FormFieldOption[]>(undefined);

    dropdownErrorStateMatcher: ErrorStateMatcher = {
        isErrorState: (control) =>
            (control?.touched && this.hasValidationError()) || (!this.previewState && (this.isRestApiFailed || this.variableOptionsFailed))
    };

    list$ = new BehaviorSubject<FormFieldOption[]>([]);
    filter$ = new BehaviorSubject<string>('');

    private readonly debounceSetValue = new Subject<void>();

    get isReadOnlyType(): boolean {
        return this.field.type === 'readonly';
    }

    private get isLinkedWidget(): boolean {
        return isDropdownCloudLinkedField(this.field);
    }

    private get linkedWidgetId(): string {
        return this.field?.rule?.ruleOn;
    }

    private get isReadOnlyForm(): boolean {
        return !!this.field?.form?.readOnly;
    }

    private get isValidRestConfig(): boolean {
        return isDropdownCloudRestField(this.field);
    }

    private get isVariableOptionType(): boolean {
        return this.field?.optionType === 'variable';
    }

    ngOnInit() {
        if (isObservable(this.formattingEnabledToken)) {
            this.formattingEnabledToken.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled: boolean) => {
                this.formattingEnabled = enabled ?? false;
                this.readOnlyDisplayValue = this.computeReadOnlyDisplayValue();
            });
        } else {
            this.formattingEnabled = this.formattingEnabledToken ?? false;
            this.readOnlyDisplayValue = this.computeReadOnlyDisplayValue();
        }

        /*
            We can have a lot of 'control.setValue' caused by form rules events
            e.g. every time if we focusin/focusout etc. we are calling a setValue.
        */
        this.debounceSetValue.pipe(debounceTime(DROPDOWN_CLOUD_WIDGET_SET_VALUE_DEBOUNCE), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.applyFieldValueToControl();
        });

        this.setupDropdown();

        /*
            Wired once: both read `this.field` when they emit, so they survive every later setup run.
            Re-wiring them on each setup would stack subscriptions and duplicate the events they raise.
        */
        this.subscribeToInputChanges();
        this.initFilter();

        this.formService.onFormVariableChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ field }) => {
            if (this.isDependentOnChangedVariable(field)) {
                this.setupDropdown();
            }
        });
    }

    private isDependentOnChangedVariable(field: FormFieldModel): boolean {
        const variableName = this.field?.variableConfig?.variableName;

        if (field.id === this.field.id) {
            return true;
        }

        return this.isVariableOptionType && !!variableName && field?.variableConfig?.variableName === variableName;
    }

    private computeReadOnlyDisplayValue(): string | undefined {
        const value = this.field.value;
        const isFormattableValue = value != null && (typeof value !== 'string' || this.formatter.hasFormatter(this.field.type));
        const shouldFormatValue = this.formattingEnabled && isFormattableValue;

        return shouldFormatValue ? this.formatter.format(this.field) : value;
    }

    updateReactiveFormControl(): void {
        this.setFormControlValue();
        this.readOnlyDisplayValue = this.computeReadOnlyDisplayValue();

        this.updateFormControlState();
        if (this.field?.form?.showAllValidationErrors) {
            this.dropdownControl.markAsTouched();
        }
        this.validateField();
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

        this.applyFieldValueToControl();
        this.updateFormControlState();
        this.validateField();
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
                this.selectionChangedForField(this.field);
            });
    }

    private setFormControlValue(): void {
        this.debounceSetValue.next();
    }

    private applyFieldValueToControl(): void {
        this.dropdownControl.setValue(toDropdownCloudControlValue(this.field.value), { emitEvent: false });
    }

    hasValidationError(): boolean {
        return !this.field?.isValid && !!this.field?.validationSummary?.isActive();
    }

    private updateFormControlState(): void {
        this.updateDropdownReadonlyRules();
        if (this.field) {
            this.field.inputDisabled = this.readOnly;
        }
        this.dropdownControl.updateValueAndValidity({ emitEvent: false });
    }

    private updateDropdownReadonlyRules() {
        if (this.field?.readOnly || this.readOnly) {
            this.dropdownControl.disable({ emitEvent: false });
        } else {
            this.dropdownControl.enable({ emitEvent: false });
        }
    }

    private validateField(): void {
        this.field.validate();
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
        const variableOptions = resolveDropdownCloudVariableOptions(this.field);

        if (variableOptions) {
            variableOptions.errors.forEach((error) => this.handleError(error));
            this.variableOptionsFailed = variableOptions.errors.length > 0;
            this.updateOptions(variableOptions.options);
            this.resetInvalidValue();
            this.field.updateForm();
        } else {
            this.handleError(`${this.field?.variableConfig?.variableName} not found`);
            this.resetOptions();
            this.variableOptionsFailed = true;
        }
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
        return isDropdownCloudValidValue(this.field.value, this.field.options);
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

    private setOptionValue(option: FormFieldOption | FormFieldOption[] | null, field: FormFieldModel) {
        if (option == null) {
            field.value = undefined;
            return;
        }
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
