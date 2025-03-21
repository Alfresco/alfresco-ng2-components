/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export const startFormDateWidgetMock = {
    id: 4,
    name: 'Claim Review Process',
    processDefinitionId: 'ClaimReviewProcess:2: 93',
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953253784,
            name: 'Label',
            type: 'container',
            value: null,
            readOnly: false,
            fields: {
                1: [{
                        fieldType: 'FormFieldRepresentation',
                        id: 'date',
                        name: 'date',
                        type: 'date',
                        value: null
                    }]}
        }]
};

export const startFormNumberWidgetMock = {
    id: 4,
    name: 'Claim Review Process',
    processDefinitionId: 'ClaimReviewProcess:2: 93',
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953253784,
            name: 'Label',
            type: 'container',
            value: null,
            readOnly: false,
            fields: {
                1: [{
                        fieldType: 'FormFieldRepresentation',
                        id: 'number',
                        name: 'number widget',
                        type: 'integer',
                        value: null
                    }]}
        }]
};

export const startFormAmountWidgetMock = {
    id: 4,
    name: 'Claim Review Process',
    processDefinitionId: 'ClaimReviewProcess:2: 93',
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953253784,
            name: 'Label',
            type: 'container',
            value: null,
            readOnly: false,
            fields: {
                1: [{
                        fieldType: 'FormFieldRepresentation',
                        id: 'amount',
                        name: 'amount widget',
                        type: 'amount',
                        value: null
                    }]}
        }]
};

export const startFormRadioButtonWidgetMock = {
    id: 4,
    name: 'Claim Review Process',
    processDefinitionId: 'ClaimReviewProcess:2: 93',
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953253784,
            name: 'Label',
            type: 'container',
            value: null,
            readOnly: false,
            fields: {
                1: [{
                        fieldType: 'RestFieldRepresentation',
                        id: 'radio-but',
                        name: 'radio-buttons',
                        type: 'radio-buttons',
                        value: null
                    }]}
        }]
};

export const startFormTextDefinitionMock = {
    id: 4,
    name: 'Claim Review Process',
    processDefinitionId: 'ClaimReviewProcess:2: 93',
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953253784,
            name: 'Label',
            type: 'container',
            value: null,
            readOnly: false,
            fields: {
                1: [{
                        fieldType: 'FormFieldRepresentation',
                        id: 'mocktext',
                        name: 'mockText',
                        type: 'text',
                        value: null
                    }]}
        }]
};

export const startFormDropdownDefinitionMock = {
    id: 4,
    name: 'Claim Review Process',
    processDefinitionId: 'ClaimReviewProcess:2: 93',
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953253784,
            name: 'Label',
            type: 'container',
            value: null,
            readOnly: false,
            fields: {
                1: [{

                        fieldType: 'RestFieldRepresentation',
                        id: 'mockTypeDropDown',
                        name: 'mock DropDown',
                        type: 'dropdown',
                        value: 'Choose one...',
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        options: [
                            {
                                id: 'empty',
                                name: 'Choose one...'
                            },
                            {
                                id: 'opt1',
                                name: 'Option-1'
                            },
                            {
                                id: 'opt2',
                                name: 'Option-2'
                            },
                            {
                                id: 'opt3',
                                name: 'Option-3'
                            },
                            {
                                id: 'opt2',
                                name: 'Option-3'
                            }
                        ]
                    }]}
        }]
};

export const startMockForm = {
    id: 4,
    name: 'Claim Review Process',
    processDefinitionId: 'ClaimReviewProcess:2: 93',
    processDefinitionName: 'ClaimReviewProcess',
    processDefinitionKey: 'ClaimReviewProcess',
    tabs: [],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953253784,
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
                        fieldType: 'FormFieldRepresentation',
                        id: 'clientname',
                        name: 'ClientName',
                        type: 'text',
                        value: null,
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
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'policyno',
                        name: 'PolicyNo',
                        type: 'integer',
                        value: null,
                        required: true,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: 'EnterPolicyName',
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
        },
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953270269,
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
                        fieldType: 'FormFieldRepresentation',
                        id: 'billAmount',
                        name: 'BillAmount',
                        type: 'integer',
                        value: null,
                        required: true,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: 'EnterBillAmount',
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
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'billdate',
                        name: 'BillDate',
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
                        tab: null,
                        className: 'billdate',
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
        },
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953280930,
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
                        id: 'claimtype',
                        name: 'ClaimType',
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
                                id: 'cashless',
                                name: 'Cashless'
                            },
                            {
                                id: 'reimbursement',
                                name: 'Reimbursement'
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
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'hospitalName',
                        name: 'HospitalName',
                        type: 'text',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: 'EnterHospitalName',
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
    outcomes: [
        {
            id: 'approve',
            name: 'Approve'
        },
        {
            id: 'complete',
            name: 'Complete'
        },
        {
            id: 'start_process',
            name: 'Start Process'
        }
    ],
    javascriptEvents: [],
    className: '',
    style: '',
    metadata: {},
    variables: [],
    customFieldsValueInfo: {},
    gridsterForm: false,
    globalDateFormat: 'D - M - YYYY'
};

