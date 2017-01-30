!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in v||(v[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==g.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=v[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(g.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=v[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return y[e]||(y[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},{id:r.name});t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=v[s],f=y[s];f?l=f.exports:c&&!c.declarative?l=c.esModule:c?(d(c),f=c.module,l=f.exports):l=p(s),f&&f.importers?(f.importers.push(t),t.dependencies.push(f)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=v[e];if(t)t.declarative?f(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=p(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=v[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);void 0!==typeof c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){var t={};if(("object"==typeof r||"function"==typeof r)&&r!==e)if(m)for(var n in r)"default"!==n&&c(t,r,n);else{var o=r&&r.hasOwnProperty;for(var n in r)"default"===n||o&&!r.hasOwnProperty(n)||(t[n]=r[n])}return t["default"]=r,x(t,"__useDefault",{value:!0}),t}function c(e,r,t){try{var n;(n=Object.getOwnPropertyDescriptor(r,t))&&x(e,t,n)}catch(o){return e[t]=r[t],!1}}function f(r,t){var n=v[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==g.call(t,u)&&(v[u]?f(u,t):p(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function p(e){if(I[e])return I[e];if("@node/"==e.substr(0,6))return I[e]=s(D(e.substr(6)));var r=v[e];if(!r)throw"Module "+e+" not present.";return a(e),f(e,[]),v[e]=void 0,r.declarative&&x(r.module.exports,"__esModule",{value:!0}),I[e]=r.declarative?r.module.exports:r.esModule}var v={},g=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},m=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(h){m=!1}var x;!function(){try{Object.defineProperty({},"a",{})&&(x=Object.defineProperty)}catch(e){x=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var y={},D="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,I={"@empty":{}};return function(e,n,o,a){return function(u){u(function(u){for(var d={_nodeRequire:D,register:r,registerDynamic:t,get:p,set:function(e,r){I[e]=r},newModule:function(e){return e}},i=0;i<n.length;i++)(function(e,r){r&&r.__esModule?I[e]=r:I[e]=s(r)})(n[i],arguments[i]);a(d);var l=p(e[0]);if(e.length>1)for(var i=1;i<e.length;i++)p(e[i]);return o?l["default"]:l})}}}("undefined"!=typeof self?self:global)

(["1"], ["3","5","c","8"], true, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.registerDynamic("2", ["3", "4", "5"], true, function ($__require, exports, module) {
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
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("3");
    var upload_service_1 = $__require("4");
    var ng2_alfresco_core_1 = $__require("5");
    var ERROR_FOLDER_ALREADY_EXIST = 409;
    var UploadDragAreaComponent = UploadDragAreaComponent_1 = function () {
        function UploadDragAreaComponent(_uploaderService, translate) {
            this._uploaderService = _uploaderService;
            this.showUdoNotificationBar = true;
            this.versioning = false;
            this.currentFolderPath = '/';
            this.rootFolderId = UploadDragAreaComponent_1.DEFAULT_ROOT_ID;
            this.onSuccess = new core_1.EventEmitter();
            this.translate = translate;
            translate.addTranslationFolder('ng2-alfresco-upload', 'node_modules/ng2-alfresco-upload/src');
        }
        UploadDragAreaComponent.prototype.ngOnChanges = function (changes) {
            var formFields = this.createFormFields();
            this._uploaderService.setOptions(formFields, this.versioning);
        };
        UploadDragAreaComponent.prototype.onFilesDropped = function (files) {
            if (files.length) {
                if (this.checkValidity(files)) {
                    this._uploaderService.addToQueue(files);
                    this._uploaderService.uploadFilesInTheQueue(this.rootFolderId, this.currentFolderPath, this.onSuccess);
                    var latestFilesAdded = this._uploaderService.getQueue();
                    if (this.showUdoNotificationBar) {
                        this._showUndoNotificationBar(latestFilesAdded);
                    }
                } else {
                    var errorMessage = void 0;
                    errorMessage = this.translate.get('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
                    if (this.showUdoNotificationBar) {
                        this._showErrorNotificationBar(errorMessage.value);
                    } else {
                        console.error(errorMessage.value);
                    }
                }
            }
        };
        UploadDragAreaComponent.prototype.checkValidity = function (files) {
            if (files.length && files[0].type === '') {
                return false;
            }
            return true;
        };
        UploadDragAreaComponent.prototype.onFilesEntityDropped = function (item) {
            var _this = this;
            item.file(function (file) {
                _this._uploaderService.addToQueue([file]);
                var path = item.fullPath.replace(item.name, '');
                var filePath = _this.currentFolderPath + path;
                _this._uploaderService.uploadFilesInTheQueue(_this.rootFolderId, filePath, _this.onSuccess);
            });
        };
        UploadDragAreaComponent.prototype.onFolderEntityDropped = function (folder) {
            var _this = this;
            if (folder.isDirectory) {
                var relativePath = folder.fullPath.replace(folder.name, '');
                relativePath = this.currentFolderPath + relativePath;
                this._uploaderService.createFolder(relativePath, folder.name).subscribe(function (message) {
                    _this.onSuccess.emit({
                        value: 'Created folder'
                    });
                    var dirReader = folder.createReader();
                    dirReader.readEntries(function (entries) {
                        for (var i = 0; i < entries.length; i++) {
                            _this._traverseFileTree(entries[i]);
                        }
                        if (_this.showUdoNotificationBar) {
                            var latestFilesAdded = _this._uploaderService.getQueue();
                            _this._showUndoNotificationBar(latestFilesAdded);
                        }
                    });
                }, function (error) {
                    var errorMessagePlaceholder = _this.getErrorMessage(error.response);
                    var errorMessage = _this.formatString(errorMessagePlaceholder, [folder.name]);
                    if (_this.showUdoNotificationBar) {
                        _this._showErrorNotificationBar(errorMessage);
                    } else {
                        console.error(errorMessage);
                    }
                });
            }
        };
        UploadDragAreaComponent.prototype._traverseFileTree = function (item) {
            if (item.isFile) {
                this.onFilesEntityDropped(item);
            } else {
                if (item.isDirectory) {
                    this.onFolderEntityDropped(item);
                }
            }
        };
        UploadDragAreaComponent.prototype._showUndoNotificationBar = function (latestFilesAdded) {
            if (componentHandler) {
                componentHandler.upgradeAllRegistered();
            }
            var messageTranslate, actionTranslate;
            messageTranslate = this.translate.get('FILE_UPLOAD.MESSAGES.PROGRESS');
            actionTranslate = this.translate.get('FILE_UPLOAD.ACTION.UNDO');
            this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
                message: messageTranslate.value,
                timeout: 3000,
                actionHandler: function () {
                    latestFilesAdded.forEach(function (uploadingFileModel) {
                        uploadingFileModel.emitAbort();
                    });
                },
                actionText: actionTranslate.value
            });
        };
        UploadDragAreaComponent.prototype._showErrorNotificationBar = function (errorMessage) {
            if (componentHandler) {
                componentHandler.upgradeAllRegistered();
            }
            this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
                message: errorMessage,
                timeout: 3000
            });
        };
        UploadDragAreaComponent.prototype.getErrorMessage = function (response) {
            if (response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST) {
                var errorMessage = void 0;
                errorMessage = this.translate.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
                return errorMessage.value;
            }
        };
        UploadDragAreaComponent.prototype.formatString = function (message, keys) {
            if (message) {
                var i = keys.length;
                while (i--) {
                    message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
                }
            }
            return message;
        };
        UploadDragAreaComponent.prototype.createFormFields = function () {
            return {
                formFields: {
                    overwrite: true
                }
            };
        };
        return UploadDragAreaComponent;
    }();
    UploadDragAreaComponent.DEFAULT_ROOT_ID = '-root-';
    __decorate([core_1.ViewChild('undoNotificationBar'), __metadata("design:type", Object)], UploadDragAreaComponent.prototype, "undoNotificationBar", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], UploadDragAreaComponent.prototype, "showUdoNotificationBar", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], UploadDragAreaComponent.prototype, "versioning", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], UploadDragAreaComponent.prototype, "currentFolderPath", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], UploadDragAreaComponent.prototype, "rootFolderId", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], UploadDragAreaComponent.prototype, "onSuccess", void 0);
    UploadDragAreaComponent = UploadDragAreaComponent_1 = __decorate([core_1.Component({
        selector: 'alfresco-upload-drag-area',
        moduleId: module.id,
        template: "<div file-draggable id='UploadBorder' class=\"upload-border\"      (onFilesDropped)=\"onFilesDropped($event)\"      (onFilesEntityDropped)=\"onFilesEntityDropped($event)\"      (onFolderEntityDropped)=\"onFolderEntityDropped($event)\"      dropzone=\"\" webkitdropzone=\"*\" #droparea>     <ng-content></ng-content> </div>  <!--Notification bar--> <div id=\"undo-notification-bar\"  class=\"mdl-js-snackbar mdl-snackbar\"      #undoNotificationBar>     <div class=\"mdl-snackbar__text\"></div>     <button data-automation-id=\"undo_upload_button\" class=\"mdl-snackbar__action\" type=\"button\">{{'FILE_UPLOAD.ACTION.UNDO' | translate}}</button> </div>",
        styles: [".upload-border {     vertical-align: middle;     color: #555;     text-align: center; }  .input-focus {     color: #2196F3;     margin-left: 3px;     border: 3px dashed #2196F3; }"]
    }), __metadata("design:paramtypes", [upload_service_1.UploadService, ng2_alfresco_core_1.AlfrescoTranslationService])], UploadDragAreaComponent);
    exports.UploadDragAreaComponent = UploadDragAreaComponent;
    var UploadDragAreaComponent_1;
    return module.exports;
});
$__System.registerDynamic("6", ["3"], true, function ($__require, exports, module) {
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
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("3");
    var FileDraggableDirective = function () {
        function FileDraggableDirective() {
            this.onFilesDropped = new core_1.EventEmitter();
            this.onFilesEntityDropped = new core_1.EventEmitter();
            this.onFolderEntityDropped = new core_1.EventEmitter();
            this._inputFocusClass = false;
        }
        FileDraggableDirective.prototype._onDropFiles = function ($event) {
            this._preventDefault($event);
            var items = $event.dataTransfer.items;
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    if (typeof items[i].webkitGetAsEntry !== 'undefined') {
                        var item = items[i].webkitGetAsEntry();
                        if (item) {
                            this._traverseFileTree(item);
                        }
                    } else {
                        var files = $event.dataTransfer.files;
                        this.onFilesDropped.emit(files);
                    }
                }
            } else {
                var files = $event.dataTransfer.files;
                this.onFilesDropped.emit(files);
            }
            this._inputFocusClass = false;
        };
        FileDraggableDirective.prototype._traverseFileTree = function (item) {
            if (item.isFile) {
                var self_1 = this;
                self_1.onFilesEntityDropped.emit(item);
            } else {
                if (item.isDirectory) {
                    this.onFolderEntityDropped.emit(item);
                }
            }
        };
        FileDraggableDirective.prototype._onDragEnter = function ($event) {
            this._preventDefault($event);
            this._inputFocusClass = true;
        };
        FileDraggableDirective.prototype._onDragLeave = function ($event) {
            this._preventDefault($event);
            this._inputFocusClass = false;
        };
        FileDraggableDirective.prototype._onDragOver = function ($event) {
            this._preventDefault($event);
            this._inputFocusClass = true;
        };
        FileDraggableDirective.prototype._preventDefault = function ($event) {
            $event.stopPropagation();
            $event.preventDefault();
        };
        FileDraggableDirective.prototype.getInputFocus = function () {
            return this._inputFocusClass;
        };
        return FileDraggableDirective;
    }();
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], FileDraggableDirective.prototype, "onFilesDropped", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], FileDraggableDirective.prototype, "onFilesEntityDropped", void 0);
    __decorate([core_1.Output(), __metadata("design:type", core_1.EventEmitter)], FileDraggableDirective.prototype, "onFolderEntityDropped", void 0);
    FileDraggableDirective = __decorate([core_1.Directive({
        selector: '[file-draggable]',
        host: {
            '(drop)': '_onDropFiles($event)',
            '(dragenter)': '_onDragEnter($event)',
            '(dragleave)': '_onDragLeave($event)',
            '(dragover)': '_onDragOver($event)',
            '[class.input-focus]': '_inputFocusClass'
        }
    }), __metadata("design:paramtypes", [])], FileDraggableDirective);
    exports.FileDraggableDirective = FileDraggableDirective;
    return module.exports;
});
$__System.registerDynamic("7", ["3", "4", "5", "8"], true, function ($__require, exports, module) {
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
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("3");
    var upload_service_1 = $__require("4");
    var ng2_alfresco_core_1 = $__require("5");
    $__require("8");
    var ERROR_FOLDER_ALREADY_EXIST = 409;
    var UploadButtonComponent = UploadButtonComponent_1 = function () {
        function UploadButtonComponent(el, _uploaderService, translate) {
            this.el = el;
            this._uploaderService = _uploaderService;
            this.showUdoNotificationBar = true;
            this.uploadFolders = false;
            this.multipleFiles = false;
            this.versioning = false;
            this.acceptedFilesType = '*';
            this.currentFolderPath = '/';
            this.rootFolderId = UploadButtonComponent_1.DEFAULT_ROOT_ID;
            this.onSuccess = new core_1.EventEmitter();
            this.onError = new core_1.EventEmitter();
            this.createFolder = new core_1.EventEmitter();
            this.translate = translate;
            translate.addTranslationFolder('ng2-alfresco-upload', 'node_modules/ng2-alfresco-upload/src');
        }
        UploadButtonComponent.prototype.ngOnChanges = function (changes) {
            var formFields = this.createFormFields();
            this._uploaderService.setOptions(formFields, this.versioning);
        };
        UploadButtonComponent.prototype.onFilesAdded = function ($event) {
            var files = $event.currentTarget.files;
            this.uploadFiles(this.currentFolderPath, files);
            $event.target.value = '';
        };
        UploadButtonComponent.prototype.onDirectoryAdded = function ($event) {
            var _this = this;
            var files = $event.currentTarget.files;
            var hashMapDir = this.convertIntoHashMap(files);
            hashMapDir.forEach(function (filesDir, directoryPath) {
                var directoryName = _this.getDirectoryName(directoryPath);
                var absolutePath = _this.currentFolderPath + _this.getDirectoryPath(directoryPath);
                _this._uploaderService.createFolder(absolutePath, directoryName).subscribe(function (res) {
                    var relativeDir = _this.currentFolderPath + '/' + directoryPath;
                    _this.uploadFiles(relativeDir, filesDir);
                }, function (error) {
                    var errorMessagePlaceholder = _this.getErrorMessage(error.response);
                    if (errorMessagePlaceholder) {
                        _this.onError.emit({ value: errorMessagePlaceholder });
                        var errorMessage = _this.formatString(errorMessagePlaceholder, [directoryName]);
                        if (errorMessage) {
                            _this._showErrorNotificationBar(errorMessage);
                        }
                    }
                    console.log(error);
                });
            });
            $event.target.value = '';
        };
        UploadButtonComponent.prototype.uploadFiles = function (path, files) {
            if (files.length) {
                var latestFilesAdded = this._uploaderService.addToQueue(files);
                this._uploaderService.uploadFilesInTheQueue(this.rootFolderId, path, this.onSuccess);
                if (this.showUdoNotificationBar) {
                    this._showUndoNotificationBar(latestFilesAdded);
                }
            }
        };
        UploadButtonComponent.prototype.convertIntoHashMap = function (files) {
            var directoryMap = new Map();
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                var directory = this.getDirectoryPath(file.webkitRelativePath);
                var filesSomeDir = directoryMap.get(directory) || [];
                filesSomeDir.push(file);
                directoryMap.set(directory, filesSomeDir);
            }
            return directoryMap;
        };
        UploadButtonComponent.prototype.getDirectoryPath = function (directory) {
            var relativeDirPath = '';
            var dirPath = directory.split('/');
            if (dirPath.length > 1) {
                dirPath.pop();
                relativeDirPath = '/' + dirPath.join('/');
            }
            return relativeDirPath;
        };
        UploadButtonComponent.prototype.getDirectoryName = function (directory) {
            var dirPath = directory.split('/');
            if (dirPath.length > 1) {
                return dirPath.pop();
            } else {
                return dirPath[0];
            }
        };
        UploadButtonComponent.prototype._showUndoNotificationBar = function (latestFilesAdded) {
            if (componentHandler) {
                componentHandler.upgradeAllRegistered();
            }
            var messageTranslate, actionTranslate;
            messageTranslate = this.translate.get('FILE_UPLOAD.MESSAGES.PROGRESS');
            actionTranslate = this.translate.get('FILE_UPLOAD.ACTION.UNDO');
            if (this.undoNotificationBar.nativeElement.MaterialSnackbar) {
                this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
                    message: messageTranslate.value,
                    timeout: 3000,
                    actionHandler: function () {
                        latestFilesAdded.forEach(function (uploadingFileModel) {
                            uploadingFileModel.emitAbort();
                        });
                    },
                    actionText: actionTranslate.value
                });
            }
        };
        UploadButtonComponent.prototype.getErrorMessage = function (response) {
            if (response.body && response.body.error.statusCode === ERROR_FOLDER_ALREADY_EXIST) {
                var errorMessage = void 0;
                errorMessage = this.translate.get('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
                return errorMessage.value;
            }
        };
        UploadButtonComponent.prototype._showErrorNotificationBar = function (errorMessage) {
            if (componentHandler) {
                componentHandler.upgradeAllRegistered();
            }
            if (this.undoNotificationBar.nativeElement.MaterialSnackbar) {
                this.undoNotificationBar.nativeElement.MaterialSnackbar.showSnackbar({
                    message: errorMessage,
                    timeout: 3000
                });
            }
        };
        UploadButtonComponent.prototype.formatString = function (message, keys) {
            var i = keys.length;
            while (i--) {
                message = message.replace(new RegExp('\\{' + i + '\\}', 'gm'), keys[i]);
            }
            return message;
        };
        UploadButtonComponent.prototype.createFormFields = function () {
            return {
                formFields: {
                    overwrite: true
                }
            };
        };
        return UploadButtonComponent;
    }();
    UploadButtonComponent.DEFAULT_ROOT_ID = '-root-';
    __decorate([core_1.ViewChild('undoNotificationBar'), __metadata("design:type", Object)], UploadButtonComponent.prototype, "undoNotificationBar", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], UploadButtonComponent.prototype, "showUdoNotificationBar", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], UploadButtonComponent.prototype, "uploadFolders", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], UploadButtonComponent.prototype, "multipleFiles", void 0);
    __decorate([core_1.Input(), __metadata("design:type", Boolean)], UploadButtonComponent.prototype, "versioning", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], UploadButtonComponent.prototype, "acceptedFilesType", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], UploadButtonComponent.prototype, "currentFolderPath", void 0);
    __decorate([core_1.Input(), __metadata("design:type", String)], UploadButtonComponent.prototype, "rootFolderId", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], UploadButtonComponent.prototype, "onSuccess", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], UploadButtonComponent.prototype, "onError", void 0);
    __decorate([core_1.Output(), __metadata("design:type", Object)], UploadButtonComponent.prototype, "createFolder", void 0);
    UploadButtonComponent = UploadButtonComponent_1 = __decorate([core_1.Component({
        selector: 'alfresco-upload-button',
        moduleId: module.id,
        template: "<form>     <!--Files Upload-->     <div *ngIf=\"!uploadFolders\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-button--file\">         <i class=\"material-icons\">file_upload</i>          <!--Multiple Files Upload-->         <span *ngIf=\"multipleFiles\">             <label for=\"upload-multiple-files\">{{'FILE_UPLOAD.BUTTON.UPLOAD_FILE' | translate}}</label>             <input id=\"upload-multiple-files\" data-automation-id=\"upload-multiple-files\" type=\"file\" name=\"uploadFiles\"                    (change)=\"onFilesAdded($event)\"                    multiple=\"multiple\"                    accept=\"{{acceptedFilesType}}\"                    #uploadFiles>         </span>          <!--Single Files Upload-->         <span *ngIf=\"!multipleFiles\">             <label for=\"upload-single-file\">{{'FILE_UPLOAD.BUTTON.UPLOAD_FILE' | translate}}</label>             <input id=\"upload-single-file\" data-automation-id=\"upload-single-file\" type=\"file\" name=\"uploadFiles\"                    (change)=\"onFilesAdded($event)\"                    accept=\"{{acceptedFilesType}}\"                    #uploadFiles>         </span>     </div>      <!--Folders Upload-->     <div *ngIf=\"uploadFolders\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-button--file\">         <i class=\"material-icons\">file_upload</i>         <label for=\"uploadFolder\">{{'FILE_UPLOAD.BUTTON.UPLOAD_FOLDER' | translate}}</label>         <input id=\"uploadFolder\" data-automation-id=\"uploadFolder\" type=\"file\" name=\"uploadFiles\"                (change)=\"onDirectoryAdded($event)\"                multiple=\"multiple\"                accept=\"{{acceptedFilesType}}\"                webkitdirectory directory                multiple #uploadFolders>     </div> </form>  <!--Notification bar--> <div id=\"undo-notification-bar\"  class=\"mdl-js-snackbar mdl-snackbar\"      #undoNotificationBar>     <div class=\"mdl-snackbar__text\"></div>     <button data-automation-id=\"undo_upload_button\" class=\"mdl-snackbar__action\" type=\"button\">{{'FILE_UPLOAD.ACTION.UNDO' | translate}}</button> </div>",
        styles: [".mdl-button--file input {     cursor: pointer;     height: 100%;     right: 0;     opacity: 0;     position: absolute;     top: 0;     width: 300px;     z-index: 4; }  .mdl-textfield--file .mdl-textfield__input {     box-sizing: border-box;     width: calc(100% - 32px); }  .mdl-textfield--file .mdl-button--file {     right: 0; }"]
    }), __metadata("design:paramtypes", [core_1.ElementRef, upload_service_1.UploadService, ng2_alfresco_core_1.AlfrescoTranslationService])], UploadButtonComponent);
    exports.UploadButtonComponent = UploadButtonComponent;
    var UploadButtonComponent_1;
    return module.exports;
});
$__System.registerDynamic("9", ["3", "5", "4"], true, function ($__require, exports, module) {
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
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("3");
    var ng2_alfresco_core_1 = $__require("5");
    var upload_service_1 = $__require("4");
    var FileUploadingDialogComponent = function () {
        function FileUploadingDialogComponent(cd, translate, _uploaderService) {
            this.cd = cd;
            this._uploaderService = _uploaderService;
            this.isDialogActive = false;
            this.totalCompleted = 0;
            this._isDialogMinimized = false;
            translate.addTranslationFolder('ng2-alfresco-upload', 'node_modules/ng2-alfresco-upload/src');
        }
        FileUploadingDialogComponent.prototype.ngOnInit = function () {
            var _this = this;
            if (this._uploaderService.filesUpload$) {
                this.listSubscription = this._uploaderService.filesUpload$.subscribe(function (fileList) {
                    _this.filesUploadingList = fileList;
                    if (_this.filesUploadingList.length > 0) {
                        _this.isDialogActive = true;
                        _this.cd.detectChanges();
                    }
                });
            }
            if (this._uploaderService.totalCompleted$) {
                this.counterSubscription = this._uploaderService.totalCompleted$.subscribe(function (total) {
                    _this.totalCompleted = total;
                    _this.cd.detectChanges();
                });
            }
        };
        FileUploadingDialogComponent.prototype.toggleShowDialog = function () {
            this.isDialogActive = !this.isDialogActive;
        };
        FileUploadingDialogComponent.prototype.toggleDialogMinimize = function () {
            this._isDialogMinimized = !this._isDialogMinimized;
        };
        FileUploadingDialogComponent.prototype.ngOnDestroy = function () {
            this.listSubscription.unsubscribe();
            this.counterSubscription.unsubscribe();
            this.cd.detach();
        };
        return FileUploadingDialogComponent;
    }();
    FileUploadingDialogComponent = __decorate([core_1.Component({
        selector: 'file-uploading-dialog',
        moduleId: module.id,
        template: "<div class=\"file-dialog\" [ngClass]=\"{show: isDialogActive}\">     <div class=\"header\">         <div class=\"title\">             <span id=\"total-upload-completed\">{{totalCompleted}}</span> {{'FILE_UPLOAD.MESSAGES.COMPLETED' | translate}}         </div>         <div class=\"buttons\">             <div class=\"minimize-button\" [ngClass]=\"{active: _isDialogMinimized}\" (keyup.enter)=\"toggleDialogMinimize()\" (click)=\"toggleDialogMinimize()\" tabindex=\"0\">                 <i class=\"material-icons down\" title=\"minimize upload list\">keyboard_arrow_down</i>                 <i class=\"material-icons up\" title=\"expand upload list\">keyboard_arrow_up</i>             </div>              <div class=\"close-button\" (click)=\"toggleShowDialog()\" (keyup.enter)=\"toggleShowDialog()\" tabindex=\"0\" title=\"close upload list\">                 <i class=\"material-icons\">clear</i>             </div>         </div>     </div>     <div class=\"body-dialog\" *ngIf=\"filesUploadingList\"  [ngClass]=\"{hide: _isDialogMinimized}\">         <alfresco-file-uploading-list [filesUploadingList]=\"filesUploadingList\"></alfresco-file-uploading-list>     </div> </div>",
        styles: [":host{     position: fixed;     bottom: 0;     width: 100%;     z-index: 1; }  :host .show {     display: block !important; }  :host .hide {     display: none !important; }  :host .file-dialog {     width: 700px;     display: none;     -webkit-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .2);     box-shadow: -2px -1px 8px 3px rgba(0, 0, 0, .2);     -webkit-border-radius: 2px;     border-radius: 2px;     -webkit-transform: translate3d(0, 0, 0);     transform: translate3d(0, 0, 0);     -webkit-transition-delay: 0s;     transition-delay: 0s;     opacity: 1;     -webkit-transition: transform .15s cubic-bezier(0.4, 0.0, 1, 1), opacity .15s cubic-bezier(0.4, 0.0, 1, 1), visibility 0ms linear .15s;     transition: transform .15s cubic-bezier(0.4, 0.0, 1, 1), opacity .15s cubic-bezier(0.4, 0.0, 1, 1), visibility 0ms linear .15s;     bottom: 0px;     left: auto;     max-height: 350px;     overflow: visible;     right: 24px;     position: fixed; }  :host .file-dialog .header {     background-color: rgb(31, 188, 210);     border: 1px transparent solid;     border-bottom: 1px solid #c7c7c7;     -moz-border-radius-topleft: 2px;     -webkit-border-top-left-radius: 2px;     border-top-left-radius: 2px;     -moz-border-radius-topright: 2px;     -webkit-border-top-right-radius: 2px;     border-top-right-radius: 2px;     bottom: 0px;     color: white;     font-size: 14px;     height: 52px;     line-height: 52px;     padding: 0px 10px 0px 10px; }  :host .file-dialog .header .title {     float: left;     min-width: 150px;     color: white; }  :host .file-dialog .header .buttons {     float: right;     padding: 10px 10px 10px 10px;     text-align: center;     color: white;     font-size: 14px;     opacity: 0.5; }  :host .file-dialog .header .close-button {     cursor: pointer;     float: left;     height: 35px;     width: 35px;     -webkit-border-radius: 2px;     -moz-border-radius: 2px;     border-radius: 2px;     border: 1px solid transparent; }  :host .file-dialog .header .close-button:hover {     border: 1px solid white;     opacity: 1.0; }  .minimize-button {     display: flex;     align-items: center;     justify-content: center; }  :host .file-dialog .header .minimize-button {     cursor: pointer;     float: left;     height: 35px;     width: 35px;     margin-right: 10px;     -webkit-border-radius: 2px;     -moz-border-radius: 2px;     border-radius: 2px;     border: 1px solid transparent; }  .up {     display: none; }  .down {     display: block; }  .active .up {     display: block; }  .active .down {     display: none; }  .file-dialog .header .minimize-button:hover {     border: 1px solid white;     opacity: 1.0; }  :host .file-dialog .body-dialog {     float: left;     height: 100%;     margin-top: -4px;     border-bottom: 1px solid #C0C0C0;     border-right: 1px solid #C0C0C0;     border-left: 1px solid #C0C0C0;     max-height: 200px;     overflow-y: auto;     width: 99.6%; }  :host .mdl-data-table th {     text-align: left; }  @media (max-width: 720px) {     :host .file-dialog {         width: 100%;         right: 0;     } }"],
        host: { '[class.dialog-show]': 'toggleShowDialog' }
    }), __metadata("design:paramtypes", [core_1.ChangeDetectorRef, ng2_alfresco_core_1.AlfrescoTranslationService, upload_service_1.UploadService])], FileUploadingDialogComponent);
    exports.FileUploadingDialogComponent = FileUploadingDialogComponent;
    return module.exports;
});
$__System.registerDynamic("a", ["3"], true, function ($__require, exports, module) {
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
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("3");
    var FileUploadingListComponent = function () {
        function FileUploadingListComponent(el) {
            this.el = el;
            console.log('filesUploadingList constructor', el);
        }
        FileUploadingListComponent.prototype.abort = function (id) {
            var file = this.filesUploadingList.filter(function (uploadingFileModel) {
                return uploadingFileModel.id === id;
            });
            file[0].emitAbort();
        };
        FileUploadingListComponent.prototype.cancelAllFiles = function ($event) {
            if ($event) {
                $event.preventDefault();
            }
            this.filesUploadingList.forEach(function (uploadingFileModel) {
                uploadingFileModel.emitAbort();
            });
        };
        FileUploadingListComponent.prototype.isUploadCompleted = function () {
            var isPending = false;
            var isAllCompleted = true;
            for (var i = 0; i < this.filesUploadingList.length && !isPending; i++) {
                var uploadingFileModel = this.filesUploadingList[i];
                if (!uploadingFileModel.done && !uploadingFileModel.abort) {
                    isPending = true;
                    isAllCompleted = false;
                }
            }
            return isAllCompleted;
        };
        return FileUploadingListComponent;
    }();
    __decorate([core_1.Input(), __metadata("design:type", Array)], FileUploadingListComponent.prototype, "filesUploadingList", void 0);
    FileUploadingListComponent = __decorate([core_1.Component({
        selector: 'alfresco-file-uploading-list',
        moduleId: module.id,
        template: "<div [ngClass]=\"{hide:  isUploadCompleted()}\" [ngClass]=\"{show:   !isUploadCompleted()}\"      class=\"body-dialog-header\">     <div class=\"body-dialog-action\"></div>     <div class=\"body-dialog-cancel\"><a data-automation-id=\"cancel_upload_all\" href=\"#\" (click)=\"cancelAllFiles($event)\">{{'FILE_UPLOAD.BUTTON.CANCEL' | translate}}</a></div> </div> <table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\">     <tr>         <th>{{'FILE_UPLOAD.FILE_INFO.NAME' | translate}}</th>         <th>{{'FILE_UPLOAD.FILE_INFO.PROGRESS' | translate}}</th>         <th class=\"mdl-cell--hide-phone size-column\">{{'FILE_UPLOAD.FILE_INFO.SIZE' | translate}}</th>         <th>{{'FILE_UPLOAD.FILE_INFO.ACTION' | translate}}</th>     </tr>     <tr *ngFor=\"let file of filesUploadingList\" tabindex=\"0\">         <td attr.data-automation-id=\"dialog_{{file.name}}\" class=\"mdl-data-table__cell--non-numeric\"><div class=\"truncate\">{{file.name}}</div></td>         <td _ngcontent-hvq-3=\"\">             <div _ngcontent-hvq-3=\"\" class=\"mdl-progress mdl-js-progress is-upgraded\" id=\"{{file.id}}\"                  data-upgraded=\",MaterialProgress\">                 <div class=\"progressbar bar bar1\" attr.data-automation-id=\"dialog_progress_{{file.name}}\" [style.width.%]=\"file.progress.percent\"></div>                 <div class=\"bufferbar bar bar2\" style=\"width: 100%;\"></div>                 <div class=\"auxbar bar bar3\" style=\"width: 0%;\"></div>             </div>         </td>         <td class=\"mdl-data-table__cell--non-numeric mdl-cell--hide-phone size-column\" attr.data-automation-id=\"{{file.name}}_filesize\">{{file.size}}</td>         <td>             <span *ngIf=\"file.done && !file.abort\" ><i data-automation-id=\"done_icon\" class=\"material-icons action-icons\">done</i></span>             <span *ngIf=\"file.uploading\" (click)=\"abort(file.id)\" class=\"cursor\" tabindex=\"0\"><i data-automation-id=\"abort_cancel_upload\"                                                                                      class=\"material-icons action-icons\">                 remove_circle_outline</i></span>             <span *ngIf=\"file.abort\"><i class=\"material-icons action-icons\" data-automation-id=\"upload_stopped\" tabindex=\"0\">remove_circle</i></span>         </td>     </tr> </table>",
        styles: [".mdl-data-table {     width: 100%;     border: 0px; }  .cursor {     cursor: pointer; }  .body-dialog-header {     display: -webkit-box;     display: -moz-box;     display: -ms-flexbox;     display: -webkit-flex;     display: flex;     background-color: #f5f5f5;     border-bottom: solid 1px #eee;     height: 30px;     line-height: 30px; }  .body-dialog-action {     -webkit-flex: 1 1 auto;     flex: 1 1 auto;     overflow: hidden;     padding: 0 18px;     text-overflow: ellipsis;     white-space: nowrap;     word-wrap: break-word; }  .body-dialog-cancel {     -webkit-flex: none;     flex: none;     display: inline;     padding-right: 13px;     text-align: right; }  .action-icons {     text-align: center;     width: 100%; } :host .truncate {     margin-left: auto;     white-space: nowrap;     overflow: hidden;     text-overflow: ellipsis; }  :host .mdl-progress{     width: 150px; }  @media (max-device-width: 360px){     .truncate {         max-width: 50px;         margin-left: 0px;     } }  @media (max-device-width: 568px) {     .truncate {         width: 60px;     }     .mdl-progress {         width: 60px;     } }  @media (max-width: 740px) {     .truncate {         max-width: 80px;     }      .mdl-progress {         max-width: 70px;     }      .size-column {         display: none;     } }  @media (min-width: 740px) {     .truncate {         width: 249px;     }      .size-column {         display: table-cell;     } }"]
    }), __metadata("design:paramtypes", [core_1.ElementRef])], FileUploadingListComponent);
    exports.FileUploadingListComponent = FileUploadingListComponent;
    return module.exports;
});
$__System.registerDynamic('b', [], true, function ($__require, exports, module) {
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
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var FileModel = function () {
        function FileModel(file) {
            this.done = false;
            this.error = false;
            this.abort = false;
            this.uploading = false;
            this.file = file;
            this.id = this._generateId();
            this.name = file.name;
            this.size = this._getFileSize(file.size);
            this.progress = {
                loaded: 0,
                total: 0,
                percent: 0
            };
        }
        FileModel.prototype.setProgres = function (progress) {
            this.progress = progress;
        };
        FileModel.prototype.emitProgres = function (progress) {
            this.setProgres(progress);
            this.promiseUpload.emit('progress', progress);
        };
        FileModel.prototype.setError = function () {
            this.error = true;
        };
        FileModel.prototype.emitError = function () {
            this.setError();
            this.promiseUpload.emit('error');
        };
        FileModel.prototype.setUploading = function () {
            this.uploading = true;
        };
        FileModel.prototype.setPromiseUpload = function (promiseUpload) {
            this.promiseUpload = promiseUpload;
        };
        FileModel.prototype.setAbort = function () {
            if (!this.done && !this.error) {
                this.abort = true;
                this.uploading = false;
            }
        };
        FileModel.prototype.emitAbort = function () {
            this.setAbort();
            this.promiseUpload.abort();
        };
        FileModel.prototype.onFinished = function (status, statusText, response) {
            this.status = status;
            this.statusText = statusText;
            this.response = response;
            this.done = true;
            this.uploading = false;
        };
        FileModel.prototype._getFileSize = function (sizeinbytes) {
            var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
            var size = sizeinbytes;
            var i = 0;
            while (size > 900) {
                size /= 1000;
                i++;
            }
            return Math.round(Math.round(size * 100) / 100) + ' ' + fSExt[i];
        };
        FileModel.prototype._generateId = function () {
            return 'uploading-file-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
        };
        return FileModel;
    }();
    exports.FileModel = FileModel;
    return module.exports;
});
$__System.registerDynamic("4", ["3", "c", "5", "b"], true, function ($__require, exports, module) {
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
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1 = $__require("3");
    var Observable_1 = $__require("c");
    var ng2_alfresco_core_1 = $__require("5");
    var file_model_1 = $__require("b");
    var UploadService = function () {
        function UploadService(apiService) {
            var _this = this;
            this.apiService = apiService;
            this.formFields = {};
            this.queue = [];
            this.versioning = false;
            this.totalCompleted = 0;
            this.filesUpload$ = new Observable_1.Observable(function (observer) {
                return _this.filesUploadObserverProgressBar = observer;
            }).share();
            this.totalCompleted$ = new Observable_1.Observable(function (observer) {
                return _this.totalCompletedObserver = observer;
            }).share();
        }
        UploadService.prototype.setOptions = function (options, versioning) {
            this.formFields = options.formFields != null ? options.formFields : this.formFields;
            this.versioning = versioning != null ? versioning : this.versioning;
        };
        UploadService.prototype.addToQueue = function (files) {
            var latestFilesAdded = [];
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                if (this.isFile(file)) {
                    var uploadingFileModel = new file_model_1.FileModel(file);
                    latestFilesAdded.push(uploadingFileModel);
                    this.queue.push(uploadingFileModel);
                    if (this.filesUploadObserverProgressBar) {
                        this.filesUploadObserverProgressBar.next(this.queue);
                    }
                }
            }
            return latestFilesAdded;
        };
        UploadService.prototype.uploadFilesInTheQueue = function (rootId, directory, elementEmit) {
            var _this = this;
            var filesToUpload = this.queue.filter(function (uploadingFileModel) {
                return !uploadingFileModel.uploading && !uploadingFileModel.done && !uploadingFileModel.abort && !uploadingFileModel.error;
            });
            var opts = {};
            opts.renditions = 'doclib';
            if (this.versioning) {
                opts.overwrite = true;
                opts.majorVersion = true;
            } else {
                opts.autoRename = true;
            }
            filesToUpload.forEach(function (uploadingFileModel) {
                uploadingFileModel.setUploading();
                var promiseUpload = _this.apiService.getInstance().upload.uploadFile(uploadingFileModel.file, directory, rootId, null, opts).on('progress', function (progress) {
                    uploadingFileModel.setProgres(progress);
                    _this.updateFileListStream(_this.queue);
                }).on('abort', function () {
                    uploadingFileModel.setAbort();
                    elementEmit.emit({
                        value: 'File aborted'
                    });
                }).on('error', function () {
                    uploadingFileModel.setError();
                    elementEmit.emit({
                        value: 'Error file uploaded'
                    });
                }).on('success', function (data) {
                    elementEmit.emit({
                        value: data
                    });
                    uploadingFileModel.onFinished(data.status, data.statusText, data.response);
                    _this.updateFileListStream(_this.queue);
                    if (!uploadingFileModel.abort && !uploadingFileModel.error) {
                        _this.updateFileCounterStream(++_this.totalCompleted);
                    }
                });
                uploadingFileModel.setPromiseUpload(promiseUpload);
            });
        };
        UploadService.prototype.getQueue = function () {
            return this.queue;
        };
        UploadService.prototype.isFile = function (file) {
            return file !== null && (file instanceof Blob || file.name && file.size);
        };
        UploadService.prototype.createFolder = function (relativePath, name) {
            return Observable_1.Observable.fromPromise(this.callApiCreateFolder(relativePath, name)).map(function (res) {
                return res;
            }).do(function (data) {
                return console.log('Node data', data);
            }).catch(this.handleError);
        };
        UploadService.prototype.callApiCreateFolder = function (relativePath, name) {
            return this.apiService.getInstance().nodes.createFolder(name, relativePath);
        };
        UploadService.prototype.handleError = function (error) {
            console.error(error);
            return Observable_1.Observable.throw(error || 'Server error');
        };
        UploadService.prototype.updateFileListStream = function (fileList) {
            if (this.filesUploadObserverProgressBar) {
                this.filesUploadObserverProgressBar.next(fileList);
            }
        };
        UploadService.prototype.updateFileCounterStream = function (total) {
            if (this.totalCompletedObserver) {
                this.totalCompletedObserver.next(total);
            }
        };
        return UploadService;
    }();
    UploadService = __decorate([core_1.Injectable(), __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoApiService])], UploadService);
    exports.UploadService = UploadService;
    return module.exports;
});
$__System.registerDynamic("1", ["3", "5", "2", "6", "7", "9", "a", "4"], true, function ($__require, exports, module) {
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
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    var core_1 = $__require("3");
    var ng2_alfresco_core_1 = $__require("5");
    var upload_drag_area_component_1 = $__require("2");
    var file_draggable_directive_1 = $__require("6");
    var upload_button_component_1 = $__require("7");
    var file_uploading_dialog_component_1 = $__require("9");
    var file_uploading_list_component_1 = $__require("a");
    var upload_service_1 = $__require("4");
    __export($__require("7"));
    __export($__require("9"));
    __export($__require("2"));
    __export($__require("4"));
    __export($__require("6"));
    __export($__require("a"));
    exports.UPLOAD_DIRECTIVES = [file_draggable_directive_1.FileDraggableDirective, upload_drag_area_component_1.UploadDragAreaComponent, upload_button_component_1.UploadButtonComponent, file_uploading_dialog_component_1.FileUploadingDialogComponent, file_uploading_list_component_1.FileUploadingListComponent];
    exports.UPLOAD_PROVIDERS = [upload_service_1.UploadService];
    var UploadModule = UploadModule_1 = function () {
        function UploadModule() {}
        UploadModule.forRoot = function () {
            return {
                ngModule: UploadModule_1,
                providers: exports.UPLOAD_PROVIDERS.slice()
            };
        };
        return UploadModule;
    }();
    UploadModule = UploadModule_1 = __decorate([core_1.NgModule({
        imports: [ng2_alfresco_core_1.CoreModule],
        declarations: exports.UPLOAD_DIRECTIVES.slice(),
        providers: exports.UPLOAD_PROVIDERS.slice(),
        exports: exports.UPLOAD_DIRECTIVES.slice()
    }), __metadata("design:paramtypes", [])], UploadModule);
    exports.UploadModule = UploadModule;
    var UploadModule_1;
    

    return module.exports;
});
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define(["@angular/core","ng2-alfresco-core","rxjs/Observable","rxjs/Rx"], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory(require("@angular/core"), require("ng2-alfresco-core"), require("rxjs/Observable"), require("rxjs/Rx"));
  else
    throw new Error("Module must be loaded as AMD or CommonJS");
});
//# sourceMappingURL=ng2-alfresco-upload.js.map