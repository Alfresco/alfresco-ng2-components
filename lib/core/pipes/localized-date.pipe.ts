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
import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';

@Pipe({
    name: 'adfLocalizedDate',
    pure: false
})
export class LocalizedDatePipe implements PipeTransform {

    static DEFAULT_LOCALE = 'en-US';
    static DEFAULT_DATE_TIME_FORMAT = 'medium';

    defaultLocale: string;
    defaultFormat: string;

    constructor(private appConfig: AppConfigService) {
        this.defaultLocale = this.appConfig.get<string>('dateValues.defaultLocale', LocalizedDatePipe.DEFAULT_LOCALE);
        this.defaultFormat = this.appConfig.get<string>('dateValues.defaultFormat', LocalizedDatePipe.DEFAULT_DATE_TIME_FORMAT);
    }

    transform(value: any, format?: string, locale?: string): any {
        const actualFormat = format || this.defaultFormat;
        const actualLocale = locale || this.defaultLocale;
        const datePipe: DatePipe = new DatePipe(actualLocale);
        return datePipe.transform(value, actualFormat);
    }

}
