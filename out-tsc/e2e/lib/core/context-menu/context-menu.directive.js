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
var context_menu_overlay_service_1 = require("./context-menu-overlay.service");
var ContextMenuDirective = /** @class */ (function () {
    function ContextMenuDirective(contextMenuService) {
        this.contextMenuService = contextMenuService;
        /** Is the menu enabled? */
        this.enabled = false;
    }
    ContextMenuDirective.prototype.onShowContextMenu = function (event) {
        if (this.enabled) {
            if (event) {
                event.preventDefault();
            }
            if (this.links && this.links.length > 0) {
                this.contextMenuService.open({
                    source: event,
                    data: this.links
                });
            }
        }
    };
    __decorate([
        core_1.Input('adf-context-menu'),
        __metadata("design:type", Array)
    ], ContextMenuDirective.prototype, "links", void 0);
    __decorate([
        core_1.Input('adf-context-menu-enabled'),
        __metadata("design:type", Boolean)
    ], ContextMenuDirective.prototype, "enabled", void 0);
    __decorate([
        core_1.HostListener('contextmenu', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ContextMenuDirective.prototype, "onShowContextMenu", null);
    ContextMenuDirective = __decorate([
        core_1.Directive({
            selector: '[adf-context-menu], [context-menu]'
        }),
        __metadata("design:paramtypes", [context_menu_overlay_service_1.ContextMenuOverlayService])
    ], ContextMenuDirective);
    return ContextMenuDirective;
}());
exports.ContextMenuDirective = ContextMenuDirective;
//# sourceMappingURL=context-menu.directive.js.map