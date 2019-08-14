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
var log_service_1 = require("./log.service");
var alfresco_api_service_1 = require("./alfresco-api.service");
var operators_1 = require("rxjs/operators");
var DownloadZipService = /** @class */ (function () {
    function DownloadZipService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
    }
    /**
     * Creates a new download.
     * @param payload Object containing the node IDs of the items to add to the ZIP file
     * @returns Status object for the download
     */
    DownloadZipService.prototype.createDownload = function (payload) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.downloadsApi.createDownload(payload)).pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets a content URL for the given node.
     * @param nodeId Node to get URL for.
     * @param attachment Toggles whether to retrieve content as an attachment for download
     * @returns URL string
     */
    DownloadZipService.prototype.getContentUrl = function (nodeId, attachment) {
        return this.apiService.getInstance().content.getContentUrl(nodeId, attachment);
    };
    /**
     * Gets a Node via its node ID.
     * @param nodeId ID of the target node
     * @returns Details of the node
     */
    DownloadZipService.prototype.getNode = function (nodeId) {
        return rxjs_1.from(this.apiService.getInstance().core.nodesApi.getNode(nodeId));
    };
    /**
     * Gets status information for a download node.
     * @param downloadId ID of the download node
     * @returns Status object for the download
     */
    DownloadZipService.prototype.getDownload = function (downloadId) {
        return rxjs_1.from(this.apiService.getInstance().core.downloadsApi.getDownload(downloadId));
    };
    /**
     * Cancels a download.
     * @param downloadId ID of the target download node
     */
    DownloadZipService.prototype.cancelDownload = function (downloadId) {
        this.apiService.getInstance().core.downloadsApi.cancelDownload(downloadId);
    };
    DownloadZipService.prototype.handleError = function (error) {
        this.logService.error(error);
        return rxjs_1.throwError(error || 'Server error');
    };
    DownloadZipService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], DownloadZipService);
    return DownloadZipService;
}());
exports.DownloadZipService = DownloadZipService;
//# sourceMappingURL=download-zip.service.js.map