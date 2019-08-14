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
/* tslint:disable:no-input-rename  */
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var alfresco_api_service_1 = require("../services/alfresco-api.service");
var translation_service_1 = require("../services/translation.service");
var operators_1 = require("rxjs/operators");
var NodeDeleteDirective = /** @class */ (function () {
    function NodeDeleteDirective(alfrescoApiService, translation, elementRef) {
        this.alfrescoApiService = alfrescoApiService;
        this.translation = translation;
        this.elementRef = elementRef;
        /** If true then the nodes are deleted immediately rather than being put in the trash */
        this.permanent = false;
        /** Emitted when the nodes have been deleted. */
        this.delete = new core_1.EventEmitter();
    }
    NodeDeleteDirective.prototype.onClick = function () {
        this.process(this.selection);
    };
    NodeDeleteDirective.prototype.ngOnChanges = function () {
        if (!this.selection || (this.selection && this.selection.length === 0)) {
            this.setDisableAttribute(true);
        }
        else {
            if (!this.elementRef.nativeElement.hasAttribute('adf-check-allowable-operation')) {
                this.setDisableAttribute(false);
            }
        }
    };
    NodeDeleteDirective.prototype.setDisableAttribute = function (disable) {
        this.elementRef.nativeElement.disabled = disable;
    };
    NodeDeleteDirective.prototype.process = function (selection) {
        var _this = this;
        if (selection && selection.length) {
            var batch = this.getDeleteNodesBatch(selection);
            rxjs_1.forkJoin.apply(void 0, batch).subscribe(function (data) {
                var processedItems = _this.processStatus(data);
                var message = _this.getMessage(processedItems);
                _this.delete.emit(message);
            });
        }
    };
    NodeDeleteDirective.prototype.getDeleteNodesBatch = function (selection) {
        var _this = this;
        return selection.map(function (node) { return _this.deleteNode(node); });
    };
    NodeDeleteDirective.prototype.deleteNode = function (node) {
        var id = node.entry.nodeId || node.entry.id;
        var promise;
        if (node.entry.hasOwnProperty('archivedAt') && node.entry['archivedAt']) {
            promise = this.alfrescoApiService.nodesApi.purgeDeletedNode(id);
        }
        else {
            promise = this.alfrescoApiService.nodesApi.deleteNode(id, { permanent: this.permanent });
        }
        return rxjs_1.from(promise).pipe(operators_1.map(function () { return ({
            entry: node.entry,
            status: 1
        }); }), operators_1.catchError(function () { return rxjs_1.of({
            entry: node.entry,
            status: 0
        }); }));
    };
    NodeDeleteDirective.prototype.processStatus = function (data) {
        var deleteStatus = {
            success: [],
            failed: [],
            get someFailed() {
                return !!(this.failed.length);
            },
            get someSucceeded() {
                return !!(this.success.length);
            },
            get oneFailed() {
                return this.failed.length === 1;
            },
            get oneSucceeded() {
                return this.success.length === 1;
            },
            get allSucceeded() {
                return this.someSucceeded && !this.someFailed;
            },
            get allFailed() {
                return this.someFailed && !this.someSucceeded;
            }
        };
        return data.reduce(function (acc, next) {
            if (next.status === 1) {
                acc.success.push(next);
            }
            else {
                acc.failed.push(next);
            }
            return acc;
        }, deleteStatus);
    };
    NodeDeleteDirective.prototype.getMessage = function (status) {
        if (status.allFailed && !status.oneFailed) {
            return this.translation.instant('CORE.DELETE_NODE.ERROR_PLURAL', { number: status.failed.length });
        }
        if (status.allSucceeded && !status.oneSucceeded) {
            return this.translation.instant('CORE.DELETE_NODE.PLURAL', { number: status.success.length });
        }
        if (status.someFailed && status.someSucceeded && !status.oneSucceeded) {
            return this.translation.instant('CORE.DELETE_NODE.PARTIAL_PLURAL', {
                success: status.success.length,
                failed: status.failed.length
            });
        }
        if (status.someFailed && status.oneSucceeded) {
            return this.translation.instant('CORE.DELETE_NODE.PARTIAL_SINGULAR', {
                success: status.success.length,
                failed: status.failed.length
            });
        }
        if (status.oneFailed && !status.someSucceeded) {
            return this.translation.instant('CORE.DELETE_NODE.ERROR_SINGULAR', { name: status.failed[0].entry.name });
        }
        if (status.oneSucceeded && !status.someFailed) {
            return this.translation.instant('CORE.DELETE_NODE.SINGULAR', { name: status.success[0].entry.name });
        }
    };
    __decorate([
        core_1.Input('adf-delete'),
        __metadata("design:type", Array)
    ], NodeDeleteDirective.prototype, "selection", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NodeDeleteDirective.prototype, "permanent", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], NodeDeleteDirective.prototype, "delete", void 0);
    __decorate([
        core_1.HostListener('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], NodeDeleteDirective.prototype, "onClick", null);
    NodeDeleteDirective = __decorate([
        core_1.Directive({
            selector: '[adf-delete]'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            translation_service_1.TranslationService,
            core_1.ElementRef])
    ], NodeDeleteDirective);
    return NodeDeleteDirective;
}());
exports.NodeDeleteDirective = NodeDeleteDirective;
//# sourceMappingURL=node-delete.directive.js.map