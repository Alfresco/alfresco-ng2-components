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
var alfresco_api_service_1 = require("../../services/alfresco-api.service");
var log_service_1 = require("../../services/log.service");
var core_1 = require("@angular/core");
var moment_es6_1 = require("moment-es6");
var rxjs_1 = require("rxjs");
var widget_visibility_model_1 = require("../models/widget-visibility.model");
var operators_1 = require("rxjs/operators");
var WidgetVisibilityService = /** @class */ (function () {
    function WidgetVisibilityService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
    }
    WidgetVisibilityService.prototype.refreshVisibility = function (form) {
        var _this = this;
        if (form && form.tabs && form.tabs.length > 0) {
            form.tabs.map(function (tabModel) { return _this.refreshEntityVisibility(tabModel); });
        }
        if (form) {
            form.getFormFields().map(function (field) { return _this.refreshEntityVisibility(field); });
        }
    };
    WidgetVisibilityService.prototype.refreshEntityVisibility = function (element) {
        var visible = this.evaluateVisibility(element.form, element.visibilityCondition);
        element.isVisible = visible;
    };
    WidgetVisibilityService.prototype.evaluateVisibility = function (form, visibilityObj) {
        var isLeftFieldPresent = visibilityObj && (visibilityObj.leftType || visibilityObj.leftValue);
        if (!isLeftFieldPresent || isLeftFieldPresent === 'null') {
            return true;
        }
        else {
            return this.isFieldVisible(form, visibilityObj);
        }
    };
    WidgetVisibilityService.prototype.isFieldVisible = function (form, visibilityObj, accumulator, result) {
        if (accumulator === void 0) { accumulator = []; }
        if (result === void 0) { result = false; }
        var leftValue = this.getLeftValue(form, visibilityObj);
        var rightValue = this.getRightValue(form, visibilityObj);
        var actualResult = this.evaluateCondition(leftValue, rightValue, visibilityObj.operator);
        if (this.isValidOperator(visibilityObj.nextConditionOperator)) {
            accumulator.push({ value: actualResult, operator: visibilityObj.nextConditionOperator });
        }
        if (this.isValidCondition(visibilityObj.nextCondition)) {
            result = this.isFieldVisible(form, visibilityObj.nextCondition, accumulator);
        }
        else if (accumulator[0] !== undefined) {
            result = accumulator[0].value;
            for (var i = 1; i < accumulator.length; i++) {
                if (accumulator[i] !== undefined) {
                    result = this.evaluateLogicalOperation(accumulator[i - 1].operator, result, accumulator[i].value);
                }
            }
        }
        else {
            result = actualResult;
        }
        return !!result;
    };
    WidgetVisibilityService.prototype.getLeftValue = function (form, visibilityObj) {
        var leftValue = '';
        if (visibilityObj.leftType && visibilityObj.leftType === widget_visibility_model_1.WidgetTypeEnum.variable) {
            leftValue = this.getVariableValue(form, visibilityObj.leftValue, this.processVarList);
        }
        else if (visibilityObj.leftType && visibilityObj.leftType === widget_visibility_model_1.WidgetTypeEnum.field) {
            leftValue = this.getFormValue(form, visibilityObj.leftValue);
            if (leftValue === undefined || leftValue === '') {
                var variableValue = this.getVariableValue(form, visibilityObj.leftValue, this.processVarList);
                leftValue = !this.isInvalidValue(variableValue) ? variableValue : leftValue;
            }
        }
        return leftValue;
    };
    WidgetVisibilityService.prototype.getRightValue = function (form, visibilityObj) {
        var valueFound = '';
        if (visibilityObj.rightType === widget_visibility_model_1.WidgetTypeEnum.variable) {
            valueFound = this.getVariableValue(form, visibilityObj.rightValue, this.processVarList);
        }
        else if (visibilityObj.rightType === widget_visibility_model_1.WidgetTypeEnum.field) {
            valueFound = this.getFormValue(form, visibilityObj.rightValue);
        }
        else {
            if (moment_es6_1.default(visibilityObj.rightValue, 'YYYY-MM-DD', true).isValid()) {
                valueFound = visibilityObj.rightValue + 'T00:00:00.000Z';
            }
            else {
                valueFound = visibilityObj.rightValue;
            }
        }
        return valueFound;
    };
    WidgetVisibilityService.prototype.getFormValue = function (form, fieldId) {
        var value = this.getFieldValue(form.values, fieldId);
        if (this.isInvalidValue(value)) {
            value = this.searchValueInForm(form, fieldId);
        }
        return value;
    };
    WidgetVisibilityService.prototype.getFieldValue = function (valueList, fieldId) {
        var dropDownFilterByName, valueFound;
        if (fieldId && fieldId.indexOf('_LABEL') > 0) {
            dropDownFilterByName = fieldId.substring(0, fieldId.length - 6);
            if (valueList[dropDownFilterByName]) {
                valueFound = valueList[dropDownFilterByName].name;
            }
        }
        else if (valueList[fieldId] && valueList[fieldId].id) {
            valueFound = valueList[fieldId].id;
        }
        else {
            valueFound = valueList[fieldId];
        }
        return valueFound;
    };
    WidgetVisibilityService.prototype.isInvalidValue = function (value) {
        return value === undefined || value === null;
    };
    WidgetVisibilityService.prototype.searchValueInForm = function (form, fieldId) {
        var _this = this;
        var fieldValue = '';
        form.getFormFields().forEach(function (formField) {
            if (_this.isSearchedField(formField, fieldId)) {
                fieldValue = _this.getObjectValue(formField, fieldId);
                if (!fieldValue) {
                    if (formField.value && formField.value.id) {
                        fieldValue = formField.value.id;
                    }
                    else if (!_this.isInvalidValue(formField.value)) {
                        fieldValue = formField.value;
                    }
                }
            }
        });
        return fieldValue;
    };
    WidgetVisibilityService.prototype.getObjectValue = function (field, fieldId) {
        var value = '';
        if (field.value && field.value.name) {
            value = field.value.name;
        }
        else if (field.options) {
            var option = field.options.find(function (opt) { return opt.id === field.value; });
            if (option) {
                value = this.getValueFromOption(fieldId, option);
            }
        }
        return value;
    };
    WidgetVisibilityService.prototype.getValueFromOption = function (fieldId, option) {
        var optionValue = '';
        if (fieldId && fieldId.indexOf('_LABEL') > 0) {
            optionValue = option.name;
        }
        else {
            optionValue = option.id;
        }
        return optionValue;
    };
    WidgetVisibilityService.prototype.isSearchedField = function (field, fieldToFind) {
        return (field.id && fieldToFind) ? field.id.toUpperCase() === fieldToFind.toUpperCase() : false;
    };
    WidgetVisibilityService.prototype.getVariableValue = function (form, name, processVarList) {
        var processVariableValue = this.getProcessVariableValue(name, processVarList);
        var variableDefaultValue = this.getFormVariableDefaultValue(form, name);
        return (processVariableValue === undefined) ? variableDefaultValue : processVariableValue;
    };
    WidgetVisibilityService.prototype.getFormVariableDefaultValue = function (form, identifier) {
        var variables = this.getFormVariables(form);
        if (variables) {
            var formVariable = variables.find(function (formVar) {
                return formVar.name === identifier || formVar.id === identifier;
            });
            var value = void 0;
            if (formVariable) {
                value = formVariable.value;
                if (formVariable.type === 'date') {
                    value += 'T00:00:00.000Z';
                }
            }
            return value;
        }
    };
    WidgetVisibilityService.prototype.getFormVariables = function (form) {
        return form.json.variables;
    };
    WidgetVisibilityService.prototype.getProcessVariableValue = function (name, processVarList) {
        if (processVarList) {
            var processVariable = processVarList.find(function (variable) { return variable.id === name; });
            if (processVariable) {
                return processVariable.value;
            }
        }
    };
    WidgetVisibilityService.prototype.evaluateLogicalOperation = function (logicOp, previousValue, newValue) {
        switch (logicOp) {
            case 'and':
                return previousValue && newValue;
            case 'or':
                return previousValue || newValue;
            case 'and-not':
                return previousValue && !newValue;
            case 'or-not':
                return previousValue || !newValue;
            default:
                this.logService.error('NO valid operation! wrong op request : ' + logicOp);
                break;
        }
    };
    WidgetVisibilityService.prototype.evaluateCondition = function (leftValue, rightValue, operator) {
        switch (operator) {
            case '==':
                return leftValue + '' === rightValue + '';
            case '<':
                return leftValue < rightValue;
            case '!=':
                return leftValue + '' !== rightValue + '';
            case '>':
                return leftValue > rightValue;
            case '>=':
                return leftValue >= rightValue;
            case '<=':
                return leftValue <= rightValue;
            case 'empty':
                return leftValue ? leftValue === '' : true;
            case '!empty':
                return leftValue ? leftValue !== '' : false;
            default:
                this.logService.error('NO valid operation!');
                break;
        }
        return;
    };
    WidgetVisibilityService.prototype.cleanProcessVariable = function () {
        this.processVarList = [];
    };
    WidgetVisibilityService.prototype.getTaskProcessVariable = function (taskId) {
        var _this = this;
        return rxjs_1.from(this.apiService.getInstance().activiti.taskFormsApi.getTaskFormVariables(taskId))
            .pipe(operators_1.map(function (res) {
            var jsonRes = _this.toJson(res);
            _this.processVarList = jsonRes;
            return jsonRes;
        }), operators_1.catchError(function (err) { return _this.handleError(err); }));
    };
    WidgetVisibilityService.prototype.toJson = function (res) {
        return res || {};
    };
    WidgetVisibilityService.prototype.isValidOperator = function (operator) {
        return operator !== undefined;
    };
    WidgetVisibilityService.prototype.isValidCondition = function (condition) {
        return !!(condition && condition.operator);
    };
    WidgetVisibilityService.prototype.handleError = function (err) {
        this.logService.error('Error while performing a call');
        return rxjs_1.throwError('Error while performing a call - Server error');
    };
    WidgetVisibilityService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], WidgetVisibilityService);
    return WidgetVisibilityService;
}());
exports.WidgetVisibilityService = WidgetVisibilityService;
//# sourceMappingURL=widget-visibility.service.js.map