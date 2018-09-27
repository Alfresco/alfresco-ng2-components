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

var ToggleState = require('../../core/toggleState');

var AppSettingsToggles = function () {

    var toggleState = new ToggleState();

    var showDetailsHeaderToggle = element(by.id('adf-show-header'));
    var showTaskFilterIconsToggle = element(by.id('adf-show-task-filter-icon'));
    var showProcessFilterIconsToggle = element(by.id('adf-show-process-filter-icon'));

    this.enableShowHeader = function () {
        toggleState.enableToggle(showDetailsHeaderToggle);
        return this;
    };

    this.disableShowHeader = function () {
        toggleState.disableToggle(showDetailsHeaderToggle);
        return this;
    };

    this.enableTaskFiltersIcon = function () {
        toggleState.enableToggle(showTaskFilterIconsToggle);
        return this;
    };

    this.disableTaskFiltersIcon = function () {
        toggleState.disableToggle(showTaskFilterIconsToggle);
        return this;
    };

    this.enableProcessFiltersIcon = function () {
        toggleState.enableToggle(showProcessFilterIconsToggle);
        return this;
    };

    this.disableProcessFiltersIcon = function () {
        toggleState.disableToggle(showProcessFilterIconsToggle);
        return this;
    };

};
module.exports = AppSettingsToggles;


