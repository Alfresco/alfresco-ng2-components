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
import { ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { WidgetComponent } from '../widget.component';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'analytics-number-widget',
    imports: [CommonModule, TranslatePipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
    templateUrl: './number.widget.html',
    styleUrls: ['./number.widget.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NumberWidgetAnalyticsComponent extends WidgetComponent implements OnInit {
    @Input('group')
    public formGroup: UntypedFormGroup;

    @Input('controllerName')
    public controllerName: string;

    @Input()
    required: boolean = false;

    ngOnInit() {
        if (this.required) {
            this.formGroup.get(this.controllerName).setValidators(Validators.required);
        }
    }
}
