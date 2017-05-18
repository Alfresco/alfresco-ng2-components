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

export class FormFieldTypes {
    static CONTAINER: string = 'container';
    static GROUP: string = 'group';
    static DYNAMIC_TABLE: string = 'dynamic-table';
    static TEXT: string = 'text';
    static MULTILINE_TEXT: string = 'multi-line-text';
    static DROPDOWN: string = 'dropdown';
    static HYPERLINK: string = 'hyperlink';
    static RADIO_BUTTONS: string = 'radio-buttons';
    static DISPLAY_VALUE: string = 'readonly';
    static READONLY_TEXT: string = 'readonly-text';
    static UPLOAD: string = 'upload';
    static TYPEAHEAD: string = 'typeahead';
    static FUNCTIONAL_GROUP: string = 'functional-group';
    static PEOPLE: string = 'people';
    static BOOLEAN: string = 'boolean';
    static NUMBER: string = 'integer';
    static DATE: string = 'date';
    static AMOUNT: string = 'amount';
    static DOCUMENT: string = 'document';

    static READONLY_TYPES: string[] = [
        FormFieldTypes.HYPERLINK,
        FormFieldTypes.DISPLAY_VALUE,
        FormFieldTypes.READONLY_TEXT
    ];

    static isReadOnlyType(type: string) {
        return FormFieldTypes.READONLY_TYPES.indexOf(type) > -1;
    }
}
