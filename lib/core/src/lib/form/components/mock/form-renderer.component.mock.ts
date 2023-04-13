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

export const formDisplayValueVisibility = {
    formRepresentation: {
        id: 'form-3175b074-53c6-4b5b-92df-246b62108db3',
        name: 'displayValueVisibility',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '65ba00e6-a669-4710-9a97-0a6e19b429d8',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Text0bq3ar',
                                name: 'Text',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ],
                        2: [
                            {
                                id: 'Displayvalue0g6092',
                                name: 'Display value',
                                type: 'readonly',
                                value: 'No field selected',
                                colspan: 1,
                                visibilityCondition: {
                                    leftType: 'field',
                                    leftValue: 'Text0bq3ar',
                                    operator: '==',
                                    rightValue: 'DisplayValue',
                                    rightType: 'value',
                                    nextConditionOperator: '',
                                    nextCondition: null
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2,
                                    field: {
                                        id: 'Displayvalue0g6092',
                                        name: 'Display value',
                                        type: 'text'
                                    },
                                    responseVariable: true
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

export const formDisplayValueForm = {
    formRepresentation: {
        id: 'form-3dd0f2a3-c20a-4195-a760-1db42ec7dcd4',
        name: 'displayValue',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'c54f6956-bcf9-4109-a6c1-1daff773936b',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'DisplayValueColspan',
                                name: 'DisplayValueColspan',
                                type: 'readonly',
                                value: 'No field selected',
                                colspan: 2,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2,
                                    field: {
                                        id: 'Displayvalue0hwgvb',
                                        name: 'Display value',
                                        type: 'text'
                                    }
                                }
                            },
                            {
                                id: 'DisplayValueFieldValue',
                                name: 'DisplayValueFieldValue',
                                type: 'readonly',
                                value: 'No field selected',
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: 'TextOne',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'aaa',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: '',
                                    nextCondition: null
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2,
                                    field: {
                                        id: 'Displayvalue0pjsfi',
                                        name: 'Display value',
                                        type: 'text'
                                    }
                                }
                            },
                            {
                                id: 'DisplayValueVariableField',
                                name: 'DisplayValueVariableField',
                                type: 'readonly',
                                value: 'No field selected',
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: '',
                                    leftRestResponseId:
                                        'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                                    operator: '==',
                                    rightValue: '',
                                    rightType: null,
                                    rightFormFieldId: 'TextOne',
                                    rightRestResponseId: '',
                                    nextConditionOperator: '',
                                    nextCondition: null
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2,
                                    field: {
                                        id: 'Displayvalue0sss8o',
                                        name: 'Display value',
                                        type: 'text'
                                    }
                                }
                            },
                            {
                                id: 'DisplayValueFieldVariable',
                                name: 'DisplayValueFieldVariable',
                                type: 'readonly',
                                value: 'No field selected',
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: 'TextOne',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: '',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId:
                                        'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                                    nextConditionOperator: '',
                                    nextCondition: null
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2,
                                    field: {
                                        id: 'Displayvalue0mkrml',
                                        name: 'Display value',
                                        type: 'text'
                                    }
                                }
                            },
                            {
                                id: 'DisplayValueOne',
                                name: 'DisplayValueOne',
                                type: 'readonly',
                                value: 'No field selected',
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: 'Text0howrc',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'aaa',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftFormFieldId: 'TextTwo',
                                        leftRestResponseId: '',
                                        operator: '!=',
                                        rightValue: 'aaa',
                                        rightType: null,
                                        rightFormFieldId: '',
                                        rightRestResponseId: '',
                                        nextConditionOperator: '',
                                        nextCondition: null
                                    }
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2,
                                    field: {
                                        id: 'Displayvalue00ldqe',
                                        name: 'Display value',
                                        type: 'text'
                                    }
                                }
                            }
                        ],
                        2: [
                            {
                                id: 'Text0howrc',
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
                            },
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
                            },
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
                            },
                            {
                                id: 'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                                name: 'vstring',
                                type: 'readonly',
                                value: 'Show value of vstring',
                                colspan: 1,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2,
                                    field: {
                                        id:
                                            'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                                        name: 'vstring',
                                        type: 'string'
                                    }
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
                    id: 'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                    name: 'vstring',
                    type: 'string',
                    value: 'aaa'
                }
            ]
        }
    }
};

