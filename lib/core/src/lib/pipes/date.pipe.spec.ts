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

    it('should transform a valid date string into a Date object', () => {
        const testDates = [
            { dateString: '2023-10-05', dateFormat: 'yyyy-MM-dd' },
            { dateString: '2023-10-5', dateFormat: 'yyyy-M-d' },
            { dateString: '05-10-2023', dateFormat: 'dd-MM-yyyy' },
            { dateString: '5-10-2023', dateFormat: 'd-M-yyyy' },
            { dateString: '10-5-2023', dateFormat: 'M-d-yyyy' },
            { dateString: '10-05-2023', dateFormat: 'MM-d-yyyy' }
        ];
        testDates.forEach(({ dateString, dateFormat }) => {
            const transformedDate = datePipe.transform(dateString, dateFormat);

            expect(transformedDate instanceof Date).toBe(true);
            expect(transformedDate.getFullYear()).toBe(2023);
            expect(transformedDate.getMonth()).toBe(9); // October is 9 (0-based)
            expect(transformedDate.getDate()).toBe(5);
        });
    });

    it('should transform a valid date object into a Date object', () => {
        const testDates = [
            { dateString: new Date(), dateFormat: 'yyyy-MM-dd' },
            { dateString: new Date(), dateFormat: 'yyyy-M-d' },
            { dateString: new Date(), dateFormat: 'dd-MM-yyyy' },
            { dateString: new Date(), dateFormat: 'd-M-yyyy' },
            { dateString: new Date(), dateFormat: 'M-d-yyyy' },
            { dateString: new Date(), dateFormat: 'MM-d-yyyy' }
        ];

        testDates.forEach(({ dateString, dateFormat }) => {
            const transformedDate = datePipe.transform(dateString, dateFormat);
            const today = new Date();

            expect(transformedDate instanceof Date).toBe(true);
            expect(transformedDate.getFullYear()).toBe(today.getFullYear());
            expect(transformedDate.getMonth()).toBe(today.getMonth()); // October is 9 (0-based)
            expect(transformedDate.getDate()).toBe(today.getDate());
        });
    });

    it('should handle undefined input by returning the current date', () => {
        const undefinedInput = undefined;
        const dateFormat = 'dd-MM-yyyy';

        const transformedDate = datePipe.transform(undefinedInput, dateFormat);
        const today = new Date();

        expect(transformedDate instanceof Date).toBe(true);
        expect(transformedDate).toEqual(today);
    });
});
