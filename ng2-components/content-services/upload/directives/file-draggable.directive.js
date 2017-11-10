"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@adf/core");
var core_2 = require("@angular/core");
var FileDraggableDirective = (function () {
    function FileDraggableDirective(el, ngZone) {
        this.ngZone = ngZone;
        this.enabled = true;
        this.filesDropped = new core_2.EventEmitter();
        this.filesEntityDropped = new core_2.EventEmitter();
        this.folderEntityDropped = new core_2.EventEmitter();
        this.cssClassName = 'file-draggable__input-focus';
        this.element = el.nativeElement;
    }
    FileDraggableDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            _this.element.addEventListener('dragenter', _this.onDragEnter.bind(_this));
            _this.element.addEventListener('dragover', _this.onDragOver.bind(_this));
            _this.element.addEventListener('dragleave', _this.onDragLeave.bind(_this));
            _this.element.addEventListener('drop', _this.onDropFiles.bind(_this));
        });
    };
    FileDraggableDirective.prototype.ngOnDestroy = function () {
        this.element.removeEventListener('dragenter', this.onDragEnter);
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('dragleave', this.onDragLeave);
        this.element.removeEventListener('drop', this.onDropFiles);
    };
    /**
     * Method called when files is dropped in the drag and drop area.
     * @param event DOM event.
     */
    FileDraggableDirective.prototype.onDropFiles = function (event) {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);
            var items = event.dataTransfer.items;
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    if (typeof items[i].webkitGetAsEntry !== 'undefined') {
                        var item = items[i].webkitGetAsEntry();
                        if (item) {
                            if (item.isFile) {
                                this.filesEntityDropped.emit(item);
                            }
                            else if (item.isDirectory) {
                                this.folderEntityDropped.emit(item);
                            }
                        }
                    }
                    else {
                        var files = core_1.FileUtils.toFileArray(event.dataTransfer.files);
                        this.filesDropped.emit(files);
                    }
                }
            }
            else {
                // safari or FF
                var files = core_1.FileUtils.toFileArray(event.dataTransfer.files);
                this.filesDropped.emit(files);
            }
            this.element.classList.remove(this.cssClassName);
        }
    };
    /**
     * Change the style of the drag area when a file drag in.
     *
     * @param {event} event - DOM event.
     */
    FileDraggableDirective.prototype.onDragEnter = function (event) {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);
            this.element.classList.add(this.cssClassName);
        }
    };
    /**
     * Change the style of the drag area when a file drag out.
     *
     * @param {event} event - DOM event.
     */
    FileDraggableDirective.prototype.onDragLeave = function (event) {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);
            this.element.classList.remove(this.cssClassName);
        }
    };
    /**
     * Change the style of the drag area when a file is over the drag area.
     *
     * @param event
     */
    FileDraggableDirective.prototype.onDragOver = function (event) {
        if (this.enabled && !event.defaultPrevented) {
            this.preventDefault(event);
            this.element.classList.add(this.cssClassName);
        }
    };
    /**
     * Prevent default and stop propagation of the DOM event.
     *
     * @param {event} $event - DOM event.
     */
    FileDraggableDirective.prototype.preventDefault = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };
    __decorate([
        core_2.Input('file-draggable')
    ], FileDraggableDirective.prototype, "enabled", void 0);
    __decorate([
        core_2.Output()
    ], FileDraggableDirective.prototype, "filesDropped", void 0);
    __decorate([
        core_2.Output()
    ], FileDraggableDirective.prototype, "filesEntityDropped", void 0);
    __decorate([
        core_2.Output()
    ], FileDraggableDirective.prototype, "folderEntityDropped", void 0);
    FileDraggableDirective = __decorate([
        core_2.Directive({
            selector: '[file-draggable]'
        })
    ], FileDraggableDirective);
    return FileDraggableDirective;
}());
exports.FileDraggableDirective = FileDraggableDirective;
