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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var app_config_service_1 = require("../app-config/app-config.service");
var alfresco_api_service_1 = require("../services/alfresco-api.service");
var storage_service_1 = require("../services/storage.service");
/* tslint:disable:adf-file-name */
var AlfrescoApiServiceMock = /** @class */ (function (_super) {
    __extends(AlfrescoApiServiceMock, _super);
    function AlfrescoApiServiceMock(appConfig, storageService) {
        var _this = _super.call(this, appConfig, storageService) || this;
        _this.appConfig = appConfig;
        _this.storageService = storageService;
        if (!_this.alfrescoApi) {
            _this.initAlfrescoApi();
        }
        return _this;
    }
    AlfrescoApiServiceMock.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.alfrescoApiInitializedSubject.next();
            resolve();
        });
    };
    AlfrescoApiServiceMock = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [app_config_service_1.AppConfigService,
            storage_service_1.StorageService])
    ], AlfrescoApiServiceMock);
    return AlfrescoApiServiceMock;
}(alfresco_api_service_1.AlfrescoApiService));
exports.AlfrescoApiServiceMock = AlfrescoApiServiceMock;
//# sourceMappingURL=alfresco-api.service.mock.js.map