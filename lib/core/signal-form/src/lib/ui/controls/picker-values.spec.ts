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

import { DateAdapter } from '@angular/material/core';
import { pickerDate, typedPickerValue } from './picker-values';

describe('picker values', () => {
    const createAdapter = (parsed: Date | null, valid: boolean): jasmine.SpyObj<DateAdapter<Date>> => {
        const adapter = jasmine.createSpyObj<DateAdapter<Date>>('DateAdapter', ['parse', 'isValid']);
        adapter.parse.and.returnValue(parsed);
        adapter.isValid.and.returnValue(valid);
        return adapter;
    };

    describe('typedPickerValue', () => {
        it('should read empty text as no value', () => {
            const typed = typedPickerValue(createAdapter(null, false), '   ', 'D-M-YYYY');

            expect(typed).toBeNull();
        });

        it('should read text the adapter parses as that date', () => {
            const day = new Date(2024, 2, 15);

            const typed = typedPickerValue(createAdapter(day, true), '15-3-2024', 'D-M-YYYY');

            expect(typed).toBe(day);
        });

        it('should hand the text and the format to the adapter', () => {
            const adapter = createAdapter(new Date(2024, 2, 15), true);

            typedPickerValue(adapter, '15-3-2024', 'D-M-YYYY');

            expect(adapter.parse).toHaveBeenCalledWith('15-3-2024', 'D-M-YYYY');
        });

        it('should read text the adapter cannot parse as an invalid date', () => {
            const typed = typedPickerValue(createAdapter(null, false), 'Ada', 'D-M-YYYY');

            const typedTime = typed?.getTime();

            expect(typedTime).toBeNaN();
        });

        it('should read text the adapter parses to an invalid date as an invalid date', () => {
            const typed = typedPickerValue(createAdapter(new Date(NaN), false), 'Byron', 'D-M-YYYY');

            const typedTime = typed?.getTime();

            expect(typedTime).toBeNaN();
        });
    });

    describe('pickerDate', () => {
        it('should show a valid date', () => {
            const day = new Date(2024, 2, 15);

            const shown = pickerDate(day);

            expect(shown).toBe(day);
        });

        it('should show no date for an invalid date', () => {
            const shown = pickerDate(new Date(NaN));

            expect(shown).toBeNull();
        });

        it('should show no date for text', () => {
            const shown = pickerDate('Ada');

            expect(shown).toBeNull();
        });

        it('should show no date for no value', () => {
            const shown = pickerDate(null);

            expect(shown).toBeNull();
        });
    });
});
