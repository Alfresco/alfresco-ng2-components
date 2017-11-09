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
var Rx_1 = require("rxjs/Rx");
/**
 *
 * ECMUserService retrieve all the information of an Ecm user.
 *
 * @returns {ECMUserService} .
 */
var EcmUserService = (function () {
    function EcmUserService(apiService, contentService, logService) {
        this.apiService = apiService;
        this.contentService = contentService;
        this.logService = logService;
    }
    /**
     * get User Information via ECM
     * @param userName - the user name
     */
    EcmUserService.prototype.getUserInfo = function (userName) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().core.peopleApi.getPerson(userName))
            .map(function (data) { return data['entry']; })
            .catch(function (err) { return _this.handleError(err); });
    };
    EcmUserService.prototype.getCurrentUserInfo = function () {
        return this.getUserInfo('-me-');
    };
    EcmUserService.prototype.getUserProfileImage = function (avatarId) {
        if (avatarId) {
            var nodeObj = { entry: { id: avatarId } };
            return this.contentService.getContentUrl(nodeObj);
        }
    };
    /**
     * Throw the error
     * @param error
     * @returns {ErrorObservable}
     */
    EcmUserService.prototype.handleError = function (error) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        this.logService.error(error);
        return Rx_1.Observable.throw(error || 'Server error');
    };
    EcmUserService = __decorate([
        core_1.Injectable()
    ], EcmUserService);
    return EcmUserService;
}());
exports.EcmUserService = EcmUserService;
