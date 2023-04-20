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

export const dropdownVisibilityFormFieldJson = {
    formRepresentation: {
        id: 'form-3070ee8d-34d3-4c5a-9dd0-6b244f65d300',
        name: 'DropDownWidgetForm1',
        description: 'Simple dropdown',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [{
                id: '5e180610-1478-4f80-ad80-e4c57a18fbff',
                name: 'Label',
                type: 'container',
                tab: null,
                numberOfColumns: 2,
                fields: {
                    1: [{
                            id: 'textFour',
                            name: 'textFour',
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
                            id: 'numberOne',
                            name: 'numberOne',
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
                            id: 'amountOne',
                            name: 'amountOne',
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
                    ],
                    2: [{
                        id: 'dropdownOne',
                        name: 'dropdownOne',
                        type: 'dropdown',
                        required: false,
                        colspan: 1,
                        optionType: 'manual',
                        options: [{
                                id: 'empty',
                                name: 'Choose one...'
                            },
                            {
                                id: 'option_2',
                                name: '1'
                            },
                            {
                                id: 'option_3',
                                name: '2'
                            }
                        ],
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        visibilityCondition: {
                            leftFormFieldId: 'textFour',
                            leftRestResponseId: '',
                            operator: '==',
                            rightValue: 'text1',
                            rightType: null,
                            rightFormFieldId: '',
                            rightRestResponseId: '',
                            nextConditionOperator: 'and',
                            nextCondition: {
                                leftFormFieldId: 'numberOne',
                                leftRestResponseId: '',
                                operator: '==',
                                rightValue: '11',
                                rightType: null,
                                rightFormFieldId: '',
                                rightRestResponseId: '',
                                nextConditionOperator: 'and',
                                nextCondition: {
                                    leftFormFieldId: 'amountOne',
                                    leftRestResponseId: '',
                                    operator: '!=',
                                    rightValue: 90,
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
                    }]
                }
            }],
            outcomes: [],
            metadata: {},
            variables: []
        }
    }
};

export const dropdownVisibilityFormVariableJson = {
    formRepresentation: {
        id: 'form-8fe70790-ba51-4c46-8ef0-efc9044ed51c',
        name: 'SampleDropdown',
        description: '',
        version: 0,
        formDefinition: {
            tabs: [],
            fields: [{
                id: 'fde2c0bd-dbd6-4946-945e-4ab20aa1633a',
                name: 'Label',
                type: 'container',
                tab: null,
                numberOfColumns: 2,
                fields: {
                    1: [{
                        id: 'dropdownOne',
                        name: 'Dropdown',
                        type: 'dropdown',
                        required: false,
                        colspan: 1,
                        optionType: 'manual',
                        options: [{
                            id: 'empty',
                            name: 'Choose one...'
                        }, {
                            id: 'option_2',
                            name: '1'
                        }, {
                            id: 'option_3',
                            name: '2'
                        }],
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        visibilityCondition: {
                            leftType: 'variable',
                            leftValue: 'name',
                            operator: '==',
                            rightValue: 'value1',
                            rightType: 'value',
                            nextConditionOperator: 'and',
                            nextCondition: {
                                leftType: 'variable',
                                leftValue: 'number',
                                operator: '==',
                                rightValue: 11,
                                rightType: 'value',
                                nextConditionOperator: 'and',
                                nextCondition: {
                                    leftType: 'variable',
                                    leftValue: 'yesOrNo',
                                    operator: '==',
                                    rightValue: 'true',
                                    rightType: 'value',
                                    nextConditionOperator: 'and',
                                    nextCondition: {
                                        leftType: 'variable',
                                        leftValue: 'today',
                                        operator: '!=',
                                        rightValue: '2019-08-06',
                                        rightType: 'value',
                                        nextConditionOperator: '',
                                        nextCondition: null
                                    }
                                }
                            }
                        },
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }],
                    2: []
                }
            }],
            outcomes: [],
            metadata: {},
            variables: [{
                id: '74cdd5d3-120b-4926-995e-89e929a16c8f',
                name: 'name',
                type: 'string',
                value: 'value1'
            }, {
                id: '4a46531a-c217-4c08-99bb-c510b7c18e63',
                name: 'number',
                type: 'integer',
                value: 11
            }, {
                id: 'c469fbce-4039-4817-9d1c-5102ccc2bd26',
                name: 'yesOrNo',
                type: 'boolean',
                value: true
            }, {
                id: '36aa1031-3bbe-48f2-9d5d-465bf4158cb9',
                name: 'today',
                type: 'date',
                value: '2019-05-13'
            }]
        }
    }
};
