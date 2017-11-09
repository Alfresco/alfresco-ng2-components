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
var MediaPlayerComponent = (function () {
    function MediaPlayerComponent(contentService) {
        this.contentService = contentService;
    }
    MediaPlayerComponent.prototype.ngOnChanges = function (changes) {
        var blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            this.urlFile = this.contentService.createTrustedUrl(this.blobFile);
            return;
        }
        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    };
    __decorate([
        core_1.Input()
    ], MediaPlayerComponent.prototype, "urlFile", void 0);
    __decorate([
        core_1.Input()
    ], MediaPlayerComponent.prototype, "blobFile", void 0);
    __decorate([
        core_1.Input()
    ], MediaPlayerComponent.prototype, "mimeType", void 0);
    __decorate([
        core_1.Input()
    ], MediaPlayerComponent.prototype, "nameFile", void 0);
    MediaPlayerComponent = __decorate([
        core_1.Component({
            selector: 'adf-media-player',
            templateUrl: './mediaPlayer.component.html',
            styleUrls: ['./mediaPlayer.component.scss'],
            host: { 'class': 'adf-media-player' },
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], MediaPlayerComponent);
    return MediaPlayerComponent;
}());
exports.MediaPlayerComponent = MediaPlayerComponent;