export const formDisplayValueCombinedVisibility = {
    formRepresentation: {
        id: 'form-3175b074-53c6-4b5b-92df-246b62108db3',
        name: 'displayValueVisibility',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '65ba00e6-a669-4710-9a97-0a6e19b429d8',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Text0bq3ar',
                                name: 'Text',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ],
                        2: [
                            {
                                id: 'Displayvalue0g6092',
                                name: 'Display value',
                                type: 'readonly',
                                value: 'No field selected',
                                colspan: 1,
                                visibilityCondition: {
                                    leftType: 'field',
                                    leftValue: 'Text0bq3ar',
                                    operator: '==',
                                    rightValue: 'aaa',
                                    rightType: 'value',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftType: 'field',
                                        leftValue: 'TextTwo',
                                        operator: '!=',
                                        rightValue: 'aaa',
                                        rightType: 'value',
                                        nextConditionOperator: '',
                                        nextCondition: null
                                    }
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2,
                                    field: {
                                        id: 'Displayvalue0g6092',
                                        name: 'Display value',
                                        type: 'text'
                                    },
                                    responseVariable: true
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'b2162507-2204-4fda-a8cb-003dd5d032ef',
                    name: 'Label',
                    type: 'container',
                    tab: null,
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
                                params: { existingColspan: 1, maxColspan: 2 }
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

export const formNumberWidgetVisibility = {
    formRepresentation: {
        id: 'form-00dc42c7-b075-404b-a57c-a8b2adca9abe',
        name: 'number_field',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '182eef06-d245-4388-b3f7-8e08d90fb07a',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Number1',
                                name: 'Number1',
                                type: 'integer',
                                colspan: 1,
                                placeholder: null,
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
                                id: 'Number2',
                                name: 'Number2',
                                type: 'integer',
                                colspan: 1,
                                placeholder: null,
                                minValue: null,
                                maxValue: null,
                                required: false,
                                visibilityCondition: {
                                    leftType: 'field',
                                    leftValue: 'Number1',
                                    operator: '==',
                                    rightValue: 'integerVariable',
                                    rightType: 'variable',
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
            variables: [
                {
                    id: 'f9f6d1ae-374a-49f9-b664-5286c558abaa',
                    name: 'integerVariable',
                    type: 'integer',
                    value: 5
                }
            ]
        }
    }
};

export const formNumberTextJson = {
           formRepresentation: {
               id: 'form-ed98955c-3e18-4689-a669-377ab801ad0e',
               name: 'number',
               description: '',
               version: 0,
               formDefinition: {
                   tabs: [],
                   fields: [
                       {
                           id: 'fa0df048-3d73-4922-8b62-71a204b086b2',
                           name: 'Label',
                           type: 'container',
                           tab: null,
                           numberOfColumns: 2,
                           fields: {
                               1: [
                                   {
                                       id: 'NumberColspan',
                                       name: 'NumberColspan',
                                       type: 'integer',
                                       colspan: 2,
                                       placeholder: null,
                                       minValue: null,
                                       maxValue: null,
                                       required: false,
                                       visibilityCondition: null,
                                       params: {
                                           existingColspan: 1,
                                           maxColspan: 2
                                       }
                                   },
                                   {
                                       id: 'NumberReq',
                                       name: 'NumberReq',
                                       type: 'integer',
                                       colspan: 1,
                                       placeholder: null,
                                       minValue: null,
                                       maxValue: null,
                                       required: true,
                                       visibilityCondition: null,
                                       params: {
                                           existingColspan: 1,
                                           maxColspan: 2
                                       }
                                   },
                                   {
                                       id: 'NumberNotReq',
                                       name: 'NumberNotReq',
                                       type: 'integer',
                                       colspan: 1,
                                       placeholder: null,
                                       minValue: null,
                                       maxValue: null,
                                       required: false,
                                       visibilityCondition: null,
                                       params: {
                                           existingColspan: 1,
                                           maxColspan: 2
                                       }
                                   },
                                   {
                                       id: 'NumberAdvanced',
                                       name: 'NumberAdvanced',
                                       type: 'integer',
                                       colspan: 1,
                                       placeholder: null,
                                       minValue: 10,
                                       maxValue: 50,
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
                                       id: 'Text',
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
                                   },
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
                                   },
                                   {
                                       id: 'NumberFieldValue',
                                       name: 'NumberFieldValue',
                                       type: 'integer',
                                       colspan: 1,
                                       placeholder: null,
                                       minValue: null,
                                       maxValue: null,
                                       required: false,
                                       visibilityCondition: {
                                           leftFormFieldId: 'Text',
                                           leftRestResponseId: '',
                                           operator: '==',
                                           rightValue: 'aaa',
                                           rightType: null,
                                           rightFormFieldId: '',
                                           rightRestResponseId: '',
                                           nextConditionOperator: '',
                                           nextCondition: null
                                       },
                                       params: {
                                           existingColspan: 1,
                                           maxColspan: 2
                                       }
                                   },
                                   {
                                       id: 'NumberVariableField',
                                       name: 'NumberVariableField',
                                       type: 'integer',
                                       colspan: 1,
                                       placeholder: null,
                                       minValue: null,
                                       maxValue: null,
                                       required: false,
                                       visibilityCondition: {
                                           leftFormFieldId: '',
                                           leftRestResponseId:
                                               '3b316e21-3632-4dde-ba19-b27dca09a83b',
                                           operator: '==',
                                           rightValue: 'aaa',
                                           rightType: null,
                                           rightFormFieldId: '',
                                           rightRestResponseId: '',
                                           nextConditionOperator: '',
                                           nextCondition: null
                                       },
                                       params: {
                                           existingColspan: 1,
                                           maxColspan: 2
                                       }
                                   },
                                   {
                                       id: 'NumberFieldVariable',
                                       name: 'NumberFieldVariable',
                                       type: 'integer',
                                       colspan: 1,
                                       placeholder: null,
                                       minValue: null,
                                       maxValue: null,
                                       required: false,
                                       visibilityCondition: {
                                           leftFormFieldId: 'Text',
                                           leftRestResponseId: '',
                                           operator: '==',
                                           rightValue: '',
                                           rightType: null,
                                           rightFormFieldId: '',
                                           rightRestResponseId:
                                               '3b316e21-3632-4dde-ba19-b27dca09a83b',
                                           nextConditionOperator: '',
                                           nextCondition: null
                                       },
                                       params: {
                                           existingColspan: 1,
                                           maxColspan: 2
                                       }
                                   },
                                   {
                                       id: 'NumberOne',
                                       name: 'NumberOne',
                                       type: 'integer',
                                       colspan: 1,
                                       placeholder: null,
                                       minValue: null,
                                       maxValue: null,
                                       required: false,
                                       visibilityCondition: {
                                           leftFormFieldId: 'Text',
                                           leftRestResponseId: '',
                                           operator: '==',
                                           rightValue: 'aaa',
                                           rightType: null,
                                           rightFormFieldId: '',
                                           rightRestResponseId: '',
                                           nextConditionOperator: 'and',
                                           nextCondition: {
                                               leftFormFieldId: 'TextTwo',
                                               leftRestResponseId: '',
                                               operator: 'not equal',
                                               rightValue: 'aaa',
                                               rightType: null,
                                               rightFormFieldId: '',
                                               rightRestResponseId: '',
                                               nextConditionOperator: '',
                                               nextCondition: null
                                           }
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
                   variables: [
                       {
                           id: '3b316e21-3632-4dde-ba19-b27dca09a83b',
                           name: 'name',
                           type: 'string',
                           value: 'aaa'
                       }
                   ]
               }
           }

};

export const formRequiredNumberWidget = {
           formRepresentation: {
               id: 'form-00dc42c7-b075-404b-a57c-a8b2adca9abe',
               name: 'number_field',
               description: '',
               version: 0,
               standAlone: true,
               formDefinition: {
                   tabs: [],
                   fields: [
                       {
                           id: '182eef06-d245-4388-b3f7-8e08d90fb07a',
                           name: 'Label',
                           type: 'container',
                           tab: null,
                           numberOfColumns: 2,
                           fields: {
                               1: [
                                   {
                                       id: 'Number1',
                                       name: 'Number1',
                                       type: 'integer',
                                       colspan: 1,
                                       placeholder: null,
                                       minValue: 5,
                                       maxValue: 7,
                                       required: true,
                                       visibilityCondition: null,
                                       params: {
                                           existingColspan: 1,
                                           maxColspan: 2
                                       }
                                   }
                               ],
                               2: [
                                   {
                                       id: 'Number2',
                                       name: 'Number2',
                                       type: 'integer',
                                       colspan: 1,
                                       placeholder: null,
                                       minValue: null,
                                       maxValue: null,
                                       required: false,
                                       visibilityCondition: {
                                           leftType: 'field',
                                           leftValue: 'Number1',
                                           operator: '==',
                                           rightValue: 'integerVariable',
                                           rightType: 'variable',
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
                   variables: [
                       {
                           id: 'f9f6d1ae-374a-49f9-b664-5286c558abaa',
                           name: 'integerVariable',
                           type: 'integer',
                           value: 5
                       }
                   ]
               }
           }
};

export const colspanForm = {
           formRepresentation: {
               id: 'form-a6af80b9-d200-4a00-b17a-b1309691493d',
               name: 'regresion',
               description: '',
               version: 0,
               standAlone: true,
               formDefinition: {
                   tabs: [],
                   fields: [
                       {
                           id: 'd52ada4e-cbdc-4f0c-a480-5b85fa00e4f8',
                           name: 'Label',
                           type: 'container',
                           tab: null,
                           numberOfColumns: 2,
                           fields: {
                               1: [
                                   {
                                       id: 'Number0u0kiv',
                                       name: 'NumberColspan',
                                       type: 'integer',
                                       readOnly: false,
                                       colspan: 2,
                                       placeholder: null,
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
                           id: '2bc275fb-e113-4d7d-885f-6e74a7332d40',
                           name: 'Label',
                           type: 'container',
                           tab: null,
                           numberOfColumns: 2,
                           fields: {
                               1: [
                                   {
                                       id: 'Number00fuuk',
                                       name: 'Number',
                                       type: 'integer',
                                       readOnly: false,
                                       colspan: 1,
                                       placeholder: null,
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
                                       id: 'Number03u9d4',
                                       name: 'Number',
                                       type: 'integer',
                                       readOnly: false,
                                       colspan: 1,
                                       placeholder: null,
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
                           id: '1ff21afc-7df4-4607-8363-1dc8576e1c8e',
                           name: 'Label',
                           type: 'container',
                           tab: null,
                           numberOfColumns: 2,
                           fields: {
                               1: [
                                   {
                                       id: 'Text04sjhr',
                                       name: 'Text',
                                       type: 'text',
                                       readOnly: false,
                                       required: false,
                                       colspan: 2,
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

export const numberNotRequiredForm = {
    formRepresentation: {
        id: 'form-d4c462db-3838-442e-a006-171e6ccafe61',
        name: 'number-not-required',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '159d0d89-555c-40db-9e69-6c75692061c1',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Number0x8cbv',
                                name: 'Number',
                                type: 'integer',
                                colspan: 1,
                                placeholder: null,
                                minValue: null,
                                maxValue: null,
                                required: true,
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 }
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

export const numberMinMaxForm = {
           formRepresentation: {
               id: 'form-f1e1a17c-d4a2-40dc-b15a-6a9c08afb26f',
               name: 'numbercol',
               description: '',
               version: 0,
               standAlone: true,
               formDefinition: {
                   tabs: [],
                   fields: [
                       {
                           id: '530d73c8-9600-4d11-a1b7-20ad6b60a31a',
                           name: 'Label',
                           type: 'container',
                           tab: null,
                           numberOfColumns: 2,
                           fields: {
                               1: [
                                   {
                                       id: 'Number0him2z',
                                       name: 'Number',
                                       type: 'integer',
                                       colspan: 2,
                                       placeholder: null,
                                       minValue: 10,
                                       maxValue: 60,
                                       required: false,
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

export const textWidgetVisibility = {
    formRepresentation: {
        id: 'form-2604b12b-f0b9-4633-9eae-aa24b659f98e',
        name: 'TextVisibility',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'c5fa3358-c6b6-46b1-81cf-c8909150ed4c',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'textOne',
                                name: 'textOne',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: {},
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ],
                        2: [
                            {
                                id: 'textTwo',
                                name: 'textTwo',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: {
                                    leftFormFieldId: 'textOne',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'Test',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: ''
                                },
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ]
                    }
                },
                {
                    id: '7a7734e1-af6c-4ea4-adcb-76725c0544db',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'textThree',
                                name: 'textThree',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: {
                                    leftFormFieldId: 'textOne',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'Test',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftFormFieldId: 'textTwo',
                                        leftRestResponseId: '',
                                        operator: 'empty',
                                        rightValue: '',
                                        rightType: null,
                                        rightFormFieldId: '',
                                        rightRestResponseId: '',
                                        nextConditionOperator: ''
                                    }
                                },
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ],
                        2: [
                            {
                                id: 'textFour',
                                name: 'textFour',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: {
                                    leftFormFieldId: 'textOne',
                                    leftRestResponseId: '',
                                    operator: 'empty',
                                    rightValue: '',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: 'or',
                                    nextCondition: {
                                        leftFormFieldId: 'textTwo',
                                        leftRestResponseId: '',
                                        operator: '==',
                                        rightValue: '',
                                        rightType: null,
                                        rightFormFieldId: 'textOne',
                                        rightRestResponseId: '',
                                        nextConditionOperator: '',
                                        nextCondition: null
                                    }
                                },
                                params: { existingColspan: 1, maxColspan: 2 }
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

export const numberWidgetVisibilityForm = {
    formRepresentation: {
        id: 'form-22c19b74-c954-43d7-9fbb-6a6d03a4bce0',
        name: 'numbervisb',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '78728404-ebab-4507-8986-c7f64e4b4d2a',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Text0hs0gt',
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
                            },
                            {
                                id: 'Number0wxaur',
                                name: 'Number',
                                type: 'integer',
                                colspan: 2,
                                placeholder: null,
                                minValue: null,
                                maxValue: null,
                                required: false,
                                visibilityCondition: {
                                    leftType: 'field',
                                    leftValue: 'Text0hs0gt',
                                    operator: '==',
                                    rightValue: 'aaa',
                                    rightType: 'value',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftType: 'field',
                                        leftValue: 'Text0cuqet',
                                        operator: '!=',
                                        rightValue: 'aaa',
                                        rightType: 'value',
                                        nextConditionOperator: '',
                                        nextCondition: null
                                    }
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            }
                        ],
                        2: [
                            {
                                id: 'Text0cuqet',
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

export const radioWidgetVisibiltyForm = {
    formRepresentation: {
        id: 'form-e0d77062-9b04-40d6-beed-6b63045f63b4',
        name: 'RadioVisibility',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'dd7c7415-2f00-4a91-a2b9-c4afcd8a4a8a',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Text0cee7g',
                                name: 'Text',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: null,
                                params: { existingColspan: 1, maxColspan: 2 }
                            }
                        ],
                        2: [
                            {
                                id: 'Radiobuttons03rkbo',
                                name: 'Radio buttons',
                                type: 'radio-buttons',
                                required: false,
                                colspan: 1,
                                optionType: 'manual',
                                options: [
                                    { id: 'option_1', name: 'Option 1' },
                                    { id: 'option_2', name: 'Option 2' }
                                ],
                                restUrl: null,
                                restResponsePath: null,
                                restIdProperty: null,
                                restLabelProperty: null,
                                visibilityCondition: {
                                    leftFormFieldId: 'Text0cee7g',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'Radio',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: '',
                                    nextCondition: null
                                },
                                params: { existingColspan: 1, maxColspan: 2 }
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

export const customWidgetForm = {
    formRepresentation: {
        id: 'form-bf7fe50b-c193-41c0-b835-637bf6593e41',
        name: 'formformformformbananaform',
        description: 'Read it while you sing banana phone please',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '07672e71-2f3d-4e3a-a0c6-ccaf76a8d3a1',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Text0vdi18',
                                name: 'herejustoshowstandardones',
                                type: 'text',
                                readOnly: false,
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
                                id: 'bananaforevah0k8gui',
                                name: 'bananaforevah',
                                type: 'bananaforevah',
                                required: true,
                                readOnly: false,
                                isCustomType: true,
                                valueType: 'json',
                                widgetId: '72f32b8b-505c-4f55-a08c-e2d0edd5bc9d',
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
            variables: []
        }
    }
};

export const customWidgetFormWithVisibility = {
    formRepresentation: {
        id: 'form-bf7fe50b-c193-41c0-b835-637bf6593e41',
        name: 'formformformformbananaform',
        description: 'Read it while you sing banana phone please',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '07672e71-2f3d-4e3a-a0c6-ccaf76a8d3a1',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Text0vdi18',
                                name: 'herejustoshowstandardones',
                                type: 'text',
                                readOnly: false,
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
                                id: 'bananaforevah0k8gui',
                                name: 'bananaforevah',
                                type: 'bananaforevah',
                                required: true,
                                readOnly: false,
                                isCustomType: true,
                                valueType: 'json',
                                widgetId: '72f32b8b-505c-4f55-a08c-e2d0edd5bc9d',
                                colspan: 1,
                                visibilityCondition: {
                                    leftType: 'field',
                                    leftValue: 'Text0vdi18',
                                    operator: '==',
                                    rightValue: 'no',
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
            variables: []
        }
    }
};

export const formDateVisibility = {
    formRepresentation: {
      id: 'form-f0d926e0-0cb9-46fc-a10e-705547fb0318',
      name: 'form',
      description: '',
      version: 0,
      standAlone: true,
      formDefinition: {
        tabs: [],
        fields: [
          {
            id: 'be820e5c-ee59-40df-bca2-03a5a1e1e29c',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
              1: [
                {
                  id: 'Date0hwq20',
                  name: 'Date',
                  type: 'date',
                  readOnly: false,
                  required: false,
                  colspan: 1,
                  rowspan: 1,
                  placeholder: null,
                  minValue: null,
                  maxValue: null,
                  visibilityCondition: null,
                  params: {
                    existingColspan: 1,
                    maxColspan: 2
                  },
                  dateDisplayFormat: 'YYYY-MM-DD'
                }
              ],
              2: [
                {
                  id: 'Text0pqd1u',
                  name: 'Text',
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
                    leftValue: 'Date0hwq20',
                    operator: '==',
                    rightValue: '2019-11-19',
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
          },
          {
            id: 'ff5ebab0-99a0-42ca-b2e7-416af9fe713a',
            name: 'Label',
            type: 'container',
            tab: null,
            numberOfColumns: 2,
            fields: {
              1: [
                {
                  id: 'Text0uyqd3',
                  name: 'Text',
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
                    leftValue: 'Date0hwq20',
                    operator: '!=',
                    rightValue: '2019-11-19',
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

export const amountWidgetFormVisibilityMock = {
    formRepresentation: {
        id: 'form-48577532-6d9d-485e-9fe6-b8b9b005f53b',
        name: 'amountVisibility',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'ce32844c-20b2-4361-88b5-a56f28219aef',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [],
                        2: [
                            {
                                id: 'Text0id3ic',
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
                        ]
                    }
                },
                {
                    id: 'd8b8c021-1920-4f81-af28-fd5d0c31395b',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Amount0kceqc',
                                name: 'Amount',
                                type: 'amount',
                                required: false,
                                colspan: 1,
                                placeholder: '123',
                                minValue: null,
                                maxValue: null,
                                visibilityCondition: {
                                    leftFormFieldId: 'Text0id3ic',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'text1',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftFormFieldId: 'Number0yggl7',
                                        leftRestResponseId: '',
                                        operator: '!empty',
                                        rightValue: '',
                                        rightType: null,
                                        rightFormFieldId: '',
                                        rightRestResponseId: '',
                                        nextConditionOperator: ''
                                    }
                                },
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
                                id: 'Number0yggl7',
                                name: 'Number',
                                type: 'integer',
                                colspan: 1,
                                placeholder: null,
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
                }
            ],
            outcomes: [],
            metadata: {},
            variables: []
        }
    }
};

export const checkboxWidgetFormVisibilityMock = {
	formRepresentation: {
		id: 'form-a6af80b9-d200-4a00-b17a-b1309691493d',
		name: 'regresion',
		description: '',
		version: 0,
		standAlone: true,
		formDefinition: {
			tabs: [],
			fields: [
				{
					id: '09913af9-f91a-4ba5-ae4c-8e6ff3e21b6f',
					name: 'Label',
					type: 'container',
					tab: null,
					numberOfColumns: 2,
					fields: {
						1: [
							{
								id: 'Checkbox0pr51m',
								name: 'Checkbox1',
								type: 'boolean',
								readOnly: false,
								required: true,
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
								id: 'Checkbox0fp0zf',
								name: 'Checkbox2',
								type: 'boolean',
								readOnly: false,
								required: false,
								colspan: 1,
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
					id: '45086850-c83d-4bfc-bd94-eccd9634c4ce',
					name: 'Label',
					type: 'container',
					tab: null,
					numberOfColumns: 2,
					fields: {
						1: [
							{
								id: 'Checkbox0lb7ze',
								name: 'Checkbox',
								type: 'boolean',
								readOnly: false,
								required: false,
								colspan: 1,
								visibilityCondition: {
									leftType: 'field',
									leftValue: 'Checkbox0pr51m',
									operator: '==',
									rightValue: 'Checkbox0fp0zf',
									rightType: 'field',
									nextConditionOperator: '',
									nextCondition: null
								},
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

export const dateWidgetFormVisibilityMock = {
    formRepresentation: {
        id: 'form-7376baca-c855-473f-9d1f-508ceac9e8e5',
        name: 'DateVisibility',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'f8b5b91f-77b9-48dc-8316-f084db369012',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Text5asd0a',
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
                                id: 'Date8wbe3d',
                                name: 'Date',
                                type: 'date',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minValue: null,
                                maxValue: null,
                                visibilityCondition: {
                                    leftFormFieldId: 'Text5asd0a',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'Date',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: '',
                                    nextCondition: null
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                dateDisplayFormat: 'D-M-YYYY'
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

export const multilineWidgetFormVisibilityMock = {
    formRepresentation: {
        id: 'form-af31c6e7-8cd1-4737-8555-43ed7ecf82bb',
        name: 'Mulktilinetextwidget',
        description: 'Multi Line Text Widget Description',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'a99d8eca-bff1-432c-bbd5-cccb60b54a82',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'MultilineTextId',
                                name: 'Multi Line Label',
                                type: 'multi-line-text',
                                colspan: 2,
                                placeholder: 'Some Placeholder Text',
                                minLength: 2,
                                maxLength: 10,
                                regexPattern: '[a-z]+[0-9]',
                                required: true,
                                visibilityCondition: {
                                    leftFormFieldId: 'Text',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'text',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: 'or',
                                    nextCondition: {
                                        leftFormFieldId: 'Text',
                                        leftRestResponseId: '',
                                        operator: '==',
                                        rightValue: 'text1',
                                        rightType: null,
                                        rightFormFieldId: '',
                                        rightRestResponseId: '',
                                        nextConditionOperator: 'or',
                                        nextCondition: {
                                            leftFormFieldId: 'Text',
                                            leftRestResponseId: '',
                                            operator: 'empty',
                                            rightValue: '',
                                            rightType: null,
                                            rightFormFieldId: '',
                                            rightRestResponseId: '',
                                            nextConditionOperator: '',
                                            nextCondition: null
                                        }
                                    }
                                },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                }
                            },
                            {
                                id: 'Text',
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
                        2: []
                    }
                }
            ],
            outcomes: [],
            metadata: {},
            variables: [
                {
                    id: '946ed79c-c7cf-4373-b741-4e9d8d8b7f36',
                    name: 'name',
                    type: 'string',
                    value: 'stringValue'
                }
            ]
        }
    }
};

export const displayTextWidgetFormVisibilityMock = {
    formRepresentation: {
        id: 'form-620756a5-64ce-4c3a-8aa2-81dabc9a88b6',
        name: 'displayTextForm',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: '45269202-5f2a-438e-b14c-fe13eb4b2aa1',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'Text0tzu53',
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
                                id: 'Displaytext0q4w02',
                                name: 'Display text',
                                type: 'readonly-text',
                                value: 'Display text as part of the form',
                                colspan: 1,
                                visibilityCondition: {
                                    leftType: 'field',
                                    leftValue: 'Text0tzu53',
                                    operator: '==',
                                    rightValue: 'aaa-value',
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
                        3: [
                            {
                                id: 'Displaytext8bac2e',
                                name: 'Display text',
                                type: 'readonly-text',
                                value: 'Display text as part of the form',
                                colspan: 1,
                                visibilityCondition: {
                                    leftType: 'field',
                                    leftValue: 'Text0tzu53',
                                    operator: '==',
                                    rightValue: 'variable',
                                    rightType: 'variable',
                                    nextConditionOperator: ''
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
            variables: [
                {
                    id: '8a8537a6-cfca-45d3-bd42-80ffc48a26f8',
                    name: 'variable',
                    type: 'string',
                    value: 'aaa-variable'
                }
            ]
        }
    }
};
