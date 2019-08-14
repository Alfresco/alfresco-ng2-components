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
var alfresco_api_service_1 = require("../../services/alfresco-api.service");
var log_service_1 = require("../../services/log.service");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ActivitiContentService = /** @class */ (function () {
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
     */
    ActivitiContentService.prototype.getAlfrescoNodes = function (accountId, folderId) {
        var _this = this;
        var apiService = this.apiService.getInstance();
        var accountShortId = accountId.replace('alfresco-', '');
        return rxjs_1.from(apiService.activiti.alfrescoApi.getContentInFolder(accountShortId, folderId))
            .pipe(operators_1.map(this.toJsonArray), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Returns a list of all the repositories configured
     *
     * @param accountId
     * @param folderId
     */
    ActivitiContentService.prototype.getAlfrescoRepositories = function (tenantId, includeAccount) {
        var _this = this;
        var apiService = this.apiService.getInstance();
        var opts = {
            tenantId: tenantId,
            includeAccounts: includeAccount
        };
        return rxjs_1.from(apiService.activiti.alfrescoApi.getRepositories(opts))
            .pipe(operators_1.map(this.toJsonArray), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Returns a list of child nodes below the specified folder
     *
     * @param accountId
     * @param node
     * @param siteId
     */
    ActivitiContentService.prototype.linkAlfrescoNode = function (accountId, node, siteId) {
        var _this = this;
        var apiService = this.apiService.getInstance();
        return rxjs_1.from(apiService.activiti.contentApi.createTemporaryRelatedContent({
            link: true,
            name: node.title,
            simpleType: node.simpleType,
            source: accountId,
            sourceId: node.id + '@' + siteId
        }))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    ActivitiContentService.prototype.applyAlfrescoNode = function (node, siteId, accountId) {
        var _this = this;
        var apiService = this.apiService.getInstance();
        var currentSideId = siteId ? siteId : this.getSiteNameFromNodePath(node);
        var params = {
            source: accountId,
            mimeType: node.content.mimeType,
            sourceId: node.id + ';' + node.properties['cm:versionLabel'] + '@' + currentSideId,
            name: node.name,
            link: false
        };
        return rxjs_1.from(apiService.activiti.contentApi.createTemporaryRelatedContent(params))
            .pipe(operators_1.map(this.toJson), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    ActivitiContentService.prototype.getSiteNameFromNodePath = function (node) {
        var siteName = '';
        if (node.path) {
            var foundNode = node.path
                .elements.find(function (pathNode) {
                return pathNode.nodeType === 'st:site' &&
                    pathNode.name !== 'Sites';
            });
            siteName = foundNode ? foundNode.name : '';
        }
        return siteName.toLocaleLowerCase();
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
        return rxjs_1.throwError(errMsg);
    };
    var ActivitiContentService_1;
    ActivitiContentService.UNKNOWN_ERROR_MESSAGE = 'Unknown error';
    ActivitiContentService.GENERIC_ERROR_MESSAGE = 'Server error';
    ActivitiContentService = ActivitiContentService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], ActivitiContentService);
    return ActivitiContentService;
}());
exports.ActivitiContentService = ActivitiContentService;
//# sourceMappingURL=activiti-alfresco.service.js.map