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

import { it, describe, inject, beforeEach, beforeEachProviders } from '@angular/core/testing';
import { WidgetVisibilityService } from './widget-visibility.service';
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { HTTP_PROVIDERS } from '@angular/http';
import { WidgetVisibilityModel } from '../models/widget-visibility.model';
import { TaskProcessVariableModel } from '../models/task-process-variable.model';
import { FormModel, FormValues, FormFieldModel } from '../components/widgets/core/index';

declare let AlfrescoApi: any;
declare let jasmine: any;

describe('WidgetVisibilityService', () => {
    let service;
    let formTest = new FormModel({});
    let formValues: FormValues = { 'test_1': 'value_1', 'test_2': 'value_2', 'test_3': 'value_1' };
    let fakeTaskProcessVariableModels = [
                                {id: 'TEST_VAR_1', type: 'string', value: 'test_value_1'},
                                {id: 'TEST_VAR_2', type: 'string', value: 'test_value_2'},
                                {id: 'TEST_VAR_3', type: 'string', value: 'test_value_3'}
                               ];

    let fakeFormJson = {
             id: '9999',
             name: 'FORM_VISIBILITY',
             processDefinitionId: 'PROCESS_TEST:9:9999',
             processDefinitionName: 'PROCESS_TEST',
             processDefinitionKey: 'PROCESS_TEST',
             taskId: '999',
             taskName: 'TEST',
             fields: [
                      {
                         fieldType: 'ContainerRepresentation',
                         id: '000000000000000000',
                         name: 'Label',
                         type: 'container',
                         value: null,
                         numberOfColumns: 2,
                         fields: {
                                   1: [
                                         {
                                           fieldType: 'FormFieldRepresentation',
                                           id: 'FIELD_WITH_CONDITION',
                                           name: 'FIELD_WITH_CONDITION',
                                           type: 'text',
                                           value: 'field_with_condition_value',
                                           visibilityCondition: null
                                         },
                                        {
                                           fieldType: 'FormFieldRepresentation',
                                           id: 'LEFT_FORM_FIELD_ID',
                                           name: 'LEFT_FORM_FIELD_NAME',
                                           type: 'text',
                                           value: 'LEFT_FORM_FIELD_VALUE',
                                           visibilityCondition: null
                                        }
                                      ],
                                   2: [
                                        {
                                           fieldType: 'FormFieldRepresentation',
                                           id: 'RIGHT_FORM_FIELD_ID',
                                           name: 'RIGHT_FORM_FIELD_NAME',
                                           type: 'text',
                                           value: 'RIGHT_FORM_FIELD_VALUE',
                                           visibilityCondition: null
                                        }
                                      ]
                                }
                     }
                    ]
    };

    beforeEachProviders(() => {
        return [
            HTTP_PROVIDERS,
            AlfrescoSettingsService,
            AlfrescoAuthenticationService,
            WidgetVisibilityService
        ];
    });

    beforeEach(
        inject([WidgetVisibilityService], (activitiService: WidgetVisibilityService) => {
                jasmine.Ajax.install();
                service = activitiService;
                })
    );

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return the process variables for task', (done) => {
        service.getTaskProcessVariableModelsForTask(9999).subscribe(
            (res: TaskProcessVariableModel[]) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(3);
                expect(res[0].id).toEqual('TEST_VAR_1');
                expect(res[0].type).toEqual('string');
                expect(res[0].value).toEqual('test_value_1');
                done();
            }
        );

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeTaskProcessVariableModels)
        });
    });

    it('should evaluate logic operation for two values', () => {
        let res: boolean;

        res = service.evaluateLogicalOperation( 'or', true, false);

        expect(res).toBeTruthy();

        res = service.evaluateLogicalOperation( 'and', true, true);

        expect(res).toBeTruthy();

        res = service.evaluateLogicalOperation( 'and not', true, false);

        expect(res).toBeTruthy();

        res = service.evaluateLogicalOperation( 'or not', true, true );

        expect(res).toBeTruthy();

        res = service.evaluateLogicalOperation( 'or', false, false );

        expect(res).toBeFalsy();

        res = service.evaluateLogicalOperation( 'and', true, false );

        expect(res).toBeFalsy();

        res = service.evaluateLogicalOperation( 'and not', false, false );

        expect(res).toBeFalsy();

        res = service.evaluateLogicalOperation( 'or not', false, true );

        expect(res).toBeFalsy();
    });

    it('should evaluate string operation for two values', () => {
        let res: boolean;

        res = service.evaluateCondition( 'test', 'test', '==');

        expect(res).toBeTruthy();

        res = service.evaluateCondition( 1, 2, '<');

        expect(res).toBeTruthy();

        res = service.evaluateCondition( true, false, '!=' );

        expect(res).toBeTruthy();

        res = service.evaluateCondition( 2, 3, '>' );

        expect(res).toBeFalsy();

        res = service.evaluateCondition( 2, 2, '>=' );

        expect(res).toBeTruthy();

        res = service.evaluateCondition( 4, 2, '<=' );

        expect(res).toBeFalsy();

        res = service.evaluateCondition( null, null, 'empty' );

        expect(res).toBeTruthy();

        res = service.evaluateCondition( '', '', 'empty' );

        expect(res).toBeTruthy();

        res = service.evaluateCondition( null, null, '!empty' );

        expect(res).toBeFalsy();

        res = service.evaluateCondition( '', '', '!empty' );

        expect(res).toBeFalsy();
    });


    it('should be able to retrieve the value of a process variable', (done) => {
       service.getTaskProcessVariableModelsForTask(9999).subscribe(
            (res: TaskProcessVariableModel[]) => {
               expect(res).toBeDefined();
               let varValue = service.getValueFromVariable(formTest, 'TEST_VAR_1', res);
               expect(varValue).not.toBeUndefined();
               expect(varValue).toBe('test_value_1');
               done();
            }
       );
       jasmine.Ajax.requests.mostRecent().respondWith({
           'status': 200,
           contentType: 'application/json',
           responseText: JSON.stringify(fakeTaskProcessVariableModels)
       });
    });

    it('should be able to retrieve the value of a form variable', () => {
       let fakeForm = new FormModel({variables: [
                                                { name: 'FORM_VARIABLE_TEST',
                                                  type: 'string',
                                                  value: 'form_value_test' }
                                              ]});
       let varValue = service.getValueFromVariable(fakeForm, 'FORM_VARIABLE_TEST', null);

       expect(varValue).not.toBeUndefined();
       expect(varValue).toBe('form_value_test');
    });


    it('should return undefined if the variable does not exist', (done) => {
       service.getTaskProcessVariableModelsForTask(9999).subscribe(
            (res: TaskProcessVariableModel[]) => {
               let varValue = service.getValueFromVariable(formTest, 'TEST_MYSTERY_VAR', res);
               expect(varValue).toBeUndefined();
               done();
            }
       );
       jasmine.Ajax.requests.mostRecent().respondWith({
           'status': 200,
           contentType: 'application/json',
           responseText: JSON.stringify(fakeTaskProcessVariableModels)
       });


    });


    it('should be able to retrieve a field value searching in the form', () => {
       let stubFormWithFields = new FormModel(fakeFormJson);
       let formValue = service.getFormValueByName(stubFormWithFields, 'FIELD_WITH_CONDITION');

       expect(formValue).not.toBeNull();
       expect(formValue).toBe('field_with_condition_value');
    });

    it('should return undefined if the field value is not in the form', () => {
       let stubFormWithFields = new FormModel(fakeFormJson);

       let formValue = service.getFormValueByName(stubFormWithFields, 'FIELD_MYSTERY');

       expect(formValue).toBeUndefined();
    });

    it('should take the value from form values if it is present', () => {
       formTest.values = formValues;

       let formValue = service.getValueOField(formTest, 'test_1');

       expect(formValue).not.toBeNull();
       expect(formValue).toBe('value_1');
    });

    it('should search in the form if element value is not in form values', () => {
       let fakeFormWithField = new FormModel(fakeFormJson);
       fakeFormWithField.values = formValues;

       let value = service.getValueOField(fakeFormWithField, 'FIELD_WITH_CONDITION');

       expect(value).not.toBeNull();
       expect(value).toBe('field_with_condition_value');
    });

    it('should return undefined if the element is not present anywhere', () => {
       let fakeFormWithField = new FormModel(fakeFormJson);
       fakeFormWithField.values = formValues;

       let formValue = service.getValueOField(fakeFormWithField, 'FIELD_MYSTERY');

       expect(formValue).toBeUndefined();
    });

    it('should retrieve the value for the right field when it is a value', () => {
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.rightValue = '100';

       let rightValue = service.getRightValue(formTest, visibilityObjTest);

       expect(rightValue).toBe('100');
    });

    it('should retrieve the value for the right field when it is a process variable', (done) => {
       service.getTaskProcessVariableModelsForTask(9999).subscribe(
            (res: TaskProcessVariableModel[]) => {
                   let visibilityObjTest = new WidgetVisibilityModel();
                   visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';

                   let rightValue = service.getRightValue(formTest, visibilityObjTest);

                   expect(rightValue).not.toBeNull();
                   expect(rightValue).toBe('test_value_2');
                   done();
            }
       );
       jasmine.Ajax.requests.mostRecent().respondWith({
           'status': 200,
           contentType: 'application/json',
           responseText: JSON.stringify(fakeTaskProcessVariableModels)
       });
    });

    it('should retrieve the value for the right field when it is a form variable', () => {
       let fakeFormWithField = new FormModel(fakeFormJson);
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';

       let rightValue = service.getRightValue(fakeFormWithField, visibilityObjTest);

       expect(rightValue).not.toBeNull();
       expect(rightValue).toBe('RIGHT_FORM_FIELD_VALUE');
    });

    it('should retrieve right value from form values if it is present', () => {
       formTest.values = formValues;
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.rightFormFieldId = 'test_2';

       let rightValue = service.getRightValue(formTest, visibilityObjTest);

       expect(rightValue).not.toBeNull();
       expect(formTest.values).toEqual(formValues);
       expect(rightValue).toBe('value_2');
    });

    it('should return undefined for a value that is not on variable or form', () => {
       let fakeFormWithField = new FormModel(fakeFormJson);
       fakeFormWithField.values = formValues;
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.rightFormFieldId = 'NO_FIELD_FORM';

       let rightValue = service.getRightValue(fakeFormWithField, visibilityObjTest);

       expect(rightValue).toBeUndefined();
    });

    it('should retrieve the value for the left field when it is a process variable', (done) => {
       service.getTaskProcessVariableModelsForTask(9999).subscribe(
            (res: TaskProcessVariableModel[]) => {
               let visibilityObjTest = new WidgetVisibilityModel();
               visibilityObjTest.leftRestResponseId = 'TEST_VAR_2';

               let rightValue = service.getLeftValue(formTest, visibilityObjTest);

               expect(rightValue).not.toBeNull();
               expect(rightValue).toBe('test_value_2');
               done();
            }
       );
       jasmine.Ajax.requests.mostRecent().respondWith({
           'status': 200,
           contentType: 'application/json',
           responseText: JSON.stringify(fakeTaskProcessVariableModels)
       });
    });

    it('should retrieve the value for the left field when it is a form variable', () => {
       let fakeForm = new FormModel({variables: [
                                                { name: 'FORM_VARIABLE_TEST',
                                                  type: 'string',
                                                  value: 'form_value_test' }
                                              ]});
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.leftRestResponseId = 'FORM_VARIABLE_TEST';

       let leftValue = service.getLeftValue(fakeForm, visibilityObjTest);

       expect(leftValue).not.toBeNull();
       expect(leftValue).toBe('form_value_test');
    });

    it('should retrieve the value for the left field when it is a form value', () => {
       let fakeFormWithField = new FormModel(fakeFormJson);
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.leftFormFieldId = 'FIELD_WITH_CONDITION';

       let leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);

       expect(leftValue).not.toBeNull();
       expect(leftValue).toBe('field_with_condition_value');
    });

    it('should retrieve left value from form values if it is present', () => {
       formTest.values = formValues;
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.leftFormFieldId = 'test_2';

       let leftValue = service.getLeftValue(formTest, visibilityObjTest);

       expect(leftValue).not.toBeNull();
       expect(leftValue).toBe('value_2');
    });

    it('should return undefined for a value that is not on variable or form', () => {
       let fakeFormWithField = new FormModel(fakeFormJson);
       let visibilityObjTest = new WidgetVisibilityModel();

       let leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);

       expect(leftValue).toBeUndefined();
    });

    it('should evaluate the visibility for the field with single visibility condition between two field values', () => {
       formTest.values = formValues;
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.leftFormFieldId = 'test_1';
       visibilityObjTest.operator = '==';
       visibilityObjTest.rightFormFieldId = 'test_3';

       let isVisible = service.evaluateVisibilityForField(formTest, visibilityObjTest);

       expect(isVisible).toBeTruthy();
    });

    it('should evaluate true visibility for the field with single visibility condition between a field and a value', () => {
       formTest.values = formValues;
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.leftFormFieldId = 'test_1';
       visibilityObjTest.operator = '==';
       visibilityObjTest.rightValue = 'value_1';

       let isVisible = service.evaluateVisibilityForField(formTest, visibilityObjTest);

       expect(isVisible).toBeTruthy();
    });

    it('should evaluate the visibility for the field with single visibility condition between form values', () => {
       let fakeFormWithField = new FormModel(fakeFormJson);
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
       visibilityObjTest.operator = '!=';
       visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';

       let isVisible = service.evaluateVisibilityForField(fakeFormWithField, visibilityObjTest);

       expect(isVisible).toBeTruthy();
    });

    it('should evaluate the visibility for the field between form value and process var', (done) => {
       service.getTaskProcessVariableModelsForTask(9999).subscribe(
            (res: TaskProcessVariableModel[]) => {
               let fakeFormWithField = new FormModel(fakeFormJson);
               let visibilityObjTest = new WidgetVisibilityModel();
               visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
               visibilityObjTest.operator = '!=';
               visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';

               let isVisible = service.evaluateVisibilityForField(fakeFormWithField, visibilityObjTest);

               expect(isVisible).toBeTruthy();
               done();
            }
       );
       jasmine.Ajax.requests.mostRecent().respondWith({
           'status': 200,
           contentType: 'application/json',
           responseText: JSON.stringify(fakeTaskProcessVariableModels)
       });
    });


    it('should evaluate visibility with multiple conditions', (done) => {
       service.getTaskProcessVariableModelsForTask(9999).subscribe(
            (res: TaskProcessVariableModel[]) => {
               let fakeFormWithField = new FormModel(fakeFormJson);
               let visibilityObjTest = new WidgetVisibilityModel();
               let chainedVisibilityObj = new WidgetVisibilityModel();
               visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
               visibilityObjTest.operator = '!=';
               visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';
               visibilityObjTest.nextConditionOperator = 'and';
               chainedVisibilityObj.leftRestResponseId = 'TEST_VAR_2';
               chainedVisibilityObj.operator = '!empty';
               visibilityObjTest.nextCondition = chainedVisibilityObj;

               let isVisible = service.evaluateVisibilityForField(fakeFormWithField, visibilityObjTest);

               expect(isVisible).toBeTruthy();
               done();
            }
       );
       jasmine.Ajax.requests.mostRecent().respondWith({
           'status': 200,
           contentType: 'application/json',
           responseText: JSON.stringify(fakeTaskProcessVariableModels)
       });
    });

    it('should return true when the visibility condition is not valid', () => {
       let visibilityObjTest = new WidgetVisibilityModel();
       visibilityObjTest.leftFormFieldId = '';
       visibilityObjTest.leftRestResponseId = '';
       visibilityObjTest.operator = '!=';

       let isVisible = service.getVisiblityForField(formTest, visibilityObjTest);

       expect(isVisible).toBeTruthy();
    });

    it('should refresh the visibility for a form field object', () => {
       let fakeFormWithField = new FormModel(fakeFormJson);
       let visibilityObjTest = new WidgetVisibilityModel();
       fakeFormWithField.values = formValues;
       visibilityObjTest.leftFormFieldId = 'test_1';
       visibilityObjTest.operator = '!=';
       visibilityObjTest.rightFormFieldId = 'test_3';
       let jsonFieldFake = {id: 'FAKE_FORM_FIELD_ID', value: 'FAKE_FORM_FIELD_VALUE', visibilityCondition: visibilityObjTest};
       let fakeFormField: FormFieldModel = new FormFieldModel(fakeFormWithField, jsonFieldFake);

       service.refreshVisibilityForField(fakeFormField);

       expect(fakeFormField.isVisible).toBeFalsy();
    });

    it('should not change the isVisible if field does not have visibility condition', () => {
       let fakeFormWithField = new FormModel(fakeFormJson);
       let jsonFieldFake = {id: 'FAKE_FORM_FIELD_ID',
                            value: 'FAKE_FORM_FIELD_VALUE',
                            visibilityCondition: null
                            };
       let fakeFormField: FormFieldModel = new FormFieldModel(fakeFormWithField, jsonFieldFake);
       fakeFormField.isVisible = false;
       service.refreshVisibilityForField(fakeFormField);
       expect(fakeFormField.isVisible).toBeFalsy();
    });
});
