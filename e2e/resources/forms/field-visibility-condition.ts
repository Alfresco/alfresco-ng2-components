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
export const fieldVisibilityForm = `{
	"formRepresentation": {
		"id": "form-a67ae1e7-1424-4d27-affa-212327064c86",
		"name": "visibility",
		"description": "",
		"version": 0,
		"formDefinition": {
			"tabs": [],
			"fields": [
				{
					"id": "6e09775f-0a60-421a-a493-ab43d881ceac",
					"name": "Label",
					"type": "container",
					"tab": null,
					"numberOfColumns": 2,
					"fields": {
						"1": [
							{
								"id": "Text0zfcc0",
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
								"id": "Checkbox0clbgk",
								"name": "Checkbox",
								"type": "boolean",
								"required": false,
								"colspan": 1,
								"visibilityCondition": {
									"leftFormFieldId": "Text0zfcc0",
									"leftRestResponseId": "",
									"operator": "==",
									"rightValue": "showCheck",
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
			"outcomes": [],
			"metadata": {},
			"variables": []
		}
	}
}`;
