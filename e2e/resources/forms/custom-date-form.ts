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
export const customDateFormAPS1 = `{
    "id": 18977,
    "name": "APS1customDateFrom",
    "description": "",
    "version": 1,
    "lastUpdatedBy": 1,
    "lastUpdatedByFullName": " Administrator",
    "lastUpdated": "2019-08-21T09:29:18.042+0000",
    "stencilSetId": 0,
    "referenceId": null,
    "formDefinition": {
        "tabs": [],
        "fields": [
            {
                "fieldType": "ContainerRepresentation",
                "id": "1566223482682",
                "name": "Label",
                "type": "container",
                "value": null,
                "required": false,
                "readOnly": false,
                "overrideId": false,
                "colspan": 1,
                "placeholder": null,
                "minLength": 0,
                "maxLength": 0,
                "minValue": null,
                "maxValue": null,
                "regexPattern": null,
                "optionType": null,
                "hasEmptyValue": null,
                "options": null,
                "restUrl": null,
                "restResponsePath": null,
                "restIdProperty": null,
                "restLabelProperty": null,
                "tab": null,
                "className": null,
                "dateDisplayFormat": null,
                "layout": null,
                "sizeX": 2,
                "sizeY": 1,
                "row": -1,
                "col": -1,
                "visibilityCondition": null,
                "numberOfColumns": 2,
                "fields": {
                    "1": [
                        {
                            "fieldType": "FormFieldRepresentation",
                            "id": "datefield",
                            "name": "DateField",
                            "type": "date",
                            "value": null,
                            "required": false,
                            "readOnly": false,
                            "overrideId": false,
                            "colspan": 1,
                            "placeholder": null,
                            "minLength": 0,
                            "maxLength": 0,
                            "minValue": "19-7-2019",
                            "maxValue": "19-8-2019",
                            "regexPattern": null,
                            "optionType": null,
                            "hasEmptyValue": null,
                            "options": null,
                            "restUrl": null,
                            "restResponsePath": null,
                            "restIdProperty": null,
                            "restLabelProperty": null,
                            "tab": null,
                            "className": null,
                            "params": {
                                "existingColspan": 1,
                                "maxColspan": 2
                            },
                            "dateDisplayFormat": "YY-M-D",
                            "layout": {
                                "row": -1,
                                "column": -1,
                                "colspan": 1
                            },
                            "sizeX": 1,
                            "sizeY": 1,
                            "row": -1,
                            "col": -1,
                            "visibilityCondition": null
                        }
                    ],
                    "2": []
                }
            }
        ],
        "outcomes": [],
        "javascriptEvents": [],
        "className": "",
        "style": "",
        "customFieldTemplates": {},
        "metadata": {},
        "variables": [],
        "customFieldsValueInfo": {},
        "gridsterForm": false
    }
}`;

export const customDateFormAPS2 = `{
   "formRepresentation":{
      "id":"form-71f621f5-7113-4bb8-a646-8fe36f27cdf4",
      "name":"APS2customDateForm",
      "description":"",
      "version":0,
      "standAlone":true,
      "formDefinition":{
         "tabs":[

         ],
         "fields":[
            {
               "id":"c207088c-e0f5-402e-8513-a865f3777c25",
               "name":"Label",
               "type":"container",
               "tab":null,
               "numberOfColumns":2,
               "fields":{
                  "1":[
                     {
                        "id":"datefield",
                        "name":"DateField",
                        "type":"date",
                        "required":false,
                        "colspan":1,
                        "placeholder":null,
                        "minValue":"2019-07-19",
                        "maxValue":"2019-08-19",
                        "visibilityCondition":null,
                        "params":{
                           "existingColspan":1,
                           "maxColspan":2
                        },
                        "dateDisplayFormat":"YY-M-D"
                     }
                  ],
                  "2":[

                  ]
               }
            }
         ],
         "outcomes":[

         ],
         "metadata":{

         },
         "variables":[

         ]
      }
   }
}`;
