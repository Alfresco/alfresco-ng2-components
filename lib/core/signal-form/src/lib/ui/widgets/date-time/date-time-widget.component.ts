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

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { TranslatePipe } from '@ngx-translate/core';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '@alfresco/adf-core';
import { combinedDateTime } from '../date/picker-values';
import { SignalPickerWidget } from '../date/signal-picker-widget';

const TIME_FORMAT = 'HH:mm';

const DATE_TIME_PICKER_FORMATS: MatDateFormats = {
    parse: { ...ADF_DATE_FORMATS.parse, timeInput: TIME_FORMAT },
    display: { ...ADF_DATE_FORMATS.display, timeInput: TIME_FORMAT, timeOptionLabel: TIME_FORMAT }
};

/**
 * Edits a datetime field with Material's datepicker for the day and timepicker for the time, combined into one value.
 */
@Component({
    selector: 'adf-signal-date-time-widget',
    templateUrl: './date-time-widget.component.html',
    styleUrl: './date-time-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: DATE_TIME_PICKER_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    imports: [MatDatepickerModule, MatTimepickerModule, MatFormFieldModule, MatInputModule, TranslatePipe]
})
export class SignalDateTimeWidgetComponent extends SignalPickerWidget {
    private readonly day = signal<Date | null>(null);

    protected readonly time = signal<Date | null>(null);
    protected readonly timeInputId = computed(() => `${this.inputId()}-time`);

    protected typed(text: string): void {
        this.day.set(this.typedDay(text));
        this.writeDateTime();
    }

    protected picked(value: Date | null, text: string): void {
        this.day.set(value ?? this.typedDay(text));
        this.writeDateTime();
    }

    protected changedTime(value: Date | null): void {
        this.time.set(value);
        this.writeDateTime();
    }

    protected displayFormat(): string | null {
        return null;
    }

    protected shown(value: Date | null): void {
        this.day.set(value);
        this.time.set(value);
    }

    private writeDateTime(): void {
        this.write(combinedDateTime(this.day(), this.time()));
    }
}
