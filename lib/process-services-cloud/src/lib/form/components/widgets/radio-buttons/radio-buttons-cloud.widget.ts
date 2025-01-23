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

/* eslint-disable @angular-eslint/component-selector */

import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ErrorMessageModel, ErrorWidgetComponent, FormFieldOption, FormService, WidgetComponent } from '@alfresco/adf-core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormUtilsService } from '../../../services/form-utils.service';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'radio-buttons-cloud-widget',
    imports: [CommonModule, ErrorWidgetComponent, MatRadioModule, TranslateModule, FormsModule],
    templateUrl: './radio-buttons-cloud.widget.html',
    styleUrls: ['./radio-buttons-cloud.widget.scss'],
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
export class RadioButtonsCloudWidgetComponent extends WidgetComponent implements OnInit {
    private formCloudService = inject(FormCloudService);
    private translateService = inject(TranslateService);
    private formUtilsService = inject(FormUtilsService);

    typeId = 'RadioButtonsCloudWidgetComponent';
    restApiError: ErrorMessageModel;

    private readonly destroyRef = inject(DestroyRef);

    constructor(formService: FormService) {
        super(formService);
    }

    ngOnInit() {
        if (this.isValidRestConfig() && !this.isReadOnlyForm()) {
            this.getValuesFromRestApi();
        }
    }

    getValuesFromRestApi() {
        const body = this.formUtilsService.getRestUrlVariablesMap(this.field.form, this.field.restUrl, {});

        this.formCloudService
            .getRestWidgetData(this.field.form.id, this.field.id, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (result) => {
                    this.field.options = result;
                    this.field.updateForm();
                },
                error: (err) => {
                    this.resetRestApiOptions();
                    this.handleError(err);
                }
            });
    }

    onOptionClick(optionSelected: any) {
        this.field.value = optionSelected;
        this.onFieldChanged(this.field);
    }

    handleError(error: any) {
        this.restApiError = new ErrorMessageModel({
            message: this.translateService.instant('FORM.FIELD.REST_API_FAILED', { hostname: this.getRestUrlHostName() })
        });
        this.widgetError.emit(error);
    }

    isChecked(option: FormFieldOption): boolean {
        if (this.field.value && typeof this.field.value === 'object') {
            return this.field.value['id'] === option.id || this.field.value['name'] === option.name;
        }
        return this.field.value === option.id;
    }

    resetRestApiOptions() {
        this.field.options = [];
    }

    getRestUrlHostName(): string {
        return new URL(this.field?.restUrl).hostname ?? this.field?.restUrl;
    }

    hasError(): ErrorMessageModel {
        return this.restApiError || this.field.validationSummary;
    }

    private isRestType(): boolean {
        return this.field?.optionType === 'rest';
    }

    private isReadOnlyForm(): boolean {
        return !!this.field?.form?.readOnly;
    }

    private hasRestUrl(): boolean {
        return !!this.field?.restUrl;
    }

    private isValidRestConfig(): boolean {
        return this.isRestType() && this.hasRestUrl();
    }
}
