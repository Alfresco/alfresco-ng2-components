"use strict";
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-input-rename  */
var core_1 = require("@angular/core");
var file_utils_1 = require("../utils/file-utils");
var UploadDirective = /** @class */ (function () {
    function UploadDirective(el, renderer, ngZone) {
        this.el = el;
        this.renderer = renderer;
        this.ngZone = ngZone;
        /** Enables/disables uploading. */
        this.enabled = true;
        /** Upload mode. Can be "drop" (receives dropped files) or "click"
         * (clicking opens a file dialog). Both modes can be active at once.
         */
        this.mode = ['drop']; // click|drop
        this.isDragging = false;
        this.cssClassName = 'adf-upload__dragging';
        this.element = el.nativeElement;
    }
    UploadDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (this.isClickMode() && this.renderer) {
            var inputUpload = this.renderer.createElement('input');
            this.upload = this.el.nativeElement.parentElement.appendChild(inputUpload);
            this.upload.type = 'file';
            this.upload.style.display = 'none';
            this.upload.addEventListener('change', function (event) { return _this.onSelectFiles(event); });
            if (this.multiple) {
                this.upload.setAttribute('multiple', '');
            }
            if (this.accept) {
                this.upload.setAttribute('accept', this.accept);
            }
            if (this.directory) {
                this.upload.setAttribute('webkitdirectory', '');
            }
        }
        if (this.isDropMode()) {
            this.ngZone.runOutsideAngular(function () {
                _this.element.addEventListener('dragenter', _this.onDragEnter.bind(_this));
                _this.element.addEventListener('dragover', _this.onDragOver.bind(_this));
                _this.element.addEventListener('dragleave', _this.onDragLeave.bind(_this));
                _this.element.addEventListener('drop', _this.onDrop.bind(_this));
            });
        }
    };
    UploadDirective.prototype.ngOnDestroy = function () {
        this.element.removeEventListener('dragenter', this.onDragEnter);
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('dragleave', this.onDragLeave);
        this.element.removeEventListener('drop', this.onDrop);
    };
    UploadDirective.prototype.onClick = function (event) {
        if (this.isClickMode() && this.upload) {
            event.preventDefault();
            this.upload.click();
        }
    };
    UploadDirective.prototype.onDragEnter = function (event) {
        if (this.isDropMode()) {
            this.element.classList.add(this.cssClassName);
            this.isDragging = true;
        }
    };
    UploadDirective.prototype.onDragOver = function (event) {
        event.preventDefault();
        if (this.isDropMode()) {
            this.element.classList.add(this.cssClassName);
            this.isDragging = true;
        }
        return false;
    };
    UploadDirective.prototype.onDragLeave = function (event) {
        if (this.isDropMode()) {
            this.element.classList.remove(this.cssClassName);
            this.isDragging = false;
        }
    };
    UploadDirective.prototype.onDrop = function (event) {
        var _this = this;
        if (this.isDropMode()) {
            event.stopPropagation();
            event.preventDefault();
            this.element.classList.remove(this.cssClassName);
            this.isDragging = false;
            var dataTransfer = this.getDataTransfer(event);
            if (dataTransfer) {
                this.getFilesDropped(dataTransfer).then(function (files) {
                    _this.onUploadFiles(files);
                });
            }
        }
        return false;
    };
    UploadDirective.prototype.onUploadFiles = function (files) {
        if (this.enabled && files.length > 0) {
            var customEvent = new CustomEvent('upload-files', {
                detail: {
                    sender: this,
                    data: this.data,
                    files: files
                },
                bubbles: true
            });
            this.el.nativeElement.dispatchEvent(customEvent);
        }
    };
    UploadDirective.prototype.hasMode = function (mode) {
        return this.enabled && mode && this.mode && this.mode.indexOf(mode) > -1;
    };
    UploadDirective.prototype.isDropMode = function () {
        return this.hasMode('drop');
    };
    UploadDirective.prototype.isClickMode = function () {
        return this.hasMode('click');
    };
    UploadDirective.prototype.getDataTransfer = function (event) {
        if (event && event.dataTransfer) {
            return event.dataTransfer;
        }
        if (event && event.originalEvent && event.originalEvent.dataTransfer) {
            return event.originalEvent.dataTransfer;
        }
        return null;
    };
    /**
     * Extract files from the DataTransfer object used to hold the data that is being dragged during a drag and drop operation.
     * @param dataTransfer DataTransfer object
     */
    UploadDirective.prototype.getFilesDropped = function (dataTransfer) {
        return new Promise(function (resolve) {
            var iterations = [];
            if (dataTransfer) {
                var items = dataTransfer.items;
                if (items) {
                    var _loop_1 = function (i) {
                        if (typeof items[i].webkitGetAsEntry !== 'undefined') {
                            var item_1 = items[i].webkitGetAsEntry();
                            if (item_1) {
                                if (item_1.isFile) {
                                    iterations.push(Promise.resolve({
                                        entry: item_1,
                                        file: items[i].getAsFile(),
                                        relativeFolder: '/'
                                    }));
                                }
                                else if (item_1.isDirectory) {
                                    iterations.push(new Promise(function (resolveFolder) {
                                        file_utils_1.FileUtils.flatten(item_1).then(function (files) { return resolveFolder(files); });
                                    }));
                                }
                            }
                        }
                        else {
                            iterations.push(Promise.resolve({
                                entry: null,
                                file: items[i].getAsFile(),
                                relativeFolder: '/'
                            }));
                        }
                    };
                    for (var i = 0; i < items.length; i++) {
                        _loop_1(i);
                    }
                }
                else {
                    // safari or FF
                    var files = file_utils_1.FileUtils
                        .toFileArray(dataTransfer.files)
                        .map(function (file) { return ({
                        entry: null,
                        file: file,
                        relativeFolder: '/'
                    }); });
                    iterations.push(Promise.resolve(files));
                }
            }
            Promise.all(iterations).then(function (result) {
                resolve(result.reduce(function (a, b) { return a.concat(b); }, []));
            });
        });
    };
    /**
     * Invoked when user selects files or folders by means of File Dialog
     * @param event DOM event
     */
    UploadDirective.prototype.onSelectFiles = function (event) {
        if (this.isClickMode()) {
            var input = event.currentTarget;
            var files = file_utils_1.FileUtils.toFileArray(input.files);
            this.onUploadFiles(files.map(function (file) { return ({
                entry: null,
                file: file,
                relativeFolder: '/'
            }); }));
            event.target.value = '';
        }
    };
    __decorate([
        core_1.Input('adf-upload'),
        __metadata("design:type", Boolean)
    ], UploadDirective.prototype, "enabled", void 0);
    __decorate([
        core_1.Input('adf-upload-data'),
        __metadata("design:type", Object)
    ], UploadDirective.prototype, "data", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], UploadDirective.prototype, "mode", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], UploadDirective.prototype, "multiple", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UploadDirective.prototype, "accept", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], UploadDirective.prototype, "directory", void 0);
    __decorate([
        core_1.HostListener('click', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], UploadDirective.prototype, "onClick", null);
    UploadDirective = __decorate([
        core_1.Directive({
            selector: '[adf-upload]'
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer2, core_1.NgZone])
    ], UploadDirective);
    return UploadDirective;
}());
exports.UploadDirective = UploadDirective;
//# sourceMappingURL=upload.directive.js.map