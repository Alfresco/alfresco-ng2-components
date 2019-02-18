/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ErrorMessageModel } from '../core/index';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'error-widget',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    animations: [
        trigger('transitionMessages', [
            state('enter', style({opacity: 1, transform: 'translateY(0%)'})),
            transition('void => enter', [
                style({opacity: 0, transform: 'translateY(-100%)'}),
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')
            ])
        ])
    ],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class ErrorWidgetComponent extends WidgetComponent implements OnChanges {

    @Input()
    error: ErrorMessageModel;

    @Input()
    required: string;

    translateParameters: any = null;

    _subscriptAnimationState: string = '';

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['required']) {
            this.required = changes.required.currentValue;
            this._subscriptAnimationState = 'enter';
        }
        if (changes['error'] && changes['error'].currentValue) {
            if (changes.error.currentValue.isActive()) {
                this.error = changes.error.currentValue;
                this.translateParameters = this.error.getAttributesAsJsonObj();
                this._subscriptAnimationState = 'enter';
            }
        }
    }
}
