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

import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { DropZoneDirective } from './drop-zone.directive';

describe('DropZoneDirective', () => {
    let directive: DropZoneDirective;
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');

        TestBed.configureTestingModule({
            providers: [{ provide: ElementRef, useValue: new ElementRef(element) }]
        });

        directive = TestBed.runInInjectionContext(() => new DropZoneDirective());
        directive.dropTarget = 'cell';
        directive.ngOnInit();
    });

    it('should dispatch a namespaced custom event on dragenter while attached', () => {
        const dispatched: string[] = [];
        element.addEventListener('cell-dragenter', () => dispatched.push('cell-dragenter'));

        element.dispatchEvent(new DragEvent('dragenter'));

        expect(dispatched).toContain('cell-dragenter');
    });

    it('should not handle drag events after the directive is destroyed', () => {
        const dispatched: string[] = [];
        element.addEventListener('cell-dragenter', () => dispatched.push('cell-dragenter'));
        element.addEventListener('cell-dragover', () => dispatched.push('cell-dragover'));
        element.addEventListener('cell-drop', () => dispatched.push('cell-drop'));

        directive.ngOnDestroy();

        element.dispatchEvent(new DragEvent('dragenter'));
        element.dispatchEvent(new DragEvent('dragover'));
        element.dispatchEvent(new DragEvent('drop'));

        expect(dispatched).toEqual([]);
    });

    it('should remove listeners using the same references that were added', () => {
        const addSpy = spyOn(element, 'addEventListener').and.callThrough();
        const removeSpy = spyOn(element, 'removeEventListener').and.callThrough();

        directive.ngOnInit();
        directive.ngOnDestroy();

        const addedByEvent = new Map<string, EventListenerOrEventListenerObject>();
        addSpy.calls.allArgs().forEach(([evt, fn]) => addedByEvent.set(evt as string, fn as EventListenerOrEventListenerObject));

        removeSpy.calls.allArgs().forEach(([evt, fn]) => {
            expect(fn).toBe(addedByEvent.get(evt as string));
        });
    });
});
