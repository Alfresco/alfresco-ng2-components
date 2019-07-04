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

export class WidgetVisibilityModel {
        rightRestResponseId?: string;
        rightFormFieldId?: string;
        leftRestResponseId?: string;
        leftFormFieldId?: string;
        operator: string;
        nextCondition: WidgetVisibilityModel;
        nextConditionOperator: string;

        constructor(private json?: any) {
                if (json) {
                        this.operator = json.operator;
                        this.nextCondition = new WidgetVisibilityModel(json.nextCondition);
                        this.nextConditionOperator = json.nextConditionOperator;
                        this.rightRestResponseId = json.rightRestResponseId;
                        this.rightFormFieldId = json.rightFormFieldId;
                        this.leftFormFieldId = json.leftFormFieldId;
                        this.leftRestResponseId = json.leftRestResponseId;
                } else {
                        this.json = {};
                }
        }

        set leftType(leftType: string) {
                this.json.leftType = leftType;
        }

        set rightType(rightType: string) {
                this.json.rightType = rightType;
        }

        set leftValue(leftValue: string) {
                this.json.leftValue = leftValue;
        }

        set rightValue(rightValue: string) {
                this.json.rightValue = rightValue;
        }

        get leftType() {
                if (this.leftFormFieldId) {
                        return WidgetTypeEnum.field;
                } else if (this.leftRestResponseId) {
                        return WidgetTypeEnum.variable;
                } else if ( !!this.json.leftType) {
                        return this.json.leftType;
                }
        }

        get leftValue() {
                if ( this.json.leftValue ) {
                        return this.json.leftValue;
                } else if (this.leftFormFieldId) {
                        return this.leftFormFieldId;
                } else {
                        return this.leftRestResponseId;
                }
        }

        get rightType() {
                if ( !!this.json.rightType ) {
                        return this.json.rightType;
                } else if (this.json.rightValue) {
                        return WidgetTypeEnum.value;
                } else if (this.rightRestResponseId) {
                        return WidgetTypeEnum.variable;
                } else if (this.rightFormFieldId) {
                        return WidgetTypeEnum.field;
                }
        }

        get rightValue() {
                if (this.json.rightValue) {
                        return this.json.rightValue;
                } else if (this.rightFormFieldId) {
                        return this.rightFormFieldId;
                } else {
                        return this.rightRestResponseId;
                }
        }

}

export enum WidgetTypeEnum {
        field = 'field',
        variable = 'variable',
        value = 'value'
}
