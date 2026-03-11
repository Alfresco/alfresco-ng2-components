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

import { ResizableDirective } from './resizable.directive';
import { Directive, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';

@Directive({
    selector: '[adf-resize-handle]'
})
export class ResizeHandleDirective implements OnInit, OnDestroy {
    private readonly renderer = inject(Renderer2);
    private readonly element = inject(ElementRef);
    private readonly zone = inject(NgZone);

    /**
     * Reference to ResizableDirective
     */
    @Input() resizableContainer: ResizableDirective;

    private unlistenMouseDown?: () => void;
    private unlistenMouseMove?: () => void;
    private unlistenMouseUp?: () => void;

    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const shiftDelta = 40;
        const rightStepBaseValue = 20;
        const shiftModifier = event.shiftKey ? shiftDelta : 0;

        let delta: number | null = null;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                delta = shiftModifier + rightStepBaseValue;
                break;
            case 'ArrowLeft':
            case 'ArrowDown':
                delta = -shiftModifier;
                break;
            default:
                return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.resizableContainer.resizeByKeyboard(delta);
    }

    ngOnInit(): void {
        this.zone.runOutsideAngular(() => {
            this.unlistenMouseDown = this.renderer.listen(this.element.nativeElement, 'mousedown', (mouseDownEvent: MouseEvent) => {
                this.onMousedown(mouseDownEvent);
            });
        });
    }

    ngOnDestroy(): void {
        this.unlistenMouseDown?.();
        this.unlistenMouseMove?.();
        this.unlistenMouseUp?.();
    }

    private onMousedown(event: MouseEvent): void {
        if (event.cancelable) {
            event.preventDefault();
        }

        if (!this.unlistenMouseMove) {
            this.unlistenMouseMove = this.renderer.listen(this.element.nativeElement, 'mousemove', (mouseMoveEvent: MouseEvent) => {
                this.onMousemove(mouseMoveEvent);
            });
        }

        this.unlistenMouseUp = this.renderer.listen('document', 'mouseup', (mouseUpEvent: MouseEvent) => {
            this.onMouseup(mouseUpEvent);
        });

        this.resizableContainer.mousedown.next({ ...event, resize: true });
    }

    private onMouseup(event: MouseEvent): void {
        this.unlistenMouseMove?.();
        this.unlistenMouseMove = undefined;
        this.unlistenMouseUp();
        this.resizableContainer.mouseup.next(event);
    }

    private onMousemove(event: MouseEvent): void {
        this.resizableContainer.mousemove.next(event);
    }
}
