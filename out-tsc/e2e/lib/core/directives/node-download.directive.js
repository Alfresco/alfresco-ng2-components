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
var material_1 = require("@angular/material");
var alfresco_api_service_1 = require("../services/alfresco-api.service");
var download_zip_dialog_1 = require("../dialogs/download-zip.dialog");
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
var NodeDownloadDirective = /** @class */ (function () {
    function NodeDownloadDirective(apiService, dialog) {
        this.apiService = apiService;
        this.dialog = dialog;
    }
    NodeDownloadDirective.prototype.onClick = function () {
        this.downloadNodes(this.nodes);
    };
    /**
     * Downloads multiple selected nodes.
     * Packs result into a .ZIP archive if there is more than one node selected.
     * @param selection Multiple selected nodes to download
     */
    NodeDownloadDirective.prototype.downloadNodes = function (selection) {
        if (!this.isSelectionValid(selection)) {
            return;
        }
        if (selection instanceof Array) {
            if (selection.length === 1) {
                this.downloadNode(selection[0]);
            }
            else {
                this.downloadZip(selection);
            }
        }
        else {
            this.downloadNode(selection);
        }
    };
    /**
     * Downloads a single node.
     * Packs result into a .ZIP archive is the node is a Folder.
     * @param node Node to download
     */
    NodeDownloadDirective.prototype.downloadNode = function (node) {
        if (node && node.entry) {
            var entry = node.entry;
            if (entry.isFile) {
                this.downloadFile(node);
            }
            if (entry.isFolder) {
                this.downloadZip([node]);
            }
            // Check if there's nodeId for Shared Files
            if (!entry.isFile && !entry.isFolder && entry.nodeId) {
                this.downloadFile(node);
            }
        }
    };
    NodeDownloadDirective.prototype.isSelectionValid = function (selection) {
        return selection || (selection instanceof Array && selection.length > 0);
    };
    NodeDownloadDirective.prototype.downloadFile = function (node) {
        if (node && node.entry) {
            var contentApi = this.apiService.getInstance().content;
            // nodeId for Shared node
            var id = node.entry.nodeId || node.entry.id;
            var url = contentApi.getContentUrl(id, true);
            var fileName = node.entry.name;
            this.download(url, fileName);
        }
    };
    NodeDownloadDirective.prototype.downloadZip = function (selection) {
        if (selection && selection.length > 0) {
            // nodeId for Shared node
            var nodeIds = selection.map(function (node) { return (node.entry.nodeId || node.entry.id); });
            this.dialog.open(download_zip_dialog_1.DownloadZipDialogComponent, {
                width: '600px',
                disableClose: true,
                data: {
                    nodeIds: nodeIds
                }
            });
        }
    };
    NodeDownloadDirective.prototype.download = function (url, fileName) {
        if (url && fileName) {
            var link = document.createElement('a');
            link.style.display = 'none';
            link.download = fileName;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    __decorate([
        core_1.Input('adfNodeDownload'),
        __metadata("design:type", Object)
    ], NodeDownloadDirective.prototype, "nodes", void 0);
    __decorate([
        core_1.HostListener('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NodeDownloadDirective.prototype, "onClick", null);
    NodeDownloadDirective = __decorate([
        core_1.Directive({
            selector: '[adf-node-download], [adfNodeDownload]'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            material_1.MatDialog])
    ], NodeDownloadDirective);
    return NodeDownloadDirective;
}());
exports.NodeDownloadDirective = NodeDownloadDirective;
//# sourceMappingURL=node-download.directive.js.map