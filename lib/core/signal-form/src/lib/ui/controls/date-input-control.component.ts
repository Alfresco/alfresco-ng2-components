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

import { afterRenderEffect, ChangeDetectionStrategy, Component, inject, input, viewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInput, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '@alfresco/adf-core';
import { pickerDate, typedPickerValue } from './picker-values';
import { SignalInputControl } from './signal-input-control';

/**
 * A date input with Material's datepicker, in a display format. Text that can't be read as a date becomes an invalid
 * date, so the field reports it instead of silently clearing; only values the control didn't write itself are shown
 * in the input, so the text being typed is never reformatted.
 */
@Component({
    selector: 'adf-signal-date-input',
    templateUrl: './date-input-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, TranslatePipe]
})
export class SignalDateInputControlComponent extends SignalInputControl<Date | null> {
    readonly displayFormat = input<string | null>(null);
    readonly minDate = input<Date | null>(null);
    readonly maxDate = input<Date | null>(null);

    private readonly dateAdapter = inject(DateAdapter) as AdfDateFnsAdapter;
    private readonly dateInput = viewChild.required<MatDatepickerInput<Date>>(MatDatepickerInput);
    private written: unknown;

    constructor() {
        super();
        afterRenderEffect({
            write: () => {
                this.dateAdapter.displayFormat = this.displayFormat();
                const value = this.value();
                if (value !== this.written) {
                    this.written = value;
                    this.dateInput().value = pickerDate(value);
                }
            }
        });
    }

    protected typed(text: string): void {
        this.write(this.parsed(text));
    }

    protected picked(value: Date | null, text: string): void {
        this.write(value ?? this.parsed(text));
    }

    private parsed(text: string): Date | null {
        return typedPickerValue(this.dateAdapter, text, ADF_DATE_FORMATS.parse.dateInput);
    }

    private write(value: Date | null): void {
        this.written = value;
        this.value.set(value);
    }
}
