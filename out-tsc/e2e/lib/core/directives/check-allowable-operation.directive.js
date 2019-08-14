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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-input-rename  */
var core_1 = require("@angular/core");
var content_service_1 = require("./../services/content.service");
var injection_tokens_1 = require("./../interface/injection.tokens");
var CheckAllowableOperationDirective = /** @class */ (function () {
    function CheckAllowableOperationDirective(elementRef, renderer, contentService, changeDetector, parentComponent) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.contentService = contentService;
        this.changeDetector = changeDetector;
        this.parentComponent = parentComponent;
        /** Node permission to check (create, delete, update, updatePermissions,
         * !create, !delete, !update, !updatePermissions).
         */
        this.permission = null;
        /** Nodes to check permission for. */
        this.nodes = [];
    }
    CheckAllowableOperationDirective.prototype.ngOnChanges = function (changes) {
        if (changes.nodes && !changes.nodes.firstChange) {
            this.updateElement();
        }
    };
    /**
     * Updates disabled state for the decorated element
     *
     * @memberof CheckAllowableOperationDirective
     */
    CheckAllowableOperationDirective.prototype.updateElement = function () {
        var enable = this.hasAllowableOperations(this.nodes, this.permission);
        if (enable) {
            this.enable();
        }
        else {
            this.disable();
        }
        return enable;
    };
    CheckAllowableOperationDirective.prototype.enable = function () {
        if (this.parentComponent) {
            this.parentComponent.disabled = false;
            this.changeDetector.detectChanges();
        }
        else {
            this.enableElement();
        }
    };
    CheckAllowableOperationDirective.prototype.disable = function () {
        if (this.parentComponent) {
            this.parentComponent.disabled = true;
            this.changeDetector.detectChanges();
        }
        else {
            this.disableElement();
        }
    };
    /**
     * Enables decorated element
     *
     * @memberof CheckAllowableOperationDirective
     */
    CheckAllowableOperationDirective.prototype.enableElement = function () {
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
    };
    /**
     * Disables decorated element
     *
     * @memberof CheckAllowableOperationDirective
     */
    CheckAllowableOperationDirective.prototype.disableElement = function () {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');
    };
    /**
     * Checks whether all nodes have a particular permission
     *
     * @param  nodes Node collection to check
     * @param  permission Permission to check for each node
     * @memberof CheckAllowableOperationDirective
     */
    CheckAllowableOperationDirective.prototype.hasAllowableOperations = function (nodes, permission) {
        var _this = this;
        if (nodes && nodes.length > 0) {
            return nodes.every(function (node) { return _this.contentService.hasAllowableOperations(node.entry, permission); });
        }
        return false;
    };
    __decorate([
        core_1.Input('adf-check-allowable-operation'),
        __metadata("design:type", String)
    ], CheckAllowableOperationDirective.prototype, "permission", void 0);
    __decorate([
        core_1.Input('adf-nodes'),
        __metadata("design:type", Array)
    ], CheckAllowableOperationDirective.prototype, "nodes", void 0);
    CheckAllowableOperationDirective = __decorate([
        core_1.Directive({
            selector: '[adf-check-allowable-operation]'
        }),
        __param(4, core_1.Host()),
        __param(4, core_1.Optional()),
        __param(4, core_1.Inject(injection_tokens_1.EXTENDIBLE_COMPONENT)),
        __metadata("design:paramtypes", [core_1.ElementRef,
            core_1.Renderer2,
            content_service_1.ContentService,
            core_1.ChangeDetectorRef, Object])
    ], CheckAllowableOperationDirective);
    return CheckAllowableOperationDirective;
}());
exports.CheckAllowableOperationDirective = CheckAllowableOperationDirective;
//# sourceMappingURL=check-allowable-operation.directive.js.map