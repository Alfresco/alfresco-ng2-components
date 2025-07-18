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

import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { UserPreferencesService, UserPreferenceValues } from '../common/services/user-preferences.service';
import { DecimalNumberModel } from '../models/decimal-number.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Pipe({
    name: 'adfDecimalNumber',
    pure: false
})
export class DecimalNumberPipe implements PipeTransform {
    static DEFAULT_LOCALE = 'en-US';
    static DEFAULT_MIN_INTEGER_DIGITS = 1;
    static DEFAULT_MIN_FRACTION_DIGITS = 0;
    static DEFAULT_MAX_FRACTION_DIGITS = 2;

    defaultLocale: string = DecimalNumberPipe.DEFAULT_LOCALE;
    defaultMinIntegerDigits: number = DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS;
    defaultMinFractionDigits: number = DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS;
    defaultMaxFractionDigits: number = DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS;
    constructor(public userPreferenceService?: UserPreferencesService, public appConfig?: AppConfigService) {
        if (this.userPreferenceService) {
            this.userPreferenceService
                .select(UserPreferenceValues.Locale)
                .pipe(takeUntilDestroyed())
                .subscribe((locale) => {
                    if (locale) {
                        this.defaultLocale = locale;
                    }
                });
        }

        if (this.appConfig) {
            this.defaultMinIntegerDigits = this.appConfig.get<number>('decimalValues.minIntegerDigits', DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS);
            this.defaultMinFractionDigits = this.appConfig.get<number>(
                'decimalValues.minFractionDigits',
                DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS
            );
            this.defaultMaxFractionDigits = this.appConfig.get<number>(
                'decimalValues.maxFractionDigits',
                DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS
            );
        }
    }

    transform(value: any, digitsInfo?: DecimalNumberModel, locale?: string): any {
        const actualMinIntegerDigits: number = digitsInfo?.minIntegerDigits ? digitsInfo.minIntegerDigits : this.defaultMinIntegerDigits;
        const actualMinFractionDigits: number = digitsInfo?.minFractionDigits ? digitsInfo.minFractionDigits : this.defaultMinFractionDigits;
        const actualMaxFractionDigits: number = digitsInfo?.maxFractionDigits ? digitsInfo.maxFractionDigits : this.defaultMaxFractionDigits;

        const actualDigitsInfo = `${actualMinIntegerDigits}.${actualMinFractionDigits}-${actualMaxFractionDigits}`;
        const actualLocale = locale || this.defaultLocale;

        const decimalPipe: DecimalPipe = new DecimalPipe(actualLocale);

        if (value instanceof Array) {
            return value.map((val) => decimalPipe.transform(val, actualDigitsInfo));
        } else {
            return decimalPipe.transform(value, actualDigitsInfo);
        }
    }
}
