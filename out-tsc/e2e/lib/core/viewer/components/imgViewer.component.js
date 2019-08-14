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
var content_service_1 = require("../../services/content.service");
var app_config_service_1 = require("./../../app-config/app-config.service");
var platform_browser_1 = require("@angular/platform-browser");
var ImgViewerComponent = /** @class */ (function () {
    function ImgViewerComponent(sanitizer, appConfigService, contentService, el) {
        this.sanitizer = sanitizer;
        this.appConfigService = appConfigService;
        this.contentService = contentService;
        this.el = el;
        this.showToolbar = true;
        this.rotate = 0;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragged = false;
        this.drag = { x: 0, y: 0 };
        this.delta = { x: 0, y: 0 };
        this.initializeScaling();
    }
    Object.defineProperty(ImgViewerComponent.prototype, "transform", {
        get: function () {
            return this.sanitizer.bypassSecurityTrustStyle("scale(" + this.scaleX + ", " + this.scaleY + ") rotate(" + this.rotate + "deg) translate(" + this.offsetX + "px, " + this.offsetY + "px)");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImgViewerComponent.prototype, "currentScaleText", {
        get: function () {
            return Math.round(this.scaleX * 100) + '%';
        },
        enumerable: true,
        configurable: true
    });
    ImgViewerComponent.prototype.initializeScaling = function () {
        var scaling = this.appConfigService.get('adf-viewer.image-viewer-scaling', undefined) / 100;
        if (scaling) {
            this.scaleX = scaling;
            this.scaleY = scaling;
        }
    };
    ImgViewerComponent.prototype.ngOnInit = function () {
        this.element = this.el.nativeElement.querySelector('#viewer-image');
        if (this.element) {
            this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
            this.element.addEventListener('mouseup', this.onMouseUp.bind(this));
            this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
            this.element.addEventListener('mouseout', this.onMouseOut.bind(this));
            this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        }
    };
    ImgViewerComponent.prototype.ngOnDestroy = function () {
        if (this.element) {
            this.element.removeEventListener('mousedown', this.onMouseDown);
            this.element.removeEventListener('mouseup', this.onMouseUp);
            this.element.removeEventListener('mouseleave', this.onMouseLeave);
            this.element.removeEventListener('mouseout', this.onMouseOut);
            this.element.removeEventListener('mousemove', this.onMouseMove);
        }
    };
    ImgViewerComponent.prototype.onMouseDown = function (event) {
        event.preventDefault();
        this.isDragged = true;
        this.drag = { x: event.pageX, y: event.pageY };
    };
    ImgViewerComponent.prototype.onMouseMove = function (event) {
        if (this.isDragged) {
            event.preventDefault();
            this.delta.x = event.pageX - this.drag.x;
            this.delta.y = event.pageY - this.drag.y;
            this.drag.x = event.pageX;
            this.drag.y = event.pageY;
            var scaleX = (this.scaleX !== 0 ? this.scaleX : 1.0);
            var scaleY = (this.scaleY !== 0 ? this.scaleY : 1.0);
            this.offsetX += (this.delta.x / scaleX);
            this.offsetY += (this.delta.y / scaleY);
        }
    };
    ImgViewerComponent.prototype.onMouseUp = function (event) {
        if (this.isDragged) {
            event.preventDefault();
            this.isDragged = false;
        }
    };
    ImgViewerComponent.prototype.onMouseLeave = function (event) {
        if (this.isDragged) {
            event.preventDefault();
            this.isDragged = false;
        }
    };
    ImgViewerComponent.prototype.onMouseOut = function (event) {
        if (this.isDragged) {
            event.preventDefault();
            this.isDragged = false;
        }
    };
    ImgViewerComponent.prototype.ngOnChanges = function (changes) {
        var blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            this.urlFile = this.contentService.createTrustedUrl(this.blobFile);
            return;
        }
        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    };
    ImgViewerComponent.prototype.zoomIn = function () {
        var ratio = +((this.scaleX + 0.2).toFixed(1));
        this.scaleX = this.scaleY = ratio;
    };
    ImgViewerComponent.prototype.zoomOut = function () {
        var ratio = +((this.scaleX - 0.2).toFixed(1));
        if (ratio < 0.2) {
            ratio = 0.2;
        }
        this.scaleX = this.scaleY = ratio;
    };
    ImgViewerComponent.prototype.rotateLeft = function () {
        var angle = this.rotate - 90;
        this.rotate = Math.abs(angle) < 360 ? angle : 0;
    };
    ImgViewerComponent.prototype.rotateRight = function () {
        var angle = this.rotate + 90;
        this.rotate = Math.abs(angle) < 360 ? angle : 0;
    };
    ImgViewerComponent.prototype.reset = function () {
        this.rotate = 0;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.offsetX = 0;
        this.offsetY = 0;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ImgViewerComponent.prototype, "showToolbar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ImgViewerComponent.prototype, "urlFile", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Blob)
    ], ImgViewerComponent.prototype, "blobFile", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ImgViewerComponent.prototype, "nameFile", void 0);
    ImgViewerComponent = __decorate([
        core_1.Component({
            selector: 'adf-img-viewer',
            templateUrl: './imgViewer.component.html',
            styleUrls: ['./imgViewer.component.scss'],
            host: { 'class': 'adf-image-viewer' },
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [platform_browser_1.DomSanitizer,
            app_config_service_1.AppConfigService,
            content_service_1.ContentService,
            core_1.ElementRef])
    ], ImgViewerComponent);
    return ImgViewerComponent;
}());
exports.ImgViewerComponent = ImgViewerComponent;
//# sourceMappingURL=imgViewer.component.js.map