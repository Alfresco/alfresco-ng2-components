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
var form_field_event_1 = require("./../../../events/form-field.event");
var validate_form_field_event_1 = require("./../../../events/validate-form-field.event");
var validate_form_event_1 = require("./../../../events/validate-form.event");
var container_model_1 = require("./container.model");
var form_field_types_1 = require("./form-field-types");
var form_field_model_1 = require("./form-field.model");
var form_outcome_model_1 = require("./form-outcome.model");
var tab_model_1 = require("./tab.model");
var form_field_validator_1 = require("./form-field-validator");
var form_base_model_1 = require("../../form-base.model");
var FormModel = /** @class */ (function (_super) {
    __extends(FormModel, _super);
    function FormModel(formRepresentationJSON, formValues, readOnly, formService) {
        if (readOnly === void 0) { readOnly = false; }
        var _this = _super.call(this) || this;
        _this.formService = formService;
        _this.taskName = FormModel.UNSET_TASK_NAME;
        _this.customFieldTemplates = {};
        _this.fieldValidators = form_field_validator_1.FORM_FIELD_VALIDATORS.slice();
        _this.readOnly = readOnly;
        if (formRepresentationJSON) {
            _this.json = formRepresentationJSON;
            _this.id = formRepresentationJSON.id;
            _this.name = formRepresentationJSON.name;
            _this.taskId = formRepresentationJSON.taskId;
            _this.taskName = formRepresentationJSON.taskName || formRepresentationJSON.name || FormModel.UNSET_TASK_NAME;
            _this.processDefinitionId = formRepresentationJSON.processDefinitionId;
            _this.customFieldTemplates = formRepresentationJSON.customFieldTemplates || {};
            _this.selectedOutcome = formRepresentationJSON.selectedOutcome || {};
            _this.className = formRepresentationJSON.className || '';
            var tabCache_1 = {};
            _this.processVariables = formRepresentationJSON.processVariables;
            _this.tabs = (formRepresentationJSON.tabs || []).map(function (t) {
                var model = new tab_model_1.TabModel(_this, t);
                tabCache_1[model.id] = model;
                return model;
            });
            _this.fields = _this.parseRootFields(formRepresentationJSON);
            if (formValues) {
                _this.loadData(formValues);
            }
            for (var i = 0; i < _this.fields.length; i++) {
                var field = _this.fields[i];
                if (field.tab) {
                    var tab = tabCache_1[field.tab];
                    if (tab) {
                        tab.fields.push(field);
                    }
                }
            }
            if (formRepresentationJSON.fields) {
                var saveOutcome = new form_outcome_model_1.FormOutcomeModel(_this, {
                    id: FormModel.SAVE_OUTCOME,
                    name: 'SAVE',
                    isSystem: true
                });
                var completeOutcome = new form_outcome_model_1.FormOutcomeModel(_this, {
                    id: FormModel.COMPLETE_OUTCOME,
                    name: 'COMPLETE',
                    isSystem: true
                });
                var startProcessOutcome = new form_outcome_model_1.FormOutcomeModel(_this, {
                    id: FormModel.START_PROCESS_OUTCOME,
                    name: 'START PROCESS',
                    isSystem: true
                });
                var customOutcomes = (formRepresentationJSON.outcomes || []).map(function (obj) { return new form_outcome_model_1.FormOutcomeModel(_this, obj); });
                _this.outcomes = [saveOutcome].concat(customOutcomes.length > 0 ? customOutcomes : [completeOutcome, startProcessOutcome]);
            }
        }
        _this.validateForm();
        return _this;
    }
    FormModel.prototype.onFormFieldChanged = function (field) {
        this.validateField(field);
        if (this.formService) {
            this.formService.formFieldValueChanged.next(new form_field_event_1.FormFieldEvent(this, field));
        }
    };
    /**
     * Validates entire form and all form fields.
     *
     * @memberof FormModel
     */
    FormModel.prototype.validateForm = function () {
        var validateFormEvent = new validate_form_event_1.ValidateFormEvent(this);
        var errorsField = [];
        var fields = this.getFormFields();
        for (var i = 0; i < fields.length; i++) {
            if (!fields[i].validate()) {
                errorsField.push(fields[i]);
            }
        }
        this.isValid = errorsField.length > 0 ? false : true;
        if (this.formService) {
            validateFormEvent.isValid = this.isValid;
            validateFormEvent.errorsField = errorsField;
            this.formService.validateForm.next(validateFormEvent);
        }
    };
    /**
     * Validates a specific form field, triggers form validation.
     *
     * @param field Form field to validate.
     * @memberof FormModel
     */
    FormModel.prototype.validateField = function (field) {
        if (!field) {
            return;
        }
        var validateFieldEvent = new validate_form_field_event_1.ValidateFormFieldEvent(this, field);
        if (this.formService) {
            this.formService.validateFormField.next(validateFieldEvent);
        }
        if (!validateFieldEvent.isValid) {
            this.markAsInvalid();
            return;
        }
        if (validateFieldEvent.defaultPrevented) {
            return;
        }
        if (!field.validate()) {
            this.markAsInvalid();
        }
        this.validateForm();
    };
    // Activiti supports 3 types of root fields: container|group|dynamic-table
    FormModel.prototype.parseRootFields = function (json) {
        var fields = [];
        if (json.fields) {
            fields = json.fields;
        }
        else if (json.formDefinition && json.formDefinition.fields) {
            fields = json.formDefinition.fields;
        }
        var formWidgetModel = [];
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            if (field.type === form_field_types_1.FormFieldTypes.DISPLAY_VALUE) {
                // workaround for dynamic table on a completed/readonly form
                if (field.params) {
                    var originalField = field.params['field'];
                    if (originalField.type === form_field_types_1.FormFieldTypes.DYNAMIC_TABLE) {
                        formWidgetModel.push(new container_model_1.ContainerModel(new form_field_model_1.FormFieldModel(this, field)));
                    }
                }
            }
            else {
                formWidgetModel.push(new container_model_1.ContainerModel(new form_field_model_1.FormFieldModel(this, field)));
            }
        }
        return formWidgetModel;
    };
    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    FormModel.prototype.loadData = function (formValues) {
        for (var _i = 0, _a = this.getFormFields(); _i < _a.length; _i++) {
            var field = _a[_i];
            if (formValues[field.id]) {
                field.json.value = formValues[field.id];
                field.value = field.parseValue(field.json);
            }
        }
    };
    return FormModel;
}(form_base_model_1.FormBaseModel));
exports.FormModel = FormModel;
//# sourceMappingURL=form.model.js.map