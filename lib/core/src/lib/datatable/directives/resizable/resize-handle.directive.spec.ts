/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ElementRef, NgZone, Renderer2 } from '@angular/core';
import { ResizeHandleDirective } from './resize-handle.directive';
import { ResizableDirective } from './resizable.directive';
import { Subject } from 'rxjs';

fdescribe('ResizeHandleDirective', () => {
    let directive: ResizeHandleDirective;
    let renderer: jasmine.SpyObj<Renderer2>;
    let element: ElementRef;
    let ngZone: NgZone;
    let resizableContainer: jasmine.SpyObj<ResizableDirective>;

    beforeEach(() => {
        renderer = jasmine.createSpyObj('Renderer2', ['listen']);
        element = { nativeElement: document.createElement('div') };
        ngZone = { runOutsideAngular: (fn: () => void) => fn() } as NgZone;

        resizableContainer = jasmine.createSpyObj('ResizableDirective', ['resizeByKeyboard'], {
            mousedown: new Subject(),
            mouseup: new Subject(),
            mousemove: new Subject()
        });

        directive = new ResizeHandleDirective(renderer, element, ngZone);
        directive.resizableContainer = resizableContainer;
    });

    describe('ngOnInit', () => {
        it('should attach mousedown event listener on element', () => {
            renderer.listen.and.returnValue(() => {});

            directive.ngOnInit();

            expect(renderer.listen).toHaveBeenCalledWith(element.nativeElement, 'mousedown', jasmine.any(Function));
        });

        it('should run mousedown listener outside Angular zone', () => {
            const runOutsideAngularSpy = spyOn(ngZone, 'runOutsideAngular').and.callThrough();
            renderer.listen.and.returnValue(() => {});

            directive.ngOnInit();

            expect(runOutsideAngularSpy).toHaveBeenCalled();
        });
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe from mousedown listener', () => {
            const unlistenMouseDown = jasmine.createSpy('unlistenMouseDown');
            renderer.listen.and.returnValue(unlistenMouseDown);

            directive.ngOnInit();
            directive.ngOnDestroy();

            expect(unlistenMouseDown).toHaveBeenCalled();
        });
    });

    describe('mouse events', () => {
        let mousedownCallback: (event: MouseEvent) => void;

        beforeEach(() => {
            renderer.listen.and.callFake((_target: any, eventName: string, callback: (event: MouseEvent) => void) => {
                if (eventName === 'mousedown') {
                    mousedownCallback = callback;
                }
                return () => {};
            });
            directive.ngOnInit();
        });

        it('should emit mousedown event to resizable container with resize flag', () => {
            spyOn(resizableContainer.mousedown, 'next');
            const mouseEvent = new MouseEvent('mousedown', { cancelable: true });

            mousedownCallback(mouseEvent);

            expect(resizableContainer.mousedown.next).toHaveBeenCalledWith(jasmine.objectContaining({ resize: true }));
        });

        it('should prevent default on cancelable mousedown event', () => {
            const mouseEvent = new MouseEvent('mousedown', { cancelable: true });
            spyOn(mouseEvent, 'preventDefault');

            mousedownCallback(mouseEvent);

            expect(mouseEvent.preventDefault).toHaveBeenCalled();
        });

        it('should not prevent default on non-cancelable mousedown event', () => {
            const mouseEvent = new MouseEvent('mousedown', { cancelable: false });
            spyOn(mouseEvent, 'preventDefault');

            mousedownCallback(mouseEvent);

            expect(mouseEvent.preventDefault).not.toHaveBeenCalled();
        });

        it('should attach mousemove and mouseup listeners on mousedown', () => {
            const mouseEvent = new MouseEvent('mousedown', { cancelable: true });

            mousedownCallback(mouseEvent);

            expect(renderer.listen).toHaveBeenCalledWith(element.nativeElement, 'mousemove', jasmine.any(Function));
            expect(renderer.listen).toHaveBeenCalledWith('document', 'mouseup', jasmine.any(Function));
        });
    });

    describe('keyboard resizing', () => {
        it('should call resizeByKeyboard with positive delta on ArrowRight', () => {
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            spyOn(event, 'preventDefault');
            spyOn(event, 'stopPropagation');

            directive.onKeydown(event);

            expect(resizableContainer.resizeByKeyboard).toHaveBeenCalledWith(20);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(event.stopPropagation).toHaveBeenCalled();
        });

        it('should use larger step with Shift+ArrowRight', () => {
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true });

            directive.onKeydown(event);

            expect(resizableContainer.resizeByKeyboard).toHaveBeenCalledWith(60);
        });

        it('should call resizeByKeyboard with negative delta on Shift+ArrowLeft', () => {
            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', shiftKey: true });

            directive.onKeydown(event);

            expect(resizableContainer.resizeByKeyboard).toHaveBeenCalledWith(-40);
        });

        it('should not call resizeByKeyboard for unrelated keys', () => {
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            spyOn(event, 'preventDefault');

            directive.onKeydown(event);

            expect(resizableContainer.resizeByKeyboard).not.toHaveBeenCalled();
            expect(event.preventDefault).not.toHaveBeenCalled();
        });
    });
});
