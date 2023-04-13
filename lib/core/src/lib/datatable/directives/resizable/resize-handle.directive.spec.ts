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

import { TestBed } from '@angular/core/testing';
import { ElementRef, NgZone, Renderer2 } from '@angular/core';
import { ResizeHandleDirective } from './resize-handle.directive';

describe('ResizeHandleDirective', () => {
    let ngZone: NgZone;
    let renderer: Renderer2;
    let element: ElementRef;
    let directive: ResizeHandleDirective;

    const rendererMock = {
        listen: jasmine.createSpy('listen')
    };

    const elementRefMock = {
        nativeElement: { dispatchEvent: () => { } }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ResizeHandleDirective],
            providers: [
                { provide: Renderer2, useValue: rendererMock },
                { provide: ElementRef, useValue: elementRefMock }
            ]
        });

        element = TestBed.inject(ElementRef);
        renderer = TestBed.inject(Renderer2);
        ngZone = TestBed.inject(NgZone);
        spyOn(ngZone, 'runOutsideAngular').and.callFake((fn) => fn());
        directive = new ResizeHandleDirective(renderer, element, ngZone);
        directive.ngOnInit();
    });

    it('should attach mousedown event on resizable element', () => {
        expect(renderer.listen).toHaveBeenCalledWith(element.nativeElement, 'mousedown', jasmine.any(Function));
    });
});
