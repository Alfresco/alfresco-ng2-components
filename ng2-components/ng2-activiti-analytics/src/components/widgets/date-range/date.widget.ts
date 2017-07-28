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

/* tslint:disable::no-access-missing-member */
import { Component, Input, OnInit } from '@angular/core';
// import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'date-widget',
    templateUrl: './date.widget.html',
    styleUrls: ['./date.widget.css']
})
export class DateWidgetComponent implements OnInit {

    @Input()
    field: any;

    @Input('group')
    public dateRange: FormGroup;

    constructor() {

    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        let startDateForm = this.field.value ? this.field.value.startDate : '' ;
        // let startDate = this.convertToMomentDate(startDateForm);

        let endDateForm = this.field.value ? this.field.value.endDate : '' ;
        // let endDate = this.convertToMomentDate(endDateForm);

        console.log('date widget field'+ startDateForm);
        console.log('date widget field'+ endDateForm);
    }
}
