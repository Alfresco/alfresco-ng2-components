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
System.register(['angular2/core', './alfresco.service'], function(exports_1, context_1) {
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
    var core_1, alfresco_service_1;
    var DocumentActionsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (alfresco_service_1_1) {
                alfresco_service_1 = alfresco_service_1_1;
            }],
        execute: function() {
            DocumentActionsService = (function () {
                function DocumentActionsService(_alfrescoService) {
                    this._alfrescoService = _alfrescoService;
                    this.handlers = {};
                    this.setupActionHandlers();
                }
                DocumentActionsService.prototype.getHandler = function (key) {
                    if (key) {
                        var lkey = key.toLowerCase();
                        return this.handlers[lkey];
                    }
                    return null;
                };
                DocumentActionsService.prototype.setupActionHandlers = function () {
                    this.handlers['download'] = this.download.bind(this);
                    // todo: just for dev/demo purposes, to be replaced with real actions
                    this.handlers['system1'] = this.handleStandardAction1.bind(this);
                    this.handlers['system2'] = this.handleStandardAction2.bind(this);
                };
                DocumentActionsService.prototype.handleStandardAction1 = function (obj) {
                    window.alert('standard document action 1');
                };
                DocumentActionsService.prototype.handleStandardAction2 = function (obj) {
                    window.alert('standard document action 2');
                };
                DocumentActionsService.prototype.download = function (obj) {
                    if (obj && !obj.isFolder) {
                        var link = document.createElement('a');
                        document.body.appendChild(link);
                        link.setAttribute('download', 'download');
                        link.href = this._alfrescoService.getContentUrl(obj);
                        link.click();
                        document.body.removeChild(link);
                    }
                };
                DocumentActionsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [alfresco_service_1.AlfrescoService])
                ], DocumentActionsService);
                return DocumentActionsService;
            }());
            exports_1("DocumentActionsService", DocumentActionsService);
        }
    }
});
//# sourceMappingURL=document-actions.service.js.map