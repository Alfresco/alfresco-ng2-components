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
export const fieldVariablesForm = `{
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
                                "id": "Text01kr9j",
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
                                "id": "Checkbox00z50n",
                                "name": "Checkbox",
                                "type": "boolean",
                                "required": false,
                                "colspan": 1,
                                "visibilityCondition": {
                                    "leftFormFieldId": null,
                                    "leftRestResponseId": "5da19b52-9686-4fa5-b3b5-a088d6cdfb03",
                                    "operator": "==",
                                    "rightValue": "",
                                    "rightType": null,
                                    "rightFormFieldId": "Text01kr9j",
                                    "rightRestResponseId": "",
                                    "nextConditionOperator": ""
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
            "variables": [
                {
                    "id": "5da19b52-9686-4fa5-b3b5-a088d6cdfb03",
                    "name": "stringVar",
                    "type": "string",
                    "value": "showCheckbox"
                }
            ]
        }
    }
}`;
