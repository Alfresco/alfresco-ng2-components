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
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var app_config_service_1 = require("./../../app-config/app-config.service");
var TxtViewerComponent = /** @class */ (function () {
    function TxtViewerComponent(http, appConfigService) {
        this.http = http;
        this.appConfigService = appConfigService;
    }
    TxtViewerComponent.prototype.ngOnChanges = function (changes) {
        var blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            return this.readBlob(blobFile.currentValue);
        }
        var urlFile = changes['urlFile'];
        if (urlFile && urlFile.currentValue) {
            return this.getUrlContent(urlFile.currentValue);
        }
        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    };
    TxtViewerComponent.prototype.getUrlContent = function (url) {
        var _this = this;
        var withCredentialsMode = this.appConfigService.get('auth.withCredentials', false);
        return new Promise(function (resolve, reject) {
            _this.http.get(url, { responseType: 'text', withCredentials: withCredentialsMode }).subscribe(function (res) {
                _this.content = res;
                resolve();
            }, function (event) {
                reject(event);
            });
        });
    };
    TxtViewerComponent.prototype.readBlob = function (blob) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                _this.content = reader.result;
                resolve();
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsText(blob);
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], TxtViewerComponent.prototype, "urlFile", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Blob)
    ], TxtViewerComponent.prototype, "blobFile", void 0);
    TxtViewerComponent = __decorate([
        core_1.Component({
            selector: 'adf-txt-viewer',
            templateUrl: './txtViewer.component.html',
            styleUrls: ['./txtViewer.component.scss'],
            host: { 'class': 'adf-txt-viewer' },
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, app_config_service_1.AppConfigService])
    ], TxtViewerComponent);
    return TxtViewerComponent;
}());
exports.TxtViewerComponent = TxtViewerComponent;
//# sourceMappingURL=txtViewer.component.js.map