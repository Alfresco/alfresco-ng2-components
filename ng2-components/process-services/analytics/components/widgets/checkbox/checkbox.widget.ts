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

/* tslint:disable:no-access-missing-member */
import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WidgetComponent } from './../widget.component';

@Component({
    selector: 'checkbox-widget',
    templateUrl: './checkbox.widget.html',
    encapsulation: ViewEncapsulation.None
})
export class CheckboxWidgetComponent extends WidgetComponent {

    @Input()
    field: any;

    @Input('group')
    public formGroup: FormGroup;

    @Input('controllerName')
    public controllerName: string;

    constructor(public elementRef: ElementRef) {
        super();
    }
}
