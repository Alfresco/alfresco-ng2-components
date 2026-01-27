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

import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Directive, inject, InjectionToken, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ErrorWidgetComponent } from '../error/error.component';
import { WidgetComponent } from '../widget.component';
import { InputMaskDirective } from './text-mask.component';

type FieldStatusTemplate = TemplateRef<{ $implicit: WidgetComponent }>;
const FIELD_STATUS_TEMPLATE = new InjectionToken<FieldStatusTemplate>('FIELD_STATUS_TEMPLATE');

@Directive({
    selector: '[adf-field-status-template]',
    providers: [
        {
            provide: FIELD_STATUS_TEMPLATE,
            useFactory: (directive: FieldStatusTemplateDirective) => directive.template,
            deps: [FieldStatusTemplateDirective]
        }
    ]
})
export class FieldStatusTemplateDirective {
    @Input('adf-field-status-template')
    template?: FieldStatusTemplate;
}

@Component({
    selector: 'text-widget',
    templateUrl: './text.widget.html',
    styleUrls: ['./text.widget.scss'],
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
    imports: [NgIf, TranslatePipe, MatFormFieldModule, MatInputModule, FormsModule, ErrorWidgetComponent, InputMaskDirective, NgTemplateOutlet],
    encapsulation: ViewEncapsulation.None
})
export class TextWidgetComponent extends WidgetComponent implements OnInit {
    mask: string;
    placeholder: string;
    isMaskReversed: boolean;
    fieldStatusTemplate = inject(FIELD_STATUS_TEMPLATE, { optional: true });

    ngOnInit() {
        if (this.field.params) {
            this.mask = this.field.params['inputMask'];
            this.placeholder =
                this.field.params['inputMask'] && this.field.params['inputMaskPlaceholder']
                    ? this.field.params['inputMaskPlaceholder']
                    : this.field.placeholder;
            this.isMaskReversed = this.field.params['inputMaskReversed'] ? this.field.params['inputMaskReversed'] : false;
        }
    }
}
