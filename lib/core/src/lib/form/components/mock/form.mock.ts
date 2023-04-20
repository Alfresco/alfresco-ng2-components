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

export const cloudFormMock = {
    id: 'form-b661635a-dc3e-4557-914a-3498ed47189c',
    name: 'form-with-all-fields',
    description: '',
    version: 0,
    tabs: [],
    fields: [
        {
            fieldType: 'ContainerRepresentation',
            id: '26b10e64-0403-4686-a75b-0d45279ce3a8',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'text1',
                        name: 'Text1',
                        type: 'text',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        minValue: null,
                        maxValue: null,
                        regexPattern: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'text2',
                        name: 'Text2',
                        type: 'text',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        minValue: null,
                        maxValue: null,
                        regexPattern: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: '69c1390a-8d8d-423c-8efb-8e43401efa42',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'multilinetext1',
                        name: 'Multiline text1',
                        type: 'multi-line-text',
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        regexPattern: null,
                        required: false,
                        readOnly: true,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'multilinetext2',
                        name: 'Multiline text2',
                        type: 'multi-line-text',
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        regexPattern: null,
                        required: false,
                        readOnly: true,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: 'df046463-2d65-4388-9ee1-0e1517985215',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'number1',
                        overrideId: false,
                        name: 'Number1',
                        type: 'integer',
                        colspan: 1,
                        placeholder: null,
                        readOnly: true,
                        minValue: null,
                        maxValue: null,
                        required: false,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'number2',
                        overrideId: false,
                        name: 'Number2',
                        type: 'integer',
                        colspan: 1,
                        placeholder: null,
                        readOnly: true,
                        minValue: null,
                        maxValue: null,
                        required: false,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: '9672cc7b-1959-49c9-96be-3816e57bdfc1',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'checkbox1',
                        name: 'Checkbox1',
                        type: 'boolean',
                        required: false,
                        readOnly: true,
                        colspan: 1,
                        overrideId: false,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'checkbox2',
                        name: 'Checkbox2',
                        type: 'boolean',
                        required: false,
                        readOnly: true,
                        colspan: 1,
                        overrideId: false,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: '054d193e-a899-4494-9a3e-b489315b7d57',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'dropdown1',
                        name: 'Dropdown1',
                        type: 'dropdown',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        optionType: 'manual',
                        options: [],
                        endpoint: null,
                        requestHeaders: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'dropdown2',
                        name: 'Dropdown2',
                        type: 'dropdown',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        optionType: 'manual',
                        options: [],
                        endpoint: null,
                        requestHeaders: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: '1f8f0b66-e022-4667-91b4-bbbf2ddc36fb',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'amount1',
                        name: 'Amount1',
                        type: 'amount',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: '123',
                        minValue: null,
                        maxValue: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        },
                        enableFractions: false,
                        currency: '$'
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'amount2',
                        name: 'Amount2',
                        type: 'amount',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: '123',
                        minValue: null,
                        maxValue: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        },
                        enableFractions: false,
                        currency: '$'
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: '541a368b-67ee-4a7c-ae7e-232c050b9e24',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'date1',
                        name: 'Date1',
                        type: 'date',
                        overrideId: false,
                        required: false,
                        readOnly: true,
                        colspan: 1,
                        placeholder: null,
                        minValue: null,
                        maxValue: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        },
                        dateDisplayFormat: 'D-M-YYYY'
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'date2',
                        name: 'Date2',
                        type: 'date',
                        overrideId: false,
                        required: false,
                        readOnly: true,
                        colspan: 1,
                        placeholder: null,
                        minValue: null,
                        maxValue: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        },
                        dateDisplayFormat: 'D-M-YYYY'
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: 'e79cb7e2-3dc1-4c79-8158-28662c28a9f3',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'radiobuttons1',
                        name: 'Radio buttons1',
                        type: 'radio-buttons',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        optionType: 'manual',
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
                        endpoint: null,
                        requestHeaders: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'radiobuttons2',
                        name: 'Radio buttons2',
                        type: 'radio-buttons',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        optionType: 'manual',
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
                        endpoint: null,
                        requestHeaders: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: '7c01ed35-be86-4be7-9c28-ed640a5a2ae1',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'AttachFileFieldRepresentation',
                        id: 'attachfile1',
                        name: 'Attach file1',
                        type: 'upload',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2,
                            fileSource: {
                                serviceId: 'all-file-sources',
                                name: 'All file sources'
                            },
                            multiple: false,
                            link: false
                        }
                    }
                ],
                2: [
                    {
                        fieldType: 'AttachFileFieldRepresentation',
                        id: 'attachfile2',
                        name: 'Attach file2',
                        type: 'upload',
                        value: null,
                        required: false,
                        readOnly: true,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2,
                            fileSource: {
                                serviceId: 'all-file-sources',
                                name: 'All file sources'
                            },
                            multiple: false,
                            link: false
                        }
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: '07b13b96-d469-4a1e-8a9a-9bb957c68869',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'displayvalue1',
                        name: 'Display value1',
                        type: 'readonly',
                        value: 'No field selected',
                        readOnly: true,
                        required: false,
                        overrideId: false,
                        colspan: 1,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2,
                            field: {
                                id: 'displayvalue',
                                name: 'Display value',
                                type: 'text',
                                responseVariable: true
                            }
                        }
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'displayvalue2',
                        name: 'Display value2',
                        type: 'readonly',
                        value: 'No field selected',
                        readOnly: true,
                        required: false,
                        overrideId: false,
                        colspan: 1,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2,
                            field: {
                                id: 'displayvalue',
                                name: 'Display value',
                                type: 'text',
                                responseVariable: true
                            }
                        }
                    }
                ]
            }
        },
        {
            fieldType: 'ContainerRepresentation',
            id: '1576ef25-c842-494c-ab84-265a1e3bf68d',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                1: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'displaytext1',
                        name: 'Display text1',
                        type: 'readonly-text',
                        value: 'Display text as part of the form',
                        readOnly: true,
                        required: false,
                        overrideId: false,
                        colspan: 1,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ],
                2: [
                    {
                        fieldType: 'FormFieldRepresentation',
                        id: 'displaytext2',
                        name: 'Display text2',
                        type: 'readonly-text',
                        value: 'Display text as part of the form',
                        readOnly: true,
                        required: false,
                        overrideId: false,
                        colspan: 1,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ]
            }
        }
    ],
    outcomes: [],
    metadata: {},
    variables: [
        {
            name: 'FormVarStr',
            type: 'string',
            value: ''
        },
        {
            name: 'FormVarInt',
            type: 'integer',
            value: ''
        },
        {
            name: 'FormVarBool',
            type: 'boolean',
            value: ''
        },
        {
            name: 'FormVarDate',
            type: 'date',
            value: ''
        },
        {
            name: 'NewVar',
            type: 'string',
            value: ''
        }
    ]
};

