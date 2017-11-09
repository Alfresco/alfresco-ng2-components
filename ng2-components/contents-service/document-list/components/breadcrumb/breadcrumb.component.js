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
var BreadcrumbComponent = (function () {
    function BreadcrumbComponent() {
        this.folderNode = null;
        this.root = null;
        this.rootId = null;
        this.route = [];
        this.navigate = new core_1.EventEmitter();
    }
    Object.defineProperty(BreadcrumbComponent.prototype, "hasRoot", {
        get: function () {
            return !!this.root;
        },
        enumerable: true,
        configurable: true
    });
    BreadcrumbComponent.prototype.ngOnChanges = function (changes) {
        if (changes.folderNode) {
            var node = changes.folderNode.currentValue;
            this.route = this.parseRoute(node);
        }
    };
    BreadcrumbComponent.prototype.parseRoute = function (node) {
        if (node && node.path) {
            var route = (node.path.elements || []).slice();
            route.push({
                id: node.id,
                name: node.name
            });
            var rootPos = this.getElementPosition(route, this.rootId);
            if (rootPos > 0) {
                route.splice(0, rootPos);
            }
            if (rootPos === -1 && this.rootId) {
                route[0].id = this.rootId;
            }
            if (this.root) {
                route[0].name = this.root;
            }
            return route;
        }
        return [];
    };
    BreadcrumbComponent.prototype.getElementPosition = function (route, nodeId) {
        var result = -1;
        if (route && route.length > 0 && nodeId) {
            result = route.findIndex(function (el) { return el.id === nodeId; });
        }
        return result;
    };
    BreadcrumbComponent.prototype.onRoutePathClick = function (route, event) {
        if (event) {
            event.preventDefault();
        }
        if (route) {
            this.navigate.emit(route);
            if (this.target) {
                this.target.loadFolderByNodeId(route.id);
            }
        }
    };
    __decorate([
        core_1.Input()
    ], BreadcrumbComponent.prototype, "folderNode", void 0);
    __decorate([
        core_1.Input()
    ], BreadcrumbComponent.prototype, "root", void 0);
    __decorate([
        core_1.Input()
    ], BreadcrumbComponent.prototype, "rootId", void 0);
    __decorate([
        core_1.Input()
    ], BreadcrumbComponent.prototype, "target", void 0);
    __decorate([
        core_1.Output()
    ], BreadcrumbComponent.prototype, "navigate", void 0);
    BreadcrumbComponent = __decorate([
        core_1.Component({
            selector: 'adf-breadcrumb',
            templateUrl: './breadcrumb.component.html',
            styleUrls: ['./breadcrumb.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            host: {
                'class': 'adf-breadcrumb'
            }
        })
    ], BreadcrumbComponent);
    return BreadcrumbComponent;
}());
exports.BreadcrumbComponent = BreadcrumbComponent;
