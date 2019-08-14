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
/* tslint:disable:component-selector  */
var FormFieldTypes = /** @class */ (function () {
    function FormFieldTypes() {
    }
    FormFieldTypes.isReadOnlyType = function (type) {
        return FormFieldTypes.READONLY_TYPES.includes(type);
    };
    FormFieldTypes.isContainerType = function (type) {
        return type === FormFieldTypes.CONTAINER || type === FormFieldTypes.GROUP;
    };
    FormFieldTypes.CONTAINER = 'container';
    FormFieldTypes.GROUP = 'group';
    FormFieldTypes.DYNAMIC_TABLE = 'dynamic-table';
    FormFieldTypes.TEXT = 'text';
    FormFieldTypes.MULTILINE_TEXT = 'multi-line-text';
    FormFieldTypes.DROPDOWN = 'dropdown';
    FormFieldTypes.HYPERLINK = 'hyperlink';
    FormFieldTypes.RADIO_BUTTONS = 'radio-buttons';
    FormFieldTypes.DISPLAY_VALUE = 'readonly';
    FormFieldTypes.READONLY_TEXT = 'readonly-text';
    FormFieldTypes.UPLOAD = 'upload';
    FormFieldTypes.TYPEAHEAD = 'typeahead';
    FormFieldTypes.FUNCTIONAL_GROUP = 'functional-group';
    FormFieldTypes.PEOPLE = 'people';
    FormFieldTypes.BOOLEAN = 'boolean';
    FormFieldTypes.NUMBER = 'integer';
    FormFieldTypes.DATE = 'date';
    FormFieldTypes.AMOUNT = 'amount';
    FormFieldTypes.DOCUMENT = 'document';
    FormFieldTypes.DATETIME = 'datetime';
    FormFieldTypes.ATTACH_FOLDER = 'select-folder';
    FormFieldTypes.READONLY_TYPES = [
        FormFieldTypes.HYPERLINK,
        FormFieldTypes.DISPLAY_VALUE,
        FormFieldTypes.READONLY_TEXT,
        FormFieldTypes.GROUP
    ];
    return FormFieldTypes;
}());
exports.FormFieldTypes = FormFieldTypes;
//# sourceMappingURL=form-field-types.js.map