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

import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

declare let mdDateTimePicker: any;
declare var componentHandler: any;

@Component({
    selector: 'date-widget',
    templateUrl: './date.widget.html',
    styleUrls: ['./date.widget.scss'],
    host: baseHost
})
export class DateWidgetComponent extends WidgetComponent implements OnInit, AfterViewChecked {

    datePicker: any;

    constructor(public formService: FormService,
                public elementRef: ElementRef) {
         super(formService);
    }

    ngOnInit() {

        let settings: any = {
            type: 'date',
            past: moment().subtract(100, 'years'),
            future: moment().add(100, 'years')
        };

        if (this.field) {

            if (this.field.minValue) {
                settings.past = moment(this.field.minValue, this.field.dateDisplayFormat);
            }

            if (this.field.maxValue) {
                settings.future = moment(this.field.maxValue, this.field.dateDisplayFormat);
            }

            if (this.field.value) {
                settings.init = moment(this.field.value, this.field.dateDisplayFormat);
            }
        }

        this.datePicker = new mdDateTimePicker.default(settings);
    }

    ngAfterViewChecked() {
        if (this.elementRef) {
            let dataLocator = '#' + this.field.id;
            this.datePicker.trigger = this.elementRef.nativeElement.querySelector(dataLocator);
        }
    }

    onDateChanged() {
        if (this.field.value) {
            let value = moment(this.field.value, this.field.dateDisplayFormat);
            if (!value.isValid()) {
                value = moment();
            }
            this.datePicker.time = value;
        }
        this.checkVisibility(this.field);
    }

    onDateSelected() {
        let newValue = this.datePicker.time.format(this.field.dateDisplayFormat);
        this.field.value = newValue;
        this.checkVisibility(this.field);

        if (this.elementRef) {
            this.setupMaterialTextField(this.elementRef, componentHandler, newValue);
        }
    }

}
