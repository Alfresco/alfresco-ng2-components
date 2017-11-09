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
var core_1 = require("@angular/core");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var viewer_more_actions_component_1 = require("./viewer-more-actions.component");
var viewer_open_with_component_1 = require("./viewer-open-with.component");
var viewer_sidebar_component_1 = require("./viewer-sidebar.component");
var viewer_toolbar_component_1 = require("./viewer-toolbar.component");
var ViewerComponent = (function () {
    function ViewerComponent(apiService, logService, location, renditionService) {
        this.apiService = apiService;
        this.logService = logService;
        this.location = location;
        this.renditionService = renditionService;
        this.urlFile = '';
        this.fileNodeId = null;
        this.overlayMode = false;
        this.showViewer = true;
        this.showToolbar = true;
        this.allowGoBack = true;
        this.allowDownload = true;
        this.allowPrint = false;
        this.allowShare = false;
        this.allowSidebar = false;
        this.showSidebar = false;
        this.sidebarPosition = 'right';
        this.goBack = new core_1.EventEmitter();
        this.download = new core_1.EventEmitter();
        this.print = new core_1.EventEmitter();
        this.share = new core_1.EventEmitter();
        this.showViewerChange = new core_1.EventEmitter();
        this.extensionChange = new core_1.EventEmitter();
        this.viewerType = 'unknown';
        this.downloadUrl = null;
        this.fileName = 'document';
        this.isLoading = false;
        this.extensionTemplates = [];
        this.externalExtensions = [];
        this.extensions = {
            image: ['png', 'jpg', 'jpeg', 'gif', 'bpm'],
            media: ['wav', 'mp4', 'mp3', 'webm', 'ogg'],
            text: ['txt', 'xml', 'js', 'html', 'json'],
            pdf: ['pdf']
        };
        this.mimeTypes = [
            { mimeType: 'application/x-javascript', type: 'text' },
            { mimeType: 'application/pdf', type: 'pdf' }
        ];
    }
    ViewerComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.showViewer) {
            if (!this.urlFile && !this.blobFile && !this.fileNodeId) {
                throw new Error('Attribute urlFile or fileNodeId or blobFile is required');
            }
            return new Promise(function (resolve, reject) {
                if (_this.blobFile) {
                    _this.displayName = _this.getDisplayName('Unknown');
                    _this.isLoading = true;
                    _this.mimeType = _this.blobFile.type;
                    _this.viewerType = _this.getViewerTypeByMimeType(_this.mimeType);
                    _this.allowDownload = false;
                    // TODO: wrap blob into the data url and allow downloading
                    _this.extensionChange.emit(_this.mimeType);
                    _this.isLoading = false;
                    _this.scrollTop();
                    resolve();
                }
                else if (_this.urlFile) {
                    _this.isLoading = true;
                    var filenameFromUrl = _this.getFilenameFromUrl(_this.urlFile);
                    _this.displayName = _this.getDisplayName(filenameFromUrl);
                    _this.extension = _this.getFileExtension(filenameFromUrl);
                    _this.urlFileContent = _this.urlFile;
                    _this.downloadUrl = _this.urlFile;
                    _this.fileName = _this.displayName;
                    _this.viewerType = _this.getViewerTypeByExtension(_this.extension);
                    if (_this.viewerType === 'unknown') {
                        _this.viewerType = _this.getViewerTypeByMimeType(_this.mimeType);
                    }
                    _this.extensionChange.emit(_this.extension);
                    _this.isLoading = false;
                    _this.scrollTop();
                    resolve();
                }
                else if (_this.fileNodeId) {
                    _this.isLoading = true;
                    _this.apiService.getInstance().nodes.getNodeInfo(_this.fileNodeId).then(function (data) {
                        _this.mimeType = data.content.mimeType;
                        _this.displayName = _this.getDisplayName(data.name);
                        _this.urlFileContent = _this.apiService.getInstance().content.getContentUrl(data.id);
                        _this.extension = _this.getFileExtension(data.name);
                        _this.fileName = data.name;
                        _this.downloadUrl = _this.apiService.getInstance().content.getContentUrl(data.id, true);
                        _this.viewerType = _this.getViewerTypeByExtension(_this.extension);
                        if (_this.viewerType === 'unknown') {
                            _this.viewerType = _this.getViewerTypeByMimeType(_this.mimeType);
                        }
                        if (_this.viewerType === 'unknown') {
                            _this.displayAsPdf(data.id);
                        }
                        else {
                            _this.isLoading = false;
                        }
                        _this.extensionChange.emit(_this.extension);
                        _this.scrollTop();
                        resolve();
                    }, function (error) {
                        _this.isLoading = false;
                        reject(error);
                        _this.logService.error('This node does not exist');
                    });
                }
            });
        }
    };
    ViewerComponent.prototype.getDisplayName = function (name) {
        return this.displayName || name;
    };
    ViewerComponent.prototype.scrollTop = function () {
        window.scrollTo(0, 1);
    };
    ViewerComponent.prototype.getViewerTypeByMimeType = function (mimeType) {
        if (mimeType) {
            mimeType = mimeType.toLowerCase();
            if (mimeType.startsWith('image/')) {
                return 'image';
            }
            if (mimeType.startsWith('text/')) {
                return 'text';
            }
            if (mimeType.startsWith('video/')) {
                return 'media';
            }
            if (mimeType.startsWith('audio/')) {
                return 'media';
            }
            var registered = this.mimeTypes.find(function (t) { return t.mimeType === mimeType; });
            if (registered) {
                return registered.type;
            }
        }
        return 'unknown';
    };
    ViewerComponent.prototype.getViewerTypeByExtension = function (extension) {
        if (extension) {
            extension = extension.toLowerCase();
        }
        if (this.isCustomViewerExtension(extension)) {
            return 'custom';
        }
        if (this.extensions.image.indexOf(extension) >= 0) {
            return 'image';
        }
        if (this.extensions.media.indexOf(extension) >= 0) {
            return 'media';
        }
        if (this.extensions.text.indexOf(extension) >= 0) {
            return 'text';
        }
        if (this.extensions.pdf.indexOf(extension) >= 0) {
            return 'pdf';
        }
        return 'unknown';
    };
    ViewerComponent.prototype.onBackButtonClick = function () {
        if (this.overlayMode) {
            this.close();
        }
        else {
            var event_1 = new ng2_alfresco_core_1.BaseEvent();
            this.goBack.next(event_1);
            if (!event_1.defaultPrevented) {
                this.location.back();
            }
        }
    };
    /**
     * close the viewer
     */
    ViewerComponent.prototype.close = function () {
        if (this.otherMenu) {
            this.otherMenu.hidden = false;
        }
        this.cleanup();
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    };
    /**
     * cleanup before the close
     */
    ViewerComponent.prototype.cleanup = function () {
        this.urlFileContent = '';
        this.displayName = '';
        this.fileNodeId = null;
        this.extension = null;
        this.mimeType = null;
    };
    ViewerComponent.prototype.ngOnDestroy = function () {
        this.cleanup();
    };
    /**
     * get File name from url
     *
     * @param {string} url - url file
     * @returns {string} name file
     */
    ViewerComponent.prototype.getFilenameFromUrl = function (url) {
        var anchor = url.indexOf('#');
        var query = url.indexOf('?');
        var end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
        return url.substring(url.lastIndexOf('/', end) + 1, end);
    };
    /**
     * Get the token from the local storage
     *
     * @param {string} fileName - file name
     * @returns {string} file name extension
     */
    ViewerComponent.prototype.getFileExtension = function (fileName) {
        return fileName.split('.').pop().toLowerCase();
    };
    ViewerComponent.prototype.isCustomViewerExtension = function (extension) {
        var extensions = this.externalExtensions || [];
        if (extension && extensions.length > 0) {
            extension = extension.toLowerCase();
            return extensions.indexOf(extension) >= 0;
        }
        return false;
    };
    /**
     * Litener Keyboard Event
     * @param {KeyboardEvent} event
     */
    ViewerComponent.prototype.handleKeyboardEvent = function (event) {
        var key = event.keyCode;
        if (key === 27 && this.overlayMode) {
            this.close();
        }
    };
    ViewerComponent.prototype.downloadContent = function () {
        if (this.allowDownload && this.downloadUrl && this.fileName) {
            var args = new ng2_alfresco_core_1.BaseEvent();
            this.download.next(args);
            if (!args.defaultPrevented) {
                var link = document.createElement('a');
                link.style.display = 'none';
                link.download = this.fileName;
                link.href = this.downloadUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };
    ViewerComponent.prototype.printContent = function () {
        if (this.allowPrint) {
            var args = new ng2_alfresco_core_1.BaseEvent();
            this.print.next(args);
        }
    };
    ViewerComponent.prototype.shareContent = function () {
        if (this.allowShare) {
            var args = new ng2_alfresco_core_1.BaseEvent();
            this.share.next(args);
        }
    };
    ViewerComponent.prototype.displayAsPdf = function (nodeId) {
        var _this = this;
        this.isLoading = true;
        this.renditionService.getRendition(nodeId, 'pdf').subscribe(function (response) {
            var status = response.entry.status.toString();
            if (status === 'CREATED') {
                _this.isLoading = false;
                _this.showPdfRendition(nodeId);
            }
            else if (status === 'NOT_CREATED') {
                _this.renditionService.convert(nodeId, 'pdf').subscribe({
                    complete: function () {
                        _this.isLoading = false;
                        _this.showPdfRendition(nodeId);
                    },
                    error: function (error) {
                        _this.isLoading = false;
                    }
                });
            }
            else {
                _this.isLoading = false;
            }
        }, function (err) {
            _this.isLoading = false;
        });
    };
    ViewerComponent.prototype.showPdfRendition = function (nodeId) {
        if (nodeId) {
            this.viewerType = 'pdf';
            this.urlFileContent = this.renditionService.getRenditionUrl(nodeId, 'pdf');
        }
    };
    __decorate([
        core_1.ContentChild(viewer_toolbar_component_1.ViewerToolbarComponent)
    ], ViewerComponent.prototype, "toolbar", void 0);
    __decorate([
        core_1.ContentChild(viewer_sidebar_component_1.ViewerSidebarComponent)
    ], ViewerComponent.prototype, "sidebar", void 0);
    __decorate([
        core_1.ContentChild(viewer_open_with_component_1.ViewerOpenWithComponent)
    ], ViewerComponent.prototype, "mnuOpenWith", void 0);
    __decorate([
        core_1.ContentChild(viewer_more_actions_component_1.ViewerMoreActionsComponent)
    ], ViewerComponent.prototype, "mnuMoreActions", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "urlFile", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "blobFile", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "fileNodeId", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "overlayMode", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "showViewer", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "showToolbar", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "displayName", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "allowGoBack", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "allowDownload", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "allowPrint", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "allowShare", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "allowSidebar", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "showSidebar", void 0);
    __decorate([
        core_1.Input()
    ], ViewerComponent.prototype, "sidebarPosition", void 0);
    __decorate([
        core_1.Output()
    ], ViewerComponent.prototype, "goBack", void 0);
    __decorate([
        core_1.Output()
    ], ViewerComponent.prototype, "download", void 0);
    __decorate([
        core_1.Output()
    ], ViewerComponent.prototype, "print", void 0);
    __decorate([
        core_1.Output()
    ], ViewerComponent.prototype, "share", void 0);
    __decorate([
        core_1.Output()
    ], ViewerComponent.prototype, "showViewerChange", void 0);
    __decorate([
        core_1.Output()
    ], ViewerComponent.prototype, "extensionChange", void 0);
    __decorate([
        core_1.HostListener('document:keydown', ['$event'])
    ], ViewerComponent.prototype, "handleKeyboardEvent", null);
    ViewerComponent = __decorate([
        core_1.Component({
            selector: 'adf-viewer',
            templateUrl: './viewer.component.html',
            styleUrls: ['./viewer.component.scss'],
            host: { 'class': 'adf-viewer' },
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ViewerComponent);
    return ViewerComponent;
}());
exports.ViewerComponent = ViewerComponent;
