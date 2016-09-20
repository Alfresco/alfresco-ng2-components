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

import { Injectable } from '@angular/core';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AlfrescoSettingsService } from 'ng2-alfresco-core';
import { FormModel, FormFieldModel } from '../components/widgets/core/index';
import { WidgetVisibilityModel } from '../models/widget-visibility.model';
import { TaskProcessVariableModel } from '../models/task-process-variable.model';

@Injectable()
export class WidgetVisibilityService {

    private processVarList: TaskProcessVariableModel[];

    constructor(private http: Http,
                private alfrescoSettingsService: AlfrescoSettingsService) {
              }

    public updateVisibilityForForm(form: FormModel) {
     if ( form && form.fields.length > 0 ) {
           form.fields
                       .map(
                             contModel =>
                             contModel.columns
                              .map(
                                  contColModel =>
                                  contColModel
                                   .fields.map(
                                    field =>
                                        this.refreshVisibilityForField(field) )
                                  )
                            );
       }
    }

    public refreshVisibilityForField(field: FormFieldModel) {
        if ( field.visibilityCondition ) {
            field.isVisible = this.getVisiblityForField(field.form, field.visibilityCondition);
        }
    }

    public getVisiblityForField(form: FormModel, visibilityObj: WidgetVisibilityModel): boolean {
        let isLeftFieldPresent = visibilityObj.leftFormFieldId || visibilityObj.leftRestResponseId;
        if ( !isLeftFieldPresent ) {
            return true;
        }else {
            return this.evaluateVisibilityForField(form, visibilityObj);
        }
    }

    private evaluateVisibilityForField(form: FormModel, visibilityObj: WidgetVisibilityModel): boolean {
       let leftValue = this.getLeftValue(form, visibilityObj);
       let rightValue = this.getRightValue(form, visibilityObj);
       let actualResult = this.evaluateCondition(leftValue, rightValue, visibilityObj.operator);
       if ( visibilityObj.nextCondition ) {
             return this.evaluateLogicalOperation(visibilityObj.nextConditionOperator,
                                                  actualResult,
                                                  this.evaluateVisibilityForField(
                                                                form, visibilityObj.nextCondition)
                                                  );
       }else {
            return actualResult;
       }
    }

    private getLeftValue(form: FormModel, visibilityObj: WidgetVisibilityModel) {
        if ( visibilityObj.leftRestResponseId ) {
            return this.getValueFromVariable(form, visibilityObj.leftRestResponseId, this.processVarList);
        }
        return this.getValueOField(form, visibilityObj.leftFormFieldId);
    }

    private getRightValue(form: FormModel, visibilityObj: WidgetVisibilityModel) {
        let valueFound = null;
        if ( visibilityObj.rightRestResponseId ) {
            valueFound = this.getValueFromVariable(form, visibilityObj.rightRestResponseId, this.processVarList);
        }else if ( visibilityObj.rightFormFieldId ) {
             valueFound = this.getValueOField(form, visibilityObj.rightFormFieldId);
        }else {
             valueFound = visibilityObj.rightValue;
        }
        return valueFound;
    }

    private getValueOField(form: FormModel, field: string) {
            let value = form.values[field] ?
                                    form.values[field] :
                                    this.getFormValueByName(form, field);
            return value;
    }

    private getFormValueByName(form: FormModel, name: string) {
       for (let columns of form.json.fields) {
          for ( let i in columns.fields ) {
             if ( columns.fields.hasOwnProperty( i ) ) {
                 let res = columns.fields[i].find(field => field.id === name);
                 if ( res ) {
                    return res.value;
                 }
             }
          }
       }
       return null;
    }

    private getValueFromVariable( form: FormModel, name: string, processVarList: TaskProcessVariableModel[] ) {
        return this.getFormVariableValue(form, name) ||
               this.getProcessVariableValue(name, processVarList);
    }

    private getFormVariableValue(form: FormModel, name: string ) {
        if ( form.json.variables) {
          let variableFromForm = form.json.variables.find(formVar => formVar.name === name);
          if ( variableFromForm ) {
            return variableFromForm.value;
          }
        }
        return null;
    }

    private getProcessVariableValue(name: string, processVarList: TaskProcessVariableModel[]) {
        if ( this.processVarList ) {
          let variableFromProcess = this.processVarList.find(variable => variable.id === name);
          if ( variableFromProcess ) {
            return variableFromProcess.value;
          }
        }
        return null;
    }

    private evaluateLogicalOperation(logicOp, previousValue, newValue): boolean {
        switch ( logicOp ) {
            case 'and':
                return previousValue && newValue;
            case 'or' :
                return previousValue || newValue;
            case 'and not':
                return previousValue && !newValue;
            case 'or not':
                return previousValue || !newValue;
            default:
                console.error( 'NO valid operation!' );
                break;
        }
    }

    private evaluateCondition(leftValue, rightValue, operator): boolean {
        switch ( operator ) {
            case '==':
                return leftValue + '' === rightValue;
            case '<':
                return leftValue < rightValue;
            case '!=':
                return leftValue + '' !== rightValue;
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
                console.error( 'NO valid operation!' );
                break;
        }
        return null;
    }

    getTaskProcessVariableModelsForTask(taskId: string): Observable<TaskProcessVariableModel[]> {
        let url = `${this.alfrescoSettingsService.getBPMApiBaseUrl()}/app/rest/task-forms/${taskId}/variables`;
        let options = this.getRequestOptions();
        return this.http
            .get(url, options)
            .map( (response: Response) => this.processVarList = <TaskProcessVariableModel[]> response.json())
            .catch(this.handleError);
    }

    getTaskProcessVariableModelForTaskByName(taskId: string, processVarName: string): Observable<TaskProcessVariableModel> {
        return this.getTaskProcessVariableModelsForTask(taskId)
                        .map(
                        (variables: TaskProcessVariableModel[]) =>
                                        variables.find(variable => variable.id === processVarName));
    }

    private getHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
    }

    private getRequestOptions(): RequestOptions {
        let headers = this.getHeaders();
        return new RequestOptions({headers: headers});
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}
