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
var core_1 = require("@angular/core");
var DropZoneDirective = /** @class */ (function () {
    function DropZoneDirective(elementRef, ngZone) {
        this.ngZone = ngZone;
        this.dropTarget = 'cell';
        this.element = elementRef.nativeElement;
    }
    DropZoneDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            _this.element.addEventListener('dragover', _this.onDragOver.bind(_this));
            _this.element.addEventListener('drop', _this.onDrop.bind(_this));
        });
    };
    DropZoneDirective.prototype.ngOnDestroy = function () {
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('drop', this.onDrop);
    };
    DropZoneDirective.prototype.onDragOver = function (event) {
        var domEvent = new CustomEvent(this.dropTarget + "-dragover", {
            detail: {
                target: this.dropTarget,
                event: event,
                column: this.dropColumn,
                row: this.dropRow
            },
            bubbles: true
        });
        this.element.dispatchEvent(domEvent);
        if (domEvent.defaultPrevented) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    DropZoneDirective.prototype.onDrop = function (event) {
        var domEvent = new CustomEvent(this.dropTarget + "-drop", {
            detail: {
                target: this.dropTarget,
                event: event,
                column: this.dropColumn,
                row: this.dropRow
            },
            bubbles: true
        });
        this.element.dispatchEvent(domEvent);
        if (domEvent.defaultPrevented) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DropZoneDirective.prototype, "dropTarget", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DropZoneDirective.prototype, "dropRow", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DropZoneDirective.prototype, "dropColumn", void 0);
    DropZoneDirective = __decorate([
        core_1.Directive({
            selector: '[adf-drop-zone]'
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, core_1.NgZone])
    ], DropZoneDirective);
    return DropZoneDirective;
}());
exports.DropZoneDirective = DropZoneDirective;
//# sourceMappingURL=drop-zone.directive.js.map