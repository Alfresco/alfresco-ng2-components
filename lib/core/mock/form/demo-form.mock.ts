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
        formRepresentation: {
            id: 1001,
            name: 'ISSUE_FORM',
            tabs: [],
            fields: [
                {
                    fieldType: 'ContainerRepresentation',
                    id: '1498212398417',
                    name: 'Label',
                    type: 'container',
                    value: null,
                    required: false,
                    readOnly: false,
                    overrideId: false,
                    colspan: 1,
                    placeholder: null,
                    minLength: 0,
                    maxLength: 0,
                    minValue: null,
                    maxValue: null,
                    regexPattern: null,
                    optionType: null,
                    hasEmptyValue: false,
                    options: null,
                    restUrl: null,
                    restResponsePath: null,
                    restIdProperty: null,
                    restLabelProperty: null,
                    tab: null,
                    className: null,
                    dateDisplayFormat: null,
                    sizeX: 2,
                    sizeY: 1,
                    row: -1,
                    col: -1,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                fieldType: 'RestFieldRepresentation',
                                id: 'label',
                                name: 'Label',
                                type: 'dropdown',
                                value: 'Choose one...',
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: true,
                                options: [
                                    {
                                        id: 'empty',
                                        name: 'Choose one...'
                                    },
                                    {
                                        id: 'option_1',
                                        name: 'test1'
                                    },
                                    {
                                        id: 'option_2',
                                        name: 'test2'
                                    },
                                    {
                                        id: 'option_3',
                                        name: 'test3'
                                    }
                                ],
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: null,
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null,
                                endpoint: null,
                                requestHeaders: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'Date',
                                name: 'Date',
                                type: 'date',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label5',
                                name: 'Label5',
                                type: 'boolean',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label6',
                                name: 'Label6',
                                type: 'boolean',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label4',
                                name: 'Label4',
                                type: 'integer',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'RestFieldRepresentation',
                                id: 'label12',
                                name: 'Label12',
                                type: 'radio-buttons',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: [
                                    {
                                        id: 'option_1',
                                        name: 'Option 1'
                                    },
                                    {
                                        id: 'option_2',
                                        name: 'Option 2'
                                    }
                                ],
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null,
                                endpoint: null,
                                requestHeaders: null
                            }
                        ]
                    }
                }
            ],
            outcomes: [],
            javascriptEvents: [],
            className: '',
            style: '',
            customFieldTemplates: {},
            metadata: {},
            variables: [
                {
                    id: 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
                    name: 'name1',
                    type: 'string',
                    value: ''
                },
                {
                    id: '3ed9f28a-dbae-463f-b991-47ef06658bb6',
                    name: 'name2',
                    type: 'string',
                    value: ''
                },
                {
                    id: 'a7710978-1e9c-4b54-a19c-c6267d2b19a2',
                    name: 'input02',
                    type: 'integer'
                }
            ],
            customFieldsValueInfo: {},
            gridsterForm: false,
            globalDateFormat: 'D-M-YYYY'
        }
    };

    formDefinition: any = {
        formRepresentation: {
            id: 3003,
            name: 'demo-01',
            taskId: '7501',
            taskName: 'Demo Form 01',
            tabs: [
                {
                    id: 'tab1',
                    title: 'Text',
                    visibilityCondition: null
                },
                {
                    id: 'tab2',
                    title: 'Misc',
                    visibilityCondition: null
                }
            ],
            fields: [
                {
                    fieldType: 'ContainerRepresentation',
                    id: '1488274019966',
                    name: 'Label',
                    type: 'container',
                    value: null,
                    required: false,
                    readOnly: false,
                    overrideId: false,
                    colspan: 1,
                    placeholder: null,
                    minLength: 0,
                    maxLength: 0,
                    minValue: null,
                    maxValue: null,
                    regexPattern: null,
                    optionType: null,
                    hasEmptyValue: null,
                    options: null,
                    restUrl: null,
                    restResponsePath: null,
                    restIdProperty: null,
                    restLabelProperty: null,
                    tab: null,
                    className: null,
                    dateDisplayFormat: null,
                    layout: null,
                    sizeX: 2,
                    sizeY: 1,
                    row: -1,
                    col: -1,
                    visibilityCondition: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [],
                        2: []
                    }
                },
                {
                    fieldType: 'ContainerRepresentation',
                    id: 'section4',
                    name: 'Section 4',
                    type: 'group',
                    value: null,
                    required: false,
                    readOnly: false,
                    overrideId: false,
                    colspan: 1,
                    placeholder: null,
                    minLength: 0,
                    maxLength: 0,
                    minValue: null,
                    maxValue: null,
                    regexPattern: null,
                    optionType: null,
                    hasEmptyValue: null,
                    options: null,
                    restUrl: null,
                    restResponsePath: null,
                    restIdProperty: null,
                    restLabelProperty: null,
                    tab: 'tab2',
                    className: null,
                    dateDisplayFormat: null,
                    layout: {
                        row: -1,
                        column: -1,
                        colspan: 2
                    },
                    sizeX: 2,
                    sizeY: 1,
                    row: -1,
                    col: -1,
                    visibilityCondition: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label8',
                                name: 'Label8',
                                type: 'people',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab2',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label13',
                                name: 'Label13',
                                type: 'functional-group',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab2',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label18',
                                name: 'Label18',
                                type: 'readonly',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab2',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label19',
                                name: 'Label19',
                                type: 'readonly-text',
                                value: 'Display text as part of the form',
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab2',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            }
                        ],
                        2: [
                            {
                                fieldType: 'HyperlinkRepresentation',
                                id: 'label15',
                                name: 'Label15',
                                type: 'hyperlink',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab2',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null,
                                hyperlinkUrl: 'www.google.com',
                                displayText: null
                            },
                            {
                                fieldType: 'AttachFileFieldRepresentation',
                                id: 'label16',
                                name: 'Label16',
                                type: 'upload',
                                value: [],
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab2',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1,
                                    fileSource: {
                                        serviceId: 'all-file-sources',
                                        name: 'All file sources'
                                    }
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null,
                                metaDataColumnDefinitions: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label17',
                                name: 'Label17',
                                type: 'select-folder',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab2',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1,
                                    folderSource: {
                                        serviceId: 'alfresco-1',
                                        name: 'Alfresco 5.2 Local',
                                        metaDataAllowed: true
                                    }
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            }
                        ]
                    }
                },
                {
                    fieldType: 'DynamicTableRepresentation',
                    id: 'label14',
                    name: 'Label14',
                    type: 'dynamic-table',
                    value: null,
                    required: false,
                    readOnly: false,
                    overrideId: false,
                    colspan: 1,
                    placeholder: null,
                    minLength: 0,
                    maxLength: 0,
                    minValue: null,
                    maxValue: null,
                    regexPattern: null,
                    optionType: null,
                    hasEmptyValue: null,
                    options: null,
                    restUrl: null,
                    restResponsePath: null,
                    restIdProperty: null,
                    restLabelProperty: null,
                    tab: 'tab2',
                    className: null,
                    params: {
                        existingColspan: 1,
                        maxColspan: 1
                    },
                    dateDisplayFormat: null,
                    layout: {
                        row: -1,
                        column: -1,
                        colspan: 2
                    },
                    sizeX: 2,
                    sizeY: 2,
                    row: -1,
                    col: -1,
                    visibilityCondition: null,
                    columnDefinitions: [
                        {
                            id: 'id',
                            name: 'id',
                            type: 'String',
                            value: null,
                            optionType: null,
                            options: null,
                            restResponsePath: null,
                            restUrl: null,
                            restIdProperty: null,
                            restLabelProperty: null,
                            amountCurrency: null,
                            amountEnableFractions: false,
                            required: true,
                            editable: true,
                            sortable: true,
                            visible: true,
                            endpoint: null,
                            requestHeaders: null
                        },
                        {
                            id: 'name',
                            name: 'name',
                            type: 'String',
                            value: null,
                            optionType: null,
                            options: null,
                            restResponsePath: null,
                            restUrl: null,
                            restIdProperty: null,
                            restLabelProperty: null,
                            amountCurrency: null,
                            amountEnableFractions: false,
                            required: true,
                            editable: true,
                            sortable: true,
                            visible: true,
                            endpoint: null,
                            requestHeaders: null
                        }
                    ]
                },
                {
                    fieldType: 'ContainerRepresentation',
                    id: 'section1',
                    name: 'Section 1',
                    type: 'group',
                    value: null,
                    required: false,
                    readOnly: false,
                    overrideId: false,
                    colspan: 1,
                    placeholder: null,
                    minLength: 0,
                    maxLength: 0,
                    minValue: null,
                    maxValue: null,
                    regexPattern: null,
                    optionType: null,
                    hasEmptyValue: null,
                    options: null,
                    restUrl: null,
                    restResponsePath: null,
                    restIdProperty: null,
                    restLabelProperty: null,
                    tab: 'tab1',
                    className: null,
                    dateDisplayFormat: null,
                    layout: {
                        row: -1,
                        column: -1,
                        colspan: 2
                    },
                    sizeX: 2,
                    sizeY: 1,
                    row: -1,
                    col: -1,
                    visibilityCondition: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label1',
                                name: 'Label1',
                                type: 'text',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label3',
                                name: 'Label3',
                                type: 'text',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            }
                        ],
                        2: [
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label2',
                                name: 'Label2',
                                type: 'multi-line-text',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 2,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            }
                        ]
                    }
                },
                {
                    fieldType: 'ContainerRepresentation',
                    id: 'section2',
                    name: 'Section 2',
                    type: 'group',
                    value: null,
                    required: false,
                    readOnly: false,
                    overrideId: false,
                    colspan: 1,
                    placeholder: null,
                    minLength: 0,
                    maxLength: 0,
                    minValue: null,
                    maxValue: null,
                    regexPattern: null,
                    optionType: null,
                    hasEmptyValue: null,
                    options: null,
                    restUrl: null,
                    restResponsePath: null,
                    restIdProperty: null,
                    restLabelProperty: null,
                    tab: 'tab1',
                    className: null,
                    dateDisplayFormat: null,
                    layout: {
                        row: -1,
                        column: -1,
                        colspan: 2
                    },
                    sizeX: 2,
                    sizeY: 1,
                    row: -1,
                    col: -1,
                    visibilityCondition: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label4',
                                name: 'Label4',
                                type: 'integer',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label7',
                                name: 'Label7',
                                type: 'date',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            }
                        ],
                        2: [
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label5',
                                name: 'Label5',
                                type: 'boolean',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'FormFieldRepresentation',
                                id: 'label6',
                                name: 'Label6',
                                type: 'boolean',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null
                            },
                            {
                                fieldType: 'AmountFieldRepresentation',
                                id: 'label11',
                                name: 'Label11',
                                type: 'amount',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: '10',
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null,
                                enableFractions: false,
                                currency: null
                            }
                        ]
                    }
                },
                {
                    fieldType: 'ContainerRepresentation',
                    id: 'section3',
                    name: 'Section 3',
                    type: 'group',
                    value: null,
                    required: false,
                    readOnly: false,
                    overrideId: false,
                    colspan: 1,
                    placeholder: null,
                    minLength: 0,
                    maxLength: 0,
                    minValue: null,
                    maxValue: null,
                    regexPattern: null,
                    optionType: null,
                    hasEmptyValue: null,
                    options: null,
                    restUrl: null,
                    restResponsePath: null,
                    restIdProperty: null,
                    restLabelProperty: null,
                    tab: 'tab1',
                    className: null,
                    dateDisplayFormat: null,
                    layout: {
                        row: -1,
                        column: -1,
                        colspan: 2
                    },
                    sizeX: 2,
                    sizeY: 1,
                    row: -1,
                    col: -1,
                    visibilityCondition: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                fieldType: 'RestFieldRepresentation',
                                id: 'label9',
                                name: 'Label9',
                                type: 'dropdown',
                                value: 'Choose one...',
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: true,
                                options: [
                                    {
                                        id: 'empty',
                                        name: 'Choose one...'
                                    }
                                ],
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null,
                                endpoint: null,
                                requestHeaders: null
                            },
                            {
                                fieldType: 'RestFieldRepresentation',
                                id: 'label12',
                                name: 'Label12',
                                type: 'radio-buttons',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: [
                                    {
                                        id: 'option_1',
                                        name: 'Option 1'
                                    },
                                    {
                                        id: 'option_2',
                                        name: 'Option 2'
                                    }
                                ],
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null,
                                endpoint: null,
                                requestHeaders: null
                            }
                        ],
                        2: [
                            {
                                fieldType: 'RestFieldRepresentation',
                                id: 'label10',
                                name: 'Label10',
                                type: 'typeahead',
                                value: null,
                                required: false,
                                readOnly: false,
                                overrideId: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                minValue: null,
                                maxValue: null,
                                regexPattern: null,
                                optionType: null,
                                hasEmptyValue: null,
                                options: null,
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                tab: 'tab1',
                                className: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 1
                                },
                                dateDisplayFormat: null,
                                layout: {
                                    row: -1,
                                    column: -1,
                                    colspan: 1
                                },
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                visibilityCondition: null,
                                endpoint: null,
                                requestHeaders: null
                            }
                        ]
                    }
                }
            ],
            outcomes: [],
            javascriptEvents: [],
            className: '',
            style: '',
            customFieldTemplates: {},
            metadata: {},
            variables: [
                {
                    id: 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
                    name: 'name1',
                    type: 'string',
                    value: ''
                },
                {
                    id: '3ed9f28a-dbae-463f-b991-47ef06658bb6',
                    name: 'name2',
                    type: 'string',
                    value: ''
                },
                {
                    id: 'a7710978-1e9c-4b54-a19c-c6267d2b19a2',
                    name: 'input02',
                    type: 'integer'
                }
            ],
            gridsterForm: false,
            globalDateFormat: 'D-M-YYYY'
        }
    };

    simpleFormDefinition: any = {
        formRepresentation: {
            id: 1001,
            name: 'SIMPLE_FORM_EXAMPLE',
            description: '',
            version: 1,
            lastUpdatedBy: 2,
            lastUpdatedByFullName: 'Test01 01Test',
            lastUpdated: '2018-02-26T17:44:04.543+0000',
            stencilSetId: 0,
            referenceId: null,
            taskId: '9999',
            formDefinition: {
                tabs: [],
                fields: [
                    {
                        fieldType: 'ContainerRepresentation',
                        id: '1519666726245',
                        name: 'Label',
                        type: 'container',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        minValue: null,
                        maxValue: null,
                        regexPattern: null,
                        optionType: null,
                        hasEmptyValue: null,
                        options: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        tab: null,
                        className: null,
                        dateDisplayFormat: null,
                        layout: null,
                        sizeX: 2,
                        sizeY: 1,
                        row: -1,
                        col: -1,
                        visibilityCondition: null,
                        numberOfColumns: 2,
                        fields: {
                            1: [
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'typeaheadField',
                                    name: 'TypeaheadField',
                                    type: 'typeahead',
                                    value: null,
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: null,
                                    options: null,
                                    restUrl: 'https://jsonplaceholder.typicode.com/users',
                                    restResponsePath: null,
                                    restIdProperty: 'id',
                                    restLabelProperty: 'name',
                                    tab: null,
                                    className: null,
                                    params: {
                                        existingColspan: 1,
                                        maxColspan: 2
                                    },
                                    dateDisplayFormat: null,
                                    layout: {
                                        row: -1,
                                        column: -1,
                                        colspan: 1
                                    },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    requestHeaders: null
                                }
                            ],
                            2: [
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'radioButton',
                                    name: 'RadioButtons',
                                    type: 'radio-buttons',
                                    value: null,
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: null,
                                    hasEmptyValue: null,
                                    options: [
                                        {
                                            id: 'option_1',
                                            name: 'Option 1'
                                        },
                                        {
                                            id: 'option_2',
                                            name: 'Option 2'
                                        },
                                        {
                                            id: 'option_3',
                                            name: 'Option 3'
                                        }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: {
                                        existingColspan: 1,
                                        maxColspan: 1
                                    },
                                    dateDisplayFormat: null,
                                    layout: {
                                        row: -1,
                                        column: -1,
                                        colspan: 1
                                    },
                                    sizeX: 1,
                                    sizeY: 2,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    requestHeaders: null
                                }
                            ]
                        }
                    },
                    {
                        fieldType: 'ContainerRepresentation',
                        id: '1519666735185',
                        name: 'Label',
                        type: 'container',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        minValue: null,
                        maxValue: null,
                        regexPattern: null,
                        optionType: null,
                        hasEmptyValue: null,
                        options: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        tab: null,
                        className: null,
                        dateDisplayFormat: null,
                        layout: null,
                        sizeX: 2,
                        sizeY: 1,
                        row: -1,
                        col: -1,
                        visibilityCondition: null,
                        numberOfColumns: 2,
                        fields: {
                            1: [
                                {
                                    fieldType: 'RestFieldRepresentation',
                                    id: 'selectBox',
                                    name: 'SelectBox',
                                    type: 'dropdown',
                                    value: 'Choose one...',
                                    required: false,
                                    readOnly: false,
                                    overrideId: false,
                                    colspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    minValue: null,
                                    maxValue: null,
                                    regexPattern: null,
                                    optionType: 'manual',
                                    hasEmptyValue: true,
                                    options: [
                                        {
                                            id: 'empty',
                                            name: 'Choose one...'
                                        },
                                        {
                                            id: 'option_1',
                                            name: '1'
                                        },
                                        {
                                            id: 'option_2',
                                            name: '2'
                                        },
                                        {
                                            id: 'option_3',
                                            name: '3'
                                        }
                                    ],
                                    restUrl: null,
                                    restResponsePath: null,
                                    restIdProperty: null,
                                    restLabelProperty: null,
                                    tab: null,
                                    className: null,
                                    params: {
                                        existingColspan: 1,
                                        maxColspan: 2
                                    },
                                    dateDisplayFormat: null,
                                    layout: {
                                        row: -1,
                                        column: -1,
                                        colspan: 1
                                    },
                                    sizeX: 1,
                                    sizeY: 1,
                                    row: -1,
                                    col: -1,
                                    visibilityCondition: null,
                                    endpoint: null,
                                    requestHeaders: null
                                }
                            ],
                            2: []
                        }
                    }
                ],
                outcomes: [],
                javascriptEvents: [],
                className: '',
                style: '',
                customFieldTemplates: {},
                metadata: {},
                variables: [
                    {
                        id: 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
                        name: 'name1',
                        type: 'string',
                        value: ''
                    },
                    {
                        id: '3ed9f28a-dbae-463f-b991-47ef06658bb6',
                        name: 'name2',
                        type: 'string',
                        value: ''
                    },
                    {
                        id: 'a7710978-1e9c-4b54-a19c-c6267d2b19a2',
                        name: 'input02',
                        type: 'integer'
                    }
                ],
                customFieldsValueInfo: {},
                gridsterForm: false
            }
        }
    };

    cloudFormDefinition: any = {
        "formRepresentation": {
            "id": "form-747e3681-119d-4807-831b-259058e91f4b",
            "name": "bh-ch-overtime-nonstandard",
            "description": "",
            "version": 0,
            "standAlone": true,
            "compactFields": true,
            "formDefinition": {
                "tabs": [],
                "fields": [{
                    "id": "Formnameheader",
                    "name": "BH Overtime Application",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 2,
                    "fields": {
                        "1": [{
                            "id": "requestId",
                            "name": "Request ID",
                            "type": "text",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0i1dat",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }],
                        "2": [{
                            "id": "workflowstate",
                            "name": "Workflow State",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue06gi1p",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }]
                    }
                }, {
                    "id": "requestorheader",
                    "name": "Requestor Details",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 2,
                    "fields": {
                        "1": [{
                            "id": "emprequestorname",
                            "name": "Requestor",
                            "type": "text",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "required": true,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0aobe5",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "emprequestorsso",
                            "name": "Requestor SSO",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0w7udn",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "requestorphone",
                            "name": "Requestor Phone",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0nfps2",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "empreqbusinessname",
                            "name": "Business Name",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0596x0",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "empreqbusinesssegment",
                            "name": "Business Segment",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0nom7m",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "empreqleid",
                            "name": "Legal Entity ID",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0o23nc",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "empreqmgrname",
                            "name": "Manager Name",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0jxdad",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "requestorcountry",
                            "name": "Requestor Country",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0byh35",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }],
                        "2": [{
                            "id": "emprequestorid",
                            "name": "Requestor ID",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0swup0",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "emprequestorwdid",
                            "name": "Requestor Workday ID",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0drucu",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "empreqdeptname",
                            "name": "Department Name",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0w9zp9",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "empreqifg",
                            "name": "Industry Focus Group",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0s017q",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "empreqlename",
                            "name": "Legal Entity Name",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue08ui5t",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "empreqlocation",
                            "name": "Location",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0wsuyd",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "empreqmgrsso",
                            "name": "Manager SSO",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue0705s1",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }, {
                            "id": "requestorregion",
                            "name": "Request Region",
                            "type": "readonly",
                            "value": "No field selected",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "field": {
                                    "id": "Displayvalue06u4jq",
                                    "name": "Display value",
                                    "type": "text"
                                },
                                "responseVariable": true
                            }
                        }]
                    }
                }, {
                    "id": "heading1",
                    "name": "Section Heading",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "information1",
                            "name": "Display text1",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "请阅读以下内容，确保您能够正确提交并通过加班申请：\nPls read below content to ensure your application can be submitted and approved correctly.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information2",
                            "name": "Display text2",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "1. 根据规定：实行标准工时制的员工工作日加班, 每天不超过3小时, 每月不超过36小时; 实行不定时工时制的员工, 不适用标准工时的加班规定，当地另有规定的，按当地规定执行。/According to the regulation: OT hours for employees under standard working hours system cannot exceed 3 hours per day and 36 hours per month. Employees under non-fixed working hours system are not eligible for such regulation. The OT payment will be calculated according to the local policy if any.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information3",
                            "name": "Display text3",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "2. 所有支付报酬的加班都必须获得预先批准。/ All the OT hours with compensation have to be approved in advance",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information4",
                            "name": "Display text4",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "3. 请确保您勾选的加班发生月份与加班日期的月份一致。/ Please ensure the OT month and the month of the Date are consistent.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information5",
                            "name": "Display text5",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "4. 如同一个月中您有多条加班记录，请在同一个Workflow中递交。如分批递交，系统将自动拒绝该月的第二次申请。/ If you have more than one OT records in the same month, please apply all the OT happened in one OT Workflow. Otherwise, system will reject the second application for this month automatically.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information6",
                            "name": "Display text6",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "5.请正确选择自己所适用的工时制度，如需确认自己适用的工时制度，可联系您的HR经理或相关HR同事，您也可查询您所签订的劳动合同中的相关内容。/Please select the correct Working Hours System. If you are not sure about the working hour system you apply to, you could either contact your HR Manager or related HR colleagues, or go through your labor contract for check.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information7",
                            "name": "Display text7",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "6. 如果您申请的加班时间中包含用餐时间，请将用餐时间在加班时间扣除。/ Please exclude the meal time when you apply for the OT hours.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information8",
                            "name": "Display text8",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "7. 请每月10日前查看您的加班申请并提醒您的经理及时批准，每月10日前批准的申请将于当月结算。/ Please track the status of your OT application and remind your manager to approve it in time. The OT will be calculated in the current month if you get the approval before the 10th of the month.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information9",
                            "name": "Display text9",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "8. 所有在当月10号之后确认并被批准的加班将被计算在下个月的工资中。/ All confirmed and approved OT submission after 10th of the month will be calculated in the next month payroll.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information10",
                            "name": "Display text10",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "9. 如果业务部门另有规定的流程,请执行业务部门的流程。/ If business has its own process and application form, please follow business’ working procedure.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information11",
                            "name": "Display text11",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "10. 现场支持人员的工时津贴申请不适用于此工作表，请按业务部门规定的流程提交申请。/ The field service/site allowance is not eligible for this workflow . Please apply for the special service allowance according to the process of your business.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "acknowledgmentforcontent",
                            "name": "我已仔细阅读并确认以上内容 / I have read and acknowleged the content above",
                            "type": "boolean",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "information12",
                            "name": "Display text12",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "***OTWF使用指南，请登陆员工福利网站 https://employeeportal.gechina.ge.com  >>员工工具箱  >> 加班申请。/ Please find the Overtime Workflow User Guide in China Employee Portal (link: https://employeeportal.gechina.ge.com) >> Employee Toolkit  >> Overtime Application.",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }]
                    }
                }, {
                    "id": "heading2",
                    "name": "Overtime Information Template",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "otyear",
                            "name": "加班发生年份 / OT Year",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "2018",
                                "name": "2018"
                            }, {
                                "id": "2019",
                                "name": "2019"
                            }, {
                                "id": "2020",
                                "name": "2020"
                            }, {
                                "id": "2021",
                                "name": "2021"
                            }, {
                                "id": "2022",
                                "name": "2022"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "otmonth",
                            "name": "加班发生月份 / OT Month",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "January",
                                "name": "January"
                            }, {
                                "id": "February",
                                "name": "February"
                            }, {
                                "id": "March",
                                "name": "March"
                            }, {
                                "id": "April",
                                "name": "April"
                            }, {
                                "id": "May",
                                "name": "May"
                            }, {
                                "id": "June",
                                "name": "June"
                            }, {
                                "id": "July",
                                "name": "July"
                            }, {
                                "id": "August",
                                "name": "August"
                            }, {
                                "id": "September",
                                "name": "September"
                            }, {
                                "id": "October",
                                "name": "October"
                            }, {
                                "id": "November",
                                "name": "November"
                            }, {
                                "id": "December",
                                "name": "December"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "people1",
                            "name": "请输入您的SSO / Input Your SSO ID",
                            "type": "people",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "single",
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "workinghourssystem",
                            "name": "适用的工时制度 / Working Hours System",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "swh",
                                "name": "标准工时制/Standard Working hours"
                            }, {
                                "id": "nswh",
                                "name": "Non-fixed Working Hours System不定时工作制"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "information13",
                            "name": "Display text13",
                            "type": "readonly-text",
                            "readOnly": false,
                            "value": "当天加班至隔天凌晨者，请在当日加班结束时间选择12:00 AM，并另外点击Add Row功能增加隔天加班小时数。",
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }]
                    }
                }, {
                    "id": "heading4",
                    "name": "OT Form-不定时",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phnumberofrows",
                            "name": "Number of Days",
                            "type": "integer",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minValue": null,
                            "maxValue": 30,
                            "required": true,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "workinghourssystem",
                                "operator": "==",
                                "rightValue": "nswh",
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "value": 1
                        }]
                    },
                    "visibilityCondition": {
                        "leftType": "field",
                        "leftValue": "workinghourssystem",
                        "operator": "==",
                        "rightValue": "nswh",
                        "rightType": "value",
                        "nextConditionOperator": "",
                        "nextCondition": null
                    }
                }, {
                    "id": "Header0491fl",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 4,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox1",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 1,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown1",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 1,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate1",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 1,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason1",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 1,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate1",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 1,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours1",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 1,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate1",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 1,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0awat1",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox2",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 2,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown2",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 2,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate2",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 2,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason2",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 2,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate2",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 2,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours2",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 2,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate2",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 2,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0jbqj2",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox3",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 3,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown3",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 3,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate3",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 3,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason3",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 3,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate3",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 3,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours3",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 3,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate3",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 3,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header08znyg",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox4",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 4,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown4",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 4,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate4",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 4,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason4",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 4,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate4",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 4,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours4",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 4,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate4",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 4,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0bztva",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox5",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 5,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown5",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 5,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate5",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 5,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason5",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 5,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate5",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 5,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours5",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 5,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate5",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 5,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0i5p3i",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox6",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 6,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown6",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 6,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate6",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 6,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason6",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 6,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate6",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 6,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours6",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 6,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate6",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 6,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header052whh",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox7",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 7,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown7",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 7,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate7",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 7,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason7",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 7,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate7",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 7,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours7",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 7,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate7",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 7,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0tj71t",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox8",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 8,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown8",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 8,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate8",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 8,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason8",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 8,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate8",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 8,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours8",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 8,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate8",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 8,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header02nph3",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox9",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 9,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown9",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 9,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate9",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 9,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason9",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 9,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate9",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 9,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours9",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 9,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate9",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 9,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0mol5f",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox10",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 10,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown10",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 10,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate10",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 10,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason10",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 10,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate10",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 10,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours10",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 10,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate10",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 10,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0p0qpz",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox11",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 11,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown11",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 11,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate11",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 11,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason11",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 11,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate11",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 11,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours11",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 11,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate11",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 11,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0piatr",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox12",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 12,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown12",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 12,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate12",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 12,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason12",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 12,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate12",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 12,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours12",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 12,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate12",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 12,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0ynk43",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox13",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 13,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown13",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 13,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate13",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 13,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason13",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 13,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate13",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 13,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours13",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 13,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate13",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 13,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header03gm1w",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox14",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 14,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown14",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 14,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate14",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 14,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason14",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 14,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate14",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 14,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours14",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 14,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate14",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 14,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0zeu4g",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox15",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 15,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown15",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 15,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate15",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 15,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason15",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 15,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate15",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 15,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours15",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 15,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate15",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 15,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header01ls99",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox16",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 16,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown16",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 16,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate16",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 16,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason16",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 16,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate16",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 16,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours16",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 16,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate16",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 16,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0xsqpa",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox17",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 17,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown17",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 17,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate17",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 17,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason17",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 17,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate17",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 17,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours17",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 17,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate17",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 17,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0fghto",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox18",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 18,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown18",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 18,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate18",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 18,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason18",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 18,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate18",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 18,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours18",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 18,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate18",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 18,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header0z2oic",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox19",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 19,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown19",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 19,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate19",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 19,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason19",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 19,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate19",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 19,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours19",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 19,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate19",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 19,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "Header00qiew",
                    "name": "",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "phcheckbox20",
                            "name": "",
                            "type": "boolean",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 20,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "bhdropdown20",
                            "name": "节假日 Public Holiday",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "manual",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }, {
                                "id": "ph",
                                "name": "国定假日/Public Holiday"
                            }],
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 20,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }],
                        "2": [{
                            "id": "phdate20",
                            "name": "加班日期 Date",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdown",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 20,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phreason20",
                            "name": "加班原因 Reason",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 20,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "3": [{
                            "id": "phstartdate20",
                            "name": "起始时间 Start Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownstart",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 20,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }, {
                            "id": "phappliedothours20",
                            "name": "加班时长 Applied OT Hours",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 20,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }],
                        "4": [{
                            "id": "phenddate20",
                            "name": "结束时间 End Time",
                            "type": "dropdown",
                            "readOnly": false,
                            "required": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "rest",
                            "options": [{
                                "id": "empty",
                                "name": "Choose one..."
                            }],
                            "restUrl": "https://bhqmsdev.alfrescocloud.com/alfresco/s/ext/bakerhughes/testdropdownend",
                            "restResponsePath": null,
                            "restIdProperty": "id",
                            "restLabelProperty": "name",
                            "selectionType": "single",
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "phnumberofrows",
                                "operator": ">=",
                                "rightValue": 20,
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "rule": null
                        }]
                    }
                }, {
                    "id": "d7f6831e-cdf1-4fb4-9d27-04aa8016d19a",
                    "name": "Label",
                    "type": "container",
                    "tab": null,
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "othersupportingdocuments",
                            "name": "支持性文件/ Other supporting document:",
                            "type": "upload",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2,
                                "fileSource": {
                                    "name": "Alfresco Content",
                                    "serviceId": "alfresco-content"
                                },
                                "multiple": false,
                                "link": false,
                                "menuOptions": {
                                    "show": true,
                                    "download": true,
                                    "retrieveMetadata": false,
                                    "remove": false
                                },
                                "displayableCMProperties": []
                            }
                        }]
                    }
                }, {
                    "id": "totalovertimepreapprove",
                    "name": "Total Overtime(Pre-approve)",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "totalweekdayothourspreapprove",
                            "name": "平日加班小时数-预申请 / Total Weekday OT Hours(标准)-Pre:",
                            "type": "text",
                            "readOnly": true,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "workinghourssystem",
                                "operator": "==",
                                "rightValue": "swh",
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "totalweekendothourspreapprove",
                            "name": "周末加班小时数-预申请 / Total Weekend OT Hours(标准)-Pre:",
                            "type": "text",
                            "readOnly": true,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "workinghourssystem",
                                "operator": "==",
                                "rightValue": "swh",
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "totalphothourspreapprove",
                            "name": "国定假期加班小时数-预申请 / Total Public Holiday OT Hours(标准)-Pre:",
                            "type": "text",
                            "readOnly": true,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }, {
                            "id": "totalothourspreapprove",
                            "name": "加班总小时数-预申请 / Total OT Hours(标准)-Pre:",
                            "type": "text",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "visibilityCondition": {
                                "leftType": "field",
                                "leftValue": "workinghourssystem",
                                "operator": "==",
                                "rightValue": "swh",
                                "rightType": "value",
                                "nextConditionOperator": "",
                                "nextCondition": null
                            },
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }]
                    }
                }, {
                    "id": "b0787f35-ee48-4dbb-a4da-ca4af0b81e52",
                    "name": "Label",
                    "type": "container",
                    "tab": null,
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "ccthisrequestto",
                            "name": "CC this request to",
                            "type": "people",
                            "readOnly": false,
                            "required": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "optionType": "single",
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }]
                    }
                }, {
                    "id": "commenthistory",
                    "name": "Comment History",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "commentHistorymtext",
                            "name": "",
                            "type": "multi-line-text",
                            "readOnly": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "required": false,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }]
                    }
                }, {
                    "id": "d274b063-eb5f-4fae-bc3f-765fdf7e1554",
                    "name": "Label",
                    "type": "container",
                    "tab": null,
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "addcomments",
                            "name": "Add Comments",
                            "type": "multi-line-text",
                            "readOnly": false,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "required": false,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }]
                    }
                }, {
                    "id": "audittrail",
                    "name": "Audit trail",
                    "type": "group",
                    "tab": null,
                    "params": {
                        "allowCollapse": false,
                        "collapseByDefault": false
                    },
                    "numberOfColumns": 1,
                    "fields": {
                        "1": [{
                            "id": "audittrailsummary",
                            "name": "",
                            "type": "multi-line-text",
                            "readOnly": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "regexPattern": null,
                            "required": false,
                            "visibilityCondition": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            }
                        }]
                    }
                }],
                "outcomes": [],
                "metadata": {},
                "variables": []
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
