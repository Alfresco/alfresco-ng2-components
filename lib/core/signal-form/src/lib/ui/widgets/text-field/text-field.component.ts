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

import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { InputMaskDirective } from '@alfresco/adf-core';
import { FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { SignalPasteLimitDirective } from '../../controls/paste-limit.directive';
import { maxLengthMessage } from '../field-error-message';
import { SignalFieldErrorComponent } from '../field-error/field-error.component';
import { SignalLeftLabelComponent } from '../left-label/left-label.component';
import { SignalFormWidget } from '../signal-form-widget';

@Component({
    selector: 'adf-signal-text-field',
    templateUrl: './text-field.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormField,
        MatFormFieldModule,
        MatInputModule,
        TranslatePipe,
        InputMaskDirective,
        SignalPasteLimitDirective,
        SignalFieldErrorComponent,
        SignalLeftLabelComponent
    ]
})
export class SignalTextFieldComponent extends SignalFormWidget<string> {
    readonly widgetClass = input.required<string>();
    readonly pasteLimit = input(0);

    protected readonly labelAutomationId = computed(() => `${this.widgetClass()}-label`);
    protected readonly inputMask = computed(() => this.definition().inputMask ?? null);
    protected readonly maskSettings = computed(() => ({ mask: this.inputMask()?.mask ?? '', isReversed: !!this.inputMask()?.reversed }));
    protected readonly placeholder = computed(() => this.inputMask()?.placeholder || (this.definition().placeholder ?? ''));

    private readonly pasteRefused = signal(false);

    protected override readonly shownError = computed(() => {
        if (this.pasteRefused()) {
            return maxLengthMessage(this.pasteLimit());
        }
        return this.showError() ? this.error() : null;
    });

    protected refusePaste(refused: boolean): void {
        if (refused) {
            this.field()().markAsTouched();
        }
        this.pasteRefused.set(refused);
    }
}