export const fakeCloudForm = {
    formRepresentation: {
        id: 'form-de8895be-d0d7-4434-beef-559b15305d72',
        name: 'StartEventForm',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    type: 'container',
                    id: '5a6b24c1-db2b-45e9-9aff-142395433d23',
                    name: 'Label',
                    tab: null,
                    fields: {
                        1: [
                            {
                                type: 'text',
                                id: 'firstName',
                                name: 'firstName',
                                colspan: 1,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                visibilityCondition: null,
                                placeholder: null,
                                value: null,
                                required: false,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null
                            }
                        ],
                        2: [
                            {
                                type: 'text',
                                id: 'lastName',
                                name: 'lastName',
                                colspan: 1,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                visibilityCondition: null,
                                placeholder: null,
                                value: null,
                                required: false,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null
                            }
                        ]
                    },
                    numberOfColumns: 2
                }
            ],
            outcomes: [],
            metadata: {},
            variables: []
        }
    }
};

export const emptyFormRepresentationJSON = {
    description: '',
    fields: [],
    id: 'form-3de070b6-63df-4058-8028-ac82283d64fa',
    metadata: {},
    name: 'form',
    outcomes: [],
    length: 0,
    processDefinitionId: 'ed4a6233-0ad8-11ea-8616-e6267bbdb057',
    processInstanceId: 'ec921948-0ad9-11ea-8616-e6267bbdb057',
    processVariables: [],
    standAlone: true,
    tabs: [],
    taskId: 'ec92194b-0ad9-11ea-8616-e6267bbdb057',
    taskName: null,
    variables: [],
    version: 0
};

export const conditionalUploadWidgetsMock: any = {
    formRepresentation: {
        id: 'form-fb7858f7-5cf6-4afe-b462-c15a5dc0c34c',
        name: 'AttachVisibility',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '1dc63387-aa9d-4f06-adfa-37817e8fd394',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Text0xlk8n',
                                name: 'Text',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: [
                            {
                                id: 'Attachfile0h9fr1',
                                name: 'Attach file',
                                type: 'upload',
                                required: false,
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: 'Text0xlk8n',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'Attach',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: '',
                                    nextCondition: null
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2,
                                    fileSource: {
                                        serviceId: 'alfresco-content',
                                        name: 'Alfresco Content'
                                    },
                                    multiple: false,
                                    link: false
                                }
                            }
                        ]
                    }
                }
            ],
            outcomes: [
                {
                    id: '5f2f1c2d-5a79-4ed1-a262-4fef190d41eb',
                    name: 'Custom Outcome',
                    visibilityCondition: {
                        leftType: 'field',
                        leftValue: 'Text0xlk8n',
                        operator: '==',
                        rightValue: 'hi',
                        rightType: 'value',
                        nextConditionOperator: '',
                        nextCondition: null
                    }
                }
            ],
            metadata: {},
            variables: []
        }
    }
};

