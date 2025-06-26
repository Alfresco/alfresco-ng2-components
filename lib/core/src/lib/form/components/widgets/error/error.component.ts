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

/* eslint-disable @angular-eslint/component-selector */

import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FormService } from '../../../services/form.service';
import { ErrorMessageModel } from '../core';
import { WidgetComponent } from '../widget.component';

@Component({
    selector: 'error-widget',
    standalone: true,
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    animations: [
        trigger('transitionMessages', [
            state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
            transition('void => enter', [
                style({
                    opacity: 0,
                    transform: 'translateY(-100%)'
                }),
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')
            ])
        ])
    ],
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
    imports: [NgIf, MatIconModule, TranslatePipe],
    encapsulation: ViewEncapsulation.None
})
export class ErrorWidgetComponent extends WidgetComponent implements OnChanges {
    @Input()
    error: ErrorMessageModel;

    @Input()
    required: string;

    translateParameters: any = null;

    subscriptAnimationState: string = '';

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['required']) {
            this.required = changes.required.currentValue;
            this.subscriptAnimationState = 'enter';
        }
        if (changes['error']?.currentValue) {
            if (changes.error.currentValue.isActive()) {
                this.error = changes.error.currentValue;
                this.translateParameters = this.error.getAttributesAsJsonObj();
                this.subscriptAnimationState = 'enter';
            }
        }
    }
}
