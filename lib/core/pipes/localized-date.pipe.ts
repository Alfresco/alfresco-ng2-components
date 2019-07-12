/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { UserPreferencesService, UserPreferenceValues } from '../services/user-preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
    name: 'adfLocalizedDate',
    pure: false
})
export class LocalizedDatePipe implements PipeTransform, OnDestroy {

    static DEFAULT_LOCALE = 'en-US';
    static DEFAULT_DATE_FORMAT = 'mediumDate';

    defaultLocale: string = LocalizedDatePipe.DEFAULT_LOCALE;
    defaultFormat: string = LocalizedDatePipe.DEFAULT_DATE_FORMAT;

    private onDestroy$ = new Subject<boolean>();

    constructor(public userPreferenceService?: UserPreferencesService,
                public appConfig?: AppConfigService) {

        if (this.userPreferenceService) {
            this.userPreferenceService
                .select(UserPreferenceValues.Locale)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(locale => {
                    if (locale) {
                        this.defaultLocale = locale;
                    }
                });
        }

        if (this.appConfig) {
            this.defaultFormat = this.appConfig.get<string>('dateValues.defaultDateFormat', LocalizedDatePipe.DEFAULT_DATE_FORMAT);
        }
    }

    transform(value: any, format?: string, locale?: string): any {
        const actualFormat = format || this.defaultFormat;
        const actualLocale = locale || this.defaultLocale;
        const datePipe: DatePipe = new DatePipe(actualLocale);
        return datePipe.transform(value, actualFormat);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

}