export const multilingualForm: any = {
    formRepresentation: {
        id: 'form-2aaaf20e-43d3-46bf-89be-859d5f512dd2',
        name: 'multilingualform',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '451e2235-3310-4c2d-9b4a-08b53ae1640c',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'textField',
                                name: 'TEXT_FIELD.TITLE',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: []
                    }
                },
                {
                    id: '1c87df6c-514e-45a7-96bc-508562683bb3',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'fildUploadField',
                                name: 'FILE_UPLOAD_FIELD.TITLE',
                                type: 'multi-line-text',
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                required: false,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: [
                            {
                                id: 'amountField',
                                name: 'AMOUNT_FIELD.TITLE',
                                type: 'amount',
                                required: false,
                                colspan: 1,
                                placeholder: '123',
                                minValue: null,
                                maxValue: null,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                enableFractions: false,
                                currency: '$'
                            }
                        ]
                    }
                },
                {
                    id: '33138eea-130f-4bba-b5a5-29ea60f31786',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'dateField',
                                name: 'DATE_FIELD.TITLE',
                                type: 'date',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minValue: null,
                                maxValue: null,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: 'D-M-YYYY'
                            }
                        ],
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: []
        }
    }
};

export const fakeMetadataForm = {
    id: 'form-de8895be-d0d7-4434-beef-559b15305d72',
    name: 'StartEventForm',
    description: '',
    version: 0,
    formDefinition: {
        tabs: [],
        fields: [
            {
                type: 'container',
                id: '5a6b24c1-db2b-45e9-9aff-142395433d23',
                name: 'Label',
                tab: null,
                fields: {
                    1: [
                        {
                            type: 'text',
                            id: 'pfx_property_one',
                            name: 'pfx_property_one',
                            colspan: 1,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            },
                            visibilityCondition: null,
                            placeholder: null,
                            value: null,
                            required: false,
                            minLength: 0,
                            maxLength: 0,
                            regexPattern: null
                        }
                    ],
                    2: [
                        {
                            type: 'boolean',
                            id: 'pfx_property_two',
                            name: 'pfx_property_two',
                            colspan: 1,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            },
                            visibilityCondition: null,
                            placeholder: null,
                            value: null,
                            required: false,
                            minLength: 0,
                            maxLength: 0,
                            regexPattern: null
                        }
                    ],
                    3: [
                        {
                            id: 'content_form_nodes',
                            name: 'Nodes',
                            type: 'upload',
                            readOnly: false,
                            required: true,
                            colspan: 1,
                            visibilityCondition: null,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2,
                                fileSource: {
                                    serviceId: 'alfresco-content',
                                    name: 'Alfresco Content',
                                    metadataAllowed: true
                                },
                                multiple: true,
                                menuOptions: {
                                    show: true,
                                    download: true,
                                    retrieveMetadata: true,
                                    remove: true
                                },
                                link: false
                            }
                        }
                    ],
                    4: [
                        {
                            id: 'pfx_property_three',
                            name: 'pfx_property_three',
                            required: false,
                            readOnly: false,
                            colspan: 1,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            },
                            visibilityCondition: null,
                            type: 'dropdown',
                            optionType: 'manual',
                            options: [
                                {
                                    id: 'empty',
                                    name: 'Choose one...'
                                },
                                {
                                    id: 'opt_1',
                                    name: 'Option 1'
                                },
                                {
                                    id: 'opt_2',
                                    name: 'Option 2'
                                }
                            ],
                            value: 'empty',
                            restUrl: null,
                            restResponsePath: null,
                            restIdProperty: null,
                            restLabelProperty: null
                        }
                    ],
                    5: [
                        {
                            id: 'pfx_property_four',
                            name: 'pfx_property_four',
                            required: false,
                            readOnly: false,
                            colspan: 1,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            },
                            visibilityCondition: null,
                            type: 'dropdown',
                            optionType: 'manual',
                            options: [
                                {
                                    id: 'empty',
                                    name: 'Choose one...'
                                },
                                {
                                    id: 'option_1',
                                    name: 'Option: 1'
                                },
                                {
                                    id: 'option_2',
                                    name: 'Option: 2'
                                }
                            ],
                            value: 'empty',
                            restUrl: null,
                            restResponsePath: null,
                            restIdProperty: null,
                            restLabelProperty: null
                        }
                    ],
                    6: [
                        {
                            id: 'pfx_property_five',
                            name: 'pfx_property_five',
                            required: false,
                            readOnly: false,
                            colspan: 1,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            },
                            visibilityCondition: null,
                            type: 'dropdown',
                            optionType: 'manual',
                            options: [
                                {
                                    id: 'empty',
                                    name: 'Choose one...'
                                },
                                {
                                    id: 'green',
                                    name: 'Colour green'
                                },
                                {
                                    id: 'orange',
                                    name: 'Colour orange'
                                }
                            ],
                            value: 'empty',
                            restUrl: null,
                            restResponsePath: null,
                            restIdProperty: null,
                            restLabelProperty: null
                        }
                    ],
                    7: [
                        {
                            id: 'cmfb85b2a7295ba41209750bca176ccaf9a',
                            name: 'File viewer',
                            type: 'file-viewer',
                            readOnly: false,
                            required: false,
                            colspan: 1,
                            visibilityCondition: null,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2,
                                uploadWidget: 'content_form_nodes'
                            }
                        }
                    ],
                    8: [
                        {
                            type: 'text',
                            id: 'pfx_property_six',
                            name: 'pfx_property_six',
                            colspan: 1,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            },
                            visibilityCondition: null,
                            placeholder: null,
                            value: null,
                            required: false,
                            minLength: 0,
                            maxLength: 0,
                            regexPattern: null
                        }
                    ],
                    9: [
                        {
                            type: 'text',
                            id: 'pfx_property_seven',
                            name: 'pfx_property_seven',
                            colspan: 1,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            },
                            visibilityCondition: null,
                            placeholder: null,
                            value: null,
                            required: false,
                            minLength: 0,
                            maxLength: 0,
                            regexPattern: null
                        }
                    ],
                    10: [
                        {
                            type: 'text',
                            id: 'pfx_property_eight',
                            name: 'pfx_property_eight',
                            colspan: 1,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2
                            },
                            visibilityCondition: null,
                            placeholder: null,
                            value: null,
                            required: false,
                            minLength: 0,
                            maxLength: 0,
                            regexPattern: null
                        }
                    ]
                },
                numberOfColumns: 2
            }
        ],
        outcomes: [],
        metadata: {},
        variables: []
    }
};

