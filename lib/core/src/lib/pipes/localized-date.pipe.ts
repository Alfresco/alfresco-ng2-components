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

import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { UserPreferencesService } from '../common/services/user-preferences.service';

@Pipe({
    standalone: true,
    name: 'adfLocalizedDate',
    pure: false
})
export class LocalizedDatePipe implements PipeTransform {
    static DEFAULT_LOCALE = 'en-US';
    static DEFAULT_DATE_FORMAT = 'mediumDate';

    defaultFormat: string = LocalizedDatePipe.DEFAULT_DATE_FORMAT;

    constructor(
        public userPreferenceService?: UserPreferencesService,
        public appConfig?: AppConfigService
    ) {
        if (this.appConfig) {
            this.defaultFormat = this.appConfig.get<string>('dateValues.defaultDateFormat', LocalizedDatePipe.DEFAULT_DATE_FORMAT);
        }
    }

    transform(value: Date | string | number, format?: string, locale?: string, timezone?: string): string {
        const actualFormat = format || this.defaultFormat;
        // Use signal directly - no subscription needed!
        const defaultLocale = this.userPreferenceService?.localeSignal() || LocalizedDatePipe.DEFAULT_LOCALE;
        const actualLocale = locale || defaultLocale;
        const datePipe = timezone ? new DatePipe(actualLocale, timezone) : new DatePipe(actualLocale);
        return datePipe.transform(value, actualFormat);
    }
}