export const startMockFormWithTab = {
    id: 4,
    taskName: 'Mock Title',
    processDefinitionId: 'ClaimReviewProcess:2: 93',
    processDefinitionName: 'ClaimReviewProcess',
    processDefinitionKey: 'ClaimReviewProcess',
    tabs: [
        {
            id: 'form1',
            name: 'Tab 1'
        },
        {
            id: 'form2',
            name: 'Tab 2'
        }
    ],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953253784,
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
                        fieldType: 'FormFieldRepresentation',
                        id: 'clientname',
                        name: 'ClientName',
                        type: 'text',
                        value: null,
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
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'policyno',
                        name: 'PolicyNo',
                        type: 'integer',
                        value: null,
                        required: true,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: 'EnterPolicyName',
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
        },
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953270269,
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
                        fieldType: 'FormFieldRepresentation',
                        id: 'billAmount',
                        name: 'BillAmount',
                        type: 'integer',
                        value: null,
                        required: true,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: 'EnterBillAmount',
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
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'billdate',
                        name: 'BillDate',
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
                        tab: null,
                        className: 'billdate',
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
        },
        {
            fieldType: 'ContainerRepresentation',
            id: 1497953280930,
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
                        id: 'claimtype',
                        name: 'ClaimType',
                        type: 'dropdown',
                        value: 'Chooseone...',
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
                                name: 'Chooseone...'
                            },
                            {
                                id: 'cashless',
                                name: 'Cashless'
                            },
                            {
                                id: 'reimbursement',
                                name: 'Reimbursement'
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
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'hospitalName',
                        name: 'HospitalName',
                        type: 'text',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: 'EnterHospitalName',
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
    outcomes: [
        {
            id: 'approve',
            name: 'Approve'
        },
        {
            id: 'complete',
            name: 'Complete'
        }
    ],
    javascriptEvents: [],
    className: '',
    style: '',
    metadata: {},
    variables: [],
    customFieldsValueInfo: {},
    gridsterForm: false,
    globalDateFormat: 'D - M - YYYY'
};

export const taskFormSingleUploadMock = {
    id: 4,
    name: 'Translation request',
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    processDefinitionKey: 'TranslationProcess',
    taskId: '91',
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    tabs: [],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: '1582747052793',
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
                        fieldType: 'AttachFileFieldRepresentation',
                        id: 'fake-single-upload',
                        name: 'Attach file - single type',
                        type: 'upload',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2,
                            fileSource: {
                              serviceId: 'all-file-sources',
                              name: 'All file sources'
                            },
                            link: true
                          },
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

export const taskFormMultipleUploadMock = {
    id: 4,
    name: 'Translation request',
    processDefinitionId: 'TranslationProcess:2:8',
    processDefinitionName: 'Translation Process',
    processDefinitionKey: 'TranslationProcess',
    taskId: '91',
    taskDefinitionKey: 'sid-DDECD9E4-0299-433F-9193-C3D905C3EEBE',
    tabs: [],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: '1582747052793',
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
                        fieldType: 'AttachFileFieldRepresentation',
                        id: 'fake-multiple-upload',
                        name: 'Attach file - multiple type',
                        type: 'upload',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2,
                            fileSource: {
                              serviceId: 'all-file-sources',
                              name: 'All file sources'
                            },
                            link: true,
                            multiple: true
                          },
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

export const preselectedSingleNode = {
    'fake-single-upload': [
      {
        id: 1027,
        name: 'fake-file.docx',
        relatedContent: false,
        contentAvailable: true,
        link: true,
        source: 'alfresco-1-adw-contentAlfresco',
        sourceId: '4a440e8f-7fe5-4d83-a042-a19ee10125fb;2.0@',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        simpleType: 'word',
        previewStatus: 'queued',
        thumbnailStatus: 'queued'
      }
    ]
};

export const preselectedMultipleNodes = {
    'fake-multiple-upload': [
      {
        id: 1027,
        name: 'fake-file.docx',
        relatedContent: false,
        contentAvailable: true,
        link: true,
        source: 'alfresco-1-adw-contentAlfresco',
        sourceId: '4a440e8f-7fe5-4d83-a042-a19ee10125fb;2.0@',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        simpleType: 'word',
        previewStatus: 'queued',
        thumbnailStatus: 'queued'
      },
      {
        id: 1028,
        name: 'fake-file2.docx',
        relatedContent: false,
        contentAvailable: true,
        link: true,
        source: 'alfresco-1-adw-contentAlfresco',
        sourceId: '4a440e8f-7fe5-4d83-a042-a19ee10125fb;2.0@',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        simpleType: 'word',
        previewStatus: 'queued',
        thumbnailStatus: 'queued'
      }
    ]
};
