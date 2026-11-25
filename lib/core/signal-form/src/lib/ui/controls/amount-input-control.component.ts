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

import { CurrencyPipe } from '@angular/common';
import {
    afterRenderEffect,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    model,
    signal,
    viewChild
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '@alfresco/adf-core';
import { FieldErrorMessage } from '../widgets/field-error-message';
import { SignalFieldErrorComponent } from '../widgets/field-error/field-error.component';

const DEFAULT_CURRENCY = '$';
const WITH_FRACTIONS = '1.2-2';
const WITHOUT_FRACTIONS = '1.0-0';

@Component({
    selector: 'adf-signal-amount-input',
    templateUrl: './amount-input-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CurrencyPipe],
    imports: [MatFormFieldModule, MatInputModule, TranslatePipe, SignalFieldErrorComponent]
})
export class SignalAmountInputControlComponent implements FormValueControl<string | number | null> {
    readonly value = model.required<string | number | null>();
    readonly touched = model(false);
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly readonly = input(false, { transform: booleanAttribute });
    readonly required = input(false, { transform: booleanAttribute });

    readonly inputId = input.required<string>();
    readonly label = input<string>();
    readonly labelAutomationId = input<string>();
    readonly placeholder = input('');
    readonly tooltip = input('');
    readonly error = input<FieldErrorMessage | null>(null);
    readonly currency = input<string>();
    readonly enableFractions = input(false, { transform: booleanAttribute });
    readonly localeAmounts = input(false, { transform: booleanAttribute });

    private readonly currencyPipe = inject(CurrencyPipe);
    private readonly translation = inject(TranslationService);
    private readonly editing = signal(false);
    private readonly typedText = signal('');
    private readonly matInput = viewChild(MatInput);

    protected readonly locked = computed(() => this.disabled() || this.readonly());
    protected readonly errorStateMatcher: ErrorStateMatcher = { isErrorState: () => this.error() !== null };
    protected readonly shownCurrency = computed(() => this.currency() || DEFAULT_CURRENCY);

    private readonly valueText = computed(() => `${this.value() ?? ''}`);

    protected readonly shownText = computed(() => {
        if (this.editing()) {
            return this.typedText();
        }
        return this.localeAmounts() ? this.formatForLocale(this.valueText()) : this.valueText();
    });

    protected readonly shownPlaceholder = computed(() => {
        if (this.localeAmounts()) {
            return this.formatForLocale(this.placeholder());
        }
        return this.placeholder();
    });

    constructor() {
        afterRenderEffect({
            write: () => {
                this.error();
                this.matInput()?.updateErrorState();
            }
        });
    }

    protected updateTypedText(text: string): void {
        this.typedText.set(text);
        this.value.set(text);
    }

    protected startEditing(): void {
        this.typedText.set(this.valueText());
        this.editing.set(true);
    }

    protected stopEditing(): void {
        this.editing.set(false);
        this.touched.set(true);
    }

    private formatForLocale(amount: string): string {
        if (!amount.trim() || !Number.isFinite(Number(amount))) {
            return amount;
        }
        const currency = this.currency();
        const digits = this.enableFractions() ? WITH_FRACTIONS : WITHOUT_FRACTIONS;
        return this.currencyPipe.transform(amount, currency || '', currency ? 'symbol' : '', digits, this.translation.getLocale()) ?? amount;
    }
}
