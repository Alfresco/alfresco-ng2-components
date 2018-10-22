/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { Injectable } from '@angular/core';
import moment from 'moment-es6';
import { Observable, from, throwError } from 'rxjs';
import { FormFieldModel, FormModel, TabModel } from '../components/widgets/core/index';
import { TaskProcessVariableModel } from '../models/task-process-variable.model';
import { WidgetVisibilityModel } from '../models/widget-visibility.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WidgetVisibilityService {

    private processVarList: TaskProcessVariableModel[];

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    public refreshVisibility(form: FormModel) {
        if (form && form.tabs && form.tabs.length > 0) {
            form.tabs.map(tabModel => this.refreshEntityVisibility(tabModel));
        }

        if (form) {
            form.getFormFields().map(field => this.refreshEntityVisibility(field));
        }
    }

    refreshEntityVisibility(element: FormFieldModel | TabModel) {
        let visible = this.evaluateVisibility(element.form, element.visibilityCondition);
        element.isVisible = visible;
    }

    evaluateVisibility(form: FormModel, visibilityObj: WidgetVisibilityModel): boolean {
        let isLeftFieldPresent = visibilityObj && ( visibilityObj.leftFormFieldId || visibilityObj.leftRestResponseId );
        if (!isLeftFieldPresent || isLeftFieldPresent === 'null') {
            return true;
        } else {
            return this.isFieldVisible(form, visibilityObj);
        }
    }

    isFieldVisible(form: FormModel, visibilityObj: WidgetVisibilityModel): boolean {
        let leftValue = this.getLeftValue(form, visibilityObj);
        let rightValue = this.getRightValue(form, visibilityObj);
        let actualResult = this.evaluateCondition(leftValue, rightValue, visibilityObj.operator);
        if (visibilityObj.nextCondition) {
            return this.evaluateLogicalOperation(
                visibilityObj.nextConditionOperator,
                actualResult,
                this.isFieldVisible(form, visibilityObj.nextCondition)
            );
        } else {
            return actualResult;
        }
    }

    getLeftValue(form: FormModel, visibilityObj: WidgetVisibilityModel) {
        let leftValue = '';
        if (visibilityObj.leftRestResponseId && visibilityObj.leftRestResponseId !== 'null') {
            leftValue = this.getVariableValue(form, visibilityObj.leftRestResponseId, this.processVarList);
        } else if (visibilityObj.leftFormFieldId) {
            leftValue = this.getFormValue(form, visibilityObj.leftFormFieldId);
            leftValue = leftValue ? leftValue : this.getVariableValue(form, visibilityObj.leftFormFieldId, this.processVarList);
        }
        return leftValue;
    }

    getRightValue(form: FormModel, visibilityObj: WidgetVisibilityModel) {
        let valueFound = '';
        if (visibilityObj.rightRestResponseId) {
            valueFound = this.getVariableValue(form, visibilityObj.rightRestResponseId, this.processVarList);
        } else if (visibilityObj.rightFormFieldId) {
            valueFound = this.getFormValue(form, visibilityObj.rightFormFieldId);
        } else {
            if (moment(visibilityObj.rightValue, 'YYYY-MM-DD', true).isValid()) {
                valueFound = visibilityObj.rightValue + 'T00:00:00.000Z';
            } else {
                valueFound = visibilityObj.rightValue;
            }
        }
        return valueFound;
    }

    getFormValue(form: FormModel, fieldId: string) {
        let value = this.getFieldValue(form.values, fieldId);

        if (!value) {
            value = this.searchValueInForm(form, fieldId);
        }

        return value;
    }

    getFieldValue(valueList: any, fieldId: string) {
        let dropDownFilterByName, valueFound;
        if (fieldId && fieldId.indexOf('_LABEL') > 0) {
            dropDownFilterByName = fieldId.substring(0, fieldId.length - 6);
            if (valueList[dropDownFilterByName]) {
                valueFound = valueList[dropDownFilterByName].name;
            }
        } else if (valueList[fieldId] && valueList[fieldId].id) {
            valueFound = valueList[fieldId].id;
        } else {
            valueFound = valueList[fieldId];
        }
        return valueFound;
    }

    searchValueInForm(form: FormModel, fieldId: string) {
        let fieldValue = '';
        form.getFormFields().forEach((formField: FormFieldModel) => {
            if (this.isSearchedField(formField, fieldId)) {
                fieldValue = this.getObjectValue(formField, fieldId);
                if (!fieldValue) {
                    if (formField.value && formField.value.id) {
                        fieldValue = formField.value.id;
                    } else {
                        fieldValue = formField.value;
                    }
                }
            }
        });

        return fieldValue;
    }

    private getObjectValue(field: FormFieldModel, fieldId: string) {
        let value = '';
        if (field.value && field.value.name) {
            value = field.value.name;
        } else if (field.options) {
            let option = field.options.find(opt => opt.id === field.value);
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

    private isSearchedField(field: FormFieldModel, fieldToFind: string): boolean {
        let formattedFieldName = this.removeLabel(field, fieldToFind);
        return field.id ? field.id.toUpperCase() === formattedFieldName.toUpperCase() : false;
    }

    private removeLabel(field: FormFieldModel, fieldToFind): string {
        let formattedFieldName = fieldToFind || '';
        if (field.fieldType === 'RestFieldRepresentation' && fieldToFind.indexOf('_LABEL') > 0) {
            formattedFieldName = fieldToFind.substring(0, fieldToFind.length - 6);
        }
        return formattedFieldName;
    }

    getVariableValue(form: FormModel, name: string, processVarList: TaskProcessVariableModel[]) {
        return this.getFormVariableValue(form, name) ||
            this.getProcessVariableValue(name, processVarList);
    }

    private getFormVariableValue(form: FormModel, name: string) {
        if (form.json.variables) {
            let formVariable = form.json.variables.find(formVar => formVar.name === name);
            return formVariable ? formVariable.value : formVariable;
        }
    }

    private getProcessVariableValue(name: string, processVarList: TaskProcessVariableModel[]) {
        if (this.processVarList) {
            let processVariable = this.processVarList.find(variable => variable.id === name);
            return processVariable ? processVariable.value : processVariable;
        }
    }

    evaluateLogicalOperation(logicOp, previousValue, newValue): boolean {
        switch (logicOp) {
            case 'and':
                return previousValue && newValue;
            case 'or' :
                return previousValue || newValue;
            case 'and-not':
                return previousValue && !newValue;
            case 'or-not':
                return previousValue || !newValue;
            default:
                this.logService.error('NO valid operation! wrong op request : ' + logicOp);
                break;
        }
    }

    evaluateCondition(leftValue, rightValue, operator): boolean {
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
            default:
                this.logService.error('NO valid operation!');
                break;
        }
        return;
    }

    cleanProcessVariable() {
        this.processVarList = [];
    }

    getTaskProcessVariable(taskId: string): Observable<TaskProcessVariableModel[]> {
        return from(this.apiService.getInstance().activiti.taskFormsApi.getTaskFormVariables(taskId))
            .pipe(
                map(res => {
                    let jsonRes = this.toJson(res);
                    this.processVarList = <TaskProcessVariableModel[]> jsonRes;
                    return jsonRes;
                }),
                catchError(err => this.handleError(err))
            );
    }

    toJson(res: any) {
        return res || {};
    }

    private handleError(err) {
        this.logService.error('Error while performing a call');
        return throwError('Error while performing a call - Server error');
    }
}
