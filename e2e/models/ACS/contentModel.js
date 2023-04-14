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

var ContentModel = function (details) {

    this.mimeType = '';
    this.mimeTypeName = '';
    this.sizeInBytes = '';
    this.encoding = '';

    this.getMimeType = function () {
        return this.mimeType;
    };

    this.getMimeTypeName = function () {
        return this.mimeTypeName;
    };

    this.getSizeInBytes = function () {
        if (this.sizeInBytes >= 1024) {
            return (this.sizeInBytes / 1024).toFixed(2) + ' KB';
        }
        else {
            return this.sizeInBytes;
        }
    };

    this.getEncoding = function () {
        return this.encoding;
    };

    Object.assign(this, details);

};
module.exports = ContentModel;
