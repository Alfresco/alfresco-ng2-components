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
var ProcessContentService = /** @class */ (function () {
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
    /**
     * Create temporary related content from an uploaded file.
     * @param file File to use for content
     * @returns The created content data
     */
    ProcessContentService.prototype.createTemporaryRawRelatedContent = function (file) {
        var _this = this;
        return rxjs_1.from(this.contentApi.createTemporaryRawRelatedContent(file))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets the metadata for a related content item.
     * @param contentId ID of the content item
     * @returns Metadata for the content
     */
    ProcessContentService.prototype.getFileContent = function (contentId) {
        var _this = this;
        return rxjs_1.from(this.contentApi.getContent(contentId))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets raw binary content data for a related content file.
     * @param contentId ID of the related content
     * @returns Binary data of the related content
     */
    ProcessContentService.prototype.getFileRawContent = function (contentId) {
        var _this = this;
        return rxjs_1.from(this.contentApi.getRawContent(contentId))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets the preview for a related content file.
     * @param contentId ID of the related content
     * @returns Binary data of the content preview
     */
    ProcessContentService.prototype.getContentPreview = function (contentId) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.contentApi.getContentPreview(contentId).then(function (result) {
                observer.next(result);
                observer.complete();
            }, function () {
                _this.contentApi.getRawContent(contentId).then(function (data) {
                    observer.next(data);
                    observer.complete();
                }, function (err) {
                    observer.error(err);
                    observer.complete();
                });
            });
        });
    };
    /**
     * Gets a URL for direct access to a related content file.
     * @param contentId ID of the related content
     * @returns URL to access the content
     */
    ProcessContentService.prototype.getFileRawContentUrl = function (contentId) {
        return this.contentApi.getRawContentUrl(contentId);
    };
    /**
     * Gets the thumbnail for a related content file.
     * @param contentId ID of the related content
     * @returns Binary data of the thumbnail image
     */
    ProcessContentService.prototype.getContentThumbnail = function (contentId) {
        var _this = this;
        return rxjs_1.from(this.contentApi.getContentThumbnail(contentId))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets related content items for a task instance.
     * @param taskId ID of the target task
     * @param opts Options supported by JS-API
     * @returns Metadata for the content
     */
    ProcessContentService.prototype.getTaskRelatedContent = function (taskId, opts) {
        var _this = this;
        return rxjs_1.from(this.contentApi.getRelatedContentForTask(taskId, opts))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets related content items for a process instance.
     * @param processId ID of the target process
     * @param opts Options supported by JS-API
     * @returns Metadata for the content
     */
    ProcessContentService.prototype.getProcessRelatedContent = function (processId, opts) {
        var _this = this;
        return rxjs_1.from(this.contentApi.getRelatedContentForProcessInstance(processId, opts))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Deletes related content.
     * @param contentId Identifier of the content to delete
     * @returns Null response that notifies when the deletion is complete
     */
    ProcessContentService.prototype.deleteRelatedContent = function (contentId) {
        var _this = this;
        return rxjs_1.from(this.contentApi.deleteContent(contentId))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Associates an uploaded file with a process instance.
     * @param processInstanceId ID of the target process instance
     * @param content File to associate
     * @param opts Options supported by JS-API
     * @returns Details of created content
     */
    ProcessContentService.prototype.createProcessRelatedContent = function (processInstanceId, content, opts) {
        var _this = this;
        return rxjs_1.from(this.contentApi.createRelatedContentOnProcessInstance(processInstanceId, content, opts))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Associates an uploaded file with a task instance.
     * @param taskId ID of the target task
     * @param file File to associate
     * @param opts Options supported by JS-API
     * @returns Details of created content
     */
    ProcessContentService.prototype.createTaskRelatedContent = function (taskId, file, opts) {
        var _this = this;
        return rxjs_1.from(this.contentApi.createRelatedContentOnTask(taskId, file, opts))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Creates a JSON representation of data.
     * @param res Object representing data
     * @returns JSON object
     */
    ProcessContentService.prototype.toJson = function (res) {
        if (res) {
            return res || {};
        }
        return {};
    };
    /**
     * Creates a JSON array representation of data.
     * @param res Object representing data
     * @returns JSON array object
     */
    ProcessContentService.prototype.toJsonArray = function (res) {
        if (res) {
            return res.data || [];
        }
        return [];
    };
    /**
     * Reports an error message.
     * @param error Data object with optional `message` and `status` fields for the error
     * @returns Callback when an error occurs
     */
    ProcessContentService.prototype.handleError = function (error) {
        var errMsg = ProcessContentService_1.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? error.status + " - " + error.statusText : ProcessContentService_1.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return rxjs_1.throwError(errMsg);
    };
    var ProcessContentService_1;
    ProcessContentService.UNKNOWN_ERROR_MESSAGE = 'Unknown error';
    ProcessContentService.GENERIC_ERROR_MESSAGE = 'Server error';
    ProcessContentService = ProcessContentService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], ProcessContentService);
    return ProcessContentService;
}());
exports.ProcessContentService = ProcessContentService;
//# sourceMappingURL=process-content.service.js.map