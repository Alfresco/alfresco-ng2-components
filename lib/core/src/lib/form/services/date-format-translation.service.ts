/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { format, parse } from 'date-fns';

@Injectable({
    providedIn: 'root'
})
export class DateFormatTranslationService {
    private momentToDateFnsMap = {
        M: 'M',
        D: 'd',
        Y: 'y',
        A: 'a'
    };

    private dateFnsToMomentMap = {
        M: 'M',
        d: 'D',
        y: 'Y',
        a: 'A'
    };

    convertMomentToDateFnsFormat(dateDisplayFormat: string): string {
        for (const [search, replace] of Object.entries(this.momentToDateFnsMap)) {
            dateDisplayFormat = dateDisplayFormat.replace(new RegExp(search, 'g'), replace);
        }
        return dateDisplayFormat;
    }

    convertDateFnsToMomentFormat(dateDisplayFormat: string): string {
        for (const [search, replace] of Object.entries(this.dateFnsToMomentMap)) {
            dateDisplayFormat = dateDisplayFormat.replace(new RegExp(search, 'g'), replace);
        }
        return dateDisplayFormat;
    }

    format(date: number|Date, dateFormat: string): string {
        return format(date, this.convertMomentToDateFnsFormat(dateFormat));
    }

    parse(value: string, dateFormat: string, date = new Date()): Date {
        return parse(value, this.convertMomentToDateFnsFormat(dateFormat), date);
    }
}
