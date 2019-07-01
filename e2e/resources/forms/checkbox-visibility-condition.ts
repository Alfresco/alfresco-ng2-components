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
export const checkboxVisibilityForm = `{
    "formRepresentation": {
        "id": "form-412cdeab-de90-4099-875f-676366e48fc9",
        "name": "test",
        "description": "",
        "version": 0,
        "formDefinition": {
            "tabs": [],
            "fields": [
                {
                    "id": "85a4f564-2c70-438a-ae0f-b9c8af4887c2",
                    "name": "Label",
                    "type": "container",
                    "tab": null,
                    "numberOfColumns": 2,
                    "fields": {
                        "1": [
                            {
                                "id": "CheckboxFieldField",
                                "name": "CheckboxFieldField",
                                "type": "boolean",
                                "required": false,
                                "colspan": 1,
                                "visibilityCondition": {
                                    "leftFormFieldId": "textOne",
                                    "leftRestResponseId": "",
                                    "operator": "==",
                                    "rightValue": "",
                                    "rightType": null,
                                    "rightFormFieldId": "textTwo",
                                    "rightRestResponseId": "",
                                    "nextConditionOperator": ""
                                },
                                "params": {
                                    "existingColspan": 1,
                                    "maxColspan": 2
                                }
                            },
                            {
                                "id": "CheckboxFieldVariable",
                                "name": "CheckboxFieldVariable",
                                "type": "boolean",
                                "required": false,
                                "colspan": 1,
                                "visibilityCondition": {
                                    "leftFormFieldId": "textOne",
                                    "leftRestResponseId": "",
                                    "operator": "==",
                                    "rightValue": "",
                                    "rightType": null,
                                    "rightFormFieldId": "",
                                    "rightRestResponseId": "cbc51284-04c4-462f-ab72-2b9f8b14907b",
                                    "nextConditionOperator": ""
                                },
                                "params": {
                                    "existingColspan": 1,
                                    "maxColspan": 2
                                }
                            },
                            {
                                "id": "CheckboxFieldValue",
                                "name": "CheckboxFieldValue",
                                "type": "boolean",
                                "required": false,
                                "colspan": 1,
                                "visibilityCondition": {
                                    "leftFormFieldId": "textOne",
                                    "leftRestResponseId": "",
                                    "operator": "==",
                                    "rightValue": "showCheckbox",
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
                            },
                            {
                                "id": "CheckboxVariableValue",
                                "name": "CheckboxVariableValue",
                                "type": "boolean",
                                "required": false,
                                "colspan": 1,
                                "visibilityCondition": {
                                    "leftFormFieldId": "",
                                    "leftRestResponseId": "cbc51284-04c4-462f-ab72-2b9f8b14907b",
                                    "operator": "==",
                                    "rightValue": "showCheckbox",
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
                            },
                            {
                                "id": "CheckboxVariableVariable",
                                "name": "CheckboxVariableVariable",
                                "type": "boolean",
                                "required": false,
                                "colspan": 1,
                                "visibilityCondition": {
                                    "leftFormFieldId": "",
                                    "leftRestResponseId": "cbc51284-04c4-462f-ab72-2b9f8b14907b",
                                    "operator": "==",
                                    "rightValue": "",
                                    "rightType": null,
                                    "rightFormFieldId": "",
                                    "rightRestResponseId": "87df371a-4238-43f8-92e5-ef3f6a19f379",
                                    "nextConditionOperator": "",
                                    "nextCondition": null
                                },
                                "params": {
                                    "existingColspan": 1,
                                    "maxColspan": 2
                                }
                            },
                            {
                                "id": "CheckboxVariableField",
                                "name": "CheckboxVariableField",
                                "type": "boolean",
                                "required": false,
                                "colspan": 1,
                                "visibilityCondition": {
                                    "leftFormFieldId": "",
                                    "leftRestResponseId": "cbc51284-04c4-462f-ab72-2b9f8b14907b",
                                    "operator": "==",
                                    "rightValue": "",
                                    "rightType": null,
                                    "rightFormFieldId": "textOne",
                                    "rightRestResponseId": "",
                                    "nextConditionOperator": "",
                                    "nextCondition": null
                                },
                                "params": {
                                    "existingColspan": 1,
                                    "maxColspan": 2
                                }
                            }
                        ],
                        "2": [
                            {
                                "id": "textOne",
                                "name": "textOne",
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
                            },
                            {
                                "id": "textTwo",
                                "name": "textTwo",
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
                        ]
                    }
                }
            ],
            "outcomes": [],
            "metadata": {},
            "variables": [
                {
                    "id": "cbc51284-04c4-462f-ab72-2b9f8b14907b",
                    "name": "varString1",
                    "type": "string",
                    "value": "showCheckbox"
                },
                {
                    "id": "87df371a-4238-43f8-92e5-ef3f6a19f379",
                    "name": "varString2",
                    "type": "string",
                    "value": "showCheckbox"
                }
            ]
        }
    }
}`;
