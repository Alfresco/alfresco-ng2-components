/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { UserPreferencesService, UserPreferenceValues } from '../common/services/user-preferences.service';
import { DatePipe } from '@angular/common';
import { differenceInDays, formatDistance } from 'date-fns';
import * as Locales from 'date-fns/locale';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Pipe({
    standalone: true,
    name: 'adfTimeAgo'
})
export class TimeAgoPipe implements PipeTransform {
    static DEFAULT_LOCALE = 'en-US';
    static DEFAULT_DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';

    defaultLocale: string;
    defaultDateTimeFormat: string;
    constructor(public userPreferenceService: UserPreferencesService, public appConfig: AppConfigService) {
        this.userPreferenceService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntilDestroyed())
            .subscribe((locale) => {
                this.defaultLocale = locale || TimeAgoPipe.DEFAULT_LOCALE;
            });
        this.defaultDateTimeFormat = this.appConfig.get<string>('dateValues.defaultDateTimeFormat', TimeAgoPipe.DEFAULT_DATE_TIME_FORMAT);
    }

    transform(value: Date, locale?: string) {
        if (value !== null && value !== undefined) {
            const actualLocale = locale || this.defaultLocale;
            const diff = differenceInDays(new Date(), new Date(value));
            if (diff > 7) {
                const datePipe: DatePipe = new DatePipe(actualLocale);
                return datePipe.transform(value, this.defaultDateTimeFormat);
            } else {
                return formatDistance(new Date(value), new Date(), { addSuffix: true, locale: Locales[actualLocale] });
            }
        }
        return '';
    }
}
