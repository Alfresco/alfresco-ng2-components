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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
    AppConfigService,
    FormFieldEvent,
    FormFieldModel,
    FormFieldOption,
    FormFieldTypes,
    FormService,
    RuleEntry,
    WidgetComponent
} from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { TaskVariableCloud } from '../../../models/task-variable-cloud.model';

export const DEFAULT_OPTION: FormFieldOption = {
    id: 'empty',
    name: 'Choose one...'
};
export const HIDE_FILTER_LIMIT = 5;

/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'dropdown-cloud-widget',
    templateUrl: './dropdown-cloud.widget.html',
    styleUrls: ['./dropdown-cloud.widget.scss'],
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
export class DropdownCloudWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {
    typeId = 'DropdownCloudWidgetComponent';
    showInputFilter = false;
    isRestApiFailed = false;
    variableOptionsFailed = false;
    previewState = false;
    restApiHostName: string;
    list$: Observable<FormFieldOption[]>;
    filter$ = new BehaviorSubject<string>('');

    private readonly defaultVariableOptionId = 'id';
    private readonly defaultVariableOptionLabel = 'name';
    private readonly defaultVariableOptionPath = 'data';

    protected onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService, private formCloudService: FormCloudService, private appConfig: AppConfigService) {
        super(formService);
    }

    ngOnInit() {
        this.setPreviewState();
        this.checkFieldOptionsSource();
        this.updateOptions();
    }

    private checkFieldOptionsSource(): void {
        switch (true) {
            case this.isReadOnly():
                break;
            case this.hasRestUrl() && !this.isLinkedWidget():
                this.persistFieldOptionsFromRestApi();
                break;

            case this.isLinkedWidget():
                this.loadFieldOptionsForLinkedWidget();
                break;

            case this.isVariableOptionType():
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
            this.field.options = formVariableOptions;
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

    private isVariableOptionType(): boolean {
        return this.field?.optionType === 'variable';
    }

    private persistFieldOptionsFromRestApi() {
        if (this.isValidRestType()) {
            this.resetRestApiErrorMessage();
            const bodyParam = this.buildBodyParam();
            this.formCloudService
                .getRestWidgetData(this.field.form.id, this.field.id, bodyParam)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(
                    (result: FormFieldOption[]) => {
                        this.resetRestApiErrorMessage();
                        this.field.options = result;
                        this.updateOptions();
                        this.field.updateForm();
                        this.resetInvalidValue();
                    },
                    (err) => {
                        this.resetRestApiOptions();
                        this.handleError(err);
                    }
                );
        }
    }

    private buildBodyParam(): any {
        const bodyParam = Object.assign({});
        if (this.isLinkedWidget()) {
            const parentWidgetSelectedOption = this.getParentWidgetSelectedOption();
            const parentWidgetSelectedOptionId = this.field.isEmptyValueOption(parentWidgetSelectedOption) ? null : parentWidgetSelectedOption.id;

            const parentWidgetId = this.getLinkedWidgetId();
            bodyParam[parentWidgetId] = parentWidgetSelectedOptionId;
        }
        return bodyParam;
    }

    private loadFieldOptionsForLinkedWidget() {
        const parentWidgetSelectedOption = this.getParentWidgetSelectedOption();
        this.parentValueChanged(parentWidgetSelectedOption);

        this.formService.formFieldValueChanged
            .pipe(
                filter((event: FormFieldEvent) => this.isFormFieldEventOfTypeDropdown(event) && this.isParentFormFieldEvent(event)),
                takeUntil(this.onDestroy$)
            )
            .subscribe((event: FormFieldEvent) => {
                const valueOfParentWidget = event.field.value;
                this.parentValueChanged(valueOfParentWidget);
            });
    }

    private getParentWidgetSelectedOption(): FormFieldOption {
        const parentWidgetId = this.getLinkedWidgetId();
        const parentWidget = this.getFormFieldById(parentWidgetId);
        return parentWidget?.value;
    }

    private parentValueChanged(value: FormFieldOption) {
        if (value && !this.isEmptyValueOption(value)) {
            this.isValidRestType() ? this.persistFieldOptionsFromRestApi() : this.persistFieldOptionsFromManualList(value);
        } else if (this.isEmptyValueOption(value)) {
            this.resetRestApiErrorMessage();
            this.resetOptions();
            this.resetInvalidValue();
        } else {
            this.field.options = [];
            this.resetInvalidValue();
        }
    }

    private isEmptyValueOptionSelected(): boolean {
        return this.isEmptyValueOption(this.field.value);
    }

    private isEmptyValueOption(value: FormFieldOption): boolean {
        return this.field.isEmptyValueOption(value);
    }

    private getFormFieldById(fieldId): FormFieldModel {
        return this.field.form.getFormFields().filter((field: FormFieldModel) => field.id === fieldId)[0];
    }

    private persistFieldOptionsFromManualList(option: FormFieldOption) {
        if (this.hasRuleEntries()) {
            const rulesEntries = this.field.rule.entries;
            rulesEntries.forEach((ruleEntry: RuleEntry) => {
                if (ruleEntry.key === option.id) {
                    this.field.options = ruleEntry.options;
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
        this.field.value = null;
        this.selectionChangedForField(this.field);
        this.updateOptions();
        this.field.updateForm();
    }

    private isValidValue(): boolean {
        return this.fieldValue && this.isSelectedValueInOptions();
    }

    private isSelectedValueInOptions(): boolean {
        const selectedOptions: FormFieldOption[] = Array.isArray(this.fieldValue) ? this.fieldValue : [this.fieldValue];

        return selectedOptions.every((selectedOption) => {
            const isIncludedInOptions = this.field.options.some((option) => option.id === selectedOption.id);
            return isIncludedInOptions;
        });
    }

    get fieldValue(): FormFieldOption {
        return this.field.value;
    }

    private hasRuleEntries(): boolean {
        return !!this.field.rule.entries.length;
    }

    private resetOptions() {
        this.field.options = [];
        this.updateOptions();
    }

    selectionChangedForField(field: FormFieldModel) {
        const formFieldValueChangedEvent = new FormFieldEvent(field.form, field);
        this.formService.formFieldValueChanged.next(formFieldValueChangedEvent);
        this.onFieldChanged(field);
    }

    private isParentFormFieldEvent(event: FormFieldEvent): boolean {
        return event.field.id === this.getLinkedWidgetId();
    }

    private isFormFieldEventOfTypeDropdown(event: FormFieldEvent): boolean {
        return event.field.type === FormFieldTypes.DROPDOWN;
    }

    isLinkedWidget(): boolean {
        return !!this.getLinkedWidgetId();
    }

    getLinkedWidgetId(): string {
        return this.field?.rule?.ruleOn;
    }

    compareDropdownValues(opt1: FormFieldOption, opt2: FormFieldOption): boolean {
        if (!opt1 || !opt2) {
            return false;
        }

        return opt1.id === opt2.id && opt1.name === opt2.name;
    }

    private isValidRestType(): boolean {
        return this.field.optionType === 'rest' && this.hasRestUrl();
    }

    private setPreviewState(): void {
        this.previewState = this.formCloudService.getPreviewState();
    }

    private handleError(error: any) {
        if (!this.previewState) {
            this.widgetError.emit(error);
        }
    }

    private isReadOnly(): boolean {
        return this.field.readOnly;
    }

    private hasRestUrl(): boolean {
        return !!this.field.restUrl;
    }

    isReadOnlyType(): boolean {
        return this.field.type === 'readonly';
    }

    updateOptions(): void {
        if (this.isReadOnly()) {
            this.list$ = of(this.field.options);
        }

        this.showInputFilter = this.field.options.length > this.appConfig.get<number>('form.dropDownFilterLimit', HIDE_FILTER_LIMIT);
        this.list$ = combineLatest([of(this.field.options), this.filter$]).pipe(
            map(([items, search]) => {
                if (!search) {
                    return items;
                }
                return items.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));
            }),
            takeUntil(this.onDestroy$)
        );
    }

    resetRestApiErrorMessage() {
        this.isRestApiFailed = false;
        this.restApiHostName = '';
    }

    resetRestApiOptions() {
        this.field.options = [];
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

    showRequiredMessage(): boolean {
        return (
            (this.isInvalidFieldRequired() || (this.isEmptyValueOptionSelected() && this.isRequired())) &&
            this.isTouched() &&
            !this.isRestApiFailed &&
            !this.variableOptionsFailed
        );
    }

    getEmptyValueOption(options: FormFieldOption[]): null | FormFieldOption {
        if (!this.field.hasEmptyValue) {
            return null;
        }
        return options.find((option: FormFieldOption) => this.field.isEmptyValueOption(option));
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
