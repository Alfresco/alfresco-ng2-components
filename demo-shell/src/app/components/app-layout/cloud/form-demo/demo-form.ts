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

export const formDefinition = `{
    "formRepresentation": {
      "id": "text-form",
      "name": "test-start-form",
      "version": 0,
      "description": "",
      "formDefinition": {
        "tabs": [],
        "fields": [
          {
            "id": "1511517333638",
            "type": "container",
            "fieldType": "ContainerRepresentation",
            "name": "Label",
            "tab": null,
            "numberOfColumns": 2,
            "fields": {
              "1": [
                {
                  "fieldType": "FormFieldRepresentation",
                  "id": "texttest",
                  "name": "texttest",
                  "type": "text",
                  "value": null,
                  "required": false,
                  "placeholder": "text",
                  "params": {
                    "existingColspan": 2,
                    "maxColspan": 6,
                    "inputMaskReversed": true,
                    "inputMask": "0#",
                    "inputMaskPlaceholder": "(0-9)"
                  }
                }
              ],
              "2": [{
                              "fieldType": "AttachFileFieldRepresentation",
                              "id": "attachfiletest",
                              "name": "attachfiletest",
                              "type": "upload",
                              "required": true,
                              "colspan": 2,
                              "placeholder": "attachfile",
                              "params": {
                                  "existingColspan": 2,
                                  "maxColspan": 2,
                                  "fileSource": {
                                          "serviceId": "local-file",
                                          "name": "Local File"
                                  },
                                  "multiple": true,
                                  "link": false
                          },
                              "visibilityCondition": {
                              }
                          }]
            }
          }
        ],
        "outcomes": [],
        "metadata": {
          "property1": "value1",
          "property2": "value2"
        },
        "variables": [
          {
            "name": "variable1",
            "type": "string",
            "value": "value1"
          },
          {
            "name": "variable2",
            "type": "string",
            "value": "value2"
          }
        ]
      }
    }}
  `;
