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
/* tslint:disable:component-selector no-input-rename */
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var alfresco_api_service_1 = require("../services/alfresco-api.service");
var translation_service_1 = require("../services/translation.service");
var operators_1 = require("rxjs/operators");
var RestoreMessageModel = /** @class */ (function () {
    function RestoreMessageModel() {
    }
    return RestoreMessageModel;
}());
exports.RestoreMessageModel = RestoreMessageModel;
var NodeRestoreDirective = /** @class */ (function () {
    function NodeRestoreDirective(alfrescoApiService, translation) {
        this.alfrescoApiService = alfrescoApiService;
        this.translation = translation;
        /** Emitted when restoration is complete. */
        this.restore = new core_1.EventEmitter();
        this.restoreProcessStatus = this.processStatus();
    }
    NodeRestoreDirective.prototype.onClick = function () {
        this.recover(this.selection);
    };
    NodeRestoreDirective.prototype.recover = function (selection) {
        var _this = this;
        var _a;
        if (!selection.length) {
            return;
        }
        var nodesWithPath = this.getNodesWithPath(selection);
        if (selection.length && nodesWithPath.length) {
            this.restoreNodesBatch(nodesWithPath).pipe(operators_1.tap(function (restoredNodes) {
                var _a, _b;
                var status = _this.processStatus(restoredNodes);
                (_a = _this.restoreProcessStatus.fail).push.apply(_a, status.fail);
                (_b = _this.restoreProcessStatus.success).push.apply(_b, status.success);
            }), operators_1.mergeMap(function () { return _this.getDeletedNodes(); }))
                .subscribe(function (deletedNodesList) {
                var nodeList = deletedNodesList.list.entries;
                var restoreErrorNodes = _this.restoreProcessStatus.fail;
                var selectedNodes = _this.diff(restoreErrorNodes, selection, false);
                var remainingNodes = _this.diff(selectedNodes, nodeList);
                if (!remainingNodes.length) {
                    _this.notification();
                }
                else {
                    _this.recover(remainingNodes);
                }
            });
        }
        else {
            (_a = this.restoreProcessStatus.fail).push.apply(_a, selection);
            this.notification();
            return;
        }
    };
    NodeRestoreDirective.prototype.restoreNodesBatch = function (batch) {
        var _this = this;
        return rxjs_1.forkJoin(batch.map(function (node) { return _this.restoreNode(node); }));
    };
    NodeRestoreDirective.prototype.getNodesWithPath = function (selection) {
        return selection.filter(function (node) { return node.entry.path; });
    };
    NodeRestoreDirective.prototype.getDeletedNodes = function () {
        var promise = this.alfrescoApiService.getInstance()
            .core.nodesApi.getDeletedNodes({ include: ['path'] });
        return rxjs_1.from(promise);
    };
    NodeRestoreDirective.prototype.restoreNode = function (node) {
        var entry = node.entry;
        var promise = this.alfrescoApiService.getInstance().nodes.restoreNode(entry.id);
        return rxjs_1.from(promise).pipe(operators_1.map(function () { return ({
            status: 1,
            entry: entry
        }); }), operators_1.catchError(function (error) {
            var statusCode = (JSON.parse(error.message)).error.statusCode;
            return rxjs_1.of({
                status: 0,
                statusCode: statusCode,
                entry: entry
            });
        }));
    };
    NodeRestoreDirective.prototype.diff = function (selection, list, fromList) {
        if (fromList === void 0) { fromList = true; }
        var ids = selection.map(function (item) { return item.entry.id; });
        return list.filter(function (item) {
            if (fromList) {
                return ids.includes(item.entry.id) ? item : null;
            }
            else {
                return !ids.includes(item.entry.id) ? item : null;
            }
        });
    };
    NodeRestoreDirective.prototype.processStatus = function (data) {
        if (data === void 0) { data = []; }
        var status = {
            fail: [],
            success: [],
            get someFailed() {
                return !!(this.fail.length);
            },
            get someSucceeded() {
                return !!(this.success.length);
            },
            get oneFailed() {
                return this.fail.length === 1;
            },
            get oneSucceeded() {
                return this.success.length === 1;
            },
            get allSucceeded() {
                return this.someSucceeded && !this.someFailed;
            },
            get allFailed() {
                return this.someFailed && !this.someSucceeded;
            },
            reset: function () {
                this.fail = [];
                this.success = [];
            }
        };
        return data.reduce(function (acc, node) {
            if (node.status) {
                acc.success.push(node);
            }
            else {
                acc.fail.push(node);
            }
            return acc;
        }, status);
    };
    NodeRestoreDirective.prototype.getRestoreMessage = function () {
        var status = this.restoreProcessStatus;
        if (status.someFailed && !status.oneFailed) {
            return this.translation.instant('CORE.RESTORE_NODE.PARTIAL_PLURAL', {
                number: status.fail.length
            });
        }
        if (status.oneFailed && status.fail[0].statusCode) {
            if (status.fail[0].statusCode === 409) {
                return this.translation.instant('CORE.RESTORE_NODE.NODE_EXISTS', {
                    name: status.fail[0].entry.name
                });
            }
            else {
                return this.translation.instant('CORE.RESTORE_NODE.GENERIC', {
                    name: status.fail[0].entry.name
                });
            }
        }
        if (status.oneFailed && !status.fail[0].statusCode) {
            return this.translation.instant('CORE.RESTORE_NODE.LOCATION_MISSING', {
                name: status.fail[0].entry.name
            });
        }
        if (status.allSucceeded && !status.oneSucceeded) {
            return this.translation.instant('CORE.RESTORE_NODE.PLURAL');
        }
        if (status.allSucceeded && status.oneSucceeded) {
            return this.translation.instant('CORE.RESTORE_NODE.SINGULAR', {
                name: status.success[0].entry.name
            });
        }
    };
    NodeRestoreDirective.prototype.notification = function () {
        var status = Object.assign({}, this.restoreProcessStatus);
        var message = this.getRestoreMessage();
        this.reset();
        var action = (status.oneSucceeded && !status.someFailed) ? this.translation.instant('CORE.RESTORE_NODE.VIEW') : '';
        var path;
        if (status.success && status.success.length > 0) {
            path = status.success[0].entry.path;
        }
        this.restore.emit({
            message: message,
            action: action,
            path: path
        });
    };
    NodeRestoreDirective.prototype.reset = function () {
        this.restoreProcessStatus.reset();
        this.selection = [];
    };
    __decorate([
        core_1.Input('adf-restore'),
        __metadata("design:type", Array)
    ], NodeRestoreDirective.prototype, "selection", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NodeRestoreDirective.prototype, "restore", void 0);
    __decorate([
        core_1.HostListener('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NodeRestoreDirective.prototype, "onClick", null);
    NodeRestoreDirective = __decorate([
        core_1.Directive({
            selector: '[adf-restore]'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            translation_service_1.TranslationService])
    ], NodeRestoreDirective);
    return NodeRestoreDirective;
}());
exports.NodeRestoreDirective = NodeRestoreDirective;
//# sourceMappingURL=node-restore.directive.js.map