export const fakeViewerForm = {
    id: 'form-de8895be-d0d7-4434-beef-559b15305d72',
    name: 'StartEventForm',
    description: '',
    version: 0,
    formDefinition: {
        tabs: [],
        fields: [
            {
                type: 'container',
                id: '5a6b24c1-db2b-45e9-9aff-142395433d23',
                name: 'Label',
                tab: null,
                fields: {
                    1: [
                        {
                            id: 'content_form_nodes',
                            name: 'Nodes',
                            type: 'upload',
                            readOnly: false,
                            required: true,
                            colspan: 1,
                            visibilityCondition: null,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2,
                                fileSource: {
                                    serviceId: 'alfresco-content',
                                    name: 'Alfresco Content',
                                    metadataAllowed: true
                                },
                                multiple: true,
                                menuOptions: {
                                    show: true,
                                    download: true,
                                    retrieveMetadata: true,
                                    remove: true
                                },
                                link: false
                            }
                        }
                    ],
                    2: [
                        {
                            id: 'upload_widget',
                            name: 'Nodes',
                            type: 'upload',
                            readOnly: false,
                            required: true,
                            colspan: 1,
                            visibilityCondition: null,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2,
                                fileSource: {
                                    serviceId: 'alfresco-content',
                                    name: 'Alfresco Content',
                                    metadataAllowed: true
                                },
                                multiple: true,
                                menuOptions: {
                                    show: true,
                                    download: true,
                                    retrieveMetadata: true,
                                    remove: true
                                },
                                link: false
                            }
                        }
                    ],
                    3: [
                        {
                            id: 'cmfb85b2a7295ba41209750bca176ccaf9a',
                            name: 'File viewer',
                            type: 'file-viewer',
                            readOnly: false,
                            required: false,
                            colspan: 1,
                            visibilityCondition: null,
                            params: {
                                existingColspan: 1,
                                maxColspan: 2,
                                uploadWidget: 'content_form_nodes'
                            }
                        }
                    ]
                },
                numberOfColumns: 2
            }
        ],
        outcomes: [],
        metadata: {},
        variables: []
    }
};
