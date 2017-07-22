/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

/* tslint:disable:component-selector  */

import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'date-widget',
    templateUrl: './date.widget.html',
    styleUrls: ['./date.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class DateWidgetComponent extends WidgetComponent implements OnInit {

    minDate: Date;
    maxDate: Date;
    startAt: Date;

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnInit() {

        if (this.field) {

            if (this.field.minValue) {
                this.minDate = moment(this.field.minValue, this.field.dateDisplayFormat).toDate();
            }

            if (this.field.maxValue) {
                this.maxDate = moment(this.field.maxValue, this.field.dateDisplayFormat).toDate();
            }

            if (this.field.value) {
                this.startAt = moment(this.field.value, this.field.dateDisplayFormat).toDate();
            }
        }
    }

    onDateSelected(date: Date) {
        this.field.value = date;
    }

    onDateChanged(date: Date) {
        this.field.value = date;
    }

}
