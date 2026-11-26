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

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputMaskDirective } from './text-mask.component';

@Component({
    imports: [InputMaskDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<input [textMask]="settings" />`
})
class MaskedInputHostComponent {
    settings = { mask: '(000) 000-0000', isReversed: false };
}

describe('InputMaskDirective', () => {
    let fixture: ComponentFixture<MaskedInputHostComponent>;
    let input: HTMLInputElement;

    const type = (text: string, caret = text.length) => {
        input.value = text;
        input.setSelectionRange(caret, caret);
        input.dispatchEvent(new Event('input'));
    };

    beforeEach(() => {
        fixture = TestBed.createComponent(MaskedInputHostComponent);
        fixture.detectChanges();
        input = fixture.nativeElement.querySelector('input');
        input.focus();
    });

    it('should format typed digits with the mask', () => {
        type('1234567890');

        expect(input.value).toBe('(123) 456-7890');
    });

    it('should keep the caret where the user edits in the middle of the text', () => {
        type('1234567890');

        type('(12) 456-7890', 3);

        expect(input.value).toBe('(124) 567-890');
        expect(input.selectionStart).toBe(3);
        expect(input.selectionEnd).toBe(3);
    });

    it('should move the caret past the mask characters it adds', () => {
        type('123', 3);

        expect(input.value).toBe('(123');
        expect(input.selectionStart).toBe(4);
    });

    it('should keep the caret next to the same characters for a reversed mask', () => {
        fixture.componentInstance.settings = { mask: '#.##0,00', isReversed: true };
        fixture.detectChanges();

        type('1234567', 3);

        expect(input.value).toBe('12.345,67');
        expect(input.selectionStart).toBe(4);
    });

    it('should not touch the caret when the input is not focused', () => {
        input.blur();
        input.value = '1234567890';
        input.setSelectionRange(0, 0);
        input.dispatchEvent(new Event('input'));

        expect(input.value).toBe('(123) 456-7890');
        expect(input.selectionStart).not.toBe(4);
    });

    it('should leave the text alone when there is no mask', () => {
        fixture.componentInstance.settings = { mask: '', isReversed: false };
        fixture.detectChanges();

        type('abc123');

        expect(input.value).toBe('abc123');
    });
});
