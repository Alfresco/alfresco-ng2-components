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
var rxjs_1 = require("rxjs");
var product_version_model_1 = require("../models/product-version.model");
var alfresco_api_service_1 = require("./alfresco-api.service");
var operators_1 = require("rxjs/operators");
var DiscoveryApiService = /** @class */ (function () {
    function DiscoveryApiService(apiService) {
        this.apiService = apiService;
    }
    /**
     * Gets product information for Content Services.
     * @returns ProductVersionModel containing product details
     */
    DiscoveryApiService.prototype.getEcmProductInfo = function () {
        return rxjs_1.from(this.apiService.getInstance().discovery.discoveryApi.getRepositoryInformation())
            .pipe(operators_1.map(function (res) { return new product_version_model_1.EcmProductVersionModel(res); }), operators_1.catchError(function (err) { return rxjs_1.throwError(err); }));
    };
    /**
     * Gets product information for Process Services.
     * @returns ProductVersionModel containing product details
     */
    DiscoveryApiService.prototype.getBpmProductInfo = function () {
        return rxjs_1.from(this.apiService.getInstance().activiti.aboutApi.getAppVersion())
            .pipe(operators_1.map(function (res) { return new product_version_model_1.BpmProductVersionModel(res); }), operators_1.catchError(function (err) { return rxjs_1.throwError(err); }));
    };
    DiscoveryApiService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService])
    ], DiscoveryApiService);
    return DiscoveryApiService;
}());
exports.DiscoveryApiService = DiscoveryApiService;
//# sourceMappingURL=discovery-api.service.js.map