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
var content_node_selector_component_1 = require("../components/content-node-selector/content-node-selector.component");
var NodeActionsService = (function () {
    function NodeActionsService(dialog, documentListService, contentService) {
        this.dialog = dialog;
        this.documentListService = documentListService;
        this.contentService = contentService;
    }
    /**
     * Copy content node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     */
    NodeActionsService.prototype.copyContent = function (contentEntry, permission) {
        return this.doFileOperation('copy', 'content', contentEntry, permission);
    };
    /**
     * Copy folder node
     *
     * @param contentEntry node to copy
     * @param permission permission which is needed to apply the action
     */
    NodeActionsService.prototype.copyFolder = function (contentEntry, permission) {
        return this.doFileOperation('copy', 'folder', contentEntry, permission);
    };
    /**
     * Move content node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     */
    NodeActionsService.prototype.moveContent = function (contentEntry, permission) {
        return this.doFileOperation('move', 'content', contentEntry, permission);
    };
    /**
     * Move folder node
     *
     * @param contentEntry node to move
     * @param permission permission which is needed to apply the action
     */
    NodeActionsService.prototype.moveFolder = function (contentEntry, permission) {
        return this.doFileOperation('move', 'folder', contentEntry, permission);
    };
    /**
     * General method for performing the given operation (copy|move)
     *
     * @param action the action to perform (copy|move)
     * @param type type of the content (content|folder)
     * @param contentEntry the contentEntry which has to have the action performed on
     * @param permission permission which is needed to apply the action
     */
    NodeActionsService.prototype.doFileOperation = function (action, type, contentEntry, permission) {
        var _this = this;
        var observable = new Rx_1.Subject();
        if (this.contentService.hasPermission(contentEntry, permission)) {
            var data = {
                title: action + " " + contentEntry.name + " to ...",
                currentFolderId: contentEntry.parentId,
                rowFilter: this.rowFilter.bind(this, contentEntry.id),
                imageResolver: this.imageResolver.bind(this),
                select: new core_1.EventEmitter()
            };
            this.dialog.open(content_node_selector_component_1.ContentNodeSelectorComponent, { data: data, panelClass: 'adf-content-node-selector-dialog', width: '630px' });
            data.select.subscribe(function (selections) {
                var selection = selections[0];
                _this.documentListService[action + "Node"].call(_this.documentListService, contentEntry.id, selection.id)
                    .subscribe(observable.next.bind(observable, "OPERATION.SUCCES." + type.toUpperCase() + "." + action.toUpperCase()), observable.error.bind(observable));
                _this.dialog.closeAll();
            });
            return observable;
        }
        else {
            observable.error(new Error(JSON.stringify({ error: { statusCode: 403 } })));
            return observable;
        }
    };
    NodeActionsService.prototype.rowFilter = function (currentNodeId, row) {
        var node = row.node.entry;
        if (node.id === currentNodeId || node.isFile) {
            return false;
        }
        else {
            return true;
        }
    };
    NodeActionsService.prototype.imageResolver = function (row, col) {
        var entry = row.node.entry;
        if (!this.contentService.hasPermission(entry, 'create')) {
            return this.documentListService.getMimeTypeIcon('disable/folder');
        }
        return null;
    };
    NodeActionsService = __decorate([
        core_1.Injectable()
    ], NodeActionsService);
    return NodeActionsService;
}());
exports.NodeActionsService = NodeActionsService;
