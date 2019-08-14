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
var core_1 = require("@angular/core");
var form_service_1 = require("./../../../services/form.service");
var widget_component_1 = require("./../widget.component");
var AmountWidgetComponent = /** @class */ (function (_super) {
    __extends(AmountWidgetComponent, _super);
    function AmountWidgetComponent(formService) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.currency = AmountWidgetComponent_1.DEFAULT_CURRENCY;
        return _this;
    }
    AmountWidgetComponent_1 = AmountWidgetComponent;
    AmountWidgetComponent.prototype.ngOnInit = function () {
        if (this.field && this.field.currency) {
            this.currency = this.field.currency;
        }
    };
    var AmountWidgetComponent_1;
    AmountWidgetComponent.DEFAULT_CURRENCY = '$';
    AmountWidgetComponent = AmountWidgetComponent_1 = __decorate([
        core_1.Component({
            selector: 'amount-widget',
            templateUrl: './amount.widget.html',
            styleUrls: ['./amount.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService])
    ], AmountWidgetComponent);
    return AmountWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.AmountWidgetComponent = AmountWidgetComponent;
//# sourceMappingURL=amount.widget.js.map