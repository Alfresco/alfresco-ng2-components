/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';
import { Subject } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '../../../../common/utils/date-fns-adapter';

@Component({
    selector: 'date-widget',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    templateUrl: './date.widget.html',
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
export class DateWidgetComponent extends WidgetComponent implements OnInit, OnDestroy {
    DATE_FORMAT = 'dd-MM-yyyy';

    minDate: Date;
    maxDate: Date;
    startAt: Date;

    @Input()
    value: any = null;

    private onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService, private dateAdapter: DateAdapter<Date>) {
        super(formService);
    }

    ngOnInit() {
        if (this.field.dateDisplayFormat) {
            const adapter = this.dateAdapter as AdfDateFnsAdapter;
            adapter.displayFormat = this.field.dateDisplayFormat;
        }

        if (this.field) {
            if (this.field.minValue) {
                this.minDate = this.dateAdapter.parse(this.field.minValue, this.DATE_FORMAT);
            }

            if (this.field.maxValue) {
                this.maxDate = this.dateAdapter.parse(this.field.maxValue, this.DATE_FORMAT);
            }

            if (this.field.value) {
                this.startAt = this.dateAdapter.parse(this.field.value, this.DATE_FORMAT);
                this.value = this.dateAdapter.parse(this.field.value, this.DATE_FORMAT);
            }
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onDateChange(event: MatDatepickerInputEvent<Date>) {
        const value = event.value;
        const input = event.targetElement as HTMLInputElement;

        if (value) {
            this.field.value = this.dateAdapter.format(value, this.DATE_FORMAT);
        } else {
            this.field.value = input.value;
        }

        this.onFieldChanged(this.field);
    }
}
