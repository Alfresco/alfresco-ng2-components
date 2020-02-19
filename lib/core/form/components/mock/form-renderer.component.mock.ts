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

export const formDisplayValueVisibility = {formRepresentation: {
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
 }};

export const formDisplayValueForm = { formRepresentation : {
        id: 'form-3dd0f2a3-c20a-4195-a760-1db42ec7dcd4',
        name: 'displayValue',
        description: '',
        version: 0,
        formDefinition: {
            'tabs': [],
            'fields': [
                {
                    'id': 'c54f6956-bcf9-4109-a6c1-1daff773936b',
                    'name': 'Label',
                    'type': 'container',
                    'tab': null,
                    'numberOfColumns': 2,
                    'fields': {
                        '1': [
                            {
                                'id': 'DisplayValueColspan',
                                'name': 'DisplayValueColspan',
                                'type': 'readonly',
                                'value': 'No field selected',
                                'colspan': 2,
                                'visibilityCondition': null,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2,
                                    'field': {
                                        'id': 'Displayvalue0hwgvb',
                                        'name': 'Display value',
                                        'type': 'text'
                                    }
                                }
                            },
                            {
                                'id': 'DisplayValueFieldValue',
                                'name': 'DisplayValueFieldValue',
                                'type': 'readonly',
                                'value': 'No field selected',
                                'colspan': 1,
                                'visibilityCondition': {
                                    'leftFormFieldId': 'TextOne',
                                    'leftRestResponseId': '',
                                    'operator': '==',
                                    'rightValue': 'aaa',
                                    'rightType': null,
                                    'rightFormFieldId': '',
                                    'rightRestResponseId': '',
                                    'nextConditionOperator': '',
                                    'nextCondition': null
                                },
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2,
                                    'field': {
                                        'id': 'Displayvalue0pjsfi',
                                        'name': 'Display value',
                                        'type': 'text'
                                    }
                                }
                            },
                            {
                                'id': 'DisplayValueVariableField',
                                'name': 'DisplayValueVariableField',
                                'type': 'readonly',
                                'value': 'No field selected',
                                'colspan': 1,
                                'visibilityCondition': {
                                    'leftFormFieldId': '',
                                    'leftRestResponseId': 'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                                    'operator': '==',
                                    'rightValue': '',
                                    'rightType': null,
                                    'rightFormFieldId': 'TextOne',
                                    'rightRestResponseId': '',
                                    'nextConditionOperator': '',
                                    'nextCondition': null
                                },
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2,
                                    'field': {
                                        'id': 'Displayvalue0sss8o',
                                        'name': 'Display value',
                                        'type': 'text'
                                    }
                                }
                            },
                            {
                                'id': 'DisplayValueFieldVariable',
                                'name': 'DisplayValueFieldVariable',
                                'type': 'readonly',
                                'value': 'No field selected',
                                'colspan': 1,
                                'visibilityCondition': {
                                    'leftFormFieldId': 'TextOne',
                                    'leftRestResponseId': '',
                                    'operator': '==',
                                    'rightValue': '',
                                    'rightType': null,
                                    'rightFormFieldId': '',
                                    'rightRestResponseId': 'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                                    'nextConditionOperator': '',
                                    'nextCondition': null
                                },
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2,
                                    'field': {
                                        'id': 'Displayvalue0mkrml',
                                        'name': 'Display value',
                                        'type': 'text'
                                    }
                                }
                            },
                            {
                                'id': 'DisplayValueOne',
                                'name': 'DisplayValueOne',
                                'type': 'readonly',
                                'value': 'No field selected',
                                'colspan': 1,
                                'visibilityCondition': {
                                    'leftFormFieldId': 'Text0howrc',
                                    'leftRestResponseId': '',
                                    'operator': '==',
                                    'rightValue': 'aaa',
                                    'rightType': null,
                                    'rightFormFieldId': '',
                                    'rightRestResponseId': '',
                                    'nextConditionOperator': 'and',
                                    'nextCondition': {
                                        'leftFormFieldId': 'TextTwo',
                                        'leftRestResponseId': '',
                                        'operator': '!=',
                                        'rightValue': 'aaa',
                                        'rightType': null,
                                        'rightFormFieldId': '',
                                        'rightRestResponseId': '',
                                        'nextConditionOperator': '',
                                        'nextCondition': null
                                    }
                                },
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2,
                                    'field': {
                                        'id': 'Displayvalue00ldqe',
                                        'name': 'Display value',
                                        'type': 'text'
                                    }
                                }
                            }
                        ],
                        '2': [
                            {
                                'id': 'Text0howrc',
                                'name': 'Text',
                                'type': 'text',
                                'required': false,
                                'colspan': 1,
                                'placeholder': null,
                                'minLength': 0,
                                'maxLength': 0,
                                'regexPattern': null,
                                'visibilityCondition': null,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2
                                }
                            },
                            {
                                'id': 'TextOne',
                                'name': 'TextOne',
                                'type': 'text',
                                'required': false,
                                'colspan': 1,
                                'placeholder': null,
                                'minLength': 0,
                                'maxLength': 0,
                                'regexPattern': null,
                                'visibilityCondition': null,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2
                                }
                            },
                            {
                                'id': 'TextTwo',
                                'name': 'TextTwo',
                                'type': 'text',
                                'required': false,
                                'colspan': 1,
                                'placeholder': null,
                                'minLength': 0,
                                'maxLength': 0,
                                'regexPattern': null,
                                'visibilityCondition': null,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2
                                }
                            },
                            {
                                'id': 'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                                'name': 'vstring',
                                'type': 'readonly',
                                'value': 'Show value of vstring',
                                'colspan': 1,
                                'visibilityCondition': null,
                                'params': {
                                    'existingColspan': 1,
                                    'maxColspan': 2,
                                    'field': {
                                        'id': 'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                                        'name': 'vstring',
                                        'type': 'string'
                                    }
                                }
                            }
                        ]
                    }
                }
            ],
            'outcomes': [],
            'metadata': {},
            'variables': [
                {
                    'id': 'bcdfe3af-d635-40ee-b9fd-4f9d3655d77b',
                    'name': 'vstring',
                    'type': 'string',
                    'value': 'aaa'
                }
            ]
        }
 }};

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
