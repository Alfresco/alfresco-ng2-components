/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ContainerModel, FormFieldModel, FormFieldTypes, FormModel, TabModel, FormOutcomeModel } from '../components/widgets/core';
import { WidgetVisibilityModel, WidgetTypeEnum } from '../models/widget-visibility.model';
import { WidgetVisibilityService } from './widget-visibility.service';
import {
    fakeFormJson,
    formTest,
    formValues,
    complexVisibilityJsonVisible,
    nextConditionForm,
    complexVisibilityJsonNotVisible,
    headerVisibilityCond
} from '../../mock/form/widget-visibility-cloud.service.mock';

declare let jasmine: any;

describe('WidgetVisibilityCloudService', () => {
    let service: WidgetVisibilityService;
    let booleanResult: boolean | undefined;

    const stubFormWithFields = new FormModel(fakeFormJson);

    beforeEach(() => {
        service = TestBed.inject(WidgetVisibilityService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
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
            booleanResult = service.evaluateCondition(null, null, '');
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

    describe('should return the value of the field', () => {
        let visibilityObjTest: WidgetVisibilityModel;
        let fakeFormWithField = new FormModel(fakeFormJson);
        const jsonFieldFake: { id: string; value: string; visibilityCondition?: WidgetVisibilityModel } = {
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
                }
            ]
        });

        beforeEach(() => {
            visibilityObjTest = new WidgetVisibilityModel({});
            formTest.values = formValues;
            fakeFormWithField = new FormModel(fakeFormJson);
            jsonFieldFake.visibilityCondition = visibilityObjTest;
        });

        it('should be able to retrieve a field value searching in the form', () => {
            const formField = service.getFormFieldById(stubFormWithFields, 'FIELD_WITH_CONDITION');
            const formValue = service.searchValueInForm(formField, 'FIELD_WITH_CONDITION');

            expect(formValue).not.toBeNull();
            expect(formValue).toBe('field_with_condition_value');
        });

        it('should return empty string if the field value is not in the form', () => {
            const formField = service.getFormFieldById(stubFormWithFields, 'FIELD_MYSTERY');
            const formValue = service.searchValueInForm(formField, 'FIELD_MYSTERY');

            expect(formValue).not.toBeUndefined();
            expect(formValue).toEqual('');
        });

        it('should search in the form if element value is not in form values', () => {
            const value = service.getFormValue(fakeFormWithField, 'FIELD_WITH_CONDITION');

            expect(value).not.toBeNull();
            expect(value).toBe('field_with_condition_value');
        });

        it('should return undefined if the element is not present anywhere', () => {
            const formValue = service.getFormValue(fakeFormWithField, 'FIELD_MYSTERY');
            expect(formValue).toBeUndefined();
        });

        it('should retrieve the value for the right field when it is a value', () => {
            visibilityObjTest.rightValue = '100';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBe('100');
        });

        it('should return formatted date when right value is a date', () => {
            visibilityObjTest.rightValue = '9999-12-31';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBe('9999-12-31T00:00:00.000Z');
        });

        it('should return the value when right value is not a date', () => {
            visibilityObjTest.rightValue = '9999-99-99';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
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
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const formValue = service.getFormValue(formTest, 'test_1');

            expect(formValue).not.toBeNull();
            expect(formValue).toBe('value_1');
        });

        it('should retrieve right value from form values if it is present', () => {
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'test_2';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
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
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
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
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const isVisible = service.isFieldVisible(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should evaluate true visibility for the field with single visibility condition between a field and a value', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'value_1';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
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
            jsonFieldFake.visibilityCondition = undefined;
            const fakeFormField: FormFieldModel = new FormFieldModel(fakeFormWithField, jsonFieldFake);
            fakeFormField.isVisible = false;
            service.refreshEntityVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeTruthy();
        });

        it('should be able to retrieve the value of a form variable', () => {
            const varValue = service.getVariableValue(fakeForm, 'FORM_VARIABLE_TEST', []);

            expect(varValue).not.toBeUndefined();
            expect(varValue).toBe('form_value_test');
        });

        it('should return undefined for not existing form variable', () => {
            const varValue = service.getVariableValue(fakeForm, 'MYSTERY_FORM_VARIABLE', []);

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
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const dropdownValue = service.getFormValue(formTest, 'dropdown');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_id');
        });

        it('should retrieve the value for the right field when it is a dropdown id', () => {
            visibilityObjTest.rightType = 'field';
            visibilityObjTest.rightValue = 'dropdown';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
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
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
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

            const container = fakeFormWithField.fields[0];
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

        it('should refresh the visibility for Outcomes in forms', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_VALUE';
            const outcome = new FormOutcomeModel(fakeFormWithField, {
                isSystem: false,
                isSelected: false,
                isVisible: true
            });

            outcome.visibilityCondition = visibilityObjTest;
            fakeFormWithField.outcomes.push(outcome);
            service.refreshVisibility(fakeFormWithField);
            const outcomeIndex = fakeFormWithField.outcomes.length - 1;
            expect(fakeFormWithField.outcomes[outcomeIndex].isVisible).toBeFalsy();
        });

        it('should use the process variables when they are passed to check the visibility', () => {
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
                            '1': [
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

            service.refreshVisibility(myForm, [{ id: 'FIELD_FORM_EMPTY', type: 'string', value: 'PROCESS_RIGHT_FORM_FIELD_VALUE' }]);

            const fieldWithVisibilityAttached = myForm.getFieldById('FIELD_FORM_WITH_CONDITION');
            expect(fieldWithVisibilityAttached.isVisible).toBeTruthy();
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
            const contModel = new ContainerModel(
                new FormFieldModel(fakeFormWithField, {
                    id: 'fake-container-id',
                    type: FormFieldTypes.GROUP,
                    name: 'fake-container-name',
                    isVisible: true,
                    visibilityCondition: visibilityObjTest
                })
            );

            fakeFormWithField.fieldsCache.push(contModel.field);
            service.refreshVisibility(fakeFormWithField);
            expect(contModel.isVisible).toBeFalsy();
        });

        it('should refresh the visibility for single container', () => {
            visibilityObjTest.leftType = WidgetTypeEnum.field;
            visibilityObjTest.leftValue = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightType = WidgetTypeEnum.field;
            visibilityObjTest.rightValue = 'RIGHT_FORM_FIELD_ID';
            const contModel = new ContainerModel(
                new FormFieldModel(fakeFormWithField, {
                    id: 'fake-container-id',
                    type: FormFieldTypes.GROUP,
                    name: 'fake-container-name',
                    isVisible: true,
                    visibilityCondition: visibilityObjTest
                })
            );
            service.refreshEntityVisibility(contModel.field);
            expect(contModel.isVisible).toBeFalsy();
        });

        it('should evaluate radio box LABEL condition', (done) => {
            visibilityObjTest.leftFormFieldId = 'radioBoxField_LABEL';
            visibilityObjTest.leftRestResponseId = undefined;
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'No';
            visibilityObjTest.rightType = null;
            visibilityObjTest.rightFormFieldId = '';
            visibilityObjTest.rightRestResponseId = '';
            visibilityObjTest.nextConditionOperator = '';
            visibilityObjTest.nextCondition = undefined;

            const radioBoxForm = new FormModel({
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
                            '1': [
                                {
                                    id: 'radioboxField',
                                    name: 'radioboxField test',
                                    type: 'radio-buttons',
                                    options: [
                                        {
                                            id: 'radioBoxYes',
                                            name: 'Yes'
                                        },
                                        {
                                            id: 'radioBoxNo',
                                            name: 'No'
                                        }
                                    ]
                                },
                                {
                                    id: 'textBoxTest',
                                    name: 'textbox test',
                                    type: 'people',
                                    visibilityCondition: visibilityObjTest
                                }
                            ]
                        }
                    }
                ]
            });

            const fieldWithVisibilityAttached = radioBoxForm.getFieldById('textBoxTest');
            const radioBox = radioBoxForm.getFieldById('radioboxField');

            radioBox.value = 'Yes';
            service.refreshVisibility(radioBoxForm);
            expect(fieldWithVisibilityAttached.isVisible).toBeFalsy();

            radioBox.value = 'No';
            service.refreshVisibility(radioBoxForm);
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
            const isVisible = service.isFieldVisible(
                complexVisibilityModel,
                complexVisibilityJsonVisible.formDefinition.fields[2].fields[2][0].visibilityCondition
            );

            expect(isVisible).toBe(true);
        });

        it('should be able to analyze a complex visibility JSON false', () => {
            const isVisible = service.isFieldVisible(
                complexVisibilityJsonNotVisibleModel,
                complexVisibilityJsonNotVisible.formDefinition.fields[2].fields[2][0].visibilityCondition
            );

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
                            '1': [
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
                            '2': [
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
