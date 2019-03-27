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
import { AppHighlightDirective } from './app-highlight.directive';
import { Component, ViewChild } from '@angular/core';
import { setupTestBed } from 'core';
import { RouterTestingModule } from '@angular/router/testing';
import { ClaimTaskDirective } from 'process-services-cloud/src/lib/task/directives/claim-task.directive';
import { CoreModule } from 'core/core.module';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

describe('AppHighLightDirective', () => {

    @Component({
        selector:  'adf-hightlight-test-component',
        template: `<span adf-app-highlight='DOCUMENT_LIST.ACTIONS.DOCUMENT.CLICK_TO_COPY'>{{ mockText }}</span>`
    })
    class TestComponent {

        mockText = 'text to copy';

        @ViewChild(AppHighlightDirective)
        appHighlightDirective: AppHighlightDirective;
    }

    let fixture: ComponentFixture<TestComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            RouterTestingModule
        ],
        declarations: [
            TestComponent,
            ClaimTaskDirective
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        element = fixture.debugElement.nativeElement;
        fixture.detectChanges();
    });

    it('should show tooltip when hover element', (() => {
        let spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span');
        spanHTMLElement.dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.querySelector('#datatable-copy-tooltip')).not.toBeNull();
    }));

    it('should not show tooltip when element it is not hovered', (() => {
        let spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span');
        spanHTMLElement.dispatchEvent(new Event('mouseenter'));
        expect(fixture.debugElement.nativeElement.querySelector('#datatable-copy-tooltip')).not.toBeNull();

        spanHTMLElement.dispatchEvent(new Event('mouseleave'));
        expect(fixture.debugElement.nativeElement.querySelector('#datatable-copy-tooltip')).toBeNull();
    }));

    it('should copy the content of element when click it', fakeAsync(() => {
        let spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span');
        fixture.detectChanges();
        spyOn(document, 'execCommand');
        spanHTMLElement.dispatchEvent(new Event('click'));
        tick();
        fixture.detectChanges();
        expect(document.execCommand).toHaveBeenCalled();
        expect(document.execCommand).toHaveBeenCalledWith('copy');
    }));

    it('should copy the content of element when click it', fakeAsync(() => {
        let spanHTMLElement: HTMLInputElement = <HTMLInputElement> element.querySelector('span');
        fixture.detectChanges();
        spyOn(document, 'execCommand');
        spanHTMLElement.dispatchEvent(new Event('mouseleave'));
        tick();
        fixture.detectChanges();
        expect(document.execCommand).not.toHaveBeenCalled();
    }));
});
