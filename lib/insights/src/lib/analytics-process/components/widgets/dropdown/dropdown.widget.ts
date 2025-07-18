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
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { WidgetComponent } from '../widget.component';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'analytics-dropdown-widget',
    imports: [CommonModule, TranslatePipe, ReactiveFormsModule],
    templateUrl: './dropdown.widget.html',
    styleUrls: ['./dropdown.widget.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DropdownWidgetAnalyticsComponent extends WidgetComponent implements OnInit {
    @Input('group')
    public formGroup: UntypedFormGroup;

    @Input('controllerName')
    public controllerName: string;

    @Input()
    showDefaultOption: boolean = true;

    @Input()
    required: boolean = false;

    @Input()
    defaultOptionText: string = 'Choose One';

    ngOnInit() {
        if (this.required) {
            this.formGroup.get(this.controllerName).setValidators(Validators.compose(this.buildValidatorList()));
        }
    }

    validateDropDown(controller: UntypedFormControl) {
        return controller.value !== 'null' ? null : { controllerName: false };
    }

    buildValidatorList() {
        const validatorList = [];
        validatorList.push(Validators.required);
        if (this.showDefaultOption) {
            validatorList.push(this.validateDropDown);
        }
        return validatorList;
    }
}
