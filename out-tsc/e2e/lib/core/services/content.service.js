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
var platform_browser_1 = require("@angular/platform-browser");
var rxjs_1 = require("rxjs");
var alfresco_api_service_1 = require("./alfresco-api.service");
var authentication_service_1 = require("./authentication.service");
var log_service_1 = require("./log.service");
var operators_1 = require("rxjs/operators");
var permissions_enum_1 = require("../models/permissions.enum");
var allowable_operations_enum_1 = require("../models/allowable-operations.enum");
var download_service_1 = require("./download.service");
var thumbnail_service_1 = require("./thumbnail.service");
var ContentService = /** @class */ (function () {
    function ContentService(authService, apiService, logService, sanitizer, downloadService, thumbnailService) {
        this.authService = authService;
        this.apiService = apiService;
        this.logService = logService;
        this.sanitizer = sanitizer;
        this.downloadService = downloadService;
        this.thumbnailService = thumbnailService;
        this.folderCreated = new rxjs_1.Subject();
        this.folderCreate = new rxjs_1.Subject();
        this.folderEdit = new rxjs_1.Subject();
    }
    /**
     * @deprecated in 3.2.0, use DownloadService instead.
     * Invokes content download for a Blob with a file name.
     * @param blob Content to download.
     * @param fileName Name of the resulting file.
     */
    ContentService.prototype.downloadBlob = function (blob, fileName) {
        this.downloadService.downloadBlob(blob, fileName);
    };
    /**
     * @deprecated in 3.2.0, use DownloadService instead.
     * Invokes content download for a data array with a file name.
     * @param data Data to download.
     * @param fileName Name of the resulting file.
     */
    ContentService.prototype.downloadData = function (data, fileName) {
        this.downloadService.downloadData(data, fileName);
    };
    /**
     * @deprecated in 3.2.0, use DownloadService instead.
     * Invokes content download for a JSON object with a file name.
     * @param json JSON object to download.
     * @param fileName Name of the resulting file.
     */
    ContentService.prototype.downloadJSON = function (json, fileName) {
        this.downloadService.downloadJSON(json, fileName);
    };
    /**
     * Creates a trusted object URL from the Blob.
     * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
     * @param  blob Data to wrap into object URL
     * @returns URL string
     */
    ContentService.prototype.createTrustedUrl = function (blob) {
        var url = window.URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(url);
    };
    Object.defineProperty(ContentService.prototype, "contentApi", {
        get: function () {
            return this.apiService.getInstance().content;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @deprecated in 3.2.0, use ThumbnailService instead.
     * Gets a thumbnail URL for the given document node.
     * @param node Node or Node ID to get URL for.
     * @param attachment Toggles whether to retrieve content as an attachment for download
     * @param ticket Custom ticket to use for authentication
     * @returns URL string
     */
    ContentService.prototype.getDocumentThumbnailUrl = function (node, attachment, ticket) {
        return this.thumbnailService.getDocumentThumbnailUrl(node, attachment, ticket);
    };
    /**
     * Gets a content URL for the given node.
     * @param node Node or Node ID to get URL for.
     * @param attachment Toggles whether to retrieve content as an attachment for download
     * @param ticket Custom ticket to use for authentication
     * @returns URL string or `null`
     */
    ContentService.prototype.getContentUrl = function (node, attachment, ticket) {
        if (node) {
            var nodeId = void 0;
            if (typeof node === 'string') {
                nodeId = node;
            }
            else if (node.entry) {
                nodeId = node.entry.id;
            }
            return this.contentApi.getContentUrl(nodeId, attachment, ticket);
        }
        return null;
    };
    /**
     * Gets content for the given node.
     * @param nodeId ID of the target node
     * @returns Content data
     */
    ContentService.prototype.getNodeContent = function (nodeId) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().core.nodesApi.getFileContent(nodeId))
            .pipe(operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    /**
     * Gets a Node via its node ID.
     * @param nodeId ID of the target node
     * @param opts Options supported by JS-API
     * @returns Details of the folder
     */
    ContentService.prototype.getNode = function (nodeId, opts) {
        return rxjs_1.from(this.apiService.getInstance().nodes.getNode(nodeId, opts));
    };
    /**
     * Checks if the user has permission on that node
     * @param node Node to check permissions
     * @param permission Required permission type
     * @returns True if the user has the required permissions, false otherwise
     */
    ContentService.prototype.hasPermissions = function (node, permission) {
        var hasPermissions = false;
        if (node && node.permissions && node.permissions.locallySet) {
            if (permission && permission.startsWith('!')) {
                hasPermissions = node.permissions.locallySet.find(function (currentPermission) { return currentPermission.name === permission.replace('!', ''); }) ? false : true;
            }
            else {
                hasPermissions = node.permissions.locallySet.find(function (currentPermission) { return currentPermission.name === permission; }) ? true : false;
            }
        }
        else {
            if (permission === permissions_enum_1.PermissionsEnum.CONSUMER) {
                hasPermissions = true;
            }
            else if (permission === permissions_enum_1.PermissionsEnum.NOT_CONSUMER) {
                hasPermissions = false;
            }
            else if (permission && permission.startsWith('!')) {
                hasPermissions = true;
            }
        }
        return hasPermissions;
    };
    /**
     * Checks if the user has permissions on that node
     * @param node Node to check allowableOperations
     * @param allowableOperation Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
     * @returns True if the user has the required permissions, false otherwise
     */
    ContentService.prototype.hasAllowableOperations = function (node, allowableOperation) {
        var hasAllowableOperations = false;
        if (node && node.allowableOperations) {
            if (allowableOperation && allowableOperation.startsWith('!')) {
                hasAllowableOperations = node.allowableOperations.find(function (currentOperation) { return currentOperation === allowableOperation.replace('!', ''); }) ? false : true;
            }
            else {
                hasAllowableOperations = node.allowableOperations.find(function (currentOperation) { return currentOperation === allowableOperation; }) ? true : false;
            }
        }
        else {
            if (allowableOperation && allowableOperation.startsWith('!')) {
                hasAllowableOperations = true;
            }
        }
        if (allowableOperation === allowable_operations_enum_1.AllowableOperationsEnum.COPY) {
            hasAllowableOperations = true;
        }
        if (allowableOperation === allowable_operations_enum_1.AllowableOperationsEnum.LOCK) {
            hasAllowableOperations = node.isFile;
            if (node.isLocked && node.allowableOperations) {
                hasAllowableOperations = !!~node.allowableOperations.indexOf('updatePermissions');
            }
        }
        return hasAllowableOperations;
    };
    ContentService.prototype.handleError = function (error) {
        this.logService.error(error);
        return rxjs_1.throwError(error || 'Server error');
    };
    ContentService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [authentication_service_1.AuthenticationService,
            alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService,
            platform_browser_1.DomSanitizer,
            download_service_1.DownloadService,
            thumbnail_service_1.ThumbnailService])
    ], ContentService);
    return ContentService;
}());
exports.ContentService = ContentService;
//# sourceMappingURL=content.service.js.map