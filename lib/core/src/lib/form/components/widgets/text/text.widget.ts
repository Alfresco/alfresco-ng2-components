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
import { Component, DestroyRef, Directive, inject, InjectionToken, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, FormGroupDirective, NgForm, UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { isObservable } from 'rxjs';
import { ADF_CUSTOM_MESSAGE } from '../core/custom-validation-message.token';
import { WidgetComponent } from '../widget.component';
import { FormattableTextWidgetComponent } from '../core/formattable-text.widget';
import { InputMaskDirective } from './text-mask.component';
import { IconModule } from '../../../../icon/icon.module';

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
    imports: [NgIf, TranslatePipe, MatFormFieldModule, MatInputModule, FormsModule, InputMaskDirective, NgTemplateOutlet, IconModule, MatIconModule],
    encapsulation: ViewEncapsulation.None
})
export class TextWidgetComponent extends FormattableTextWidgetComponent {
    mask: string;
    placeholder: string;
    isMaskReversed: boolean;
    fieldStatusTemplate = inject(FIELD_STATUS_TEMPLATE, { optional: true });
    errorStateMatcher: ErrorStateMatcher;
    translateParameters: Record<string, string> = {};

    override ngOnInit() {
        super.ngOnInit();

        if (this.field.params) {
            this.mask = this.field.params['inputMask'];
            this.placeholder =
                this.field.params['inputMask'] && this.field.params['inputMaskPlaceholder']
                    ? this.field.params['inputMaskPlaceholder']
                    : this.field.placeholder;
            this.isMaskReversed = this.field.params['inputMaskReversed'] ? this.field.params['inputMaskReversed'] : false;
        }
        this.initErrorStateMatcher();
    }

    private initErrorStateMatcher(): void {
        this.errorStateMatcher = {
            isErrorState: (_control: UntypedFormControl | null, _form: FormGroupDirective | NgForm | null): boolean =>
                !this.field.isValid && this.isTouched()
        };
    }

    private updateTranslateParameters(): void {
        if (this.field.validationSummary?.isActive()) {
            this.translateParameters = this.field.validationSummary.getAttributesAsJsonObj();
        } else {
            this.translateParameters = {};
        }
    }

    onBlur(): void {
        this.markAsTouched();
        this.updateTranslateParameters();
    }

    onTextFieldChanged(): void {
        this.onFieldChanged(this.field);
        this.updateTranslateParameters();
    }
}
