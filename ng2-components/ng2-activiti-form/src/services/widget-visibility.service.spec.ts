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

import {
    async, inject, TestBed
} from '@angular/core/testing';

import {
    MockBackend,
    MockConnection
} from '@angular/http/testing';

import {
    HttpModule,
    Http,
    XHRBackend,
    Response,
    ResponseOptions
} from '@angular/http';
import {WidgetVisibilityService} from './widget-visibility.service';
import {AlfrescoSettingsService} from 'ng2-alfresco-core';
import {TaskProcessVariableModel} from '../models/task-process-variable.model';
import {WidgetVisibilityModel} from '../models/widget-visibility.model';
import {FormModel, FormValues, FormFieldModel} from '../components/widgets/core/index';

describe('WidgetVisibilityService (mockBackend)', () => {
    let formTest = new FormModel({});
    let fakeTaskProcessVariableModels = [
        {id: 'TEST_VAR_1', type: 'string', value: 'test_value_1'},
        {id: 'TEST_VAR_2', type: 'string', value: 'test_value_2'},
        {id: 'TEST_VAR_3', type: 'string', value: 'test_value_3'}
    ];
    let formValues: FormValues = {
        'test_1': 'value_1',
        'test_2': 'value_2',
        'test_3': 'value_1',
        'test_4': 'dropdown_id',
        'test_5': 'dropdown_label',
        'dropdown': {'id': 'dropdown_id', 'name': 'dropdown_label'}
    };
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                WidgetVisibilityService,
                AlfrescoSettingsService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        }).compileComponents();
    }));

    it('can instantiate service when inject service',
        inject([WidgetVisibilityService], (service: WidgetVisibilityService) => {
            expect(service instanceof WidgetVisibilityService).toBe(true);
        }));

    it('can instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new WidgetVisibilityService(http, null);
        expect(service instanceof WidgetVisibilityService).toBe(true, 'new service should be ok');
    }));

    it('can provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        }));

    describe('should be able to evaluate logic operations', () => {
        let res: boolean;
        let service: WidgetVisibilityService = new WidgetVisibilityService(null, null);

        it('using AND and return true', () => {
            res = service.evaluateLogicalOperation('and', true, true);
            expect(res).toBeTruthy();
        });
        it('using AND and return false', () => {
            res = service.evaluateLogicalOperation('and', true, false);
            expect(res).toBeFalsy();
        });
        it('using OR and return true', () => {
            res = service.evaluateLogicalOperation('or', true, false);
            expect(res).toBeTruthy();
        });
        it('using OR and return false', () => {
            res = service.evaluateLogicalOperation('or', false, false);
            expect(res).toBeFalsy();
        });
        it('using AND NOT and return true', () => {
            res = service.evaluateLogicalOperation('and-not', true, false);
            expect(res).toBeTruthy();
        });
        it('using AND NOT and return false', () => {
            res = service.evaluateLogicalOperation('and-not', false, false);
            expect(res).toBeFalsy();
        });
        it('using OR NOT and return true', () => {
            res = service.evaluateLogicalOperation('or-not', true, true);
            expect(res).toBeTruthy();
        });
        it('using OR NOT and return false', () => {
            res = service.evaluateLogicalOperation('or-not', false, true);
            expect(res).toBeFalsy();
        });
    });

    describe('should be able to evaluate next condition operations', () => {
        let res: boolean;
        let service: WidgetVisibilityService = new WidgetVisibilityService(null, null);

        it('using == and return true', () => {
            res = service.evaluateCondition('test', 'test', '==');
            expect(res).toBeTruthy();
        });
        it('using < and return true', () => {
            res = service.evaluateCondition(1, 2, '<');
            expect(res).toBeTruthy();
        });
        it('using != and return true', () => {
            res = service.evaluateCondition(true, false, '!=');
            expect(res).toBeTruthy();
        });
        it('using != and return false', () => {
            res = service.evaluateCondition(true, true, '!=');
            expect(res).toBeFalsy();
        });
        it('using >= and return true', () => {
            res = service.evaluateCondition(2, 2, '>=');
            expect(res).toBeTruthy();
        });
        it('using empty with null values and return true', () => {
            res = service.evaluateCondition(null, null, 'empty');
            expect(res).toBeTruthy();
        });
        it('using empty with empty strings values and return true', () => {
            res = service.evaluateCondition('', '', 'empty');
            expect(res).toBeTruthy();
        });
        it('using > and return false', () => {
            res = service.evaluateCondition(2, 3, '>');
            expect(res).toBeFalsy();
        });
        it('using not empty with null values and return false', () => {
            res = service.evaluateCondition(null, null, '!empty');
            expect(res).toBeFalsy();
        });
        it('using OR NOT with empty strings and return false', () => {
            res = service.evaluateCondition('', '', '!empty');
            expect(res).toBeFalsy();
        });
    });

    describe('after backend is mocked', () => {
        let backend: MockBackend;
        let service: WidgetVisibilityService;
        let stubFormWithFields = new FormModel(fakeFormJson);

        beforeEach(inject([Http, XHRBackend, AlfrescoSettingsService],
            (http: Http,
             be: MockBackend,
             setting: AlfrescoSettingsService) => {
                backend = be;
                service = new WidgetVisibilityService(http, setting);
            }));

        describe('should retrive the process variables', () => {
            let fakeFormWithField = new FormModel(fakeFormJson);
            let visibilityObjTest: WidgetVisibilityModel;
            let chainedVisibilityObj = new WidgetVisibilityModel();

            beforeEach(() => {
                let options = new ResponseOptions({
                    status: 200,
                    body: fakeTaskProcessVariableModels
                });
                let response = new Response(options);
                backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
                visibilityObjTest = new WidgetVisibilityModel();
            });

            it('should return the process variables for task', (done) => {
                service.getTaskProcessVariableModelsForTask('9999').subscribe(
                    (res: TaskProcessVariableModel[]) => {
                        expect(res).toBeDefined();
                        expect(res.length).toEqual(3);
                        expect(res[0].id).toEqual('TEST_VAR_1');
                        expect(res[0].type).toEqual('string');
                        expect(res[0].value).toEqual('test_value_1');
                        done();
                    }
                );
            });

            it('should be able to retrieve the value of a process variable', (done) => {
                service.getTaskProcessVariableModelsForTask('9999').subscribe(
                    (res: TaskProcessVariableModel[]) => {
                        expect(res).toBeDefined();
                        let varValue = service.getValueFromVariable(formTest, 'TEST_VAR_1', res);
                        expect(varValue).not.toBeUndefined();
                        expect(varValue).toBe('test_value_1');
                        done();
                    }
                );
            });

            it('should return undefined if the variable does not exist', (done) => {
                service.getTaskProcessVariableModelsForTask('9999').subscribe(
                    (res: TaskProcessVariableModel[]) => {
                        let varValue = service.getValueFromVariable(formTest, 'TEST_MYSTERY_VAR', res);
                        expect(varValue).toBeUndefined();
                        done();
                    }
                );
            });

            it('should retrieve the value for the right field when it is a process variable', (done) => {
                service.getTaskProcessVariableModelsForTask('9999').subscribe(
                    (res: TaskProcessVariableModel[]) => {
                        visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';
                        let rightValue = service.getRightValue(formTest, visibilityObjTest);

                        expect(rightValue).not.toBeNull();
                        expect(rightValue).toBe('test_value_2');
                        done();
                    }
                );
            });

            it('should retrieve the value for the left field when it is a process variable', (done) => {
                service.getTaskProcessVariableModelsForTask('9999').subscribe(
                    (res: TaskProcessVariableModel[]) => {
                        visibilityObjTest.leftRestResponseId = 'TEST_VAR_2';
                        let rightValue = service.getLeftValue(formTest, visibilityObjTest);

                        expect(rightValue).not.toBeNull();
                        expect(rightValue).toBe('test_value_2');
                        done();
                    }
                );
            });

            it('should evaluate the visibility for the field between form value and process var', (done) => {
                service.getTaskProcessVariableModelsForTask('9999').subscribe(
                    (res: TaskProcessVariableModel[]) => {
                        visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
                        visibilityObjTest.operator = '!=';
                        visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';
                        let isVisible = service.evaluateVisibilityForField(fakeFormWithField, visibilityObjTest);

                        expect(isVisible).toBeTruthy();
                        done();
                    }
                );
            });

            it('should evaluate visibility with multiple conditions', (done) => {
                service.getTaskProcessVariableModelsForTask('9999').subscribe(
                    (res: TaskProcessVariableModel[]) => {
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
                let formValue = service.getFormValueByName(stubFormWithFields, 'FIELD_WITH_CONDITION');

                expect(formValue).not.toBeNull();
                expect(formValue).toBe('field_with_condition_value');
            });

            it('should return undefined if the field value is not in the form', () => {
                let formValue = service.getFormValueByName(stubFormWithFields, 'FIELD_MYSTERY');

                expect(formValue).toBeUndefined();
            });

            it('should search in the form if element value is not in form values', () => {
                let value = service.getValueOField(fakeFormWithField, 'FIELD_WITH_CONDITION');

                expect(value).not.toBeNull();
                expect(value).toBe('field_with_condition_value');
            });

            it('should return undefined if the element is not present anywhere', () => {
                let formValue = service.getValueOField(fakeFormWithField, 'FIELD_MYSTERY');

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
                let formValue = service.getValueOField(formTest, 'test_1');

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
                let isVisible = service.evaluateVisibilityForField(formTest, visibilityObjTest);

                expect(isVisible).toBeTruthy();
            });

            it('should evaluate true visibility for the field with single visibility condition between a field and a value', () => {
                visibilityObjTest.leftFormFieldId = 'test_1';
                visibilityObjTest.operator = '==';
                visibilityObjTest.rightValue = 'value_1';
                let isVisible = service.evaluateVisibilityForField(formTest, visibilityObjTest);

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
                let isVisible = service.evaluateVisibilityForField(fakeFormWithField, visibilityObjTest);

                expect(isVisible).toBeTruthy();
            });

            it('should refresh the visibility for a form field object', () => {
                visibilityObjTest.leftFormFieldId = 'test_1';
                visibilityObjTest.operator = '!=';
                visibilityObjTest.rightFormFieldId = 'test_3';
                let fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
                service.refreshVisibilityForField(fakeFormField);

                expect(fakeFormField.isVisible).toBeFalsy();
            });

            it('should return true when the visibility condition is not valid', () => {
                visibilityObjTest.leftFormFieldId = '';
                visibilityObjTest.leftRestResponseId = '';
                visibilityObjTest.operator = '!=';
                let isVisible = service.getVisiblityForField(formTest, visibilityObjTest);

                expect(isVisible).toBeTruthy();
            });

            it('should not change the isVisible if field does not have visibility condition', () => {
                jsonFieldFake.visibilityCondition = null;
                let fakeFormField: FormFieldModel = new FormFieldModel(fakeFormWithField, jsonFieldFake);
                fakeFormField.isVisible = false;
                service.refreshVisibilityForField(fakeFormField);

                expect(fakeFormField.isVisible).toBeFalsy();
            });

            it('should be able to retrieve the value of a form variable', () => {
                let varValue = service.getValueFromVariable(fakeForm, 'FORM_VARIABLE_TEST', null);

                expect(varValue).not.toBeUndefined();
                expect(varValue).toBe('form_value_test');
            });

            it('should retrieve the value for the left field when it is a form variable', () => {
                visibilityObjTest.leftRestResponseId = 'FORM_VARIABLE_TEST';
                let leftValue = service.getLeftValue(fakeForm, visibilityObjTest);

                expect(leftValue).not.toBeNull();
                expect(leftValue).toBe('form_value_test');
            });

            it('should determine visibility for dropdown on label condition', () => {
                let dropdownValue = service.getDropDownValueForLabel(formTest.values, 'dropdown_LABEL');

                expect(dropdownValue).not.toBeNull();
                expect(dropdownValue).toBeDefined();
                expect(dropdownValue).toBe('dropdown_label');
            });

            it('should be able to get the value for a dropdown filtered with Label', () => {
                let dropdownValue = service.getValueFromFormValues(formTest.values, 'dropdown_LABEL');

                expect(dropdownValue).not.toBeNull();
                expect(dropdownValue).toBeDefined();
                expect(dropdownValue).toBe('dropdown_label');
            });

            it('should be able to get the value for a standard field', () => {
                let dropdownValue = service.getValueFromFormValues(formTest.values, 'test_2');

                expect(dropdownValue).not.toBeNull();
                expect(dropdownValue).toBeDefined();
                expect(dropdownValue).toBe('value_2');
            });

            it('should get the dropdown label value from a form', () => {
                let dropdownValue = service.getValueOField(formTest, 'dropdown_LABEL');

                expect(dropdownValue).not.toBeNull();
                expect(dropdownValue).toBeDefined();
                expect(dropdownValue).toBe('dropdown_label');
            });

            it('should get the dropdown id value from a form', () => {
                let dropdownValue = service.getValueOField(formTest, 'dropdown');

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
                service.refreshVisibilityForField(fakeFormField);

                expect(fakeFormField.isVisible).toBeTruthy();
            });

            it('should be able to evaluate condition with a dropdown <id>', () => {
                visibilityObjTest.leftFormFieldId = 'test_4';
                visibilityObjTest.operator = '==';
                visibilityObjTest.rightFormFieldId = 'dropdown';
                let fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
                service.refreshVisibilityForField(fakeFormField);

                expect(fakeFormField.isVisible).toBeTruthy();
            });

            it('should be able to get value from form values', () => {
                let res = service.getFieldValue(formTest.values, 'test_1');

                expect(res).not.toBeNull();
                expect(res).toBeDefined();
                expect(res).toBe('value_1');
            });
        });
    });
});
