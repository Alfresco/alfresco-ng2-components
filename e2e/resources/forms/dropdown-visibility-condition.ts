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

export const dropdownVisibilityFormJson = {
    formRepresentation : {
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
