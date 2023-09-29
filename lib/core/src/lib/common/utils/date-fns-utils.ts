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

import { format, parse } from 'date-fns';
import { ar, cs, da, de, enUS, es, fi, fr, it, ja, nb, nl, pl, ptBR, ru, sv, zhCN } from 'date-fns/locale';

export class DateFnsUtils {
    static getLocaleFromString(locale: string): Locale {
        let dateFnsLocale: Locale;
        switch (locale) {
            case 'ar':
                dateFnsLocale = ar;
                break;
            case 'cs':
                dateFnsLocale = cs;
                break;
            case 'da':
                dateFnsLocale = da;
                break;
            case 'de':
                dateFnsLocale = de;
                break;
            case 'en':
                dateFnsLocale = enUS;
                break;
            case 'es':
                dateFnsLocale = es;
                break;
            case 'fi':
                dateFnsLocale = fi;
                break;
            case 'fr':
                dateFnsLocale = fr;
                break;
            case 'it':
                dateFnsLocale = it;
                break;
            case 'ja':
                dateFnsLocale = ja;
                break;
            case 'nb':
                dateFnsLocale = nb;
                break;
            case 'nl':
                dateFnsLocale = nl;
                break;
            case 'pl':
                dateFnsLocale = pl;
                break;
            case 'pt-BR':
                dateFnsLocale = ptBR;
                break;
            case 'ru':
                dateFnsLocale = ru;
                break;
            case 'sv':
                dateFnsLocale = sv;
                break;
            case 'zh-CN':
                dateFnsLocale = zhCN;
                break;
            default:
                dateFnsLocale = enUS;
                break;
        }
        return dateFnsLocale;
    }

    /**
     * A mapping of Moment.js format tokens to date-fns format tokens.
     */
    static momentToDateFnsMap = {
        D: 'd',
        Y: 'y',
        A: 'a',
        Z: 'XXX',
        T: `'T'`
    };

    /**
     * A mapping of date-fns format tokens to Moment.js format tokens.
     */
    static dateFnsToMomentMap = {
        d: 'D',
        y: 'Y',
        a: 'A',
        xxx: 'Z'
    };

    /**
     * Converts a Moment.js date format string to the equivalent date-fns format string.
     *
     * @param dateDisplayFormat - The Moment.js date format string to convert.
     * @returns The equivalent date-fns format string.
     */
    static convertMomentToDateFnsFormat(dateDisplayFormat: string): string {
        // Check if 'A' is present in the format string
        const containsA = dateDisplayFormat.includes('A');

        // Replace 'HH' with 'hh' if 'A' is also present
        if (containsA) {
            dateDisplayFormat = dateDisplayFormat.replace(/HH/g, 'hh');
        }

        if (dateDisplayFormat && dateDisplayFormat.trim() !== '') {
            for (const [search, replace] of Object.entries(this.momentToDateFnsMap)) {
                dateDisplayFormat = dateDisplayFormat.replace(new RegExp(search, 'g'), replace);
            }
            return dateDisplayFormat;
        }
        return '';
    }

    /**
     * Converts a date-fns date format string to the equivalent Moment.js format string.
     *
     * @param dateDisplayFormat - The date-fns date format string to convert.
     * @returns The equivalent Moment.js format string.
     */
    static convertDateFnsToMomentFormat(dateDisplayFormat: string): string {
        if (dateDisplayFormat && dateDisplayFormat.trim() !== '') {
            for (const [search, replace] of Object.entries(this.dateFnsToMomentMap)) {
                dateDisplayFormat = dateDisplayFormat.replace(new RegExp(search, 'g'), replace);
            }
            return dateDisplayFormat;
        }
        return '';
    }

    /**
     * Formats a date using the specified date format.
     *
     * @param date - The date to format, can be a number or a Date object.
     * @param dateFormat - The date format string to use for formatting.
     * @returns The formatted date as a string.
     */
    static formatDate(date: number | Date, dateFormat: string): string {
        return format(date, this.convertMomentToDateFnsFormat(dateFormat));
    }

    /**
     * Parses a date string using the specified date format.
     *
     * @param value - The date string to parse.
     * @param dateFormat - The date format string to use for parsing.
     * @returns The parsed Date object.
     */
    static parseDate(value: string, dateFormat: string): Date {
        return parse(value, this.convertMomentToDateFnsFormat(dateFormat), new Date());
    }

    /**
     * Adds seconds to a date time value represented as a string in the format 'YYYY-MM-DDTHH:mm:ssZ'.
     *
     * @param value - The input time value to which seconds will be added.
     * @returns - A string representing the input date time value with seconds added.
     */
    static addSeconds(value: string): string {
        const colonIndex: number = value.lastIndexOf(':');
        const updatedValue = value.slice(0, colonIndex) + ':' + value.slice(colonIndex + 1);
        const dateParts: string[] = updatedValue.split(':');
        dateParts[2] = '00.' + dateParts[2];
        value = dateParts.join(':');
        return value;
    }
}
