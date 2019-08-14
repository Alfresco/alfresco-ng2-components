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
var moment_es6_1 = require("moment-es6");
var widget_visibility_model_1 = require("../../../models/widget-visibility.model");
var container_column_model_1 = require("./container-column.model");
var error_message_model_1 = require("./error-message.model");
var form_field_types_1 = require("./form-field-types");
var form_field_validator_1 = require("./form-field-validator");
var form_widget_model_1 = require("./form-widget.model");
// Maps to FormFieldRepresentation
var FormFieldModel = /** @class */ (function (_super) {
    __extends(FormFieldModel, _super);
    function FormFieldModel(form, json) {
        var _this = _super.call(this, form, json) || this;
        _this._readOnly = false;
        _this._isValid = true;
        _this._required = false;
        _this.defaultDateFormat = 'D-M-YYYY';
        _this.defaultDateTimeFormat = 'D-M-YYYY hh:mm A';
        _this.rowspan = 1;
        _this.colspan = 1;
        _this.placeholder = null;
        _this.minLength = 0;
        _this.maxLength = 0;
        _this.options = [];
        _this.params = {};
        _this.isVisible = true;
        _this.visibilityCondition = null;
        _this.enableFractions = false;
        _this.currency = null;
        _this.dateDisplayFormat = _this.defaultDateFormat;
        // container model members
        _this.numberOfColumns = 1;
        _this.fields = [];
        _this.columns = [];
        if (json) {
            _this.fieldType = json.fieldType;
            _this.id = json.id;
            _this.name = json.name;
            _this.type = json.type;
            _this._required = json.required;
            _this._readOnly = json.readOnly || json.type === 'readonly';
            _this.overrideId = json.overrideId;
            _this.tab = json.tab;
            _this.restUrl = json.restUrl;
            _this.restResponsePath = json.restResponsePath;
            _this.restIdProperty = json.restIdProperty;
            _this.restLabelProperty = json.restLabelProperty;
            _this.colspan = json.colspan;
            _this.minLength = json.minLength || 0;
            _this.maxLength = json.maxLength || 0;
            _this.minValue = json.minValue;
            _this.maxValue = json.maxValue;
            _this.regexPattern = json.regexPattern;
            _this.options = json.options || [];
            _this.hasEmptyValue = json.hasEmptyValue;
            _this.className = json.className;
            _this.optionType = json.optionType;
            _this.params = json.params || {};
            _this.hyperlinkUrl = json.hyperlinkUrl;
            _this.displayText = json.displayText;
            _this.visibilityCondition = json.visibilityCondition ? new widget_visibility_model_1.WidgetVisibilityModel(json.visibilityCondition) : undefined;
            _this.enableFractions = json.enableFractions;
            _this.currency = json.currency;
            _this.dateDisplayFormat = json.dateDisplayFormat || _this.getDefaultDateFormat(json);
            _this._value = _this.parseValue(json);
            _this.validationSummary = new error_message_model_1.ErrorMessageModel();
            if (json.placeholder && json.placeholder !== '' && json.placeholder !== 'null') {
                _this.placeholder = json.placeholder;
            }
            if (form_field_types_1.FormFieldTypes.isReadOnlyType(json.type)) {
                if (json.params && json.params.field) {
                    if (form.processVariables) {
                        var processVariable = _this.getProcessVariableValue(json.params.field, form);
                        if (processVariable) {
                            _this.value = processVariable;
                        }
                    }
                    else if (json.params.responseVariable && form.json.variables) {
                        var formVariable = _this.getVariablesValue(json.params.field.name, form);
                        if (formVariable) {
                            _this.value = formVariable;
                        }
                    }
                }
            }
            if (form_field_types_1.FormFieldTypes.isContainerType(json.type)) {
                _this.containerFactory(json, form);
            }
        }
        if (_this.hasEmptyValue && _this.options && _this.options.length > 0) {
            _this.emptyOption = _this.options[0];
        }
        _this.updateForm();
        return _this;
    }
    Object.defineProperty(FormFieldModel.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
            this.updateForm();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormFieldModel.prototype, "readOnly", {
        get: function () {
            if (this.form && this.form.readOnly) {
                return true;
            }
            return this._readOnly;
        },
        set: function (readOnly) {
            this._readOnly = readOnly;
            this.updateForm();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormFieldModel.prototype, "required", {
        get: function () {
            return this._required;
        },
        set: function (value) {
            this._required = value;
            this.updateForm();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormFieldModel.prototype, "isValid", {
        get: function () {
            return this._isValid;
        },
        enumerable: true,
        configurable: true
    });
    FormFieldModel.prototype.markAsInvalid = function () {
        this._isValid = false;
    };
    FormFieldModel.prototype.validate = function () {
        this.validationSummary = new error_message_model_1.ErrorMessageModel();
        if (!this.readOnly) {
            var validators = this.form.fieldValidators || [];
            for (var _i = 0, validators_1 = validators; _i < validators_1.length; _i++) {
                var validator = validators_1[_i];
                if (!validator.validate(this)) {
                    this._isValid = false;
                    return this._isValid;
                }
            }
        }
        this._isValid = true;
        return this._isValid;
    };
    FormFieldModel.prototype.getDefaultDateFormat = function (jsonField) {
        var originalType = jsonField.type;
        if (form_field_types_1.FormFieldTypes.isReadOnlyType(jsonField.type) &&
            jsonField.params &&
            jsonField.params.field) {
            originalType = jsonField.params.field.type;
        }
        return originalType === form_field_types_1.FormFieldTypes.DATETIME ? this.defaultDateTimeFormat : this.defaultDateFormat;
    };
    FormFieldModel.prototype.isTypeaheadFieldType = function (type) {
        return type === 'typeahead' ? true : false;
    };
    FormFieldModel.prototype.getFieldNameWithLabel = function (name) {
        return name += '_LABEL';
    };
    FormFieldModel.prototype.getProcessVariableValue = function (field, form) {
        var fieldName = field.name;
        if (this.isTypeaheadFieldType(field.type)) {
            fieldName = this.getFieldNameWithLabel(field.id);
        }
        return this.findProcessVariableValue(fieldName, form);
    };
    FormFieldModel.prototype.getVariablesValue = function (variableName, form) {
        var variable = form.json.variables.find(function (currentVariable) {
            return currentVariable.name === variableName;
        });
        if (variable) {
            if (variable.type === 'boolean') {
                return JSON.parse(variable.value);
            }
            return variable.value;
        }
        return null;
    };
    FormFieldModel.prototype.findProcessVariableValue = function (variableName, form) {
        if (form.processVariables) {
            var variable = form.processVariables.find(function (currentVariable) {
                return currentVariable.name === variableName;
            });
            if (variable) {
                return variable.type === 'boolean' ? JSON.parse(variable.value) : variable.value;
            }
        }
        return undefined;
    };
    FormFieldModel.prototype.containerFactory = function (json, form) {
        var _this = this;
        this.numberOfColumns = json.numberOfColumns || 1;
        this.fields = json.fields;
        this.rowspan = 1;
        this.colspan = 1;
        if (json.fields) {
            for (var currentField in json.fields) {
                if (json.fields.hasOwnProperty(currentField)) {
                    var col = new container_column_model_1.ContainerColumnModel();
                    var fields = (json.fields[currentField] || []).map(function (f) { return new FormFieldModel(form, f); });
                    col.fields = fields;
                    col.rowspan = json.fields[currentField].length;
                    col.fields.forEach(function (colFields) {
                        _this.colspan = colFields.colspan > _this.colspan ? colFields.colspan : _this.colspan;
                    });
                    this.rowspan = this.rowspan < col.rowspan ? col.rowspan : this.rowspan;
                    this.columns.push(col);
                }
            }
        }
    };
    FormFieldModel.prototype.parseValue = function (json) {
        var value = json.hasOwnProperty('value') ? json.value : null;
        /*
         This is needed due to Activiti issue related to reading dropdown values as value string
         but saving back as object: { id: <id>, name: <name> }
         */
        if (json.type === form_field_types_1.FormFieldTypes.DROPDOWN) {
            if (json.hasEmptyValue && json.options) {
                var options = json.options || [];
                if (options.length > 0) {
                    var emptyOption = json.options[0];
                    if (value === '' || value === emptyOption.id || value === emptyOption.name) {
                        value = emptyOption.id;
                    }
                    else if (value.id && value.name) {
                        value = value.id;
                    }
                }
            }
        }
        /*
         This is needed due to Activiti issue related to reading radio button values as value string
         but saving back as object: { id: <id>, name: <name> }
         */
        if (json.type === form_field_types_1.FormFieldTypes.RADIO_BUTTONS) {
            // Activiti has a bug with default radio button value where initial selection passed as `name` value
            // so try resolving current one with a fallback to first entry via name or id
            // TODO: needs to be reported and fixed at Activiti side
            var entry = this.options.filter(function (opt) {
                return opt.id === value || opt.name === value || (value && (opt.id === value.id || opt.name === value.name));
            });
            if (entry.length > 0) {
                value = entry[0].id;
            }
        }
        /*
         This is needed due to Activiti displaying/editing dates in d-M-YYYY format
         but storing on server in ISO8601 format (i.e. 2013-02-04T22:44:30.652Z)
         */
        if (this.isDateField(json) || this.isDateTimeField(json)) {
            if (value) {
                var dateValue = void 0;
                if (form_field_validator_1.NumberFieldValidator.isNumber(value)) {
                    dateValue = moment_es6_1.default(value);
                }
                else {
                    dateValue = this.isDateTimeField(json) ? moment_es6_1.default(value, 'YYYY-MM-DD hh:mm A') : moment_es6_1.default(value.split('T')[0], 'YYYY-M-D');
                }
                if (dateValue && dateValue.isValid()) {
                    value = dateValue.format(this.dateDisplayFormat);
                }
            }
        }
        return value;
    };
    FormFieldModel.prototype.updateForm = function () {
        var _this = this;
        if (!this.form) {
            return;
        }
        switch (this.type) {
            case form_field_types_1.FormFieldTypes.DROPDOWN:
                /*
                 This is needed due to Activiti reading dropdown values as string
                 but saving back as object: { id: <id>, name: <name> }
                 */
                if (this.value === 'empty' || this.value === '') {
                    this.form.values[this.id] = {};
                }
                else {
                    var entry = this.options.filter(function (opt) { return opt.id === _this.value; });
                    if (entry.length > 0) {
                        this.form.values[this.id] = entry[0];
                    }
                }
                break;
            case form_field_types_1.FormFieldTypes.RADIO_BUTTONS:
                /*
                 This is needed due to Activiti issue related to reading radio button values as value string
                 but saving back as object: { id: <id>, name: <name> }
                 */
                var rbEntry = this.options.filter(function (opt) { return opt.id === _this.value; });
                if (rbEntry.length > 0) {
                    this.form.values[this.id] = rbEntry[0];
                }
                break;
            case form_field_types_1.FormFieldTypes.UPLOAD:
                this.form.hasUpload = true;
                if (this.value && this.value.length > 0) {
                    this.form.values[this.id] = Array.isArray(this.value) ? this.value.map(function (elem) { return elem.id; }).join(',') : [this.value];
                }
                else {
                    this.form.values[this.id] = null;
                }
                break;
            case form_field_types_1.FormFieldTypes.TYPEAHEAD:
                var taEntry = this.options.filter(function (opt) { return opt.id === _this.value || opt.name === _this.value; });
                if (taEntry.length > 0) {
                    this.form.values[this.id] = taEntry[0];
                }
                else if (this.options.length > 0) {
                    this.form.values[this.id] = null;
                }
                break;
            case form_field_types_1.FormFieldTypes.DATE:
                var dateValue = moment_es6_1.default(this.value, this.dateDisplayFormat, true);
                if (dateValue && dateValue.isValid()) {
                    this.form.values[this.id] = dateValue.format('YYYY-MM-DD') + "T00:00:00.000Z";
                }
                else {
                    this.form.values[this.id] = null;
                    this._value = this.value;
                }
                break;
            case form_field_types_1.FormFieldTypes.DATETIME:
                var dateTimeValue = moment_es6_1.default(this.value, this.dateDisplayFormat, true).utc();
                if (dateTimeValue && dateTimeValue.isValid()) {
                    /* cspell:disable-next-line */
                    this.form.values[this.id] = dateTimeValue.format('YYYY-MM-DDTHH:mm:ssZ');
                }
                else {
                    this.form.values[this.id] = null;
                    this._value = this.value;
                }
                break;
            case form_field_types_1.FormFieldTypes.NUMBER:
                this.form.values[this.id] = parseInt(this.value, 10);
                break;
            case form_field_types_1.FormFieldTypes.AMOUNT:
                this.form.values[this.id] = this.enableFractions ? parseFloat(this.value) : parseInt(this.value, 10);
                break;
            case form_field_types_1.FormFieldTypes.BOOLEAN:
                this.form.values[this.id] = (this.value !== null && this.value !== undefined) ? this.value : false;
                break;
            default:
                if (!form_field_types_1.FormFieldTypes.isReadOnlyType(this.type) && !this.isInvalidFieldType(this.type)) {
                    this.form.values[this.id] = this.value;
                }
        }
        this.form.onFormFieldChanged(this);
    };
    /**
     * Skip the invalid field type
     * @param type
     */
    FormFieldModel.prototype.isInvalidFieldType = function (type) {
        if (type === 'container') {
            return true;
        }
        else {
            return false;
        }
    };
    FormFieldModel.prototype.getOptionName = function () {
        var _this = this;
        var option = this.options.find(function (opt) { return opt.id === _this.value; });
        return option ? option.name : null;
    };
    FormFieldModel.prototype.hasOptions = function () {
        return this.options && this.options.length > 0;
    };
    FormFieldModel.prototype.isDateField = function (json) {
        return (json.params &&
            json.params.field &&
            json.params.field.type === form_field_types_1.FormFieldTypes.DATE) ||
            json.type === form_field_types_1.FormFieldTypes.DATE;
    };
    FormFieldModel.prototype.isDateTimeField = function (json) {
        return (json.params &&
            json.params.field &&
            json.params.field.type === form_field_types_1.FormFieldTypes.DATETIME) ||
            json.type === form_field_types_1.FormFieldTypes.DATETIME;
    };
    return FormFieldModel;
}(form_widget_model_1.FormWidgetModel));
exports.FormFieldModel = FormFieldModel;
//# sourceMappingURL=form-field.model.js.map