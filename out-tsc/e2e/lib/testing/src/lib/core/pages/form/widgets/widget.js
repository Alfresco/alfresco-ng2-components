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
var multilineTextWidget_1 = require("./multilineTextWidget");
var headerWidget_1 = require("./headerWidget");
var displayTextWidget_1 = require("./displayTextWidget");
var displayValueWidget_1 = require("./displayValueWidget");
var attachFileWidget_1 = require("./attachFileWidget");
var radioButtonsWidget_1 = require("./radioButtonsWidget");
var hyperlinkWidget_1 = require("./hyperlinkWidget");
var dropdownWidget_1 = require("./dropdownWidget");
var dynamicTableWidget_1 = require("./dynamicTableWidget");
var textWidget_1 = require("./textWidget");
var checkboxWidget_1 = require("./checkboxWidget");
var dateWidget_1 = require("./dateWidget");
var dateTimeWidget_1 = require("./dateTimeWidget");
var numberWidget_1 = require("./numberWidget");
var amountWidget_1 = require("./amountWidget");
var containerWidget_1 = require("./containerWidget");
var peopleWidget_1 = require("./peopleWidget");
var documentWidget_1 = require("./documentWidget");
var attachFileWidgetCloud_1 = require("./attachFileWidgetCloud");
var Widget = /** @class */ (function () {
    function Widget() {
    }
    Widget.prototype.multilineTextWidget = function () {
        return new multilineTextWidget_1.MultilineTextWidget();
    };
    Widget.prototype.headerWidget = function () {
        return new headerWidget_1.HeaderWidget();
    };
    Widget.prototype.displayTextWidget = function () {
        return new displayTextWidget_1.DisplayTextWidget();
    };
    Widget.prototype.attachFileWidget = function () {
        return new attachFileWidget_1.AttachFileWidget();
    };
    Widget.prototype.attachFileWidgetCloud = function (fieldId) {
        return new attachFileWidgetCloud_1.AttachFileWidgetCloud(fieldId);
    };
    Widget.prototype.displayValueWidget = function () {
        return new displayValueWidget_1.DisplayValueWidget();
    };
    Widget.prototype.radioWidget = function () {
        return new radioButtonsWidget_1.RadioButtonsWidget();
    };
    Widget.prototype.hyperlink = function () {
        return new hyperlinkWidget_1.HyperlinkWidget();
    };
    Widget.prototype.dropdown = function () {
        return new dropdownWidget_1.DropdownWidget();
    };
    Widget.prototype.dynamicTable = function () {
        return new dynamicTableWidget_1.DynamicTableWidget();
    };
    Widget.prototype.textWidget = function () {
        return new textWidget_1.TextWidget();
    };
    Widget.prototype.documentWidget = function () {
        return new documentWidget_1.DocumentWidget();
    };
    Widget.prototype.checkboxWidget = function () {
        return new checkboxWidget_1.CheckboxWidget();
    };
    Widget.prototype.dateWidget = function () {
        return new dateWidget_1.DateWidget();
    };
    Widget.prototype.dateTimeWidget = function () {
        return new dateTimeWidget_1.DateTimeWidget();
    };
    Widget.prototype.numberWidget = function () {
        return new numberWidget_1.NumberWidget();
    };
    Widget.prototype.amountWidget = function () {
        return new amountWidget_1.AmountWidget();
    };
    Widget.prototype.containerWidget = function () {
        return new containerWidget_1.ContainerWidget();
    };
    Widget.prototype.peopleWidget = function () {
        return new peopleWidget_1.PeopleWidget();
    };
    return Widget;
}());
exports.Widget = Widget;
//# sourceMappingURL=widget.js.map