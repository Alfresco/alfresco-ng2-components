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

/* eslint-disable @angular-eslint/no-input-rename */

import { FileUtils } from '@alfresco/adf-core';
import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

export const INPUT_FOCUS_CSS_CLASS = 'adf-file-draggable-input-focus';
export const DROP_EFFECT = 'copy';

@Directive({
    selector: '[adf-file-draggable]'
})
export class FileDraggableDirective implements OnInit, OnDestroy {

    files: File [];

    /** Enables/disables drag-and-drop functionality. */
    @Input('adf-file-draggable')
    enabled = true;

    /** Emitted when one or more files are dragged and dropped onto the draggable element. */
    @Output()
    filesDropped = new EventEmitter<File[]>();

    /** Emitted when a directory is dragged and dropped onto the draggable element. */
    @Output()
    folderEntityDropped = new EventEmitter<any>();

    private element: HTMLElement;

    constructor(el: ElementRef, private ngZone: NgZone) {
        this.element = el.nativeElement;
    }

    ngOnInit() {
        this.ngZone.runOutsideAngular(() => {
            this.element.addEventListener('dragenter', this.onDragEnter.bind(this));
            this.element.addEventListener('dragover', this.onDragOver.bind(this));
            this.element.addEventListener('dragleave', this.onDragLeave.bind(this));
            this.element.addEventListener('drop', this.onDropFiles.bind(this));
        });
    }

    ngOnDestroy() {
        this.element.removeEventListener('dragenter', this.onDragEnter);
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('dragleave', this.onDragLeave);
        this.element.removeEventListener('drop', this.onDropFiles);
    }

    /**
     * Method called when files is dropped in the drag and drop area.
     *
     * @param event DOM event.
     */
    onDropFiles(event: any): void {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);

            // Chrome, Edge, Firefox, Opera (Files + Folders)
            const items = event.dataTransfer?.items;
            if (items) {
                const files: File[] = [];

                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < items.length; i++) {
                    if (items[i].webkitGetAsEntry) {
                        const item = items[i].webkitGetAsEntry();

                        if (item) {
                            if (item.isFile) {
                                const file = items[i].getAsFile();

                                if (file) {
                                    files.push(file);
                                }
                            } else if (item.isDirectory) {
                                this.folderEntityDropped.emit(item);
                            }
                        }
                    }
                }
                if (files.length > 0) {
                    this.filesDropped.emit(files);
                }
            } else if (event.dataTransfer?.files) {
                // IE, Safari, Chrome, Edge, Firefox, Opera (Files only)
                const files = FileUtils.toFileArray(event.dataTransfer.files);
                this.filesDropped.emit(files);
            }

            this.element.classList.remove(INPUT_FOCUS_CSS_CLASS);
        }
    }

    /**
     * Change the style of the drag area when a file drag in.
     *
     * @param event - DOM event.
     */
    onDragEnter(event: DragEvent): void {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);

            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = DROP_EFFECT;
            }

            this.element.classList.add(INPUT_FOCUS_CSS_CLASS);
        }
    }

    /**
     * Change the style of the drag area when a file drag out.
     *
     * @param event - DOM event.
     */
    onDragLeave(event: Event): void {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);
            this.element.classList.remove(INPUT_FOCUS_CSS_CLASS);
        }
    }

    /**
     * Change the style of the drag area when a file is over the drag area.
     *
     * @param event
     */
    onDragOver(event: DragEvent): void {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);

            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = DROP_EFFECT;
            }

            this.element.classList.add(INPUT_FOCUS_CSS_CLASS);
        }
    }

    /**
     * Prevent default and stop propagation of the DOM event.
     *
     * @param $event - DOM event.
     */
    preventDefault(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }
}
