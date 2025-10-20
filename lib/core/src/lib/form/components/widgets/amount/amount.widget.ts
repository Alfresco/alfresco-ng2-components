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
import { Component, OnInit, ViewEncapsulation, InjectionToken, Inject, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { FormService } from '../../../services/form.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { WidgetComponent } from '../widget.component';
import { isObservable, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

    amountWidgetValue: string;
    currency: string = AmountWidgetComponent.DEFAULT_CURRENCY;
    currencyDisplay: string | boolean = 'symbol';
    decimalProperty: string;
    enableDisplayBasedOnLocale: boolean;
    locale: string;
    showReadonlyPlaceholder: boolean;
    valueAsNumber: number;
    valueAsString: string;

    get placeholder(): string {
        return this.showPlaceholder ? this.field.placeholder : '';
    }

    constructor(
        public formService: FormService,
        @Optional() @Inject(ADF_AMOUNT_SETTINGS) settings: Observable<AmountWidgetSettings> | AmountWidgetSettings,
        private currencyPipe: CurrencyPipe
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

    updateSettingsBasedProperties(data: AmountWidgetSettings): void {
        this.enableDisplayBasedOnLocale = data?.enableDisplayBasedOnLocale ?? false;
        this.showReadonlyPlaceholder = data?.showReadonlyPlaceholder;
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
            this.setInitialValues();
        }
    }

    amountWidgetOnBlur() {
        if (this.enableDisplayBasedOnLocale) {
            if (this.amountWidgetValue) {
                this.valueAsNumber = parseFloat(this.amountWidgetValue);
                this.valueAsString = this.currencyPipe.transform(this.amountWidgetValue, this.currency, this.currencyDisplay, this.decimalProperty);
                this.amountWidgetValue = this.valueAsString;
            } else {
                this.valueAsNumber = null;
                this.valueAsString = null;
                this.amountWidgetValue = null;
            }
        }
    }

    amountWidgetOnFocus() {
        if (this.enableDisplayBasedOnLocale) {
            this.amountWidgetValue = this.valueAsNumber || this.valueAsNumber === 0 ? this.valueAsNumber.toString() : null;
        }
    }

    getLocale() {
        const defaultLocale = 'en-US';
        if (typeof window?.navigator === 'undefined') {
            return defaultLocale;
        }
        const wn = window.navigator as any;
        let lang = wn.languages ? wn.languages[0] : defaultLocale;
        lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
        return lang;
    }

    onFieldChangedAmountWidget() {
        this.field.value = this.amountWidgetValue;
        super.onFieldChanged(this.field);
    }

    setInitialValues(): void {
        if (this.enableDisplayBasedOnLocale) {
            this.decimalProperty = this.field.enableFractions ? '1.2-2' : '1.0-0';
            this.locale = this.getLocale();
            this.valueAsNumber = this.field.value;
            this.amountWidgetValue = this.currencyPipe.transform(
                this.field.value,
                this.currency,
                this.currencyDisplay,
                this.decimalProperty,
                this.locale
            );
        } else {
            this.amountWidgetValue = this.field.value;
        }
    }
}
