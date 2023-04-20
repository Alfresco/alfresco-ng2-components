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

import { Subject } from 'rxjs';
import { ResizableDirective } from './resizable.directive';
import { Input, OnInit, Directive, Renderer2, ElementRef, OnDestroy, NgZone } from '@angular/core';

@Directive({
  selector: '[adf-resize-handle]'
})
export class ResizeHandleDirective implements OnInit, OnDestroy {
  /**
   * Reference to ResizableDirective
   */
  @Input() resizableContainer: ResizableDirective;

  private unlistenMouseDown: () => void;

  private unlistenMouseMove: () => void;

  private unlistenMouseUp: () => void;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly renderer: Renderer2,
    private readonly element: ElementRef,
    private readonly zone: NgZone
  ) { }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.unlistenMouseDown = this.renderer.listen(
        this.element.nativeElement,
        'mousedown',
        (mouseDownEvent: MouseEvent) => {
          this.onMousedown(mouseDownEvent);
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.unlistenMouseDown && this.unlistenMouseDown();
    this.unlistenMouseMove && this.unlistenMouseMove();
    this.unlistenMouseUp && this.unlistenMouseUp();
    this.destroy$.next();
  }

  private onMousedown(event: MouseEvent): void {
    if (event.cancelable) {
      event.preventDefault();
    }

    if (!this.unlistenMouseMove) {
      this.unlistenMouseMove = this.renderer.listen(
        this.element.nativeElement,
        'mousemove',
        (mouseMoveEvent: MouseEvent) => {
          this.onMousemove(mouseMoveEvent);
        }
      );
    }

    this.unlistenMouseUp = this.renderer.listen(
      'document',
      'mouseup',
      (mouseUpEvent: MouseEvent) => {
        this.onMouseup(mouseUpEvent);
      }
    );

    this.resizableContainer.mousedown.next({ ...event, resize: true });
  }

  private onMouseup(event: MouseEvent): void {
    this.unlistenMouseMove && this.unlistenMouseMove();
    this.unlistenMouseUp();
    this.resizableContainer.mouseup.next(event);
  }

  private onMousemove(event: MouseEvent): void {
    this.resizableContainer.mousemove.next(event);
  }
}
