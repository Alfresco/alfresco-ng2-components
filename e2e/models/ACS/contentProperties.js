/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

var ContentPropertiesModel = function (details) {
    this['cm:author'] = '';
    this['cm:description'] = '';
    this['cm:title'] = '';

    this.getAuthor = function () {
        return this['cm:author'];
    };

    this.getDescription = function () {
        return this['cm:description'];
    };

    this.getTitle = function () {
        return this['cm:title'];
    };

    Object.assign(this, details);

};
module.exports = ContentPropertiesModel;
