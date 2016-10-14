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

import { Component, ElementRef, OnInit } from '@angular/core';
import { TextFieldWidgetComponent } from './../textfield-widget.component';

@Component({
    moduleId: module.id,
    selector: 'date-widget',
    templateUrl: './date.widget.html',
    styleUrls: ['./date.widget.css']
})
export class DateWidget extends TextFieldWidgetComponent implements OnInit {

    DATE_FORMAT: string = 'D-M-YYYY';

    datePicker: any;

    constructor(elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnInit() {

        let settings: any = {
            type: 'date',
            future: moment().add(21, 'years')
        };

        if (this.field) {

            if (this.field.minValue) {
                settings.past = moment(this.field.minValue, this.DATE_FORMAT);
            }

            if (this.field.maxValue) {
                settings.future = moment(this.field.maxValue, this.DATE_FORMAT);
            }

            if (this.field.value) {
                settings.init = moment(this.field.value, this.DATE_FORMAT);
            }
        }

        this.datePicker = new mdDateTimePicker.default(settings);
        if (this.elementRef) {
            this.datePicker.trigger = this.elementRef.nativeElement.querySelector('#dateInput');
        }
    }

    onDateChanged() {
        if (this.field.value) {
            this.datePicker.time = moment(this.field.value, this.DATE_FORMAT);
        }
        this.checkVisibility(this.field);
    }

    onDateSelected() {
        let newValue = this.datePicker.time.format(this.DATE_FORMAT);
        this.field.value = newValue;

        if (this.elementRef) {
            this.setupMaterialTextField(this.elementRef, componentHandler, newValue);
        }
    }

}
