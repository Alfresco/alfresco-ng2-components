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
var operators_1 = require("rxjs/operators");
var content_service_1 = require("../../services/content.service");
var alfresco_api_service_1 = require("../../services/alfresco-api.service");
var log_service_1 = require("../../services/log.service");
var ecm_user_model_1 = require("../models/ecm-user.model");
var EcmUserService = /** @class */ (function () {
    function EcmUserService(apiService, contentService, logService) {
        this.apiService = apiService;
        this.contentService = contentService;
        this.logService = logService;
    }
    /**
     * Gets information about a user identified by their username.
     * @param userName Target username
     * @returns User information
     */
    EcmUserService.prototype.getUserInfo = function (userName) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.peopleApi.getPerson(userName))
            .pipe(operators_1.map(function (personEntry) {
            return new ecm_user_model_1.EcmUserModel(personEntry.entry);
        }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets information about the user who is currently logged-in.
     * @returns User information as for getUserInfo
     */
    EcmUserService.prototype.getCurrentUserInfo = function () {
        return this.getUserInfo('-me-');
    };
    /**
     * Returns a profile image as a URL.
     * @param avatarId Target avatar
     * @returns Image URL
     */
    EcmUserService.prototype.getUserProfileImage = function (avatarId) {
        if (avatarId) {
            return this.contentService.getContentUrl(avatarId);
        }
        return null;
    };
    /**
     * Throw the error
     * @param error
     */
    EcmUserService.prototype.handleError = function (error) {
        this.logService.error(error);
        return rxjs_1.throwError(error || 'Server error');
    };
    EcmUserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            content_service_1.ContentService,
            log_service_1.LogService])
    ], EcmUserService);
    return EcmUserService;
}());
exports.EcmUserService = EcmUserService;
//# sourceMappingURL=ecm-user.service.js.map