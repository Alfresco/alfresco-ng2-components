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

export const formDefVisibilitiFieldDependsOnNextOne: any = {
    id: 19,
    processDefinitionId: 'visibility:1:148',
    processDefinitionName: 'visibility',
    processDefinitionKey: 'visibility',
    tabs: [],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: '1506960847579',
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
                                name: 'france'
                            },
                            {
                                id: 'option_2',
                                name: 'uk'
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
                        visibilityCondition: {
                            leftType: 'field',
                            leftValue: 'name',
                            operator: '==',
                            rightValue: 'italy',
                            rightFormFieldId: '',
                            rightRestResponseId: '',
                            nextConditionOperator: '',
                            nextCondition: null
                        },
                        endpoint: null,
                        requestHeaders: null
                    }
                ],
                '2': [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'name',
                        name: 'name',
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

export const formDefVisibilitiFieldDependsOnPreviousOne: any = {
    id: 19,
    processDefinitionId: 'visibility:1:148',
    processDefinitionName: 'visibility',
    processDefinitionKey: 'visibility',
    tabs: [],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: '1506960847579',
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
                        id: 'name',
                        name: 'name',
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
                ],
                '2': [
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
                                name: 'france'
                            },
                            {
                                id: 'option_2',
                                name: 'uk'
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
                        visibilityCondition: {
                            leftType: 'field',
                            leftValue: 'name',
                            operator: '==',
                            rightValue: 'italy',
                            rightFormFieldId: '',
                            rightRestResponseId: '',
                            nextConditionOperator: '',
                            nextCondition: null
                        },
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
    variables: [],
    customFieldsValueInfo: {},
    gridsterForm: false,
    globalDateFormat: 'D-M-YYYY'
};
