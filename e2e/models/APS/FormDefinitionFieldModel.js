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

var FormDefinitionFieldModel = function (details) {
    this.fieldType = undefined;
    this.id = undefined;
    this.name = undefined;
    this.value = undefined;
    this.type = undefined;
    this.required = undefined;
    this.readOnly = undefined;
    this.overrideId = undefined;
    this.colspan = undefined;
    this.placeholder = undefined;
    this.minLength = undefined;
    this.maxLength = undefined;
    this.minValue = undefined;
    this.maxValue = undefined;
    this.regexPattern = undefined;
    this.optionType = undefined;
    this.hasEmptyValue = undefined;
    this.options = undefined;
    this.restUrl = undefined;
    this.restResponsePath = undefined;
    this.restIdProperty = undefined;
    this.setRestLabelProperty = undefined;
    this.tab = undefined;
    this.className = undefined;
    this.dateDisplayFormat = undefined;
    this.layout = {};
    this.sizeX = undefined;
    this.sizeY = undefined;
    this.row = undefined;
    this.col = undefined;
    this.columnDefinitions = undefined;
    this.visibilityCondition = undefined;
    this.numberOfColumns = undefined;
    this.fields = {};

    Object.assign(this, details);
};
module.exports = FormDefinitionFieldModel;
