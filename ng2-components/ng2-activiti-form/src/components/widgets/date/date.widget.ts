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
import { DateAdapter, MD_DATE_FORMATS } from '@angular/material';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MOMENT_DATE_FORMATS, MomentDateAdapter } from 'ng2-alfresco-core';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'date-widget',
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        {provide: MD_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS}],
    templateUrl: './date.widget.html',
    styleUrls: ['./date.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class DateWidgetComponent extends WidgetComponent implements OnInit {

    minDate: Moment;
    maxDate: Moment;

    constructor(public formService: FormService, public dateAdapter: DateAdapter<Moment>) {
        super(formService);
    }

    ngOnInit() {
        let momentDateAdapter = <MomentDateAdapter> this.dateAdapter;
        momentDateAdapter.overrideDisplyaFormat = this.field.dateDisplayFormat;

        if (this.field) {
            if (this.field.minValue) {
                this.minDate = moment(this.field.minValue, this.field.dateDisplayFormat);
            }

            if (this.field.maxValue) {
                this.maxDate = moment(this.field.maxValue, this.field.dateDisplayFormat);
            }
        }
    }

    onDateChanged(newDateValue) {
        this.field.validationSummary = '';
        if (newDateValue) {
            let momentDate = moment(newDateValue, this.field.dateDisplayFormat);
            if (!momentDate.isValid()) {
                this.field.validationSummary = this.field.dateDisplayFormat;
            }
        }
        this.checkVisibility(this.field);
    }

}
