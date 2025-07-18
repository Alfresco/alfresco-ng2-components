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

import { Pipe, PipeTransform } from '@angular/core';
import { addMinutes, fromUnixTime, parse } from 'date-fns';

@Pipe({
    name: 'adfDateTime'
})
export class DateTimePipe implements PipeTransform {
    transform(value: string | Date | number, dateFormat: string): Date {
        let parsedValue: Date;

        if (typeof value === 'string') {
            parsedValue = parse(value, dateFormat, new Date());
        } else if (value instanceof Date) {
            parsedValue = value;
        } else {
            parsedValue = fromUnixTime(value);
        }

        const offsetMinutes = parsedValue.getTimezoneOffset();
        const adjustedDate = addMinutes(parsedValue, offsetMinutes);
        return adjustedDate;
    }
}
