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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'date-range-widget',
    templateUrl: './date-range.widget.html',
    styleUrls: ['./date-range.widget.css']
})
export class DateRangeWidget {

    @Input()
    field: any;

    @Output()
    dateRangeChanged: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    public onDateRangeChanged(startDate: HTMLInputElement, endDate: HTMLInputElement) {
        if (startDate.validity.valid && endDate.validity.valid) {
            let dateStart = this.convertMomentDate(startDate.value);
            let endStart = this.convertMomentDate(endDate.value);
            this.dateRangeChanged.emit({startDate: dateStart, endDate: endStart});
        }
    }

    public convertMomentDate(date: string) {
        return moment(date, 'DD/MM/YYYY', true).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    }

}
