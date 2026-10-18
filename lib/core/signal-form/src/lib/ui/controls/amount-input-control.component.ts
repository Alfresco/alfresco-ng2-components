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
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '@alfresco/adf-core';
import { SignalInputControl } from './signal-input-control';
import { SignalFieldErrorComponent } from '../widgets/field-error/field-error.component';

const DEFAULT_CURRENCY = '$';
const WITH_FRACTIONS = '1.2-2';
const WITHOUT_FRACTIONS = '1.0-0';

/**
 * An amount input. With `localeAmounts`, the amount (and a numeric placeholder) is shown formatted for the user's
 * locale while it isn't being edited, and as typed while it is; otherwise the currency is shown before it.
 */
@Component({
    selector: 'adf-signal-amount-input',
    templateUrl: './amount-input-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CurrencyPipe],
    imports: [MatFormFieldModule, MatInputModule, TranslatePipe, SignalFieldErrorComponent]
})
export class SignalAmountInputControlComponent extends SignalInputControl<string | number | null> {
    readonly currency = input<string>();
    readonly enableFractions = input(false, { transform: booleanAttribute });
    readonly localeAmounts = input(false, { transform: booleanAttribute });

    private readonly currencyPipe = inject(CurrencyPipe);
    private readonly translation = inject(TranslationService);
    private readonly editing = signal(false);
    private readonly typedText = signal('');

    protected readonly shownCurrency = computed(() => this.currency() || DEFAULT_CURRENCY);

    private readonly valueText = computed(() => {
        const value = this.value();
        return value === null || value === undefined ? '' : `${value}`;
    });

    /** While the user edits, the text stays as typed, even if a rule changes the value meanwhile, as today. */
    protected readonly text = computed(() => {
        if (this.editing()) {
            return this.typedText();
        }
        return this.localeAmounts() ? this.formatted(this.valueText()) : this.valueText();
    });

    protected readonly shownPlaceholder = computed(() => (this.localeAmounts() ? this.formatted(this.placeholder()) : this.placeholder()));

    protected typed(text: string): void {
        this.typedText.set(text);
        this.value.set(text);
    }

    protected startEditing(): void {
        this.typedText.set(this.valueText());
        this.editing.set(true);
    }

    protected stopEditing(): void {
        this.editing.set(false);
        this.markTouched();
    }

    private formatted(amount: string): string {
        if (!amount.trim() || !Number.isFinite(Number(amount))) {
            return amount;
        }
        const currency = this.currency();
        const digits = this.enableFractions() ? WITH_FRACTIONS : WITHOUT_FRACTIONS;
        return this.currencyPipe.transform(amount, currency || '', currency ? 'symbol' : '', digits, this.translation.getLocale()) ?? amount;
    }
}
