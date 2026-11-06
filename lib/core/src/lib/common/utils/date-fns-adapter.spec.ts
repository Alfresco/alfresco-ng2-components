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
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { isValid } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { UserPreferencesService } from '../services/user-preferences.service';
import { AdfDateFnsAdapter } from './date-fns-adapter';

describe('AdfDateFnsAdapter', () => {
    let adapter: AdfDateFnsAdapter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MAT_DATE_LOCALE, useValue: enUS },
                { provide: UserPreferencesService, useValue: { localeSignal: signal<string>(null) } }
            ]
        });
        adapter = TestBed.inject(AdfDateFnsAdapter);
    });

    it('should parse a text in the display format', () => {
        expect(adapter.parse('15-03-2024', 'dd-MM-yyyy')).toEqual(new Date(2024, 2, 15));
    });

    it('should keep a valid date', () => {
        const date = new Date(2024, 2, 15);

        expect(adapter.parse(date, 'dd-MM-yyyy')).toEqual(date);
    });

    it('should give no date for no value', () => {
        expect(adapter.parse(null, 'dd-MM-yyyy')).toBeNull();
    });

    it('should give an invalid date for an invalid date, without parsing it as text', () => {
        expect(isValid(adapter.parse(new Date(NaN), 'dd-MM-yyyy'))).toBeFalse();
    });
});
