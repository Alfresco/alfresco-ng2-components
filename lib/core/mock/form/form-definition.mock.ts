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

export const formDefinitionTwoTextFields: any = {
    id: 20,
    name: 'formTextDefinition',
    processDefinitionId: 'textDefinition:1:153',
    processDefinitionName: 'textDefinition',
    processDefinitionKey: 'textDefinition',
    taskId: '159',
    taskDefinitionKey: 'sid-D941F49F-2B04-4FBB-9B49-9E95991993E8',
    tabs: [],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: '1507044399260',
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
                '1': [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'firstname',
                        name: 'firstName',
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
                        visibilityCondition: null
                    }
                ],
                '2': [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'lastname',
                        name: 'lastName',
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
                        sizeY: 1,
                        row: -1,
                        col: -1,
                        visibilityCondition: null
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
    variables: [],
    customFieldsValueInfo: {},
    gridsterForm: false,
    globalDateFormat: 'D-M-YYYY'
};

export const formDefinitionDropdownField: any = {
    id: 21,
    name: 'dropdownDefinition',
    processDefinitionId: 'textDefinition:2:163',
    processDefinitionName: 'textDefinition',
    processDefinitionKey: 'textDefinition',
    taskId: '169',
    taskDefinitionKey: 'sid-D941F49F-2B04-4FBB-9B49-9E95991993E8',
    tabs: [],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: '1507046026940',
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
                '1': [
                    {
                        fieldType: 'RestFieldRepresentation',
                        id: 'country',
                        name: 'country',
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
                                name: 'united kingdom'
                            },
                            {
                                id: 'option_2',
                                name: 'italy'
                            },
                            {
                                id: 'option_3',
                                name: 'france'
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
                '2': []
            }
        }
    ],
    outcomes: [],
    javascriptEvents: [],
    className: '',
    style: '',
    customFieldTemplates: {},
    metadata: {},
    variables: [],
    customFieldsValueInfo: {},
    gridsterForm: false,
    globalDateFormat: 'D-M-YYYY'
};

export const formDefinitionRequiredField: any = {
    id: 21,
    name: 'dropdownDefinition',
    processDefinitionId: 'textDefinition:2:163',
    processDefinitionName: 'textDefinition',
    processDefinitionKey: 'textDefinition',
    taskId: '169',
    taskDefinitionKey: 'sid-D941F49F-2B04-4FBB-9B49-9E95991993E8',
    tabs: [],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: '1507046026940',
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
                '1': [
                    {
                        fieldType: 'RestFieldRepresentation',
                        id: 'country',
                        name: 'country',
                        type: 'dropdown',
                        value: 'Choose one...',
                        required: true,
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
                                name: 'united kingdom'
                            },
                            {
                                id: 'option_2',
                                name: 'italy'
                            },
                            {
                                id: 'option_3',
                                name: 'france'
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
                '2': []
            }
        }
    ],
    outcomes: [],
    javascriptEvents: [],
    className: '',
    style: '',
    customFieldTemplates: {},
    metadata: {},
    variables: [],
    customFieldsValueInfo: {},
    gridsterForm: false,
    globalDateFormat: 'D-M-YYYY'
};
