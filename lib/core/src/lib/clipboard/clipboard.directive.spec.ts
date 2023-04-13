/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { setupTestBed } from '../testing/setup-test-bed';
import { ClipboardService } from './clipboard.service';
import { ClipboardDirective } from './clipboard.directive';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
     selector: 'adf-test-component',
     template: `
        <button
            clipboard-notification="copy success"
            [adf-clipboard] [target]="ref">
            copy
        </button>

        <input #ref />
     `
})
class TestTargetClipboardComponent {}

describe('ClipboardDirective', () => {
    let fixture: ComponentFixture<TestTargetClipboardComponent>;
    let clipboardService: ClipboardService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [
            TestTargetClipboardComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestTargetClipboardComponent);
        clipboardService = TestBed.inject(ClipboardService);
        fixture.detectChanges();
    });

    it('should notify copy target value on button click event', () => {
        spyOn(clipboardService, 'copyToClipboard');
        fixture.nativeElement.querySelector('input').value = 'some value';
        fixture.nativeElement.querySelector('button').dispatchEvent(new MouseEvent('click'));

        expect(clipboardService.copyToClipboard).toHaveBeenCalled();
    });

    it('should notify copy target value on keydown event', () => {
        spyOn(clipboardService, 'copyToClipboard');
        fixture.nativeElement.querySelector('input').value = 'some value';
        fixture.nativeElement.querySelector('button').dispatchEvent(new KeyboardEvent('keydown', {code: 'Enter', key: 'Enter'}));

        expect(clipboardService.copyToClipboard).toHaveBeenCalled();
    });
});

describe('CopyClipboardDirective', () => {

    @Component({
        selector:  'adf-copy-conent-test-component',
        template: `<span adf-clipboard="placeholder">{{ mockText }}</span>`
    })
    class TestCopyClipboardComponent {

        mockText = 'text to copy';
        placeholder = 'copy text';

        @ViewChild(ClipboardDirective)
        clipboardDirective: ClipboardDirective;
    }

    let fixture: ComponentFixture<TestCopyClipboardComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [
            TestCopyClipboardComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestCopyClipboardComponent);
        element = fixture.debugElement.nativeElement;
        fixture.detectChanges();
    });

    it('should show tooltip when hover element', (() => {
        const spanHTMLElement = element.querySelector<HTMLInputElement>('span');
        spanHTMLElement.dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();
    }));

    it('should not show tooltip when element it is not hovered', (() => {
        const spanHTMLElement = element.querySelector<HTMLInputElement>('span');
        spanHTMLElement.dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();

        spanHTMLElement.dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).toBeNull();
    }));

    it('should copy the content of element when click it', fakeAsync(() => {
        const spanHTMLElement = element.querySelector<HTMLInputElement>('span');
        fixture.detectChanges();
        spyOn(navigator.clipboard, 'writeText');
        spanHTMLElement.dispatchEvent(new Event('click'));
        tick();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('text to copy');
    }));

    it('should copy the content of element on keydown event', fakeAsync(() => {
        const spanHTMLElement = element.querySelector<HTMLInputElement>('span');
        fixture.detectChanges();
        spyOn(navigator.clipboard, 'writeText');
        spanHTMLElement.dispatchEvent(new KeyboardEvent('keydown', {code: 'Enter', key: 'Enter'}));
        tick();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('text to copy');
    }));

    it('should not copy the content of element when click it', fakeAsync(() => {
        const spanHTMLElement = element.querySelector<HTMLInputElement>('span');
        fixture.detectChanges();
        spyOn(navigator.clipboard, 'writeText');
        spanHTMLElement.dispatchEvent(new Event('mouseleave'));
        tick();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    }));
});
