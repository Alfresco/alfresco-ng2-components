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

/* tslint:disable */
export const tabFieldValueVisibilityJson = {
    formRepresentation: {
        id: 'form-3aff57d3-62af-4adf-9b14-1d8f44a28077',
        name: 'tabvisibility',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [
                {
                    id: '71da814d-5580-4f1f-972a-8089253aeded',
                    title: 'tabBasicFieldValue',
                    visibilityCondition: {
                        leftType: 'field',
                        leftValue: 'TextOne',
                        operator: '==',
                        rightValue: 'showTab',
                        rightType: 'value',
                        nextConditionOperator: '',
                        nextCondition: null
                    }
                },
                {
                    id: '442eea0b-65f9-484e-b37f-f5a91d5e1f21',
                    title: 'tabWithFields',
                    visibilityCondition: null
                }
            ],
            fields: [
                {
                    id: 'dcde7e13-2444-48bc-ab30-32902cea549e',
                    name: 'Label',
                    type: 'container',
                    tab: '71da814d-5580-4f1f-972a-8089253aeded',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextTwo',
                                name: 'TextTwo',
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
                    id: 'df452297-d0e8-4406-b9d3-10842033549d',
                    name: 'Label',
                    type: 'container',
                    tab: '442eea0b-65f9-484e-b37f-f5a91d5e1f21',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextOne',
                                name: 'TextOne',
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
                }
            ],
            outcomes: [],
            metadata: {},
            variables: []
        }
    }
};

export const tabVarValueVisibilityJson = {
    formRepresentation: {
        id: 'form-3aff57d3-62af-4adf-9b14-1d8f44a28077',
        name: 'tabvisibility',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [
                {
                    id: '71da814d-5580-4f1f-972a-8089253aeded',
                    title: 'tabBasicVarValue',
                    visibilityCondition: {
                        leftType: 'variable',
                        leftValue: 'stringVar',
                        operator: '==',
                        rightValue: 'showTab',
                        rightType: 'value',
                        nextConditionOperator: ''
                    }
                }
            ],
            fields: [
                {
                    id: 'dcde7e13-2444-48bc-ab30-32902cea549e',
                    name: 'Label',
                    type: 'container',
                    tab: '71da814d-5580-4f1f-972a-8089253aeded',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextTwo',
                                name: 'TextTwo',
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
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: "803269e6-a568-40e2-aec3-75ad2f411688",
                    name: "stringVar",
                    type: "string",
                    value: "showTab"
                }
            ]
        }
    }
};

export const tabVarFieldVisibilityJson = {
    formRepresentation: {
        id: 'form-3aff57d3-62af-4adf-9b14-1d8f44a28077',
        name: 'tabvisibility',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [
                {
                    id: '71da814d-5580-4f1f-972a-8089253aeded',
                    title: 'tabBasicVarField',
                    visibilityCondition: {
                        leftType: 'variable',
                        leftValue: 'stringVar',
                        operator: '==',
                        rightValue: 'TextOne',
                        rightType: 'field',
                        nextConditionOperator: ''
                    }
                },
                {
                    id: '0e538a28-f8d6-4cb8-ae93-dbfb2efdf3b1',
                    title: 'tabWithFields',
                    visibilityCondition: null
                }
            ],
            fields: [
                {
                    id: 'dcde7e13-2444-48bc-ab30-32902cea549e',
                    name: 'Label',
                    type: 'container',
                    tab: '71da814d-5580-4f1f-972a-8089253aeded',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextTwo',
                                name: 'TextTwo',
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
                    id: '1308e433-08ce-4448-a62a-0accc1187d15',
                    name: 'Label',
                    type: 'container',
                    tab: '0e538a28-f8d6-4cb8-ae93-dbfb2efdf3b1',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextOne',
                                name: 'TextOne',
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
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: "803269e6-a568-40e2-aec3-75ad2f411688",
                    name: "stringVar",
                    type: "string",
                    value: "showTab"
                }
            ]
        }
    }
};

export const tabFieldFieldVisibilityJson = {
    formRepresentation: {
        id: 'form-3aff57d3-62af-4adf-9b14-1d8f44a28077',
        name: 'tabvisibility',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [
                {
                    id: '71da814d-5580-4f1f-972a-8089253aeded',
                    title: 'tabBasicFieldField',
                    visibilityCondition: {
                        leftType: 'field',
                        leftValue: 'TextThree',
                        operator: '==',
                        rightValue: 'TextOne',
                        rightType: 'field',
                        nextConditionOperator: ''
                    }
                },
                {
                    id: '442eea0b-65f9-484e-b37f-f5a91d5e1f21',
                    title: 'tabWithFields',
                    visibilityCondition: null
                }
            ],
            fields: [
                {
                    id: 'dcde7e13-2444-48bc-ab30-32902cea549e',
                    name: 'Label',
                    type: 'container',
                    tab: '71da814d-5580-4f1f-972a-8089253aeded',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextTwo',
                                name: 'TextTwo',
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
                    id: 'df452297-d0e8-4406-b9d3-10842033549d',
                    name: 'Label',
                    type: 'container',
                    tab: '442eea0b-65f9-484e-b37f-f5a91d5e1f21',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextOne',
                                name: 'TextOne',
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
                                id: 'TextThree',
                                name: 'TextThree',
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
                        ]
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: []
        }
    }
};

