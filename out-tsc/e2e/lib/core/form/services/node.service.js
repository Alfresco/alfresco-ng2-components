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
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var node_metadata_model_1 = require("../models/node-metadata.model");
var operators_1 = require("rxjs/operators");
var NodeService = /** @class */ (function () {
    function NodeService(apiService) {
        this.apiService = apiService;
    }
    /**
     * Get the metadata and the nodeType for a nodeId cleaned by the prefix.
     * @param nodeId ID of the target node
     * @returns Node metadata
     */
    NodeService.prototype.getNodeMetadata = function (nodeId) {
        return rxjs_1.from(this.apiService.getInstance().nodes.getNode(nodeId))
            .pipe(operators_1.map(this.cleanMetadataFromSemicolon));
    };
    /**
     * Create a new Node from form metadata.
     * @param path Path to the node
     * @param nodeType Node type
     * @param name Node name
     * @param nameSpace Namespace for properties
     * @param data Property data to store in the node under namespace
     * @returns The created node
     */
    NodeService.prototype.createNodeMetadata = function (nodeType, nameSpace, data, path, name) {
        var properties = {};
        for (var key in data) {
            if (data[key]) {
                properties[nameSpace + ':' + key] = data[key];
            }
        }
        return this.createNode(name || this.generateUuid(), nodeType, properties, path);
    };
    /**
     * Create a new Node from form metadata
     * @param name Node name
     * @param nodeType Node type
     * @param properties Node body properties
     * @param path Path to the node
     * @returns The created node
     */
    NodeService.prototype.createNode = function (name, nodeType, properties, path) {
        var body = {
            name: name,
            nodeType: nodeType,
            properties: properties,
            relativePath: path
        };
        var apiService = this.apiService.getInstance();
        return rxjs_1.from(apiService.nodes.addNode('-root-', body, {}));
    };
    NodeService.prototype.generateUuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    NodeService.prototype.cleanMetadataFromSemicolon = function (nodeEntry) {
        var metadata = {};
        if (nodeEntry && nodeEntry.entry.properties) {
            for (var key in nodeEntry.entry.properties) {
                if (key) {
                    if (key.indexOf(':') !== -1) {
                        metadata[key.split(':')[1]] = nodeEntry.entry.properties[key];
                    }
                    else {
                        metadata[key] = nodeEntry.entry.properties[key];
                    }
                }
            }
        }
        return new node_metadata_model_1.NodeMetadata(metadata, nodeEntry.entry.nodeType);
    };
    NodeService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService])
    ], NodeService);
    return NodeService;
}());
exports.NodeService = NodeService;
//# sourceMappingURL=node.service.js.map