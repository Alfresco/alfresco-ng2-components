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

/* eslint-disable @angular-eslint/component-selector */

import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, InjectionToken, inject, DestroyRef, signal } from '@angular/core';
import { FormsModule, FormGroupDirective, NgForm, UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { getValidationSummaryTranslationParameters } from '../core/error-message.model';
import { WidgetComponent } from '../widget.component';
import { filter, isObservable, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormFieldEvent } from '../../../events/form-field.event';
import { TranslationService } from '../../../../translation/translation.service';
import {
    captureFormStateMount,
    FormStateMount,
    formStateCommits,
    isFormStateMountCurrent,
    isFormStateProjectionCurrent
} from '../../../models/form-state.model';

export interface AmountWidgetSettings {
    showReadonlyPlaceholder: boolean;
    enableDisplayBasedOnLocale: boolean;
}

export const ADF_AMOUNT_SETTINGS = new InjectionToken<Observable<AmountWidgetSettings> | AmountWidgetSettings>('adf-amount-settings');

@Component({
    selector: 'amount-widget',
    templateUrl: './amount.widget.html',
    styleUrls: ['./amount.widget.scss'],
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
    imports: [MatFormFieldModule, MatInputModule, FormsModule, TranslatePipe, NgIf, MatIconModule],
    providers: [CurrencyPipe],
    encapsulation: ViewEncapsulation.None
})
export class AmountWidgetComponent extends WidgetComponent implements OnInit {
    private readonly currencyPipe = inject(CurrencyPipe);
    private readonly translationService = inject(TranslationService);

    static DEFAULT_CURRENCY: string = '$';
    private showPlaceholder = true;
    private readonly destroyRef = inject(DestroyRef);
    private stateMount?: FormStateMount;

    private readonly displayValue = signal<string>(undefined);

    get amountWidgetValue(): string {
        return this.displayValue();
    }

    set amountWidgetValue(value: string) {
        this.displayValue.set(value);
    }

    currency: string = AmountWidgetComponent.DEFAULT_CURRENCY;
    currencyDisplay: string | boolean = 'symbol';
    decimalProperty: string;
    enableDisplayBasedOnLocale: boolean;
    errorStateMatcher: ErrorStateMatcher;
    isInputInFocus = false;
    locale: string;
    notShowDecimalDigits = '1.0-0';
    showDecimalDigits = '1.2-2';
    showReadonlyPlaceholder: boolean;
    translateParameters: Record<string, string> = {};
    valueAsNumber: number;

    get placeholder(): string {
        if (!this.showPlaceholder) return '';
        if (!this.enableDisplayBasedOnLocale) return this.field.placeholder;
        if (this.checkIfEmptyStringOrOnlySpaces(this.field.placeholder)) return this.field.placeholder;

        const stringConvertedToNumber = Number(this.field.placeholder);
        if (isNaN(stringConvertedToNumber)) {
            return this.field.placeholder;
        }
        return this.currencyPipe.transform(this.field.placeholder, this.currency, this.currencyDisplay, this.decimalProperty, this.locale);
    }

    constructor() {
        const settings = inject<Observable<AmountWidgetSettings> | AmountWidgetSettings>(ADF_AMOUNT_SETTINGS, { optional: true });

        super();
        if (isObservable(settings)) {
            settings.pipe(takeUntilDestroyed()).subscribe((data: AmountWidgetSettings) => {
                this.updateSettingsBasedProperties(data);
            });
        } else {
            this.updateSettingsBasedProperties(settings);
        }
    }

    ngOnInit() {
        if (this.field) {
            this.stateMount = captureFormStateMount(this.field);
            if (this.field.currency) {
                this.currency = this.field.currency;
            } else {
                if (this.enableDisplayBasedOnLocale) {
                    this.currency = '';
                    this.currencyDisplay = '';
                }
            }

            if (this.field.readOnly) {
                this.showPlaceholder = this.showReadonlyPlaceholder;
            }
            this.subscribeToFieldChanges();
            this.subscribeToStateCommits();
            this.setInitialValues();
            this.initErrorStateMatcher();
            this.field.validationSummaryChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((validationSummary) => {
                this.translateParameters = getValidationSummaryTranslationParameters(validationSummary);
            });
        }
    }

    amountWidgetOnBlur(): void {
        if (this.isStateMountStale()) {
            return;
        }
        this.isInputInFocus = false;
        if (this.enableDisplayBasedOnLocale) {
            if (this.amountWidgetValue) {
                this.valueAsNumber = parseFloat(this.amountWidgetValue);
                this.amountWidgetValue = this.currencyPipe.transform(
                    this.amountWidgetValue,
                    this.currency,
                    this.currencyDisplay,
                    this.decimalProperty,
                    this.locale
                );
            } else {
                this.valueAsNumber = null;
                this.amountWidgetValue = null;
            }
        }
        this.markAsTouched();
    }

    amountWidgetOnFocus(): void {
        if (this.isStateMountStale()) {
            return;
        }
        this.isInputInFocus = true;
        if (this.enableDisplayBasedOnLocale) {
            const hasValue = this.valueAsNumber === 0 || this.valueAsNumber;
            this.amountWidgetValue = hasValue ? this.valueAsNumber.toString() : null;
        }
    }

    checkIfEmptyStringOrOnlySpaces(placeholder: string): boolean {
        const regexpOnlySpaces = /^\s*$/;
        return !placeholder || regexpOnlySpaces.test(placeholder);
    }

    onFieldChangedAmountWidget(): void {
        if (this.isStateMountStale()) {
            return;
        }
        this.field.value = this.amountWidgetValue;
        this.valueAsNumber = this.amountWidgetValue === null || this.amountWidgetValue === '' ? null : Number(this.amountWidgetValue);
        super.onFieldChanged(this.field);
        this.markAsTouched();
    }

    override event(event: Event): void {
        if (this.isStateMountStale()) {
            return;
        }
        super.event(event);
    }

    setInitialValues(): void {
        if (this.enableDisplayBasedOnLocale) {
            this.decimalProperty = this.field.enableFractions ? this.showDecimalDigits : this.notShowDecimalDigits;
            this.locale = this.translationService.getLocale();
            this.updateValue(this.field.value);
        } else {
            this.amountWidgetValue = this.field.value;
        }
    }

    subscribeToFieldChanges(): void {
        this.formService.formFieldValueChanged
            .pipe(
                filter((ev: FormFieldEvent) => ev.form === this.field.form && ev.field === this.field && !this.isStateMountStale()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((ev: FormFieldEvent) => this.syncWithFieldValue(ev));
    }

    private subscribeToStateCommits(): void {
        formStateCommits
            .pipe(
                filter(({ field, context }) => field === this.field && isFormStateProjectionCurrent(field, context, this.stateMount)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.projectCommittedValue());
    }

    private syncWithFieldValue(ev: FormFieldEvent): void {
        if (ev.writeContext) {
            if (isFormStateProjectionCurrent(this.field, ev.writeContext, this.stateMount)) {
                this.projectCommittedValue();
            }
            return;
        }
        if (this.isInputInFocus) {
            return;
        }
        if (this.enableDisplayBasedOnLocale) {
            this.updateValue(ev.field.value);
            return;
        }
        this.amountWidgetValue = ev.field.value;
    }

    private isStateMountStale(): boolean {
        return !!this.stateMount && !isFormStateMountCurrent(this.field, this.stateMount);
    }

    private projectCommittedValue(): void {
        const value = this.field.value;
        this.valueAsNumber = value === null || value === undefined || value === '' ? null : Number(value);
        if (this.enableDisplayBasedOnLocale && !this.isInputInFocus) {
            this.updateValue(this.valueAsNumber);
        } else {
            this.amountWidgetValue = this.valueAsNumber === null ? null : String(this.valueAsNumber);
        }
    }

    updateValue(value: any): void {
        this.valueAsNumber = value;
        this.amountWidgetValue = this.currencyPipe.transform(value, this.currency, this.currencyDisplay, this.decimalProperty, this.locale);
    }

    updateSettingsBasedProperties(data: AmountWidgetSettings): void {
        this.enableDisplayBasedOnLocale = data?.enableDisplayBasedOnLocale ?? false;
        this.showReadonlyPlaceholder = data?.showReadonlyPlaceholder;
    }

    private initErrorStateMatcher(): void {
        this.errorStateMatcher = {
            isErrorState: (_control: UntypedFormControl | null, _form: FormGroupDirective | NgForm | null): boolean =>
                !!this.field.validationSummary?.message || (this.isInvalidFieldRequired() && this.isTouched())
        };
    }
}
