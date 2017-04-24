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

import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { NumberWidget } from './../number/number.widget';
import { ReportParameterDetailsModel, ParameterValueModel } from './../../../models/report.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'duration-widget',
    templateUrl: './duration.widget.html',
    styleUrls: ['./duration.widget.css']
})
export class DurationWidget extends NumberWidget implements OnInit {

    @Input()
    field: any;

    @Input('group')
    public formGroup: FormGroup;

    @Input('controllerName')
    public controllerName: string;

    @Input()
    required: boolean = false;

    duration: ReportParameterDetailsModel;
    currentValue: number;

    public selectionGroup: FormGroup;

    constructor(public elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnInit() {
        let timeType = new FormControl();
        this.formGroup.addControl('timeType', timeType);

        if (this.required) {
            this.formGroup.get(this.controllerName).setValidators(Validators.required);
        }
        if (this.field.value === null) {
            this.field.value = 0;
        }

        let paramOptions: ParameterValueModel[] = [];
        paramOptions.push(new ParameterValueModel({id: '1', name: 'Seconds'}));
        paramOptions.push(new ParameterValueModel({id: '60', name: 'Minutes'}));
        paramOptions.push(new ParameterValueModel({id: '3600', name: 'Hours'}));
        paramOptions.push(new ParameterValueModel({id: '86400', name: 'Days', selected: true}));

        this.duration = new ReportParameterDetailsModel({id: 'duration', name: 'duration', options: paramOptions});
        this.duration.value = paramOptions[0].id;
    }

    public calculateDuration() {
        if (this.field && this.duration.value ) {
            this.currentValue = parseInt(this.field.value, 10) * parseInt(this.duration.value, 10);
            this.formGroup.get(this.controllerName).setValue(this.currentValue);
            this.fieldChanged.emit({value: this.currentValue});
        }
    }

}
