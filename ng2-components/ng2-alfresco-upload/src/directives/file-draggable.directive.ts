/**
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

import {Directive, ElementRef, EventEmitter, Output} from 'angular2/core';

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
    selector: '[file-draggable]',
    host: {
        '(drop)': '_onDropFiles($event)',
        '(dragenter)': '_onDragEnter($event)',
        '(dragleave)': '_onDragLeave($event)',
        '(dragover)': '_preventDefault($event)',
        '[class.input-focus]': '_inputFocusClass'
    }
})
export class FileDraggableDirective {

    @Output()
    onFilesDropped: EventEmitter<any> = new EventEmitter();

    files: File [];

    private _inputFocusClass: boolean = false;

    constructor(public el: ElementRef) {
        console.log('FileDraggableComponent constructor', el);
    }

    /**
     * Method called when files is dropped in the drag and drop area.
     *
     * @param {$event} $event - DOM $event.
     */
    private _onDropFiles($event): void {
        this._preventDefault($event);

        var items = $event.dataTransfer.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i].webkitGetAsEntry();
            if (item) {
                this._traverseFileTree(item);
            } else {
                let dt = $event.dataTransfer;
                let files = dt.files;
                this.onFilesDropped.emit(files);
            }
        }

        this._inputFocusClass = false;
    }

    /**
     * Travers all the files and folders, and emit an event for each file.
     *
     * @param {Object} item - can contains files or folders.
     */
    private _traverseFileTree(item): void {
        if (item.isFile) {
            let self = this;
            item.file(function (file) {
                self.onFilesDropped.emit([file]);
            });
        } else {
            if (item.isDirectory) {
                let self = this;
                let dirReader = item.createReader();
                dirReader.readEntries(function (entries) {
                    for (var i = 0; i < entries.length; i++) {
                        self._traverseFileTree(entries[i]);
                    }
                });
            }
        }
    }

    /**
     * Change the style of the drag area when a file drag in.
     *
     * @param {$event} $event - DOM $event.
     */
    private _onDragEnter($event): void {
        this._preventDefault($event);

        this._inputFocusClass = true;
    }

    /**
     * Change the style of the drag area when a file drag out.
     *
     * @param {$event} $event - DOM $event.
     */
    private _onDragLeave($event): void {
        this._preventDefault($event);

        this._inputFocusClass = false;
    }

    /**
     * Prevent default and stop propagation of the DOM event.
     *
     * @param {$event} $event - DOM $event.
     */
    private _preventDefault($event): void {
        $event.stopPropagation();
        $event.preventDefault();
    }
}