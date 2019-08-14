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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
/* tslint:disable:component-selector  */
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var index_1 = require("../core/index");
var form_service_1 = require("./../../../services/form.service");
var widget_component_1 = require("./../widget.component");
var ErrorWidgetComponent = /** @class */ (function (_super) {
    __extends(ErrorWidgetComponent, _super);
    function ErrorWidgetComponent(formService) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.translateParameters = null;
        _this._subscriptAnimationState = '';
        return _this;
    }
    ErrorWidgetComponent.prototype.ngOnChanges = function (changes) {
        if (changes['required']) {
            this.required = changes.required.currentValue;
            this._subscriptAnimationState = 'enter';
        }
        if (changes['error'] && changes['error'].currentValue) {
            if (changes.error.currentValue.isActive()) {
                this.error = changes.error.currentValue;
                this.translateParameters = this.error.getAttributesAsJsonObj();
                this._subscriptAnimationState = 'enter';
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", index_1.ErrorMessageModel)
    ], ErrorWidgetComponent.prototype, "error", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ErrorWidgetComponent.prototype, "required", void 0);
    ErrorWidgetComponent = __decorate([
        core_1.Component({
            selector: 'error-widget',
            templateUrl: './error.component.html',
            styleUrls: ['./error.component.scss'],
            animations: [
                animations_1.trigger('transitionMessages', [
                    animations_1.state('enter', animations_1.style({ opacity: 1, transform: 'translateY(0%)' })),
                    animations_1.transition('void => enter', [
                        animations_1.style({ opacity: 0, transform: 'translateY(-100%)' }),
                        animations_1.animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')
                    ])
                ])
            ],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService])
    ], ErrorWidgetComponent);
    return ErrorWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.ErrorWidgetComponent = ErrorWidgetComponent;
//# sourceMappingURL=error.component.js.map