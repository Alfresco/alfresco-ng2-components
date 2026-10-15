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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '@alfresco/adf-core';
import { SignalPickerWidget } from './signal-picker-widget';

/**
 * Edits a date field with Material's datepicker, in the field's display format.
 */
@Component({
    selector: 'adf-signal-date-widget',
    templateUrl: './date-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, TranslatePipe]
})
export class SignalDateWidgetComponent extends SignalPickerWidget {
    protected typed(text: string): void {
        this.write(this.typedDay(text));
    }

    protected picked(value: Date | null, text: string): void {
        this.write(value ?? this.typedDay(text));
    }

    protected displayFormat(): string | null {
        return this.definition().dateDisplayFormat;
    }
}
