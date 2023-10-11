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

import { isValid } from 'date-fns';
import { DateFnsUtils } from './date-fns-utils';

describe('DateFnsUtils', () => {
    describe('convertMomentToDateFnsFormat', () => {
        it('should convert moment date format', () => {
            const dateFnsFormat = DateFnsUtils.convertMomentToDateFnsFormat('YYYY-MM-DD');
            expect(dateFnsFormat).toBe('yyyy-MM-dd');
        });

        it('should convert moment datetime format', () => {
            const dateFnsFormat = DateFnsUtils.convertMomentToDateFnsFormat('YYYY-MM-DDTHH:mm:ssZ');
            expect(dateFnsFormat).toBe(`yyyy-MM-dd'T'HH:mm:ss'Z'`);
        });
    });


    it('should format a date correctly', () => {
        const date = new Date('2023-09-22T12:00:00Z');
        const dateFormat = 'yyyy-MM-dd';
        const expectedFormattedDate = '2023-09-22';

        const result = DateFnsUtils.formatDate(date, dateFormat);

        expect(result).toBe(expectedFormattedDate);
    });

    it('should parse datetime', () => {
        const parsed = DateFnsUtils.parseDate(
            '09-02-9999 09:10 AM',
            'dd-MM-yyyy hh:mm aa'
        );
        expect(isValid(parsed));
        expect(parsed.toISOString()).toBe('9999-02-09T09:10:00.000Z');
    });

    it('should format datetime with custom moment format', () => {
        const parsed = DateFnsUtils.formatDate(
            new Date('9999-12-30T10:30:00.000Z'),
            'MM-DD-YYYY HH:mm A'
        );
        expect(parsed).toBe('12-30-9999 10:30 AM');
    });

    it('should parse moment datetime ISO', () => {
        const parsed = DateFnsUtils.parseDate(
            '1982-03-13T10:00:00Z',
            'YYYY-MM-DDTHH:mm:ssZ'
        );
        expect(parsed.toISOString()).toBe('1982-03-13T10:00:00.000Z');
    });

    it('should parse a date correctly', () => {
        const dateString = '2023-09-22';
        const dateFormat = 'yyyy-MM-dd';
        const expectedParsedDate = new Date('2023-09-22T00:00:00Z');

        const result = DateFnsUtils.parseDate(dateString, dateFormat);
        expect(result).toEqual(expectedParsedDate);
    });

    it('should format ISO datetime from date', () => {
        const result = DateFnsUtils.formatDate(
            new Date('2023-10-10T18:28:50.082Z'),
            `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`
        );
        expect(result).toBe('2023-10-10T18:28:50.082Z');
    });

    it('should format ISO datetime from string', () => {
        const result = DateFnsUtils.formatDate(
            '2023-10-10T18:28:50.082Z',
            `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`
        );
        expect(result).toBe('2023-10-10T18:28:50.082Z');
    });
});
