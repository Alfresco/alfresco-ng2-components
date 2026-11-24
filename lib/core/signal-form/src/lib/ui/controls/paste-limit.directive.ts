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

import { DestroyRef, Directive, ElementRef, inject, input, output, Renderer2 } from '@angular/core';

const PASTE_INPUT_TYPE = 'insertFromPaste';

@Directive({ selector: 'input[adf-signal-paste-limit]' })
export class SignalPasteLimitDirective {
    readonly limit = input(0, { alias: 'adf-signal-paste-limit' });
    readonly pasteRefused = output<boolean>();

    private readonly element: HTMLInputElement = inject(ElementRef).nativeElement;
    private readonly renderer = inject(Renderer2);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        const stopGuardingPaste = this.renderer.listen(this.element, 'paste', (event: ClipboardEvent) => this.refuseTooLongPaste(event));
        const stopWatchingEdits = this.renderer.listen(this.element, 'input', (event: Event) => this.clearRefusalOnEdit(event));
        this.destroyRef.onDestroy(() => {
            stopGuardingPaste();
            stopWatchingEdits();
        });
    }

    private refuseTooLongPaste(event: ClipboardEvent): void {
        const limit = this.limit();
        if (!limit) {
            return;
        }
        const text = this.element.value;
        const replaced = (this.element.selectionEnd ?? text.length) - (this.element.selectionStart ?? text.length);
        const pasted = event.clipboardData?.getData('text') ?? '';
        const tooLong = text.length - replaced + pasted.length > limit;
        if (tooLong) {
            event.preventDefault();
        }
        this.pasteRefused.emit(tooLong);
    }

    private clearRefusalOnEdit(event: Event): void {
        if (!isPasteInput(event)) {
            this.pasteRefused.emit(false);
        }
    }
}

const isPasteInput = (event: Event): boolean => event instanceof InputEvent && event.inputType === PASTE_INPUT_TYPE;
