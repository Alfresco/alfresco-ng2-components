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
import { ResizableDirective } from './resizable.directive';

describe('ResizableDirective', () => {
    let ngZone: NgZone;
    let renderer: Renderer2;
    let element: ElementRef;
    let directive: ResizableDirective;

    const scrollTop = 0;
    const scrollLeft = 0;

    const boundingClientRectMock = {
        top: 0,
        left: 0,
        right: 0,
        width: 150,
        height: 0,
        bottom: 0,
        scrollTop,
        scrollLeft
    };

    const rendererMock = {
        listen: jasmine.createSpy('listen'),
        setStyle: jasmine.createSpy('setStyle')
    };

    const elementRefMock = {
        nativeElement: {
            scrollTop,
            scrollLeft,
            getBoundingClientRect: () => boundingClientRectMock
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ResizableDirective],
            providers: [
                { provide: Renderer2, useValue: rendererMock },
                { provide: ElementRef, useValue: elementRefMock }
            ]
        });

        element = TestBed.inject(ElementRef);
        renderer = TestBed.inject(Renderer2);
        ngZone = TestBed.inject(NgZone);
        spyOn(ngZone, 'runOutsideAngular').and.callFake((fn) => fn());
        spyOn(ngZone, 'run').and.callFake((fn) => fn());
        directive = new ResizableDirective(renderer, element, ngZone);

        directive.ngOnInit();
    });

    it('should attach mousedown event to document', () => {
        expect(renderer.listen).toHaveBeenCalledWith('document', 'mousedown', jasmine.any(Function));
    });

    it('should attach mousemove event to document', () => {
        const mouseDownEvent = new MouseEvent('mousedown');

        directive.mousedown.next({ ...mouseDownEvent, resize: true });

        expect(renderer.listen).toHaveBeenCalledWith('document', 'mousemove', jasmine.any(Function));
    });

    it('should attach mouseup event to document', () => {
        expect(renderer.listen).toHaveBeenCalledWith('document', 'mouseup', jasmine.any(Function));
    });

    it('should should set the cursor on mouse down', () => {
        spyOn(directive.resizeStart, 'emit');
        const mouseDownEvent = new MouseEvent('mousedown');

        directive.mousedown.next({ ...mouseDownEvent, resize: true });

        expect(renderer.setStyle).toHaveBeenCalledWith(document.body, 'cursor', 'col-resize');
    });

    it('should emit resizeStart event on mouse down', () => {
        spyOn(directive.resizeStart, 'emit');
        directive.resizeStart.subscribe();
        const mouseDownEvent = new MouseEvent('mousedown');

        directive.mousedown.next({ ...mouseDownEvent, resize: true });

        expect(directive.resizeStart.emit).toHaveBeenCalledWith({ rectangle: { top: 0, left: 0, bottom: 0, right: 0, width: 0 } });
    });

    it('should unset cursor on mouseup', () => {
        const mouseDownEvent = new MouseEvent('mousedown');
        const mouseUpEvent = new MouseEvent('mouseup');

        directive.mousedown.next({ ...mouseDownEvent, resize: true });
        directive.mouseup.next(mouseUpEvent);

        expect(renderer.setStyle).toHaveBeenCalledWith(document.body, 'cursor', '');
    });

    it('should emit resizeEnd on mouseup', () => {
        spyOn(directive.resizeEnd, 'emit');
        directive.resizeEnd.subscribe();
        const mouseDownEvent = new MouseEvent('mousedown');
        const mouseUpEvent = new MouseEvent('mouseup');

        directive.mousedown.next({ ...mouseDownEvent, resize: true });
        directive.mouseup.next(mouseUpEvent);

        expect(directive.resizeEnd.emit).toHaveBeenCalledWith({ rectangle: { top: 0, left: 0, right: 0, width: 150, height: 0, bottom: 0, scrollTop: 0, scrollLeft: 0 } });
    });

    it('should emit resizing on mousemove', () => {
        spyOn(directive.resizing, 'emit');
        directive.resizing.subscribe();
        const mouseDownEvent = new MouseEvent('mousedown');
        const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 120 });

        directive.mousedown.next({ ...mouseDownEvent, resize: true });
        directive.mousemove.next(mouseMoveEvent);

        expect(directive.resizing.emit).toHaveBeenCalledWith({ rectangle: { top: 0, left: 0, bottom: 0, right: 120, width: 120 } });
    });
});
