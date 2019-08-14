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
var alfresco_api_service_1 = require("./alfresco-api.service");
var log_service_1 = require("./log.service");
var operators_1 = require("rxjs/operators");
var AppsProcessService = /** @class */ (function () {
    function AppsProcessService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
    }
    /**
     * Gets a list of deployed apps for this user.
     * @returns The list of deployed apps
     */
    AppsProcessService.prototype.getDeployedApplications = function () {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .pipe(operators_1.map(function (response) { return response.data; }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets a list of deployed apps for this user, where the app name is `name`.
     * @param name Name of the app
     * @returns The list of deployed apps
     */
    AppsProcessService.prototype.getDeployedApplicationsByName = function (name) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .pipe(operators_1.map(function (response) { return response.data.find(function (app) { return app.name === name; }); }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets the details for a specific app ID number.
     * @param appId ID of the target app
     * @returns Details of the app
     */
    AppsProcessService.prototype.getApplicationDetailsById = function (appId) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .pipe(operators_1.map(function (response) { return response.data.find(function (app) { return app.id === appId; }); }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    AppsProcessService.prototype.handleError = function (error) {
        this.logService.error(error);
        return rxjs_1.throwError(error || 'Server error');
    };
    AppsProcessService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], AppsProcessService);
    return AppsProcessService;
}());
exports.AppsProcessService = AppsProcessService;
//# sourceMappingURL=apps-process.service.js.map