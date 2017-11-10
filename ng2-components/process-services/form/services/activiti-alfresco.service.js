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
var ActivitiContentService = (function () {
    function ActivitiContentService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
    }
    ActivitiContentService_1 = ActivitiContentService;
    /**
     * Returns a list of child nodes below the specified folder
     *
     * @param accountId
     * @param folderId
     * @returns {null}
     */
    ActivitiContentService.prototype.getAlfrescoNodes = function (accountId, folderId) {
        var _this = this;
        var apiService = this.apiService.getInstance();
        var accountShortId = accountId.replace('alfresco-', '');
        return Rx_1.Observable.fromPromise(apiService.activiti.alfrescoApi.getContentInFolder(accountShortId, folderId))
            .map(this.toJsonArray)
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Returns a list of child nodes below the specified folder
     *
     * @param accountId
     * @param node
     * @param siteId
     * @returns {null}
     */
    ActivitiContentService.prototype.linkAlfrescoNode = function (accountId, node, siteId) {
        var _this = this;
        var apiService = this.apiService.getInstance();
        return Rx_1.Observable.fromPromise(apiService.activiti.contentApi.createTemporaryRelatedContent({
            link: true,
            name: node.title,
            simpleType: node.simpleType,
            source: accountId,
            sourceId: node.id + '@' + siteId
        })).map(this.toJson).catch(function (err) { return _this.handleError(err); });
    };
    ActivitiContentService.prototype.toJson = function (res) {
        if (res) {
            return res || {};
        }
        return {};
    };
    ActivitiContentService.prototype.toJsonArray = function (res) {
        if (res) {
            return res.data || [];
        }
        return [];
    };
    ActivitiContentService.prototype.handleError = function (error) {
        var errMsg = ActivitiContentService_1.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? error.status + " - " + error.statusText : ActivitiContentService_1.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return Rx_1.Observable.throw(errMsg);
    };
    ActivitiContentService.UNKNOWN_ERROR_MESSAGE = 'Unknown error';
    ActivitiContentService.GENERIC_ERROR_MESSAGE = 'Server error';
    ActivitiContentService = ActivitiContentService_1 = __decorate([
        core_1.Injectable()
    ], ActivitiContentService);
    return ActivitiContentService;
    var ActivitiContentService_1;
}());
exports.ActivitiContentService = ActivitiContentService;
