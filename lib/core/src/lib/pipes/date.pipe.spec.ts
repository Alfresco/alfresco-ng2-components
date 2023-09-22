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
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from './date.pipe';
import { DateFormatTranslationService } from '../form/public-api';

describe('DatePipe', () => {
    let datePipe: DatePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), CoreTestingModule],
            providers: [DatePipe, DateFormatTranslationService]
        });
        datePipe = TestBed.inject(DatePipe);
    });

    it('should return the formatted date string when given a valid date object', () => {
        const inputDate = new Date('2023-08-14');
        const dateFormat = 'DD-MM-YYYY';
        const expectedOutput = '14-08-2023';

        const result = datePipe.transform(inputDate, dateFormat);

        expect(result).toBe(expectedOutput);
    });

    it('should return the input value when given an invalid date object', () => {
        const inputDate = new Date('invalid');
        const dateFormat = 'DD-MM-YYYY';
        const expectedOutput = inputDate.toString();

        const result = datePipe.transform(inputDate, dateFormat);

        expect(result).toBe(expectedOutput);
    });

    it('should return the formatted date string when given a valid date string', () => {
        const inputDate = '2023-08-14';
        const dateFormat = 'DD-MM-YYYY';
        const expectedOutput = '14-08-2023';

        const result = datePipe.transform(inputDate, dateFormat);

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
