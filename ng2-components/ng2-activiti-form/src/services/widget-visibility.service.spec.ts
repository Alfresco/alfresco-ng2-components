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

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import {
    formTest,
    fakeTaskProcessVariableModels,
    formValues,
    fakeFormJson
} from './assets/widget-visibility.service.mock';
import { WidgetVisibilityService } from './widget-visibility.service';
import { AlfrescoSettingsService, AlfrescoAuthenticationService, AlfrescoApiService } from 'ng2-alfresco-core';
import { TaskProcessVariableModel } from '../models/task-process-variable.model';
import { WidgetVisibilityModel } from '../models/widget-visibility.model';
import { FormModel, FormFieldModel, TabModel } from '../components/widgets/core/index';

declare let jasmine: any;

describe('WidgetVisibilityService (mockBackend)', () => {
    let service: WidgetVisibilityService;
    let booleanResult: boolean;
    let stubFormWithFields = new FormModel(fakeFormJson);

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService,
                WidgetVisibilityService
            ]
        });
        service = TestBed.get(WidgetVisibilityService);
    });

    beforeEach(() => {
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
    });

    describe('should retrive the process variables', () => {
        let fakeFormWithField = new FormModel(fakeFormJson);
        let visibilityObjTest: WidgetVisibilityModel;
        let chainedVisibilityObj = new WidgetVisibilityModel();

        beforeEach(() => {
            visibilityObjTest = new WidgetVisibilityModel();
        });

        it('should return the process variables for task', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
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
                status: 200,
                contentType: 'json',
                responseText: fakeTaskProcessVariableModels
            });
        });

        it('should be able to retrieve the value of a process variable', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                (res: TaskProcessVariableModel[]) => {
                    expect(res).toBeDefined();
                    let varValue = service.getVariableValue(formTest, 'TEST_VAR_1', res);
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
                    let varValue = service.getVariableValue(formTest, 'TEST_MYSTERY_VAR', res);
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
                (res: TaskProcessVariableModel[]) => {
                    visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';
                    let rightValue = service.getRightValue(formTest, visibilityObjTest);

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
                (res: TaskProcessVariableModel[]) => {
                    visibilityObjTest.leftRestResponseId = 'TEST_VAR_2';
                    let rightValue = service.getLeftValue(formTest, visibilityObjTest);

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

        it('should evaluate the visibility for the field between form value and process var', (done) => {
            service.getTaskProcessVariable('9999').subscribe(
                (res: TaskProcessVariableModel[]) => {
                    visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
                    visibilityObjTest.operator = '!=';
                    visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';
                    let isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);

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
                (res: TaskProcessVariableModel[]) => {
                    visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
                    visibilityObjTest.operator = '!=';
                    visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';
                    visibilityObjTest.nextConditionOperator = 'and';
                    chainedVisibilityObj.leftRestResponseId = 'TEST_VAR_2';
                    chainedVisibilityObj.operator = '!empty';
                    visibilityObjTest.nextCondition = chainedVisibilityObj;

                    let isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);

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
        let jsonFieldFake = {
            id: 'FAKE_FORM_FIELD_ID',
            value: 'FAKE_FORM_FIELD_VALUE',
            visibilityCondition: undefined
        };
        let fakeForm = new FormModel({
            variables: [
                {
                    name: 'FORM_VARIABLE_TEST',
                    type: 'string',
                    value: 'form_value_test'
                }]
        });

        beforeEach(() => {
            visibilityObjTest = new WidgetVisibilityModel();
            formTest.values = formValues;
            jsonFieldFake.visibilityCondition = visibilityObjTest;
        });

        it('should be able to retrieve a field value searching in the form', () => {
            let formValue = service.searchForm(stubFormWithFields, 'FIELD_WITH_CONDITION');

            expect(formValue).not.toBeNull();
            expect(formValue).toBe('field_with_condition_value');
        });

        it('should return undefined if the field value is not in the form', () => {
            let formValue = service.searchForm(stubFormWithFields, 'FIELD_MYSTERY');

            expect(formValue).toBeUndefined();
        });

        it('should search in the form if element value is not in form values', () => {
            let value = service.getFormValue(fakeFormWithField, 'FIELD_WITH_CONDITION');

            expect(value).not.toBeNull();
            expect(value).toBe('field_with_condition_value');
        });

        it('should return undefined if the element is not present anywhere', () => {
            let formValue = service.getFormValue(fakeFormWithField, 'FIELD_MYSTERY');

            expect(formValue).toBeUndefined();
        });

        it('should retrieve the value for the right field when it is a value', () => {
            visibilityObjTest.rightValue = '100';
            let rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBe('100');
        });

        it('should retrieve the value for the right field when it is a form variable', () => {
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            let rightValue = service.getRightValue(fakeFormWithField, visibilityObjTest);

            expect(rightValue).not.toBeNull();
            expect(rightValue).toBe('RIGHT_FORM_FIELD_VALUE');
        });

        it('should take the value from form values if it is present', () => {
            let formValue = service.getFormValue(formTest, 'test_1');

            expect(formValue).not.toBeNull();
            expect(formValue).toBe('value_1');
        });

        it('should retrieve right value from form values if it is present', () => {
            visibilityObjTest.rightFormFieldId = 'test_2';
            let rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).not.toBeNull();
            expect(formTest.values).toEqual(formValues);
            expect(rightValue).toBe('value_2');
        });

        it('should retrieve the value for the left field when it is a form value', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_WITH_CONDITION';
            let leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);

            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('field_with_condition_value');
        });

        it('should retrieve left value from form values if it is present', () => {
            visibilityObjTest.leftFormFieldId = 'test_2';
            let leftValue = service.getLeftValue(formTest, visibilityObjTest);

            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('value_2');
        });

        it('should return undefined for a value that is not on variable or form', () => {
            let leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);

            expect(leftValue).toBeUndefined();
        });

        it('should evaluate the visibility for the field with single visibility condition between two field values', () => {
            visibilityObjTest.leftFormFieldId = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'test_3';
            let isVisible = service.isFieldVisible(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should evaluate true visibility for the field with single visibility condition between a field and a value', () => {
            visibilityObjTest.leftFormFieldId = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'value_1';
            let isVisible = service.isFieldVisible(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should return undefined for a value that is not on variable or form', () => {
            visibilityObjTest.rightFormFieldId = 'NO_FIELD_FORM';
            let rightValue = service.getRightValue(fakeFormWithField, visibilityObjTest);

            expect(rightValue).toBeUndefined();
        });

        it('should evaluate the visibility for the field with single visibility condition between form values', () => {
            visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            let isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should refresh the visibility for a form field object', () => {
            visibilityObjTest.leftFormFieldId = 'test_1';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'test_3';
            let fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
            service.refreshFieldVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeFalsy();
        });

        it('should return true when the visibility condition is not valid', () => {
            visibilityObjTest.leftFormFieldId = '';
            visibilityObjTest.leftRestResponseId = '';
            visibilityObjTest.operator = '!=';
            let isVisible = service.evaluateVisibility(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should not change the isVisible if field does not have visibility condition', () => {
            jsonFieldFake.visibilityCondition = null;
            let fakeFormField: FormFieldModel = new FormFieldModel(fakeFormWithField, jsonFieldFake);
            fakeFormField.isVisible = false;
            service.refreshFieldVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeFalsy();
        });

        it('should be able to retrieve the value of a form variable', () => {
            let varValue = service.getVariableValue(fakeForm, 'FORM_VARIABLE_TEST', null);

            expect(varValue).not.toBeUndefined();
            expect(varValue).toBe('form_value_test');
        });

        it('should return undefined for not existing form variable', () => {
            let varValue = service.getVariableValue(fakeForm, 'MISTERY_FORM_VARIABLE', null);

            expect(varValue).toBeUndefined();
        });

        it('should retrieve the value for the left field when it is a form variable', () => {
            visibilityObjTest.leftRestResponseId = 'FORM_VARIABLE_TEST';
            let leftValue = service.getLeftValue(fakeForm, visibilityObjTest);

            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('form_value_test');
        });

        it('should determine visibility for dropdown on label condition', () => {
            let dropdownValue = service.getDropDownName(formTest.values, 'dropdown_LABEL');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_label');
        });

        it('should be able to get the value for a dropdown filtered with Label', () => {
            let dropdownValue = service.getValue(formTest.values, 'dropdown_LABEL');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_label');
        });

        it('should be able to get the value for a standard field', () => {
            let dropdownValue = service.getValue(formTest.values, 'test_2');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('value_2');
        });

        it('should get the dropdown label value from a form', () => {
            let dropdownValue = service.getFormValue(formTest, 'dropdown_LABEL');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_label');
        });

        it('should get the dropdown id value from a form', () => {
            let dropdownValue = service.getFormValue(formTest, 'dropdown');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_id');
        });

        it('should retrieve the value for the right field when it is a dropdown id', () => {
            visibilityObjTest.rightFormFieldId = 'dropdown';
            let rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBeDefined();
            expect(rightValue).toBe('dropdown_id');
        });

        it('should retrieve the value for the right field when it is a dropdown label', () => {
            visibilityObjTest.rightFormFieldId = 'dropdown_LABEL';
            let rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBeDefined();
            expect(rightValue).toBe('dropdown_label');
        });

        it('should be able to evaluate condition with a dropdown <label>', () => {
            visibilityObjTest.leftFormFieldId = 'test_5';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'dropdown_LABEL';
            let fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
            service.refreshFieldVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeTruthy();
        });

        it('should be able to evaluate condition with a dropdown <id>', () => {
            visibilityObjTest.leftFormFieldId = 'test_4';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'dropdown';
            let fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
            service.refreshFieldVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeTruthy();
        });

        it('should be able to get value from form values', () => {
            let res = service.getFormValue(formTest, 'test_1');

            expect(res).not.toBeNull();
            expect(res).toBeDefined();
            expect(res).toBe('value_1');
        });

        it('should refresh the visibility for field', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            fakeFormWithField.fields[0].columns[0].fields[0].visibilityCondition = visibilityObjTest;
            service.refreshVisibility(fakeFormWithField);

            expect(fakeFormWithField.fields[0].columns[0].fields[0].isVisible).toBeFalsy();
            expect(fakeFormWithField.fields[0].columns[0].fields[1].isVisible).toBeTruthy();
            expect(fakeFormWithField.fields[0].columns[0].fields[2].isVisible).toBeTruthy();
            expect(fakeFormWithField.fields[0].columns[1].fields[0].isVisible).toBeTruthy();
        });

        it('should refresh the visibility for tab in forms', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            let tab = new TabModel(fakeFormWithField, {id: 'fake-tab-id', title: 'fake-tab-title', isVisible: true});
            tab.visibilityCondition = visibilityObjTest;
            fakeFormWithField.tabs.push(tab);
            service.refreshVisibility(fakeFormWithField);

            expect(fakeFormWithField.tabs[0].isVisible).toBeFalsy();
        });

        it('should refresh the visibility for single tab', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            let tab = new TabModel(fakeFormWithField, {id: 'fake-tab-id', title: 'fake-tab-title', isVisible: true});
            tab.visibilityCondition = visibilityObjTest;
            service.refreshTabVisibility(tab);

            expect(tab.isVisible).toBeFalsy();
        });
    });
});
