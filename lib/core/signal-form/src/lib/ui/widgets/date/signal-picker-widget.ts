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

import { afterRenderEffect, computed, Directive, inject, viewChild, viewChildren } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '@alfresco/adf-core';
import { dateFieldRange } from '../../../validation/field-validation';
import { SignalFormWidget } from '../signal-form-widget';
import { pickerDate, typedPickerValue } from './picker-values';

/**
 * The base of the widgets built on Material's datepicker. Their inputs are bound by hand rather than through
 * `[formField]`: the datepicker reports unparseable text as no value, while the field keeps it as an invalid date so it
 * fails validation instead of silently clearing. Only values the widget didn't write itself are pushed to the inputs,
 * so the text being typed is never reformatted.
 */
@Directive()
export abstract class SignalPickerWidget extends SignalFormWidget<Date | null> {
    protected readonly dateAdapter = inject(DateAdapter) as AdfDateFnsAdapter;
    protected readonly range = computed(() => dateFieldRange(this.definition()));

    private readonly dateInput = viewChild.required<MatDatepickerInput<Date>>(MatDatepickerInput);
    private readonly inputs = viewChildren(MatInput);
    private written: unknown;

    constructor() {
        super();
        afterRenderEffect({
            write: () => {
                this.dateAdapter.displayFormat = this.displayFormat();
                const value = this.field()().value();
                if (value !== this.written) {
                    this.written = value;
                    const shown = pickerDate(value);
                    this.shown?.(shown);
                    this.dateInput().value = shown;
                }
            }
        });
        afterRenderEffect({
            write: () => {
                this.showError();
                this.inputs().forEach((matInput) => matInput.updateErrorState());
            }
        });
    }

    protected touched(): void {
        this.field()().markAsTouched();
    }

    protected typedDay(text: string): Date | null {
        return typedPickerValue(this.dateAdapter, text, ADF_DATE_FORMATS.parse.dateInput);
    }

    protected write(value: Date | null): void {
        this.written = value;
        this.field()().value.set(value);
    }

    /**
     * The format the day is shown and typed in; `null` for ADF's default.
     *
     * @returns the display format
     */
    protected abstract displayFormat(): string | null;

    /**
     * Called when the field gets a value the widget didn't write, before it's shown in the datepicker.
     *
     * @param value the value to show, `null` when empty or invalid
     */
    protected shown?(value: Date | null): void;
}
