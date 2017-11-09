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
var rendering_queue_services_1 = require("../services/rendering-queue.services");
var PdfViewerComponent = (function () {
    function PdfViewerComponent(renderingQueueServices, logService) {
        this.renderingQueueServices = renderingQueueServices;
        this.logService = logService;
        this.showToolbar = true;
        this.allowThumbnails = false;
        this.currentScaleMode = 'auto';
        this.MAX_AUTO_SCALE = 1.25;
        this.DEFAULT_SCALE_DELTA = 1.1;
        this.MIN_SCALE = 0.25;
        this.MAX_SCALE = 10.0;
        // needed to preserve "this" context when setting as a global document event listener
        this.onDocumentScroll = this.onDocumentScroll.bind(this);
    }
    PdfViewerComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
        if (this.urlFile) {
            return new Promise(function (resolve, reject) {
                _this.executePdf(_this.urlFile, resolve, reject);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function () {
                    _this.executePdf(reader.result, resolve, reject);
                };
                reader.readAsArrayBuffer(_this.blobFile);
            });
        }
    };
    PdfViewerComponent.prototype.executePdf = function (src, resolve, reject) {
        var _this = this;
        var loadingTask = this.getPDFJS().getDocument(src);
        loadingTask.onProgress = function (progressData) {
            var level = progressData.loaded / progressData.total;
            _this.loadingPercent = Math.round(level * 100);
        };
        loadingTask.then(function (pdfDocument) {
            _this.currentPdfDocument = pdfDocument;
            _this.totalPages = pdfDocument.numPages;
            _this.page = 1;
            _this.displayPage = 1;
            _this.initPDFViewer(_this.currentPdfDocument);
            _this.currentPdfDocument.getPage(1).then(function () {
                _this.scalePage('auto');
                resolve();
            }, function (error) {
                reject(error);
            });
        }, function (error) {
            reject(error);
        });
    };
    /**
     * return the PDFJS global object (exist to facilitate the mock of PDFJS in the test)
     *
     * @returns {PDFJS}
     */
    PdfViewerComponent.prototype.getPDFJS = function () {
        return PDFJS;
    };
    PdfViewerComponent.prototype.initPDFViewer = function (pdfDocument) {
        PDFJS.verbosity = 1;
        PDFJS.disableWorker = false;
        var documentContainer = document.getElementById('viewer-pdf-container');
        var viewer = document.getElementById('viewer-viewerPdf');
        window.document.addEventListener('scroll', this.onDocumentScroll, true);
        this.pdfViewer = new PDFJS.PDFViewer({
            container: documentContainer,
            viewer: viewer,
            renderingQueue: this.renderingQueueServices
        });
        this.renderingQueueServices.setViewer(this.pdfViewer);
        this.pdfViewer.setDocument(pdfDocument);
    };
    PdfViewerComponent.prototype.ngOnDestroy = function () {
        window.document.removeEventListener('scroll', this.onDocumentScroll, true);
    };
    /**
     * Method to scale the page current support implementation
     *
     * @param {string} scaleMode - new scale mode
     */
    PdfViewerComponent.prototype.scalePage = function (scaleMode) {
        this.currentScaleMode = scaleMode;
        if (this.pdfViewer) {
            var viewerContainer = document.getElementById('viewer-main-container');
            var documentContainer = document.getElementById('viewer-pdf-container');
            var widthContainer = void 0;
            var heigthContainer = void 0;
            if (viewerContainer && viewerContainer.clientWidth <= documentContainer.clientWidth) {
                widthContainer = viewerContainer.clientWidth;
                heigthContainer = viewerContainer.clientHeight;
            }
            else {
                widthContainer = documentContainer.clientWidth;
                heigthContainer = documentContainer.clientHeight;
            }
            var currentPage = this.pdfViewer._pages[this.pdfViewer._currentPageNumber - 1];
            var padding = 20;
            var pageWidthScale = (widthContainer - padding) / currentPage.width * currentPage.scale;
            var pageHeightScale = (heigthContainer - padding) / currentPage.width * currentPage.scale;
            var scale = void 0;
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
                    scale = Math.min(this.MAX_AUTO_SCALE, horizontalScale);
                    break;
                default:
                    this.logService.error('pdfViewSetScale: \'' + scaleMode + '\' is an unknown zoom value.');
                    return;
            }
            this.setScaleUpdatePages(scale);
        }
    };
    /**
     * Update all the pages with the newScale scale
     *
     * @param {number} newScale - new scale page
     */
    PdfViewerComponent.prototype.setScaleUpdatePages = function (newScale) {
        if (!this.isSameScale(this.currentScale, newScale)) {
            this.currentScale = newScale;
            this.pdfViewer._pages.forEach(function (currentPage) {
                currentPage.update(newScale);
            });
            this.pdfViewer.update();
        }
    };
    /**
     * method to check if the request scale of the page is the same for avoid unuseful re-rendering
     *
     * @param {number} oldScale - old scale page
     * @param {number} newScale - new scale page
     *
     * @returns {boolean}
     */
    PdfViewerComponent.prototype.isSameScale = function (oldScale, newScale) {
        return (newScale === oldScale);
    };
    /**
     * method to check if is a land scape view
     *
     * @param {number} width
     * @param {number} height
     *
     * @returns {boolean}
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
     * @param {number} ticks
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
     * @param {number} ticks
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
     * @param {string} page - page to load
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
     * Litener Scroll Event
     *
     * @param {any} target
     */
    PdfViewerComponent.prototype.watchScroll = function (target) {
        var outputPage = this.getVisibleElement(target);
        if (outputPage) {
            this.page = outputPage.id;
            this.displayPage = this.page;
        }
    };
    /**
     * find out what elements are visible within a scroll pane
     *
     * @param {any} target
     *
     * @returns {Object} page
     */
    PdfViewerComponent.prototype.getVisibleElement = function (target) {
        var _this = this;
        return this.pdfViewer._pages.find(function (page) {
            return _this.isOnScreen(page, target);
        });
    };
    /**
     * check if a page is visible
     *
     * @param {any} page
     * @param {any} target
     *
     * @returns {boolean}
     */
    PdfViewerComponent.prototype.isOnScreen = function (page, target) {
        var viewport = {};
        viewport.top = target.scrollTop;
        viewport.bottom = viewport.top + target.scrollHeight;
        var bounds = {};
        bounds.top = page.div.offsetTop;
        bounds.bottom = bounds.top + page.viewport.height;
        return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
    };
    /**
     * Litener Keyboard Event
     * @param {KeyboardEvent} event
     */
    PdfViewerComponent.prototype.handleKeyboardEvent = function (event) {
        var key = event.keyCode;
        if (key === 39) {
            this.nextPage();
        }
        else if (key === 37) {
            this.previousPage();
        }
    };
    PdfViewerComponent.prototype.onDocumentScroll = function (event) {
        if (event && event.target) {
            this.watchScroll(event.target);
        }
    };
    __decorate([
        core_1.Input()
    ], PdfViewerComponent.prototype, "urlFile", void 0);
    __decorate([
        core_1.Input()
    ], PdfViewerComponent.prototype, "blobFile", void 0);
    __decorate([
        core_1.Input()
    ], PdfViewerComponent.prototype, "nameFile", void 0);
    __decorate([
        core_1.Input()
    ], PdfViewerComponent.prototype, "showToolbar", void 0);
    __decorate([
        core_1.Input()
    ], PdfViewerComponent.prototype, "allowThumbnails", void 0);
    __decorate([
        core_1.HostListener('document:keydown', ['$event'])
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
        })
    ], PdfViewerComponent);
    return PdfViewerComponent;
}());
exports.PdfViewerComponent = PdfViewerComponent;
