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

import { TestBed } from '@angular/core/testing';
import {
    ContainerModel,
    FormFieldModel,
    FormFieldTypes,
    FormModel,
    TabModel
} from './../components/widgets/core/index';
import { TaskProcessVariableModel } from './../models/task-process-variable.model';
import { WidgetVisibilityModel, WidgetTypeEnum } from './../models/widget-visibility.model';
import { WidgetVisibilityService } from './widget-visibility.service';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AlfrescoApiServiceMock } from '../../mock/alfresco-api.service.mock';
import {
    fakeFormJson, fakeTaskProcessVariableModels,
    formTest, formValues, complexVisibilityJsonVisible,
    nextConditionForm, complexVisibilityJsonNotVisible,
    headerVisibilityCond } from '../../mock/form/widget-visibility-cloud.service.mock';

declare let jasmine: any;

describe('WidgetVisibilityCloudService', () => {

    let service: WidgetVisibilityService;
    let booleanResult: boolean;
    const stubFormWithFields = new FormModel(fakeFormJson);

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(WidgetVisibilityService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('should be able to evaluate logic operations', () => {

        it('using AND and return true', () => {
            booleanResult = service.evaluateLogicalOperation('and', true, true);
            expect(booleanResult).toBeTruthy();
        });

        it('using AND and return false', () => {
            booleanResult = service.evaluateLogicalOperation('and', true, false);
            expect(booleanResult).toBeFalsy();
        });

        it('using OR and return true', () => {
            booleanResult = service.evaluateLogicalOperation('or', true, false);
            expect(booleanResult).toBeTruthy();
        });

        it('using OR and return false', () => {
            booleanResult = service.evaluateLogicalOperation('or', false, false);
            expect(booleanResult).toBeFalsy();
        });

        it('using AND NOT and return true', () => {
            booleanResult = service.evaluateLogicalOperation('and-not', true, false);
            expect(booleanResult).toBeTruthy();
        });

        it('using AND NOT and return false', () => {
            booleanResult = service.evaluateLogicalOperation('and-not', false, false);
            expect(booleanResult).toBeFalsy();
        });

        it('using OR NOT and return true', () => {
            booleanResult = service.evaluateLogicalOperation('or-not', true, true);
            expect(booleanResult).toBeTruthy();
        });

        it('using OR NOT and return false', () => {
            booleanResult = service.evaluateLogicalOperation('or-not', false, true);
            expect(booleanResult).toBeFalsy();
        });

        it('should fail with invalid operation', () => {
            booleanResult = service.evaluateLogicalOperation(undefined, false, true);
            expect(booleanResult).toBeUndefined();
        });
    });

    describe('should be able to evaluate next condition operations', () => {

        it('using == and return true', () => {
            booleanResult = service.evaluateCondition('test', 'test', '==');
            expect(booleanResult).toBeTruthy();
        });

        it('using < and return true', () => {
            booleanResult = service.evaluateCondition(1, 2, '<');
            expect(booleanResult).toBeTruthy();
        });

        it('using != and return true', () => {
            booleanResult = service.evaluateCondition(true, false, '!=');
            expect(booleanResult).toBeTruthy();
        });

        it('using != and return false', () => {
            booleanResult = service.evaluateCondition(true, true, '!=');
            expect(booleanResult).toBeFalsy();
        });

        it('using >= and return true', () => {
            booleanResult = service.evaluateCondition(2, 2, '>=');
            expect(booleanResult).toBeTruthy();
        });

        it('using empty with null values and return true', () => {
            booleanResult = service.evaluateCondition(null, null, 'empty');
            expect(booleanResult).toBeTruthy();
        });

        it('using empty with empty strings values and return true', () => {
            booleanResult = service.evaluateCondition('', '', 'empty');
            expect(booleanResult).toBeTruthy();
        });

        it('using empty with empty string value and return false', () => {
            booleanResult = service.evaluateCondition('fake_value', undefined, 'empty');
            expect(booleanResult).toBeFalsy();
        });

        it('using > and return false', () => {
            booleanResult = service.evaluateCondition(2, 3, '>');
            expect(booleanResult).toBeFalsy();
        });

        it('using not empty with null values and return false', () => {
            booleanResult = service.evaluateCondition(null, null, '!empty');
            expect(booleanResult).toBeFalsy();
        });

        it('using OR NOT with empty strings and return false', () => {
            booleanResult = service.evaluateCondition('', '', '!empty');
            expect(booleanResult).toBeFalsy();
        });

        it('using <= and return false', () => {
            booleanResult = service.evaluateCondition(2, 1, '<=');
            expect(booleanResult).toBeFalsy();
        });

        it('using <= and return true for different values', () => {
            booleanResult = service.evaluateCondition(1, 2, '<=');
            expect(booleanResult).toBeTruthy();
        });

        it('using <= and return true for same values', () => {
            booleanResult = service.evaluateCondition(2, 2, '<=');
            expect(booleanResult).toBeTruthy();
        });

        it('should return undefined for invalid operation', () => {
            booleanResult = service.evaluateCondition(null, null, undefined);
            expect(booleanResult).toBeUndefined();
        });

        it('should evaluate true visibility condition with next condition operator', (done) => {
            const myForm = new FormModel(nextConditionForm);
            service.refreshVisibility(myForm);
            const nextConditionFormVIsibility = myForm.getFieldById('Text4');
            expect(nextConditionFormVIsibility.isVisible).toBeTruthy();
            done();
        });

        it('should evaluate false visibility condition with next condition operator', (done) => {
            const myForm = new FormModel(nextConditionForm);
            myForm.getFieldById('Text3').value = 'wrong value';
            service.refreshVisibility(myForm);
            const nextConditionFormVIsibility = myForm.getFieldById('Text4');
            expect(nextConditionFormVIsibility.isVisible).toBeFalsy();
            done();
        });
    });

    describe('should retrieve the process variables', () => {
        const fakeFormWithField = new FormModel(fakeFormJson);
        let visibilityObjTest: WidgetVisibilityModel;
        const chainedVisibilityObj = new WidgetVisibilityModel({});

        beforeEach(() => {
            visibilityObjTest = new WidgetVisibilityModel({});
        });

        it('should return the process variables for task', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                (res) => {
                    expect(res).toBeDefined();
                    expect(res.length).toEqual(3);
                    expect(res[0].id).toEqual('TEST_VAR_1');
                    expect(res[0].type).toEqual('string');
                    expect(res[0].value).toEqual('test_value_1');
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeTaskProcessVariableModels
            });
        });

        it('should be able to retrieve the value of a process variable', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                (res: TaskProcessVariableModel[]) => {
                    expect(res).toBeDefined();
                    const varValue = service.getVariableValue(formTest, 'TEST_VAR_1', res);
                    expect(varValue).not.toBeUndefined();
                    expect(varValue).toBe('test_value_1');
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeTaskProcessVariableModels
            });
        });

        it('should return undefined if the variable does not exist', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                (res: TaskProcessVariableModel[]) => {
                    const varValue = service.getVariableValue(formTest, 'TEST_MYSTERY_VAR', res);
                    expect(varValue).toBeUndefined();
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeTaskProcessVariableModels
            });
        });

        it('should retrieve the value for the right field when it is a process variable', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                () => {
                    visibilityObjTest.rightValue = 'test_value_2';
                    const rightValue = service.getRightValue(formTest, visibilityObjTest);

                    expect(rightValue).not.toBeNull();
                    expect(rightValue).toBe('test_value_2');
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeTaskProcessVariableModels
            });
        });

        it('should retrieve the value for the left field when it is a process variable', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                () => {
                    visibilityObjTest.leftValue = 'TEST_VAR_2';
                    visibilityObjTest.leftType = WidgetTypeEnum.field;
                    const leftValue = service.getLeftValue(formTest, visibilityObjTest);

                    expect(leftValue).not.toBeNull();
                    expect(leftValue).toBe('test_value_2');
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeTaskProcessVariableModels
            });
        });

        it('should evaluate the visibility for the field between form value and process var', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                () => {
                    visibilityObjTest.leftType = 'LEFT_FORM_FIELD_ID';
                    visibilityObjTest.operator = '!=';
                    visibilityObjTest.rightValue = 'TEST_VAR_2';
                    const isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);

                    expect(isVisible).toBeTruthy();
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeTaskProcessVariableModels
            });
        });

        it('should evaluate visibility with multiple conditions', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                () => {
                    visibilityObjTest.leftType = 'field';
                    visibilityObjTest.leftValue = 'TEST_VAR_2';
                    visibilityObjTest.operator = '!=';
                    visibilityObjTest.rightValue = 'TEST_VAR_2';
                    visibilityObjTest.nextConditionOperator = 'and';
                    chainedVisibilityObj.leftType = 'field';
                    chainedVisibilityObj.leftValue = 'TEST_VAR_2';
                    chainedVisibilityObj.operator = '!empty';
                    visibilityObjTest.nextCondition = chainedVisibilityObj;

                    const isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);

                    expect(isVisible).toBeTruthy();
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: fakeTaskProcessVariableModels
            });
        });

        it('should catch error on 403 response', (done) => {
            service.getTaskProcessVariable('9999').subscribe(() => {
            }, () => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });
    });

    describe('should return the value of the field', () => {
        let visibilityObjTest: WidgetVisibilityModel;
        let fakeFormWithField = new FormModel(fakeFormJson);
        const jsonFieldFake = {
            id: 'FAKE_FORM_FIELD_ID',
            value: 'FAKE_FORM_FIELD_VALUE',
            visibilityCondition: undefined
        };
        const fakeForm = new FormModel({
            variables: [
                {
                    name: 'FORM_VARIABLE_TEST',
                    type: 'string',
                    value: 'form_value_test'
                }]
        });

        beforeEach(() => {
            visibilityObjTest = new WidgetVisibilityModel({});
            formTest.values = formValues;
            fakeFormWithField = new FormModel(fakeFormJson);
            jsonFieldFake.visibilityCondition = visibilityObjTest;
        });

        afterEach(() => {
            service.cleanProcessVariable();
        });

        it('should be able to retrieve a field value searching in the form', () => {
            const formValue = service.searchValueInForm(stubFormWithFields, 'FIELD_WITH_CONDITION');

            expect(formValue).not.toBeNull();
            expect(formValue).toBe('field_with_condition_value');
        });

        it('should return empty string if the field value is not in the form', () => {
            const formValue = service.searchValueInForm(stubFormWithFields, 'FIELD_MYSTERY');

            expect(formValue).not.toBeUndefined();
            expect(formValue).toEqual('');
        });

        it('should search in the form if element value is not in form values', () => {
            const value = service.getFormValue(fakeFormWithField, 'FIELD_WITH_CONDITION');

            expect(value).not.toBeNull();
            expect(value).toBe('field_with_condition_value');
        });

        it('should return empty string if the element is not present anywhere', () => {
            const formValue = service.getFormValue(fakeFormWithField, 'FIELD_MYSTERY');

            expect(formValue).not.toBeUndefined();
            expect(formValue).toEqual('');
        });

        it('should retrieve the value for the right field when it is a value', () => {
            visibilityObjTest.rightValue = '100';
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBe('100');
        });

        it('should return formatted date when right value is a date', () => {
            visibilityObjTest.rightValue = '9999-12-31';
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBe('9999-12-31T00:00:00.000Z');
        });

        it('should return the value when right value is not a date', () => {
            visibilityObjTest.rightValue = '9999-99-99';
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBe('9999-99-99');
        });

        it('should retrieve the value for the right field when it is a form variable', () => {
            visibilityObjTest.rightType = 'field';
            visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_ID';
            const rightValue = service.getRightValue(fakeFormWithField, visibilityObjTest);

            expect(rightValue).not.toBeNull();
            expect(rightValue).toBe('RIGHT_FORM_FIELD_VALUE');
        });

        it('should take the value from form values if it is present', () => {
            const formValue = service.getFormValue(formTest, 'test_1');

            expect(formValue).not.toBeNull();
            expect(formValue).toBe('value_1');
        });

        it('should retrieve right value from form values if it is present', () => {
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'test_2';
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).not.toBeNull();
            expect(formTest.values).toEqual(formValues);
            expect(rightValue).toBe('value_2');
        });

        it('should retrieve the value for the left field when it is a form value', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'FIELD_WITH_CONDITION';
            const leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);

            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('field_with_condition_value');
        });

        it('should retrieve left value from form values if it is present', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'test_2';
            const leftValue = service.getLeftValue(formTest, visibilityObjTest);

            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('value_2');
        });

        it('should return undefined for a value that is not on variable or form', () => {
            const leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);
            expect(leftValue).toEqual('');
        });

        it('should evaluate the visibility for the field with single visibility condition between two field values', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'test_3';
            const isVisible = service.isFieldVisible(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should evaluate true visibility for the field with single visibility condition between a field and a value', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'value_1';
            const isVisible = service.isFieldVisible(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should evaluate the visibility for the field with single visibility condition between form values', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'LEFT_FORM_FIELD_ID';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_ID';
            const isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should refresh the visibility for a form field object', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'test_1';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'test_3';
            const fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
            service.refreshEntityVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeFalsy();
        });

        it('should notreset value when the field is not visibile', () => {
            visibilityObjTest.leftValue = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'test_3';
            const fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);

            service.refreshEntityVisibility(fakeFormField);
            expect(fakeFormField.isVisible).toBeFalsy();
            expect(fakeFormField.value).toEqual('FAKE_FORM_FIELD_VALUE');
        });

        it('should return true when the visibility condition is not valid', () => {
            visibilityObjTest = new WidgetVisibilityModel();
            visibilityObjTest.leftType = '';
            visibilityObjTest.leftValue = '';
            visibilityObjTest.operator = '!=';
            const isVisible = service.evaluateVisibility(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should return always true when field does not have a visibility condition', () => {
            jsonFieldFake.visibilityCondition = null;
            const fakeFormField: FormFieldModel = new FormFieldModel(fakeFormWithField, jsonFieldFake);
            fakeFormField.isVisible = false;
            service.refreshEntityVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeTruthy();
        });

        it('should be able to retrieve the value of a form variable', () => {
            const varValue = service.getVariableValue(fakeForm, 'FORM_VARIABLE_TEST', null);

            expect(varValue).not.toBeUndefined();
            expect(varValue).toBe('form_value_test');
        });

        it('should return undefined for not existing form variable', () => {
            const varValue = service.getVariableValue(fakeForm, 'MYSTERY_FORM_VARIABLE', null);

            expect(varValue).toBeUndefined();
        });

        it('should retrieve the value for the left field when it is a form variable', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'FORM_VARIABLE_TEST';
            const leftValue = service.getLeftValue(fakeForm, visibilityObjTest);

            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('form_value_test');
        });

        it('should be able to get the value for a standard field', () => {
            const dropdownValue = service.getFieldValue(formTest.values, 'test_2');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('value_2');
        });

        it('should get the dropdown id value from a form', () => {
            const dropdownValue = service.getFormValue(formTest, 'dropdown');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_id');
        });

        it('should retrieve the value for the right field when it is a dropdown id', () => {
            visibilityObjTest.rightType = 'field';
            visibilityObjTest.rightValue = 'dropdown';
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBeDefined();
            expect(rightValue).toBe('dropdown_id');
        });

        it('should be able to evaluate condition with a dropdown <id>', () => {
            visibilityObjTest.rightType = 'field';
            visibilityObjTest.leftType = 'field';
            visibilityObjTest.leftValue = 'test_4';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'dropdown';
            const fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
            service.refreshEntityVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeTruthy();
        });

        it('should be able to get value from form values', () => {
            const res = service.getFormValue(formTest, 'test_1');

            expect(res).not.toBeNull();
            expect(res).toBeDefined();
            expect(res).toBe('value_1');
        });

        it('should refresh the visibility for field', () => {
            visibilityObjTest.leftType = 'field';
            visibilityObjTest.leftValue = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightType = 'field';
            visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_ID';

            const container = <ContainerModel> fakeFormWithField.fields[0];
            const column0 = container.field.columns[0];
            const column1 = container.field.columns[1];

            column0.fields[0].visibilityCondition = visibilityObjTest;
            service.refreshVisibility(fakeFormWithField);

            expect(column0.fields[0].isVisible).toBeFalsy();
            expect(column0.fields[1].isVisible).toBeTruthy();
            expect(column0.fields[2].isVisible).toBeTruthy();
            expect(column1.fields[0].isVisible).toBeTruthy();
        });

        it('should refresh the visibility for tab in forms', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_VALUE';
            const tab = new TabModel(fakeFormWithField, {
                id: 'fake-tab-id',
                title: 'fake-tab-title',
                isVisible: true
            });
            tab.visibilityCondition = visibilityObjTest;
            fakeFormWithField.tabs.push(tab);
            service.refreshVisibility(fakeFormWithField);

            expect(fakeFormWithField.tabs[0].isVisible).toBeFalsy();
        });

        it('should use the form value to evaluate the visibility condition if the form value is defined', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                (res: TaskProcessVariableModel[]) => {
                    expect(res).toBeDefined();
                    const varValue = service.getVariableValue(formTest, 'FIELD_FORM_EMPTY', res);
                    expect(varValue).not.toBeUndefined();
                    expect(varValue).toBe('PROCESS_RIGHT_FORM_FIELD_VALUE');

                    visibilityObjTest.leftType = WidgetTypeEnum.field;
                    visibilityObjTest.leftValue = 'FIELD_FORM_EMPTY';
                    visibilityObjTest.operator = '==';
                    visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_VALUE';

                    const myForm = new FormModel({
                        id: '9999',
                        name: 'FORM_PROCESS_VARIABLE_VISIBILITY',
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
                                            id: 'FIELD_FORM_EMPTY',
                                            name: 'FIELD_FORM_EMPTY',
                                            type: 'text',
                                            value: 'RIGHT_FORM_FIELD_VALUE',
                                            visibilityCondition: null,
                                            isVisible: true
                                        },
                                        {
                                            fieldType: 'FormFieldRepresentation',
                                            id: 'FIELD_FORM_WITH_CONDITION',
                                            name: 'FIELD_FORM_WITH_CONDITION',
                                            type: 'text',
                                            value: 'field_form_with_condition_value',
                                            visibilityCondition: visibilityObjTest,
                                            isVisible: false
                                        }
                                    ]
                                }
                            }
                        ]
                    });

                    service.refreshVisibility(myForm);

                    const fieldWithVisibilityAttached = myForm.getFieldById('FIELD_FORM_WITH_CONDITION');
                    expect(fieldWithVisibilityAttached.isVisible).toBeTruthy();
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: [{ id: 'FIELD_FORM_EMPTY', type: 'string', value: 'PROCESS_RIGHT_FORM_FIELD_VALUE' }]
            });
        });

        it('should use the process value to evaluate the True visibility condition if the form value is empty', (done) => {

            service.getTaskProcessVariable('9999').subscribe(
                (res: TaskProcessVariableModel[]) => {
                    expect(res).toBeDefined();

                    visibilityObjTest.leftType = WidgetTypeEnum.field;
                    visibilityObjTest.leftValue = 'FIELD_FORM_EMPTY';
                    visibilityObjTest.operator = '==';
                    visibilityObjTest.rightType = WidgetTypeEnum.value;
                    visibilityObjTest.rightValue = 'PROCESS_RIGHT_FORM_FIELD_VALUE';

                    const myForm = new FormModel({
                        id: '9999',
                        name: 'FORM_PROCESS_VARIABLE_VISIBILITY',
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
                                            id: 'FIELD_FORM_EMPTY',
                                            name: 'FIELD_FORM_EMPTY',
                                            type: 'text',
                                            value: '',
                                            visibilityCondition: null,
                                            isVisible: true
                                        },
                                        {
                                            fieldType: 'FormFieldRepresentation',
                                            id: 'FIELD_FORM_WITH_CONDITION',
                                            name: 'FIELD_FORM_WITH_CONDITION',
                                            type: 'text',
                                            value: 'field_form_with_condition_value',
                                            visibilityCondition: visibilityObjTest,
                                            isVisible: false
                                        }
                                    ]
                                }
                            }
                        ]
                    });

                    service.refreshVisibility(myForm);

                    const fieldWithVisibilityAttached = myForm.getFieldById('FIELD_FORM_WITH_CONDITION');
                    expect(fieldWithVisibilityAttached.isVisible).toBeTruthy();
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: [{ id: 'FIELD_FORM_EMPTY', type: 'string', value: 'PROCESS_RIGHT_FORM_FIELD_VALUE' }]
            });
        });

        it('should use the process value to evaluate the False visibility condition if the form value is empty', (done) => {

            service.getTaskProcessVariable('9999').subscribe(
                (res: TaskProcessVariableModel[]) => {
                    expect(res).toBeDefined();

                    visibilityObjTest.leftType = 'FIELD_FORM_EMPTY';
                    visibilityObjTest.operator = '==';
                    visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_VALUE';

                    const myForm = new FormModel({
                        id: '9999',
                        name: 'FORM_PROCESS_VARIABLE_VISIBILITY',
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
                                            id: 'FIELD_FORM_EMPTY',
                                            name: 'FIELD_FORM_EMPTY',
                                            type: 'text',
                                            value: '',
                                            visibilityCondition: null,
                                            isVisible: true
                                        },
                                        {
                                            fieldType: 'FormFieldRepresentation',
                                            id: 'FIELD_FORM_WITH_CONDITION',
                                            name: 'FIELD_FORM_WITH_CONDITION',
                                            type: 'text',
                                            value: 'field_form_with_condition_value',
                                            visibilityCondition: visibilityObjTest,
                                            isVisible: true
                                        }
                                    ]
                                }
                            }
                        ]
                    });

                    service.refreshVisibility(myForm);

                    const fieldWithVisibilityAttached = myForm.getFieldById('FIELD_FORM_WITH_CONDITION');
                    expect(fieldWithVisibilityAttached.isVisible).toBeFalsy();
                    done();
                }
            );
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: [{ id: 'FIELD_FORM_EMPTY', type: 'string', value: 'PROCESS_RIGHT_FORM_FIELD_VALUE' }]
            });
        });

        it('should refresh the visibility for single tab', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_ID';
            const tab = new TabModel(fakeFormWithField, {
                id: 'fake-tab-id',
                title: 'fake-tab-title',
                isVisible: true
            });
            tab.visibilityCondition = visibilityObjTest;
            service.refreshEntityVisibility(tab);

            expect(tab.isVisible).toBeFalsy();
        });

        it('should refresh the visibility for container in forms', () => {
            visibilityObjTest.leftType = 'FIELD_TEST';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightType = 'LEFT_FORM_FIELD_ID';
            const contModel = new ContainerModel(new FormFieldModel(fakeFormWithField, {
                id: 'fake-container-id',
                type: FormFieldTypes.GROUP,
                name: 'fake-container-name',
                isVisible: true,
                visibilityCondition: visibilityObjTest
            }));

            fakeFormWithField.fields.push(contModel);
            service.refreshVisibility(fakeFormWithField);
            expect(contModel.isVisible).toBeFalsy();
        });

        it('should refresh the visibility for single container', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_ID';
            const contModel = new ContainerModel(new FormFieldModel(fakeFormWithField, {
                id: 'fake-container-id',
                type: FormFieldTypes.GROUP,
                name: 'fake-container-name',
                isVisible: true,
                visibilityCondition: visibilityObjTest
            }));
            service.refreshEntityVisibility(contModel.field);
            expect(contModel.isVisible).toBeFalsy();
        });

        it('should evaluate checkbox condition', (done) => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'CheckboxOne';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'CheckboxTwo';

            const checkboxForm = new FormModel({
                id: '9999',
                name: 'CHECKBOX_VISIBILITY',
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
                                    id: 'CheckboxOne',
                                    name: 'CheckboxOne',
                                    type: 'boolean',
                                    required: false,
                                    value: false,
                                    colspan: 1,
                                    visibilityCondition: null
                                },
                                {
                                    id: 'CheckboxTwo',
                                    name: 'CheckboxTwo',
                                    type: 'boolean',
                                    required: false,
                                    value: false,
                                    colspan: 1,
                                    visibilityCondition: null
                                }
                            ],
                            2: [
                                {
                                    id: 'CheckboxNotReq',
                                    name: 'CheckboxNotReq',
                                    type: 'boolean',
                                    required: false,
                                    colspan: 1,
                                    visibilityCondition: visibilityObjTest
                                }
                            ]
                        }
                    }
                ]
            });

            service.refreshVisibility(checkboxForm);

            const fieldWithVisibilityAttached = checkboxForm.getFieldById('CheckboxNotReq');
            expect(fieldWithVisibilityAttached.isVisible).toBeTruthy();
            done();
        });
    });

    describe('Visibility based on form variables', () => {

        const fakeFormWithVariables = new FormModel(fakeFormJson);
        const complexVisibilityModel = new FormModel(complexVisibilityJsonVisible);
        const complexVisibilityJsonNotVisibleModel = new FormModel(complexVisibilityJsonNotVisible);
        let visibilityObjTest: WidgetVisibilityModel;

        beforeEach(() => {
            visibilityObjTest = new WidgetVisibilityModel({});
        });

        it('should set visibility to true when validation for string variables succeeds', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.variable;
            visibilityObjTest.leftValue = 'name';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'abc';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should be able to analyze a complex visibility JSON truthy', () => {
            const isVisible = service.isFieldVisible(complexVisibilityModel,
                complexVisibilityJsonVisible.formDefinition.fields[2].fields[2][0].visibilityCondition);

            expect(isVisible).toBe(true);
        });

        it('should be able to analyze a complex visibility JSON false', () => {
            const isVisible = service.isFieldVisible(complexVisibilityJsonNotVisibleModel,
                complexVisibilityJsonNotVisible.formDefinition.fields[2].fields[2][0].visibilityCondition);

            expect(isVisible).toBe(false);
        });

        it('should set visibility to false when validation for string variables fails', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.variable;
            visibilityObjTest.leftValue = 'name';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'abc1';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeFalsy();
        });

        it('should set visibility to true when validation for integer variables succeeds', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.variable;
            visibilityObjTest.leftValue = 'age';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '11';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should set visibility to false when validation for integer variables fails', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.variable;
            visibilityObjTest.leftValue = 'age';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '13';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeFalsy();
        });

        it('should set visibility to true when validation for date variables succeeds', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.variable;
            visibilityObjTest.leftValue = 'dob';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '2019-05-13';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should set visibility to false when validation for date variables fails', () => {
            visibilityObjTest.leftValue = 'dob';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '2019-05-15';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeFalsy();
        });

        it('should validate visiblity for form fields by finding the field with id', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = '0207b649-ff07-4f3a-a589-d10afa507b9b';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '2019-05-13';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should evaluate visibility between checkbox and variable', (done) => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'CheckboxTwo';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightType = WidgetTypeEnum.variable;
            visibilityObjTest.rightValue = 'var2';

            const checkboxForm = new FormModel({
                id: '9999',
                name: 'CHECKBOX_VISIBILITY',
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
                                    id: 'CheckboxOne',
                                    name: 'CheckboxOne',
                                    type: 'boolean',
                                    required: false,
                                    value: false,
                                    colspan: 1,
                                    visibilityCondition: null
                                },
                                {
                                    id: 'CheckboxTwo',
                                    name: 'CheckboxTwo',
                                    type: 'boolean',
                                    required: false,
                                    value: false,
                                    colspan: 1,
                                    visibilityCondition: null
                                }
                            ],
                            2: [
                                {
                                    id: 'CheckboxThree',
                                    name: 'CheckboxThree',
                                    type: 'boolean',
                                    required: false,
                                    colspan: 1,
                                    visibilityCondition: visibilityObjTest
                                }
                            ]
                        }
                    }
                ],
                variables: [
                    {
                        id: 'id',
                        name: 'var2',
                        type: 'boolean',
                        value: false
                    }
                ]
            });

            service.refreshVisibility(checkboxForm);

            const fieldWithVisibilityAttached = checkboxForm.getFieldById('CheckboxThree');
            expect(fieldWithVisibilityAttached.isVisible).toBeTruthy();
            done();
        });

        it('should evaluate visibility between empty text fields', (done) => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'Text1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'Text2';

            const checkboxForm = new FormModel(headerVisibilityCond);
            checkboxForm.getFieldById('Text1').value = '1';
            checkboxForm.getFieldById('Text1').value = '';

            service.refreshVisibility(checkboxForm);

            const fieldWithVisibilityAttached = checkboxForm.getFieldById('Header0hm6n0');
            expect(fieldWithVisibilityAttached.isVisible).toBeTruthy();
            done();
        });
    });
});
