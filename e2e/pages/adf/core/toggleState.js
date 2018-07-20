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

var Util = require('../../../util/util');

var ToggleState = function () {

    var toggleButton = by.xpath("ancestor::mat-slide-toggle");

    this.enableToggle = function (toggle) {
        Util.waitUntilElementIsVisible(toggle);
        Util.waitUntilElementIsPresent(toggle);
        var finalToggleButton = toggle.element(toggleButton);
        finalToggleButton.getAttribute('class').then(function (value) {
            if (value.indexOf('mat-checked')===-1) {
                finalToggleButton.click();
            }
        });
        return this;
    };

    this.disableToggle = function (toggle) {
        Util.waitUntilElementIsVisible(toggle);
        var finalToggleButton = toggle.element(toggleButton);
        finalToggleButton.getAttribute('class').then(function (value) {
            if (value.indexOf('mat-checked')!==-1) {
                finalToggleButton.click();
            }
        });
        return this;
    };

};
module.exports = ToggleState;



