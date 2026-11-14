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

import { booleanAttribute, DestroyRef, Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { applyInputMask, maskedCaretPosition } from './input-mask';

@Directive({ selector: 'input[adf-signal-input-mask]' })
export class SignalInputMaskDirective {
    readonly mask = input<string | null>(null, { alias: 'adf-signal-input-mask' });
    readonly reversed = input(false, { alias: 'adf-signal-input-mask-reversed', transform: booleanAttribute });

    private readonly element: HTMLInputElement = inject(ElementRef).nativeElement;
    private readonly renderer = inject(Renderer2);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        const stopMasking = this.renderer.listen(this.element, 'input', () => this.maskTypedText(), { capture: true });
        this.destroyRef.onDestroy(stopMasking);
    }

    private maskTypedText(): void {
        const mask = this.mask();
        if (!mask) {
            return;
        }
        const text = this.element.value;
        const masked = applyInputMask(text, mask, this.reversed());
        if (masked === text) {
            return;
        }
        const caret = this.element.selectionStart;
        this.element.value = masked;
        if (this.isFocused() && caret !== null) {
            const position = maskedCaretPosition(text, caret, mask, this.reversed());
            this.element.setSelectionRange(position, position);
        }
    }

    private isFocused(): boolean {
        return this.element.ownerDocument.activeElement === this.element;
    }
}
