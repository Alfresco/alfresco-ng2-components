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
import { ElementRef, EventEmitter } from 'angular2/core';
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
export declare class FileDraggableDirective {
    el: ElementRef;
    onFilesDropped: EventEmitter<any>;
    files: File[];
    private _inputFocusClass;
    constructor(el: ElementRef);
    /**
     * Method called when files is dropped in the drag and drop area.
     *
     * @param {$event} $event - DOM $event.
     */
    private _onDropFiles($event);
    /**
     * Travers all the files and folders, and emit an event for each file.
     *
     * @param {Object} item - can contains files or folders.
     */
    private _traverseFileTree(item);
    /**
     * Change the style of the drag area when a file drag in.
     *
     * @param {$event} $event - DOM $event.
     */
    private _onDragEnter($event);
    /**
     * Change the style of the drag area when a file drag out.
     *
     * @param {$event} $event - DOM $event.
     */
    private _onDragLeave($event);
    /**
     * Prevent default and stop propagation of the DOM event.
     *
     * @param {$event} $event - DOM $event.
     */
    private _preventDefault($event);
}
