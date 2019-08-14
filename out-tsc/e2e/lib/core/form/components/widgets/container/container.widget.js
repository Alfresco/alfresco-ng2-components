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
var container_widget_model_1 = require("./container.widget.model");
var ContainerWidgetComponent = /** @class */ (function (_super) {
    __extends(ContainerWidgetComponent, _super);
    function ContainerWidgetComponent(formService) {
        var _this = _super.call(this, formService) || this;
        _this.formService = formService;
        return _this;
    }
    ContainerWidgetComponent.prototype.onExpanderClicked = function () {
        if (this.content && this.content.isCollapsible()) {
            this.content.isExpanded = !this.content.isExpanded;
        }
    };
    ContainerWidgetComponent.prototype.ngOnInit = function () {
        if (this.field) {
            this.content = new container_widget_model_1.ContainerWidgetComponentModel(this.field);
        }
    };
    Object.defineProperty(ContainerWidgetComponent.prototype, "fields", {
        /**
         * Serializes column fields
         */
        get: function () {
            var fields = [];
            var rowContainsElement = true, rowIndex = 0;
            while (rowContainsElement) {
                rowContainsElement = false;
                for (var i = 0; i < this.content.columns.length; i++) {
                    var field = this.content.columns[i].fields[rowIndex];
                    if (field) {
                        rowContainsElement = true;
                    }
                    fields.push(field);
                }
                rowIndex++;
            }
            return fields;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calculate the column width based on the numberOfColumns and current field's colspan property
     *
     * @param field
     */
    ContainerWidgetComponent.prototype.getColumnWith = function (field) {
        var colspan = field ? field.colspan : 1;
        return (100 / this.content.json.numberOfColumns) * colspan + '%';
    };
    ContainerWidgetComponent = __decorate([
        core_1.Component({
            selector: 'container-widget',
            templateUrl: './container.widget.html',
            styleUrls: ['./container.widget.scss'],
            host: widget_component_1.baseHost,
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [form_service_1.FormService])
    ], ContainerWidgetComponent);
    return ContainerWidgetComponent;
}(widget_component_1.WidgetComponent));
exports.ContainerWidgetComponent = ContainerWidgetComponent;
//# sourceMappingURL=container.widget.js.map