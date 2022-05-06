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
            "id": "form-bd97eb82-493a-4f6d-926a-55fa95c19c51",
            "name": "f1",
            "description": "",
            "version": 0,
            "standAlone": true,
            "compactFields": true,
            "formDefinition": {
                "tabs": [
                    {
                        "id": "b7aaa257-e202-4ce4-87d0-0f87ed50a413",
                        "title": "New Tab",
                        "visibilityCondition": null
                    },
                    {
                        "id": "7a5cc1aa-b62b-4b49-aaf8-57f725d9e6ea",
                        "title": "New Tab",
                        "visibilityCondition": null
                    }
                ],
                "fields": [
                    {
                        "id": "1e653ba3-f7bc-473d-91f1-6713022bd24d",
                        "name": "Label",
                        "type": "container",
                        "tab": "b7aaa257-e202-4ce4-87d0-0f87ed50a413",
                        "numberOfColumns": 2,
                        "fields": {
                            "1": [
                                {
                                    "id": "Text0vrwjf",
                                    "name": "Text",
                                    "type": "text",
                                    "readOnly": false,
                                    "required": true,
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
                                },
                                {
                                    "id": "Number0au8cm4",
                                    "name": "Number4",
                                    "type": "integer",
                                    "readOnly": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "placeholder": null,
                                    "minValue": null,
                                    "maxValue": null,
                                    "required": true,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    }
                                },
                                {
                                    "id": "Number0au8cm3",
                                    "name": "Number3",
                                    "type": "integer",
                                    "readOnly": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "placeholder": null,
                                    "minValue": null,
                                    "maxValue": null,
                                    "required": true,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    }
                                },
                                {
                                    "id": "Number0au8cm2",
                                    "name": "Number2",
                                    "type": "integer",
                                    "readOnly": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "placeholder": null,
                                    "minValue": null,
                                    "maxValue": null,
                                    "required": true,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    }
                                },
                                {
                                    "id": "Number0au8cm1",
                                    "name": "Number1",
                                    "type": "integer",
                                    "readOnly": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "placeholder": null,
                                    "minValue": null,
                                    "maxValue": null,
                                    "required": true,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    }
                                },
                                {
                                    "id": "Date06j610",
                                    "name": "Date",
                                    "type": "date",
                                    "readOnly": false,
                                    "required": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "placeholder": null,
                                    "minValue": null,
                                    "maxValue": null,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    },
                                    "dateDisplayFormat": "YYYY-MM-DD"
                                },
                                {
                                    "id": "Dropdown0rk1ud",
                                    "name": "Dropdown",
                                    "type": "dropdown",
                                    "readOnly": false,
                                    "required": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "optionType": "manual",
                                    "options": [],
                                    "authName": null,
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
                                },
                                {
                                    "id": "Radiobuttons0ixsge",
                                    "name": "Radio buttons",
                                    "type": "radio-buttons",
                                    "readOnly": false,
                                    "required": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "optionType": "manual",
                                    "options": [
                                        {
                                            "id": "Id_1",
                                            "name": "Label 1"
                                        },
                                        {
                                            "id": "Id_2",
                                            "name": "Label 2"
                                        }
                                    ],
                                    "authName": null,
                                    "restUrl": null,
                                    "restResponsePath": null,
                                    "restIdProperty": null,
                                    "restLabelProperty": null,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    }
                                },
                                {
                                    "id": "Attachfile0le6s4",
                                    "name": "Attach file",
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
                                            "remove": true
                                        },
                                        "displayableCMProperties": []
                                    }
                                },
                                {
                                    "id": "Hyperlink081lmk",
                                    "name": "Hyperlink",
                                    "type": "hyperlink",
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "hyperlinkUrl": null,
                                    "displayText": null,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    }
                                },
                                {
                                    "id": "Fileviewer08bizj",
                                    "name": "File viewer",
                                    "type": "file-viewer",
                                    "readOnly": false,
                                    "required": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    }
                                }
                            ],
                            "2": [
                                {
                                    "id": "People027fto",
                                    "name": "People",
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
                                    },
                                    "selectLoggedUser": false
                                },
                                {
                                    "id": "Amount0bflna",
                                    "name": "Amount",
                                    "type": "amount",
                                    "readOnly": false,
                                    "required": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "placeholder": "123",
                                    "minValue": null,
                                    "maxValue": null,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    },
                                    "enableFractions": false,
                                    "currency": "$"
                                },
                                {
                                    "id": "Multilinetext0bwk6t",
                                    "name": "Multiline text",
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
                                },
                                {
                                    "id": "Checkbox04obiv",
                                    "name": "Checkbox",
                                    "type": "boolean",
                                    "readOnly": false,
                                    "required": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    }
                                },
                                {
                                    "id": "Groupofpeople00lqxw",
                                    "name": "Group of people",
                                    "type": "functional-group",
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
                                },
                                {
                                    "id": "Dateandtime0pqokp",
                                    "name": "Date and time",
                                    "type": "datetime",
                                    "readOnly": false,
                                    "required": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "placeholder": null,
                                    "minValue": null,
                                    "maxValue": null,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    },
                                    "dateDisplayFormat": "YYYY-MM-DD HH:mm"
                                },
                                {
                                    "id": "Displaytext0o147e",
                                    "name": "Display text",
                                    "type": "readonly-text",
                                    "readOnly": false,
                                    "value": "Display text as part of the form",
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2
                                    }
                                },
                                {
                                    "id": "Metadataviewer0rqi1s",
                                    "name": "Metadata viewer",
                                    "type": "properties-viewer",
                                    "readOnly": false,
                                    "required": false,
                                    "colspan": 1,
                                    "rowspan": 1,
                                    "visibilityCondition": null,
                                    "params": {
                                        "existingColspan": 1,
                                        "maxColspan": 2,
                                        "propertiesViewerOptions": {
                                            "displayDefaultProperties": true,
                                            "expanded": true,
                                            "preset": "default",
                                            "displayEmpty": false,
                                            "editable": false,
                                            "multi": false,
                                            "displayAspect": null,
                                            "copyToClipboardAction": true,
                                            "useChipsForMultiValueProperty": true
                                        }
                                    }
                                },
                                {
                                    "id": "Displayvalue01ly0f",
                                    "name": "Display value",
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
                                            "id": "Displayvalue01ly0f",
                                            "name": "Display value",
                                            "type": "text"
                                        },
                                        "responseVariable": true
                                    }
                                }
                            ]
                        }
                    }
                ],
                "outcomes": [
                    {
                        "id": "1cfe6797-7c70-4113-b16d-94a776f03451",
                        "name": "New Outcome"
                    },
                    {
                        "id": "a53a0d3a-09c5-495c-919c-4fd1bf942130",
                        "name": "New Outcome"
                    },
                    {
                        "id": "e5eecf9b-e54c-42fe-89bc-dd80593fc369",
                        "name": "New Outcome"
                    }
                ],
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
