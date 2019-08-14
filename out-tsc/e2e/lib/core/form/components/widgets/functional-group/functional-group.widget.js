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
var keycodes_1 = require("@angular/cdk/keycodes");
var core_1 = require("@angular/core");
var form_service_1 = require("../../../services/form.service");
var widget_component_1 = require("./../widget.component");
var FunctionalGroupWidgetComponent = /** @class */ (function (_super) {
    __extends(FunctionalGroupWidgetComponent, _super);
    function FunctionalGroupWidgetComponent(formService, elementRef) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        _this.elementRef = elementRef;
        _this.groups = [];
        _this.minTermLength = 1;
        return _this;
    }
    FunctionalGroupWidgetComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.field) {
            var group = this.field.value;
            if (group) {
                this.value = group.name;
            }
            var params = this.field.params;
            if (params && params['restrictWithGroup']) {
                var restrictWithGroup = params['restrictWithGroup'];
                this.groupId = restrictWithGroup.id;
            }
            // Load auto-completion for previously saved value
            if (this.value) {
                this.formService
                    .getWorkflowGroups(this.value, this.groupId)
                    .subscribe(function (groupModel) { return _this.groups = groupModel || []; });
            }
        }
    };
    FunctionalGroupWidgetComponent.prototype.onKeyUp = function (event) {
        var _this = this;
        if (this.value && this.value.length >= this.minTermLength && this.oldValue !== this.value) {
            if (event.keyCode !== keycodes_1.ESCAPE && event.keyCode !== keycodes_1.ENTER) {
                this.oldValue = this.value;
                this.formService.getWorkflowGroups(this.value, this.groupId)
                    .subscribe(function (group) {
                    _this.groups = group || [];
                });
            }
        }
    };
    FunctionalGroupWidgetComponent.prototype.flushValue = function () {
        var _this = this;
        var option = this.groups.find(function (item) { return item.name.toLocaleLowerCase() === _this.value.toLocaleLowerCase(); });
        if (option) {
            this.field.value = option;
            this.value = option.name;
        }
        else {
            this.field.value = null;
            this.value = null;
        }
        this.field.updateForm();
    };
    FunctionalGroupWidgetComponent.prototype.onItemClick = function (item, event) {
        if (item) {
            this.field.value = item;
            this.value = item.name;
        }
        if (event) {
            event.preventDefault();
        }
    };
    FunctionalGroupWidgetComponent.prototype.onItemSelect = function (item) {
        if (item) {
            this.field.value = item;
            this.value = item.name;
        }
    };
    FunctionalGroupWidgetComponent = __decorate([
        core_1.Component({
            selector: 'functional-group-widget',
            templateUrl: './functional-group.widget.html',
            styleUrls: ['./functional-group.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService,
            core_1.ElementRef])
    ], FunctionalGroupWidgetComponent);
    return FunctionalGroupWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.FunctionalGroupWidgetComponent = FunctionalGroupWidgetComponent;
//# sourceMappingURL=functional-group.widget.js.map