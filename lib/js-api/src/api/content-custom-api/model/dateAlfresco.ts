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

export class DateAlfresco extends Date {
    /**
     * Parses an ISO-8601 string representation of a date value.
     * @param  dateToConvert The date value as a string.
     * @returns  The parsed date object.
     */
    static parseDate(dateToConvert: any): Date {
        if (dateToConvert instanceof Date) {
            return dateToConvert;
        } else if (typeof dateToConvert === 'number') {
            return new Date(dateToConvert);
        }

        const dateLength = 10;
        const separatorPos = dateToConvert.substring(dateLength).search(/[+-]/) + dateLength;
        const dateStr = separatorPos > dateLength ? dateToConvert.substring(0, separatorPos) : dateToConvert;
        const tzStr = separatorPos > dateLength ? dateToConvert.substring(separatorPos) : '';
        const parsedDate = this.parseDateTime(dateStr);
        const tzOffsetMins = this.parseDateTimeZone(tzStr);
        parsedDate.setTime(parsedDate.getTime() + tzOffsetMins * 60000);
        return parsedDate;
    }

    /**
     * Parses the date component of a ISO-8601 string representation of a date value.
     * @param dateToConvert The date value as a string.
     * @returns The parsed date object.
     */
    static parseDateTime(dateToConvert: string): Date {
        // TODO: review when Safari 10 is released
        // return new Date(str.replace(/T/i, ' '));

        // Compatible with Safari 9.1.2
        const dateParts = dateToConvert.split(/[^0-9]/).map(function (s) {
            return parseInt(s, 10);
        });
        return new Date(
            Date.UTC(
                dateParts[0],
                dateParts[1] - 1 || 0,
                dateParts[2] || 1,
                dateParts[3] || 0,
                dateParts[4] || 0,
                dateParts[5] || 0,
                dateParts[6] || 0
            )
        );
    }

    /**
     * Parses the timezone component of a ISO-8601 string representation of a date value.
     * @param dateToConvert The timezone offset as a string, e.g. '+0000', '+2000' or '-0500'.
     * @returns The number of minutes offset from UTC.
     */
    static parseDateTimeZone(dateToConvert: string): number {
        const match = /([+-])(\d{2}):?(\d{2})?/.exec(dateToConvert);
        if (match !== null) {
            return parseInt(match[1] + '1', 10) * -1 * (parseInt(match[2], 10) * 60) + parseInt(match[3] || '0', 10);
        } else {
            return 0;
        }
    }
}
