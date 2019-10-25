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

export class DemoForm {

    easyForm: any = {
        'id': 1001,
        'name': 'ISSUE_FORM',
        'tabs': [],
        'fields': [
            {
                'fieldType': 'ContainerRepresentation',
                'id': '1498212398417',
                'name': 'Label',
                'type': 'container',
                'value': null,
                'required': false,
                'readOnly': false,
                'overrideId': false,
                'colspan': 1,
                'placeholder': null,
                'minLength': 0,
                'maxLength': 0,
                'minValue': null,
                'maxValue': null,
                'regexPattern': null,
                'optionType': null,
                'hasEmptyValue': false,
                'options': null,
                'restUrl': null,
                'restResponsePath': null,
                'restIdProperty': null,
                'restLabelProperty': null,
                'tab': null,
                'className': null,
                'dateDisplayFormat': null,
                'sizeX': 2,
                'sizeY': 1,
                'row': -1,
                'col': -1,
                'numberOfColumns': 2,
                'fields': {
                    '1': [
                        {
                            'fieldType': 'RestFieldRepresentation',
                            'id': 'label',
                            'name': 'Label',
                            'type': 'dropdown',
                            'value': 'Choose one...',
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': true,
                            'options': [
                                {
                                    'id': 'empty',
                                    'name': 'Choose one...'
                                },
                                {
                                    'id': 'option_1',
                                    'name': 'test1'
                                },
                                {
                                    'id': 'option_2',
                                    'name': 'test2'
                                },
                                {
                                    'id': 'option_3',
                                    'name': 'test3'
                                }
                            ],
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': null,
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null,
                            'endpoint': null,
                            'requestHeaders': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'Date',
                            'name': 'Date',
                            'type': 'date',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label5',
                            'name': 'Label5',
                            'type': 'boolean',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label6',
                            'name': 'Label6',
                            'type': 'boolean',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label4',
                            'name': 'Label4',
                            'type': 'integer',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'RestFieldRepresentation',
                            'id': 'label12',
                            'name': 'Label12',
                            'type': 'radio-buttons',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': [
                                {
                                    'id': 'option_1',
                                    'name': 'Option 1'
                                },
                                {
                                    'id': 'option_2',
                                    'name': 'Option 2'
                                }
                            ],
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null,
                            'endpoint': null,
                            'requestHeaders': null
                        }
                    ]
                }
            }
        ],
        'outcomes': [],
        'javascriptEvents': [],
        'className': '',
        'style': '',
        'customFieldTemplates': {},
        'metadata': {},
        'variables': [
            {
                'id': 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
                'name': 'name1',
                'type': 'string',
                'value': ''
            },
            {
                'id': '3ed9f28a-dbae-463f-b991-47ef06658bb6',
                'name': 'name2',
                'type': 'string',
                'value': ''
            },
            {
                'id': 'a7710978-1e9c-4b54-a19c-c6267d2b19a2',
                'name': 'input02',
                'type': 'integer'
            }
        ],
        'customFieldsValueInfo': {},
        'gridsterForm': false,
        'globalDateFormat': 'D-M-YYYY'
    };

    formDefinition: any = {
        'id': 3003,
        'name': 'demo-01',
        'taskId': '7501',
        'taskName': 'Demo Form 01',
        'tabs': [
            {
                'id': 'tab1',
                'title': 'Text',
                'visibilityCondition': null
            },
            {
                'id': 'tab2',
                'title': 'Misc',
                'visibilityCondition': null
            }
        ],
        'fields': [
            {
                'fieldType': 'ContainerRepresentation',
                'id': '1488274019966',
                'name': 'Label',
                'type': 'container',
                'value': null,
                'required': false,
                'readOnly': false,
                'overrideId': false,
                'colspan': 1,
                'placeholder': null,
                'minLength': 0,
                'maxLength': 0,
                'minValue': null,
                'maxValue': null,
                'regexPattern': null,
                'optionType': null,
                'hasEmptyValue': null,
                'options': null,
                'restUrl': null,
                'restResponsePath': null,
                'restIdProperty': null,
                'restLabelProperty': null,
                'tab': null,
                'className': null,
                'dateDisplayFormat': null,
                'layout': null,
                'sizeX': 2,
                'sizeY': 1,
                'row': -1,
                'col': -1,
                'visibilityCondition': null,
                'numberOfColumns': 2,
                'fields': {
                    '1': [],
                    '2': []
                }
            },
            {
                'fieldType': 'ContainerRepresentation',
                'id': 'section4',
                'name': 'Section 4',
                'type': 'group',
                'value': null,
                'required': false,
                'readOnly': false,
                'overrideId': false,
                'colspan': 1,
                'placeholder': null,
                'minLength': 0,
                'maxLength': 0,
                'minValue': null,
                'maxValue': null,
                'regexPattern': null,
                'optionType': null,
                'hasEmptyValue': null,
                'options': null,
                'restUrl': null,
                'restResponsePath': null,
                'restIdProperty': null,
                'restLabelProperty': null,
                'tab': 'tab2',
                'className': null,
                'dateDisplayFormat': null,
                'layout': {
                    'row': -1,
                    'column': -1,
                    'colspan': 2
                },
                'sizeX': 2,
                'sizeY': 1,
                'row': -1,
                'col': -1,
                'visibilityCondition': null,
                'numberOfColumns': 2,
                'fields': {
                    '1': [
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label8',
                            'name': 'Label8',
                            'type': 'people',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab2',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label13',
                            'name': 'Label13',
                            'type': 'functional-group',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab2',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label18',
                            'name': 'Label18',
                            'type': 'readonly',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab2',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label19',
                            'name': 'Label19',
                            'type': 'readonly-text',
                            'value': 'Display text as part of the form',
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab2',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        }
                    ],
                    '2': [
                        {
                            'fieldType': 'HyperlinkRepresentation',
                            'id': 'label15',
                            'name': 'Label15',
                            'type': 'hyperlink',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab2',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null,
                            'hyperlinkUrl': 'www.google.com',
                            'displayText': null
                        },
                        {
                            'fieldType': 'AttachFileFieldRepresentation',
                            'id': 'label16',
                            'name': 'Label16',
                            'type': 'upload',
                            'value': [],
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab2',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1,
                                'fileSource': {
                                    'serviceId': 'all-file-sources',
                                    'name': 'All file sources'
                                }
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null,
                            'metaDataColumnDefinitions': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label17',
                            'name': 'Label17',
                            'type': 'select-folder',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab2',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1,
                                'folderSource': {
                                    'serviceId': 'alfresco-1',
                                    'name': 'Alfresco 5.2 Local',
                                    'metaDataAllowed': true
                                }
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        }
                    ]
                }
            },
            {
                'fieldType': 'DynamicTableRepresentation',
                'id': 'label14',
                'name': 'Label14',
                'type': 'dynamic-table',
                'value': null,
                'required': false,
                'readOnly': false,
                'overrideId': false,
                'colspan': 1,
                'placeholder': null,
                'minLength': 0,
                'maxLength': 0,
                'minValue': null,
                'maxValue': null,
                'regexPattern': null,
                'optionType': null,
                'hasEmptyValue': null,
                'options': null,
                'restUrl': null,
                'restResponsePath': null,
                'restIdProperty': null,
                'restLabelProperty': null,
                'tab': 'tab2',
                'className': null,
                'params': {
                    'existingColspan': 1,
                    'maxColspan': 1
                },
                'dateDisplayFormat': null,
                'layout': {
                    'row': -1,
                    'column': -1,
                    'colspan': 2
                },
                'sizeX': 2,
                'sizeY': 2,
                'row': -1,
                'col': -1,
                'visibilityCondition': null,
                'columnDefinitions': [
                    {
                        'id': 'id',
                        'name': 'id',
                        'type': 'String',
                        'value': null,
                        'optionType': null,
                        'options': null,
                        'restResponsePath': null,
                        'restUrl': null,
                        'restIdProperty': null,
                        'restLabelProperty': null,
                        'amountCurrency': null,
                        'amountEnableFractions': false,
                        'required': true,
                        'editable': true,
                        'sortable': true,
                        'visible': true,
                        'endpoint': null,
                        'requestHeaders': null
                    },
                    {
                        'id': 'name',
                        'name': 'name',
                        'type': 'String',
                        'value': null,
                        'optionType': null,
                        'options': null,
                        'restResponsePath': null,
                        'restUrl': null,
                        'restIdProperty': null,
                        'restLabelProperty': null,
                        'amountCurrency': null,
                        'amountEnableFractions': false,
                        'required': true,
                        'editable': true,
                        'sortable': true,
                        'visible': true,
                        'endpoint': null,
                        'requestHeaders': null
                    }
                ]
            },
            {
                'fieldType': 'ContainerRepresentation',
                'id': 'section1',
                'name': 'Section 1',
                'type': 'group',
                'value': null,
                'required': false,
                'readOnly': false,
                'overrideId': false,
                'colspan': 1,
                'placeholder': null,
                'minLength': 0,
                'maxLength': 0,
                'minValue': null,
                'maxValue': null,
                'regexPattern': null,
                'optionType': null,
                'hasEmptyValue': null,
                'options': null,
                'restUrl': null,
                'restResponsePath': null,
                'restIdProperty': null,
                'restLabelProperty': null,
                'tab': 'tab1',
                'className': null,
                'dateDisplayFormat': null,
                'layout': {
                    'row': -1,
                    'column': -1,
                    'colspan': 2
                },
                'sizeX': 2,
                'sizeY': 1,
                'row': -1,
                'col': -1,
                'visibilityCondition': null,
                'numberOfColumns': 2,
                'fields': {
                    '1': [
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label1',
                            'name': 'Label1',
                            'type': 'text',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label3',
                            'name': 'Label3',
                            'type': 'text',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        }
                    ],
                    '2': [
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label2',
                            'name': 'Label2',
                            'type': 'multi-line-text',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 2,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        }
                    ]
                }
            },
            {
                'fieldType': 'ContainerRepresentation',
                'id': 'section2',
                'name': 'Section 2',
                'type': 'group',
                'value': null,
                'required': false,
                'readOnly': false,
                'overrideId': false,
                'colspan': 1,
                'placeholder': null,
                'minLength': 0,
                'maxLength': 0,
                'minValue': null,
                'maxValue': null,
                'regexPattern': null,
                'optionType': null,
                'hasEmptyValue': null,
                'options': null,
                'restUrl': null,
                'restResponsePath': null,
                'restIdProperty': null,
                'restLabelProperty': null,
                'tab': 'tab1',
                'className': null,
                'dateDisplayFormat': null,
                'layout': {
                    'row': -1,
                    'column': -1,
                    'colspan': 2
                },
                'sizeX': 2,
                'sizeY': 1,
                'row': -1,
                'col': -1,
                'visibilityCondition': null,
                'numberOfColumns': 2,
                'fields': {
                    '1': [
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label4',
                            'name': 'Label4',
                            'type': 'integer',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label7',
                            'name': 'Label7',
                            'type': 'date',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        }
                    ],
                    '2': [
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label5',
                            'name': 'Label5',
                            'type': 'boolean',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'FormFieldRepresentation',
                            'id': 'label6',
                            'name': 'Label6',
                            'type': 'boolean',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null
                        },
                        {
                            'fieldType': 'AmountFieldRepresentation',
                            'id': 'label11',
                            'name': 'Label11',
                            'type': 'amount',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': '10',
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null,
                            'enableFractions': false,
                            'currency': null
                        }
                    ]
                }
            },
            {
                'fieldType': 'ContainerRepresentation',
                'id': 'section3',
                'name': 'Section 3',
                'type': 'group',
                'value': null,
                'required': false,
                'readOnly': false,
                'overrideId': false,
                'colspan': 1,
                'placeholder': null,
                'minLength': 0,
                'maxLength': 0,
                'minValue': null,
                'maxValue': null,
                'regexPattern': null,
                'optionType': null,
                'hasEmptyValue': null,
                'options': null,
                'restUrl': null,
                'restResponsePath': null,
                'restIdProperty': null,
                'restLabelProperty': null,
                'tab': 'tab1',
                'className': null,
                'dateDisplayFormat': null,
                'layout': {
                    'row': -1,
                    'column': -1,
                    'colspan': 2
                },
                'sizeX': 2,
                'sizeY': 1,
                'row': -1,
                'col': -1,
                'visibilityCondition': null,
                'numberOfColumns': 2,
                'fields': {
                    '1': [
                        {
                            'fieldType': 'RestFieldRepresentation',
                            'id': 'label9',
                            'name': 'Label9',
                            'type': 'dropdown',
                            'value': 'Choose one...',
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': true,
                            'options': [
                                {
                                    'id': 'empty',
                                    'name': 'Choose one...'
                                }
                            ],
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null,
                            'endpoint': null,
                            'requestHeaders': null
                        },
                        {
                            'fieldType': 'RestFieldRepresentation',
                            'id': 'label12',
                            'name': 'Label12',
                            'type': 'radio-buttons',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': [
                                {
                                    'id': 'option_1',
                                    'name': 'Option 1'
                                },
                                {
                                    'id': 'option_2',
                                    'name': 'Option 2'
                                }
                            ],
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 2
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null,
                            'endpoint': null,
                            'requestHeaders': null
                        }
                    ],
                    '2': [
                        {
                            'fieldType': 'RestFieldRepresentation',
                            'id': 'label10',
                            'name': 'Label10',
                            'type': 'typeahead',
                            'value': null,
                            'required': false,
                            'readOnly': false,
                            'overrideId': false,
                            'colspan': 1,
                            'placeholder': null,
                            'minLength': 0,
                            'maxLength': 0,
                            'minValue': null,
                            'maxValue': null,
                            'regexPattern': null,
                            'optionType': null,
                            'hasEmptyValue': null,
                            'options': null,
                            'restUrl': null,
                            'restResponsePath': null,
                            'restIdProperty': null,
                            'restLabelProperty': null,
                            'tab': 'tab1',
                            'className': null,
                            'params': {
                                'existingColspan': 1,
                                'maxColspan': 1
                            },
                            'dateDisplayFormat': null,
                            'layout': {
                                'row': -1,
                                'column': -1,
                                'colspan': 1
                            },
                            'sizeX': 1,
                            'sizeY': 1,
                            'row': -1,
                            'col': -1,
                            'visibilityCondition': null,
                            'endpoint': null,
                            'requestHeaders': null
                        }
                    ]
                }
            }
        ],
        'outcomes': [],
        'javascriptEvents': [],
        'className': '',
        'style': '',
        'customFieldTemplates': {},
        'metadata': {},
        'variables': [
            {
                'id': 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
                'name': 'name1',
                'type': 'string',
                'value': ''
            },
            {
                'id': '3ed9f28a-dbae-463f-b991-47ef06658bb6',
                'name': 'name2',
                'type': 'string',
                'value': ''
            },
            {
                'id': 'a7710978-1e9c-4b54-a19c-c6267d2b19a2',
                'name': 'input02',
                'type': 'integer'
            }
        ],
        'gridsterForm': false,
        'globalDateFormat': 'D-M-YYYY'
    };

    simpleFormDefinition: any = {
        'id': 1001,
        'name': 'SIMPLE_FORM_EXAMPLE',
        'description': '',
        'version': 1,
        'lastUpdatedBy': 2,
        'lastUpdatedByFullName': 'Test01 01Test',
        'lastUpdated': '2018-02-26T17:44:04.543+0000',
        'stencilSetId': 0,
        'referenceId': null,
        'taskId': '9999',
        'formDefinition': {
            'tabs': [],
            'fields': [
                {
                    'fieldType': 'ContainerRepresentation',
                    'id': '1519666726245',
                    'name': 'Label',
                    'type': 'container',
                    'value': null,
                    'required': false,
                    'readOnly': false,
                    'overrideId': false,
                    'colspan': 1,
                    'placeholder': null,
                    'minLength': 0,
                    'maxLength': 0,
                    'minValue': null,
                    'maxValue': null,
                    'regexPattern': null,
                    'optionType': null,
                    'hasEmptyValue': null,
                    'options': null,
                    'restUrl': null,
                    'restResponsePath': null,
                    'restIdProperty': null,
                    'restLabelProperty': null,
                    'tab': null,
                    'className': null,
                    'dateDisplayFormat': null,
                    'layout': null,
                    'sizeX': 2,
                    'sizeY': 1,
                    'row': -1,
                    'col': -1,
                    'visibilityCondition': null,
                    'numberOfColumns': 2,
                    'fields': {
                        '1': [
                            {
                                'fieldType': 'RestFieldRepresentation',
                                'id': 'typeaheadField',
                                'name': 'TypeaheadField',
                                'type': 'typeahead',
                                'value': null,
                                'required': false,
                                'readOnly': false,
                                'overrideId': false,
                                'colspan': 1,
                                'placeholder': null,
                                'minLength': 0,
                                'maxLength': 0,
                                'minValue': null,
                                'maxValue': null,
                                'regexPattern': null,
                                'optionType': null,
                                'hasEmptyValue': null,
                                'options': null,
                                'restUrl': 'https://jsonplaceholder.typicode.com/users',
                                'restResponsePath': null,
                                'restIdProperty': 'id',
                                'restLabelProperty': 'name',
                                'tab': null,
                                'className': null,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2
                                },
                                'dateDisplayFormat': null,
                                'layout': {
                                    'row': -1,
                                    'column': -1,
                                    'colspan': 1
                                },
                                'sizeX': 1,
                                'sizeY': 1,
                                'row': -1,
                                'col': -1,
                                'visibilityCondition': null,
                                'endpoint': null,
                                'requestHeaders': null
                            }
                        ],
                        '2': [
                            {
                                'fieldType': 'RestFieldRepresentation',
                                'id': 'radioButton',
                                'name': 'RadioButtons',
                                'type': 'radio-buttons',
                                'value': null,
                                'required': false,
                                'readOnly': false,
                                'overrideId': false,
                                'colspan': 1,
                                'placeholder': null,
                                'minLength': 0,
                                'maxLength': 0,
                                'minValue': null,
                                'maxValue': null,
                                'regexPattern': null,
                                'optionType': null,
                                'hasEmptyValue': null,
                                'options': [
                                    {
                                        'id': 'option_1',
                                        'name': 'Option 1'
                                    },
                                    {
                                        'id': 'option_2',
                                        'name': 'Option 2'
                                    },
                                    {
                                        'id': 'option_3',
                                        'name': 'Option 3'
                                    }
                                ],
                                'restUrl': null,
                                'restResponsePath': null,
                                'restIdProperty': null,
                                'restLabelProperty': null,
                                'tab': null,
                                'className': null,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 1
                                },
                                'dateDisplayFormat': null,
                                'layout': {
                                    'row': -1,
                                    'column': -1,
                                    'colspan': 1
                                },
                                'sizeX': 1,
                                'sizeY': 2,
                                'row': -1,
                                'col': -1,
                                'visibilityCondition': null,
                                'endpoint': null,
                                'requestHeaders': null
                            }
                        ]
                    }
                },
                {
                    'fieldType': 'ContainerRepresentation',
                    'id': '1519666735185',
                    'name': 'Label',
                    'type': 'container',
                    'value': null,
                    'required': false,
                    'readOnly': false,
                    'overrideId': false,
                    'colspan': 1,
                    'placeholder': null,
                    'minLength': 0,
                    'maxLength': 0,
                    'minValue': null,
                    'maxValue': null,
                    'regexPattern': null,
                    'optionType': null,
                    'hasEmptyValue': null,
                    'options': null,
                    'restUrl': null,
                    'restResponsePath': null,
                    'restIdProperty': null,
                    'restLabelProperty': null,
                    'tab': null,
                    'className': null,
                    'dateDisplayFormat': null,
                    'layout': null,
                    'sizeX': 2,
                    'sizeY': 1,
                    'row': -1,
                    'col': -1,
                    'visibilityCondition': null,
                    'numberOfColumns': 2,
                    'fields': {
                        '1': [
                            {
                                'fieldType': 'RestFieldRepresentation',
                                'id': 'selectBox',
                                'name': 'SelectBox',
                                'type': 'dropdown',
                                'value': 'Choose one...',
                                'required': false,
                                'readOnly': false,
                                'overrideId': false,
                                'colspan': 1,
                                'placeholder': null,
                                'minLength': 0,
                                'maxLength': 0,
                                'minValue': null,
                                'maxValue': null,
                                'regexPattern': null,
                                'optionType': 'manual',
                                'hasEmptyValue': true,
                                'options': [
                                    {
                                        'id': 'empty',
                                        'name': 'Choose one...'
                                    },
                                    {
                                        'id': 'option_1',
                                        'name': '1'
                                    },
                                    {
                                        'id': 'option_2',
                                        'name': '2'
                                    },
                                    {
                                        'id': 'option_3',
                                        'name': '3'
                                    }
                                ],
                                'restUrl': null,
                                'restResponsePath': null,
                                'restIdProperty': null,
                                'restLabelProperty': null,
                                'tab': null,
                                'className': null,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2
                                },
                                'dateDisplayFormat': null,
                                'layout': {
                                    'row': -1,
                                    'column': -1,
                                    'colspan': 1
                                },
                                'sizeX': 1,
                                'sizeY': 1,
                                'row': -1,
                                'col': -1,
                                'visibilityCondition': null,
                                'endpoint': null,
                                'requestHeaders': null
                            }
                        ],
                        '2': []
                    }
                }
            ],
            'outcomes': [],
            'javascriptEvents': [],
            'className': '',
            'style': '',
            'customFieldTemplates': {},
            'metadata': {},
            'variables': [
                {
                    'id': 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
                    'name': 'name1',
                    'type': 'string',
                    'value': ''
                },
                {
                    'id': '3ed9f28a-dbae-463f-b991-47ef06658bb6',
                    'name': 'name2',
                    'type': 'string',
                    'value': ''
                },
                {
                    'id': 'a7710978-1e9c-4b54-a19c-c6267d2b19a2',
                    'name': 'input02',
                    'type': 'integer'
                }
            ],
            'customFieldsValueInfo': {},
            'gridsterForm': false
        }
    };

    cloudFormDefinition: any = {
        'formRepresentation': {
            'id': 'text-form',
            'name': 'test-start-form',
            'version': 0,
            'description': '',
            'formDefinition': {
                'tabs': [],
                'fields': [
                    {
                        'id': '1511517333638',
                        'type': 'container',
                        'fieldType': 'ContainerRepresentation',
                        'name': 'Label',
                        'tab': null,
                        'numberOfColumns': 2,
                        'fields': {
                            '1': [
                                {
                                    'fieldType': 'FormFieldRepresentation',
                                    'id': 'texttest',
                                    'name': 'texttest',
                                    'type': 'text',
                                    'value': null,
                                    'required': false,
                                    'placeholder': 'text',
                                    'params': {
                                        'existingColspan': 2,
                                        'maxColspan': 6,
                                        'inputMaskReversed': true,
                                        'inputMask': '0#',
                                        'inputMaskPlaceholder': '(0-9)'
                                    }
                                }
                            ],
                            '2': [{
                                'fieldType': 'AttachFileFieldRepresentation',
                                'id': 'attachfiletest',
                                'name': 'attachfiletest',
                                'type': 'upload',
                                'required': true,
                                'colspan': 2,
                                'placeholder': 'attachfile',
                                'params': {
                                    'existingColspan': 2,
                                    'maxColspan': 2,
                                    'fileSource': {
                                        'serviceId': 'local-file',
                                        'name': 'Local File'
                                    },
                                    'multiple': true,
                                    'link': false
                                },
                                'visibilityCondition': {
                                }
                            }]
                        }
                    }
                ],
                'outcomes': [],
                'metadata': {
                    'property1': 'value1',
                    'property2': 'value2'
                },
                'variables': [
                    {
                        'name': 'variable1',
                        'type': 'string',
                        'value': 'value1'
                    },
                    {
                        'name': 'variable2',
                        'type': 'string',
                        'value': 'value2'
                    }
                ]
            }
        }
    };

    getEasyForm(): any {
        return this.easyForm;
    }

    getFormDefinition(): any {
        return this.formDefinition;
    }

    getSimpleFormDefinition(): any {
        return this.simpleFormDefinition;
    }

    getFormCloudDefinition(): any {
        return this.cloudFormDefinition;
    }

}
