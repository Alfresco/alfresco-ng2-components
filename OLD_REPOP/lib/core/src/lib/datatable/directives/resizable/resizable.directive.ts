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

import { merge, Observable, Observer, Subject } from 'rxjs';
import { BoundingRectangle, ICoordinateX, IResizeMouseEvent, ResizeEvent } from './types';
import { filter, map, mergeMap, pairwise, share, take, takeUntil } from 'rxjs/operators';
import { DestroyRef, Directive, ElementRef, EventEmitter, inject, Input, NgZone, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    selector: '[adf-resizable]',
    exportAs: 'adf-resizable'
})
export class ResizableDirective implements OnInit, OnDestroy {
    /**
     * Emitted when the mouse is pressed and a resize event is about to begin.
     */
    @Output() resizeStart = new EventEmitter<ResizeEvent>();

    /**
     * Emitted when the mouse is dragged after a resize event has started.
     */
    @Output() resizing = new EventEmitter<ResizeEvent>();

    /**
     * Emitted when the mouse is released after a resize event.
     */
    @Output() resizeEnd = new EventEmitter<ResizeEvent>();

    /**
     * This is to cover sum of the left and right padding between resize handler and its parent.
     */
    @Input() coverPadding = 0;

    mouseup = new Subject<IResizeMouseEvent>();

    mousedown = new Subject<IResizeMouseEvent>();

    mousemove = new Subject<IResizeMouseEvent>();

    private readonly pointerDown: Observable<IResizeMouseEvent>;
    private readonly pointerMove: Observable<IResizeMouseEvent>;
    private readonly pointerUp: Observable<IResizeMouseEvent>;

    private startingRect: BoundingRectangle;

    private currentRect: BoundingRectangle;

    private unsubscribeMouseDown?: () => void;
    private unsubscribeMouseMove?: () => void;
    private unsubscribeMouseUp?: () => void;

    private readonly destroyRef = inject(DestroyRef);

    constructor(private readonly renderer: Renderer2, private readonly element: ElementRef<HTMLElement>, private readonly zone: NgZone) {
        this.pointerDown = new Observable((observer: Observer<IResizeMouseEvent>) => {
            zone.runOutsideAngular(() => {
                this.unsubscribeMouseDown = renderer.listen('document', 'mousedown', (event: MouseEvent) => {
                    observer.next(event);
                });
            });
        }).pipe(share());

        this.pointerMove = new Observable((observer: Observer<IResizeMouseEvent>) => {
            zone.runOutsideAngular(() => {
                this.unsubscribeMouseMove = renderer.listen('document', 'mousemove', (event: MouseEvent) => {
                    observer.next(event);
                });
            });
        }).pipe(share());

        this.pointerUp = new Observable((observer: Observer<IResizeMouseEvent>) => {
            zone.runOutsideAngular(() => {
                this.unsubscribeMouseUp = renderer.listen('document', 'mouseup', (event: MouseEvent) => {
                    observer.next(event);
                });
            });
        }).pipe(share());
    }

    ngOnInit(): void {
        const mousedown$ = merge(this.pointerDown, this.mousedown);
        const mousemove$ = merge(this.pointerMove, this.mousemove);
        const mouseup$ = merge(this.pointerUp, this.mouseup);

        const mouseDrag: Observable<IResizeMouseEvent | ICoordinateX> = mousedown$
            .pipe(
                mergeMap(({ clientX = 0 }) =>
                    merge(mousemove$.pipe(take(1)).pipe(map((coords) => [undefined, coords])), mousemove$.pipe(pairwise()))
                        .pipe(
                            map(([previousCoords = {}, newCoords = {}]) => [
                                { clientX: previousCoords.clientX - clientX },
                                { clientX: newCoords.clientX - clientX }
                            ])
                        )
                        .pipe(filter(([previousCoords = {}, newCoords = {}]) => Math.ceil(previousCoords.clientX) !== Math.ceil(newCoords.clientX)))
                        .pipe(
                            map(([, newCoords]) => ({
                                clientX: Math.round(newCoords.clientX)
                            }))
                        )
                        .pipe(takeUntil(merge(mouseup$, mousedown$)))
                )
            )
            .pipe(filter(() => !!this.currentRect));

        mouseDrag
            .pipe(map(({ clientX }) => this.getNewBoundingRectangle(this.startingRect, clientX + this.coverPadding)))
            .subscribe((rectangle: BoundingRectangle) => {
                if (this.resizing.observers.length > 0) {
                    this.zone.run(() => {
                        this.resizing.emit({ rectangle });
                    });
                }
                this.currentRect = rectangle;
            });

        mousedown$
            .pipe(
                map(({ resize = false }) => resize),
                filter((resize) => resize),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                const startingRect: BoundingRectangle = this.getElementRect(this.element);

                this.startingRect = startingRect;
                this.currentRect = startingRect;

                this.renderer.setStyle(document.body, 'cursor', 'col-resize');
                if (this.resizeStart.observers.length > 0) {
                    this.zone.run(() => {
                        this.resizeStart.emit({
                            rectangle: this.getNewBoundingRectangle(this.startingRect, 0)
                        });
                    });
                }
            });

        mouseup$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            if (this.currentRect) {
                this.renderer.setStyle(document.body, 'cursor', '');
                if (this.resizeEnd.observers.length > 0) {
                    this.zone.run(() => {
                        this.resizeEnd.emit({ rectangle: this.currentRect });
                    });
                }
                this.startingRect = null;
                this.currentRect = null;
            }
        });
    }

    ngOnDestroy(): void {
        this.mousedown.complete();
        this.mousemove.complete();
        this.mouseup.complete();
        this.unsubscribeMouseDown?.();
        this.unsubscribeMouseMove?.();
        this.unsubscribeMouseUp?.();
    }

    private getNewBoundingRectangle({ top, bottom, left, right }: BoundingRectangle, clientX: number): BoundingRectangle {
        const updatedRight = Math.round(right + clientX);

        return {
            top,
            left,
            bottom,
            right: updatedRight,
            width: updatedRight - left
        };
    }

    private getElementRect({ nativeElement }: ElementRef): BoundingRectangle {
        const { height = 0, width = 0, top = 0, bottom = 0, right = 0, left = 0 }: BoundingRectangle = nativeElement.getBoundingClientRect();

        return {
            top,
            left,
            right,
            width,
            height,
            bottom,
            scrollTop: nativeElement.scrollTop,
            scrollLeft: nativeElement.scrollLeft
        };
    }
}
