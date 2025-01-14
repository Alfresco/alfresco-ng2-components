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

import { format, parse, parseISO, isValid, isBefore, isAfter } from 'date-fns';
import { ar, cs, da, de, enUS, es, fi, fr, it, ja, nb, nl, pl, ptBR, ru, sv, zhCN } from 'date-fns/locale';

const panDate = (num: number = 1): string => {
    let text = num.toString();
    while (text.length < 2) {
        text = '0' + text;
    }
    return text;
};

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

    private static momentToDateFnsMap = {
        D: 'd',
        Y: 'y',
        AZ: 'aa',
        A: 'a',
        ll: 'PP',
        T: `'T'`,
        ZZ: 'XX',
        Z: `XXX`
    };

    /**
     * Converts a Moment.js date format string to the equivalent date-fns format string.
     *
     * @param dateDisplayFormat - The Moment.js date format string to convert.
     * @returns The equivalent date-fns format string.
     */
    static convertMomentToDateFnsFormat(dateDisplayFormat: string): string {
        if (dateDisplayFormat && dateDisplayFormat.trim() !== '') {
            // normalise the input to support double conversion of the same string
            dateDisplayFormat = dateDisplayFormat.replace(`'T'`, 'T');

            for (const [search, replace] of Object.entries(this.momentToDateFnsMap)) {
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
     * @returns The formatted date as a string
     */
    static formatDate(date: number | Date | string, dateFormat: string): string {
        if (typeof date === 'string') {
            date = parseISO(date);
        }
        return format(date, this.convertMomentToDateFnsFormat(dateFormat));
    }

    /**
     * Parses a date string using the specified date format.
     *
     * @param value - The date value to parse. Can be a string or a Date (for generic calls)
     * @param dateFormat - The date format string to use for parsing.
     * @param options - Additional options
     * @param options.dateOnly - Strip the time and zone
     * @returns The parsed Date object.
     */
    static parseDate(value: string | Date, dateFormat: string, options?: { dateOnly?: boolean }): Date {
        if (value) {
            if (typeof value === 'string') {
                if (options?.dateOnly && value.includes('T')) {
                    value = value.split('T')[0];
                }

                return parse(value, this.convertMomentToDateFnsFormat(dateFormat), new Date());
            }
            return value;
        }
        return new Date('error');
    }

    /**
     * Parses a datetime string using the ISO format
     *
     * @param value - The date and time string to parse
     * @returns returns the parsed Date object
     */
    static parseDateTime(value: string): Date {
        return parseISO(value);
    }

    /**
     * Checks if the date string is a valid date according to the specified format
     *
     * @param dateValue Date value
     * @param dateFormat The date format
     * @returns `true` if the date is valid, otherwise `false`
     */
    static isValidDate(dateValue: string, dateFormat: string): boolean {
        if (dateValue) {
            const date = this.parseDate(dateValue, dateFormat);
            return isValid(date);
        }
        return false;
    }

    /**
     * Validates a date is before another one
     *
     * @param source source date to compare
     * @param target target date to compare
     * @returns `true` if the source date is before the target one, otherwise `false`
     */
    static isBeforeDate(source: Date, target: Date): boolean {
        return isBefore(source, target);
    }

    /**
     * Validates a date is after another one
     *
     * @param source source date to compare
     * @param target target date to compare
     * @returns `true` if the source date is after the target one, otherwise `false`
     */
    static isAfterDate(source: Date, target: Date): boolean {
        return isAfter(source, target);
    }

    static utcToLocal(date: Date): Date {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    }

    static localToUtc(date: Date): Date {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }

    static forceLocal(date: Date | string): Date {
        if (typeof date === 'string') {
            date = parseISO(date);
        }
        const localDate = `${date.getUTCFullYear()}-${panDate(date.getUTCMonth() + 1)}-${panDate(date.getUTCDate())}T00:00:00.000`;
        return new Date(localDate);
    }

    static forceUtc(date: Date | string): Date {
        if (typeof date === 'string') {
            date = parseISO(date);
        }
        const utcDate = `${date.getFullYear()}-${panDate(date.getMonth() + 1)}-${panDate(date.getDate())}T00:00:00.000Z`;
        return new Date(utcDate);
    }

    static stringDateContainsTimeZone(value: string): boolean {
        return /(Z|([+|-]\d\d:?\d\d))$/.test(value);
    }

    static getDate(value: string | number | Date): Date {
        let date = new Date(value);

        if (typeof value === 'string' && !DateFnsUtils.stringDateContainsTimeZone(value)) {
            date = this.utcToLocal(date);
        }

        return date;
    }
}
