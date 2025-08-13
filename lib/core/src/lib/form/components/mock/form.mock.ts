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
                    '1': [
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
                    '2': [
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
                    '3': [
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
                    '4': [
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
                    '5': [
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
                    '6': [
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
                    '7': [
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
                    '8': [
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
                    '9': [
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
                    '10': [
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

export const mockDisplayExternalPropertyForm = {
    id: 'form-29483aa4-ebd4-4eab-b024-65ce7b268286',
    name: 'external-form',
    description: '',
    version: 0,
    key: 'external-form',
    tabs: [],
    fields: [
        {
            id: '48120e00-e0d5-4d15-be49-ccf328ecb24d',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
                '1': [
                    {
                        id: 'DisplayExternalProperty02kj65',
                        name: 'Display External Property',
                        type: 'display-external-property',
                        readOnly: true,
                        required: true,
                        colspan: 1,
                        rowspan: 1,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        },
                        externalProperty: 'firstName',
                        value: 'hr'
                    }
                ],
                '2': [
                    {
                        id: 'DisplayExternalProperty0ei65x',
                        name: 'Display External Property',
                        type: 'display-external-property',
                        readOnly: true,
                        colspan: 1,
                        rowspan: 1,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        },
                        externalProperty: 'username',
                        required: false,
                        value: 'hruser'
                    }
                ]
            }
        }
    ],
    outcomes: [],
    metadata: {},
    variables: [],
    taskId: '2764e7b3-eaad-11ee-b14c-86722ede7d5b',
    taskName: 'widgets',
    processDefinitionId: 'Process_xQy3Ev89:1:aa78eca9-eaac-11ee-b14c-86722ede7d5b',
    processInstanceId: '275d94ab-eaad-11ee-b14c-86722ede7d5b',
    processVariables: [
        {
            id: 'DisplayExternalProperty0ei65x',
            name: 'DisplayExternalProperty0ei65x',
            value: 'email',
            type: 'string'
        },
        {
            id: 'DisplayExternalProperty02kj65',
            name: 'DisplayExternalProperty02kj65',
            value: 'test',
            type: 'string'
        }
    ]
};

export const mockFormWithSections = {
    id: 'form-970ddfcf-6d5d-4cbb-ae81-958ade65062c',
    name: 'simple section',
    key: 'simple-section-z54vk',
    description: '',
    version: 0,
    tabs: [],
    fields: [
        {
            id: 'Group0bw66i',
            name: 'Group',
            type: 'group',
            tab: null,
            params: {
                hideHeader: false,
                allowCollapse: false,
                collapseByDefault: false
            },
            numberOfColumns: 1,
            fields: {
                1: [
                    {
                        id: '4c0590a9-44e3-415f-9e69-3a3ffe99066b',
                        name: 'Section',
                        type: 'section',
                        numberOfColumns: 4,
                        fields: {
                            1: [
                                {
                                    id: 'Text0xiuw4',
                                    name: 'Text in section',
                                    type: 'text',
                                    readOnly: false,
                                    required: false,
                                    colspan: 1,
                                    rowspan: 1,
                                    placeholder: null,
                                    minLength: 0,
                                    maxLength: 0,
                                    regexPattern: null,
                                    visibilityCondition: {
                                        leftType: 'field',
                                        leftValue: 'Text0bbed8',
                                        operator: '==',
                                        rightValue: 'text inside',
                                        rightType: 'value',
                                        nextConditionOperator: '',
                                        nextCondition: null
                                    },
                                    params: {
                                        existingColspan: 1,
                                        maxColspan: 2
                                    }
                                }
                            ],
                            2: [],
                            3: [
                                {
                                    id: 'dateInsideSection',
                                    name: 'Date',
                                    type: 'date',
                                    readOnly: false,
                                    required: true,
                                    colspan: 2,
                                    rowspan: 1,
                                    placeholder: null,
                                    minValue: null,
                                    maxValue: null,
                                    minDateRangeValue: null,
                                    maxDateRangeValue: null,
                                    visibilityCondition: {
                                        leftType: 'field',
                                        leftValue: 'Text0s7k3m',
                                        operator: '==',
                                        rightValue: 'date',
                                        rightType: 'value',
                                        nextConditionOperator: '',
                                        nextCondition: null
                                    },
                                    params: {
                                        existingColspan: 1,
                                        maxColspan: 2
                                    },
                                    dateDisplayFormat: 'yyyy-MM-dd'
                                }
                            ]
                        },
                        colspan: 1
                    },
                    {
                        id: '9d0ed068-f6b9-4ddc-ba8b-8ac29b745e1d',
                        name: 'Section',
                        type: 'section',
                        numberOfColumns: 6,
                        fields: {
                            1: [
                                {
                                    id: 'Text0dkzym',
                                    name: 'Text',
                                    type: 'text',
                                    readOnly: false,
                                    required: false,
                                    colspan: 2,
                                    rowspan: 1,
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
                                    id: 'Text0kn8qb',
                                    name: 'type text outside',
                                    type: 'text',
                                    readOnly: false,
                                    required: false,
                                    colspan: 2,
                                    rowspan: 1,
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
                            3: [
                                {
                                    id: 'Text0bbed8',
                                    name: 'type text inside',
                                    type: 'text',
                                    readOnly: false,
                                    required: false,
                                    colspan: 2,
                                    rowspan: 1,
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
                            ]
                        },
                        colspan: 1
                    }
                ]
            }
        },
        {
            id: 'fc73e4fa-5725-41b2-9185-624d9efd6581',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 4,
            fields: {
                1: [
                    {
                        id: 'Text0p0v95',
                        name: 'type section',
                        type: 'text',
                        readOnly: false,
                        required: false,
                        colspan: 1,
                        rowspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        regexPattern: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    },
                    {
                        id: 'Text0s7k3m',
                        name: 'type date',
                        type: 'text',
                        readOnly: false,
                        required: false,
                        colspan: 1,
                        rowspan: 1,
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
                        id: 'multilineOutsideSection',
                        name: 'Multiline text',
                        type: 'multi-line-text',
                        readOnly: false,
                        colspan: 1,
                        rowspan: 1,
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
                3: [
                    {
                        id: 'Text0opb9w',
                        name: 'Text',
                        type: 'text',
                        readOnly: false,
                        required: false,
                        colspan: 2,
                        rowspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        regexPattern: null,
                        visibilityCondition: {
                            leftType: 'field',
                            leftValue: 'Text0kn8qb',
                            operator: '==',
                            rightValue: 'text outside',
                            rightType: 'value',
                            nextConditionOperator: '',
                            nextCondition: null
                        },
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
    variables: [],
    rules: {
        fields: {
            Text0bbed8: {
                click: [
                    {
                        actions: [
                            {
                                target: 'field.Text0xiuw4',
                                payload: {
                                    value: 'updated by form rules!'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
};

export const fakeValidatorMock = {
    supportedTypes: ['test'],
    isSupported: () => true,
    validate: () => true
};
