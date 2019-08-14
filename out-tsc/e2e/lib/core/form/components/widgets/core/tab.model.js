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
var form_widget_model_1 = require("./form-widget.model");
var TabModel = /** @class */ (function (_super) {
    __extends(TabModel, _super);
    function TabModel(form, json) {
        var _this = _super.call(this, form, json) || this;
        _this.isVisible = true;
        _this.fields = [];
        if (json) {
            _this.title = json.title;
            _this.visibilityCondition = json.visibilityCondition;
        }
        return _this;
    }
    TabModel.prototype.hasContent = function () {
        return this.fields && this.fields.length > 0;
    };
    return TabModel;
}(form_widget_model_1.FormWidgetModel));
exports.TabModel = TabModel;
//# sourceMappingURL=tab.model.js.map