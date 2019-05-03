/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { ClipboardService } from './clipboard.service';
import { ClipboardDirective } from './clipboard.directive';
import { RouterTestingModule } from '@angular/router/testing';

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
            CoreModule.forRoot()
        ],
        declarations: [
            TestTargetClipboardComponent
        ],
        providers: [
            ClipboardService
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestTargetClipboardComponent);
        clipboardService = TestBed.get(ClipboardService);
        fixture.detectChanges();
    });

    it('should notify copy target value on button click event', () => {
        spyOn(clipboardService, 'copyToClipboard');
        fixture.nativeElement.querySelector('input').value = 'some value';
        fixture.nativeElement.querySelector('button').dispatchEvent(new MouseEvent('click'));

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
            CoreModule.forRoot(),
            RouterTestingModule
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
        const spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span');
        spanHTMLElement.dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();
    }));

    it('should not show tooltip when element it is not hovered', (() => {
        const spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span');
        spanHTMLElement.dispatchEvent(new Event('mouseenter'));
        expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).not.toBeNull();

        spanHTMLElement.dispatchEvent(new Event('mouseleave'));
        expect(fixture.debugElement.nativeElement.querySelector('.adf-copy-tooltip')).toBeNull();
    }));

    it('should copy the content of element when click it', fakeAsync(() => {
        const spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span');
        fixture.detectChanges();
        spyOn(document, 'execCommand');
        spanHTMLElement.dispatchEvent(new Event('click'));
        tick();
        fixture.detectChanges();
        expect(document.execCommand).toHaveBeenCalledWith('copy');
    }));

    it('should not copy the content of element when click it', fakeAsync(() => {
        const spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span');
        fixture.detectChanges();
        spyOn(document, 'execCommand');
        spanHTMLElement.dispatchEvent(new Event('mouseleave'));
        tick();
        fixture.detectChanges();
        expect(document.execCommand).not.toHaveBeenCalled();
    }));
});
