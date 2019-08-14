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
Object.defineProperty(exports, "__esModule", { value: true });
var container_model_1 = require("./../core/container.model");
var form_field_types_1 = require("./../core/form-field-types");
var ContainerWidgetComponentModel = /** @class */ (function (_super) {
    __extends(ContainerWidgetComponentModel, _super);
    function ContainerWidgetComponentModel(field) {
        var _this = _super.call(this, field) || this;
        _this.columns = [];
        _this.isExpanded = true;
        _this.rowspan = 1;
        _this.colspan = 1;
        if (_this.field) {
            _this.columns = _this.field.columns || [];
            _this.isExpanded = !_this.isCollapsedByDefault();
            _this.colspan = field.colspan;
            _this.rowspan = field.rowspan;
        }
        return _this;
    }
    ContainerWidgetComponentModel.prototype.isGroup = function () {
        return this.type === form_field_types_1.FormFieldTypes.GROUP;
    };
    ContainerWidgetComponentModel.prototype.isCollapsible = function () {
        var allowCollapse = false;
        if (this.isGroup() && this.field.params['allowCollapse']) {
            allowCollapse = this.field.params['allowCollapse'];
        }
        return allowCollapse;
    };
    ContainerWidgetComponentModel.prototype.isCollapsedByDefault = function () {
        var collapseByDefault = false;
        if (this.isCollapsible() && this.field.params['collapseByDefault']) {
            collapseByDefault = this.field.params['collapseByDefault'];
        }
        return collapseByDefault;
    };
    return ContainerWidgetComponentModel;
}(container_model_1.ContainerModel));
exports.ContainerWidgetComponentModel = ContainerWidgetComponentModel;
//# sourceMappingURL=container.widget.model.js.map