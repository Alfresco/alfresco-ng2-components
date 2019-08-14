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
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var log_service_1 = require("../../services/log.service");
var rendering_queue_services_1 = require("../services/rendering-queue.services");
var pdfViewer_password_dialog_1 = require("./pdfViewer-password-dialog");
var app_config_service_1 = require("./../../app-config/app-config.service");
var PdfViewerComponent = /** @class */ (function () {
    function PdfViewerComponent(dialog, renderingQueueServices, logService, appConfigService) {
        this.dialog = dialog;
        this.renderingQueueServices = renderingQueueServices;
        this.logService = logService;
        this.appConfigService = appConfigService;
        this.showToolbar = true;
        this.allowThumbnails = false;
        this.thumbnailsTemplate = null;
        this.rendered = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.close = new core_1.EventEmitter();
        this.currentScaleMode = 'auto';
        this.currentScale = 1;
        this.MAX_AUTO_SCALE = 1.25;
        this.DEFAULT_SCALE_DELTA = 1.1;
        this.MIN_SCALE = 0.25;
        this.MAX_SCALE = 10.0;
        this.isPanelDisabled = true;
        this.showThumbnails = false;
        this.pdfThumbnailsContext = { viewer: null };
        // needed to preserve "this" context
        this.onPageChange = this.onPageChange.bind(this);
        this.onPagesLoaded = this.onPagesLoaded.bind(this);
        this.onPageRendered = this.onPageRendered.bind(this);
        this.randomPdfId = this.generateUuid();
        this.currentScale = this.getUserScaling();
    }
    Object.defineProperty(PdfViewerComponent.prototype, "currentScaleText", {
        get: function () {
            return Math.round(this.currentScale * 100) + '%';
        },
        enumerable: true,
        configurable: true
    });
    PdfViewerComponent.prototype.getUserScaling = function () {
        var scaleConfig = this.appConfigService.get('adf-viewer.pdf-viewer-scaling', undefined) / 100;
        if (scaleConfig) {
            return this.checkLimits(scaleConfig);
        }
        else {
            return 1;
        }
    };
    PdfViewerComponent.prototype.checkLimits = function (scaleConfig) {
        if (scaleConfig > this.MAX_SCALE) {
            return this.MAX_SCALE;
        }
        else if (scaleConfig < this.MIN_SCALE) {
            return this.MIN_SCALE;
        }
        else {
            return scaleConfig;
        }
    };
    PdfViewerComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            var reader_1 = new FileReader();
            reader_1.onload = function () {
                var options = {
                    data: reader_1.result,
                    withCredentials: _this.appConfigService.get('auth.withCredentials', undefined)
                };
                _this.executePdf(options);
            };
            reader_1.readAsArrayBuffer(blobFile.currentValue);
        }
        var urlFile = changes['urlFile'];
        if (urlFile && urlFile.currentValue) {
            var options = {
                url: urlFile.currentValue,
                withCredentials: this.appConfigService.get('auth.withCredentials', undefined)
            };
            this.executePdf(options);
        }
        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    };
    PdfViewerComponent.prototype.executePdf = function (pdfOptions) {
        var _this = this;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
        this.loadingTask = pdfjsLib.getDocument(pdfOptions);
        this.loadingTask.onPassword = function (callback, reason) {
            _this.onPdfPassword(callback, reason);
        };
        this.loadingTask.onProgress = function (progressData) {
            var level = progressData.loaded / progressData.total;
            _this.loadingPercent = Math.round(level * 100);
        };
        this.loadingTask.then(function (pdfDocument) {
            _this.currentPdfDocument = pdfDocument;
            _this.totalPages = pdfDocument.numPages;
            _this.page = 1;
            _this.displayPage = 1;
            _this.initPDFViewer(_this.currentPdfDocument);
            _this.currentPdfDocument.getPage(1).then(function () {
                _this.scalePage('auto');
            }, function () {
                _this.error.emit();
            });
        }, function () {
            _this.error.emit();
        });
    };
    PdfViewerComponent.prototype.initPDFViewer = function (pdfDocument) {
        var viewer = document.getElementById(this.randomPdfId + "-viewer-viewerPdf");
        var container = document.getElementById(this.randomPdfId + "-viewer-pdf-viewer");
        if (viewer && container) {
            this.documentContainer = container;
            // cspell: disable-next
            this.documentContainer.addEventListener('pagechange', this.onPageChange, true);
            // cspell: disable-next
            this.documentContainer.addEventListener('pagesloaded', this.onPagesLoaded, true);
            // cspell: disable-next
            this.documentContainer.addEventListener('textlayerrendered', this.onPageRendered, true);
            this.pdfViewer = new pdfjsViewer.PDFViewer({
                container: this.documentContainer,
                viewer: viewer,
                renderingQueue: this.renderingQueueServices
            });
            this.renderingQueueServices.setViewer(this.pdfViewer);
            this.pdfViewer.setDocument(pdfDocument);
            this.pdfThumbnailsContext.viewer = this.pdfViewer;
        }
    };
    PdfViewerComponent.prototype.ngOnDestroy = function () {
        if (this.documentContainer) {
            // cspell: disable-next
            this.documentContainer.removeEventListener('pagechange', this.onPageChange, true);
            // cspell: disable-next
            this.documentContainer.removeEventListener('pagesloaded', this.onPagesLoaded, true);
            // cspell: disable-next
            this.documentContainer.removeEventListener('textlayerrendered', this.onPageRendered, true);
        }
        if (this.loadingTask) {
            try {
                this.loadingTask.destroy();
            }
            catch (_a) {
            }
            this.loadingTask = null;
        }
    };
    PdfViewerComponent.prototype.toggleThumbnails = function () {
        this.showThumbnails = !this.showThumbnails;
    };
    /**
     * Method to scale the page current support implementation
     *
     * @param scaleMode - new scale mode
     */
    PdfViewerComponent.prototype.scalePage = function (scaleMode) {
        this.currentScaleMode = scaleMode;
        var viewerContainer = document.getElementById(this.randomPdfId + "-viewer-main-container");
        var documentContainer = document.getElementById(this.randomPdfId + "-viewer-pdf-viewer");
        if (this.pdfViewer && documentContainer) {
            var widthContainer = void 0;
            var heightContainer = void 0;
            if (viewerContainer && viewerContainer.clientWidth <= documentContainer.clientWidth) {
                widthContainer = viewerContainer.clientWidth;
                heightContainer = viewerContainer.clientHeight;
            }
            else {
                widthContainer = documentContainer.clientWidth;
                heightContainer = documentContainer.clientHeight;
            }
            var currentPage = this.pdfViewer._pages[this.pdfViewer._currentPageNumber - 1];
            var padding = 20;
            var pageWidthScale = (widthContainer - padding) / currentPage.width * currentPage.scale;
            var pageHeightScale = (heightContainer - padding) / currentPage.width * currentPage.scale;
            var scale = this.getUserScaling();
            if (!scale) {
                switch (this.currentScaleMode) {
                    case 'page-actual':
                        scale = 1;
                        break;
                    case 'page-width':
                        scale = pageWidthScale;
                        break;
                    case 'page-height':
                        scale = pageHeightScale;
                        break;
                    case 'page-fit':
                        scale = Math.min(pageWidthScale, pageHeightScale);
                        break;
                    case 'auto':
                        var horizontalScale = void 0;
                        if (this.isLandscape) {
                            horizontalScale = Math.min(pageHeightScale, pageWidthScale);
                        }
                        else {
                            horizontalScale = pageWidthScale;
                        }
                        horizontalScale = Math.round(horizontalScale);
                        scale = Math.min(this.MAX_AUTO_SCALE, horizontalScale);
                        break;
                    default:
                        this.logService.error('pdfViewSetScale: \'' + scaleMode + '\' is an unknown zoom value.');
                        return;
                }
                this.setScaleUpdatePages(scale);
            }
            else {
                this.currentScale = 0;
                this.setScaleUpdatePages(scale);
            }
        }
    };
    /**
     * Update all the pages with the newScale scale
     *
     * @param newScale - new scale page
     */
    PdfViewerComponent.prototype.setScaleUpdatePages = function (newScale) {
        if (this.pdfViewer) {
            if (!this.isSameScale(this.currentScale, newScale)) {
                this.currentScale = newScale;
                this.pdfViewer._pages.forEach(function (currentPage) {
                    currentPage.update(newScale);
                });
            }
            this.pdfViewer.update();
        }
    };
    /**
     * Check if the request scale of the page is the same for avoid useless re-rendering
     *
     * @param oldScale - old scale page
     * @param newScale - new scale page
     *
     */
    PdfViewerComponent.prototype.isSameScale = function (oldScale, newScale) {
        return (newScale === oldScale);
    };
    /**
     * Check if is a land scape view
     *
     * @param width
     * @param height
     */
    PdfViewerComponent.prototype.isLandscape = function (width, height) {
        return (width > height);
    };
    /**
     * Method triggered when the page is resized
     */
    PdfViewerComponent.prototype.onResize = function () {
        this.scalePage(this.currentScaleMode);
    };
    /**
     * toggle the fit page pdf
     */
    PdfViewerComponent.prototype.pageFit = function () {
        if (this.currentScaleMode !== 'page-fit') {
            this.scalePage('page-fit');
        }
        else {
            this.scalePage('auto');
        }
    };
    /**
     * zoom in page pdf
     *
     * @param ticks
     */
    PdfViewerComponent.prototype.zoomIn = function (ticks) {
        var newScale = this.currentScale;
        do {
            newScale = (newScale * this.DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.ceil(newScale * 10) / 10;
            newScale = Math.min(this.MAX_SCALE, newScale);
        } while (--ticks > 0 && newScale < this.MAX_SCALE);
        this.currentScaleMode = 'auto';
        this.setScaleUpdatePages(newScale);
    };
    /**
     * zoom out page pdf
     *
     * @param ticks
     */
    PdfViewerComponent.prototype.zoomOut = function (ticks) {
        var newScale = this.currentScale;
        do {
            newScale = (newScale / this.DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.floor(newScale * 10) / 10;
            newScale = Math.max(this.MIN_SCALE, newScale);
        } while (--ticks > 0 && newScale > this.MIN_SCALE);
        this.currentScaleMode = 'auto';
        this.setScaleUpdatePages(newScale);
    };
    /**
     * load the previous page
     */
    PdfViewerComponent.prototype.previousPage = function () {
        if (this.pdfViewer && this.page > 1) {
            this.page--;
            this.displayPage = this.page;
            this.pdfViewer.currentPageNumber = this.page;
        }
    };
    /**
     * load the next page
     */
    PdfViewerComponent.prototype.nextPage = function () {
        if (this.pdfViewer && this.page < this.totalPages) {
            this.page++;
            this.displayPage = this.page;
            this.pdfViewer.currentPageNumber = this.page;
        }
    };
    /**
     * load the page in input
     *
     * @param page to load
     */
    PdfViewerComponent.prototype.inputPage = function (page) {
        var pageInput = parseInt(page, 10);
        if (!isNaN(pageInput) && pageInput > 0 && pageInput <= this.totalPages) {
            this.page = pageInput;
            this.displayPage = this.page;
            this.pdfViewer.currentPageNumber = this.page;
        }
        else {
            this.displayPage = this.page;
        }
    };
    /**
     * Page Change Event
     *
     * @param event
     */
    PdfViewerComponent.prototype.onPageChange = function (event) {
        this.page = event.pageNumber;
        this.displayPage = event.pageNumber;
    };
    PdfViewerComponent.prototype.onPdfPassword = function (callback, reason) {
        var _this = this;
        this.dialog
            .open(pdfViewer_password_dialog_1.PdfPasswordDialogComponent, {
            width: '400px',
            data: { reason: reason }
        })
            .afterClosed().subscribe(function (password) {
            if (password) {
                callback(password);
            }
            else {
                _this.close.emit();
            }
        });
    };
    /**
     * Page Rendered Event
     */
    PdfViewerComponent.prototype.onPageRendered = function () {
        this.rendered.emit();
    };
    /**
     * Pages Loaded Event
     *
     * @param event
     */
    PdfViewerComponent.prototype.onPagesLoaded = function (event) {
        this.isPanelDisabled = false;
    };
    /**
     * Keyboard Event Listener
     * @param KeyboardEvent event
     */
    PdfViewerComponent.prototype.handleKeyboardEvent = function (event) {
        var key = event.keyCode;
        if (key === 39) { // right arrow
            this.nextPage();
        }
        else if (key === 37) { // left arrow
            this.previousPage();
        }
    };
    PdfViewerComponent.prototype.generateUuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PdfViewerComponent.prototype, "urlFile", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Blob)
    ], PdfViewerComponent.prototype, "blobFile", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PdfViewerComponent.prototype, "nameFile", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], PdfViewerComponent.prototype, "showToolbar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PdfViewerComponent.prototype, "allowThumbnails", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.TemplateRef)
    ], PdfViewerComponent.prototype, "thumbnailsTemplate", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], PdfViewerComponent.prototype, "rendered", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], PdfViewerComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], PdfViewerComponent.prototype, "close", void 0);
    __decorate([
        core_1.HostListener('document:keydown', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], PdfViewerComponent.prototype, "handleKeyboardEvent", null);
    PdfViewerComponent = __decorate([
        core_1.Component({
            selector: 'adf-pdf-viewer',
            templateUrl: './pdfViewer.component.html',
            styleUrls: [
                './pdfViewer.component.scss',
                './pdfViewerHost.component.scss'
            ],
            providers: [rendering_queue_services_1.RenderingQueueServices],
            host: { 'class': 'adf-pdf-viewer' },
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [material_1.MatDialog,
            rendering_queue_services_1.RenderingQueueServices,
            log_service_1.LogService,
            app_config_service_1.AppConfigService])
    ], PdfViewerComponent);
    return PdfViewerComponent;
}());
exports.PdfViewerComponent = PdfViewerComponent;
//# sourceMappingURL=pdfViewer.component.js.map