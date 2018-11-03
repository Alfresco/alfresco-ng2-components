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

var Util = require('../../util/util');

var FolderModel = function (details) {

    this.id = Util.generateRandomString();
    this.name = Util.generateRandomString();
    this.shortName = this.name;
    this.tooltip = this.name;
    this.location = "";
    this.description= "";

    this.getName = function () {
        return this.name;
    };

    this.getShortName = function () {
        return this.shortName;
    };

    this.getTooltip = function () {
        return this.tooltip;
    };

    this.getId = function () {
        return this.id;
    };

    this.getLocation = function () {
        return this.location;
    };

    Object.assign(this, details);

};
module.exports = FolderModel;

