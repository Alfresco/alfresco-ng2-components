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

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isObservable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FormRulesEvent } from '../../../events/form-rules.event';
import { ADF_CUSTOM_MESSAGE } from './custom-validation-message.token';
import { WidgetComponent } from '../widget.component';
import { FormFieldValueFormatterService } from '../../../services/form-field-value-formatter.service';
import { ADF_TYPED_VALUE_FORMATTING_ENABLED } from '../../../services/form-field-value-formatter.token';

@Component({
    template: '',
    standalone: true
})
export abstract class FormattableTextWidgetComponent extends WidgetComponent implements OnInit {
    protected readonly destroyRef = inject(DestroyRef);
    private readonly enableCustomMessage = inject(ADF_CUSTOM_MESSAGE, { optional: true });
    private readonly formatter = inject(FormFieldValueFormatterService);
    private readonly formattingEnabledToken = inject(ADF_TYPED_VALUE_FORMATTING_ENABLED, { optional: true });
    private formattingEnabled = false;
    displayValue = '';

    onValueChange(value: string): void {
        this.field.value = value;
        this.displayValue = this.computeDisplayValue();
        this.onFieldChanged(this.field);
    }

    protected computeDisplayValue(): string {
        const value = this.field.value;
        const isReadOnly = this.field.readOnly || this.readOnly;
        if (this.formattingEnabled && isReadOnly && value != null && typeof value !== 'string' && this.formatter.hasFormatter(this.field.type)) {
            return this.formatter.format(this.field);
        }
        return value as string;
    }

    ngOnInit(): void {
        this.initValueFormatting();
        this.initCustomValidationMessage();
    }

    private initValueFormatting(): void {
        if (isObservable(this.formattingEnabledToken)) {
            this.formattingEnabledToken.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled: boolean) => {
                this.formattingEnabled = enabled ?? false;
                this.displayValue = this.computeDisplayValue();
            });
        } else {
            this.formattingEnabled = this.formattingEnabledToken ?? false;
            this.displayValue = this.computeDisplayValue();
        }

        this.formService.formRulesEvent
            .pipe(
                filter((event: FormRulesEvent) => event?.type === 'fieldValueChanged'),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.displayValue = this.computeDisplayValue();
            });
    }

    private initCustomValidationMessage(): void {
        if (this.enableCustomMessage != null) {
            if (isObservable(this.enableCustomMessage)) {
                this.enableCustomMessage.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled: boolean) => {
                    if (this.field) {
                        this.field.enableCustomValidationMessage = enabled ?? false;
                    }
                });
            } else {
                this.field.enableCustomValidationMessage = this.enableCustomMessage;
            }
        } else {
            this.field.enableCustomValidationMessage = false;
        }
    }
}
