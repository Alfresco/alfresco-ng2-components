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
/* tslint:disable:component-selector  */
var form_widget_model_1 = require("./form-widget.model");
var FormOutcomeModel = /** @class */ (function (_super) {
    __extends(FormOutcomeModel, _super);
    function FormOutcomeModel(form, json) {
        var _this = _super.call(this, form, json) || this;
        _this.isSystem = false;
        _this.isSelected = false;
        if (json) {
            _this.isSystem = json.isSystem ? true : false;
            _this.isSelected = form && json.name === form.selectedOutcome ? true : false;
        }
        return _this;
    }
    FormOutcomeModel.SAVE_ACTION = 'SAVE'; // Activiti 'Save' action name
    FormOutcomeModel.COMPLETE_ACTION = 'COMPLETE'; // Activiti 'Complete' action name
    FormOutcomeModel.START_PROCESS_ACTION = 'START PROCESS'; // Activiti 'Start Process' action name
    return FormOutcomeModel;
}(form_widget_model_1.FormWidgetModel));
exports.FormOutcomeModel = FormOutcomeModel;
//# sourceMappingURL=form-outcome.model.js.map