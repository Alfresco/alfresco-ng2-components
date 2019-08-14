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
var WidgetVisibilityModel = /** @class */ (function () {
    function WidgetVisibilityModel(json) {
        this.json = json;
        if (json) {
            this.operator = json.operator;
            this.nextCondition = new WidgetVisibilityModel(json.nextCondition);
            this.nextConditionOperator = json.nextConditionOperator;
            this.rightRestResponseId = json.rightRestResponseId;
            this.rightFormFieldId = json.rightFormFieldId;
            this.leftFormFieldId = json.leftFormFieldId;
            this.leftRestResponseId = json.leftRestResponseId;
        }
        else {
            this.json = {};
        }
    }
    Object.defineProperty(WidgetVisibilityModel.prototype, "leftType", {
        get: function () {
            if (this.leftFormFieldId) {
                return WidgetTypeEnum.field;
            }
            else if (this.leftRestResponseId) {
                return WidgetTypeEnum.variable;
            }
            else if (!!this.json.leftType) {
                return this.json.leftType;
            }
        },
        set: function (leftType) {
            this.json.leftType = leftType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WidgetVisibilityModel.prototype, "rightType", {
        get: function () {
            if (!!this.json.rightType) {
                return this.json.rightType;
            }
            else if (this.json.rightValue) {
                return WidgetTypeEnum.value;
            }
            else if (this.rightRestResponseId) {
                return WidgetTypeEnum.variable;
            }
            else if (this.rightFormFieldId) {
                return WidgetTypeEnum.field;
            }
        },
        set: function (rightType) {
            this.json.rightType = rightType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WidgetVisibilityModel.prototype, "leftValue", {
        get: function () {
            if (this.json.leftValue) {
                return this.json.leftValue;
            }
            else if (this.leftFormFieldId) {
                return this.leftFormFieldId;
            }
            else {
                return this.leftRestResponseId;
            }
        },
        set: function (leftValue) {
            this.json.leftValue = leftValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WidgetVisibilityModel.prototype, "rightValue", {
        get: function () {
            if (this.json.rightValue) {
                return this.json.rightValue;
            }
            else if (this.rightFormFieldId) {
                return this.rightFormFieldId;
            }
            else {
                return this.rightRestResponseId;
            }
        },
        set: function (rightValue) {
            this.json.rightValue = rightValue;
        },
        enumerable: true,
        configurable: true
    });
    return WidgetVisibilityModel;
}());
exports.WidgetVisibilityModel = WidgetVisibilityModel;
var WidgetTypeEnum;
(function (WidgetTypeEnum) {
    WidgetTypeEnum["field"] = "field";
    WidgetTypeEnum["variable"] = "variable";
    WidgetTypeEnum["value"] = "value";
})(WidgetTypeEnum = exports.WidgetTypeEnum || (exports.WidgetTypeEnum = {}));
//# sourceMappingURL=widget-visibility.model.js.map