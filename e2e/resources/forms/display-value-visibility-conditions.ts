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

export const displayValueTextJson = {
     formRepresentation : {
     id :  'form-340a2672-429b-454f-9bb1-7b4d7362bb89' ,
         name :  'display-one' ,
         description : '',
         version : 0,
         standAlone : true,
         formDefinition : {
         tabs : [],
             fields : [
            {
                 id :  'ce6459d8-08c8-4424-af02-6117a20548c9' ,
                 name :  'Label' ,
                 type :  'container' ,
                 tab : null,
                 numberOfColumns : 2,
                 fields : {
                     1 : [
                        {
                             id :  'TextOne' ,
                             name :  'TextOne' ,
                             type :  'text' ,
                             required : false,
                             colspan : 1,
                             placeholder : null,
                             minLength : 0,
                             maxLength : 0,
                             regexPattern : null,
                             visibilityCondition : null,
                             params : {
                                 existingColspan : 1,
                                 maxColspan : 2
                            }
                        },
                        {
                             id :  'TextTwo' ,
                             name :  'TextTwo' ,
                             type :  'text',
                             required : false,
                             colspan : 1,
                             placeholder : null,
                             minLength : 0,
                             maxLength : 0,
                             regexPattern : null,
                             visibilityCondition : null,
                             params : {
                                 existingColspan : 1,
                                 maxColspan : 2
                            }
                        },
                        {
                             id :  'DisplayValueNoCondition' ,
                             name :  'Display value - NoCondition' ,
                             type :  'readonly' ,
                             value : 'No cats' ,
                             colspan : 1,
                             visibilityCondition : null,
                             params : {
                                 existingColspan : 1,
                                 maxColspan : 2,
                                 field : {
                                     id :  '12f8a718-1e79-4b1d-96f2-7f1a9b15a477',
                                     name :  'NoCondition',
                                     type :  'string'
                                },
                                 responseVariable : true
                            }
                        }
                    ],
                     2 : [
                        {
                             id : 'DisplayValueSingleCondition' ,
                             name :  'Display value - SingleCondition' ,
                             type :  'readonly' ,
                             value :  'cat' ,
                             colspan : 1,
                             visibilityCondition : {
                                 leftType :  'field',
                                 leftValue :  'TextOne' ,
                                 operator : '==',
                                 rightValue :  'cat' ,
                                 rightType :  'value',
                                 nextConditionOperator :  '' ,
                                 nextCondition : null
                            },
                             params : {
                                 existingColspan : 1,
                                 maxColspan : 2,
                                 field : {
                                     id :  '928c5dce-0ee4-4de3-8775-975eda5a4543' ,
                                     name :  'StringTextDisplayed' ,
                                     type :  'string'
                                },
                                 responseVariable : true
                            }
                        },
                        {
                             id :  'DisplayValueMultipleCondition' ,
                             name :  'Display value - MultipleConditions' ,
                             type :  'readonly' ,
                             value :  'more cats' ,
                             colspan : 1,
                             visibilityCondition : {
                                 leftType :  'field',
                                 leftValue :  'TextOne',
                                 operator :  '==',
                                 rightValue : 'cat',
                                 rightType :  'value' ,
                                 nextConditionOperator :  'and' ,
                                 nextCondition : {
                                     leftType :  'field' ,
                                     leftValue :  'TextTwo' ,
                                     operator : '!=',
                                     rightValue :  'cat' ,
                                     rightType :  'value' ,
                                     nextConditionOperator :'',
                                     nextCondition : null
                                }
                            },
                             params : {
                                 existingColspan : 1,
                                 maxColspan : 2,
                                 field : {
                                     id :  'c74e945f-80dd-4adf-8393-fd644772b4a4' ,
                                     name :  'MultipleConditions' ,
                                     type :  'string'
                                },
                                 responseVariable : true
                            }
                        }
                    ]
                }
            }
        ],
             outcomes : [],
             metadata : {},
         variables : [
            {
                 id :  '928c5dce-0ee4-4de3-8775-975eda5a4543' ,
                 name :  'SingleCondition' ,
                 type :  'string',
                 value :  'cat'
            },
            {
                 id :  'c74e945f-80dd-4adf-8393-fd644772b4a4',
                 name :  'MultipleConditions',
                 type :  'string',
                 value :  'more cats'
            },
            {
                 id :  '12f8a718-1e79-4b1d-96f2-7f1a9b15a477',
                 name :  'NoCondition',
                 type :  'string',
                 value :  'No cats'
            }
        ]
    }
}

};


