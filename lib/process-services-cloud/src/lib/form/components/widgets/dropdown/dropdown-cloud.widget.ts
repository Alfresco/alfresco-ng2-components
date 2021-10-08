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
    FormFieldTypes
} from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

    typeId = 'DropdownCloudWidgetComponent';
    protected onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService,
                private formCloudService: FormCloudService,
                private logService: LogService) {
        super(formService);
    }

    ngOnInit() {
        // Missing requirement. In case replacing the restUrl with the parent selection will be done in BE we don't need to distinguish the 2 scenarios.
        if (this.hasRestUrl() && !this.isLinkedDropdown()) {
            this.getValuesFromRestApi();
        }

        if (this.isLinkedDropdown()) {
            this.formService.formFieldValueChanged
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((event: FormFieldEvent) => {
                    if (this.isFormFieldEventOfTypeDropdown(event) && this.hasParentDropdownSelectionChanged(event)) {
                        const valueOfParentDropdown = event.field.value;

                        if (!!valueOfParentDropdown && valueOfParentDropdown !== 'empty') {
                            this.hasRestUrl() && this.isRestUrlContainingLinkedDropdownId() ? this.getValuesFromRestApiWithLinkedWidget(valueOfParentDropdown) : this.getManualValuesWithLinkedWidget(valueOfParentDropdown);
                        } else if (valueOfParentDropdown === 'empty') {
                            this.addDefaultOption();
                        }
                    }
                });
        }
    }

    private getManualValuesWithLinkedWidget(valueOfLinkedWidget: string) {
        const rulesMap = new Map<string, FormFieldOption[]>(Object.entries(this.field.params['rules']));
        for (const [key, value] of rulesMap.entries()) {
            if (key === valueOfLinkedWidget) {
                this.field.options = value;
            }
        }
    }

    private getValuesFromRestApiWithLinkedWidget(valueOfLinkedWidget: string) {
        // Missing requirement. Temporarily doing the replacement in the FE
        const newRestUrl = this.replaceLinkedWidgetRestUrlWithSelection(valueOfLinkedWidget);
        this.getValuesFromRestApi(newRestUrl);
    }

    private hasDefaultOption(): boolean {
        return !!this.field.options.find((option: {id, name}) => option.id === 'empty' && option.name === 'Choose one...');
    }

    private addDefaultOption() {
        // Missing requirement about default options when using linked widgets
        this.field.options = this.hasDefaultOption() ? [{ id: 'empty', name: 'Choose one...' }] : [];
    }

    // Missing requirement. Temporarily added the replacement in FE
    private replaceLinkedWidgetRestUrlWithSelection(valueOfLinkedWidget: string): string {
        const linkedWidgetId = this.getLinkedDropdownId();
        return this.isRestUrlContainingLinkedDropdownId() ? this.field.restUrl.replace('${' + linkedWidgetId + '}', valueOfLinkedWidget) : this.field.restUrl;
    }

    selectionChangedForField(field: FormFieldModel) {
        const formFieldValueChangedEvent = new FormFieldEvent(field.form, field);
        this.formService.formFieldValueChanged.next(formFieldValueChangedEvent);
        this.onFieldChanged(field);
    }

    private hasParentDropdownSelectionChanged(event: FormFieldEvent): boolean {
        return event.field.id === this.getLinkedDropdownId();
    }

    private isRestUrlContainingLinkedDropdownId(): boolean {
        const linkedWidgetId = this.getLinkedDropdownId();
        return this.field.restUrl?.includes(linkedWidgetId) || false;
    }

    private isFormFieldEventOfTypeDropdown(event: FormFieldEvent): boolean {
        return event.field.type === FormFieldTypes.DROPDOWN;
    }

    hasRestUrl(): boolean {
        return !!this?.field?.restUrl;
    }

    isLinkedDropdown(): boolean {
        return !!this.getLinkedDropdownId();
    }

    getLinkedDropdownId(): string {
        return this?.field?.params['linkedDropdownId'];
    }

    getValuesFromRestApi(restUrl?: string) {
        if (this.isValidRestType()) {
            this.formCloudService.getRestWidgetData(this.field.form.id, this.field.id)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe((result: FormFieldOption[]) => {
                    this.field.options = result;
                }, (err) => this.handleError(err));
        }
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
        if (option.id === 'empty' || option.name !== fieldValue) {
            optionValue = option.id;
        } else {
            optionValue = option.name;
        }
        return optionValue;
    }

    isValidRestType(): boolean {
        return this.field.optionType === 'rest' && !!this.field.restUrl;
    }

    handleError(error: any) {
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
