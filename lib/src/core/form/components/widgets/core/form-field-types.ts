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

 /* tslint:disable:component-selector  */

export class FormFieldTypes {
    static CONTAINER = 'container';
    static GROUP = 'group';
    static DYNAMIC_TABLE = 'dynamic-table';
    static TEXT = 'text';
    static MULTILINE_TEXT = 'multi-line-text';
    static DROPDOWN = 'dropdown';
    static HYPERLINK = 'hyperlink';
    static RADIO_BUTTONS = 'radio-buttons';
    static DISPLAY_VALUE = 'readonly';
    static READONLY_TEXT = 'readonly-text';
    static UPLOAD = 'upload';
    static TYPEAHEAD = 'typeahead';
    static FUNCTIONAL_GROUP = 'functional-group';
    static PEOPLE = 'people';
    static BOOLEAN = 'boolean';
    static NUMBER = 'integer';
    static DATE = 'date';
    static AMOUNT = 'amount';
    static DOCUMENT = 'document';

    static READONLY_TYPES: string[] = [
        FormFieldTypes.HYPERLINK,
        FormFieldTypes.DISPLAY_VALUE,
        FormFieldTypes.READONLY_TEXT
    ];

    static isReadOnlyType(type: string) {
        return FormFieldTypes.READONLY_TYPES.indexOf(type) > -1;
    }

    static isContainerType(type: string) {
        return type === FormFieldTypes.CONTAINER || type === FormFieldTypes.GROUP;
    }
}
