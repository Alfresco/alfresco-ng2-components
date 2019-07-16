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

import moment from 'moment-es6';
import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { UserPreferenceValues, UserPreferencesService } from '../services/user-preferences.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
    name: 'adfTimeAgo'
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {

    static DEFAULT_LOCALE = 'en-US';
    static DEFAULT_DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';

    defaultLocale: string;
    defaultDateTimeFormat: string;

    private onDestroy$ = new Subject<boolean>();

    constructor(public userPreferenceService: UserPreferencesService,
                public appConfig: AppConfigService) {
        this.userPreferenceService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => {
                this.defaultLocale = locale || TimeAgoPipe.DEFAULT_LOCALE;
            });
        this.defaultDateTimeFormat = this.appConfig.get<string>('dateValues.defaultDateTimeFormat', TimeAgoPipe.DEFAULT_DATE_TIME_FORMAT);
    }

    transform(value: Date, locale?: string) {
        if (value !== null && value !== undefined ) {
            const actualLocale = locale || this.defaultLocale;
            const then = moment(value);
            const diff = moment().locale(actualLocale).diff(then, 'days');
            if ( diff > 7) {
                const datePipe: DatePipe = new DatePipe(actualLocale);
                return datePipe.transform(value, this.defaultDateTimeFormat);
            } else {
                return then.locale(actualLocale).fromNow();
            }
        }
        return '';
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
