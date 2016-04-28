/**
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
System.register(['angular2/core', './../models/content-action.model', './folder-action-list', '../services/folder-actions.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, content_action_model_1, folder_action_list_1, folder_actions_service_1;
    var FolderAction;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (content_action_model_1_1) {
                content_action_model_1 = content_action_model_1_1;
            },
            function (folder_action_list_1_1) {
                folder_action_list_1 = folder_action_list_1_1;
            },
            function (folder_actions_service_1_1) {
                folder_actions_service_1 = folder_actions_service_1_1;
            }],
        execute: function() {
            FolderAction = (function () {
                function FolderAction(list, folderActions) {
                    this.list = list;
                    this.folderActions = folderActions;
                    this.title = 'Action';
                    this.execute = new core_1.EventEmitter();
                }
                FolderAction.prototype.ngOnInit = function () {
                    var _this = this;
                    var model = new content_action_model_1.ContentActionModel();
                    model.title = this.title;
                    if (this.handler) {
                        model.handler = this.folderActions.getHandler(this.handler);
                    }
                    else if (this.execute) {
                        model.handler = function (document) {
                            _this.execute.emit({
                                value: document
                            });
                        };
                    }
                    this.list.registerAction(model);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FolderAction.prototype, "title", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FolderAction.prototype, "handler", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], FolderAction.prototype, "execute", void 0);
                FolderAction = __decorate([
                    core_1.Component({
                        selector: 'folder-action',
                        template: ''
                    }), 
                    __metadata('design:paramtypes', [folder_action_list_1.FolderActionList, folder_actions_service_1.FolderActionsService])
                ], FolderAction);
                return FolderAction;
            }());
            exports_1("FolderAction", FolderAction);
        }
    }
});
//# sourceMappingURL=folder-action.js.map