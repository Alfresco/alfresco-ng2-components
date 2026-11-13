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

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { typeInto } from '../testing/widget-testing.mock';
import { SignalInputMaskDirective } from './input-mask.directive';

@Component({
    selector: 'adf-signal-input-mask-host',
    template: `<input
        [adf-signal-input-mask]="mask()"
        [adf-signal-input-mask-reversed]="reversed()"
        (input)="seen.set(maskedInput.value)"
        #maskedInput
    />`,
    imports: [SignalInputMaskDirective]
})
class SignalInputMaskHostComponent {
    readonly mask = signal<string | null>('(000) 000-0000');
    readonly reversed = signal(false);
    readonly seen = signal('');
}

describe('SignalInputMaskDirective', () => {
    const render = () => {
        const fixture = TestBed.createComponent(SignalInputMaskHostComponent);
        fixture.detectChanges();
        return { fixture, host: fixture.componentInstance, input: fixture.nativeElement.querySelector('input') as HTMLInputElement };
    };

    it('should mask the typed text before the input listeners read it', () => {
        const { host, input } = render();

        typeInto(input, '12a34567890');

        expect(input.value).toBe('(123) 456-7890');
        expect(host.seen()).toBe('(123) 456-7890');
    });

    it('should fill a reversed mask from the right', () => {
        const { fixture, host, input } = render();
        host.mask.set('#.##0,00%');
        host.reversed.set(true);
        fixture.detectChanges();

        typeInto(input, '1234');

        expect(host.seen()).toBe('12,34%');
    });

    const editAt = (input: HTMLInputElement, text: string, caret: number) => {
        input.value = text;
        input.setSelectionRange(caret, caret);
        input.dispatchEvent(new Event('input'));
    };

    it('should keep the caret next to the same digits when the text is edited in the middle', () => {
        const { input } = render();
        input.focus();

        editAt(input, '(123) 4956-7890', 8);

        expect(input.value).toBe('(123) 495-6789');
        expect(input.selectionStart).toBe(8);
    });

    it('should keep the caret before the same digits for a reversed mask', () => {
        const { fixture, host, input } = render();
        host.mask.set('#.##0,00%');
        host.reversed.set(true);
        fixture.detectChanges();
        input.focus();

        editAt(input, '1.234,5%', 6);

        expect(input.value).toBe('123,45%');
        expect(input.selectionStart).toBe(5);
    });

    it('should not move the caret of an input without focus', () => {
        const { input } = render();
        const moveCaret = spyOn(input, 'setSelectionRange').and.callThrough();

        typeInto(input, '1234');

        expect(input.value).toBe('(123) 4');
        expect(moveCaret).not.toHaveBeenCalled();
    });

    it('should leave the text as typed without a mask', () => {
        const { fixture, host, input } = render();
        host.mask.set(null);
        fixture.detectChanges();

        typeInto(input, '12a34');

        expect(host.seen()).toBe('12a34');
    });
});
