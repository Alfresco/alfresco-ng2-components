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
import { DateTimePipe } from './date-time.pipe';
import { addMinutes, isValid } from 'date-fns';

describe('DateTimePipe', () => {
    let pipe: DateTimePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), CoreTestingModule],
            providers: [DateTimePipe]
        });

        pipe = new DateTimePipe();
    });

    it('should transform string input to date format', () => {
        const value = '2023-08-24 12:00:00';
        const dateFormat = 'yyyy-MM-dd HH:mm:ss';
        const transformedDate = pipe.transform(value, dateFormat);
        expect(transformedDate instanceof Date).toBe(true);
        expect(isValid(transformedDate)).toBe(true);

        const expectedDate = new Date(value);
        expect(transformedDate).toEqual(addMinutes(new Date(expectedDate), new Date().getTimezoneOffset()));
    });

    it('should transform Date input', () => {
        const value = new Date(2023, 7, 24, 12, 0, 0);
        const dateFormat = 'yyyy-MM-dd HH:mm:ss';
        const transformedDate = pipe.transform(value, dateFormat);
        expect(transformedDate instanceof Date).toBe(true);
        expect(isValid(transformedDate)).toBe(true);

        expect(transformedDate).toEqual(value);
    });

    it('should transform number input to date format', () => {
        const value = 1693373300; // 30 August 2023 10:58:20
        const dateFormat = 'yyyy-MM-dd HH:mm:ss';
        const transformedDate = pipe.transform(value, dateFormat);
        expect(transformedDate instanceof Date).toBe(true);
        expect(isValid(transformedDate)).toBe(true);

        const originalDate = new Date(2023, 7, 30, 10, 58, 20);
        const timeZoneOffsetMinutes = -330; // 5 hours * 60 minutes/hour + 30 minutes
        const expectedDate = addMinutes(originalDate, timeZoneOffsetMinutes);

        expect(transformedDate).toEqual(expectedDate);
    });
});
