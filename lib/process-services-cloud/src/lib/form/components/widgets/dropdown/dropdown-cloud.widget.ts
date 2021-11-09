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

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import {
    WidgetComponent,
    FormService,
    LogService,
    FormFieldOption,
    FormFieldEvent,
    FormFieldModel,
    FormFieldTypes,
    RuleEntry
} from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/* tslint:disable:component-selector  */

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
    static DEFAULT_OPTION = {
        id: 'empty',
        name: 'Choose one...'
    };

    typeId = 'DropdownCloudWidgetComponent';
    protected onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService,
                private formCloudService: FormCloudService,
                private logService: LogService) {
        super(formService);
    }

    ngOnInit() {
        if (this.hasRestUrl() && !this.isLinkedWidget()) {
            this.persistFieldOptionsFromRestApi();
        }

        if (this.isLinkedWidget()) {
            this.loadFieldOptionsForLinkedWidget();

            this.formService.formFieldValueChanged
                .pipe(
                    filter((event: FormFieldEvent) => this.isFormFieldEventOfTypeDropdown(event) && this.isParentFormFieldEvent(event)),
                    takeUntil(this.onDestroy$))
                .subscribe((event: FormFieldEvent) => {
                    const valueOfParentWidget = event.field.value;
                    this.parentValueChanged(valueOfParentWidget);
                });
        }
    }

    private persistFieldOptionsFromRestApi() {
        if (this.isValidRestType()) {
            const bodyParam = this.buildBodyParam();
            this.formCloudService.getRestWidgetData(this.field.form.id, this.field.id, bodyParam)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((result: FormFieldOption[]) => {
                    this.field.options = result;
                    this.field.updateForm();
                }, (err) => this.handleError(err));
        }
    }

    private buildBodyParam(): any {
        const bodyParam = Object.assign({});
        if (this.isLinkedWidget()) {
            const parentWidgetValue = this.getParentWidgetValue();
            const parentWidgetId = this.getLinkedWidgetId();
            bodyParam[parentWidgetId] = parentWidgetValue;
        }
        return bodyParam;
    }

    private loadFieldOptionsForLinkedWidget() {
        const parentWidgetValue = this.getParentWidgetValue();
        this.parentValueChanged(parentWidgetValue);
        this.field.updateForm();
    }

    private getParentWidgetValue(): string {
        const parentWidgetId = this.getLinkedWidgetId();
        const parentWidget = this.getFormFieldById(parentWidgetId);
        return parentWidget?.value;
    }

    private parentValueChanged(value: string) {
        if (this.isValidValue(value)) {
            this.isValidRestType() ? this.persistFieldOptionsFromRestApi() : this.persistFieldOptionsFromManualList(value);
        } else if (this.isDefaultValue(value)) {
            this.addDefaultOption();
        }
    }

    private isValidValue(value: string): boolean {
        return !!value && value !== DropdownCloudWidgetComponent.DEFAULT_OPTION.id;
    }

    private isDefaultValue(value: string): boolean {
        return value === DropdownCloudWidgetComponent.DEFAULT_OPTION.id;
    }

    private getFormFieldById(fieldId): FormFieldModel {
        return this.field.form.getFormFields().filter((field: FormFieldModel) => field.id === fieldId)[0];
    }

    private persistFieldOptionsFromManualList(value: string) {
        if (this.hasRuleEntries()) {
            const rulesEntries = this.getRuleEntries();
            rulesEntries.forEach((ruleEntry: RuleEntry) => {
                if (ruleEntry.key === value) {
                    this.field.options = ruleEntry.options;
                }
            });
        }
    }

    private getRuleEntries(): RuleEntry[] {
        return this.field.rule.entries;
    }

    private hasRuleEntries(): boolean {
        return !!this.getRuleEntries().length;
    }

    private addDefaultOption() {
        this.field.options = [DropdownCloudWidgetComponent.DEFAULT_OPTION];
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

    private hasRestUrl(): boolean {
        return !!this.field?.restUrl;
    }

    isLinkedWidget(): boolean {
        return !!this.getLinkedWidgetId();
    }

    getLinkedWidgetId(): string {
        return this.field?.rule?.ruleOn;
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
            return  opt1.id === opt2.id || opt1.name === opt2.name;
        }

        return opt1 === opt2;
    }

    getOptionValue(option: FormFieldOption, fieldValue: string): string | FormFieldOption {
        if (this.field.hasMultipleValues) {
            return option;
        }

        let optionValue: string = '';
        if (option.id === DropdownCloudWidgetComponent.DEFAULT_OPTION.id || option.name !== fieldValue) {
            optionValue = option.id;
        } else {
            optionValue = option.name;
        }
        return optionValue;
    }

    private isValidRestType(): boolean {
        return this.field.optionType === 'rest' && !!this.field.restUrl;
    }

    private handleError(error: any) {
        this.logService.error(error);
    }

    isReadOnlyType(): boolean {
        return this.field.type === 'readonly';
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
