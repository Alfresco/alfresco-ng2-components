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

var MultilineText = require('./MultilineText.js');
var Header = require('./Header.js');
var DisplayText = require('./DisplayText.js');
var AttachFile = require('./AttachFile.js');
var DisplayValue = require('./DisplayValue.js');
var RadioButtons = require('./RadioButtons.js');
var Hyperlink = require('./Hyperlink.js');
var Dropdown = require('./Dropdown.js');
var DynamicTable = require('./DynamicTable.js');

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

