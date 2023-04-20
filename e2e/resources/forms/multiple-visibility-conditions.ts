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

export const multipleVisibilityFormJson = {
    formRepresentation: {
        id: 'form-417ec60f-59ec-4990-a3b4-674f2c90af8a',
        name: 'testtesttest',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [
                 {
                    id: '693934b1-fb52-45db-8ec0-f0d0f0accbed',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 6,
                    fields: {
                        1: [
                             {
                                id: 'CheckboxReq',
                                name: 'CheckboxReq',
                                type: 'boolean',
                                required: true,
                                colspan: 1,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                 }
                             },
                             {
                                id: 'CheckboxNotReq',
                                name: 'CheckboxNotReq',
                                type: 'boolean',
                                required: false,
                                colspan: 1,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                 }
                             },
                             {
                                id: 'CheckboxColspan',
                                name: 'CheckboxColspan',
                                type: 'boolean',
                                required: false,
                                colspan: 2,
                                visibilityCondition: null,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                 }
                             },
                             {
                                id: 'CheckboxBasicFieldValue',
                                name: 'CheckboxBasicFieldValue',
                                type: 'boolean',
                                required: false,
                                colspan: 1,
                                 visibilityCondition: {
                                     leftType: 'field',
                                     leftValue: 'textone',
                                     operator: '==',
                                     rightValue: 'aaa',
                                     rightType: 'value',
                                     nextConditionOperator: 'and-not',
                                     nextCondition: {
                                         leftType: 'field',
                                         leftValue: 'texttwo',
                                         operator: '==',
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
                             },
                             {
                                id: 'CheckboxBasicFieldVariable',
                                name: 'CheckboxBasicFieldVariable',
                                type: 'boolean',
                                required: false,
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: 'textOne',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: '',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '948aa549-5011-423e-b8a2-020e69daae5f',
                                    nextConditionOperator: '',
                                    nextCondition: null
                                 },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                 }
                             },
                             {
                                id: 'CheckboxBasicVariableField',
                                name: 'CheckboxBasicVariableField',
                                type: 'boolean',
                                required: false,
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: '',
                                    leftRestResponseId: '948aa549-5011-423e-b8a2-020e69daae5f',
                                    operator: '==',
                                    rightValue: '',
                                    rightType: null,
                                    rightFormFieldId: 'textOne',
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
                                id: 'CheckboxMultiple',
                                name: 'CheckboxMultiple',
                                type: 'boolean',
                                required: false,
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: 'textOne',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'aaa',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftFormFieldId: 'textTwo',
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
                                    maxColspan: 2
                                 }
                             },
                             {
                                id: 'checkboxone',
                                name: 'CheckboxOne',
                                type: 'boolean',
                                required: false,
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: 'textOne',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: 'aaa',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftFormFieldId: 'textTwo',
                                        leftRestResponseId: '',
                                        operator: '!=',
                                        rightValue: 'aaa',
                                        rightType: null,
                                        rightFormFieldId: '',
                                        rightRestResponseId: '',
                                        nextConditionOperator: 'and-not',
                                        nextCondition: {
                                            leftFormFieldId: 'textThree',
                                            leftRestResponseId: '',
                                            operator: 'empty',
                                            rightValue: '',
                                            rightType: null,
                                            rightFormFieldId: '',
                                            rightRestResponseId: '',
                                            nextConditionOperator: 'or',
                                            nextCondition: {
                                                leftFormFieldId: 'textfour',
                                                leftRestResponseId: '',
                                                operator: '!empty',
                                                rightValue: 'aaa',
                                                rightType: null,
                                                rightFormFieldId: '',
                                                rightRestResponseId: '',
                                                nextConditionOperator: 'or-not',
                                                nextCondition: {
                                                    leftFormFieldId: 'textfive',
                                                    leftRestResponseId: '',
                                                    operator: '==',
                                                    rightValue: 'aaa',
                                                    rightType: null,
                                                    rightFormFieldId: '',
                                                    rightRestResponseId: '',
                                                    nextConditionOperator: '',
                                                    nextCondition: null
                                                 }
                                             }
                                         }
                                     }
                                 },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                 }
                             },
                             {
                                id: 'checkboxtworeq',
                                name: 'CheckboxTwoReq',
                                type: 'boolean',
                                required: true,
                                colspan: 2,
                                visibilityCondition: {
                                    leftFormFieldId: '',
                                    leftRestResponseId: '948aa549-5011-423e-b8a2-020e69daae5f',
                                    operator: '==',
                                    rightValue: '',
                                    rightType: null,
                                    rightFormFieldId: 'textTwo',
                                    rightRestResponseId: '',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftFormFieldId: '',
                                        leftRestResponseId: '08f66ebb-1e5c-4ae4-a8cc-ec9c674d1e40',
                                        operator: '!=',
                                        rightValue: '',
                                        rightType: null,
                                        rightFormFieldId: 'textOne',
                                        rightRestResponseId: '',
                                        nextConditionOperator: 'and-not',
                                        nextCondition: {
                                            leftFormFieldId: '',
                                            leftRestResponseId: '888786b1-e948-4e7a-9caa-deb2583d222f',
                                            operator: '!=',
                                            rightValue: '',
                                            rightType: null,
                                            rightFormFieldId: 'textThree',
                                            rightRestResponseId: '',
                                            nextConditionOperator: 'or',
                                            nextCondition: {
                                                leftFormFieldId: '',
                                                leftRestResponseId: '5007cf47-aa68-42c0-b1ab-a98f0dff6bdc',
                                                operator: '!=',
                                                rightValue: '',
                                                rightType: null,
                                                rightFormFieldId: 'textfour',
                                                rightRestResponseId: '',
                                                nextConditionOperator: 'or-not',
                                                nextCondition: {
                                                    leftFormFieldId: '',
                                                    leftRestResponseId: '948aa549-5011-423e-b8a2-020e69daae5f',
                                                    operator: '==',
                                                    rightValue: '',
                                                    rightType: null,
                                                    rightFormFieldId: 'textfive',
                                                    rightRestResponseId: '',
                                                    nextConditionOperator: '',
                                                    nextCondition: null
                                                 }
                                             }
                                         }
                                     }
                                 },
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                 }
                             },
                             {
                                id: 'checkboxthree',
                                name: 'CheckboxThree',
                                type: 'boolean',
                                required: false,
                                colspan: 1,
                                visibilityCondition: {
                                    leftFormFieldId: 'textOne',
                                    leftRestResponseId: '',
                                    operator: '==',
                                    rightValue: '',
                                    rightType: null,
                                    rightFormFieldId: '',
                                    rightRestResponseId: '948aa549-5011-423e-b8a2-020e69daae5f',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftFormFieldId: 'textTwo',
                                        leftRestResponseId: '',
                                        operator: '!=',
                                        rightValue: '',
                                        rightType: null,
                                        rightFormFieldId: '',
                                        rightRestResponseId: '08f66ebb-1e5c-4ae4-a8cc-ec9c674d1e40',
                                        nextConditionOperator: 'and-not',
                                        nextCondition: {
                                            leftFormFieldId: 'textThree',
                                            leftRestResponseId: '',
                                            operator: '!=',
                                            rightValue: '',
                                            rightType: null,
                                            rightFormFieldId: '',
                                            rightRestResponseId: '888786b1-e948-4e7a-9caa-deb2583d222f',
                                            nextConditionOperator: 'or',
                                            nextCondition: {
                                                leftFormFieldId: 'textfour',
                                                leftRestResponseId: '',
                                                operator: '!=',
                                                rightValue: '',
                                                rightType: null,
                                                rightFormFieldId: '',
                                                rightRestResponseId: '5007cf47-aa68-42c0-b1ab-a98f0dff6bdc',
                                                nextConditionOperator: 'or-not',
                                                nextCondition: {
                                                    leftFormFieldId: 'textfive',
                                                    leftRestResponseId: '',
                                                    operator: '==',
                                                    rightValue: '',
                                                    rightType: null,
                                                    rightFormFieldId: '',
                                                    rightRestResponseId: '948aa549-5011-423e-b8a2-020e69daae5f',
                                                    nextConditionOperator: '',
                                                    nextCondition: null
                                                 }
                                             }
                                         }
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
                                id: 'textOne',
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
                        3: [
                             {
                                id: 'textTwo',
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
                        4: [
                             {
                                id: 'textThree',
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
                         ],
                        5: [
                             {
                                id: 'textfour',
                                name: 'TextFour',
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
                        6: [
                             {
                                id: 'textfive',
                                name: 'TextFive',
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
            variables: [
                 {
                    id: '948aa549-5011-423e-b8a2-020e69daae5f',
                    name: 'vstring',
                    type: 'string',
                    value: 'aaa'
                 },
                 {
                    id: '08f66ebb-1e5c-4ae4-a8cc-ec9c674d1e40',
                    name: 'vint',
                    type: 'integer',
                    value: 5
                 },
                 {
                    id: '888786b1-e948-4e7a-9caa-deb2583d222f',
                    name: 'vbool',
                    type: 'boolean',
                    value: true
                 },
                 {
                    id: '5007cf47-aa68-42c0-b1ab-a98f0dff6bdc',
                    name: 'vdate',
                    type: 'date',
                    value: '2019-05-10'
                 }
             ]
         }
     }
 };

export const multipleTextVisibilityFormJson = {
    formRepresentation: {
        id: 'form-1fc64874-5fa9-4eb0-be06-61abd51abef7',
        name: 'form2',
        description: '',
        version: 0,
        standAlone: true,
        formDefinition: {
            tabs: [],
            fields: [
                {
                    id: 'e6071f44-50cf-4b51-8b69-651df3ca4509',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'textOne',
                                name: 'Text1',
                                type: 'text',
                                required: false,
                                colspan: 1,
                                placeholder: null,
                                minLength: 0,
                                maxLength: 0,
                                regexPattern: null,
                                visibilityCondition: {
                                    leftType: 'field',
                                    leftValue: 'textTwo',
                                    operator: '!=',
                                    rightValue: 'test',
                                    rightType: 'value',
                                    nextConditionOperator: 'or-not',
                                    nextCondition: {
                                        leftType: 'field',
                                        leftValue: 'textThree',
                                        operator: '==',
                                        rightValue: 'test',
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
                                id: 'textTwo',
                                name: 'Text2',
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
                    id: '4f086395-6f63-47c7-aeda-f315ae5b3891',
                    name: 'Label',
                    type: 'container',
                    tab: null,
                    numberOfColumns: 2,
                    fields: {
                        1: [
                            {
                                id: 'textThree',
                                name: 'Text3',
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
