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
                        '1': [
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
                        '2': [
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
                        '1': [
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
                        '2': [
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
                        '1': [
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
                        '2': [
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
                        '1': [
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
                        '2': []
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
                        '1': [
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
                        '2': [
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
                               '1': [
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
                               '2': [
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
                               '1': [
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
                               '2': [
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
                               '1': [
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
                               '1': [
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
                               '2': [
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
                               '1': [
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
                        '1': [
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
                        '2': []
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
                               '1': [
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
                               '2': []
                           }
                       }
                   ],
                   outcomes: [],
                   metadata: {},
                   variables: []
               }
           }
};
