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
export const variableVisibilityForm = `{
	"formRepresentation": {
		"id": "form-a67ae1e7-1424-4d27-affa-212327064c86",
		"name": "visibility",
		"description": "",
		"version": 0,
		"formDefinition": {
			"tabs": [],
			"fields": [
				{
					"id": "91628020-1573-4dc1-a0e4-1af2d05ad25d",
					"name": "Label",
					"type": "container",
					"tab": null,
					"numberOfColumns": 2,
					"fields": {
						"1": [
							{
								"id": "Text080j0t",
								"name": "Text",
								"type": "text",
								"required": false,
								"colspan": 1,
								"placeholder": null,
								"minLength": 0,
								"maxLength": 0,
								"regexPattern": null,
								"visibilityCondition": null,
								"params": {
									"existingColspan": 1,
									"maxColspan": 2
								}
							}
						],
						"2": [
							{
								"id": "Checkbox0o7gb5",
								"name": "Checkbox",
								"type": "boolean",
								"required": false,
								"colspan": 1,
								"visibilityCondition": {
									"leftFormFieldId": "",
									"leftRestResponseId": "a27f6512-2ac5-48c9-81aa-e0ac94bfce6c",
									"operator": "==",
									"rightValue": "true",
									"rightType": null,
									"rightFormFieldId": "",
									"rightRestResponseId": "",
									"nextConditionOperator": "",
									"nextCondition": null
								},
								"params": {
									"existingColspan": 1,
									"maxColspan": 2
								}
							}
						]
					}
				}
			],
			"outcomes": [
				{
					"id": "36d71f08-7d39-43ca-bd08-877f4e9ee859",
					"name": "New Outcome"
				}
			],
			"metadata": {},
			"variables": [
				{
					"id": "a27f6512-2ac5-48c9-81aa-e0ac94bfce6c",
					"name": "showCheck",
					"type": "boolean",
					"value": false
				}
			]
		}
	}
}`;
