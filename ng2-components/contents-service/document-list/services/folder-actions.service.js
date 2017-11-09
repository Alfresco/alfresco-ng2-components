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
var permissions_model_1 = require("../models/permissions.model");
var FolderActionsService = (function () {
    function FolderActionsService(nodeActionsService, documentListService, contentService) {
        this.nodeActionsService = nodeActionsService;
        this.documentListService = documentListService;
        this.contentService = contentService;
        this.permissionEvent = new Rx_1.Subject();
        this.error = new Rx_1.Subject();
        this.success = new Rx_1.Subject();
        this.handlers = {};
        this.setupActionHandlers();
    }
    FolderActionsService.prototype.getHandler = function (key) {
        if (key) {
            var lkey = key.toLowerCase();
            return this.handlers[lkey] || null;
        }
        return null;
    };
    FolderActionsService.prototype.setHandler = function (key, handler) {
        if (key) {
            var lkey = key.toLowerCase();
            this.handlers[lkey] = handler;
            return true;
        }
        return false;
    };
    FolderActionsService.prototype.canExecuteAction = function (obj) {
        return this.documentListService && obj && obj.entry.isFolder === true;
    };
    FolderActionsService.prototype.setupActionHandlers = function () {
        this.handlers['copy'] = this.copyNode.bind(this);
        this.handlers['move'] = this.moveNode.bind(this);
        this.handlers['delete'] = this.deleteNode.bind(this);
    };
    FolderActionsService.prototype.copyNode = function (obj, target, permission) {
        var actionObservable = this.nodeActionsService.copyFolder(obj.entry, permission);
        this.prepareHandlers(actionObservable, 'folder', 'copy', target, permission);
        return actionObservable;
    };
    FolderActionsService.prototype.moveNode = function (obj, target, permission) {
        var actionObservable = this.nodeActionsService.moveFolder(obj.entry, permission);
        this.prepareHandlers(actionObservable, 'folder', 'move', target, permission);
        return actionObservable;
    };
    FolderActionsService.prototype.prepareHandlers = function (actionObservable, type, action, target, permission) {
        var _this = this;
        actionObservable.subscribe(function (fileOperationMessage) {
            if (target && typeof target.reload === 'function') {
                target.reload();
            }
            _this.success.next(fileOperationMessage);
        }, this.error.next.bind(this.error));
    };
    FolderActionsService.prototype.deleteNode = function (obj, target, permission) {
        var _this = this;
        var handlerObservable;
        if (this.canExecuteAction(obj)) {
            if (this.contentService.hasPermission(obj.entry, permission)) {
                handlerObservable = this.documentListService.deleteNode(obj.entry.id);
                handlerObservable.subscribe(function () {
                    if (target && typeof target.reload === 'function') {
                        target.reload();
                    }
                    _this.success.next(obj.entry.id);
                });
                return handlerObservable;
            }
            else {
                this.permissionEvent.next(new permissions_model_1.PermissionModel({ type: 'folder', action: 'delete', permission: permission }));
                return Rx_1.Observable.throw(new Error('No permission to delete'));
            }
        }
    };
    FolderActionsService = __decorate([
        core_1.Injectable()
    ], FolderActionsService);
    return FolderActionsService;
}());
exports.FolderActionsService = FolderActionsService;
