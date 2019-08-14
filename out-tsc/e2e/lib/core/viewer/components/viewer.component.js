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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var events_1 = require("../../events");
var alfresco_api_service_1 = require("../../services/alfresco-api.service");
var log_service_1 = require("../../services/log.service");
var viewer_more_actions_component_1 = require("./viewer-more-actions.component");
var viewer_open_with_component_1 = require("./viewer-open-with.component");
var viewer_sidebar_component_1 = require("./viewer-sidebar.component");
var viewer_toolbar_component_1 = require("./viewer-toolbar.component");
var view_util_service_1 = require("../services/view-util.service");
var adf_extensions_1 = require("@alfresco/adf-extensions");
var ViewerComponent = /** @class */ (function () {
    function ViewerComponent(apiService, viewUtils, logService, extensionService, el) {
        this.apiService = apiService;
        this.viewUtils = viewUtils;
        this.logService = logService;
        this.extensionService = extensionService;
        this.el = el;
        /** If you want to load an external file that does not come from ACS you
         * can use this URL to specify where to load the file from.
         */
        this.urlFile = '';
        /** Viewer to use with the `urlFile` address (`pdf`, `image`, `media`, `text`).
         * Used when `urlFile` has no filename and extension.
         */
        this.urlFileViewer = null;
        /** Node Id of the file to load. */
        this.nodeId = null;
        /** Shared link id (to display shared file). */
        this.sharedLinkId = null;
        /** If `true` then show the Viewer as a full page over the current content.
         * Otherwise fit inside the parent div.
         */
        this.overlayMode = false;
        /** Hide or show the viewer */
        this.showViewer = true;
        /** Hide or show the toolbar */
        this.showToolbar = true;
        /** @deprecated 3.2.0 */
        /** Allows `back` navigation */
        this.allowGoBack = true;
        /** Toggles downloading. */
        this.allowDownload = true;
        /** Toggles printing. */
        this.allowPrint = false;
        /** Toggles the 'Full Screen' feature. */
        this.allowFullScreen = true;
        /** Toggles before/next navigation. You can use the arrow buttons to navigate
         * between documents in the collection.
         */
        this.allowNavigate = false;
        /** Toggles the "before" ("<") button. Requires `allowNavigate` to be enabled. */
        this.canNavigateBefore = true;
        /** Toggles the next (">") button. Requires `allowNavigate` to be enabled. */
        this.canNavigateNext = true;
        /** Allow the left the sidebar. */
        this.allowLeftSidebar = false;
        /** Allow the right sidebar. */
        this.allowRightSidebar = false;
        /** Toggles PDF thumbnails. */
        this.allowThumbnails = true;
        /** Toggles right sidebar visibility. Requires `allowRightSidebar` to be set to `true`. */
        this.showRightSidebar = false;
        /** Toggles left sidebar visibility. Requires `allowLeftSidebar` to be set to `true`. */
        this.showLeftSidebar = false;
        /** The template for the right sidebar. The template context contains the loaded node data. */
        this.sidebarRightTemplate = null;
        /** The template for the left sidebar. The template context contains the loaded node data. */
        this.sidebarLeftTemplate = null;
        /** The template for the pdf thumbnails. */
        this.thumbnailsTemplate = null;
        /** Number of times the Viewer will retry fetching content Rendition.
         * There is a delay of at least one second between attempts.
         */
        this.maxRetries = 30;
        /** Emitted when user clicks the 'Back' button. */
        this.goBack = new core_1.EventEmitter();
        /** Emitted when user clicks the 'Print' button. */
        this.print = new core_1.EventEmitter();
        /** Emitted when the viewer is shown or hidden. */
        this.showViewerChange = new core_1.EventEmitter();
        /** Emitted when the filename extension changes. */
        this.extensionChange = new core_1.EventEmitter();
        /** Emitted when user clicks 'Navigate Before' ("<") button. */
        this.navigateBefore = new core_1.EventEmitter();
        /** Emitted when user clicks 'Navigate Next' (">") button. */
        this.navigateNext = new core_1.EventEmitter();
        /** Emitted when the shared link used is not valid. */
        this.invalidSharedLink = new core_1.EventEmitter();
        this.TRY_TIMEOUT = 10000;
        this.viewerType = 'unknown';
        this.isLoading = false;
        this.extensionTemplates = [];
        this.externalExtensions = [];
        this.sidebarRightTemplateContext = { node: null };
        this.sidebarLeftTemplateContext = { node: null };
        this.viewerExtensions = [];
        this.subscriptions = [];
        // Extensions that are supported by the Viewer without conversion
        this.extensions = {
            image: ['png', 'jpg', 'jpeg', 'gif', 'bpm', 'svg'],
            media: ['wav', 'mp4', 'mp3', 'webm', 'ogg'],
            text: ['txt', 'xml', 'html', 'json', 'ts', 'css', 'md'],
            pdf: ['pdf']
        };
        // Mime types that are supported by the Viewer without conversion
        this.mimeTypes = {
            text: ['text/plain', 'text/csv', 'text/xml', 'text/html', 'application/x-javascript'],
            pdf: ['application/pdf'],
            image: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/svg+xml'],
            media: ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/ogg', 'audio/wav']
        };
    }
    ViewerComponent.prototype.isSourceDefined = function () {
        return (this.urlFile || this.blobFile || this.nodeId || this.sharedLinkId) ? true : false;
    };
    ViewerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.push(this.apiService.nodeUpdated.subscribe(function (node) { return _this.onNodeUpdated(node); }));
        this.loadExtensions();
    };
    ViewerComponent.prototype.loadExtensions = function () {
        var _this = this;
        this.viewerExtensions = this.extensionService.getViewerExtensions();
        this.viewerExtensions
            .forEach(function (extension) {
            _this.externalExtensions.push(extension.fileExtension);
        });
    };
    ViewerComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) { return subscription.unsubscribe(); });
        this.subscriptions = [];
    };
    ViewerComponent.prototype.onNodeUpdated = function (node) {
        var _this = this;
        if (node && node.id === this.nodeId) {
            this.generateCacheBusterNumber();
            this.isLoading = true;
            this.setUpNodeFile(node).then(function () {
                _this.isLoading = false;
            });
        }
    };
    ViewerComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.showViewer) {
            if (!this.isSourceDefined()) {
                throw new Error('A content source attribute value is missing.');
            }
            this.isLoading = true;
            if (this.blobFile) {
                this.setUpBlobData();
                this.isLoading = false;
            }
            else if (this.urlFile) {
                this.setUpUrlFile();
                this.isLoading = false;
            }
            else if (this.nodeId) {
                this.apiService.nodesApi.getNode(this.nodeId, { include: ['allowableOperations'] }).then(function (node) {
                    _this.nodeEntry = node;
                    _this.setUpNodeFile(node.entry).then(function () {
                        _this.isLoading = false;
                    });
                }, function (error) {
                    _this.isLoading = false;
                    _this.logService.error('This node does not exist');
                });
            }
            else if (this.sharedLinkId) {
                this.allowGoBack = false;
                this.apiService.sharedLinksApi.getSharedLink(this.sharedLinkId).then(function (sharedLinkEntry) {
                    _this.setUpSharedLinkFile(sharedLinkEntry);
                    _this.isLoading = false;
                }, function () {
                    _this.isLoading = false;
                    _this.logService.error('This sharedLink does not exist');
                    _this.invalidSharedLink.next();
                });
            }
        }
    };
    ViewerComponent.prototype.setUpBlobData = function () {
        this.fileTitle = this.getDisplayName('Unknown');
        this.mimeType = this.blobFile.type;
        this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
        this.allowDownload = false;
        // TODO: wrap blob into the data url and allow downloading
        this.extensionChange.emit(this.mimeType);
        this.scrollTop();
    };
    ViewerComponent.prototype.setUpUrlFile = function () {
        var filenameFromUrl = this.getFilenameFromUrl(this.urlFile);
        this.fileTitle = this.getDisplayName(filenameFromUrl);
        this.extension = this.getFileExtension(filenameFromUrl);
        this.urlFileContent = this.urlFile;
        this.fileName = this.displayName;
        this.viewerType = this.urlFileViewer || this.getViewerTypeByExtension(this.extension);
        if (this.viewerType === 'unknown') {
            this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
        }
        this.extensionChange.emit(this.extension);
        this.scrollTop();
    };
    ViewerComponent.prototype.setUpNodeFile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var setupNode;
            return __generator(this, function (_a) {
                if (data.content) {
                    this.mimeType = data.content.mimeType;
                }
                this.fileTitle = this.getDisplayName(data.name);
                this.urlFileContent = this.apiService.contentApi.getContentUrl(data.id);
                this.urlFileContent = this.cacheBusterNumber ? this.urlFileContent + '&' + this.cacheBusterNumber : this.urlFileContent;
                this.extension = this.getFileExtension(data.name);
                this.fileName = data.name;
                this.viewerType = this.getViewerTypeByExtension(this.extension);
                if (this.viewerType === 'unknown') {
                    this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
                }
                if (this.viewerType === 'unknown') {
                    setupNode = this.displayNodeRendition(data.id);
                }
                this.extensionChange.emit(this.extension);
                this.sidebarRightTemplateContext.node = data;
                this.sidebarLeftTemplateContext.node = data;
                this.scrollTop();
                return [2 /*return*/, setupNode];
            });
        });
    };
    ViewerComponent.prototype.setUpSharedLinkFile = function (details) {
        this.mimeType = details.entry.content.mimeType;
        this.fileTitle = this.getDisplayName(details.entry.name);
        this.extension = this.getFileExtension(details.entry.name);
        this.fileName = details.entry.name;
        this.urlFileContent = this.apiService.contentApi.getSharedLinkContentUrl(this.sharedLinkId, false);
        this.viewerType = this.getViewerTypeByMimeType(this.mimeType);
        if (this.viewerType === 'unknown') {
            this.viewerType = this.getViewerTypeByExtension(this.extension);
        }
        if (this.viewerType === 'unknown') {
            this.displaySharedLinkRendition(this.sharedLinkId);
        }
        this.extensionChange.emit(this.extension);
    };
    ViewerComponent.prototype.toggleSidebar = function () {
        var _this = this;
        this.showRightSidebar = !this.showRightSidebar;
        if (this.showRightSidebar && this.nodeId) {
            this.apiService.getInstance().nodes.getNode(this.nodeId, { include: ['allowableOperations'] })
                .then(function (nodeEntry) {
                _this.sidebarRightTemplateContext.node = nodeEntry.entry;
            });
        }
    };
    ViewerComponent.prototype.toggleLeftSidebar = function () {
        var _this = this;
        this.showLeftSidebar = !this.showLeftSidebar;
        if (this.showRightSidebar && this.nodeId) {
            this.apiService.getInstance().nodes.getNode(this.nodeId, { include: ['allowableOperations'] })
                .then(function (nodeEntry) {
                _this.sidebarLeftTemplateContext.node = nodeEntry.entry;
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
            var editorTypes = Object.keys(this.mimeTypes);
            for (var _i = 0, editorTypes_1 = editorTypes; _i < editorTypes_1.length; _i++) {
                var type = editorTypes_1[_i];
                if (this.mimeTypes[type].indexOf(mimeType) >= 0) {
                    return type;
                }
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
        this.close();
    };
    ViewerComponent.prototype.onNavigateBeforeClick = function () {
        this.navigateBefore.next();
    };
    ViewerComponent.prototype.onNavigateNextClick = function () {
        this.navigateNext.next();
    };
    /**
     * close the viewer
     */
    ViewerComponent.prototype.close = function () {
        if (this.otherMenu) {
            this.otherMenu.hidden = false;
        }
        this.showViewer = false;
        this.showViewerChange.emit(this.showViewer);
    };
    /**
     * get File name from url
     *
     * @param  url - url file
     */
    ViewerComponent.prototype.getFilenameFromUrl = function (url) {
        var anchor = url.indexOf('#');
        var query = url.indexOf('?');
        var end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
        return url.substring(url.lastIndexOf('/', end) + 1, end);
    };
    /**
     * Get file extension from the string.
     * Supports the URL formats like:
     * http://localhost/test.jpg?cache=1000
     * http://localhost/test.jpg#cache=1000
     *
     * @param fileName - file name
     */
    ViewerComponent.prototype.getFileExtension = function (fileName) {
        if (fileName) {
            var match = fileName.match(/\.([^\./\?\#]+)($|\?|\#)/);
            return match ? match[1] : null;
        }
        return null;
    };
    ViewerComponent.prototype.isCustomViewerExtension = function (extension) {
        var extensions = this.externalExtensions || [];
        if (extension && extensions.length > 0) {
            extension = extension.toLowerCase();
            return extensions.flat().indexOf(extension) >= 0;
        }
        return false;
    };
    /**
     * Keyboard event listener
     * @param  event
     */
    ViewerComponent.prototype.handleKeyboardEvent = function (event) {
        var key = event.keyCode;
        // Esc
        if (key === 27 && this.overlayMode) { // esc
            this.close();
        }
        // Left arrow
        if (key === 37 && this.canNavigateBefore) {
            event.preventDefault();
            this.onNavigateBeforeClick();
        }
        // Right arrow
        if (key === 39 && this.canNavigateNext) {
            event.preventDefault();
            this.onNavigateNextClick();
        }
        // Ctrl+F
        if (key === 70 && event.ctrlKey) {
            event.preventDefault();
            this.enterFullScreen();
        }
    };
    ViewerComponent.prototype.printContent = function () {
        if (this.allowPrint) {
            var args = new events_1.BaseEvent();
            this.print.next(args);
            if (!args.defaultPrevented) {
                this.viewUtils.printFileGeneric(this.nodeId, this.mimeType);
            }
        }
    };
    /**
     * Triggers full screen mode with a main content area displayed.
     */
    ViewerComponent.prototype.enterFullScreen = function () {
        if (this.allowFullScreen) {
            var container = this.el.nativeElement.querySelector('.adf-viewer__fullscreen-container');
            if (container) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                }
                else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
                else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                }
                else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            }
        }
    };
    ViewerComponent.prototype.displayNodeRendition = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            var rendition, renditionId, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.resolveRendition(nodeId, 'pdf')];
                    case 1:
                        rendition = _a.sent();
                        if (rendition) {
                            renditionId = rendition.entry.id;
                            if (renditionId === 'pdf') {
                                this.viewerType = 'pdf';
                            }
                            else if (renditionId === 'imgpreview') {
                                this.viewerType = 'image';
                            }
                            this.urlFileContent = this.apiService.contentApi.getRenditionUrl(nodeId, renditionId);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        this.logService.error(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ViewerComponent.prototype.displaySharedLinkRendition = function (sharedId) {
        return __awaiter(this, void 0, void 0, function () {
            var rendition, error_1, rendition, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 7]);
                        return [4 /*yield*/, this.apiService.renditionsApi.getSharedLinkRendition(sharedId, 'pdf')];
                    case 1:
                        rendition = _a.sent();
                        if (rendition.entry.status.toString() === 'CREATED') {
                            this.viewerType = 'pdf';
                            this.urlFileContent = this.apiService.contentApi.getSharedLinkRenditionUrl(sharedId, 'pdf');
                        }
                        return [3 /*break*/, 7];
                    case 2:
                        error_1 = _a.sent();
                        this.logService.error(error_1);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.apiService.renditionsApi.getSharedLinkRendition(sharedId, 'imgpreview')];
                    case 4:
                        rendition = _a.sent();
                        if (rendition.entry.status.toString() === 'CREATED') {
                            this.viewerType = 'image';
                            this.urlFileContent = this.apiService.contentApi.getSharedLinkRenditionUrl(sharedId, 'imgpreview');
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        this.logService.error(error_2);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ViewerComponent.prototype.resolveRendition = function (nodeId, renditionId) {
        return __awaiter(this, void 0, void 0, function () {
            var supportedRendition, rendition, status_1, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renditionId = renditionId.toLowerCase();
                        return [4 /*yield*/, this.apiService.renditionsApi.getRenditions(nodeId)];
                    case 1:
                        supportedRendition = _a.sent();
                        rendition = supportedRendition.list.entries.find(function (renditionEntry) { return renditionEntry.entry.id.toLowerCase() === renditionId; });
                        if (!rendition) {
                            renditionId = 'imgpreview';
                            rendition = supportedRendition.list.entries.find(function (renditionEntry) { return renditionEntry.entry.id.toLowerCase() === renditionId; });
                        }
                        if (!rendition) return [3 /*break*/, 6];
                        status_1 = rendition.entry.status.toString();
                        if (!(status_1 === 'NOT_CREATED')) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.apiService.renditionsApi.createRendition(nodeId, { id: renditionId }).then(function () {
                                _this.viewerType = 'in_creation';
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.waitRendition(nodeId, renditionId)];
                    case 4:
                        rendition = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_2 = _a.sent();
                        this.logService.error(err_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, rendition];
                }
            });
        });
    };
    ViewerComponent.prototype.waitRendition = function (nodeId, renditionId) {
        return __awaiter(this, void 0, void 0, function () {
            var currentRetry;
            var _this = this;
            return __generator(this, function (_a) {
                currentRetry = 0;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var intervalId = setInterval(function () {
                            currentRetry++;
                            if (_this.maxRetries >= currentRetry) {
                                _this.apiService.renditionsApi.getRendition(nodeId, renditionId).then(function (rendition) {
                                    var status = rendition.entry.status.toString();
                                    if (status === 'CREATED') {
                                        if (renditionId === 'pdf') {
                                            _this.viewerType = 'pdf';
                                        }
                                        else if (renditionId === 'imgpreview') {
                                            _this.viewerType = 'image';
                                        }
                                        _this.urlFileContent = _this.apiService.contentApi.getRenditionUrl(nodeId, renditionId);
                                        clearInterval(intervalId);
                                        return resolve(rendition);
                                    }
                                }, function () {
                                    _this.viewerType = 'error_in_creation';
                                    return reject();
                                });
                            }
                            else {
                                _this.isLoading = false;
                                _this.viewerType = 'error_in_creation';
                                clearInterval(intervalId);
                            }
                        }, _this.TRY_TIMEOUT);
                    })];
            });
        });
    };
    ViewerComponent.prototype.checkExtensions = function (extensionAllowed) {
        var _this = this;
        if (typeof extensionAllowed === 'string') {
            return this.extension.toLowerCase() === extensionAllowed.toLowerCase();
        }
        else if (extensionAllowed.length > 0) {
            return extensionAllowed.find(function (currentExtension) {
                return _this.extension.toLowerCase() === currentExtension.toLowerCase();
            });
        }
    };
    ViewerComponent.prototype.generateCacheBusterNumber = function () {
        this.cacheBusterNumber = Date.now();
    };
    __decorate([
        core_1.ContentChild(viewer_toolbar_component_1.ViewerToolbarComponent),
        __metadata("design:type", viewer_toolbar_component_1.ViewerToolbarComponent)
    ], ViewerComponent.prototype, "toolbar", void 0);
    __decorate([
        core_1.ContentChild(viewer_sidebar_component_1.ViewerSidebarComponent),
        __metadata("design:type", viewer_sidebar_component_1.ViewerSidebarComponent)
    ], ViewerComponent.prototype, "sidebar", void 0);
    __decorate([
        core_1.ContentChild(viewer_open_with_component_1.ViewerOpenWithComponent),
        __metadata("design:type", viewer_open_with_component_1.ViewerOpenWithComponent)
    ], ViewerComponent.prototype, "mnuOpenWith", void 0);
    __decorate([
        core_1.ContentChild(viewer_more_actions_component_1.ViewerMoreActionsComponent),
        __metadata("design:type", viewer_more_actions_component_1.ViewerMoreActionsComponent)
    ], ViewerComponent.prototype, "mnuMoreActions", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "urlFile", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ViewerComponent.prototype, "urlFileViewer", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Blob)
    ], ViewerComponent.prototype, "blobFile", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ViewerComponent.prototype, "nodeId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ViewerComponent.prototype, "sharedLinkId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "overlayMode", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "showViewer", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "showToolbar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ViewerComponent.prototype, "displayName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "allowGoBack", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "allowDownload", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "allowPrint", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "allowFullScreen", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "allowNavigate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "canNavigateBefore", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "canNavigateNext", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "allowLeftSidebar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "allowRightSidebar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "allowThumbnails", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "showRightSidebar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "showLeftSidebar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.TemplateRef)
    ], ViewerComponent.prototype, "sidebarRightTemplate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.TemplateRef)
    ], ViewerComponent.prototype, "sidebarLeftTemplate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.TemplateRef)
    ], ViewerComponent.prototype, "thumbnailsTemplate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ViewerComponent.prototype, "mimeType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ViewerComponent.prototype, "fileName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "maxRetries", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "goBack", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "print", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "showViewerChange", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "extensionChange", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "navigateBefore", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "navigateNext", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViewerComponent.prototype, "invalidSharedLink", void 0);
    __decorate([
        core_1.HostListener('document:keyup', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], ViewerComponent.prototype, "handleKeyboardEvent", null);
    ViewerComponent = __decorate([
        core_1.Component({
            selector: 'adf-viewer',
            templateUrl: './viewer.component.html',
            styleUrls: ['./viewer.component.scss'],
            host: { 'class': 'adf-viewer' },
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            view_util_service_1.ViewUtilService,
            log_service_1.LogService,
            adf_extensions_1.AppExtensionService,
            core_1.ElementRef])
    ], ViewerComponent);
    return ViewerComponent;
}());
exports.ViewerComponent = ViewerComponent;
//# sourceMappingURL=viewer.component.js.map