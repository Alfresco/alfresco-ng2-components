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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalPasteLimitDirective } from './paste-limit.directive';

@Component({
    selector: 'adf-signal-paste-limit-host',
    imports: [SignalPasteLimitDirective],
    template: `<input [value]="text()" [adf-signal-paste-limit]="limit()" (pasteRefused)="refusals.push($event)" />`
})
class SignalPasteLimitHostComponent {
    readonly text = signal('abc');
    readonly limit = signal(5);
    readonly refusals: boolean[] = [];
}

describe('SignalPasteLimitDirective', () => {
    let fixture: ComponentFixture<SignalPasteLimitHostComponent>;
    let host: SignalPasteLimitHostComponent;
    let textInput: HTMLInputElement;

    const paste = (text: string): ClipboardEvent => {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text', text);
        const event = new ClipboardEvent('paste', { clipboardData, cancelable: true });
        textInput.dispatchEvent(event);
        return event;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        fixture = TestBed.createComponent(SignalPasteLimitHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        textInput = fixture.nativeElement.querySelector('input');
        textInput.setSelectionRange(textInput.value.length, textInput.value.length);
    });

    it('should refuse a paste that makes the text longer than the limit', () => {
        const refused = paste('defgh');

        expect(refused.defaultPrevented).toBeTrue();
        expect(host.refusals).toEqual([true]);
    });

    it('should accept a paste that fits', () => {
        const accepted = paste('de');

        expect(accepted.defaultPrevented).toBeFalse();
        expect(host.refusals).toEqual([false]);
    });

    it('should accept a paste that replaces the selected text and fits', () => {
        textInput.setSelectionRange(0, 3);

        const accepted = paste('defgh');

        expect(accepted.defaultPrevented).toBeFalse();
        expect(host.refusals).toEqual([false]);
    });

    it('should accept a paste without clipboard data', () => {
        const empty = new ClipboardEvent('paste', { cancelable: true });

        textInput.dispatchEvent(empty);

        expect(empty.defaultPrevented).toBeFalse();
        expect(host.refusals).toEqual([false]);
    });

    it('should leave every paste alone when there is no limit', () => {
        host.limit.set(0);
        fixture.detectChanges();

        const accepted = paste('defghijkl');

        expect(accepted.defaultPrevented).toBeFalse();
        expect(host.refusals).toEqual([]);
    });

    it('should clear the refusal once the text is edited', () => {
        textInput.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));

        expect(host.refusals).toEqual([false]);
    });

    it('should keep the refusal while the input event is the paste itself', () => {
        textInput.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste' }));

        expect(host.refusals).toEqual([]);
    });
});
