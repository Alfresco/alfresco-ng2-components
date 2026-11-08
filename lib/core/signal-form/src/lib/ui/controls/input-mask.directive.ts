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
import { applyInputMask } from './input-mask';

@Directive({ selector: 'input[adf-signal-input-mask]' })
export class SignalInputMaskDirective {
    readonly mask = input<string | null>(null, { alias: 'adf-signal-input-mask' });
    readonly reversed = input(false, { alias: 'adf-signal-input-mask-reversed', transform: booleanAttribute });

    private readonly element: HTMLInputElement = inject(ElementRef).nativeElement;

    constructor() {
        const stopMasking = inject(Renderer2).listen(this.element, 'input', () => this.maskTypedText(), { capture: true });
        inject(DestroyRef).onDestroy(stopMasking);
    }

    private maskTypedText(): void {
        const mask = this.mask();
        if (mask) {
            this.element.value = applyInputMask(this.element.value, mask, this.reversed());
        }
    }
}
