/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { isValid } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { UserPreferencesService } from '../services/user-preferences.service';
import { AdfDateFnsAdapter } from './date-fns-adapter';
import { AdfDateTimeFnsAdapter } from './datetime-fns-adapter';

describe('AdfDateTimeFnsAdapter', () => {
    const dateTimeFormat = 'dd-MM-yyyy HH:mm';
    let adapter: AdfDateTimeFnsAdapter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MAT_DATE_LOCALE, useValue: enUS },
                { provide: DateAdapter, useExisting: AdfDateFnsAdapter },
                { provide: UserPreferencesService, useValue: { localeSignal: signal<string>(null) } }
            ]
        });
        adapter = TestBed.inject(AdfDateTimeFnsAdapter);
    });

    it('should parse a text in the format', () => {
        expect(adapter.parse('15-03-2024 10:30', dateTimeFormat)).toEqual(new Date(2024, 2, 15, 10, 30));
    });

    it('should give an invalid date for a date text not in the format', () => {
        expect(isValid(adapter.parse('2024-03-15', dateTimeFormat))).toBeFalse();
    });

    it('should keep a valid date', () => {
        const date = new Date(2024, 2, 15, 10, 30);

        expect(adapter.parse(date, dateTimeFormat)).toEqual(date);
    });

    it('should give no date for no value', () => {
        expect(adapter.parse(null, dateTimeFormat)).toBeNull();
    });
});
