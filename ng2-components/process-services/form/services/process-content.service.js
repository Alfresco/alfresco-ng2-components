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
var ProcessContentService = (function () {
    function ProcessContentService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
    }
    ProcessContentService_1 = ProcessContentService;
    Object.defineProperty(ProcessContentService.prototype, "contentApi", {
        get: function () {
            return this.apiService.getInstance().activiti.contentApi;
        },
        enumerable: true,
        configurable: true
    });
    ProcessContentService.prototype.createTemporaryRawRelatedContent = function (file) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.contentApi.createTemporaryRawRelatedContent(file)).catch(function (err) { return _this.handleError(err); });
    };
    ProcessContentService.prototype.getFileContent = function (contentId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.contentApi.getContent(contentId)).catch(function (err) { return _this.handleError(err); });
    };
    ProcessContentService.prototype.getFileRawContent = function (contentId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.contentApi.getRawContent(contentId)).catch(function (err) { return _this.handleError(err); });
    };
    ProcessContentService.prototype.getFileRawContentUrl = function (contentId) {
        return this.contentApi.getRawContentUrl(contentId);
    };
    ProcessContentService.prototype.getContentThumbnailUrl = function (contentId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.contentApi.getContentThumbnailUrl(contentId)).catch(function (err) { return _this.handleError(err); });
    };
    ProcessContentService.prototype.getTaskRelatedContent = function (taskId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.contentApi.getRelatedContentForTask(taskId))
            .catch(function (err) { return _this.handleError(err); });
    };
    ProcessContentService.prototype.getProcessRelatedContent = function (processId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.contentApi.getRelatedContentForProcessInstance(processId))
            .catch(function (err) { return _this.handleError(err); });
    };
    ProcessContentService.prototype.deleteRelatedContent = function (contentId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.contentApi.deleteContent(contentId))
            .catch(function (err) { return _this.handleError(err); });
    };
    ProcessContentService.prototype.createProcessRelatedContent = function (processInstanceId, content, opts) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.contentApi.createRelatedContentOnProcessInstance(processInstanceId, content, opts))
            .catch(function (err) { return _this.handleError(err); });
    };
    ProcessContentService.prototype.createTaskRelatedContent = function (taskId, file, opts) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.contentApi.createRelatedContentOnTask(taskId, file, opts))
            .catch(function (err) { return _this.handleError(err); });
    };
    ProcessContentService.prototype.toJson = function (res) {
        if (res) {
            return res || {};
        }
        return {};
    };
    ProcessContentService.prototype.toJsonArray = function (res) {
        if (res) {
            return res.data || [];
        }
        return [];
    };
    ProcessContentService.prototype.handleError = function (error) {
        var errMsg = ProcessContentService_1.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? error.status + " - " + error.statusText : ProcessContentService_1.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return Rx_1.Observable.throw(errMsg);
    };
    ProcessContentService.UNKNOWN_ERROR_MESSAGE = 'Unknown error';
    ProcessContentService.GENERIC_ERROR_MESSAGE = 'Server error';
    ProcessContentService = ProcessContentService_1 = __decorate([
        core_1.Injectable()
    ], ProcessContentService);
    return ProcessContentService;
    var ProcessContentService_1;
}());
exports.ProcessContentService = ProcessContentService;
