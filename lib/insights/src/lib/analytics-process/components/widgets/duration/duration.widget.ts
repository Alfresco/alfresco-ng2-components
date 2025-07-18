/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @angular-eslint/component-selector, @angular-eslint/no-input-rename */

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ParameterValueModel } from '../../../../diagram/models/report/parameter-value.model';
import { ReportParameterDetailsModel } from '../../../../diagram/models/report/report-parameter-details.model';
import { NumberWidgetAnalyticsComponent } from '../number/number.widget';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { DropdownWidgetAnalyticsComponent } from '../dropdown/dropdown.widget';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'duration-widget',
    imports: [CommonModule, MatFormFieldModule, TranslatePipe, FormsModule, DropdownWidgetAnalyticsComponent, MatInputModule],
    templateUrl: './duration.widget.html',
    styleUrls: ['./duration.widget.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DurationWidgetComponent extends NumberWidgetAnalyticsComponent implements OnInit {
    @Input('group')
    public formGroup: UntypedFormGroup;

    @Input('controllerName')
    public controllerName: string;

    @Input()
    required: boolean = false;

    duration: ReportParameterDetailsModel;
    currentValue: number;

    public selectionGroup: UntypedFormGroup;

    ngOnInit() {
        const timeType = new UntypedFormControl();
        this.formGroup.addControl('timeType', timeType);

        if (this.required) {
            this.formGroup.get(this.controllerName).setValidators(Validators.required);
        }
        if (this.field.value === null) {
            this.field.value = 0;
        }

        const paramOptions: ParameterValueModel[] = [];
        paramOptions.push(new ParameterValueModel({ id: '1', name: 'Seconds' }));
        paramOptions.push(new ParameterValueModel({ id: '60', name: 'Minutes' }));
        paramOptions.push(new ParameterValueModel({ id: '3600', name: 'Hours' }));
        paramOptions.push(new ParameterValueModel({ id: '86400', name: 'Days', selected: true }));

        this.duration = new ReportParameterDetailsModel({ id: 'duration', name: 'duration', options: paramOptions });
        this.duration.value = paramOptions[0].id;
    }

    public calculateDuration() {
        if (this.field && this.duration.value) {
            this.currentValue = parseInt(this.field.value, 10) * parseInt(this.duration.value, 10);
            this.formGroup.get(this.controllerName).setValue(this.currentValue);
            this.fieldChanged.emit({ value: this.currentValue });
        }
    }
}
