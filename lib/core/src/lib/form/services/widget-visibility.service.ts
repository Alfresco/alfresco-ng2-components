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

import { LogService } from '../../common/services/log.service';
import { Injectable } from '@angular/core';
import moment from 'moment';
import {
    FormFieldModel,
    FormModel,
    TabModel,
    ContainerModel,
    FormOutcomeModel
} from '../components/widgets/core';
import { TaskProcessVariableModel } from '../models/task-process-variable.model';
import { WidgetVisibilityModel, WidgetTypeEnum } from '../models/widget-visibility.model';

@Injectable({
    providedIn: 'root'
})
export class WidgetVisibilityService {

    private processVarList: TaskProcessVariableModel[];
    private form: FormModel;

    constructor(private logService: LogService) {
    }

    public refreshVisibility(form: FormModel, processVarList?: TaskProcessVariableModel[]) {
        this.form = form;
        if (processVarList) {
            this.processVarList = processVarList;
        }
        if (form && form.tabs && form.tabs.length > 0) {
            form.tabs.map((tabModel) => this.refreshEntityVisibility(tabModel));
        }

        if (form && form.outcomes && form.outcomes.length > 0) {
            form.outcomes.map((outcomeModel) => this.refreshOutcomeVisibility(outcomeModel));
        }

        if (form) {
            form.getFormFields().map((field) => this.refreshEntityVisibility(field));
        }
    }

    public refreshEntityVisibility(element: FormFieldModel | TabModel) {
        element.isVisible = this.isParentTabVisible(this.form, element) && this.evaluateVisibility(element.form, element.visibilityCondition);
    }

    private refreshOutcomeVisibility(element: FormOutcomeModel) {
        element.isVisible = this.evaluateVisibility(element.form, element.visibilityCondition);
    }

    public evaluateVisibility(form: FormModel, visibilityObj: WidgetVisibilityModel): boolean {
        const isLeftFieldPresent = visibilityObj && (visibilityObj.leftType || visibilityObj.leftValue);
        if (!isLeftFieldPresent || isLeftFieldPresent === 'null') {
            return true;
        } else {
            return this.isFieldVisible(form, visibilityObj);
        }
    }

    public isFieldVisible(form: FormModel, visibilityObj: WidgetVisibilityModel, accumulator: any[] = [], result: boolean = false): boolean {
        const leftValue = this.getLeftValue(form, visibilityObj);
        const rightValue = this.getRightValue(form, visibilityObj);
        const actualResult = this.evaluateCondition(leftValue, rightValue, visibilityObj.operator);

        accumulator.push({value: actualResult, operator: visibilityObj.nextConditionOperator});

        if (this.isValidCondition(visibilityObj.nextCondition)) {
            result = this.isFieldVisible(form, visibilityObj.nextCondition, accumulator);
        } else if (accumulator[0] !== undefined) {
            result = Function('"use strict";return (' +
                accumulator.map((expression) => this.transformToLiteralExpression(expression)).join('') +
                ')')();
        } else {
            result = actualResult;
        }
        return !!result;
    }

    private transformToLiteralExpression(currentExpression: any): string {
        const currentTransformedValue = !!currentExpression.value ? 'true' : 'false';
        return currentTransformedValue.concat(this.transformToLiteralOperator(currentExpression.operator));
    }

    private transformToLiteralOperator(currentOperator): string {
        switch (currentOperator) {
            case 'and':
                return '&&';
            case 'or' :
                return '||';
            case 'and-not':
                return '&& !';
            case 'or-not':
                return '|| !';
            default:
                return '';
        }
    }

    public getLeftValue(form: FormModel, visibilityObj: WidgetVisibilityModel): string {
        let leftValue = '';
        if (visibilityObj.leftType && visibilityObj.leftType === WidgetTypeEnum.variable) {
            leftValue = this.getVariableValue(form, visibilityObj.leftValue, this.processVarList);
        } else if (visibilityObj.leftType && visibilityObj.leftType === WidgetTypeEnum.field) {
            leftValue = this.getFormValue(form, visibilityObj.leftValue);
            if (leftValue === undefined || leftValue === '') {
                const variableValue = this.getVariableValue(form, visibilityObj.leftValue, this.processVarList);
                leftValue = !this.isInvalidValue(variableValue) ? variableValue : leftValue;
            }
        }
        return leftValue;
    }

    public getRightValue(form: FormModel, visibilityObj: WidgetVisibilityModel): string {
        let valueFound = '';
        if (visibilityObj.rightType === WidgetTypeEnum.variable) {
            valueFound = this.getVariableValue(form, visibilityObj.rightValue, this.processVarList);
        } else if (visibilityObj.rightType === WidgetTypeEnum.field) {
            valueFound = this.getFormValue(form, visibilityObj.rightValue);
        } else {
            if (moment(visibilityObj.rightValue, 'YYYY-MM-DD', true).isValid()) {
                valueFound = visibilityObj.rightValue + 'T00:00:00.000Z';
            } else {
                valueFound = visibilityObj.rightValue;
            }
        }
        return valueFound;
    }

    public getFormValue(form: FormModel, fieldId: string): any {
        const formField = this.getFormFieldById(form, fieldId);
        let value;

        if (this.isFormFieldValid(formField)) {
            value = this.getFieldValue(form.values, fieldId);

            if (this.isInvalidValue(value)) {
                value = this.searchValueInForm(formField, fieldId);
            }
        }
        return value;
    }

    public isFormFieldValid(formField: FormFieldModel): boolean {
        return formField && formField.isValid;
    }

