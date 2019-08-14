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
var user_preferences_service_1 = require("./user-preferences.service");
var operators_1 = require("rxjs/operators");
var NodesApiService = /** @class */ (function () {
    function NodesApiService(api, preferences) {
        this.api = api;
        this.preferences = preferences;
    }
    Object.defineProperty(NodesApiService.prototype, "nodesApi", {
        get: function () {
            return this.api.getInstance().core.nodesApi;
        },
        enumerable: true,
        configurable: true
    });
    NodesApiService.prototype.getEntryFromEntity = function (entity) {
        return entity.entry;
    };
    /**
     * Gets the stored information about a node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns Node information
     */
    NodesApiService.prototype.getNode = function (nodeId, options) {
        if (options === void 0) { options = {}; }
        var defaults = {
            include: ['path', 'properties', 'allowableOperations', 'permissions']
        };
        var queryOptions = Object.assign(defaults, options);
        var promise = this.nodesApi
            .getNode(nodeId, queryOptions)
            .then(this.getEntryFromEntity);
        return rxjs_1.from(promise).pipe(operators_1.catchError(function (err) { return rxjs_1.throwError(err); }));
    };
    /**
     * Gets the items contained in a folder node.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns List of child items from the folder
     */
    NodesApiService.prototype.getNodeChildren = function (nodeId, options) {
        if (options === void 0) { options = {}; }
        var defaults = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0,
            include: ['path', 'properties', 'allowableOperations', 'permissions']
        };
        var queryOptions = Object.assign(defaults, options);
        var promise = this.nodesApi
            .getNodeChildren(nodeId, queryOptions);
        return rxjs_1.from(promise).pipe(operators_1.catchError(function (err) { return rxjs_1.throwError(err); }));
    };
    /**
     * Creates a new document node inside a folder.
     * @param parentNodeId ID of the parent folder node
     * @param nodeBody Data for the new node
     * @param options Optional parameters supported by JS-API
     * @returns Details of the new node
     */
    NodesApiService.prototype.createNode = function (parentNodeId, nodeBody, options) {
        if (options === void 0) { options = {}; }
        var promise = this.nodesApi
            .addNode(parentNodeId, nodeBody, options)
            .then(this.getEntryFromEntity);
        return rxjs_1.from(promise).pipe(operators_1.catchError(function (err) { return rxjs_1.throwError(err); }));
    };
    /**
     * Creates a new folder node inside a parent folder.
     * @param parentNodeId ID of the parent folder node
     * @param nodeBody Data for the new folder
     * @param options Optional parameters supported by JS-API
     * @returns Details of the new folder
     */
    NodesApiService.prototype.createFolder = function (parentNodeId, nodeBody, options) {
        if (options === void 0) { options = {}; }
        var body = Object.assign({ nodeType: 'cm:folder' }, nodeBody);
        return this.createNode(parentNodeId, body, options);
    };
    /**
     * Updates the information about a node.
     * @param nodeId ID of the target node
     * @param nodeBody New data for the node
     * @param options Optional parameters supported by JS-API
     * @returns Updated node information
     */
    NodesApiService.prototype.updateNode = function (nodeId, nodeBody, options) {
        if (options === void 0) { options = {}; }
        var defaults = {
            include: ['path', 'properties', 'allowableOperations', 'permissions']
        };
        var queryOptions = Object.assign(defaults, options);
        var promise = this.nodesApi
            .updateNode(nodeId, nodeBody, queryOptions)
            .then(this.getEntryFromEntity);
        return rxjs_1.from(promise).pipe(operators_1.catchError(function (err) { return rxjs_1.throwError(err); }));
    };
    /**
     * Moves a node to the trashcan.
     * @param nodeId ID of the target node
     * @param options Optional parameters supported by JS-API
     * @returns Empty result that notifies when the deletion is complete
     */
    NodesApiService.prototype.deleteNode = function (nodeId, options) {
        if (options === void 0) { options = {}; }
        var promise = this.nodesApi.deleteNode(nodeId, options);
        return rxjs_1.from(promise).pipe(operators_1.catchError(function (err) { return rxjs_1.throwError(err); }));
    };
    /**
     * Restores a node previously moved to the trashcan.
     * @param nodeId ID of the node to restore
     * @returns Details of the restored node
     */
    NodesApiService.prototype.restoreNode = function (nodeId) {
        var promise = this.nodesApi
            .restoreNode(nodeId)
            .then(this.getEntryFromEntity);
        return rxjs_1.from(promise).pipe(operators_1.catchError(function (err) { return rxjs_1.throwError(err); }));
    };
    NodesApiService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            user_preferences_service_1.UserPreferencesService])
    ], NodesApiService);
    return NodesApiService;
}());
exports.NodesApiService = NodesApiService;
//# sourceMappingURL=nodes-api.service.js.map