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

    this.fieldType;
    this.id;
    this.name;
    this.value;
    this.type;
    this.required;
    this.readOnly;
    this.overrideId;
    this.colspan;
    this.placeholder;
    this.minLength;
    this.maxLength;
    this.minValue;
    this.maxValue;
    this.regexPattern;
    this.optionType;
    this.hasEmptyValue;
    this.options;
    this.restUrl;
    this.restResponsePath;
    this.restIdProperty;
    this.setRestLabelProperty;
    this.tab;
    this.className;
    this.dateDisplayFormat;
    this.layout = {};
    this.sizeX;
    this.sizeY;
    this.row;
    this.col;
    this.columnDefinitions;
    this.visibilityCondition;
    this.numberOfColumns;
    this.fields = {};

    Object.assign(this, details);
};
module.exports = FormDefinitionFieldModel;

