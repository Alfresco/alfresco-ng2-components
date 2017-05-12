/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Directive, EventEmitter, Output, OnInit, OnDestroy, ElementRef, NgZone } from '@angular/core';

/**
 * [file-draggable]
 *
 * This directive, provide a drag and drop area for files and folders.
 *
 * @OutputEvent {EventEmitter} onFilesDropped(File)- event fired fot each file dropped
 * in the drag and drop area.
 *
 *
 * @returns {FileDraggableDirective} .
 */
@Directive({
    selector: '[file-draggable]'
})
export class FileDraggableDirective implements OnInit, OnDestroy {

    files: File [];

    @Output()
    onFilesDropped: EventEmitter<any> = new EventEmitter();

    @Output()
    onFilesEntityDropped: EventEmitter<any> = new EventEmitter();

    @Output()
    onFolderEntityDropped: EventEmitter<any> = new EventEmitter();

    private cssClassName: string = 'file-draggable__input-focus';
    private element: HTMLElement;

    constructor(private el: ElementRef, private ngZone: NgZone) {
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
     * @param event DOM event.
     */
    onDropFiles(event: any): void {
        if (!event.defaultPrevented) {
            this.preventDefault(event);

            let items = event.dataTransfer.items;
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    if (typeof items[i].webkitGetAsEntry !== 'undefined') {
                        let item = items[i].webkitGetAsEntry();
                        if (item) {
                            this.traverseFileTree(item);
                        }
                    } else {
                        let files = event.dataTransfer.files;
                        this.onFilesDropped.emit(files);
                    }
                }
            } else {
                // safari or FF
                let files = event.dataTransfer.files;
                this.onFilesDropped.emit(files);
            }

            this.element.classList.remove(this.cssClassName);
        }
    }

    /**
     * Travers all the files and folders, and emit an event for each file or directory.
     *
     * @param {Object} item - can contains files or folders.
     */
    private traverseFileTree(item: any): void {
        if (item.isFile) {
            let self = this;
            self.onFilesEntityDropped.emit(item);
        } else {
            if (item.isDirectory) {
                this.onFolderEntityDropped.emit(item);
            }
        }
    }

    /**
     * Change the style of the drag area when a file drag in.
     *
     * @param {event} event - DOM event.
     */
    onDragEnter(event: Event): void {
        if (!event.defaultPrevented) {
            this.preventDefault(event);
            this.element.classList.add(this.cssClassName);
        }
    }

    /**
     * Change the style of the drag area when a file drag out.
     *
     * @param {event} event - DOM event.
     */
    onDragLeave(event: Event): void {
        if (!event.defaultPrevented) {
            this.preventDefault(event);
            this.element.classList.remove(this.cssClassName);
        }
    }

    /**
     * Change the style of the drag area when a file is over the drag area.
     *
     * @param event
     */
    onDragOver(event: Event): void {
        if (!event.defaultPrevented) {
            this.preventDefault(event);
            this.element.classList.add(this.cssClassName);
        }
    }

    /**
     * Prevent default and stop propagation of the DOM event.
     *
     * @param {event} $event - DOM event.
     */
    preventDefault(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
    }
}
