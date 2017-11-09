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
var DocumentListService = (function () {
    function DocumentListService(authService, contentService, apiService, logService, thumbnailService) {
        this.contentService = contentService;
        this.apiService = apiService;
        this.logService = logService;
        this.thumbnailService = thumbnailService;
    }
    DocumentListService_1 = DocumentListService;
    DocumentListService.prototype.getNodesPromise = function (folder, opts) {
        var rootNodeId = DocumentListService_1.ROOT_ID;
        if (opts && opts.rootFolderId) {
            rootNodeId = opts.rootFolderId;
        }
        var params = {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations']
        };
        if (folder) {
            params.relativePath = folder;
        }
        if (opts) {
            if (opts.maxItems) {
                params.maxItems = opts.maxItems;
            }
            if (opts.skipCount) {
                params.skipCount = opts.skipCount;
            }
        }
        return this.apiService.getInstance().nodes.getNodeChildren(rootNodeId, params);
    };
    DocumentListService.prototype.deleteNode = function (nodeId) {
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.deleteNode(nodeId));
    };
    /**
     * Copy a node to destination node
     *
     * @param nodeId The id of the node to be copied
     * @param targetParentId The id of the folder-node where the node have to be copied to
     */
    DocumentListService.prototype.copyNode = function (nodeId, targetParentId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.copyNode(nodeId, { targetParentId: targetParentId }))
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Move a node to destination node
     *
     * @param nodeId The id of the node to be moved
     * @param targetParentId The id of the folder-node where the node have to be moved to
     */
    DocumentListService.prototype.moveNode = function (nodeId, targetParentId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.moveNode(nodeId, { targetParentId: targetParentId }))
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Create a new folder in the path.
     * @param name Folder name
     * @param parentId Parent folder ID
     * @returns {any}
     */
    DocumentListService.prototype.createFolder = function (name, parentId) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.apiService.getInstance().nodes.createFolder(name, '/', parentId))
            .catch(function (err) { return _this.handleError(err); });
    };
    /**
     * Gets the folder node with the specified relative name path below the root node.
     * @param folder Path to folder.
     * @param opts Options.
     * @returns {Observable<NodePaging>} Folder entity.
     */
    DocumentListService.prototype.getFolder = function (folder, opts) {
        var _this = this;
        return Rx_1.Observable.fromPromise(this.getNodesPromise(folder, opts))
            .map(function (res) { return res; })
            .catch(function (err) { return _this.handleError(err); });
    };
    DocumentListService.prototype.getFolderNode = function (nodeId) {
        var opts = {
            includeSource: true,
            include: ['path', 'properties', 'allowableOperations']
        };
        var nodes = this.apiService.getInstance().nodes;
        return nodes.getNodeInfo(nodeId, opts);
    };
    /**
     * Get thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    DocumentListService.prototype.getDocumentThumbnailUrl = function (node) {
        return this.thumbnailService.getDocumentThumbnailUrl(node);
    };
    DocumentListService.prototype.getMimeTypeIcon = function (mimeType) {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    };
    DocumentListService.prototype.getDefaultMimeTypeIcon = function () {
        return this.thumbnailService.getDefaultMimeTypeIcon();
    };
    DocumentListService.prototype.hasPermission = function (node, permission) {
        return this.contentService.hasPermission(node, permission);
    };
    DocumentListService.prototype.handleError = function (error) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        this.logService.error(error);
        return Rx_1.Observable.throw(error || 'Server error');
    };
    DocumentListService.ROOT_ID = '-root-';
    DocumentListService = DocumentListService_1 = __decorate([
        core_1.Injectable()
    ], DocumentListService);
    return DocumentListService;
    var DocumentListService_1;
}());
exports.DocumentListService = DocumentListService;
