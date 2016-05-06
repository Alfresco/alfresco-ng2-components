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
System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var FileDraggableDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
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
            FileDraggableDirective = (function () {
                function FileDraggableDirective(el) {
                    this.el = el;
                    this.onFilesDropped = new core_1.EventEmitter();
                    this._inputFocusClass = false;
                    console.log('FileDraggableComponent constructor', el);
                }
                /**
                 * Method called when files is dropped in the drag and drop area.
                 *
                 * @param {$event} $event - DOM $event.
                 */
                FileDraggableDirective.prototype._onDropFiles = function ($event) {
                    this._preventDefault($event);
                    var items = $event.dataTransfer.items;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i].webkitGetAsEntry();
                        if (item) {
                            this._traverseFileTree(item);
                        }
                        else {
                            var dt = $event.dataTransfer;
                            var files = dt.files;
                            this.onFilesDropped.emit(files);
                        }
                    }
                    this._inputFocusClass = false;
                };
                /**
                 * Travers all the files and folders, and emit an event for each file.
                 *
                 * @param {Object} item - can contains files or folders.
                 */
                FileDraggableDirective.prototype._traverseFileTree = function (item) {
                    if (item.isFile) {
                        var self_1 = this;
                        item.file(function (file) {
                            self_1.onFilesDropped.emit([file]);
                        });
                    }
                    else {
                        if (item.isDirectory) {
                            var self_2 = this;
                            var dirReader = item.createReader();
                            dirReader.readEntries(function (entries) {
                                for (var i = 0; i < entries.length; i++) {
                                    self_2._traverseFileTree(entries[i]);
                                }
                            });
                        }
                    }
                };
                /**
                 * Change the style of the drag area when a file drag in.
                 *
                 * @param {$event} $event - DOM $event.
                 */
                FileDraggableDirective.prototype._onDragEnter = function ($event) {
                    this._preventDefault($event);
                    this._inputFocusClass = true;
                };
                /**
                 * Change the style of the drag area when a file drag out.
                 *
                 * @param {$event} $event - DOM $event.
                 */
                FileDraggableDirective.prototype._onDragLeave = function ($event) {
                    this._preventDefault($event);
                    this._inputFocusClass = false;
                };
                /**
                 * Prevent default and stop propagation of the DOM event.
                 *
                 * @param {$event} $event - DOM $event.
                 */
                FileDraggableDirective.prototype._preventDefault = function ($event) {
                    $event.stopPropagation();
                    $event.preventDefault();
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], FileDraggableDirective.prototype, "onFilesDropped", void 0);
                FileDraggableDirective = __decorate([
                    core_1.Directive({
                        selector: '[file-draggable]',
                        host: {
                            '(drop)': '_onDropFiles($event)',
                            '(dragenter)': '_onDragEnter($event)',
                            '(dragleave)': '_onDragLeave($event)',
                            '(dragover)': '_preventDefault($event)',
                            '[class.input-focus]': '_inputFocusClass'
                        }
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], FileDraggableDirective);
                return FileDraggableDirective;
            }());
            exports_1("FileDraggableDirective", FileDraggableDirective);
        }
    }
});
//# sourceMappingURL=file-draggable.directive.js.map