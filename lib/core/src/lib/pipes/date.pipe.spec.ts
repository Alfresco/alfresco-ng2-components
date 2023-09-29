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

import { TestBed } from '@angular/core/testing';
import { ADFDatePipe } from './date.pipe';

describe('ADFDatePipe', () => {
    let datePipe: ADFDatePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ADFDatePipe]
        });
        datePipe = TestBed.inject(ADFDatePipe);
    });

    it('should return the formatted date string when given a valid date object', () => {
        const inputDate = new Date('2023-08-14');

        let dateFormat = 'DD-MM-YYYY';
        let expectedOutput = '14-08-2023';
        let result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'MM-DD-YYYY';
        expectedOutput = '08-14-2023';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'YYYY-MM-DD';
        expectedOutput = '2023-08-14';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'YYYY-DD-MM';
        expectedOutput = '2023-14-08';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'MM-DD-YY';
        expectedOutput = '08-14-23';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'DD-MM-YY';
        expectedOutput = '14-08-23';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);
    });

    it('should return the input value when given an invalid date object', () => {
        const inputDate = new Date('invalid');
        const dateFormat = 'DD-MM-YYYY';
        const expectedOutput = 'Invalid Date';

        const result = datePipe.transform(inputDate, dateFormat);

        expect(result).toBe(expectedOutput);
    });

    it('should return the formatted date string when given a valid date string', () => {
        const inputDate = '2023-08-14';

        let dateFormat = 'DD-MM-YYYY';
        let expectedOutput = '14-08-2023';
        let result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'MM-DD-YYYY';
        expectedOutput = '08-14-2023';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'YYYY-MM-DD';
        expectedOutput = '2023-08-14';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'YYYY-DD-MM';
        expectedOutput = '2023-14-08';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'MM-DD-YY';
        expectedOutput = '08-14-23';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);

        dateFormat = 'DD-MM-YY';
        expectedOutput = '14-08-23';
        result = datePipe.transform(inputDate, dateFormat);
        expect(result).toBe(expectedOutput);
    });

    it('should return the input value when given an invalid date string', () => {
        const inputDate = 'not_a_valid_date';
        const dateFormat = 'DD-MM-YYYY';
        const expectedOutput = inputDate;

        const result = datePipe.transform(inputDate, dateFormat);

        expect(result).toBe(expectedOutput);
    });
});
