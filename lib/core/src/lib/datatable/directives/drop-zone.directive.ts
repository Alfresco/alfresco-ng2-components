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

import { Directive, Input, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { DataRow } from '../data/data-row.model';
import { DataColumn } from '../data/data-column.model';

@Directive({
    selector: '[adf-drop-zone]'
})
export class DropZoneDirective implements OnInit, OnDestroy {
    private element: HTMLElement;

    @Input()
    dropTarget: 'header' | 'cell' = 'cell';

    @Input()
    dropRow: DataRow;

    @Input()
    dropColumn: DataColumn;

    constructor(elementRef: ElementRef, private ngZone: NgZone) {
        this.element = elementRef.nativeElement;
    }

    ngOnInit() {
        this.ngZone.runOutsideAngular(() => {
            this.element.addEventListener('dragenter', this.onDragEnter.bind(this));
            this.element.addEventListener('dragover', this.onDragOver.bind(this));
            this.element.addEventListener('drop', this.onDrop.bind(this));
        });
    }

    ngOnDestroy() {
        this.element.removeEventListener('dragenter', this.onDragEnter);
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('drop', this.onDrop);
    }

    onDragEnter(event: DragEvent) {
        const domEvent = this.dispatchDomEvent(event, 'dragenter');

        if (domEvent.defaultPrevented) {
            event.dataTransfer.dropEffect = 'copy';
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onDragOver(event: DragEvent) {
        const domEvent = this.dispatchDomEvent(event, 'dragover');

        if (domEvent.defaultPrevented) {
            event.dataTransfer.dropEffect = 'copy';
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onDrop(event: Event) {
        const domEvent = this.dispatchDomEvent(event, 'drop');

        if (domEvent.defaultPrevented) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private dispatchDomEvent(originalEvent: Event, eventName: string): CustomEvent {
        const domEvent = new CustomEvent(`${this.dropTarget}-${eventName}`, {
            detail: {
                target: this.dropTarget,
                event: originalEvent,
                column: this.dropColumn,
                row: this.dropRow
            },
            bubbles: true
        });

        this.element.dispatchEvent(domEvent);
        return domEvent;
    }
}
