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

export const checkboxVisibilityFormJson = {
	formRepresentation: {
		id: 'form-fb9245f6-1132-47bd-b0b3-823bb85002da',
		name: 'test',
		description: '',
		version: 0,
		standalone: true,
		formDefinition: {
			tabs: [],
			fields: [
				{
					id: 'f3445185-b9af-41f7-a836-3b5712abeb0f',
					name: 'Label',
					type: 'container',
					tab: null,
					numberOfColumns: 2,
					fields: {
						1: [
							{
								id: 'CheckboxFieldField',
								name: 'CheckboxFieldField',
								type: 'boolean',
								required: false,
								colspan: 1,
								visibilityCondition: {
									leftType: 'field',
									leftValue: 'textOne',
									operator: '==',
									rightValue: 'textTwo',
									rightType: 'field',
									nextConditionOperator: '',
									nextCondition: null
								},
								params: {
									existingColspan: 1,
									maxColspan: 2
								}
							},
							{
								id: 'CheckboxFieldVariable',
								name: 'CheckboxFieldVariable',
								type: 'boolean',
								required: false,
								colspan: 1,
								visibilityCondition: {
									leftType: 'field',
									leftValue: 'textOne',
									operator: '==',
									rightValue: '33c60b43-2d44-4f25-bdc4-62b34ae11b43',
									rightType: 'variable',
									nextConditionOperator: ''
								},
								params: {
									existingColspan: 1,
									maxColspan: 2
								}
							},
							{
								id: 'CheckboxFieldValue',
								name: 'CheckboxFieldValue',
								type: 'boolean',
								required: false,
								colspan: 1,
								visibilityCondition: {
									leftType: 'field',
									leftValue: 'textOne',
									operator: '==',
									rightValue: 'showCheckbox',
									rightType: 'value',
									nextConditionOperator: '',
									nextCondition: null
								},
								params: {
									existingColspan: 1,
									maxColspan: 2
								}
							},
							{
								id: 'CheckboxVariableValue',
								name: 'CheckboxVariableValue',
								type: 'boolean',
								required: false,
								colspan: 1,
								visibilityCondition: {
									leftType: 'variable',
									leftValue: '33c60b43-2d44-4f25-bdc4-62b34ae11b43',
									operator: '==',
									rightValue: 'showCheckbox',
									rightType: 'value',
									nextConditionOperator: '',
									nextCondition: null
								},
								params: {
									existingColspan: 1,
									maxColspan: 2
								}
							},
							{
								id: 'CheckboxVariableVariable',
								name: 'CheckboxVariableVariable',
								type: 'boolean',
								required: false,
								colspan: 1,
								visibilityCondition: {
									leftType: 'variable',
									leftValue: '33c60b43-2d44-4f25-bdc4-62b34ae11b43',
									operator: '==',
									rightValue: '0e67eb99-46f7-424e-9a78-6df0faa5844d',
									rightType: 'variable',
									nextConditionOperator: '',
									nextCondition: null
								},
								params: {
									existingColspan: 1,
									maxColspan: 2
								}
							},
							{
								id: 'CheckboxVariableField',
								name: 'CheckboxVariableField',
								type: 'boolean',
								required: false,
								colspan: 1,
								visibilityCondition: {
									leftType: 'variable',
									leftValue: '33c60b43-2d44-4f25-bdc4-62b34ae11b43',
									operator: '==',
									rightValue: 'textOne',
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
						2: [
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
								visibilityCondition: null,
								params: {
									existingColspan: 1,
									maxColspan: 2
								}
							},
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
					id: '33c60b43-2d44-4f25-bdc4-62b34ae11b43',
					name: 'varString1',
					type: 'string',
					value: 'showCheckbox'
				},
				{
					id: '0e67eb99-46f7-424e-9a78-6df0faa5844d',
					name: 'varString2',
					type: 'string',
					value: 'showCheckbox'
				}
			]
		}
	}
};

export const multipleCheckboxVisibilityFormJson = {
	formRepresentation: {
		id: 'form-589a5b5d-da10-4af7-a5be-7dad2482dc19',
		name: 'newtestform',
		description: '',
		version: 0,
		standalone: true,
		formDefinition: {
			tabs: [],
			fields: [
				{
					id: '438a9089-2641-498d-8e84-ffad51ea8379',
					name: 'Label',
					type: 'container',
					tab: null,
					numberOfColumns: 2,
					fields: {
						1: [
							{
								id: 'Checkbox1',
								name: 'Checkbox1',
								type: 'boolean',
								required: false,
								colspan: 1,
								visibilityCondition: {
									leftType: 'field',
									leftValue: 'Checkbox2',
									operator: '!=',
									rightValue: 'Checkbox3',
									rightType: 'field',
									nextConditionOperator: '',
									nextCondition: null
								},
								params: {
									existingColspan: 1,
									maxColspan: 2
								}
							},
							{
								id: 'Checkbox2',
								name: 'Checkbox2',
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
								id: 'Checkbox3',
								name: 'Checkbox3',
								type: 'boolean',
								required: false,
								colspan: 1,
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