export const tabFieldVarVisibilityJson = {
    formRepresentation: {
        id: 'form-3aff57d3-62af-4adf-9b14-1d8f44a28077',
        name: 'tabvisibility',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [
                {
                    id: '71da814d-5580-4f1f-972a-8089253aeded',
                    title: 'tabBasicVarField',
                    visibilityCondition: {
                        leftType: 'field',
                        leftValue: 'TextOne',
                        operator: '==',
                        rightValue: 'stringVar',
                        rightType: 'variable',
                        nextConditionOperator: ''
                    }
                },
                {
                    id: '0e538a28-f8d6-4cb8-ae93-dbfb2efdf3b1',
                    title: 'tabWithFields',
                    visibilityCondition: null
                }
            ],
            fields: [
                {
                    id: 'dcde7e13-2444-48bc-ab30-32902cea549e',
                    name: 'Label',
                    type: 'container',
                    tab: '71da814d-5580-4f1f-972a-8089253aeded',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextTwo',
                                name: 'TextTwo',
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
                    id: '1308e433-08ce-4448-a62a-0accc1187d15',
                    name: 'Label',
                    type: 'container',
                    tab: '0e538a28-f8d6-4cb8-ae93-dbfb2efdf3b1',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextOne',
                                name: 'TextOne',
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
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: "803269e6-a568-40e2-aec3-75ad2f411688",
                    name: "stringVar",
                    type: "string",
                    value: "showTab"
                }
            ]
        }
    }
};

export const tabVarVarVisibilityJson = {
    formRepresentation: {
        id: 'form-3aff57d3-62af-4adf-9b14-1d8f44a28077',
        name: 'tabvisibility',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [
                {
                    id: 'ef512cb3-0c41-4d12-84ef-a7ef8f0b111a',
                    title: 'tabBasicVarVar',
                    visibilityCondition: {
                        leftType: 'variable',
                        leftValue: 'showTabOne',
                        operator: '==',
                        rightValue: 'showTabTwo',
                        rightType: 'variable',
                        nextConditionOperator: ''
                    }
                }
            ],
            fields: [
                {
                    id: '6eeb9e54-e51d-44f3-9557-503308f07361',
                    name: 'Label',
                    type: 'container',
                    tab: 'ef512cb3-0c41-4d12-84ef-a7ef8f0b111a',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextOne',
                                name: 'TextOne',
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
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: "b116df99-f6b5-45f8-b48c-15b74f7f1c92",
                    name: "showTabOne",
                    type: "string",
                    value: "showTab"
                },
                {
                    id: "6e3e88ab-848c-4f48-8326-a404d1427f60",
                    name: "showTabTwo",
                    type: "string",
                    value: "showTab"
                }
            ]
        }
    }
};

export const tabNextOperatorsVisibilityJson = {
    formRepresentation: {
        id: 'form-3aff57d3-62af-4adf-9b14-1d8f44a28077',
        name: 'tabvisibility',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [
                {
                    id: '71da814d-5580-4f1f-972a-8089253aeded',
                    title: 'tabNextOperators',
                    visibilityCondition: {
                        leftType: 'field',
                        leftValue: 'TextOne',
                        operator: '==',
                        rightValue: 'showTab',
                        rightType: 'value',
                        nextConditionOperator: 'and',
                        nextCondition: {
                            leftType: 'field',
                            leftValue: 'TextThree',
                            operator: '!=',
                            rightValue: 'showTab',
                            rightType: 'value',
                            nextConditionOperator: '',
                            nextCondition: null
                        }
                    }
                },
                {
                    id: '442eea0b-65f9-484e-b37f-f5a91d5e1f21',
                    title: 'tabWithFields',
                    visibilityCondition: null
                }
            ],
            fields: [
                {
                    id: 'dcde7e13-2444-48bc-ab30-32902cea549e',
                    name: 'Label',
                    type: 'container',
                    tab: '71da814d-5580-4f1f-972a-8089253aeded',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextTwo',
                                name: 'TextTwo',
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
                    id: 'df452297-d0e8-4406-b9d3-10842033549d',
                    name: 'Label',
                    type: 'container',
                    tab: '442eea0b-65f9-484e-b37f-f5a91d5e1f21',
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'TextOne',
                                name: 'TextOne',
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
                                id: 'TextThree',
                                name: 'TextThree',
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
                        ]
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: []
        }
    }
};
