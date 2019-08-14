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
var PdfThumbListComponent = /** @class */ (function () {
    function PdfThumbListComponent(element) {
        this.element = element;
        this.virtualHeight = 0;
        this.translateY = 0;
        this.renderItems = [];
        this.width = 91;
        this.currentHeight = 0;
        this.items = [];
        this.margin = 15;
        this.itemHeight = 114 + this.margin;
        this.calculateItems = this.calculateItems.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }
    PdfThumbListComponent.prototype.onResize = function (event) {
        this.calculateItems();
    };
    PdfThumbListComponent.prototype.ngOnInit = function () {
        /* cspell:disable-next-line */
        this.pdfViewer.eventBus.on('pagechange', this.onPageChange);
        this.element.nativeElement.addEventListener('scroll', this.calculateItems, true);
        this.setHeight(this.pdfViewer.currentPageNumber);
        this.items = this.getPages();
        this.calculateItems();
    };
    PdfThumbListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.scrollInto(_this.pdfViewer.currentPageNumber); }, 0);
    };
    PdfThumbListComponent.prototype.ngOnDestroy = function () {
        this.element.nativeElement.removeEventListener('scroll', this.calculateItems, true);
        /* cspell:disable-next-line */
        this.pdfViewer.eventBus.off('pagechange', this.onPageChange);
    };
    PdfThumbListComponent.prototype.trackByFn = function (index, item) {
        return item.id;
    };
    PdfThumbListComponent.prototype.isSelected = function (pageNum) {
        return this.pdfViewer.currentPageNumber === pageNum;
    };
    PdfThumbListComponent.prototype.goTo = function (pageNum) {
        this.pdfViewer.currentPageNumber = pageNum;
    };
    PdfThumbListComponent.prototype.scrollInto = function (item) {
        if (this.items.length) {
            var index = this.items.findIndex(function (element) { return element.id === item; });
            if (index < 0 || index >= this.items.length) {
                return;
            }
            this.element.nativeElement.scrollTop = index * this.itemHeight;
            this.calculateItems();
        }
    };
    PdfThumbListComponent.prototype.getPages = function () {
        var _this = this;
        return this.pdfViewer._pages.map(function (page) { return ({
            id: page.id,
            getWidth: function () { return _this.width; },
            getHeight: function () { return _this.currentHeight; },
            getPage: function () { return _this.pdfViewer.pdfDocument.getPage(page.id); }
        }); });
    };
    PdfThumbListComponent.prototype.setHeight = function (id) {
        var _this = this;
        var height = this.pdfViewer.pdfDocument.getPage(id).then(function (page) { return _this.calculateHeight(page); });
        return height;
    };
    PdfThumbListComponent.prototype.calculateHeight = function (page) {
        var viewport = page.getViewport(1);
        var pageRatio = viewport.width / viewport.height;
        var height = Math.floor(this.width / pageRatio);
        this.currentHeight = height;
        this.itemHeight = height + this.margin;
    };
    PdfThumbListComponent.prototype.calculateItems = function () {
        var _a = this.getContainerSetup(), element = _a.element, viewPort = _a.viewPort, itemsInView = _a.itemsInView;
        var indexByScrollTop = element.scrollTop / viewPort * this.items.length / itemsInView;
        var start = Math.floor(indexByScrollTop);
        var end = Math.ceil(indexByScrollTop) + (itemsInView);
        this.translateY = this.itemHeight * Math.ceil(start);
        this.virtualHeight = this.itemHeight * this.items.length - this.translateY;
        this.renderItems = this.items.slice(start, end);
    };
    PdfThumbListComponent.prototype.getContainerSetup = function () {
        var element = this.element.nativeElement;
        var elementRec = element.getBoundingClientRect();
        var itemsInView = Math.ceil(elementRec.height / this.itemHeight);
        var viewPort = (this.itemHeight * this.items.length) / itemsInView;
        return {
            element: element,
            viewPort: viewPort,
            itemsInView: itemsInView
        };
    };
    PdfThumbListComponent.prototype.onPageChange = function (event) {
        var index = this.renderItems.findIndex(function (element) { return element.id === event.pageNumber; });
        if (index < 0) {
            this.scrollInto(event.pageNumber);
        }
        if (index >= this.renderItems.length - 1) {
            this.element.nativeElement.scrollTop += this.itemHeight;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PdfThumbListComponent.prototype, "pdfViewer", void 0);
    __decorate([
        core_1.ContentChild(core_1.TemplateRef),
        __metadata("design:type", Object)
    ], PdfThumbListComponent.prototype, "template", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], PdfThumbListComponent.prototype, "onResize", null);
    PdfThumbListComponent = __decorate([
        core_1.Component({
            selector: 'adf-pdf-thumbnails',
            templateUrl: './pdfViewer-thumbnails.component.html',
            styleUrls: ['./pdfViewer-thumbnails.component.scss'],
            host: { 'class': 'adf-pdf-thumbnails' },
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], PdfThumbListComponent);
    return PdfThumbListComponent;
}());
exports.PdfThumbListComponent = PdfThumbListComponent;
//# sourceMappingURL=pdfViewer-thumbnails.component.js.map