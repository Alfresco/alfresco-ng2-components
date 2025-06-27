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

import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalNumberPipe } from '../../../../pipes';
import { FormService } from '../../../services/form.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { WidgetComponent } from '../widget.component';

@Component({
    selector: 'number-widget',
    standalone: true,
    templateUrl: './number.widget.html',
    styleUrls: ['./number.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    imports: [NgIf, TranslatePipe, MatFormFieldModule, MatInputModule, FormsModule, ErrorWidgetComponent],
    providers: [DecimalNumberPipe],
    encapsulation: ViewEncapsulation.None
})
export class NumberWidgetComponent extends WidgetComponent implements OnInit {
    displayValue: number;

    constructor(public formService: FormService, private decimalNumberPipe: DecimalNumberPipe) {
        super(formService);
    }

    ngOnInit() {
        if (this.field.readOnly) {
            this.displayValue = this.decimalNumberPipe.transform(this.field.value);
        } else {
            this.displayValue = this.field.value;
        }
    }

    protected onNumberChange(value: string) {
        if (value === null || value === undefined || value === '') {
            this.field.value = null;
        }

        this.onFieldChanged(this.field);
    }
}
