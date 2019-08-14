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
Object.defineProperty(exports, "__esModule", { value: true });
var container_model_1 = require("./widgets/core/container.model");
var FormBaseModel = /** @class */ (function () {
    function FormBaseModel() {
        this.values = {};
        this.tabs = [];
        this.fields = [];
        this.outcomes = [];
        this.readOnly = false;
        this.isValid = true;
    }
    FormBaseModel.prototype.hasTabs = function () {
        return this.tabs && this.tabs.length > 0;
    };
    FormBaseModel.prototype.hasFields = function () {
        return this.fields && this.fields.length > 0;
    };
    FormBaseModel.prototype.hasOutcomes = function () {
        return this.outcomes && this.outcomes.length > 0;
    };
    FormBaseModel.prototype.getFieldById = function (fieldId) {
        return this.getFormFields().find(function (field) { return field.id === fieldId; });
    };
    // TODO: consider evaluating and caching once the form is loaded
    FormBaseModel.prototype.getFormFields = function () {
        var formFieldModel = [];
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (field instanceof container_model_1.ContainerModel) {
                var container = field;
                formFieldModel.push(container.field);
                container.field.columns.forEach(function (column) {
                    formFieldModel.push.apply(formFieldModel, column.fields);
                });
            }
        }
        return formFieldModel;
    };
    FormBaseModel.prototype.markAsInvalid = function () {
        this.isValid = false;
    };
    FormBaseModel.UNSET_TASK_NAME = 'Nameless task';
    FormBaseModel.SAVE_OUTCOME = '$save';
    FormBaseModel.COMPLETE_OUTCOME = '$complete';
    FormBaseModel.START_PROCESS_OUTCOME = '$startProcess';
    return FormBaseModel;
}());
exports.FormBaseModel = FormBaseModel;
//# sourceMappingURL=form-base.model.js.map