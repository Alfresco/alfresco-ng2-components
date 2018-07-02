/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

var MultilineText = require('./MultilineText');
var Header = require('./Header');
var DisplayText = require('./DisplayText');
var AttachFile = require('./AttachFile');
var DisplayValue = require('./DisplayValue');
var RadioButtons = require('./RadioButtons');
var Hyperlink = require('./Hyperlink');
var Dropdown = require('./Dropdown');
var DynamicTable = require('./DynamicTable');

var UsingWidget = function () {

    this.usingMultilineTextWidget = function () {
        return new MultilineText();
    };

    this.usingHeaderWidget = function () {
        return new Header();
    };

    this.usingDisplayTextWidget = function () {
        return new DisplayText();
    };

    this.usingAttachFileWidget = function () {
        return new AttachFile();
    };

    this.usingDisplayValueWidget = function () {
        return new DisplayValue();
    };

    this.usingRadioWidget = function () {
        return new RadioButtons();
    };

    this.usingHyperlink = function () {
        return new Hyperlink();
    };

    this.usingDropdown = function () {
        return new Dropdown();
    };

    this.usingDynamicTable = function () {
        return new DynamicTable();
    };

};

module.exports = UsingWidget;

