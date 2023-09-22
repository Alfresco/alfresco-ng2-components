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
import { DateFormatTranslationService } from './date-format-translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { CoreTestingModule } from '../../testing/core.testing.module';

describe('DateFormatTranslationService', () => {
    let service: DateFormatTranslationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), CoreTestingModule],
            providers: [DateFormatTranslationService]
        });

        service = TestBed.inject(DateFormatTranslationService);
    });

    it('should convert moment to date-fns format correctly', () => {
        const momentFormat = 'YYYY-MM-DD';
        const expectedDateFnsFormat = 'yyyy-MM-dd';

        const result = service.convertMomentToDateFnsFormat(momentFormat);

        expect(result).toBe(expectedDateFnsFormat);
    });

    it('should convert date-fns to moment format correctly', () => {
        const dateFnsFormat = 'yyyy-MM-dd';
        const expectedMomentFormat = 'YYYY-MM-DD';

        const result = service.convertDateFnsToMomentFormat(dateFnsFormat);

        expect(result).toBe(expectedMomentFormat);
    });

    it('should format a date correctly', () => {
        const date = new Date('2023-09-22T12:00:00Z');
        const dateFormat = 'yyyy-MM-dd';
        const expectedFormattedDate = '2023-09-22';

        const result = service.format(date, dateFormat);

        expect(result).toBe(expectedFormattedDate);
    });

    it('should parse a date correctly', () => {
        const dateString = '2023-09-22';
        const dateFormat = 'yyyy-MM-dd';
        const expectedParsedDate = new Date('2023-09-22T00:00:00Z');

        const result = service.parse(dateString, dateFormat);

        expect(result).toEqual(expectedParsedDate);
    });
});
