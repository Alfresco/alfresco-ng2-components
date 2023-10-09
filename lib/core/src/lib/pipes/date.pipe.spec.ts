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

    const dateFormats = [
        { dateFormat: 'yyyy-MM-dd' },
        { dateFormat: 'yyyy-M-d' },
        { dateFormat: 'dd-MM-yyyy' },
        { dateFormat: 'd-M-yyyy' },
        { dateFormat: 'M-d-yyyy' },
        { dateFormat: 'MM-d-yyyy' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ADFDatePipe]
        });
        datePipe = TestBed.inject(ADFDatePipe);
    });

    it('should transform a valid date string into a Date object', () => {
        const inputDate = '2023-10-05';

        dateFormats.forEach(({ dateFormat }) => {
            const transformedDate = datePipe.transform(inputDate, dateFormat);

            expect(transformedDate instanceof Date).toBe(true);
        });
    });

    it('should transform a valid date object into a Date object', () => {
        const inputDate = new Date('2023-10-05');

        dateFormats.forEach(({ dateFormat }) => {
            const transformedDate = datePipe.transform(inputDate, dateFormat);

            expect(transformedDate instanceof Date).toBe(true);
        });
    });
});