    public getFieldValue(valueList: any, fieldId: string): any {
        let labelFilterByName;
        let valueFound;
        if (fieldId && fieldId.indexOf('_LABEL') > 0) {
            labelFilterByName = fieldId.substring(0, fieldId.length - 6);
            if (valueList[labelFilterByName]) {
                if (Array.isArray(valueList[labelFilterByName])) {
                    valueFound = valueList[labelFilterByName].map(({name}) => name);
                } else {
                    valueFound = valueList[labelFilterByName].name;
                }
            }
        } else if (valueList[fieldId] && valueList[fieldId].id) {
            valueFound = valueList[fieldId].id;
        } else if (valueList[fieldId] && Array.isArray(valueList[fieldId])) {
            valueFound = valueList[fieldId].map(({id}) => id);
        } else {
            valueFound = valueList[fieldId];
        }
        return valueFound;
    }

    private isInvalidValue(value: any): boolean {
        return value === undefined || value === null;
    }

    public getFormFieldById(form: FormModel, fieldId: string): FormFieldModel {
        return form.getFormFields().find((formField: FormFieldModel) => this.isSearchedField(formField, fieldId));
    }

    public searchValueInForm(formField: FormFieldModel, fieldId: string): string {
        let fieldValue = '';

        if (formField) {
            fieldValue = this.getObjectValue(formField, fieldId);

            if (!fieldValue) {
                if (formField.value && formField.value.id) {
                    fieldValue = formField.value.id;
                } else if (!this.isInvalidValue(formField.value)) {
                    fieldValue = formField.value;
                }
            }
        }
        return fieldValue;
    }

    private isParentTabVisible(form: FormModel, currentFormField: FormFieldModel | TabModel): boolean {
        const containers = this.getFormTabContainers(form);
        let isVisible: boolean = true;
        containers.map((container: ContainerModel) => {
            if (!!this.getCurrentFieldFromTabById(container, currentFormField.id)) {
                const currentTab = form.tabs.find((tab: TabModel) => tab.id === container.tab);
                if (!!currentTab) {
                    isVisible = currentTab.isVisible;
                }
            }
        });
        return isVisible;
    }

    private getCurrentFieldFromTabById(container: ContainerModel, fieldId: string): FormFieldModel {
        const tabFields: FormFieldModel[][] = Object.keys(container.field.fields).map(key => container.field.fields[key]);
        let currentField: FormFieldModel;

        for (const tabField of tabFields) {
            currentField = tabField.find((tab: FormFieldModel) => tab.id === fieldId);
            if (currentField) {
                return currentField;
            }
        }
        return null;
    }

    private getFormTabContainers(form: FormModel): ContainerModel[] {
        if (!!form) {
            return form.fields.filter(field => field.type === 'container' && field.tab) as ContainerModel[];
        }
        return [];
    }

    private getObjectValue(field: FormFieldModel, fieldId: string): string {
        let value = '';
        if (field.value && field.value.name) {
            value = field.value.name;
        } else if (field.options) {
            const option = field.options.find((opt) => opt.id === field.value);
            if (option) {
                value = this.getValueFromOption(fieldId, option);
            }
        }
        return value;
    }

    private getValueFromOption(fieldId: string, option): string {
        let optionValue = '';
        if (fieldId && fieldId.indexOf('_LABEL') > 0) {
            optionValue = option.name;
        } else {
            optionValue = option.id;
        }
        return optionValue;
    }

    private isSearchedField(field: FormFieldModel, fieldId: string): boolean {
        const fieldToFind = fieldId?.indexOf('_LABEL') > 0 ? fieldId.replace('_LABEL', '') : fieldId;
        return (field.id && fieldToFind) ? field.id.toUpperCase() === fieldToFind.toUpperCase() : false;
    }

    public getVariableValue(form: FormModel, name: string, processVarList: TaskProcessVariableModel[]): string {
        const processVariableValue = this.getProcessVariableValue(name, processVarList);
        const variableDefaultValue = form.getDefaultFormVariableValue(name);

        return (processVariableValue === undefined) ? variableDefaultValue : processVariableValue;
    }

    private getProcessVariableValue(name: string, processVarList: TaskProcessVariableModel[]): string {
        if (processVarList) {
            const processVariable = processVarList.find(
                variable =>
                    variable.id === name ||
                    variable.id === `variables.${name}`
            );

            if (processVariable) {
                return processVariable.value;
            }
        }
        return undefined;
    }

    public evaluateCondition(leftValue: any, rightValue: any, operator: string): boolean | undefined {
        switch (operator) {
            case '==':
                return leftValue + '' === rightValue + '';
            case '<':
                return leftValue < rightValue;
            case '!=':
                return leftValue + '' !== rightValue + '';
            case '>':
                return leftValue > rightValue;
            case '>=':
                return leftValue >= rightValue;
            case '<=':
                return leftValue <= rightValue;
            case 'empty':
                return leftValue ? leftValue === '' : true;
            case '!empty':
                return leftValue ? leftValue !== '' : false;
            case 'contains':
                return this.contains(leftValue, rightValue);
            case '!contains':
                return !this.contains(leftValue, rightValue);
            default:
                this.logService.error(`Invalid operator: ${operator}`);
                return undefined;
        }
    }

    private contains(leftValue: any, rightValue: any) {
        return Array.isArray(leftValue) && Array.isArray(rightValue) && rightValue.every((element) => leftValue.includes(element));
    }

    cleanProcessVariable() {
        this.processVarList = [];
    }

    private isValidCondition(condition: WidgetVisibilityModel): boolean {
        return !!(condition && condition.operator);
    }
}
