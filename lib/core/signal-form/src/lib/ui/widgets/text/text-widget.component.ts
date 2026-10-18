/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { maxLengthOf } from '../../../validation/field-validation';
import { fieldErrorMessage } from '../field-error-message';
import { SignalLeftLabelComponent } from '../left-label/left-label.component';
import { SignalFormWidget } from '../signal-form-widget';
import { SignalMaskedTextInputControlComponent } from '../../controls/masked-text-input-control.component';
import { SignalFieldErrorComponent } from '../field-error/field-error.component';

/**
 * Edits a text, through the masked text control when the field has an input mask.
 */
@Component({
    selector: 'adf-signal-text-widget',
    templateUrl: './text-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormField,
        MatFormFieldModule,
        MatInputModule,
        TranslatePipe,
        SignalMaskedTextInputControlComponent,
        SignalLeftLabelComponent,
        SignalFieldErrorComponent
    ]
})
export class SignalTextWidgetComponent extends SignalFormWidget<string> {
    protected readonly widgetClass: string = 'adf-text-widget';
    protected readonly labelAutomationId: string = 'adf-text-widget-label';

    protected readonly inputMask = computed(() => this.definition().inputMask ?? null);

    /** Set while a paste was refused for making the text too long, until the text is edited otherwise. */
    private readonly pasteRejected = signal(false);

    protected override readonly shownError = computed(() => {
        if (this.pasteRejected()) {
            return fieldErrorMessage('maxLength', this.definition());
        }
        return this.showError() ? this.error() : null;
    });

    /**
     * Refuses a paste that would make the text longer than the field allows, as today's text widget does, and says so
     * at once.
     *
     * @param event the paste
     * @param textInput the input pasted into
     */
    protected guardPaste(event: ClipboardEvent, textInput: HTMLInputElement): void {
        const limit = maxLengthOf(this.definition());
        if (!limit) {
            return;
        }
        const text = textInput.value;
        const replaced = (textInput.selectionEnd ?? text.length) - (textInput.selectionStart ?? text.length);
        const pasted = event.clipboardData?.getData('text') ?? '';
        const tooLong = text.length - replaced + pasted.length > limit;
        if (tooLong) {
            event.preventDefault();
            this.field()().markAsTouched();
        }
        this.pasteRejected.set(tooLong);
    }

    protected edited(event: Event): void {
        if ((event as InputEvent).inputType !== 'insertFromPaste') {
            this.pasteRejected.set(false);
        }
    }
    protected readonly placeholder = computed(() => this.inputMask()?.placeholder || (this.definition().placeholder ?? ''));
}

@Component({
    selector: 'adf-signal-integer-widget',
    templateUrl: './text-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormField,
        MatFormFieldModule,
        MatInputModule,
        TranslatePipe,
        SignalMaskedTextInputControlComponent,
        SignalLeftLabelComponent,
        SignalFieldErrorComponent
    ]
})
export class SignalIntegerWidgetComponent extends SignalTextWidgetComponent {
    protected override readonly widgetClass: string = 'adf-number-widget';
    protected override readonly labelAutomationId: string = 'adf-number-widget-label';
}

@Component({
    selector: 'adf-signal-decimal-widget',
    templateUrl: './text-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormField,
        MatFormFieldModule,
        MatInputModule,
        TranslatePipe,
        SignalMaskedTextInputControlComponent,
        SignalLeftLabelComponent,
        SignalFieldErrorComponent
    ]
})
export class SignalDecimalWidgetComponent extends SignalTextWidgetComponent {
    protected override readonly widgetClass: string = 'adf-decimal-widget';
    protected override readonly labelAutomationId: string = 'adf-decimal-widget-label';
}
