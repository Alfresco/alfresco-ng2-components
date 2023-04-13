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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDraggableDirective, INPUT_FOCUS_CSS_CLASS } from '../directives/file-draggable.directive';

@Component({
    selector: 'adf-test-component',
    template: `
        <div id="test-container" [adf-file-draggable]="true">
            <div id="test-content"></div>
       </div>
    `
})
class TestComponent {
    @ViewChild(FileDraggableDirective, { static: true })
    directive: FileDraggableDirective;
}

describe('FileDraggableDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let directive: FileDraggableDirective;

    let testContainer: HTMLDivElement;
    let testContent: HTMLDivElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                FileDraggableDirective
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        directive = component.directive;

        fixture.detectChanges();
        testContainer = fixture.nativeElement.querySelector('#test-container');
        testContent = fixture.nativeElement.querySelector('#test-content');
    });

    afterEach(() => {
        fixture.destroy();
    });

    const createEvent = (eventName: string): DragEvent => new DragEvent(eventName, {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
    });

    const raiseEvent = (eventName: string): DragEvent => {
        const event = createEvent(eventName);
        testContent.dispatchEvent(event);
        return event;
    };

    it('should always be enabled by default', () => {
        expect(directive.enabled).toBeTruthy();
    });

    it('should add focus style on [dragenter]', () => {
        raiseEvent('dragenter');
        expect(testContainer.classList.contains(INPUT_FOCUS_CSS_CLASS)).toBeTruthy();
    });

    it('should add focus style on [dragenter] only if not already handled', () => {
        const dragEvent = createEvent('dragenter');
        dragEvent.preventDefault();

        testContainer.dispatchEvent(dragEvent);
        expect(testContainer.classList.contains(INPUT_FOCUS_CSS_CLASS)).toBeFalsy();
    });

    it('should add focus style only on [dragover]', () => {
        raiseEvent('dragover');
        expect(testContainer.classList.contains(INPUT_FOCUS_CSS_CLASS)).toBeTruthy();

        raiseEvent('dragleave');
        expect(testContainer.classList.contains(INPUT_FOCUS_CSS_CLASS)).toBeFalsy();
    });

    it('should remove focus style after [drop] of files', () => {
        raiseEvent('dragover');
        expect(testContainer.classList.contains(INPUT_FOCUS_CSS_CLASS)).toBeTruthy();

        raiseEvent('drop');
        expect(testContainer.classList.contains(INPUT_FOCUS_CSS_CLASS)).toBeFalsy();
    });

    it('should add focus style on [dragover] only if not already handled', () => {
        const dragEvent = createEvent('dragover');
        dragEvent.preventDefault();

        testContainer.dispatchEvent(dragEvent);
        expect(testContainer.classList.contains(INPUT_FOCUS_CSS_CLASS)).toBeFalsy();
    });

    it('should prevent [drop] event propagation after handling', () => {
        const dragEvent = createEvent('drop');
        expect(dragEvent.defaultPrevented).toBeFalsy();

        testContainer.dispatchEvent(dragEvent);
        expect(dragEvent.defaultPrevented).toBeTruthy();
    });

    it('should not prevent [drop] event propagation if component is disabled', () => {
        component.directive.enabled = false;

        const dragEvent = createEvent('drop');
        expect(dragEvent.defaultPrevented).toBeFalsy();

        testContainer.dispatchEvent(dragEvent);
        expect(dragEvent.defaultPrevented).toBeFalsy();
    });

    it('should prevent [dragenter] event propagation after handling', () => {
        const dragEvent = createEvent('dragenter');
        expect(dragEvent.defaultPrevented).toBeFalsy();

        testContainer.dispatchEvent(dragEvent);
        expect(dragEvent.defaultPrevented).toBeTruthy();
    });

    it('should not prevent [dragenter] event propagation if component is disabled', () => {
        component.directive.enabled = false;

        const dragEvent = createEvent('dragenter');
        expect(dragEvent.defaultPrevented).toBeFalsy();

        testContainer.dispatchEvent(dragEvent);
        expect(dragEvent.defaultPrevented).toBeFalsy();
    });

    it('should prevent [dragleave] event propagation after hanlding', () => {
        const dragEvent = createEvent('dragleave');
        expect(dragEvent.defaultPrevented).toBeFalsy();

        testContainer.dispatchEvent(dragEvent);
        expect(dragEvent.defaultPrevented).toBeTruthy();
    });

    it('should not prevent [dragleave] event propagation if component is disabled', () => {
        component.directive.enabled = false;

        const dragEvent = createEvent('dragleave');
        expect(dragEvent.defaultPrevented).toBeFalsy();

        testContainer.dispatchEvent(dragEvent);
        expect(dragEvent.defaultPrevented).toBeFalsy();
    });

    it('should prevent [dragover] event propagation after handling', () => {
        const dragEvent = createEvent('dragover');
        expect(dragEvent.defaultPrevented).toBeFalsy();

        testContainer.dispatchEvent(dragEvent);
        expect(dragEvent.defaultPrevented).toBeTruthy();
    });

    it('should not prevent [dragover] event propagation if component is disabled', () => {
        component.directive.enabled = false;

        const dragEvent = createEvent('dragover');
        expect(dragEvent.defaultPrevented).toBeFalsy();

        testContainer.dispatchEvent(dragEvent);
        expect(dragEvent.defaultPrevented).toBeFalsy();
    });
});
