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

import { applyInputMask, maskedCaretPosition } from './input-mask';

describe('applyInputMask', () => {
    it('should drop the characters the mask rejects', () => {
        expect(applyInputMask('F', '##-##0,00%')).toBe('');
        expect(applyInputMask('1', '##-##0,00%')).toBe('1');
    });

    it('should add the mask literals as the text fills the mask', () => {
        expect(applyInputMask('12345678', '##-##0,00%')).toBe('12-345,67%');
        expect(applyInputMask('5551234567', '(000) 000-0000')).toBe('(555) 123-4567');
    });

    it('should fill a reversed mask from the right', () => {
        expect(applyInputMask('1234', '#.##0,00%', true)).toBe('12,34%');
    });

    it('should accept letters only where the mask allows them', () => {
        expect(applyInputMask('ab12', 'SS-00')).toBe('ab-12');
        expect(applyInputMask('1b', 'SS')).withContext('a rejected character is skipped, the rest still fills the mask').toBe('b');
        expect(applyInputMask('a1', 'AA')).toBe('a1');
    });

    it('should fill an optional digit only while digits are typed, and drop what goes beyond the mask', () => {
        expect(applyInputMask('1', '990')).toBe('1');
        expect(applyInputMask('1234', '990')).toBe('123');
    });

    it('should repeat a group of digits as many times as the text needs', () => {
        expect(applyInputMask('12345678', '#.##0')).toBe('1.234');
        expect(applyInputMask('1234567', '#,##0', true)).toBe('1,234,567');
    });

    it('should keep a literal typed where the mask has one', () => {
        expect(applyInputMask('5(5', '(000)')).toBe('(55');
        expect(applyInputMask('12-3', '00-00')).toBe('12-3');
    });

    it('should add a trailing literal once the text fills the mask', () => {
        expect(applyInputMask('55', '000-')).toBe('55');
        expect(applyInputMask('555', '000-')).toBe('555-');
    });
});

describe('maskedCaretPosition', () => {
    const phone = '(000) 000-0000';
    const amount = '#.##0,00%';

    it('should keep the caret after the same characters when a digit is typed in the middle', () => {
        expect(maskedCaretPosition('(123) 4956-7890', 8, phone)).toBe(8);
    });

    it('should keep the caret where it was when the mask rejects the typed character', () => {
        expect(maskedCaretPosition('(123) 4x56-7890', 8, phone)).toBe(7);
    });

    it('should keep the caret after the same characters when one is deleted in the middle', () => {
        expect(maskedCaretPosition('(12) 456-7890', 3, phone)).toBe(3);
    });

    it('should move the caret past the literals the mask adds before the typed character', () => {
        expect(maskedCaretPosition('(1234) 456-7890', 5, phone)).toBe(7);
    });

    it('should put the caret at the end of the masked text when it was at the end', () => {
        expect(maskedCaretPosition('(123) 456-78901', 15, phone)).toBe(14);
        expect(maskedCaretPosition('1234', 4, amount, true)).toBe(6);
    });

    it('should keep the caret before the same characters for a reversed mask', () => {
        expect(maskedCaretPosition('1.234,5%', 6, amount, true)).toBe(5);
        expect(maskedCaretPosition('1.2345,67%', 6, amount, true)).toBe(6);
    });
});
