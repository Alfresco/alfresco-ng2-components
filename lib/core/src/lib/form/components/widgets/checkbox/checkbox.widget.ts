/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewEncapsulation, HostBinding, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';

@Component({
    selector: 'checkbox-widget',
    templateUrl: './checkbox.widget.html',
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
    styleUrls: ['./checkbox.widget.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CheckboxWidgetComponent extends WidgetComponent implements OnInit {
    @HostBinding('style.--frame-color') frameColor: string;
    @HostBinding('style.--label-color') labelColor: string;
    @HostBinding('style.--checked-color') checkedColor: string;
    @HostBinding('style.--background-color') backgroundColor: string;
    @HostBinding('style.--font-size') fontSize: number;

    checkboxValue: boolean;

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnInit(){
        this.frameColor = this.field?.params?.styles?.textColor;
        this.labelColor = this.field?.params?.styles?.textColor;
        this.backgroundColor = this.field?.params?.styles?.backgroundColor;
    };
}
