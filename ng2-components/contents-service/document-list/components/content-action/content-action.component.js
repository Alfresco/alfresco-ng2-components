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
/* tslint:disable:component-selector  */
var core_1 = require("@angular/core");
var document_actions_service_1 = require("../../services/document-actions.service");
var folder_actions_service_1 = require("../../services/folder-actions.service");
var content_action_model_1 = require("./../../models/content-action.model");
var ContentActionComponent = (function () {
    function ContentActionComponent(list, documentActions, folderActions) {
        this.list = list;
        this.documentActions = documentActions;
        this.folderActions = folderActions;
        this.title = 'Action';
        this.disabled = false;
        this.execute = new core_1.EventEmitter();
        this.permissionEvent = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.success = new core_1.EventEmitter();
        this.model = new content_action_model_1.ContentActionModel();
    }
    ContentActionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.model = new content_action_model_1.ContentActionModel({
            title: this.title,
            icon: this.icon,
            permission: this.permission,
            disableWithNoPermission: this.disableWithNoPermission,
            target: this.target,
            disabled: this.disabled
        });
        if (this.handler) {
            this.model.handler = this.getSystemHandler(this.target, this.handler);
        }
        if (this.execute) {
            this.model.execute = function (value) {
                _this.execute.emit({ value: value });
            };
        }
        this.register();
    };
    ContentActionComponent.prototype.register = function () {
        if (this.list) {
            return this.list.registerAction(this.model);
        }
        return false;
    };
    ContentActionComponent.prototype.ngOnChanges = function (changes) {
        // update localizable properties
        this.model.title = this.title;
    };
    ContentActionComponent.prototype.getSystemHandler = function (target, name) {
        var _this = this;
        if (target) {
            var ltarget = target.toLowerCase();
            if (ltarget === 'document') {
                if (this.documentActions) {
                    this.documentActions.permissionEvent.subscribe(function (permision) {
                        _this.permissionEvent.emit(permision);
                    });
                    this.documentActions.error.subscribe(function (errors) {
                        _this.error.emit(errors);
                    });
                    this.documentActions.success.subscribe(function (message) {
                        _this.success.emit(message);
                    });
                    return this.documentActions.getHandler(name);
                }
                return null;
            }
            if (ltarget === 'folder') {
                if (this.folderActions) {
                    this.folderActions.permissionEvent.subscribe(function (permision) {
                        _this.permissionEvent.emit(permision);
                    });
                    this.folderActions.error.subscribe(function (errors) {
                        _this.error.emit(errors);
                    });
                    this.folderActions.success.subscribe(function (message) {
                        _this.success.emit(message);
                    });
                    return this.folderActions.getHandler(name);
                }
                return null;
            }
        }
        return null;
    };
    __decorate([
        core_1.Input()
    ], ContentActionComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input()
    ], ContentActionComponent.prototype, "icon", void 0);
    __decorate([
        core_1.Input()
    ], ContentActionComponent.prototype, "handler", void 0);
    __decorate([
        core_1.Input()
    ], ContentActionComponent.prototype, "target", void 0);
    __decorate([
        core_1.Input()
    ], ContentActionComponent.prototype, "permission", void 0);
    __decorate([
        core_1.Input()
    ], ContentActionComponent.prototype, "disableWithNoPermission", void 0);
    __decorate([
        core_1.Input()
    ], ContentActionComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Output()
    ], ContentActionComponent.prototype, "execute", void 0);
    __decorate([
        core_1.Output()
    ], ContentActionComponent.prototype, "permissionEvent", void 0);
    __decorate([
        core_1.Output()
    ], ContentActionComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output()
    ], ContentActionComponent.prototype, "success", void 0);
    ContentActionComponent = __decorate([
        core_1.Component({
            selector: 'content-action',
            template: '',
            providers: [
                document_actions_service_1.DocumentActionsService,
                folder_actions_service_1.FolderActionsService
            ]
        })
    ], ContentActionComponent);
    return ContentActionComponent;
}());
exports.ContentActionComponent = ContentActionComponent;
