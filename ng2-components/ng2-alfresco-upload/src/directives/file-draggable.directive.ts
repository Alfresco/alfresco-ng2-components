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

import { Directive, HostListener, HostBinding, EventEmitter, Output, Input } from '@angular/core';

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
export class FileDraggableDirective {

    files: File [];

    @Input('file-draggable')
    enabled: boolean = true;

    @Output()
    onFilesDropped: EventEmitter<any> = new EventEmitter();

    @Output()
    onFilesEntityDropped: EventEmitter<any> = new EventEmitter();

    @Output()
    onFolderEntityDropped: EventEmitter<any> = new EventEmitter();

    @HostBinding('class.file-draggable__input-focus')
    inputFocusClass: boolean = false;

    /**
     * Method called when files is dropped in the drag and drop area.
     * @param event DOM event.
     */
    @HostListener('drop', ['$event'])
    onDropFiles(event: any): void {
        if (this.enabled && !event.defaultPrevented) {
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

            this.inputFocusClass = false;
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
    @HostListener('dragenter', ['$event'])
    onDragEnter(event: Event): void {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);
            this.inputFocusClass = true;
        }
    }

    /**
     * Change the style of the drag area when a file drag out.
     *
     * @param {event} event - DOM event.
     */
    @HostListener('dragleave', ['$event'])
    onDragLeave(event: Event): void {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);
            this.inputFocusClass = false;
        }
    }

    /**
     * Change the style of the drag area when a file is over the drag area.
     *
     * @param event
     */
    @HostListener('dragover', ['$event'])
    onDragOver(event: Event): void {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);
            this.inputFocusClass = true;
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

    /**
     * Return the value of input focus class
     * @returns {boolean}
     */
    getInputFocus () {
        return this.inputFocusClass;
    }
}
