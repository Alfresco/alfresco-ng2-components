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

import { ValidateFormFieldEvent } from './../../../events/validate-form-field.event';
import { FormService } from './../../../services/form.service';
import { ContainerModel } from './container.model';
import { FormFieldTypes } from './form-field-types';
import { FORM_FIELD_VALIDATORS, FormFieldValidator } from './form-field-validator';
import { FormFieldModel } from './form-field.model';
import { FormOutcomeModel } from './form-outcome.model';
import { FormModel } from './form.model';
import { TabModel } from './tab.model';

describe('FormModel', () => {
    let formService: FormService;

    beforeEach(() => {
        formService = new FormService(null, null, null);
    });

    it('should store original json', () => {
        const json = {
            id: '<id>',
            name: '<name>'
        };
        const form = new FormModel(json);
        expect(form.json).toBe(json);
    });

    it('should setup properties with json', () => {
        const json = {
            id: '<id>',
            name: '<name>',
            taskId: '<task-id>',
            taskName: '<task-name>'
        };
        const form = new FormModel(json);

        Object.keys(json).forEach((key) => {
            expect(form[key]).toEqual(form[key]);
        });
    });

    it('should take form name when task name is missing', () => {
        const json = {
            id: '<id>',
            name: '<name>'
        };
        const form = new FormModel(json);
        expect(form.taskName).toBe(json.name);
    });

    it('should use fallback value for task name', () => {
        const form = new FormModel({});
        expect(form.taskName).toBe(FormModel.UNSET_TASK_NAME);
    });

    it('should set readonly state from params', () => {
        const form = new FormModel({}, null, true);
        expect(form.readOnly).toBeTruthy();
    });

    it('should check tabs', () => {
        const form = new FormModel();

        form.tabs = null;
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [];
        expect(form.hasTabs()).toBeFalsy();

        form.tabs = [new TabModel(null)];
        expect(form.hasTabs()).toBeTruthy();
    });

    it('should check fields', () => {
        const form = new FormModel();

        form.fields = null;
        expect(form.hasFields()).toBeFalsy();

        form.fields = [];
        expect(form.hasFields()).toBeFalsy();

        const field = new FormFieldModel(form);
        form.fields = [new ContainerModel(field)];
        expect(form.hasFields()).toBeTruthy();
    });

    it('should check outcomes', () => {
        const form = new FormModel();

        form.outcomes = null;
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [];
        expect(form.hasOutcomes()).toBeFalsy();

        form.outcomes = [new FormOutcomeModel(null)];
        expect(form.hasOutcomes()).toBeTruthy();
    });

    it('should parse tabs', () => {
        const json = {
            tabs: [
                { id: 'tab1' },
                { id: 'tab2' }
            ]
        };

        const form = new FormModel(json);
        expect(form.tabs.length).toBe(2);
        expect(form.tabs[0].id).toBe('tab1');
        expect(form.tabs[1].id).toBe('tab2');
    });

    it('should parse fields', () => {
        const json = {
            fields: [
                {
                    id: 'field1',
                    type: FormFieldTypes.CONTAINER
                },
                {
                    id: 'field2',
                    type: FormFieldTypes.CONTAINER
                }
            ]
        };

        const form = new FormModel(json);
        expect(form.fields.length).toBe(2);
        expect(form.fields[0].id).toBe('field1');
        expect(form.fields[1].id).toBe('field2');
    });

    it('should parse fields from the definition', () => {
        const json = {
            fields: null,
            formDefinition: {
                fields: [
                    {
                        id: 'field1',
                        type: FormFieldTypes.CONTAINER
                    },
                    {
                        id: 'field2',
                        type: FormFieldTypes.CONTAINER
                    }
                ]
            }
        };

        const form = new FormModel(json);
        expect(form.fields.length).toBe(2);
        expect(form.fields[0].id).toBe('field1');
        expect(form.fields[1].id).toBe('field2');
    });

    it('should convert missing fields to empty collection', () => {
        const json = {
            fields: null
        };

        const form = new FormModel(json);
        expect(form.fields).toBeDefined();
        expect(form.fields.length).toBe(0);
    });

    it('should put fields into corresponding tabs', () => {
        const json = {
            tabs: [
                { id: 'tab1' },
                { id: 'tab2' }
            ],
            fields: [
                { id: 'field1', tab: 'tab1', type: FormFieldTypes.CONTAINER },
                { id: 'field2', tab: 'tab2', type: FormFieldTypes.CONTAINER },
                { id: 'field3', tab: 'tab1', type: FormFieldTypes.DYNAMIC_TABLE },
                { id: 'field4', tab: 'missing-tab', type: FormFieldTypes.DYNAMIC_TABLE }
            ]
        };

        const form = new FormModel(json);
        expect(form.tabs.length).toBe(2);
        expect(form.fields.length).toBe(4);

        const tab1 = form.tabs[0];
        expect(tab1.fields.length).toBe(2);
        expect(tab1.fields[0].id).toBe('field1');
        expect(tab1.fields[1].id).toBe('field3');

        const tab2 = form.tabs[1];
        expect(tab2.fields.length).toBe(1);
        expect(tab2.fields[0].id).toBe('field2');
    });

    it('should create standard form outcomes', () => {
        const json = {
            fields: [
                { id: 'container1' }
            ]
        };

        const form = new FormModel(json);
        expect(form.outcomes.length).toBe(3);

        expect(form.outcomes[0].id).toBe(FormModel.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe(FormModel.COMPLETE_OUTCOME);
        expect(form.outcomes[1].isSystem).toBeTruthy();

        expect(form.outcomes[2].id).toBe(FormModel.START_PROCESS_OUTCOME);
        expect(form.outcomes[2].isSystem).toBeTruthy();
    });

    it('should create outcomes only when fields available', () => {
        const json = {
            fields: null
        };
        const form = new FormModel(json);
        expect(form.outcomes.length).toBe(0);
    });

    it('should use custom form outcomes', () => {
        const json = {
            fields: [
                { id: 'container1' }
            ],
            outcomes: [
                { id: 'custom-1', name: 'custom 1' }
            ]
        };

        const form = new FormModel(json);
        expect(form.outcomes.length).toBe(2);

        expect(form.outcomes[0].id).toBe(FormModel.SAVE_OUTCOME);
        expect(form.outcomes[0].isSystem).toBeTruthy();

        expect(form.outcomes[1].id).toBe('custom-1');
        expect(form.outcomes[1].isSystem).toBeFalsy();
    });

    it('should raise validation event when validating form', (done) => {
        const form = new FormModel({}, null, false, formService);

        formService.validateForm.subscribe(() => done());
        form.validateForm();
    });

    it('should raise validation event when validating field', (done) => {
        const form = new FormModel({}, null, false, formService);
        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);

        formService.validateFormField.subscribe(() => done());
        form.validateField(field);
    });

    it('should skip field validation when default behaviour prevented', () => {
        const form = new FormModel({}, null, false, formService);

        let prevented = false;

        formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            event.isValid = false;
            event.preventDefault();
            prevented = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(prevented).toBeTruthy();
        expect(form.isValid).toBeFalsy();
        expect(field.validate).not.toHaveBeenCalled();
    });

    it('should validate fields when form validation not prevented', () => {
        const form = new FormModel({}, null, false, formService);

        let validated = false;

        formService.validateForm.subscribe(() => {
            validated = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        spyOn(form, 'getFormFields').and.returnValue([field]);

        form.validateForm();

        expect(validated).toBeTruthy();
        expect(field.validate).toHaveBeenCalled();
    });

    it('should validate field when field validation not prevented', () => {
        const form = new FormModel({}, null, false, formService);

        let validated = false;

        formService.validateFormField.subscribe(() => {
            validated = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(validated).toBeTruthy();
        expect(field.validate).toHaveBeenCalled();
    });

    it('should validate form when field validation not prevented', () => {
        const form = new FormModel({}, null, false, formService);
        spyOn(form, 'validateForm').and.stub();

        let validated = false;

        formService.validateFormField.subscribe(() => {
            validated = true;
        });

        const field: any = {
            validate() {
                return true;
            }
        };
        form.validateField(field);

        expect(validated).toBeTruthy();
        expect(form.validateForm).toHaveBeenCalled();
    });

    it('should not validate form when field validation prevented', () => {
        const form = new FormModel({}, null, false, formService);
        spyOn(form, 'validateForm').and.stub();

        let prevented = false;

        formService.validateFormField.subscribe((event: ValidateFormFieldEvent) => {
            event.preventDefault();
            prevented = true;
        });

        const field = jasmine.createSpyObj('FormFieldModel', ['validate']);
        form.validateField(field);

        expect(prevented).toBeTruthy();
        expect(field.validate).not.toHaveBeenCalled();
        expect(form.validateForm).not.toHaveBeenCalled();
    });

    it('should get field by id', () => {
        const form = new FormModel({}, null, false, formService);
        const field: any = { id: 'field1' };
        spyOn(form, 'getFormFields').and.returnValue([field]);

        const result = form.getFieldById('field1');
        expect(result).toBe(field);
    });

    it('should use custom field validator', () => {
        const form = new FormModel({}, null, false, formService);
        const testField = new FormFieldModel(form, {
            id: 'test-field-1'
        });

        spyOn(form, 'getFormFields').and.returnValue([testField]);

        const validator = <FormFieldValidator> {
            isSupported(): boolean {
                return true;
            },
            validate(): boolean {
                return true;
            }
        };

        spyOn(validator, 'validate').and.callThrough();

        form.fieldValidators = [validator];
        form.validateForm();

        expect(validator.validate).toHaveBeenCalledWith(testField);
    });

    it('should re-validate the field when required attribute changes', () => {
        const form = new FormModel({}, null, false, formService);
        const testField = new FormFieldModel(form, {
            id: 'test-field-1',
            required: false
        });

        spyOn(form, 'getFormFields').and.returnValue([testField]);
        spyOn(form, 'onFormFieldChanged').and.callThrough();
        spyOn(form, 'validateField').and.callThrough();

        testField.required = true;

        expect(testField.required).toBeTruthy();
        expect(form.onFormFieldChanged).toHaveBeenCalledWith(testField);
        expect(form.validateField).toHaveBeenCalledWith(testField);
    });

    it('should not change default validators export', () => {
        const form = new FormModel({}, null, false, formService);
        const defaultLength = FORM_FIELD_VALIDATORS.length;

        expect(form.fieldValidators.length).toBe(defaultLength);
        form.fieldValidators.push(<any> {});

        expect(form.fieldValidators.length).toBe(defaultLength + 1);
        expect(FORM_FIELD_VALIDATORS.length).toBe(defaultLength);
    });

    describe('variables', () => {
        let form: FormModel;

        beforeEach(() => {
            const variables = [
                {
                    'id': 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
                    'name': 'name1',
                    'type': 'string',
                    'value': 'hello'
                },
                {
                    'id': '3ed9f28a-dbae-463f-b991-47ef06658bb6',
                    'name': 'name2',
                    'type': 'date',
                    'value': '29.09.2019'
                },
                {
                    'id': 'booleanVar',
                    'name': 'bool',
                    'type': 'boolean',
                    'value': 'true'
                }
            ];

            const processVariables = [
                {
                    'serviceName': 'denys-variable-mapping-rb',
                    'serviceFullName': 'denys-variable-mapping-rb',
                    'serviceVersion': '',
                    'appName': 'denys-variable-mapping',
                    'appVersion': '',
                    'serviceType': null,
                    'id': 3,
                    'type': 'string',
                    'name': 'variables.name1',
                    'createTime': 1566989626284,
                    'lastUpdatedTime': 1566989626284,
                    'executionId': null,
                    'value': 'hello',
                    'markedAsDeleted': false,
                    'processInstanceId': '1be4785f-c982-11e9-bdd8-96d6903e4e44',
                    'taskId': '1beab9f6-c982-11e9-bdd8-96d6903e4e44',
                    'taskVariable': true
                },
                {
                    'serviceName': 'denys-variable-mapping-rb',
                    'serviceFullName': 'denys-variable-mapping-rb',
                    'serviceVersion': '',
                    'appName': 'denys-variable-mapping',
                    'appVersion': '',
                    'serviceType': null,
                    'id': 1,
                    'type': 'boolean',
                    'name': 'booleanVar',
                    'createTime': 1566989626283,
                    'lastUpdatedTime': 1566989626283,
                    'executionId': null,
                    'value': 'true',
                    'markedAsDeleted': false,
                    'processInstanceId': '1be4785f-c982-11e9-bdd8-96d6903e4e44',
                    'taskId': '1beab9f6-c982-11e9-bdd8-96d6903e4e44',
                    'taskVariable': true
                }
            ];

            form = new FormModel({
                variables,
                processVariables
            });
        });

        it('should parse form variables', () => {
            expect(form.variables.length).toBe(3);
            expect(form.variables[0].id).toBe('bfca9766-7bc1-45cc-8ecf-cdad551e36e2');
            expect(form.variables[1].id).toBe('3ed9f28a-dbae-463f-b991-47ef06658bb6');
            expect(form.variables[2].id).toBe('booleanVar');
        });

        it('should find a variable by or name', () => {
            const result1 = form.getFormVariable('bfca9766-7bc1-45cc-8ecf-cdad551e36e2');
            const result2 = form.getFormVariable('name1');

            expect(result1).toEqual(result2);
        });

        it('should not find a variable', () => {
            expect(form.getFormVariable(null)).toBeUndefined();
            expect(form.getFormVariable('')).toBeUndefined();
            expect(form.getFormVariable('missing')).toBeUndefined();
        });

        it('should find a form variable value', () => {
            const result1 = form.getFormVariableValue('name1');
            const result2 = form.getFormVariableValue('bfca9766-7bc1-45cc-8ecf-cdad551e36e2');

            expect(result1).toEqual(result2);
            expect(result1).toEqual('hello');
        });

        it('should convert the date variable value', () => {
            const value = form.getFormVariableValue('name2');
            expect(value).toBe('29.09.2019T00:00:00.000Z');
        });

        it('should convert the boolean variable value', () => {
            const value = form.getFormVariableValue('bool');
            expect(value).toEqual(true);
        });

        it('should not find variable value', () => {
            const value = form.getFormVariableValue('missing');
            expect(value).toBeUndefined();
        });

        it('should find a process variable by form variable name', () => {
            const value = form.getProcessVariableValue('variables.name1');
            expect(value).toBe('hello');
        });

        it('should find a process variable by name', () => {
            const value = form.getProcessVariableValue('booleanVar');
            expect(value).toEqual(true);
        });

        it('should not find a process variable', () => {
            const missing = form.getProcessVariableValue('missing');
            expect(missing).toBeUndefined();
        });
    });
});
