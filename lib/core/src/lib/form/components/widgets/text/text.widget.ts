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
import { Component, Directive, inject, InjectionToken, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormsModule, FormGroupDirective, NgForm, UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { WidgetComponent } from '../widget.component';
import { ErrorMessageModel } from '../core/error-message.model';
import { FormattableTextWidgetComponent } from '../core/formattable-text.widget';
import { DEFAULT_TEXT_MAX_LENGTH } from '../core/form-field-validator';
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
    mask = '';
    placeholder = '';
    isMaskReversed = false;
    fieldStatusTemplate = inject(FIELD_STATUS_TEMPLATE, { optional: true });
    errorStateMatcher!: ErrorStateMatcher;
    translateParameters: Record<string, string> = {};
    maxLengthPasteError = new ErrorMessageModel();

    get resolvedMaxLength(): number {
        return this.field?.maxLength > 0 ? this.field.maxLength : DEFAULT_TEXT_MAX_LENGTH;
    }

    get maxLengthPasteErrorParameters(): Record<string, string> {
        return this.maxLengthPasteError.getAttributesAsJsonObj();
    }

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

    onPaste(event: ClipboardEvent): void {
        const input = event.target instanceof HTMLInputElement ? event.target : null;
        const pastedValue = event.clipboardData?.getData('text') ?? '';

        if (!input || this.getLengthAfterPaste(input, pastedValue) <= this.resolvedMaxLength) {
            this.clearMaxLengthPasteError();
            return;
        }

        event.preventDefault();
        this.markAsTouched();
        this.setMaxLengthPasteError();
    }

    onInput(event: Event): void {
        const inputType = 'inputType' in event ? event.inputType : undefined;

        if (inputType === 'insertFromPaste') {
            return;
        }

        this.clearMaxLengthPasteError();
    }

    onBlur(): void {
        this.markAsTouched();
        this.updateTranslateParameters();
    }

    onTextFieldChanged(): void {
        this.onFieldChanged(this.field);
        this.updateTranslateParameters();
    }

    private initErrorStateMatcher(): void {
        this.errorStateMatcher = {
            isErrorState: (_control: UntypedFormControl | null, _form: FormGroupDirective | NgForm | null): boolean =>
                !this.fieldStatusTemplate &&
                (this.maxLengthPasteError.isActive() ||
                    !!this.field.validationSummary?.message ||
                    (this.isInvalidFieldRequired() && this.isTouched()))
        };
    }

    private updateTranslateParameters(): void {
        if (this.field.validationSummary?.isActive()) {
            this.translateParameters = this.field.validationSummary.getAttributesAsJsonObj();
        } else {
            this.translateParameters = {};
        }
    }

    private getLengthAfterPaste(input: HTMLInputElement, pastedValue: string): number {
        const value = input.value ?? '';
        const selectionStart = input.selectionStart ?? value.length;
        const selectionEnd = input.selectionEnd ?? selectionStart;

        return value.length - Math.max(selectionEnd - selectionStart, 0) + pastedValue.length;
    }

    private setMaxLengthPasteError(): void {
        this.maxLengthPasteError = new ErrorMessageModel({
            message: 'FORM.FIELD.VALIDATOR.NO_LONGER_THAN',
            attributes: new Map([['maxLength', this.resolvedMaxLength.toLocaleString()]])
        });
    }

    private clearMaxLengthPasteError(): void {
        this.maxLengthPasteError = new ErrorMessageModel();
    }
}