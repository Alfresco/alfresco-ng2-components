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

import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, InjectionToken, Inject, Optional, inject, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { FormService } from '../../../services/form.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { WidgetComponent } from '../widget.component';
import { filter, isObservable, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormFieldEvent } from '../../../events/form-field.event';
import { TranslationService } from '../../../../translation/translation.service';

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
    imports: [MatFormFieldModule, MatInputModule, FormsModule, ErrorWidgetComponent, TranslatePipe, NgIf],
    providers: [CurrencyPipe],
    encapsulation: ViewEncapsulation.None
})
export class AmountWidgetComponent extends WidgetComponent implements OnInit {
    static DEFAULT_CURRENCY: string = '$';
    private showPlaceholder = true;
    private readonly destroyRef = inject(DestroyRef);

    amountWidgetValue: string;
    currency: string = AmountWidgetComponent.DEFAULT_CURRENCY;
    currencyDisplay: string | boolean = 'symbol';
    decimalProperty: string;
    enableDisplayBasedOnLocale: boolean;
    isInputInFocus = false;
    locale: string;
    notShowDecimalDigits = '1.0-0';
    showDecimalDigits = '1.2-2';
    showReadonlyPlaceholder: boolean;
    valueAsNumber: number;

    get placeholder(): string {
        if (this.showPlaceholder) {
            return this.enableDisplayBasedOnLocale
                ? this.currencyPipe.transform(this.field.placeholder, this.currency, this.currencyDisplay, this.decimalProperty, this.locale)
                : this.field.placeholder;
        }
        return '';
    }

    constructor(
        public formService: FormService,
        @Optional() @Inject(ADF_AMOUNT_SETTINGS) settings: Observable<AmountWidgetSettings> | AmountWidgetSettings,
        private currencyPipe: CurrencyPipe,
        private translationService: TranslationService
    ) {
        super(formService);
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
            this.setInitialValues();
        }
    }

    amountWidgetOnBlur(): void {
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
        this.isInputInFocus = true;
        if (this.enableDisplayBasedOnLocale) {
            const hasValue = this.valueAsNumber === 0 || this.valueAsNumber;
            this.amountWidgetValue = hasValue ? this.valueAsNumber.toString() : null;
        }
    }

    onFieldChangedAmountWidget(): void {
        this.field.value = this.amountWidgetValue;
        super.onFieldChanged(this.field);
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
                filter((ev: FormFieldEvent) => ev.field.id === this.field.id),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((ev: FormFieldEvent) => {
                if (!this.isInputInFocus && this.enableDisplayBasedOnLocale) {
                    this.updateValue(ev.field.value);
                } else if (!this.isInputInFocus) {
                    this.amountWidgetValue = ev.field.value;
                }
            });
    }

    updateValue(value: any): void {
        this.valueAsNumber = value;
        this.amountWidgetValue = this.currencyPipe.transform(value, this.currency, this.currencyDisplay, this.decimalProperty, this.locale);
    }

    updateSettingsBasedProperties(data: AmountWidgetSettings): void {
        this.enableDisplayBasedOnLocale = data?.enableDisplayBasedOnLocale ?? false;
        this.showReadonlyPlaceholder = data?.showReadonlyPlaceholder;
    }
}
